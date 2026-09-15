const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  },
  receiverEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  requestedDate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Requested', 'Completed'],
    default: 'Requested'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Request', requestSchema);
