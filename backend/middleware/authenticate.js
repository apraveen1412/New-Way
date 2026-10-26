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

export const isOwner = (req, res, next) => {
    const owner = req.user.conversations.some(c => c._id.toString() === req.params.id);
    if (!owner) throw new ErrorHandler(403, "You aren't the owner of this conversation");
    next();
};
