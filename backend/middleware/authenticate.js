import express from 'express';
import passport from 'passport';
import ErrorHandler from './ErrorHandler.js';

export const isLoggedIn = (req, res, next) =>{
    // console.log('Authenticating...');
    if (!req.isAuthenticated()) {
        // return res.status(401).json({
        //     success: false,
        //     message: 'You are not logged in'
        // })
        throw new ErrorHandler(401, 'You are not logged in');
    }
    next();
}

export const isOwner = (req, res, next) =>{
    const conversationId = req.params.id;
    const user = req.user; 

    try{
        const owner = user.conversations.some(conversation => conversation._id.toString() === conversationId);
        if(!owner){
            throw new ErrorHandler(403, "You aren't the owner of this conversation");    
        }
        next();
    }
    catch(err){
        throw new ErrorHandler(500, err.message);
    }
}