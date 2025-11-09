const mongoose = require('mongoose');
const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Category = require('../models/Category');
const { upload, handleMulterError } = require('../middleware/upload');
const router = express.Router();

// Get all posts blogs
// Get all posts blogs (supports pagination, category filter, and search)
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const category = req.query.category || null;
    const q = req.query.q || null;

    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
      ];
    }

    const posts = await Post.find(filter)
      .populate('category')
      .populate('author')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json(posts);
  }
  catch (err) {
    next(err);
  }
})
// Get a single post by ID
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('category').populate('author');
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

// Create a new post with image upload
router.post('/',
  upload.single('featuredImage'), // Handle single file upload
  handleMulterError, // Handle file upload errors
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('category').isMongoId().withMessage('Invalid category ID'),
    body('author').isMongoId().withMessage('Invalid author ID'),
  ],
  async (req, res, next) => { 
    try {
      // Log request body for debugging
      console.log('Creating post with data:', req.body);
      console.log('File:', req.file);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Create post data including file path if uploaded
      const postData = {
        ...req.body,
        featuredImage: req.file ? `/uploads/${req.file.filename}` : undefined
      };

      const post = new Post(postData);
      
      try {
        const savedPost = await post.save();
        // Use populate() directly - execPopulate is deprecated
        const populatedPost = await Post.findById(savedPost._id)
          .populate('category')
          .populate('author');

        res.status(201).json(populatedPost);
      } catch (saveErr) {
        console.error('Error saving post:', saveErr);
        // Check for validation errors
        if (saveErr.name === 'ValidationError') {
          return res.status(400).json({
            errors: Object.keys(saveErr.errors).map(key => ({
              msg: saveErr.errors[key].message,
              param: key
            }))
          });
        }
        throw saveErr;
      }
    }
    catch(err){
      console.error('Post creation error:', err);
      if (req.file) {
        // If post creation fails but file was uploaded, try to clean up
        try {
          const fs = require('fs').promises;
          await fs.unlink(req.file.path);
        } catch (unlinkErr) {
          console.error('Failed to remove uploaded file:', unlinkErr);
        }
      }
      next(err);
    }
  })

// Update a post by ID (supports optional image upload)
router.put('/:id', upload.single('featuredImage'), handleMulterError, async (req, res, next) => { 
  try {
    // Build update object
    const updateData = { ...req.body };

    // If title is being updated, regenerate the slug
    if (updateData.title) {
      updateData.slug = updateData.title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
    }

    // If a new file was uploaded, set featuredImage path
    if (req.file) {
      updateData.featuredImage = `/uploads/${req.file.filename}`;
    }

    const fetchData = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    const populated = await Post.findById(fetchData._id).populate('category').populate('author');
    res.status(200).json(populated);
  }
  catch (err) {
    console.error('Post update error:', err);
    next(err);
  }
})

// Delete a post by ID
router.delete('/:id', async (req, res, next) => { 
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  }
  catch (err) {
    next(err);
  }
})
  

module.exports = router;