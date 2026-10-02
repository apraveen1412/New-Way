import express from 'express';

// DB models
import  { conversation } from '../models/conversationSchema.js';

// Authentication
import { isLoggedIn, isOwner } from '../middleware/authenticate.js';
import HandleDB from '../middleware/dbHandler.js';

import ErrorHandler from '../middleware/ErrorHandler.js';

const router = express.Router();

// DB req / res
router.post('/onDevice', isLoggedIn, async (req, res, next) => {
    try {
        const { conversationId, userPrompt, fullResponse, modelName } = req.body;

        const currUserName = req.session.passport.user;
        const DBres = await HandleDB( conversationId, currUserName, userPrompt, fullResponse, modelName);

        // console.log('Local DB Response:', DBres);

        // Send conversation ID back to frontend
        res.json({
            success: true,
            conversationId: DBres
        });

    } catch (error) {
        console.error('Local DB error:', error);
        throw new ErrorHandler(500, error.message);
    }
});


// gets messages
router.get('/:id', isLoggedIn, isOwner, async(req, res, next)=>{
  
  console.log('This is messages');
  const fetchConv = await conversation.findById(req.params.id).populate({
    path: 'messages'
  });
  const convMsgs = fetchConv.messages;
  res.send(convMsgs);

});

export default router;