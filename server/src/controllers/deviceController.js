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

// @desc    Trigger alarm on device
// @route   POST /api/devices/:id/alarm
// @access  Private
const triggerAlarm = asyncHandler(async (req, res) => {
  const device = await Device.findOne({ _id: req.params.id, userId: req.user._id });
  if (!device) {
    res.status(404);
    throw new Error('Device not found');
  }

  // In a real app, you'd send a push notification or MQTT message here
  console.log(`Triggering alarm on device: ${device.name} (${device.deviceId})`);
  
  res.json({ message: 'Alarm triggered successfully' });
});

// @desc    Lock device
// @route   POST /api/devices/:id/lock
// @access  Private
const lockDevice = asyncHandler(async (req, res) => {
  const device = await Device.findOne({ _id: req.params.id, userId: req.user._id });
  if (!device) {
    res.status(404);
    throw new Error('Device not found');
  }

  console.log(`Locking device: ${device.name} (${device.deviceId})`);
  
  res.json({ message: 'Device locked successfully' });
});

// @desc    Ring device
// @route   POST /api/devices/:id/ring
// @access  Private
const ringDevice = asyncHandler(async (req, res) => {
  const device = await Device.findOne({ _id: req.params.id, userId: req.user._id });
  if (!device) {
    res.status(404);
    throw new Error('Device not found');
  }

  console.log(`Ringing device: ${device.name} (${device.deviceId})`);
  
  res.json({ message: 'Device is ringing' });
});

module.exports = { registerDevice, getDevices, triggerAlarm, lockDevice, ringDevice };
