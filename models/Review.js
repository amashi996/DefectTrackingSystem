const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    reviewText: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    reviewDate: {
        type: Date,
        default: Date.now
    },
    likes: [
        {
            user:{
                type: Schema.Types.ObjectId
            }
        }
    ]
});

module.exports = mongoose.model('reviews', ReviewSchema);