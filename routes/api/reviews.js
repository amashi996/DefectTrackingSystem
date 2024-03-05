const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Review = require('../../models/Review');
const User = require('../../models/User');
const checkObjectID = require('../../middleware/checkObjectId');

// @route   GET api/reviewa/
// @desc    Test Screen
// @access  Private
router.get('/test-rev', (req,res) => res.json({
    msg: 'Reviews Works'
}));


module.exports = router;