const express = require('express'); //import the express module for a ligthweight server
const passport = require('passport'); //import the passport middleware to handle oauth with lastfm
require('./auth'); //import the auth.js file to handle authentication

const app = express(); //initialize instance of express application
const port = process.env.PORT || 3000; //set port to be pulled from .env or 3000 if no port provided in .env

//creates the link titled Authenticate with LastFM with a reference link to the url specified below
app.get('/', (req, res) => {
    res.send('<a href="/auth/lastfm">Authenticate with LastFM</a>')
});

//sets up the url for authenticaiton and calls the passport.authenticate('lastfm') function
app.get('/auth/lastfm', passport.authenticate('lastfm'));

//setup the failure url
app.get('/failure', (req, res) => {
    res.send('something went wrong..');
});

//setup the success url
app.get('/success', (req, res) => {
    res.send('Authenticated!');
});

//handles the callback url specified the url on failure, and on success
app.get('/lastfm/callback', function(req, res, next){
  passport.authenticate('lastfm', {failureRedirect:'/failure'}, function(err, user, sesh){
    res.redirect('/success');
  })(req, {} );
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`)); //logs what port the server is running