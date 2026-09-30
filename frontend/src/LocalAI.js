import { master_prompt } from "./components/helper";

export async function onDeviceAI(userQuery, webResults, resStream){
  // console.log("AI model loaded");
  // console.log(webResults);
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
  
  // console.log('Generating reply...');
  let structuredWebResults = JSON.stringify(
    webResults?.data?.raw.map((el, index) => ({
      source_id: index + 1,
      title: el.title,
      url: el.url,
      content: el.content
    }))
  );
  // console.log('webResults: ',webResults)
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
    // console.log(finalRes);
  };
  
  const answer = finalRes
  .trim()
  .replace(/^```(?:markdown|md)?\s*\n/i, '')
  .replace(/\n```\s*$/, '')
  .trim();

  if (!answer) throw new Error('Empty response from on-device model');

  resStream(answer);
  return answer; // QueryBox uses this for the /ondevice/db save

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


