const Skatepark = require('../models/skatepark');
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapBoxToken = process.env.MAPBOX_TOKEN;
// const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res, next) => {
    const skateparks = await Skatepark.find({});
    res.render('skateparks/index', { skateparks });
}

module.exports.renderNewForm = (req, res) => {
    res.render('skateparks/new');
}

module.exports.createSkatepark = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.skatepark.location,
        limit: 1
    }).send();
    const skatepark = new Skatepark(req.body.skatepark);
    skatepark.geometry = geoData.body.features[0].geometry;
    skatepark.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    skatepark.author = req.user._id;
    await skatepark.save();
    req.flash('success', 'Successfully made a new skatepark!');
    res.redirect(`/skateparks/${skatepark._id}`);
}

module.exports.showCampground = async (req, res, next) => {
    const skatepark = await Skatepark.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!skatepark) {
        req.flash('error', 'Cannot find that skatepark!');
        return res.redirect('/skateparks');
    }
    res.render('skateparks/show', { skatepark });
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const skatepark = await Skatepark.findById(id);
    if(!skatepark) {
        req.flash('error', 'Cannot find that skatepark!');
        return res.redirect('/skateparks');
    }
    res.render('skateparks/edit', { skatepark });
}

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const skatepark = await Skatepark.findByIdAndUpdate(id, { ...req.body.skatepark });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    skatepark.images.push(...imgs);
    await skatepark.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await skatepark.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated skatepark!');
    res.redirect(`/skateparks/${skatepark._id}`);
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params
    await Skatepark.findByIdAndDelete(id);
    for (let image of skatepark.images) {
        await cloudinary.uploader.destroy(image.filename);
    }
    req.flash('success', 'Successfully deleted skatepark!');
    res.redirect('/skateparks');
}