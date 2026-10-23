const mongoose = require('mongoose');

const heirloomObjectSchema = new mongoose.Schema({
  objectId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  vernacularName: {
    type: String,
    default: '' // e.g. "কাঁহৰ কাঁহী-বাটি (Kahi-Bati)"
  },
  category: {
    type: String,
    enum: ['Pooja & Ritual', 'Kitchen & Tea', 'Attire & Textile', 'Keepsake & Tool', 'Music & Heritage'],
    default: 'Keepsake & Tool'
  },
  photoUrl: {
    type: String,
    required: true
  },
  tactileDescription: {
    type: String,
    default: ''
  },
  memoryStory: {
    type: String,
    required: true
  },
  storyNarrator: {
    type: String,
    default: 'Deepak Baruah'
  },
  associatedPerson: {
    type: String,
    default: ''
  },
  originYear: {
    type: String,
    default: '1972'
  },
  provenanceVerification: {
    verifiedBy: {
      type: String,
      default: 'Deepak Baruah (Son)'
    },
    verificationLevel: {
      type: String,
      default: 'Physical Heirloom in Guwahati Residence'
    }
  },
  voiceAudioSnippet: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('HeirloomObject', heirloomObjectSchema);
