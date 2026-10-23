const express = require('express');
const router = express.Router();
const FamilyBoardPost = require('../models/FamilyBoardPost');
const { emitToCaregiver, emitToAll } = require('../socket');

// GET /api/family-board — Get posts (all for caregiver, approved-only for elder display)
router.get('/', async (req, res) => {
  try {
    const { role = 'elder' } = req.query;
    const query = role === 'caregiver' ? {} : { moderationStatus: 'Approved' };
    const posts = await FamilyBoardPost.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch family board posts', details: err.message });
  }
});

// POST /api/family-board/post — Family member submits a greeting/photo card
router.post('/post', async (req, res) => {
  try {
    const { authorName, relation, location, message, photoUrl, voiceAudioUrl } = req.body;

    // AI Dignity Filter: Check if message contains upsetting news, stressful inquiries, or clinical words
    const lower = (message || '').toLowerCase();
    const banned = ['hospital', 'critical', 'ill', 'passed away', 'death', 'dementia', 'alzheimer', 'debt'];
    let passed = true;
    for (const b of banned) {
      if (lower.includes(b)) {
        passed = false;
        break;
      }
    }

    const newPost = await FamilyBoardPost.create({
      authorName: authorName || 'Family Member',
      relation: relation || 'Loved One',
      location: location || 'Bangalore',
      message: message || 'Sending you warm love and blessings from afar!',
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
      voiceAudioUrl: voiceAudioUrl || '',
      moderationStatus: passed ? 'Approved' : 'Pending_Caregiver_Review',
      dignityCheckPassed: passed,
      pinnedForElderDisplay: passed
    });

    emitToCaregiver('familyboard:new-card', newPost);
    if (passed) {
      emitToAll('familyboard:approved-update', newPost);
    }

    res.json({ success: true, post: newPost, automatedCheck: passed ? 'PASSED_DIGNITY_FILTER' : 'HELD_FOR_REVIEW' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post', details: err.message });
  }
});

// PATCH /api/family-board/:id/moderate — Caregiver approves, edits or archives post
router.patch('/:id/moderate', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, caregiverNotes } = req.body;

    const post = await FamilyBoardPost.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (status) post.moderationStatus = status;
    if (caregiverNotes) post.caregiverNotes = caregiverNotes;
    await post.save();

    emitToAll('familyboard:approved-update', post);

    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update moderation status', details: err.message });
  }
});

module.exports = router;
