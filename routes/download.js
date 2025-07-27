const express = require('express');
const axios = require('axios');
const archiver = require('archiver');
const Asset = require('../models/Asset');

const router = express.Router();

router.get('/assets/download/:id', async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename=${asset.name}.zip`);
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver('zip');
    archive.pipe(res);

    // download each file from Cloudinary and create ZIP
    for (let i = 0; i < asset.files.length; i++) {
      const fileUrl = asset.files[i];
      const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
      const fileName = `file_${i + 1}${fileUrl.substring(fileUrl.lastIndexOf('.'))}`;
      archive.append(response.data, { name: fileName });
    }

    await archive.finalize();
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
