const express = require('express');
const passport = require('passport');
const router = express.Router();

const lib = process.cwd() + '/lib/';

router.get('/info', passport.authenticate('bearer', {session: false}),
  (req, res) => {
    res.status(200);
    res.json({
      user_id: req.user.userId,
      name: req.user.username,
      scope: req.authInfo.scope
    });
  }
);

module.exports = router;
