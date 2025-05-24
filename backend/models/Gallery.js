const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ['image', 'video', 'project', 'achievement', 'other'],
    default: 'image'
  },
  category: {
    type: String,
    default: 'general'
  },
  tags: [{
    type: String
  }],
  fileUrl: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String
  },
  metadata: {
    date: Date,
    location: String,
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    dimensions: String,
    fileSize: Number,
    duration: Number // for videos
  },
  contributors: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  projectDetails: {
    startDate: Date,
    endDate: Date,
    technologies: [String],
    liveUrl: String,
    repositoryUrl: String
  },
  achievementDetails: {
    awardedBy: String,
    awardDate: Date,
    level: {
      type: String,
      enum: ['local', 'regional', 'national', 'international'],
    },
    rank: String
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);

module.exports = GalleryItem; 