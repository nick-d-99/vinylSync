const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth');

// function isLoggedIn(req, res, next){
//     req.user ? next() : res.sendStatus(401);
// };

const app = express();
const port = process.env.PORT || 3000;

// app.use(session({ secret: "cats" })); //env secret so not in github
// app.use(passport.initialize());
// app.use(passport.session());

app.get('/', (req, res) => {
    res.send('<a href="/auth/lastfm">Authenticate with LastFM</a>')
});

// app.get('/auth/lastfm',
//     passport.authenticate('lastfm')
// )

// app.get('/protected', isLoggedIn, (req, res) => {
//     res.send('Authentication success!');
// });

// app.get('/lastfm/callback', 
//     passport.authenticate('lastfm', {
//         successRedirect: '/protected',
//         failureRedirect: '/auth/failure',
//     })
// );

// app.get('auth/failure', (req, res) => {
//     res.send('something went wrong :(');
// });
app.get('/failure', (req, res) => {
    res.send('something went wrong..');
});
app.get('/success', (req, res) => {
    res.send('Authenticated!');
});
app.get('/auth/lastfm', passport.authenticate('lastfm'));
app.get('/lastfm/callback', function(req, res, next){
  passport.authenticate('lastfm', {failureRedirect:'/failure'}, function(err, user, sesh){
    res.redirect('/success');
  })(req, {} );
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));