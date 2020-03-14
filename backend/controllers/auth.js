const User = require('../models/user');

const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation error');
    error.data = errors.array();
    error.statusCode = 422;
    throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword
    });
    const userResult = await user.save();
    res.status(201).json({
      message: 'User created',
      userId: userResult._id
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  const user = await User.findOne({ email: email });
  try {
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Password is invalid');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString()
      },
      'secret',
      { expiresIn: '1h' }
    );
    res.status(200).json({
      message: 'Login successful!',
      userId: loadedUser._id.toString(),
      token: token
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  const newStatus = req.body.status;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    user.status = newStatus;
    const userResult = await user.save();

    res.status(200).json({
      status: 'Updated status'
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: user.status
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};
