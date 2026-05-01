const CallLog = require('../models/CallLog');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Add a new call log
// @route   POST /api/call-logs
// @access  Private
const addCallLog = asyncHandler(async (req, res) => {
  const { callerName, callerNo, callType, callDuration, dateTime } = req.body;

  if (!callerNo) {
    res.status(400);
    throw new Error('Please provide callerNo');
  }

  const callLog = await CallLog.create({
    userId: req.user._id,
    deviceId: req.deviceId,
    callerName,
    callerNo,
    callType,
    callDuration,
    dateTime,
  });

  res.status(201).json(callLog);
});

// @desc    Get call logs
// @route   GET /api/call-logs
// @access  Private
const getCallLogs = asyncHandler(async (req, res) => {
  const deviceId = req.query.deviceId || req.deviceId;

  if (!deviceId) {
    res.status(400);
    throw new Error('Device ID is required');
  }

  const callLogs = await CallLog.find({ userId: req.user._id, deviceId });
  res.json(callLogs);
});

module.exports = { addCallLog, getCallLogs };
