const mongoose = require('mongoose');

const securityEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  image: { type: String }, // Cloudinary URL
  latitude: { type: Number },
  longitude: { type: Number },
  location: { type: String },
  tryType: { type: String, enum: ['wrong', 'unlock'] },
  dateTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SecurityEvent', securityEventSchema);
