const express = require('express');
const router = express.Router();
const { signupValidation } = require('../helper/validation');
const userController = require('../controller/userController');
const emailVerification = require('../controller/emailVerification');
const otpVerification = require('../controller/otpVerification');
const login = require('../controller/login');
const check_verify = require('../controller/checkverification');
const passport = require('passport');




// Routes
router.post('/register', signupValidation, userController.register);
router.get('/verify-email', emailVerification.verifyEmail);
router.post('/verify-otp', otpVerification.verifyOtp);
router.post('/login', login.login);
router.post('/check-verification', check_verify.checkVerification);



/////// o auth  routes 




// Google OAuth routes

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: 'http://localhost:3000',
    failureRedirect: '/users/login'
}));




router.get('/auth/linkedin',
  passport.authenticate('linkedin', { state: 'SOME STATE'  }),
  );

  router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
    successRedirect: 'http://localhost:3000',
    failureRedirect: 'http://localhost:3000/users/login'
  }));



// github 

router.get('/auth/github',
    passport.authenticate('github', { scope: [ 'user:email' ] }));
  
    router.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('http://localhost:3000');
    });





module.exports = router;
