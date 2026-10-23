const mongoose = require('mongoose');

const ElderPreferencesSchema = new mongoose.Schema({
  elderId: {
    type: String,
    required: true,
    unique: true,
    default: 'elderly_bhaben_01'
  },
  language: {
    type: String,
    enum: ['as', 'bn', 'ne', 'hi', 'en'],
    default: 'as'
  },
  speechLanguage: {
    type: String,
    default: 'as-IN'
  },
  preferredInteractionMode: {
    type: String,
    enum: ['touch', 'voice', 'mixed'],
    default: 'mixed'
  },
  accessibilitySettings: {
    fontSize: {
      type: String,
      enum: ['standard', 'large', 'extra-large'],
      default: 'large'
    },
    highContrast: {
      type: Boolean,
      default: false
    },
    speechRate: {
      type: Number,
      default: 0.85,
      min: 0.6,
      max: 1.2
    },
    reducedMotion: {
      type: Boolean,
      default: false
    }
  },
  favoriteCategories: [{
    type: String,
    default: ['family_memories', 'music_culture', 'stories', 'nature', 'routines']
  }],
  excludedCategories: [{
    type: String,
    default: []
  }],
  preferredSessionDuration: {
    type: String,
    enum: ['short', 'standard', 'extended'],
    default: 'standard'
  },
  reminderSettings: {
    morningTeaReminder: { type: Boolean, default: true },
    eveningMusicReminder: { type: Boolean, default: true },
    routineAudioCue: { type: Boolean, default: true }
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ElderPreferences', ElderPreferencesSchema);
