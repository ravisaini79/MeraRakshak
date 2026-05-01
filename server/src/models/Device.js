const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imeiNo: { type: String, required: true, unique: true },
  deviceModel: { type: String },
  deviceName: { type: String },
  battery: { type: Number },
  lastSeen: { type: Date, default: Date.now },
  latitude: { type: Number },
  longitude: { type: Number },
  location: { type: String },
  status: { type: String, enum: ['active', 'stolen'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Device', deviceSchema);
