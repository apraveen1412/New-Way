import express from 'express';
import OpenAI from 'openai';

import {webRes, master_prompt} from '../helper.js';




// DB models
import {user} from '../models/userSchema.js';
import  { conversation } from '../models/conversationSchema.js';
import { messages } from '../models/messagesSchema.js';

// Authentication
import { isLoggedIn } from '../middleware/authenticate.js';
import HandleDB from '../middleware/dbHandler.js';




const router = express.Router();




// cloud response
router.post('/', isLoggedIn, async(req, res, next)=>{
  const modelName = req.body.model;
  console.log(req.session.passport);
  console.log(req.user);
  console.log("MODEL:", modelName);
  console.log("BODY:", req.body);
  console.log(`/conversation/${modelName}`);
  
  let currUserName = req.session.passport.user;
  let conversationId = req.body.conversationId;
   
  let userPrompt = req.body?.userQuery;
  let fullResponse = '';
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
      const message = [
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
            input: message,
            stream: true,
        });
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
      let DBres = await HandleDB(conversationId, currUserName, userPrompt, fullResponse, modelName);

      // Send conversation ID as the final part of the stream
        res.write(`\n__CONVERSATION_ID__:${DBres._id}`);
      console.log('DB Response: ',DBres);
      console.log('DB Response id: ',DBres._id);
        
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

// local response
router.post('/onDevice',isLoggedIn, async(req, res, next)=>{
  console.log('/conversation/onDevice');
  let currUserName = req.session.passport.user;
  let conversationId = req.body.conversationId;
  console.log(currUserName);
  // HandleDB(conversationId, currUserName);
  if(req.body.userQuery === '') return;
  console.log(req.body);
  let userPrompt = req.body?.userQuery;
  let webResults = await webRes(userPrompt);
  res.send(webResults);
});

export default router;