import { master_prompt, webRes } from "./components/helper";

export async function onDeviceAI(userQuery, webResults, resStream){
  console.log("AI model loaded");
  console.log(webResults);
  const session = await LanguageModel.create({
    expectedInputs: [
      { type: "text", languages: ["en"] } 
    ],
    expectedOutputs: [
      { type: "text", languages: ["en"] }
    ]
  });
  try{
    
  // console.log(webResults);
  
  console.log('Generating reply...');
  let structuredWebResults = JSON.stringify(
    webResults?.data?.raw.map((el, index) => ({
      source_id: index + 1,
      title: el.title,
      url: el.url,
      content: el.content
    }))
  );
  console.log('webResults: ',webResults)
  // console.log('structuredWebResults: ',structuredWebResults);
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
  // console.log('Messages: ', messages);
  const response = await session.promptStreaming(messages);
  let finalRes='';
  for await(let chunk of response)  {
    finalRes+=chunk;
    resStream(finalRes);
    console.log(finalRes);
  };
  // let temp = JSON.parse(finalRes.slice(8, -3));
  // console.log(temp);
  // console.log('Actual response: ', temp?.answer);
  // resStream(temp?.answer);
  
  let answer = "";

  try {
    // 1. Safely grab the JSON string from the markdown
    const jsonMatch = finalRes.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    // 2. Try the standard JSON parse first
    let temp = JSON.parse(jsonMatch[0]);
    answer = temp.answer;
    
  } catch (e) {
    console.warn("JSON parse failed (likely unescaped quotes). Falling back to Regex extraction...");
    
    // 3. Regex Fallback: Captures everything between "answer": " and ", "follow_ups"
    const aggressiveMatch = finalRes.match(/"answer"\s*:\s*"([\s\S]*?)"\s*,\s*"follow_ups"/i);
    
    if (aggressiveMatch) {
      answer = aggressiveMatch[1].trim();
      // Clean up escaped newlines or quotes that regex preserved
      answer = answer.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    } else {
      answer = "*(Formatting error - Displaying raw output)*\n\n" + finalRes;
    }
  }
  console.log('Actual response: ', answer);
  
  // Push the final, cleaned string to the UI (replaces the messy streaming JSON)
  resStream(answer);

  } catch(err){
    console.error("Error in onDeviceAI: ", err);
    resStream("An error occurred while generating the response. Please try again.");
  }
  finally{
    if (session && typeof session.destroy === 'function') {
      session.destroy();
    }
  }
  
}


