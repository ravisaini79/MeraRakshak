const CallLog = require('../models/CallLog');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create a new call log entry
// @route   POST /api/call-logs
// @access  Private
const createCallLog = asyncHandler(async (req, res) => {
  const { userId, userCallNumber, date, duration, callType } = req.body;

  if (!userId || !userCallNumber) {
    res.status(400);
    throw new Error('Please provide userId and userCallNumber');
  }

  const callLog = await CallLog.create({
    userId,
    userCallNumber,
    date,
    duration,
    callType,
  });

  res.status(201).json(callLog);
});

// @desc    Get call logs for a specific user with optional filtering
// @route   GET /api/call-logs/:userId?type=missed
// @access  Private
const getUserCallLogs = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { type } = req.query;

  if (req.user._id.toString() !== userId) {
    res.status(401);
    throw new Error('Not authorized to access these call logs');
  }

  const query = { userId };
  if (type) {
    query.callType = type;
  }

  const callLogs = await CallLog.find(query).sort({ date: -1, createdAt: -1 });

  res.json(callLogs);
});

module.exports = {
  createCallLog,
  getUserCallLogs,
};
