const mongoose = require('mongoose');

/**
 * User Schema
 * 
 * Represents a registered user in the system. Stores basic credentials and role information.
 */
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'user' }
});

module.exports = mongoose.model('User', UserSchema);
