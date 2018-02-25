const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

const lib = process.cwd() + '/lib/';
const config = require(lib + 'config');

const User = require(lib + 'model/user');
const Client = require(lib + 'model/client');
const AccessToken = require(lib + 'model/accessToken');


passport.use(new BasicStrategy((username, password, done) => {
  Client.findOne({clientId: username}, (err, client) => {
    if (err) {
      return done(err);
    }

    if (!client) {
      return done(null, false);
    }

    if (client.clientSecret !== password) {
      return done(null, false);
    }

    return done(null, client);
  });
}));

passport.use(new ClientPasswordStrategy((clientId, clientSecret, done) => {
  Client.findOne({clientId: clientId}, (err, client) => {
    if (err) {
      return done(err);
    }

    if (!client) {
      return done(null, false);
    }

    if (client.clientSecret !== clientSecret) {
      return done(null, false);
    }

    return done(null, client);
  });
}));

passport.use(new BearerStrategy((accessToken, done) => {
  AccessToken.findOne({token: accessToken}, (err, token) => {

    if (err) {
      return done(err);
    }

    if (!token) {
      return done(null, false);
    }

    if (Math.round((Date.now() - token.created) / 1000) > config.get('security:tokenLife')) {

      AccessToken.remove({token: accessToken}, (err) => {
        if (err) {
          return done(err);
        }
      });

      return done(null, false, {message: 'Token expired'});
    }

    User.findById(token.userId, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, {message: 'Unknown user'});
      }

      const info = {scope: '*'};
      done(null, user, info);
    });
  });
}));
