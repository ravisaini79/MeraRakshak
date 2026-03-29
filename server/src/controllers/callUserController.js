const CallUser = require('../models/CallUser');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Add a frequent caller / CallUser
// @route   POST /api/call-users
// @access  Private
const createCallUser = asyncHandler(async (req, res) => {
  const { userId, callerName, callerImg, callNumber } = req.body;

  if (!userId || !callNumber) {
    res.status(400);
    throw new Error('Please provide userId and callNumber');
  }

  const callUser = await CallUser.create({
    userId,
    callerName,
    callerImg,
    callNumber,
  });

  res.status(201).json(callUser);
});

// @desc    Get all CallUsers for a specific user
// @route   GET /api/call-users/:userId
// @access  Private
const getUserCallUsers = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (req.user._id.toString() !== userId) {
    res.status(401);
    throw new Error('Not authorized to access these call users');
  }

  const callUsers = await CallUser.find({ userId }).sort('-createdAt');

  res.json(callUsers);
});

module.exports = {
  createCallUser,
  getUserCallUsers,
};
