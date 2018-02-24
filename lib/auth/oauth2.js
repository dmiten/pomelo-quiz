const oauth2orize = require('oauth2orize');
const passport = require('passport');
const crypto = require('crypto');

const lib = process.cwd() + '/lib/';
require(lib + 'db/mongoose');
const config = require(lib + 'config');
const log = require(lib + 'log')(module);
const User = require(lib + 'model/user');
const AccessToken = require(lib + 'model/accessToken');
let RefreshToken = require(lib + 'model/refreshToken');


const aserver = oauth2orize.createServer();

const errFn = (cb, err) => {
  if (err) {
    return cb(err);
  }
};

const generateTokens = (data, done) => {
  const errorHandler = errFn.bind(undefined, done);

  RefreshToken.remove(data, errorHandler);
  AccessToken.remove(data, errorHandler);

  const tokenValue = crypto.randomBytes(32).toString('hex');
  const refreshTokenValue = crypto.randomBytes(32).toString('hex');

  data.token = tokenValue;
  const token = new AccessToken(data);

  data.token = refreshTokenValue;
  const refreshToken = new RefreshToken(data);

  refreshToken.save(errorHandler);

  token.save((err) => {
    if (err) {
      log.error(err);
      return done(err);
    }

    done(null, tokenValue, refreshTokenValue, {
      'expires_in': config.get('security:tokenLife')
    });
  });
};


aserver.exchange(oauth2orize.exchange.password(
  (client, username, password, scope, done) => {
    User.findOne({username: username}, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user || !user.checkPassword(password)) {
        return done(null, false);
      }

      const model = {
        userId: user.userId,
        clientId: client.clientId
      };

      generateTokens(model, done);
    });
  })
);

aserver.exchange(oauth2orize.exchange.refreshToken((client, refreshToken, scope, done) => {
  RefreshToken.findOne({token: refreshToken, clientId: client.clientId}, (err, token) => {
    if (err) {
      return done(err);
    }

    if (!token) {
      return done(null, false);
    }

    User.findById(token.userId, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }

      const model = {
        userId: user.userId,
        clientId: client.clientId
      };

      generateTokens(model, done);
    });
  });
}));

exports.token = [
  passport.authenticate(['basic', 'oauth2-client-password'], {session: false}),
  aserver.token(),
  aserver.errorHandler()
];
