const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const musicstoresSchema = new Schema({
    title: String,
    image: String,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

module.exports = mongoose.model('Store', musicstoresSchema);

