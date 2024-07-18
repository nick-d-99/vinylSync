const passport = require('passport'); //import the passport middleware to handle LastFm's authentication strategy
const LastFMStrategy = require('passport-lastfm'); //import the lastfm specific strategy
const dotenv = require('dotenv'); //import the dotenv module to access .env variables

dotenv.config(); //setup .env file to access variables
var cb_url = `http://localhost:${process.env.PORT}`; //set the callback url to be the localhost at whichever port is specified in .env

//utilize passport module with the lastfm strategy specifically
passport.use(new LastFMStrategy({

  'api_key': process.env.LASTFM_API_KEY, //get api key from .env
  'secret': process.env.LASTFM_API_SECRET, //get secret from .env
  'callbackURL': cb_url + '/lastfm/callback'},  //set callback url to be the variable specified above plus the path where the
                                                //user should be redirected when successfully authenticated

  function(profile, sessionKey, done){
    //where data will be saved to avoid authenticating every time
    //empty for now
    //will implement after oauth is implemented from app and not local host
    return done(null, profile);
}));

//serialize and deserialize are used for session management through passport
//need to do more research and implment this
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});