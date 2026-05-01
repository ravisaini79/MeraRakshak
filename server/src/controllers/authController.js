const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Device = require('../models/Device');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, mobile, password, address, imeiNo, deviceModel, deviceName } = req.body;

  if (!fullName || !email || !mobile || !password || !imeiNo) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const userExists = await User.findOne({ $or: [{ email }, { mobile }] });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    fullName,
    email,
    mobile,
    password,
    address,
  });

  if (user) {
    // Create the first device
    const device = await Device.create({
      userId: user._id,
      imeiNo,
      deviceModel,
      deviceName,
    });

    res.status(201).json({
      userId: user._id,
      deviceId: device._id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      token: generateToken(user._id, device._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, imeiNo, deviceModel, deviceName } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (user.isBlocked) {
      res.status(403);
      throw new Error('User is blocked');
    }

    let deviceId = null;

    // Check device using imeiNo if provided (mobile login)
    if (imeiNo) {
      let device = await Device.findOne({ imeiNo });
      if (!device) {
        device = await Device.create({
          userId: user._id,
          imeiNo,
          deviceModel,
          deviceName,
        });
      } else {
        // Ensure the device belongs to the user
        if (device.userId.toString() !== user._id.toString()) {
          device.userId = user._id;
          await device.save();
        }
      }
      deviceId = device._id;
    }

    res.json({
      userId: user._id,
      deviceId: deviceId,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      token: generateToken(user._id, deviceId),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const generateToken = (userId, deviceId) => {
  const payload = { userId };
  if (deviceId) payload.deviceId = deviceId;

  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

module.exports = { registerUser, loginUser };
