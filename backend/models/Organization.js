const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  visionMission: {
    vision: {
      type: String,
      required: true
    },
    mission: {
      type: [String],
      required: true
    }
  },
  logo: {
    type: String
  },
  contactInfo: {
    email: String,
    phone: String,
    address: String,
    socialMedia: {
      instagram: String,
      twitter: String,
      facebook: String,
      linkedin: String,
      website: String
    }
  },
  departments: [{
    name: String,
    description: String,
    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  history: {
    type: String
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization; 