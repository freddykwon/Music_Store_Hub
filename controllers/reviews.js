const Review = require('../models/review');
const Store = require('../models/stores')

module.exports.createReview = async (req, res) => {
    const store = await Store.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    store.reviews.push(review);
    await review.save()
    await store.save()
    req.flash('success', 'Successfully created new review!');
    res.redirect(`/musicstores/${store._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Store.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', "Successfully deleted review!")
    res.redirect(`/musicstores/${id}`);
}