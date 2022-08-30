const Skatepark = require('../models/skatepark');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const skatepark = await Skatepark.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    skatepark.reviews.push(review);
    await review.save();
    await skatepark.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/skateparks/${skatepark._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Skatepark.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/skateparks/${id}`);
}