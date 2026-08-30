import ollama from 'ollama';
import { master_prompt } from "./helper.js";
import webRes from './webRes.js';

export default async function llmRes(userQuery, webResults){
  // let webResults = await webRes(userQuery);
  // Construct the LLM payload
  const structuredWebResults = JSON.stringify(
    webResults.raw.map((el, index) => ({
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
      content: `USER QUERY:\n${userQuery}\n\nWEB SEARCH RESULTS:\n${structuredWebResults}` 
    }
  ];
  const response = await ollama.chat({
      model: 'llama3.1:8b',
      messages, 
  });
  console.log(response);
}
