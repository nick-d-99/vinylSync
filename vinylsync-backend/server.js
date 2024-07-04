require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'SECRET', resave: false, saveUninitiated: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://www.last.fm/api/auth/?api_key=' + process.env.LASTFM_API_KEY,
    tokenURL: 'https://www.last.fm/api/auth/?api_key=' + process.env.LASTFM_API_KEY,
    clientID: process.env.LASTFM_API_KEY,
    clientSecret: process.env.LASTFM_API_SECRET,
    callbackURL: process.env.OAUTH_CALLBACKURL    
},
//what is the callback?
function(accessToken, refreshToken, profile, cb) {
    profile.accessToken = accessToken; //Store access token in the profile
    return cb(null, profile); // Pass the profile to the callback
}));

passport.serializeUser((user, cb) => {
    cb(null, user); //serialize user into the session
})

passport.deserializeUser((obj, cb) => {
    cb(null, obj); //deserialize user from the session
})

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/auth/lastfm',
    passport.authenticate('oauth2'));

app.get('/auth/callback',
    passport.authenticate('oauth2', { failureRedirect: '/' }), (req, res) => {
        res.send('Successfully authenticated with Last.fm!');
});

//scrobble
// app.post('/scrobble', (req, res) => {
//     if (!req.user || !req.user.accessToken) {
//       return res.status(401).send('User not authenticated');
//     }
  
//     const { track, artist, timestamp } = req.body;
//     const params = new URLSearchParams({
//       method: 'track.scrobble',
//       track,
//       artist,
//       timestamp,
//       api_key: process.env.LASTFM_API_KEY,
//       sk: req.user.accessToken,
//       api_sig: generateApiSig({
//         method: 'track.scrobble',
//         track,
//         artist,
//         timestamp,
//         api_key: process.env.LASTFM_API_KEY,
//         sk: req.user.accessToken
//       }),
//       format: 'json'
//     });
  
//     axios.post(`http://ws.audioscrobbler.com/2.0/?${params}`)
//       .then(response => res.send(response.data))
//       .catch(error => res.status(500).send('Error scrobbling track: ' + error.message));
//   });

function generateApiSig(params) {
    const keys = Object.keys(params).sort();
    let string = '';
    keys.forEach(key => {
        string += key + params[key];
    });
    string += process.env.LASTFM_API_SECRET;
    return
require('crypto').createHash('md5').update(string).digest('hex');
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});