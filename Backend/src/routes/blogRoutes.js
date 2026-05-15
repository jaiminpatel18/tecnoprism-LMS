const express = require('express');
const router = express.Router();
const { createBlog, getBlogs, toggleLikeBlog, addComment } = require('../controllers/blogController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getBlogs)
  .post(protect, createBlog);

router.route('/:id/like')
  .post(protect, toggleLikeBlog);

router.route('/:id/comments')
  .post(protect, addComment);

module.exports = router;