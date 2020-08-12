const express = require("express");
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path')
const passport = require('passport')
const DiscordStrategy = require('passport-discord').Strategy;

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))
app.engine('html', require('ejs').renderFile)
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('images'));

app.listen(80, () => {
    console.log("Web is online");
});

var scopes = ['identify', 'email', 'guilds', 'guilds.join'];
passport.use(new DiscordStrategy({
    clientID: "518657304795676693",
    clientSecret: "HJoliVmGFyUVqIHJyPK__hXjEkDIUCu2",
    callbackURL: "http://vendetta.tk/wbot/callback",
    scope: scopes
}, function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        return done(null, profile);
    });
}));


passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

try{
    require('./router/main')(passport, app);
}catch(e){
    console.log(e)
}