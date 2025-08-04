const mongoose = require('mongoose');

/**
 * Asset Schema
 * 
 * This schema defines the structure of an "Asset" document in MongoDB.
 * Each asset includes a name, category, and a list of associated files (e.g., file URLs).
 */
const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },      // Asset name
  category: { type: String, required: true },     // Category of the asset
  files: [{ type: String, required: true }]    // file path
});

module.exports = mongoose.model('Asset', assetSchema);