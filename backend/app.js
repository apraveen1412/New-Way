import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { Strategy as localStrategy } from 'passport-local';
import passport from 'passport';
import dns from 'dns'

import {webRes, master_prompt} from './helper.js';




// DB models
import {user} from './models/userSchema.js';
import  { conversation } from './models/conversationSchema.js';
import { messages } from './models/messagesSchema.js';

// Authentication
import { isLoggedIn } from './middleware/authenticate.js';
import HandleDB from './middleware/dbHandler.js';

// routes
import authentication from './routes/authentication.js'
import core from './routes/core.js'
import dbRoutes from './routes/DBroutes.js'

dotenv.config();
dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

const app = express();

async function main(){
    await mongoose.connect(process.env.MONGO_URI);
}

main().then(console.log('Successfully connected to DB'))
.catch((err)=>console.log(err));

app.use(cors({
    origin: "http://localhost:5173"
}));    


// JSON data parsing enabler
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cookieParser());
// Configuring express session and mongo session store
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        }),

        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    })
);


app.use(passport.initialize()); // Initializes passport middleware
app.use(passport.session()); // Recognizes users through navigation

passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser()); // storing all the info about the user in session is known as serialize
passport.deserializeUser(user.deserializeUser()); // removing all the info about the user in session is known as deserialize

app.listen(8080, ()=>console.log("Server is running on port: 8080"));

app.use('/api/auth', authentication);
app.use('/api/conversation', core);
app.use('/api/db', dbRoutes);