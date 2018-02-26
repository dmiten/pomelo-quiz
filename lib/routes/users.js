const express = require('express');
const passport = require('passport');
const router = express.Router();


router.get(
  '/info',
  passport.authenticate('bearer', {session: false, failWithError: true}),
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
