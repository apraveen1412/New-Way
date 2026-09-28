import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    conversationName: {
        type: String,
        required: true,
    },
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'messages'}],
});

export const conversation = mongoose.model('conversation', conversationSchema );