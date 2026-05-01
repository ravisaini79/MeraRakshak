const SecurityEvent = require('../models/SecurityEvent');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Add intruder selfie / security event
// @route   POST /api/security-events
// @access  Private
const addSecurityEvent = asyncHandler(async (req, res) => {
  const { dateTime, location, tryType, imeiNo, deviceModel } = req.body;
  const image = req.file ? req.file.path : null;

  // We are bypassing responseFormatter logic specifically for this return structure
  if (!image) {
    return res.json({ status: 0, message: "Selfie image is missing" });
  }

  // We can trust req.deviceId from the auth token, but if they pass imeiNo we can use it to verify
  // or just directly save the event
  const event = await SecurityEvent.create({
    userId: req.user._id,
    deviceId: req.deviceId, 
    image, // This comes from selfieImg parameter
    location,
    tryType,
    dateTime,
  });

  // Explicitly return status: 1 and message to bypass standard formatter rules or be reformatted correctly
  res.json({
    status: 1,
    message: "Security event and selfie has been recorded successfully",
    event: event
  });
});

// @desc    Get security events
// @route   GET /api/security-events
// @access  Private
const getSecurityEvents = asyncHandler(async (req, res) => {
  const deviceId = req.query.deviceId || req.deviceId;

  if (!deviceId) {
    res.status(400);
    throw new Error('Device ID is required');
  }

  const events = await SecurityEvent.find({ userId: req.user._id, deviceId });
  res.json(events);
});

module.exports = { addSecurityEvent, getSecurityEvents };
