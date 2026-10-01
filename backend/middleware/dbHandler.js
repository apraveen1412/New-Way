import mongoose from 'mongoose';
import { user } from '../models/userSchema.js';
import { conversation } from '../models/conversationSchema.js';
import { messages } from '../models/messagesSchema.js';

function convNamer(userPrompt) {
  const name = userPrompt
    .replace(/can you|what is|how to|give me|explain|do you know|list all|does/gi, '')
    .trim();
  return name || 'New Conversation';
}

/**
 * Saves one user query + AI response.
 * - conversationId === ''  -> creates a new conversation and links it to the user
 * - otherwise              -> appends the message to that (user-owned) conversation
 * Always returns the conversation id as a plain string.
 */
const HandleDB = async (conversationId, currUserName, userPrompt, fullResponse, modelName) => {
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