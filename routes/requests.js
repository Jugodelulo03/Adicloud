const express = require('express');
const Request = require('../models/Request');

const router = express.Router();

//USER ROUTES
// POST /requests - create a new request
router.post('/requests', async (req, res) => {
  try {
    const { userId, assetId, purpose, deadline } = req.body;
    const newRequest = new Request({ userId, assetId, purpose, deadline });
    await newRequest.save();
    res.json({ message: 'Request created', request: newRequest });
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

//ADMIN ROUTES
// GET /requests - admin: get all requests
router.get('/requests', async (req, res) => {
  try {
    const requests = await Request.find().populate('userId assetId');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});


// GET /requests/status/:status - admin: get all requests by status
router.get('/requests/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const requests = await Request.find({ status }).populate('userId assetId');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// PATCH /requests/:id/status - admin: update request status
router.patch('/requests/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = await Request.findByIdAndUpdate(
      req.params.id, 
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Request not found' });

    res.json({ message: 'Request status updated', request: updated });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;