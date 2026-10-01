import mongoose from 'mongoose';
import { user } from '../models/userSchema.js';
import { conversation } from '../models/conversationSchema.js';
import { messages } from '../models/messagesSchema.js';

import { convNamer } from '../helper.js';


const HandleDB = async (conversationId, currUserName, userPrompt, fullResponse, modelName)=> {
  const currUser = await user.findOne({ email: currUserName });
  if (!currUser) throw new Error('User not found');

  // Validate an existing conversation BEFORE writing anything, so we never leave orphan messages
  const isNewChat = !conversationId;
  if (!isNewChat) {
    if (!mongoose.isValidObjectId(conversationId)) {
      throw new Error('Invalid conversation id');
    }
    const ownsIt = currUser.conversations.some((id) => id.equals(conversationId));
    if (!ownsIt) throw new Error('Conversation not found');
  }

  const newMessage = await messages.create({
    userquery: userPrompt,
    response: fullResponse,
    model: modelName,
  });

  if (isNewChat) {
    const newConv = await conversation.create({
      conversationName: convNamer(userPrompt),
      messages: [newMessage._id],
    });
    // $push is atomic and avoids version conflicts from currUser.save()
    await user.updateOne({ _id: currUser._id }, { $push: { conversations: newConv._id } });
    return newConv._id.toString();
  }

  await conversation.updateOne({ _id: conversationId }, { $push: { messages: newMessage._id } });
  return String(conversationId);
};

export default HandleDB;