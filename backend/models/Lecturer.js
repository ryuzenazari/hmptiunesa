const mongoose = require('mongoose');

const lecturerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nip: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  photo: {
    type: String,
    default: ''
  },
  education: {
    type: String,
    required: true
  },
  research: [{
    title: String,
    year: Number,
    description: String
  }],
  biography: {
    type: String,
    required: true
  },
  socialMedia: {
    website: String,
    linkedin: String,
    googleScholar: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Lecturer', lecturerSchema); 