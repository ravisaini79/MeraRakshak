const Location = require('../models/Location');
const Device = require('../models/Device');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Send current location
// @route   POST /api/location
// @access  Private
const sendLocation = asyncHandler(async (req, res) => {
  const { deviceId, lat, lng } = req.body;

  const location = await Location.create({ deviceId, lat, lng });

  // Update device last active
  await Device.findOneAndUpdate({ deviceId }, { lastActive: Date.now() });

  res.json(location);
});

// @desc    Get location history for a device
// @route   GET /api/location/:deviceId
// @access  Private
const getLocationHistory = asyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  const history = await Location.find({ deviceId })
    .sort('-timestamp')
    .limit(50);
  res.json(history);
});

module.exports = { sendLocation, getLocationHistory };
