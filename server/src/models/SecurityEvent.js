const mongoose = require('mongoose');

const securityEventSchema = new mongoose.Schema({
  // Legacy fields (from existing feature)
  deviceId: { type: String },
  type: { type: String },
  message: { type: String },
  severity: { type: String, enum: ['CRITICAL', 'WARNING', 'INFO'], default: 'INFO' },
  photoUrl: { type: String },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  timestamp: { type: Date, default: Date.now },

  // New advanced tracking fields
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imagePath: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  address: { type: String },
  date: { type: Date, default: Date.now },
  isWrong: { type: Boolean },
});

module.exports = mongoose.model('SecurityEvent', securityEventSchema);
