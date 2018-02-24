const mongoose = require('mongoose');

const lib = process.cwd() + '/lib/';
const log = require(lib + 'log')(module);
const config = require(lib + 'config');


mongoose.connect(config.get('mongoose:uri') || process.env.URI);

const db = mongoose.connection;

db.on('error', (err) => log.error('Connection error:', err.message));
db.once('open', () => log.info('Connected to DB!'));

module.exports = mongoose;
