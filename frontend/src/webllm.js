import { master_prompt, webRes } from "./components/helper";



  

export async function onDeviceAI(userQuery, webResults, resStream){
  console.log("AI model loaded");
  const session = await LanguageModel.create({
    expectedInputs: [
      { type: "text", languages: ["en"] } 
    ],
    expectedOutputs: [
      { type: "text", languages: ["en"] }
    ]
  });
  // console.log(webResults);
  
  console.log('Generating reply...');
  let structuredWebResults = JSON.stringify(
    webResults?.data.raw.map((el, index) => ({
      source_id: index + 1,
      title: el.title,
      url: el.url,
      content: el.content
    }))
  );
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
  finalRes = JSON.parse(finalRes.slice(8, -3));
  resStream(finalRes);
  // console.log(response);
  
}


