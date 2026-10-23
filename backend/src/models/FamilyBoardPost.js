const mongoose = require('mongoose');

const familyBoardPostSchema = new mongoose.Schema({
  authorName: {
    type: String,
    required: true
  },
  relation: {
    type: String,
    default: 'Granddaughter'
  },
  location: {
    type: String,
    default: 'Bangalore'
  },
  message: {
    type: String,
    required: true
  },
  voiceAudioUrl: {
    type: String,
    default: ''
  },
  photoUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600'
  },
  moderationStatus: {
    type: String,
    enum: ['Approved', 'Pending_Caregiver_Review', 'Archived'],
    default: 'Approved'
  },
  dignityCheckPassed: {
    type: Boolean,
    default: true
  },
  pinnedForElderDisplay: {
    type: Boolean,
    default: true
  },
  caregiverNotes: {
    type: String,
    default: 'Verified from Rhea in Bangalore.'
  }
}, { timestamps: true });

module.exports = mongoose.model('FamilyBoardPost', familyBoardPostSchema);
