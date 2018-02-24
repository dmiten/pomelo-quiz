const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const lib = process.cwd() + '/lib/';
require(lib + 'auth/auth');

const log = require('./log')(module);
const oauth2 = require('./auth/oauth2');
const api = require('./routes/api');
const users = require('./routes/users');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.status(200);
  res.json({message: 'API runing'});
});

app.use('/api/users', users);
app.use('/api/oauth/token', oauth2.token);

app.use('/api', api);

app.use((req, res, next) => {
  res.status(404);
  log.debug('%s %d %s', req.method, res.statusCode, req.url);
  res.json({
    error: 'Not found'
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  log.error('%s %d %s', req.method, res.statusCode, err.message);
  res.json({
    error: err.message
  });
});

module.exports = app;
