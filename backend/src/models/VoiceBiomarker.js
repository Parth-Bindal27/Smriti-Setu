const mongoose = require('mongoose');

const voiceBiomarkerSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  sessionType: {
    type: String,
    enum: ['MemoryLane', 'StoryRecall', 'AIPetChat', 'DailyAssessment', 'HeirloomStory'],
    default: 'MemoryLane'
  },
  timeOfDay: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Twilight/Evening', 'Night'],
    default: 'Morning'
  },
  metrics: {
    speechLatencyMs: {
      type: Number,
      default: 1450,
      min: 200,
      max: 15000
    },
    pauseToSpeechRatio: {
      type: Number,
      default: 0.28,
      min: 0,
      max: 1
    },
    hesitationMarkersCount: {
      type: Number,
      default: 2,
      min: 0
    },
    semanticRetrievalSeconds: {
      type: Number,
      default: 3.2,
      min: 0
    },
    acousticComfortIndex: {
      type: Number,
      default: 88, // 0 - 100
      min: 0,
      max: 100
    },
    diurnalFatigueFlag: {
      type: Boolean,
      default: false
    }
  },
  notes: {
    type: String,
    default: 'Acoustic cadence calm and steady during Bihu reminiscence.'
  }
}, { timestamps: true });

module.exports = mongoose.model('VoiceBiomarker', voiceBiomarkerSchema);
