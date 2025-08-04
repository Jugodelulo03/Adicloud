const express = require('express');
const Request = require('../models/Request');
const { requireAdmin } = require('../middleware/authMiddleware');
const sendEmail = require('../utils/mailer');
const User = require('../models/User');
const Asset = require('../models/Asset');


const router = express.Router();

// ======================
// USER ROUTES
// ======================

/**
 * @route   POST /requests
 * @desc    Allows a user to submit a new asset request
 * @access  Public (Assumes user is already authenticated)
 */
router.post('/requests', async (req, res) => {
  try {
    const { userId, assetId, purpose, deadline } = req.body;

    // Create and save the new request
    const newRequest = new Request({ userId, assetId, purpose, deadline });
    await newRequest.save();

    // Fetch user and asset information
    const user = await User.findById(userId);
    const asset = await Asset.findById(assetId)

    // Get email addresses of all admins
    const admins = await User.find({ role: 'admin' }).select('email');
    const adminEmails = admins.map(admin => admin.email);

    // Construct the HTML body of the notification email
    const logoUrl = 'https://res.cloudinary.com/dyq3arsfc/image/upload/v1754203284/adicloud_xrsb1l.png';
    const previewUrl = asset?.files?.[0];

    const htmlBody = `
      <div style="font-family: Helvetica, sans-serif;">
      <h2>New Asset Request Submitted</h2>
      <p><strong>User:</strong> ${user.email}</p>
      <p><strong>Asset:</strong> ${asset?.name || 'Unknown'}</p>
      <p><strong>Purpose:</strong> ${purpose}</p>
      <p><strong>Deadline:</strong> ${deadline}</p>
      ${
        previewUrl
        ? `<p><strong>Preview:</strong><br><img src="${previewUrl}" alt="Asset preview" style="max-width: 200px; border: 1px solid #767676;" /></p>`
        : ''
      }
      <p>Sincerely, Adicloud Team Work</p>
      <img src="${logoUrl}" alt="Logo" style="width: 120px;" />
      </div>
    `;

    // Send notification email to all admins
    await sendEmail(adminEmails, 'New Asset Request Submitted', htmlBody, true);


    res.json({ message: 'Request created', request: newRequest });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

/**
 * @route   GET /requests/user/:userId/:status
 * @desc    Get all requests made by a specific user filtered by status
 * @access  Public
 */
router.get('/requests/user/:userId/:status', async (req, res) => {
  try {
    const { userId, status } = req.params;
    const requests = await Request.find({ userId, status }).populate('assetId');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

/**
 * @route   GET /requests/user/:userId
 * @desc    Get all requests made by a specific user
 * @access  Public
 */router.get('/requests/user/:userId', async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.params.userId }).populate('assetId');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});


// ======================
// ADMIN ROUTES
// ======================

/**
 * @route   GET /requests
 * @desc    Get all asset requests (admin only)
 * @access  Private (admin)
 */
router.get('/requests', requireAdmin, async (req, res) => {
  try {
    const requests = await Request.find().populate('userId assetId');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});


/**
 * @route   GET /requests/status/:status
 * @desc    Get all requests filtered by status (admin only)
 * @access  Private (admin)
 */
router.get('/requests/status/:status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.params;
    const requests = await Request.find({ status }).populate('userId assetId');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

/**
 * @route   PATCH /requests/:id/status
 * @desc    Update the status of a request (admin only)
 * @access  Private (admin)
 */
router.patch('/requests/:id/status', requireAdmin,async (req, res) => {
  try {
    const { status } = req.body;
    const { assetId } = req.body;
    const asset = await Asset.findById(assetId)

    // Validate status
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Update the request
    const updated = await Request.findByIdAndUpdate(
      req.params.id, 
      { status },
      { new: true }
    ).populate('userId assetId');

    if (!updated) return res.status(404).json({ error: 'Request not found' });

    const logoUrl = 'https://res.cloudinary.com/dyq3arsfc/image/upload/v1754203284/adicloud_xrsb1l.png';
    const previewUrl = asset?.files?.[0];

    const htmlBody = `
      <div style="font-family: Helvetica, sans-serif;">
      <h2>Your request for ${updated.assetId.name} was ${status}</h2>
      <p><strong>Hi </strong>${updated.userId.name}, your request for "${updated.assetId.name}" has been ${status}.</p>
      ${
        previewUrl
        ? `<p><strong>Preview:</strong><br><img src="${previewUrl}" alt="Asset preview" style="max-width: 200px; border: 1px solid #767676;" /></p>`
        : ''
      }
      <p>Sincerely, Adicloud Team Work</p>
      <img src="${logoUrl}" alt="Logo" style="width: 120px;" />
      </div>
    `;

    // EMAIL NOTIFICATION
    await sendEmail(updated.userId.email, 'Request status updated', htmlBody, true);

    res.json({ message: 'Request status updated', request: updated });

  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;