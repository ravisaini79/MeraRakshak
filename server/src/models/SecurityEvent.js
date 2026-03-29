const mongoose = require('mongoose');

const securityEventSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  severity: { type: String, enum: ['CRITICAL', 'WARNING', 'INFO'], default: 'INFO' },
  photoUrl: { type: String },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SecurityEvent', securityEventSchema);
