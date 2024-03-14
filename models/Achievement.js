const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AchievementSchema = new Schema ({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    achievementName: {
        type: String,
        required: true
    },
    achievementCode: {
        type: String,
        required: true
    },
    achievementDesc: {
        type: String,
        required: true
    }, 
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Achievement', AchievementSchema);