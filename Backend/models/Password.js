const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries by user
passwordSchema.index({ userId: 1 });

module.exports = mongoose.model('Password', passwordSchema);