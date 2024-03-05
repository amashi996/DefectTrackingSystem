const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const consfig = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
//const normalize = require('normalize-url');

const Uesr = require('../../models/Review');

// @route   GET api/reviewa/
// @desc    Test Screen
// @access  Private
router.get('/test-rev', (req,res) => res.json({
    msg: 'Reviews Works'
}));


module.exports = router;