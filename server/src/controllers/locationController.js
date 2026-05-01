const LocationHistory = require('../models/LocationHistory');
const Device = require('../models/Device');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Update device location
// @route   POST /api/location
// @access  Private
const updateLocation = asyncHandler(async (req, res) => {
  const { latitude, longitude, location, battery, timestamp } = req.body;

  if (latitude === undefined || longitude === undefined) {
    res.status(400);
    throw new Error('Please provide latitude and longitude');
  }

  // Save to location history
  const history = await LocationHistory.create({
    deviceId: req.deviceId,
    latitude,
    longitude,
    location,
    battery,
    timestamp: timestamp || Date.now(),
  });

  // Update latest location on the device
  await Device.findByIdAndUpdate(req.deviceId, {
    latitude,
    longitude,
    location,
    battery,
    lastSeen: Date.now(),
  });

  res.status(201).json(history);
});

// @desc    Get location history
// @route   GET /api/location
// @access  Private
const getLocationHistory = asyncHandler(async (req, res) => {
  const deviceId = req.query.deviceId || req.deviceId;

  if (!deviceId) {
    res.status(400);
    throw new Error('Device ID is required');
  }

  // Verify the device belongs to the user
  const device = await Device.findOne({ _id: deviceId, userId: req.user._id });
  if (!device) {
    res.status(404);
    throw new Error('Device not found or does not belong to user');
  }

  const history = await LocationHistory.find({ deviceId }).sort({ timestamp: -1 });
  res.json(history);
});

module.exports = { updateLocation, getLocationHistory };
