import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
    userquery: String,
    aiResponse: String,
    followUps: [String],
    modelType: {
        type: String,
        enum: ['cloud', 'local'],
        required: true,
    },
});

export const messages = mongoose.model('messages', messagesSchema);