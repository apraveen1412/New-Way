import dotenv from "dotenv";
import {tavily} from '@tavily/core';


dotenv.config();
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export default async function webRes(userQuery){

    try {
    // Execute the search
    const response = await tvly.search(userQuery, {
      searchDepth: "basic", // "basic" is faster, "advanced" scrapes deeper
      maxResults: 5,        // Keep this low to avoid exceeding LLM context windows
      includeAnswer: false, // We use our own LLM to generate the answer
      includeDomains: [],   // Optional: restrict to specific sites (e.g., ["wikipedia.org"])
      excludeDomains: []    // Optional: block specific sites
    });

    // Format the raw results for LLM Prompt
    const formattedResults = response.results.map((result, index) => {
      return `[${index + 1}] ${result.title} (${result.url}): ${result.content}`;
    }).join('\n\n');

    return {
      raw: response.results, // Send this to the React frontend to display clickable links
      formattedForLLM: formattedResults // Inject this into Master Prompt
    };

  } catch (error) {
    console.error("Tavily Search Error:", error);
    throw new Error("Failed to fetch web search results.");
  }
}
