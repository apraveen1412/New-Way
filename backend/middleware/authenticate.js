import express from 'express';
import passport from 'passport';

export const isLoggedIn = (req, res, next) =>{
    console.log('Authenticating...');
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            success: false,
            message: 'You are not logged in'
        })
    }
    next();
}