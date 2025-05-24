const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['seminar', 'webinar', 'workshop', 'competition', 'general', 'internal', 'external', 'training', 'other'],
    default: 'general'
  },
  thumbnail: {
    type: String
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  capacity: {
    type: Number
  },
  speaker: {
    type: String
  },
  level: {
    type: String,
    enum: ['Pemula', 'Menengah', 'Mahir', 'Semua Level'],
    default: 'Semua Level'
  },
  htm: {
    type: String
  },
  htm_note: {
    type: String
  },
  formUrl: {
    type: String
  },
  contacts: [{
    name: String,
    phone: String
  }],
  organizers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  documents: [{
    title: String,
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 