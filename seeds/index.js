const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Skatepark = require('../models/skatepark');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Skatepark.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Skatepark ({
            author: '62fe5eb8b1ca1087cd0108c1',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam, consectetur quod. Voluptatem aliquam reprehenderit doloribus voluptatibus totam, at et nulla nihil, sequi consequuntur illum quas fugiat sit animi? Tempora, aliquam.',
            price,
            geometry: {
              type: 'Point',
              coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude
             ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/di1hfgryb/image/upload/v1660932158/Blobstacle/x7w4lrfhm61af38jtrs0.jpg',
                  filename: 'Blobstacle/x7w4lrfhm61af38jtrs0',
                },
                {
                  url: 'https://res.cloudinary.com/di1hfgryb/image/upload/v1660932158/Blobstacle/mfdwjqs5mpvbpoceorlj.jpg',
                  filename: 'Blobstacle/mfdwjqs5mpvbpoceorlj',
                },
                {
                  url: 'https://res.cloudinary.com/di1hfgryb/image/upload/v1660932158/Blobstacle/d8kqcp2ax1ue4yzloldh.jpg',
                  filename: 'Blobstacle/d8kqcp2ax1ue4yzloldh',
                }
              ]
        });
        await camp.save();
    }
}

seedDB().then( () => {
    mongoose.connection.close();
})