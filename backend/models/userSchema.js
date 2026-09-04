import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    name: String,
    email: String,
    conversation: [{type: mongoose.Schema.Types.ObjectId, ref: 'conversation'}],
});

export const user = mongoose.model('user', userSchema );