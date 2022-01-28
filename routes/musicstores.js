const express = require('express');
const router = express.Router();
const musicstores = require('../controllers/musicstores');
const catchAsync = require('../utils/catchAsync');
const Store = require('../models/stores');
const { isLoggedIn, isAuthor, validateStore } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })


router.route('/')
    .get(catchAsync(musicstores.index))
    .post(isLoggedIn, upload.array('image'), validateStore, catchAsync(musicstores.createStore))

router.get('/new', isLoggedIn, musicstores.renderNewForm)

router.route('/:id')
    .get(catchAsync(musicstores.showStore))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateStore, catchAsync(musicstores.updateStore))
    .delete(isLoggedIn, isAuthor, catchAsync(musicstores.deleteStore))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(musicstores.renderEditForm))

module.exports = router;
