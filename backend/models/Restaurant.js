const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  cuisine: [{
    type: String,
    enum: ['North Indian', 'South Indian', 'Chinese', 'Fast Food', 'Desserts', 'Biryani', 'Bakery', 'Continental']
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4
  },
  reviews: {
    type: Number,
    default: 0
  },
  deliveryTime: {
    type: Number,
    required: true,
    default: 30
  },
  deliveryFee: {
    type: Number,
    default: 40
  },
  image: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  address: {
    type: String,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  minOrder: {
    type: Number,
    default: 0
  },
  offers: {
    type: String,
    default: ''
  },
  operatingHours: {
    open: {
      type: String,
      default: '09:00'
    },
    close: {
      type: String,
      default: '23:59'
    }
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
restaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
