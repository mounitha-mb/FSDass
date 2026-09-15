const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  servings: {
    type: Number,
    required: true,
    min: 1
  },
  foodType: {
    type: String,
    enum: ['Veg', 'Non-Veg'],
    required: true
  },
  preparationDate: {
    type: String,
    required: true
  },
  expiryDate: {
    type: String,
    required: true
  },
  pickupLocation: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  donorEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['Available', 'Requested', 'Completed'],
    default: 'Available'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Food', foodSchema);
