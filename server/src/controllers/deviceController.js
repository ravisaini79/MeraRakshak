const Device = require('../models/Device');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Register or update device
// @route   POST /api/devices
// @access  Private
const registerDevice = asyncHandler(async (req, res) => {
  const { deviceId, name, model } = req.body;
  const userId = req.user._id;

  let device = await Device.findOne({ deviceId, userId });

  if (device) {
    device.name = name;
    device.model = model;
    device.lastActive = Date.now();
    await device.save();
  } else {
    device = await Device.create({
      userId,
      deviceId,
      name,
      model,
    });
  }

  res.json(device);
});

// @desc    Get all devices for user
// @route   GET /api/devices
// @access  Private
const getDevices = asyncHandler(async (req, res) => {
  const devices = await Device.find({ userId: req.user._id });
  res.json(devices);
});

module.exports = { registerDevice, getDevices };
