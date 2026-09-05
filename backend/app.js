import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {webRes} from './helper.js';
import llmRes from './llmRes.js';

// DB models
import {user} from './models/userSchema.js';
import  { conversation } from './models/conversationSchema.js';
import { messages } from './models/messagesSchema.js';



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
        let LLM_res = await llmRes(userPrompt, webResults);
        
         // Tells the browser this is a streaming response
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        for await (const chunk of LLM_res) {

            const text = chunk?.message?.content;

            if (text) {
                res.write(text);
            }
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