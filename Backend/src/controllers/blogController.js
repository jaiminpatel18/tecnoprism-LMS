const Blog = require('../models/Blog');

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res) => {
  try {
    const { title, content, coverImage, tags } = req.body;

    const blog = new Blog({
      title,
      content,
      coverImage,
      tags,
      author: req.user._id
    });

    const createdBlog = await blog.save();
    
    // Add logic here to award points to user for writing blog if gamification active

    res.status(201).json({ success: true, data: createdBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Private
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'firstName lastName profilePicture').sort({ createdAt: -1 });
    res.json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Like or Unlike a blog
// @route   POST /api/blogs/:id/like
// @access  Private
const toggleLikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const index = blog.likes.indexOf(req.user._id);

    if (index === -1) {
      blog.likes.push(req.user._id);
    } else {
      blog.likes.splice(index, 1);
    }

    await blog.save();
    res.json({ success: true, likes: blog.likes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment to blog
// @route   POST /api/blogs/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ success: false, message: 'Comment content required' });
    }

    blog.comments.push({
      author: req.user._id,
      content
    });

    await blog.save();
    res.status(201).json({ success: true, data: blog.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  toggleLikeBlog,
  addComment
};