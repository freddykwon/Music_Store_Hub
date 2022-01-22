const express = require('express');
const router = express.Router();
const musicstores = require('../controllers/musicstores')
const catchAsync = require('../utils/catchAsync');
const Store = require('../models/stores')
const { isLoggedIn, isAuthor, validateStore } = require('../middleware')

router.route('/')
    .get(catchAsync(musicstores.index))
    .post(isLoggedIn, validateStore, catchAsync(musicstores.createStore))

router.get('/new', isLoggedIn, musicstores.renderNewForm)

router.route('/:id')
    .get(catchAsync(musicstores.showStore))
    .put(isLoggedIn, isAuthor, validateStore, catchAsync(musicstores.updateStore))
    .delete(isLoggedIn, isAuthor, catchAsync(musicstores.deleteStore))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(musicstores.renderEditForm))

module.exports = router;

