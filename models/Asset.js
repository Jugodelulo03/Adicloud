const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },      // nombre del asset
  category: { type: String, required: true },     // Category of the asset
  files: [{ type: String, required: true }]    // URLs o rutas de archivos
});

module.exports = mongoose.model('Asset', assetSchema);