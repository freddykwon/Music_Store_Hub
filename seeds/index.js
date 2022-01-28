const mongoose = require('mongoose');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Stores = require('../models/stores');
const stores = require('../models/stores');

mongoose.connect('mongodb://localhost:27017/music-stores', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Stores.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const store = new Stores({
            author: '61e509fcee0d2e280349621e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)} `,
            images: [
                {
                    url: 'https://res.cloudinary.com/da2rikqng/image/upload/v1643232071/MusicStoreHub/tysgia4dcssz0dvbdiry.jpg',
                    filename: 'MusicStoreHub/tysgia4dcssz0dvbdiry',
                },
                {
                    url: 'https://res.cloudinary.com/da2rikqng/image/upload/v1643232071/MusicStoreHub/a3qzvdhhoxng1i9fksxt.jpg',
                    filename: 'MusicStoreHub/a3qzvdhhoxng1i9fksxt',
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro vitae at tempora molestiae repellendus delectus vel illo. Ipsam quidem laborum labore cum, veniam, odit nemo dolor quasi saepe obcaecati dolores?'
        })
        await store.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})