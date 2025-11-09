const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const router = express.Router();

// Get all categories (mounted at /api/categories)
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }  
});

//create new category
router.post('/',
  [
    body('name')
      .notEmpty()
      .withMessage('Category name is required')
      .isLength({ max: 50 })
      .withMessage('Category name cannot exceed 50 characters'),
    body('description')
      .optional()
      .isLength({ max: 200 })
      .withMessage('Description cannot exceed 200 characters'),
  ],
    async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } 
      const category = new Category(req.body);
      const categorySave=await category.save();
      res.status(201).json(categorySave);
    } catch (err) {
      next(err);
    }
    });
  
module.exports = router;



