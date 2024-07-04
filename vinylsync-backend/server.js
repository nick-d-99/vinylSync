const https = require('https');
const fs = require('fs');
const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
require('dotenv').config();

const app = express();
const port = 3000;

// SSL/TLS options - replace with your certificate paths
const options = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.cert')
};

// Configure Passport.js
passport.use('oauth2', new OAuth2Strategy({
  authorizationURL: 'https://www.last.fm/api/auth/?api_key=' + process.env.LASTFM_API_KEY,
  tokenURL: 'https://ws.audioscrobbler.com/2.0/',
  clientID: process.env.LASTFM_API_KEY,
  clientSecret: process.env.LASTFM_API_SECRET,
  callbackURL: process.env.OAUTH_CALLBACK_URL
}, (accessToken, refreshToken, profile, cb) => {
  // OAuth2 authentication logic
  // In a real application, you would typically save user details to a database
  // Here, we simply pass the profile to the callback
  return cb(null, profile);
}));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());

// Example route to initiate OAuth2 authentication
app.get('/auth/lastfm', passport.authenticate('oauth2'));

// OAuth2 callback route
app.get('/auth/callback', passport.authenticate('oauth2', {
  successRedirect: '/success',
  failureRedirect: '/error'
}));

// Protected route for successful authentication
app.get('/success', (req, res) => {
  res.send('Successfully authenticated with Last.fm!');
});

// Error route for failed authentication
app.get('/error', (req, res) => {
  res.send('Authentication failed. Please try again.');
});

// Create HTTPS server
https.createServer(options, app).listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});