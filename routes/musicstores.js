const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Store = require('../models/stores')
const { storeSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware')

const validateStore = (req, res, next) => {
    const { error } = storeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const musicstores = await Store.find({});
    res.render('musicstores/index', { musicstores })
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('musicstores/new');
})

router.post('/', isLoggedIn, validateStore, catchAsync(async (req, res, next) => {
    req.flash('success', "Successfully added a new store!")
    const store = new Store(req.body.store)
    await store.save();
    res.redirect(`/musicstores/${store._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.id).populate('reviews');
    if (!store) {
        req.flash('error', 'Cannot find that store!')
        return res.redirect('/musicstores');
    }
    // console.log(store.location)
    res.render('musicstores/show', { store });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.id)
    res.render('musicstores/edit', { store });
}))

router.put('/:id', isLoggedIn, validateStore, catchAsync(async (req, res) => {
    const { id } = req.params;
    const store = await Store.findByIdAndUpdate(id, { ...req.body.store })
    req.flash('success', 'Successfully updated store!')
    res.redirect(`/musicstores/${store._id}`)
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Store.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted store!')
    res.redirect('/musicstores');
}));


module.exports = router;