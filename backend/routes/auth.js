const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

const {
  signup,
  login,
  getStatus,
  updateStatus
} = require('../controllers/auth');

const { body } = require('express-validator');

const User = require('../models/user');

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            Promise.reject('E-mail address is already taken.');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  signup
);

router.post('/login', login);

router.put('/status', isAuth, updateStatus);

router.get('/status', isAuth, getStatus);

module.exports = router;
