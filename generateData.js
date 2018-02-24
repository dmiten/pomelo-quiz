const faker = require('faker');

const lib = process.cwd() + '/lib/';

const log = require(lib + 'log')(module);
const db = require(lib + 'db/mongoose');
const config = require(lib + 'config');

const User = require(lib + 'model/user');
const Client = require(lib + 'model/client');
const AccessToken = require(lib + 'model/accessToken');
const RefreshToken = require(lib + 'model/refreshToken');

User.remove({}, (err) => {
  const user = new User({
    username: config.get('default:user:username'),
    password: config.get('default:user:password'),
  });

  user.save((err, user) => {
    if (!err) {
      log.info('New user - %s:%s', user.username, user.password);
    } else {
      return log.error(err);
    }
  });
});

Client.remove({}, (err) => {
  const client = new Client({
    name: config.get('default:client:name'),
    clientId: config.get('default:client:clientId'),
    clientSecret: config.get('default:client:clientSecret'),
  });

  client.save((err, client) => {
    if (!err) {
      log.info('New client - %s:%s', client.clientId, client.clientSecret);
    } else {
      return log.error(err);
    }
  });
});

AccessToken.remove({}, (err) => {
  if (err) {
    return log.error(err);
  }
});

RefreshToken.remove({}, (err) => {
  if (err) {
    return log.error(err);
  }
});

setTimeout(() => {
  db.disconnect();
}, 3000);
