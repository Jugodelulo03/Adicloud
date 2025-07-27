const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset.js'); 

// POST /assets - Create a new asset
router.post('/assets', async (req, res) => {
  try {
    const { name, files } = req.body;

    if (!name || !files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'Name and at least one file are required' });
    }

    const newAsset = new Asset({ name, files });
    await newAsset.save();

    res.json({ message: 'Asset created successfully', asset: newAsset });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /assets - get all assets
router.get('/assets', async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
