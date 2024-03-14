const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AchievementSchema = new Schema ({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    achievementName: {
        type: String,
        required: true
    },
    achievementCode: {
        type: String,
        required: true,
        unique: true
    },
    achievementDesc: {
        type: String,
        required: true
    },
    achievementType: {
        // Added achievementType field to categorize achievements based on their type
        type: String,
        required: true
    },
    criteria: {
        // Introduced a flexible criteria field to store various criteria based on the type of achievement. This can hold different types of data depending on the specific achievement requirements.
        type: Schema.Types.Mixed // This can hold various criteria based on achievement type
    },
    badgeUrl: {
        // Included badgeUrl field to store the URL or path to the badge/icon image associated with the achievement
        type: String
    },
    points: {
        // Added points and level fields to support a point-based or leveling system for achievements
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    visibility: {
        // Included visibility field to specify the visibility of achievements (public or private)
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    status: {
        // Added status field to track the status of achievements (earned, in progress, locked)
        type: String,
        enum: ['earned', 'in_progress', 'locked'],
        default: 'locked'
    },
    relatedObject: {
        // Introduced relatedObject and relatedObjectType fields to reference the related object (e.g., bug report ID) and dynamically determine the model to reference
        type: Schema.Types.ObjectId, // Reference to the related object (e.g., bug report ID)
        refPath: 'relatedObjectType'
    },
    relatedObjectType: {
        type: String // Dynamically determine the model to reference (e.g., 'Bug' or 'Feedback')
    },
    tags: {
        // Added tags field to facilitate searching, filtering, and categorization of achievements
        type: [String]
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Achievement', AchievementSchema);
