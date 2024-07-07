const passport = require('passport');
const dotenv = require('dotenv');
const LastFMStrategy = require('passport-lastfm');
var _ = require('lodash');
var cb_url = 'http://localhost:3000';

dotenv.config();

passport.use(new LastFMStrategy({
//   'api_key': process.env.LASTFM_KEY,
  'api_key': '3100aade621289fcf1f0cbf907a564ec',
//   'secret': process.env.LASTFM_SECRET,
  'secret': 'e0867f5a1168f2dd60d114d2572b5d60',
  'callbackURL': cb_url + '/lastfm/callback'}, 
  function(profile, sessionKey, done){
// }, function(request, accessToken, refreshToken, profile, done){ //access token and refresh token used for permissions
    return done(null, profile);


// function(req, sessionKey, done) {
  // Find/Update user's lastfm session

  // If user logged in
//   if (req.user){
//     User.findById(req.user.id, (err, user) => {
//       if (err) return done(err);

//       var creds = _.find(req.user.tokens, {type:'lastfm'});
//       // if creds already present
//       if (user.lastfm && creds){
//         req.flash('info', {msg:'Account already linked'});

//         return done(err, user, {msg:'Account already linked'})
//       }

//       else{
//         user.tokens.push({type:'lastfm', username:sessionKey.username, key:sessionKey.key });
//         user.lastfm = sessionKey.key;

//         user.save(function(err){
//           if (err) return done(err);
//           req.flash('success', {msg:"Last.fm authentication success"});
//           return done(err, user, sessionKey);
//         });
//       }
//     });
//   }
//   else{
//     return done(null, false, {message:'Must be logged in'});
//   }
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});