const SecurityEvent = require('../models/SecurityEvent');
const Device = require('../models/Device');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Report theft
// @route   POST /api/security/report-theft
// @access  Private
const reportTheft = asyncHandler(async (req, res) => {
  const { deviceId } = req.body;
  const device = await Device.findOne({ deviceId });

  if (!device) {
    res.status(404);
    throw new Error('Device not found');
  }

  device.status = 'Stolen';
  await device.save();

  const event = await SecurityEvent.create({
    deviceId,
    type: 'THEFT_REPORTED',
    message: `Device ${device.name} marked as STOLEN.`,
    severity: 'CRITICAL',
  });

  res.json({ message: 'Theft reported', event });
});

// @desc    Log security event (with optional photo)
// @route   POST /api/security/log-event
// @access  Private
const logSecurityEvent = asyncHandler(async (req, res) => {
  const { deviceId, type, message, severity, lat, lng } = req.body;
  const photoUrl = req.file ? req.file.path : null;

  const event = await SecurityEvent.create({
    deviceId,
    type,
    message,
    severity,
    photoUrl,
    location: { lat, lng },
  });

  res.json(event);
});

// @desc    Get all security events for user's devices
// @route   GET /api/security/events
// @access  Private
const getSecurityEvents = asyncHandler(async (req, res) => {
  const userDevices = await Device.find({ userId: req.user._id });
  const deviceIds = userDevices.map(d => d.deviceId);
  
  const events = await SecurityEvent.find({ deviceId: { $in: deviceIds } }).sort('-timestamp');
  res.json(events);
});

// @desc    Create a new user-level security event
// @route   POST /api/security-events
// @access  Private
const createSecurityEvent = asyncHandler(async (req, res) => {
  const { userId, latitude, longitude, address, date, isWrong } = req.body;
  const imagePath = req.file ? req.file.path : null;

  if (!userId) {
    res.status(400);
    throw new Error('User ID is required');
  }

  const event = await SecurityEvent.create({
    userId,
    imagePath,
    latitude,
    longitude,
    address,
    date,
    isWrong,
  });

  res.status(201).json(event);
});

// @desc    Get user-level security events
// @route   GET /api/security-events/:userId
// @access  Private
const getUserSecurityEvents = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (req.user._id.toString() !== userId) {
    res.status(401);
    throw new Error('Not authorized to access these events');
  }

  const events = await SecurityEvent.find({ userId }).sort('-date');
  res.json(events);
});

module.exports = { 
  reportTheft, 
  logSecurityEvent, 
  getSecurityEvents,
  createSecurityEvent,
  getUserSecurityEvents
};
