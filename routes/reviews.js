const express = require('express');
const router = express.Router({ mergeParams: true });


const Store = require('../models/stores')
const Review = require('../models/review');

const { reviewSchema } = require('../schemas.js');


const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


router.post('/', validateReview, catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.id);
    const review = new Review(req.body.review);
    store.reviews.push(review);
    await review.save()
    await store.save()
    req.flash('success', 'Successfully created new review!');
    res.redirect(`/musicstores/${store._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Store.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', "Successfully deleted review!")
    res.redirect(`/musicstores/${id}`);
}))

module.exports = router;