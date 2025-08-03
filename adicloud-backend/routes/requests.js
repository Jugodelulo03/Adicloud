const express = require('express');
const Request = require('../models/Request');
const { requireAdmin } = require('../middleware/authMiddleware');
const sendEmail = require('../utils/mailer');
const User = require('../models/User');
const Asset = require('../models/Asset');


const router = express.Router();

//USER ROUTES
// POST /requests - create a new request
router.post('/requests', async (req, res) => {
  try {
    const { userId, assetId, purpose, deadline } = req.body;
    const newRequest = new Request({ userId, assetId, purpose, deadline });
    await newRequest.save();

    const user = await User.findById(userId);
    const asset = await Asset.findById(assetId)
    const admins = await User.find({ role: 'admin' }).select('email');
    const adminEmails = admins.map(admin => admin.email);

    const logoUrl = 'https://res.cloudinary.com/dyq3arsfc/image/upload/v1754203284/adicloud_xrsb1l.png';
    const previewUrl = asset?.files?.[0];

    const htmlBody = `
      <div style="font-family: Helvetica, sans-serif;">
        <img src="${logoUrl}" alt="Logo" style="width: 120px;" />
        <h2>New Asset Request Submitted</h2>
        <p><strong>User:</strong> ${user.email}</p>
        <p><strong>Asset:</strong> ${asset?.name || 'Unknown'}</p>
        <p><strong>Purpose:</strong> ${purpose}</p>
        <p><strong>Deadline:</strong> ${deadline}</p>
        ${
          previewUrl
            ? `<p><strong>Preview:</strong><br><img src="${previewUrl}" alt="Asset preview" style="max-width: 300px; border: 1px solid #ccc;" /></p>`
            : ''
        }
      </div>
    `;

    // EMAIL NOTIFICATION
    await sendEmail(adminEmails, 'New Asset Request Submitted', htmlBody, true);


    res.json({ message: 'Request created', request: newRequest });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// GET /requests/user/:userId/:status - get requests by user and status
router.get('/requests/user/:userId/:status', async (req, res) => {
  try {
    const { userId, status } = req.params;
    const requests = await Request.find({ userId, status }).populate('assetId');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// GET /requests/user/:userId - get all requests made by a specific user
router.get('/requests/user/:userId', async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.params.userId }).populate('assetId');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});



//ADMIN ROUTES -----------------
// GET /requests - admin: get all requests
router.get('/requests', requireAdmin, async (req, res) => {
  try {
    const requests = await Request.find().populate('userId assetId');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});


// GET /requests/status/:status - admin: get all requests by status
router.get('/requests/status/:status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.params;
    const requests = await Request.find({ status }).populate('userId assetId');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// PATCH /requests/:id/status - admin: update request status
router.patch('/requests/:id/status', requireAdmin,async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = await Request.findByIdAndUpdate(
      req.params.id, 
      { status },
      { new: true }
    ).populate('userId assetId');

    if (!updated) return res.status(404).json({ error: 'Request not found' });

    await sendEmail(
      updated.userId.email,
      `Your request for ${updated.assetId.name} was ${status}`,
      `Hi ${updated.userId.name}, your request for "${updated.assetId.name}" has been ${status}.`
    );

    res.json({ message: 'Request status updated', request: updated });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;