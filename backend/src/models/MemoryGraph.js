const mongoose = require('mongoose');

const memoryGraphNodeSchema = new mongoose.Schema({
  nodeId: {
    type: String,
    required: true,
    unique: true
  },
  label: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Person', 'Place', 'Heirloom', 'Tradition', 'LifeEvent', 'SensoryCue'],
    default: 'Person'
  },
  culturalTitle: {
    type: String,
    default: ''
  },
  details: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'Users'
  },
  provenance: {
    verifiedBy: {
      type: String,
      default: 'Deepak Baruah (Son & Primary Caregiver)'
    },
    verificationDate: {
      type: Date,
      default: Date.now
    },
    sourceDocument: {
      type: String,
      default: 'Family Archive & Verbal Confirmation'
    },
    trustScore: {
      type: Number,
      default: 0.98,
      min: 0,
      max: 1
    },
    isGroundTruth: {
      type: Boolean,
      default: true
    }
  },
  attributes: {
    type: Map,
    of: String,
    default: {}
  }
}, { timestamps: true });

const memoryGraphEdgeSchema = new mongoose.Schema({
  edgeId: {
    type: String,
    required: true,
    unique: true
  },
  sourceNodeId: {
    type: String,
    required: true
  },
  targetNodeId: {
    type: String,
    required: true
  },
  relationshipType: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  context: {
    type: String,
    default: ''
  },
  strength: {
    type: Number,
    default: 1.0
  },
  provenance: {
    verifiedBy: {
      type: String,
      default: 'Deepak Baruah (Son)'
    },
    verificationDate: {
      type: Date,
      default: Date.now
    },
    confidence: {
      type: Number,
      default: 0.99
    }
  }
}, { timestamps: true });

const MemoryGraphNode = mongoose.model('MemoryGraphNode', memoryGraphNodeSchema);
const MemoryGraphEdge = mongoose.model('MemoryGraphEdge', memoryGraphEdgeSchema);

module.exports = {
  MemoryGraphNode,
  MemoryGraphEdge
};
