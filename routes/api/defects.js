const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Defect = require('../../models/Defect');
const User = require('../../models/User');
const Project = require('../../models/Project');
const checkObjectID = require('../../middleware/checkObjectId');

// @route   GET api/defects/
// @desc    Test Screen
// @access  Public
router.get('/test-def', (req,res) => res.json({
    msg: 'Defects Works'
}));

// @route   POST api/defects/
// @desc    Create a defect
// @access  Provate
router.post(
    '/createDefect', 
    [
        auth, 
        check('projectId', 'Project ID is required').notEmpty(),
        check('defectTitle', 'Defect title is required').notEmpty(),
        check('defectDescription', 'Defect description is required').notEmpty(),
        check('defectStatus', 'Defect status is required').isIn(["New", "In Progress", "Resolved", "Failed", "Closed", "Reopen"]),
        check('defectPriority', 'Defect priority is required').isIn(["High", "Medium", "Low"]),
        check('defectSeverity', 'Defect severity is required').isIn(["Critical", "Major", "Minor", "Cosmetic"]),
        check('reportedBy', 'Reported by user ID is required').notEmpty(),
        check('assignedBy', 'Assigned by user ID is required').notEmpty(),
        check('reproduceSteps', 'Reproduce steps are required').notEmpty(),
        check('expectedResult', 'Expected result is required').notEmpty(),
        check('actualResult', 'Actual result is required').notEmpty(),
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json ({
                errors: errors.array()
            });
        }

        try {
            // Get the authenticated user
            const authenticatedUser = await User.findById(req.user.id).select('-password');

            // Check if the reportedBy user ID matches the ID of the authenticated user
            if (req.body.reportedBy !== req.user.id) {
                return res.status(400).json({
                errors: [{ msg: 'Reported by user ID does not match the authenticated user' }]
                });
            }

            // Check if the projectId exists in the Project database
            const project = await Project.findById(req.body.projectId);
            if (!project) {
                return res.status(400).json({
                errors: [{ msg: 'Invalid Project ID' }]
                });
            }

            // Create the defect
            const newDefect = new Defect({
                projectId: req.body.projectId,
                defectTitle: req.body.defectTitle,
                defectDescription: req.body.defectDescription,
                defectStatus: req.body.defectStatus,
                defectPriority: req.body.defectPriority,
                defectSeverity: req.body.defectSeverity,
                reportedBy: req.body.reportedBy,
                assignedBy: req.body.assignedBy,
                reproduceSteps: req.body.reproduceSteps,
                expectedResult: req.body.expectedResult,
                actualResult: req.body.actualResult,
            });

            // Save the defect
            await newDefect.save();

            res.json(newDefect);
        } catch (err){
            console.error(err);
            res.status(500).send('Server Error');
        }
    });


module.exports = router;