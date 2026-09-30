import {user} from '../models/userSchema.js';
import  { conversation } from '../models/conversationSchema.js';
import { messages } from '../models/messagesSchema.js';

function convNamer(userPrompt){
  const newConversation = userPrompt.replace(/can you|what is|how to/gi, '').trim();
  if(!newConversation) return 'New Conversation';
  return newConversation;
}

const HandleDB = async (conversationId, currUserName, userPrompt, fullResponse, modelName)=>{
  let newConversation={};
  let newConv = false;
  let currConvId = '';
  let currConversation = {}
  let currUser = await user.findOne({email: currUserName});
  console.log("Current User",currUser);
  let conversationName = convNamer(userPrompt);
  if(conversationId === ''){
    newConversation = new conversation({
      conversationName: conversationName,
    });
    
    currConversation = await newConversation.save();
    currConvId = newConversation._id;
    newConv = true;
    console.log('New conversation \n',currConversation);
  }
  else{
    currConvId = conversationId;
    currConversation = await conversation.findById(currConvId);
    console.log('Existing conversation \n',currConversation);
  }

  if(newConv){
    const newMessage = new messages({
      userquery: userPrompt,
      response: fullResponse,
      model: modelName,
    })
    let savedMsg = await newMessage.save();
    newConversation.messages.push(savedMsg);
    let freshConv = await newConversation.save();
    currUser.conversations.push(freshConv); 
    await currUser.save();
  }
  else{
    const newMessage = new messages({
      userquery: userPrompt,
      response: fullResponse,
      model: modelName,
    })
    let savedMsg = await newMessage.save();
    currConversation.messages.push(savedMsg);
    let updatedConv = await currConversation.save();
    
  }
  if(Object.keys(newConversation).length !== 0 ){
    return newConversation._id;
  }
  else return currConvId;
}

export default HandleDB;