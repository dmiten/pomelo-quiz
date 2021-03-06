const express = require('express');

const libs = process.cwd() + '/libs/';
const oauth2 = require(libs + 'auth/oauth2');


const router = express.Router();

router.post('/', oauth2.token);

module.exports = router;
