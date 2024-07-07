// Required modules
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LastfmStrategy = require('passport-lastfm').Strategy;
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: true,
    saveUninitialized: true
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport strategy configuration (Last.fm OAuth)
passport.use(new LastfmStrategy({
    api_key: process.env.LASTFM_API_KEY,
    secret: process.env.LASTFM_API_SECRET,
    callbackURL: process.env.OAUTH_CALLBACK_URL
}, (token, tokenSecret, profile, done) => {
    console.log('Inside LastfmStrategy callback');
    console.log('Token:', token);
    console.log('Token Secret:', tokenSecret);
    console.log('Profile:', profile);

    // Error handling if no profile or profile ID is found
    if (!profile || !profile.id) {
        console.error('No profile found or profile ID is missing');
        return done(new Error('No profile found or profile ID is missing.'));
    }

    // Simplified user handling (replace with your own logic)
    const user = {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName
    };

    return done(null, user);
}));

// Serialize user into session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
    // Replace with actual user retrieval logic
    const user = {
        id: id,
        username: 'example_username',
        displayName: 'Example User'
    };
    done(null, user);
});

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.get('/auth/lastfm', passport.authenticate('lastfm'));

app.get('/auth/callback',
    passport.authenticate('lastfm', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    }
);

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});