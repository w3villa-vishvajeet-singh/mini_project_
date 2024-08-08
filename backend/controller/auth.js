
const dotenv=require("dotenv");

const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
dotenv.config();
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;



passport.use(new GoogleStrategy({
    clientID: process.env.GoogleClient,
    clientSecret: process.env.GoogleCLientSecret,
    callbackURL: 'http://localhost:8001/api/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done)=> {
   console.log(profile)
   
      return done(null, profile);

  }
));


passport.serializeUser((profile , done )=>{
  done(null, profile); 

 
})



passport.deserializeUser((profile , done )=>{

    done(err, profile); 

})



passport.use(new LinkedInStrategy({
  clientID: process.env.LinkedinClientId,
  clientSecret: process.envLinkedinSecret,
  callbackURL: "http://localhost:8001/api/auth/linkedin/callback",
}, (accessToken, refreshToken, profile, done)=>{

    return done(null, profile);
  
}));





// github startegy 

passport.use(new GitHubStrategy({
  clientID: process.env.GithubClientID,
  clientSecret: proces.env.GithubSecret,
  callbackURL: "http://localhost:8001/api/auth/github/callback",
  scope: ['r_emailaddress', 'r_liteprofile'],
},

(accessToken, refreshToken, profile, done)=> {
  console.log(profile)
  
     return done(null, profile);
 }

));

