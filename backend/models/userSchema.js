import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true, 
    },
    email: {
        type: String
    },

    conversation: [{type: mongoose.Schema.Types.ObjectId, ref: 'conversation'}],
});
userSchema.plugin(
    passportLocalMongoose.default || passportLocalMongoose,
    {usernameField: 'name'}
);
export const user = mongoose.model('user', userSchema );


