const express = require('express');
const router = express.Router();
const skateparks = require('../controllers/skateparks');
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, isSkateparkAuthor, validateSkatepark } = require('../middleware');

const Skatepark = require('../models/skatepark');

router.route('/')
    .get(catchAsync(skateparks.index))
    .post(isLoggedIn, upload.array('image'), validateSkatepark, catchAsync(skateparks.createSkatepark))

router.get('/new', isLoggedIn, skateparks.renderNewForm)

router.route('/:id')
    .get(catchAsync(skateparks.showSkateparks))
    .put(isLoggedIn, isSkateparkAuthor, upload.array('image'), validateSkatepark, catchAsync(skateparks.updateSkatepark))
    .delete(isLoggedIn, isSkateparkAuthor, catchAsync(skateparks.deleteSkatepark))

router.get('/:id/edit', isLoggedIn, isSkateparkAuthor, catchAsync(skateparks.renderEditForm))

module.exports = router;