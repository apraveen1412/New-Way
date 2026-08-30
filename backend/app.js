import express from 'express';

import mongoose from 'mongoose';
import cors from 'cors';
import webRes from './webRes.js';
import llmRes from './llmRes.js';


const app = express();
app.use(cors());    
app.use(express.urlencoded({extended: true}));

app.listen(8080, ()=>console.log("Server is running on port: 8080"));

// app.get('/', (req, res)=>res.redirect('/conversation'));
// app.get('/conversation', (req, res, next)=>{
//     res.send("Hello world");
// });

app.post('/conversation', async(req, res, next)=>{
    console.log(req.body);
    let userPrompt = req.body.userQuery;
    let webResults = await webRes(userPrompt);
    // console.log(webResults);
    let LLM_res = await llmRes(userPrompt, webResults);
    res.send(LLM_res);
});