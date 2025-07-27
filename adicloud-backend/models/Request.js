const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who made the request
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true }, // which asset is requested
  purpose: { type: String, required: true }, 
  deadline: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);