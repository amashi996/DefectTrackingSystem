const express = require('express');
const router = express.Router(); 
const axios = require('axios');
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');

const User = require('../../models/User');
const Achievement = require('../../models/Achievement');

// @route   GET api/achievement/test-ach
// @desc    Test Screen
// @access  Public
router.get('/test-ach', (req, res) => res.json({ msg: 'Achievements Works' }));

// @route   POST api/achievements/addAch
// @desc    Add achievement
// @access  Private (only accessible to users with role='Admin')
router.post(
    '/addAch',
    [
      auth,
      check('achievementName', 'Achievement name is required').notEmpty(),
      check('achievementCode', 'Achievement code is required').notEmpty(),
      check('achievementDesc', 'Achievement description is required').notEmpty(),
      check('achievementType', 'Achievement type is required').notEmpty(),
    ],
    async (req, res) => {
      // Validate user role
      try {
        const user = await User.findById(req.user.id);
  
        if (!user || user.userRole !== 'Admin') {
          return res.status(401).json({
            msg: 'Unauthorized. Only Admins have access to add achievements',
          });
        }
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array(),
          });
        }
  
        const {
          achievementName,
          achievementCode,
          achievementDesc,
          achievementType,
          criteria,
          badgeUrl,
          points,
          level,
          visibility,
          status,
          relatedObject,
          relatedObjectType,
          tags
        } = req.body;
  
        // Check for duplicate achievement name or achievement code
        const existingachievementName = await Achievement.findOne({ achievementName });
        if (existingachievementName){
          return res.status(400).json ({
            msg: 'Achievement with the same name already exist',
          });
        }
  
        const existingachievementCode = await Achievement.findOne({ achievementCode });
        if (existingachievementCode){
          return res.status(400).json ({
            msg: 'Achievement with the same code already exist',
          });
        }
  
        const achievementField = {
          user: req.user.id, // Store the user ID of the person who adds the achievement
          achievementName,
          achievementCode,
          achievementDesc,
          achievementType,
          criteria,
          badgeUrl,
          points,
          level,
          visibility,
          status,
          relatedObject,
          relatedObjectType,
          tags
        };
  
        const achievement = new Achievement(achievementField);
        await achievement.save();
        res.json(achievement);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
);

// @route   PUT api/achievements/updateAch/:id
// @desc    Update achievement
// @access  Private (only accessible to users with role='Admin')
router.put(
  '/updateAch/:achievementId',
  [
    auth,
    checkObjectId('achievementId'),
  ],
  async (req, res) => {
    // Validate user role
    try {
      const user = await User.findById(req.user.id);

      if (!user || user.userRole !== 'Admin') {
        return res.status(401).json({
          msg: 'Unauthorized. Only Admins have access to update achievements',
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      
      const {
        achievementName,
        achievementCode,
        achievementDesc,
        achievementType,
        criteria,
        badgeUrl,
        points,
        level,
        visibility,
        status,
        relatedObject,
        relatedObjectType,
        tags
      } = req.body;

      const achievement = await Achievement.findById(req.params.achievementId);

      if (!achievement) {
        return res.status(404).json({ msg: 'Achievement not found' });
      }

      // Check if user is trying to update all fields simultaneously
      if (achievementName && achievementCode && achievementDesc) {
        return res.status(400).json({
          msg: 'Please add a new achievement instead of updating the existing one.',
        });
      }

      // Check if user is trying to update name or code individually
      if ((achievementName && !achievementCode) || (!achievementName && achievementCode)) {
        return res.status(400).json({
          msg: 'Sorry you cannot update name and code of the achievement individually, change the both at same time',
        });
      }

      // Update the achievement
      if (achievementName && achievementCode) {
        achievement.achievementName = achievementName;
        achievement.achievementCode = achievementCode;
      }
      if (achievementDesc) {
        achievement.achievementDesc = achievementDesc;
      }
      if (achievementType) {
        achievement.achievementType = achievementType;
      }
      if (criteria){
        achievement.criteria = criteria;
      } 
      if (badgeUrl){
        achievement.badgeUrl = badgeUrl;
      }
      if (points){
        achievement.points = points;
      }
      if (level){
        achievement.level = level;
      }
      if (visibility){
        achievement.visibility = visibility;
      }
      if (status){
        achievement.status = status;
      }
      if (relatedObject){
        achievement.relatedObject = relatedObject;
      }
      if (relatedObjectType){
        achievement.relatedObjectType = relatedObjectType;
      }
      if (tags){
        achievement.tags = tags;
      }

      await achievement.save();

      res.json(achievement);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/achievements/deleteAch/:achievementId
// @desc    Delete achievement
// @access  Private (only accessible to users with role='Admin')
router.delete(
  '/deleteAch/:achievementId', 
  auth, 
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user || user.userRole !== 'Admin') {
        return res.status(401).json({
          msg: 'Unauthorized. Only Admins have access to delete achievements',
        });
      }

      const achievement = await Achievement.findById(req.params.achievementId);

      if (!achievement) {
        return res.status(404).json({ msg: 'Achievement not found' });
      }

      await Achievement.deleteOne({ _id: req.params.achievementId });

      res.json({ msg: 'Achievement removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// @route   GET api/achievements
// @desc    Get all achievements
// @access  Public
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.json(achievements);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/achievements/:achievementId
// @desc    Get achievement by ID
// @access  Public
router.get('/:achievementId', async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.achievementId);
    if (!achievement) {
      return res.status(404).json({ msg: 'Achievement not found' });
    }
    res.json(achievement);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Achievement not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;