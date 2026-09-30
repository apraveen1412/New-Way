import express from 'express';

// DB models
import  { conversation } from '../models/conversationSchema.js';

// Authentication
import { isLoggedIn } from '../middleware/authenticate.js';
import HandleDB from '../middleware/dbHandler.js';


const router = express.Router();

// DB req / res
router.post('/onDevice',isLoggedIn, async(req, res, next)=>{
  const{conversationId, userPrompt, fullResponse, modelName} = req.body;
  let currUserName = req.session.passport.user;
  HandleDB(conversationId, currUserName, userPrompt, fullResponse, modelName);
  res.send('done');
});

router.get('/:id', isLoggedIn, async(req, res, next)=>{
  
  // res.send('This is messages');
  const fetchConv = await conversation.findById(req.params.id).populate({
    path: 'messages'
  });
  const convMsgs = fetchConv.messages;
  res.send(convMsgs);

});

export default router;