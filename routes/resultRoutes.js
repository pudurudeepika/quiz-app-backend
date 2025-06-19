const express = require('express');
const router = express.Router();
const Result = require('../models/result');

// @route   POST /api/results
// @desc    Save a new test result
// @access  Public (You can add auth middleware if needed)
router.post('/', async (req, res) => {
  try {
    const newResult = new Result(req.body);
    const saved = await newResult.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error saving result', error: err });
  }
});

// @route   GET /api/results/user/:userId
// @desc    Get all results for a user
// @access  Public (You can add auth middleware if needed)
router.get('/user/:userId', async (req, res) => {
  try {
    const results = await Result.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching results', error: err });
  }
});

module.exports = router;
