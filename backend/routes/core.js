import express from 'express';
import OpenAI from 'openai';

import {webRes, master_prompt} from '../helper.js';

// Authentication
import { isLoggedIn } from '../middleware/authenticate.js';
import HandleDB from '../middleware/dbHandler.js';

// Validation
import { modelSchema } from '../middleware/joiValidation.js';
import { validate } from '../middleware/validate.js';

import { convNamer } from '../helper.js';

// models
import { conversation } from '../models/conversationSchema.js';

const router = express.Router();


// cloud response
router.post('/', isLoggedIn, validate(modelSchema), async(req, res, next)=>{
  const modelName = req.body.model;
//   console.log(req.session.passport);
//   console.log(req.user);
//   console.log("MODEL:", modelName);
//   console.log("BODY:", req.body);
//   console.log(`/conversation/${modelName}`);
  
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
      const DBres = await HandleDB( conversationId, currUserName, userPrompt, fullResponse, modelName);

      // console.log('DB Response:', DBres);

      res.write(`\n__CONVERSATION_ID__:${DBres}`);

      res.end();
      
  } catch (error) {
    //   console.error("/conversation failed:", error.message);
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
router.post('/onDevice',isLoggedIn, validate(modelSchema), async(req, res, next)=>{
//   console.log('/conversation/onDevice');
  let currUserName = req.session.passport.user;
  let conversationId = req.body.conversationId;
  let newConv = {};
  let savedConv = {};
  if(conversationId === ''){
    newConv = new conversation({
      conversationName: convNamer(req.body.userQuery)
    })
    savedConv = await newConv.save();
  }
  else{
    savedConv = {_id: conversationId}
  }
  console.log(req.body);
  console.log(savedConv);
  // HandleDB(conversationId, currUserName);
  if(req.body.userQuery === '') return;
//   console.log(req.body);
  let userPrompt = req.body?.userQuery;
  let webResults = await webRes(userPrompt);
  res.send({webResults, conversationId: savedConv._id});
});

export default router;