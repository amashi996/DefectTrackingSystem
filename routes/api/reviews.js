const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Review = require('../../models/Review');
const User = require('../../models/User');
const checkObjectID = require('../../middleware/checkObjectId');

// @route   GET api/reviews/
// @desc    Test Screen
// @access  Private
router.get('/test-rev', (req,res) => res.json({
    msg: 'Reviews Works'
}));

// @route   POST api/reviews/
// @desc    Add a review for selected user
// @access  Private
router.post(
    '/addRev/:userId',
    auth,
    check('reviewText', 'Review is required').notEmpty(),
    checkObjectID('userId'),
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            });
        }

        try{
            const user = await User.findById(req.params.userId).select('-password');

            if(!user){
                return res.status(404).json({
                    msg: 'User not found'
                });
            }

            const newReview = new Review({
                user: req.params.userId,
                reviewText: req.body.reviewText,
                name: req.user.name,
                avatar: req.user.avatar
            });

            const review = await newReview.save();
            res.json(review);

        }catch(err){
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
);

// @route   PUT api/reviews/like/:reviewId
// @desc    Like a review
// @access  Private
router.put('/like/:reviewId', auth, checkObjectID('reviewId'), async (req, res) => {
    try {
      const review = await Review.findById(req.params.reviewId);
  
      // Check if the review has already been liked
      if (review.likes.some((like) => like.user.toString() === req.user.id)) 
        return res.status(400).json({ msg: 'Review already liked' });
      
  
      review.likes.unshift({ user: req.user.id });
  
      await review.save();
  
      return res.json(review.likes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// @route    PUT api/reviews/unlike/:reviewId
// @desc     Unlike a review
// @access   Private
router.put('/unlike/:reviewId', auth, checkObjectID('reviewId'), async (req, res) => {
    try {
      const review = await Review.findById(req.params.reviewId);
  
      // Check if the review has not yet been liked
      if (!review.likes.some((like) => like.user.toString() === req.user.id)) {
        return res.status(400).json({ msg: 'Review has not yet been liked' });
      }
  
      // Remove the like
      review.likes = review.likes.filter(
        ({ user }) => user.toString() !== req.user.id
      );
  
      await review.save();
  
      return res.json(review.likes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
module.exports = router;