import express from 'express';

// DB models
import  { conversation } from '../models/conversationSchema.js';

// Authentication
import { isLoggedIn } from '../middleware/authenticate.js';
import HandleDB from '../middleware/dbHandler.js';


const router = express.Router();

// DB req / res
router.post('/onDevice', isLoggedIn, async (req, res, next) => {
    try {
        const { conversationId, userPrompt, fullResponse, modelName } = req.body;

        const currUserName = req.session.passport.user;
        const DBres = await HandleDB( conversationId, currUserName, userPrompt, fullResponse, modelName);

        console.log('Local DB Response:', DBres);

        // Send conversation ID back to frontend
        res.json({
            success: true,
            conversationId: DBres
        });

    } catch (error) {
        console.error('Local DB error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
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