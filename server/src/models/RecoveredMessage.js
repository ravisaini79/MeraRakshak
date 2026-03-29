const mongoose = require('mongoose');

const recoveredMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packageName: { type: String, required: true }, // e.g. com.whatsapp
  title: { type: String },
  message: { type: String },
  time: { type: String },
  date: { type: String },
  icon: { type: String },
  notificationId: { type: String },
  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('RecoveredMessage', recoveredMessageSchema);
