const express = require('express');
const passport = require('passport');


const router = express.Router();

router.get(
  '/error',
  passport.authenticate('bearer', {session: false, failWithError: true}),
  (req, res, next) => next(new Error('Simulate internal error'))
);

router.all(
  '*',
  passport.authenticate('bearer', {session: false, failWithError: true}),
  (req, res) => {
    res.status(200);
    res.json({message: 'restricted area'});
  }
);

module.exports = router;
