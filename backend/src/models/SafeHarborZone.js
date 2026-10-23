const mongoose = require('mongoose');

const safeHarborZoneSchema = new mongoose.Schema({
  zoneId: {
    type: String,
    required: true,
    unique: true
  },
  zoneName: {
    type: String,
    required: true
  },
  zoneType: {
    type: String,
    enum: ['Primary_Safe', 'Secondary_Safe', 'Caution_Transition', 'Perimeter_Boundary'],
    default: 'Primary_Safe'
  },
  locationDescription: {
    type: String,
    default: 'Guwahati Residence'
  },
  coordinates: {
    lat: { type: Number, default: 26.1445 },
    lng: { type: Number, default: 91.7362 },
    radiusMeters: { type: Number, default: 45 }
  },
  activeHours: {
    start: { type: String, default: '06:00' },
    end: { type: String, default: '20:30' }
  },
  currentStatus: {
    type: String,
    enum: ['Inside Safe Haven', 'In Veranda/Garden', 'Departing Perimeter', 'Safe Return Confirmed'],
    default: 'Inside Safe Haven'
  },
  wanderingRiskScore: {
    type: Number,
    default: 12, // 0 - 100
    min: 0,
    max: 100
  },
  lastPingTime: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('SafeHarborZone', safeHarborZoneSchema);
