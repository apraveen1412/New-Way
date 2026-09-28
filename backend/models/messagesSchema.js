import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
    userquery: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true,
    },
}, {timestamps: true});

export const messages = mongoose.model('messages', messagesSchema);