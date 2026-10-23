const mongoose = require('mongoose');

const HealthAnomalySchema = new mongoose.Schema({
  elderlyId: { type: String, default: 'elderly_bhaben_01' },
  type: {
    type: String,
    enum: [
      'speech_slur_aphasia',
      'motor_tap_asymmetry',
      'visual_spatial_neglect',
      'acute_orientation_drop',
      'reported_headache_dizziness',
      'composite_stroke_warning'
    ],
    required: true
  },
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'critical'],
    default: 'mild'
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  symptomOnsetDate: { type: Date, default: () => new Date() },
  persistenceHours: { type: Number, default: 0 },
  isPersistent: { type: Boolean, default: false },
  escalationTier: {
    type: Number,
    enum: [1, 2, 3], // 1: Mild Watch, 2: Persistent 48h Warning, 3: Acute Red Flag Emergency
    default: 1
  },
  beFastMarkers: {
    balance: { type: Boolean, default: false },
    eyes: { type: Boolean, default: false },
    face: { type: Boolean, default: false },
    arms: { type: Boolean, default: false },
    speech: { type: Boolean, default: false },
    timeMinutes: { type: Number, default: 0 }
  },
  metrics: {
    speechHesitationScore: { type: Number, default: 0 }, // 0-100 slur/hesitation index
    tapLatencyMs: { type: Number, default: 0 },
    tapSymmetryRatio: { type: Number, default: 1.0 }, // 1.0 = balanced, <0.6 = unilateral deficit
    orientationAccuracyDelta: { type: Number, default: 0 } // drop in score e.g. -40%
  },
  status: {
    type: String,
    enum: ['active', 'monitoring', 'acknowledged', 'resolved'],
    default: 'active'
  },
  recommendedActions: [{ type: String }],
  actionsTaken: [{ type: String }],
  timestamp: { type: Date, default: () => new Date() }
}, { timestamps: true });

module.exports = mongoose.model('HealthAnomaly', HealthAnomalySchema);
