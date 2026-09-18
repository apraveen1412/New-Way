import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
    userquery: String,
    aiResponse: String,
    // modelType: {
    //     type: String,
    //     enum: ['cloud', 'local'],
    //     required: true,
    // },
    createdAt: String,
    updatedAt: String,
});

export const messages = mongoose.model('messages', messagesSchema);