const mongoose = require('mongoose');

const caregiverJournalSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  timeOfDay: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening (Sundowning Period)', 'Night'],
    default: 'Evening (Sundowning Period)'
  },
  observation: {
    type: String,
    required: true
  },
  elderMood: {
    type: String,
    enum: ['Calm & Joyful', 'Slightly Confused', 'Anxious / Restless', 'Agitated / Pacing', 'Withdrawn / Fatigued'],
    default: 'Calm & Joyful'
  },
  triggersIdentified: [{
    type: String
  }],
  deEscalationApplied: {
    protocolUsed: {
      type: String,
      default: 'Validation & Sensory Reminiscence'
    },
    actionTaken: String,
    outcome: {
      type: String,
      enum: ['Resolved Calmly', 'Partial Soothing', 'Required Caregiver Presence', 'Escalated to Rest Period'],
      default: 'Resolved Calmly'
    }
  },
  aiCouncilAnalysis: {
    clinicalInsight: String,
    empathySuggestion: String,
    factVerificationNote: String,
    recommendedNextStep: String
  },
  caregiverName: {
    type: String,
    default: 'Deepak Baruah'
  }
}, { timestamps: true });

module.exports = mongoose.model('CaregiverJournal', caregiverJournalSchema);
