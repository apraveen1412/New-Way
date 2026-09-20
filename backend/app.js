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


app.post('/api/auth/signup', async (req, res) => {
    try {
        console.log("Signup body:", req.body);
        const { name, email, password } = req.body;
        const newUser = new user({name,email});
        const savedUser = await user.register(newUser, password);
        console.log("User registered:", savedUser);
        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });
    } catch (error) {
        console.error("SIGNUP ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.post('/api/auth/signin', passport.authenticate('local',{ keepSessionInfo: true}), async (req, res) => {
  res.status(201).json({
            success: true,
            message: 'Sign in successfully'
        });
});

app.post('/api/conversation', async(req, res, next)=>{
  console.log('/conversation');
  let newConversation={};
  if(!req.body.conversationId){
    newConversation = new conversation({
      conversationName: req.body.convName,
      // messages: req.body.messages,
    });
    newConversation.save();
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
      try {
        const client = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        })
        const response = await client.responses.create({
            model: 'gpt-5.6-luna',
            input: messages, 
            stream: true,
        });
        
        console.log('Event: \n');
        for await (const event of response){
          if(event.type === 'response.output_text.delta'){
              // console.log(event.delta);
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

app.post('/api/conversation/onDevice', async(req, res, next)=>{
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

