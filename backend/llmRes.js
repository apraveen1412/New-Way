import ollama from 'ollama';
import { master_prompt } from "./helper.js";

export default async function llmRes(userQuery, webResults){
  // let webResults = await webRes(userQuery);
  // Construct the LLM payload
  const structuredWebResults = JSON.stringify(
    webResults?.raw.map((el, index) => ({
      source_id: index + 1,
      title: el.title,
      url: el.url,
      content: el.content
    }))
  );
  console.log("Structured web results sent to LLM:", webResults);
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
    const response = await ollama.chat({
        model: 'llama3.1:8b',
        messages, 
    });
    console.log(response);
    return response;
  } catch (error) {
    // Node's fetch wraps connection-level failures (server not running, wrong
    // port, etc.) as a generic "TypeError: fetch failed" and hides the real
    // reason in error.cause. Surface it so it actually shows up in the logs.
    console.error("Ollama request failed:", error.message);
    if (error.cause) console.error("Cause:", error.cause);
    throw new Error(
      `Failed to get a response from the local LLM. Is 'ollama serve' running and is 'llama3.1:8b' pulled? (${error.message})`
    );
  }
}
