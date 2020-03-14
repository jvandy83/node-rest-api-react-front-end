const express = require('express');

const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

const {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/feed');

// GET /feed/posts
router.get('/posts', isAuth, getPosts);

router.post(
  '/post',
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  isAuth,
  createPost
);

router.get('/post/:postId', isAuth, getPost);

router.put(
  '/post/:postId',
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  isAuth,
  updatePost
);

router.delete('/post/:postId', isAuth, deletePost);

module.exports = router;
