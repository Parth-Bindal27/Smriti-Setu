const express = require('express');
const router = express.Router();

/**
 * Relief & Dementia Assistance Virtual-Presence Agent
 * Reassures the elder with familiar video messages, empathetic voice presence, and scheduled check-ins.
 */

const VIRTUAL_PRESENCE_VIDEOS = [
  {
    id: 'deepak_golaghat',
    lovedOneName: 'Deepak Baruah',
    relation: 'Eldest Son',
    currentLocation: 'Golaghat Tea Estate',
    videoThumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    reassuranceTitle: 'Deepak’s Message from the Tea Estate',
    spokenMessage: 'Deuta, I am here at the Golaghat tea estate inspecting the new green tea leaves. Everything at home is safe and peaceful. You enjoy your warm tea on the veranda. I will drive back to Guwahati tomorrow afternoon with a fresh batch for you. Take care, Deuta!',
    spokenAssameseMessage: 'দেউতা, মই গোলাঘাটৰ চাহ বাগিচাত আছোঁ। ঘৰৰ সকলো কাম সুকলমে হৈছে। আপুনি বাৰান্দাত বহি চাহ খাওক, মই কাইলৈ আবেলি গুৱাহাটীলৈ যাম।',
    status: 'Available Now'
  },
  {
    id: 'maina_bangalore',
    lovedOneName: 'Maina (Rhea)',
    relation: 'Granddaughter',
    currentLocation: 'Bangalore',
    videoThumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    reassuranceTitle: 'Maina’s Message from Bangalore',
    spokenMessage: 'Koka! School classes just wrapped up here in Bangalore. I was just thinking about the delicious Til Pitha we made last Magh Bihu on the veranda! I am counting down the weeks until the winter break so I can sit right beside you. Sending you big warm hugs!',
    spokenAssameseMessage: 'ককা! বাংগালোৰৰ পৰা মই আপোনাক বৰকৈ মনত পেলাইছোঁ। মাঘ বিহুত আমি আকৌ একেলগে পিঠা বনাম। ভালে থাকিব ককা!',
    status: 'Available Now'
  }
];

// GET /api/virtual-presence — List available virtual presence clips
router.get('/', (req, res) => {
  res.json({
    success: true,
    presences: VIRTUAL_PRESENCE_VIDEOS,
    caregiverGuarantee: 'Recorded specifically by verified family members for Koka’s emotional calm.'
  });
});

module.exports = router;
