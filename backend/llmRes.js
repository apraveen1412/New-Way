import ollama from 'ollama';
// import cors from 'cors';
import { master_prompt } from "./helper.js";
import webRes from './webRes.js';

// app.use(cors());  
export default async function llmRes(userQuery){
  let webResults = await webRes(userQuery);
  // Construct the LLM payload
  const messages = [
    { 
      role: "system", 
      content: master_prompt 
    },
    { 
      role: "user", 
      content: `USER QUERY:\n${userQuery}\n\nWEB SEARCH RESULTS:\n${webResults}` 
    }
  ];
  const response = await ollama.chat({
      model: 'llama3.1:8b',
      messages, 
  });
  console.log(response);

    
}
