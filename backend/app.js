import express from 'express';

import mongoose from 'mongoose';
import cors from 'cors';
import webRes from './webRes.js';
import llmRes from './llmRes.js';


const app = express();
app.use(cors());    

app.listen(8080, ()=>console.log("Server is running on port: 8080"));

// app.get('/', (req, res)=>res.redirect('/conversation'));
// app.get('/conversation', (req, res, next)=>{
//     res.send("Hello world");
// });

app.get('/conversation', async(req, res, next)=>{
    let userPrompt = 'explain mern stack';
    // let webResults = '';
    // let webResults = await webRes(userPrompt);
    // console.log(webResults);
    let LLM_res = await llmRes(userPrompt);
    res.send(LLM_res);
});