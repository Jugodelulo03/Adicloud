const express = require('express');
const multer = require('multer');
const cloudinary = require('../cloudinaryConfig');
const Asset = require('../models/Asset');
const fs = require('fs');
const { requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Multer configuration: temporarily stores uploaded files in 'uploads/' folder
 * Each file is renamed with a timestamp prefix to avoid conflicts
 */

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Multer: handles incoming file uploads by temporarily storing them in the 'uploads/' folder
const upload = multer({ storage  });


/**
 * @route   POST /assets/upload
 * @desc    Uploads one or more files to Cloudinary and saves asset metadata in MongoDB
 * @access  Admin only
 */router.post('/assets/upload', requireAdmin ,upload.array('files'), async (req, res) => {
  
  try {
    const { name, category } = req.body;

    // Validate request body and files
    if (!name || !category || !req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Name, category and at least one file are required' });
    }

    // Create folder path in Cloudinary: category/name
    const folderPath = `${category}/${name}`;

    /**
     * Upload files to Cloudinary, then delete the local temp file
     * Uses Promise.all to handle multiple uploads concurrently
     */
    const uploadResults = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, { 
          folder: folderPath,
          resource_type: 'auto' // handles images, videos, PDFs, etc.
        });
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


/**
 * @route   GET /assets
 * @desc    Retrieve all assets or filter by category using query param
 * @access  Public
 */
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

/**
 * @route   GET /assets/categories
 * @desc    Retrieve a list of unique asset categories
 * @access  Public
 */
router.get('/assets/categories', async (req, res) => {
  try {
    const categories = await Asset.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

/**
 * @route   GET /assets/:id
 * @desc    Retrieve a single asset by its MongoDB ID
 * @access  Public
 */
router.get('/assets/:id', async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});


module.exports = router;