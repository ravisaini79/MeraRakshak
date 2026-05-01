const Device = require('../models/Device');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all devices for logged in user
// @route   GET /api/devices
// @access  Private
const getDevices = asyncHandler(async (req, res) => {
  const devices = await Device.find({ userId: req.user._id }).select(
    'deviceName location latitude longitude battery lastSeen status imeiNo deviceModel createdAt'
  );
  res.json(devices);
});

// @desc    Get single device details
// @route   GET /api/devices/:id
// @access  Private
const getDeviceById = asyncHandler(async (req, res) => {
  const device = await Device.findOne({ _id: req.params.id, userId: req.user._id });
  
  if (device) {
    res.json(device);
  } else {
    res.status(404);
    throw new Error('Device not found');
  }
});

module.exports = { getDevices, getDeviceById };
