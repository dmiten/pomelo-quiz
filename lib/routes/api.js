const express = require('express');
const passport = require('passport');


const router = express.Router();

router.all(
  '*',
  passport.authenticate('bearer', {session: false}),
  (req, res) => {
    res.status(200);
    res.json({message: 'restricted area'});
  }
);

module.exports = router;
