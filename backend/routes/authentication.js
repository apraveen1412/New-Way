import express from 'express';
import passport from 'passport';


// DB models
import {user} from '../models/userSchema.js';

// Authentication
import { isLoggedIn } from '../middleware/authenticate.js';



const router = express.Router();

// .('/api/auth')
router.post('/signup', async (req, res, next) => {
        try {
            let { name, email, password } = req.body;
            if(typeof name === 'string' && typeof email === 'string' && typeof password === 'string'){
              name = name.trim();
              email = email.trim();
              password = password.trim();
              if (!name || !email || !password) {
                return res.status(400).json({ success: false, message: 'All fields are required' });
              }
              const newUser = new user({name,email});
              const savedUser = await user.register(newUser, password);

              req.login(savedUser, (err)=>{
                if(err) return next(err);
                res.status(201).json({
                  success: true,
                  message: 'User registered successfully',
                  user: {
                    id: savedUser._id,
                    name: savedUser.name,
                    email: savedUser.email,
                  }
                });
              })
            }
            else{
              return res.status(400).json({ success: false, message: 'Invalid input' });
            }
        } catch (error) {
            console.error("SIGNUP ERROR:", error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    })

router.post('/signin', async(req, res, next) => { // Defining passport function
        let {username, password} = req.body;
        if(typeof username === 'string' && typeof password === 'string'){
          username = username.trim();
          password = password.trim();
          if (!username || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
          }
          let userObj = await user.findOne({email: username}).populate({
            path: 'conversations',
            select: '_id conversationName'
          });;
          // console.log(userObj);
          passport.authenticate('local', (err, user, info) => {
            if (err) { // operational errors like DB failures, session failure and more
                return next(err);
            }
            if (!user) { // Handles errors of user credentials being falsy 
                return res.status(401).json({
                    success: false,
                    message: info?.message || 'Invalid email or password'
                });
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                // res.cookie('user', userObj);
                res.status(200).json({
                    success: true,
                    message: 'Sign in successful',
                    user: userObj
                });
            });

          })(req, res, next); // Executing the passport middleware in the current req res cycle.
        }
        else{
          return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }
    })

router.get('/me', isLoggedIn, async (req, res, next)=>{
      const currUser = req.session.passport.user;
      const userObj = await user.findOne({email: currUser}).populate({
        path: 'conversations'
      });
      res.send(userObj);
    })

router.get('/logout', (req, res, next) => {
      req.logout((err) => {
        if (err) {
          return next(err);
        }

        res.status(200).json({
          success: true,
          message: 'Logout successful',
        });
      });
    });


export default router;