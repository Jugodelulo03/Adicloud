const express = require('express');
const axios = require('axios');           // Used to fetch files from external URLs (e.g., Cloudinary)
const archiver = require('archiver');     // Used to create a ZIP archive on the fly
const Asset = require('../models/Asset'); // MongoDB model for asset records

const router = express.Router();


/**
 * @route   GET /assets/download/:id
 * @desc    Downloads all files associated with a specific asset as a ZIP file
 * @access  Public (can be restricted with authentication if needed)
 */
router.get('/assets/download/:id', async (req, res) => {
  try {
    //Find the asset by ID
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename=${asset.name}.zip`);
    res.setHeader('Content-Type', 'application/zip');
    // Step 3: Create ZIP archive stream and pipe it to response
    const archive = archiver('zip');
    archive.pipe(res);

     /**
     * Step 4: Loop through each file URL in the asset,
     * download it from Cloudinary using Axios, and append it to the archive
     */
    for (let i = 0; i < asset.files.length; i++) {
      const fileUrl = asset.files[i];

      // Download file as buffer
      const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });

      // Generate filename using file index and extension
      const fileExtension = fileUrl.substring(fileUrl.lastIndexOf('.'));
      const fileName = `file_${i + 1}${fileExtension}`;

      // Append file buffer to ZIP archive
      archive.append(response.data, { name: fileName });
    }

    await archive.finalize();
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
