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

import {webRes, master_prompt} from './helper.js';




// DB models
import {user} from './models/userSchema.js';
import  { conversation } from './models/conversationSchema.js';
import { messages } from './models/messagesSchema.js';

// Authentication
import { isLoggedIn } from './middleware/authenticate.js';


dotenv.config();

const app = express();

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/newway');
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
            mongoUrl: 'mongodb://127.0.0.1:27017/newway'
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


app.post('/api/auth/signup', async (req, res, next) => {
    try {
        let { name, email, password } = req.body;
        if(typeof name === 'string' && typeof email === 'string' && typeof password === 'string'){
          name = name.trim();
          email = email.trim();
          password = password.trim();
          if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
          }
          const newUser = new user({name,email});
          const savedUser = await user.register(newUser, password);

          req.login(savedUser, (err)=>{
            if(err) return next(err);
            res.status(201).json({
              success: true,
              message: 'User registered successfully',
              user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
              }
            });
          })
        }
        else{
          return res.status(400).json({ success: false, message: 'Invalid input' });
        }
    } catch (error) {
        console.error("SIGNUP ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.post('/api/auth/signin', (req, res, next) => { // Defining passport function
    let {username, password} = req.body;
    if(typeof username === 'string' && typeof password === 'string'){
      username = username.trim();
      password = password.trim();
      if (!username || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }
      passport.authenticate('local', (err, user, info) => {
        if (err) { // operational errors like DB failures, session failure and more
            return next(err);
        }
        if (!user) { // Handles errors of user credentials being falsy 
            return res.status(401).json({
                success: false,
                message: info?.message || 'Invalid email or password'
            });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json({
                success: true,
                message: 'Sign in successful'
            });
        });

      })(req, res, next); // Executing the passport middleware in the current req res cycle.
    }
    else{
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
});

app.get('/api/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  });
});


app.post('/api/conversation/', isLoggedIn, async(req, res, next)=>{
  const modelName = req.body.model;
  console.log(req.session.passport);
  console.log(req.user);
  console.log("MODEL:", modelName);
  console.log("BODY:", req.body);
  console.log(`/conversation/${modelName}`);
  let newConversation={};
  console.log(req.body);
  let currUser = req.session.passport.user;
  if(req.body.conversationId === ''){
    newConversation = new conversation({
      conversationName: req.body.userQuery,
      // messages: req.body.messages,
    });
    
    // newConversation.save();
  }
  let userPrompt = req.body?.userQuery;
  try {
      let webResults = await webRes(userPrompt);
      const structuredWebResults = JSON.stringify(
        webResults?.raw.map((el, index) => ({
          source_id: index + 1,
          title: el.title,
          url: el.url,
          content: el.content
        }))
      );
      const messages = [
        { 
          role: "system", 
          content: master_prompt 
        },
        { 
          role: "user", 
          content: `USER QUERY:\n${userPrompt}\n\nWEB SEARCH RESULTS:\n${structuredWebResults}` 
        }
      ];
      // Tells the browser this is a streaming response
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Transfer-Encoding', 'chunked');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      let answer = '';
      try {
        const client = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        })
        const response = await client.responses.create({
            model: `${modelName}`,
            input: messages,
            stream: true,
        });
        let fullResponse = '';
        for await (const event of response){
          if(event.type === 'response.output_text.delta'){
              fullResponse += event.delta;
              
              res.write(event.delta);
          }
        }
      } catch (error) {
        console.error("OpenAI request failed:", error.message);
        if (error.cause) console.error("Cause:", error.cause);
        throw new Error(
          `Failed to get a response from the GPT 5.6 Luna. (${error.message})`
        );
      }
        
      // Tells frontend that stream is finished
      res.end();
      
  } catch (error) {
      console.error("/conversation failed:", error.message);
      if (!res.headersSent) {
          res.status(500).json({
              error: error.message
          });
      } else {
          res.end();
      }
  }
});


app.post('/api/conversation/onDevice',isLoggedIn, async(req, res, next)=>{
  console.log(req.session.user);
  let newConversation={};
  if(!req.body.conversationExist){
    newConversation = new conversation({
      conversationName: req.body.convName,
      messages: req.body.messages,
    });
    newConversation.save();
  }
  console.log('/conversation/onDevice');
  if(req.body.userQuery === '') return;
  console.log(req.body);
  let userPrompt = req.body?.userQuery;
  let webResults = await webRes(userPrompt);
  res.send(webResults);
});

