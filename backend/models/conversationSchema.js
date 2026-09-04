import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    conversationName: String,
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'messages'}],
});

export const conversation = mongoose.model('conversation', conversationSchema );