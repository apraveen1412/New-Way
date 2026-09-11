import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {webRes, master_prompt} from './helper.js';
// import llmRes from './llmRes.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';



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
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.listen(8080, ()=>console.log("Server is running on port: 8080"));


app.post('/conversation', async(req, res, next)=>{
    console.log('/conversation');
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
                console.log(event.delta);
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

app.post('/conversation/onDevice', async(req, res, next)=>{
    console.log('/conversation/onDevice');
    if(req.body.userQuery === '') return;
    console.log(req.body);
    let userPrompt = req.body?.userQuery;
    let webResults = await webRes(userPrompt);
    // return webResults;
    // res.redirect('http://localhost:5173/', webResults);
    res.send(webResults);
});