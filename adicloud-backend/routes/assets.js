const express = require('express');
const multer = require('multer');
const cloudinary = require('../cloudinaryConfig');
const Asset = require('../models/Asset');
const fs = require('fs');
const { requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();


// Multer: handles incoming file uploads by temporarily storing them in the 'uploads/' folder
const upload = multer({ dest: 'uploads/' });

// POST /assets/upload - upload files to Cloudinary and save in MongoDB
router.post('/assets/upload', requireAdmin ,upload.array('files'), async (req, res) => {
  try {
    const { name, category } = req.body;

    // Validate request body and files
    if (!name || !category || !req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Name, category and at least one file are required' });
    }

    // Create folder path in Cloudinary: category/name
    const folderPath = `${category}/${name}`;

    // Upload each file to Cloudinary in its folder, then delete temp file
    const uploadResults = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, { folder: folderPath });
        fs.unlinkSync(file.path); // delete temp file after upload
        return result;
      })
    );

    // Extract secure URLs
    const fileUrls = uploadResults.map(r => r.secure_url);

    // Save asset document in MongoDB
    const newAsset = new Asset({ name, category, files: fileUrls });
    await newAsset.save();

    res.json({ message: 'Asset uploaded successfully', asset: newAsset });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// GET /assets?category=nombre_categoria - retrieve assets by category
router.get('/assets', async (req, res) => {
  try {
    const { category } = req.query;

    // If no category is provided, return all assets
    const filter = category ? { category } : {};

    const assets = await Asset.find(filter);
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;