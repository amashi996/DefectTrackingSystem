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

// @route   POST api/defects/createDefect
// @desc    Create a defect
// @access  Private
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
        check('reproduceSteps', 'Reproduce steps are required').notEmpty(),
        check('expectedResult', 'Expected result is required').notEmpty(),
        check('actualResult', 'Actual result is required').notEmpty(),
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Identify the project title based on the project ID
            const project = await Project.findById(req.body.projectId);
            if (!project) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Project ID' }] });
            }

            // Get the authenticated user
            const user = await User.findById(req.user.id).select('-password');

            // Create the defect
            const newDefect = new Defect({
                projectId: req.body.projectId,
                projectTitle: project.projectName,
                defectTitle: req.body.defectTitle,
                defectDescription: req.body.defectDescription,
                defectStatus: req.body.defectStatus,
                defectPriority: req.body.defectPriority,
                defectSeverity: req.body.defectSeverity,
                reportedBy: user.id, // Assign reportedBy from authenticated user
                assignedTo: req.body.assignedTo, // Assuming assignedTo also from authenticated user
                reproduceSteps: req.body.reproduceSteps,
                expectedResult: req.body.expectedResult,
                actualResult: req.body.actualResult,
            });

            // Save the defect
            await newDefect.save();

            res.json(newDefect);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
);

// @route   PUT api/defects/updateDefect/:defectId
// @desc    Update basic defect details
// @access  Private
router.put(
    '/updateDefect/:defectId',
    [
        auth,
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { projectId, defectTitle, defectDescription, defectPriority, defectSeverity, reproduceSteps, expectedResult, actualResult } = req.body;

        try {
            const defect = await Defect.findById(req.params.defectId);

            if (!defect) {
                return res.status(404).json({ msg: 'Defect not found' });
            }

            // Update defect fields if they exist in the request body
            if (projectId) defect.projectId = projectId;
            if (defectTitle) defect.defectTitle = defectTitle;
            if (defectDescription) defect.defectDescription = defectDescription;
            if (defectPriority) defect.defectPriority = defectPriority;
            if (defectSeverity) defect.defectSeverity = defectSeverity;
            if (reproduceSteps) defect.reproduceSteps = reproduceSteps;
            if (expectedResult) defect.expectedResult = expectedResult;
            if (actualResult) defect.actualResult = actualResult;
            defect.modifiedDate = new Date();

            await defect.save();

            res.json(defect);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   PUT api/defects/updateStatus/:defectId
// @desc    Update defect status
// @access  Private
router.put(
    '/updateStatus/:defectId',
    [
        auth,
        check('defectStatus', 'Defect status is required').isIn(["New", "In Progress", "Resolved", "Failed", "Closed", "Reopen"])
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { defectStatus } = req.body;

        try {
            const defect = await Defect.findById(req.params.defectId);

            if (!defect) {
                return res.status(404).json({ msg: 'Defect not found' });
            }

            // Update defect status
            defect.defectStatus = defectStatus;
            
            if (defectStatus === "Resolved") {
                // Update resolvedDate to current date if status is "Resolved"
                defect.resolvedDate = new Date();
            }

            if (defectStatus === "Closed") {
                // Update resolvedDate to current date if status is "Resolved"
                defect.closedDate = new Date();
            }

            // Update modifiedDate regardless of status change
            defect.modifiedDate = new Date();

            await defect.save();

            res.json(defect);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   PUT api/defects/updateAssignedTo/:defectId
// @desc    Update assignedTo field of a defect
// @access  Private
router.put(
    '/updateAssignedTo/:defectId',
    [
        auth,
        check('assignedTo', 'AssignedTo user ID is required').notEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { assignedTo } = req.body;

        try {
            const defect = await Defect.findById(req.params.defectId);

            if (!defect) {
                return res.status(404).json({ msg: 'Defect not found' });
            }

            // Update assignedTo field
            defect.assignedTo = assignedTo;
            defect.modifiedDate = new Date();

            await defect.save();

            res.json(defect);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);


module.exports = router;