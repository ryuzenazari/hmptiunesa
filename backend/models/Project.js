const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'planned'],
    default: 'ongoing'
  },
  thumbnail: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  team: [{
    name: String,
    role: String,
    studentId: String
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  links: {
    github: String,
    website: String,
    documentation: String
  },
  achievements: [{
    title: String,
    description: String,
    date: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema); 