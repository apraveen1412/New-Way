import OpenAI from 'openai';
import { master_prompt } from "./helper.js";
import dotenv from 'dotenv';

dotenv.config();

export default async function llmRes(userQuery, webResults, req, res){
  // Construct the LLM payload
  const structuredWebResults = JSON.stringify(
    webResults?.raw.map((el, index) => ({
      source_id: index + 1,
      title: el.title,
      url: el.url,
      content: el.content
    }))
  );
  // console.log("Structured web results sent to LLM:", webResults);
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
try {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })
  const response = await client.responses.create({
      model: 'gpt-5.6-luna',
      input: messages, 
      stream: true,
  });
  // console.log(response);
  return response;
} catch (error) {
  console.error("OpenAI request failed:", error.message);
  if (error.cause) console.error("Cause:", error.cause);
  throw new Error(
    `Failed to get a response from the GPT 5.6 Luna. (${error.message})`
  );
}
}
