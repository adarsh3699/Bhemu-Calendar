import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        enum: ['exercise', 'eating', 'work', 'relax', 'family', 'social'],
        default: 'work'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the 'updatedAt' field before saving
goalSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Goal = mongoose.model('Goal', goalSchema);

export default Goal; 