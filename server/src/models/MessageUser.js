const mongoose = require('mongoose');

const messageUserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String },
  lastMessage: { type: String },
  time: { type: String },
  icon: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('MessageUser', messageUserSchema);
