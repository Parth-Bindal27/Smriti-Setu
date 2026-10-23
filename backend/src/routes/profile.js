const express = require('express');
const router = express.Router();
const ElderlyProfile = require('../models/ElderlyProfile');

const ElderPreferences = require('../models/ElderPreferences');

// GET profile
router.get('/', async (req, res) => {
  try {
    let profile = await ElderlyProfile.findOne();
    if (!profile) {
      profile = await ElderlyProfile.create({
        name: 'Bhaben Baruah',
        honorific: 'Koka'
      });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update profile
router.put('/', async (req, res) => {
  try {
    let profile = await ElderlyProfile.findOne();
    if (!profile) {
      profile = new ElderlyProfile(req.body);
    } else {
      Object.assign(profile, req.body);
    }
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET elder preferences
router.get('/preferences', async (req, res) => {
  try {
    const elderId = req.query.elderId || 'elderly_bhaben_01';
    let prefs = await ElderPreferences.findOne({ elderId });
    if (!prefs) {
      prefs = await ElderPreferences.create({
        elderId,
        language: 'as',
        speechLanguage: 'as-IN',
        preferredInteractionMode: 'mixed',
        accessibilitySettings: {
          fontSize: 'large',
          highContrast: false,
          speechRate: 0.85,
          reducedMotion: false
        },
        favoriteCategories: ['family_memories', 'music_culture', 'stories', 'nature', 'routines'],
        excludedCategories: [],
        preferredSessionDuration: 'standard',
        reminderSettings: {
          morningTeaReminder: true,
          eveningMusicReminder: true,
          routineAudioCue: true
        }
      });
    }
    res.json(prefs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update elder preferences
router.put('/preferences', async (req, res) => {
  try {
    const elderId = req.body.elderId || 'elderly_bhaben_01';
    let prefs = await ElderPreferences.findOne({ elderId });
    if (!prefs) {
      prefs = new ElderPreferences({ elderId, ...req.body });
    } else {
      if (req.body.language) prefs.language = req.body.language;
      if (req.body.speechLanguage) prefs.speechLanguage = req.body.speechLanguage;
      if (req.body.preferredInteractionMode) prefs.preferredInteractionMode = req.body.preferredInteractionMode;
      if (req.body.accessibilitySettings) {
        prefs.accessibilitySettings = { ...prefs.accessibilitySettings.toObject(), ...req.body.accessibilitySettings };
      }
      if (req.body.favoriteCategories) prefs.favoriteCategories = req.body.favoriteCategories;
      if (req.body.excludedCategories) prefs.excludedCategories = req.body.excludedCategories;
      if (req.body.preferredSessionDuration) prefs.preferredSessionDuration = req.body.preferredSessionDuration;
      if (req.body.reminderSettings) {
        prefs.reminderSettings = { ...prefs.reminderSettings.toObject(), ...req.body.reminderSettings };
      }
      prefs.version = (prefs.version || 1) + 1;
    }
    await prefs.save();

    // Broadcast update via Socket.IO for real-time live synchronization
    const io = req.app.get('io');
    if (io) {
      io.emit('preferences:updated', prefs);
      io.emit('caregiver:preferences-updated', prefs);
    }

    // Broadcast via WS
    try {
      const { broadcast } = require('../websocket');
      if (typeof broadcast === 'function') {
        broadcast({
          type: 'PREFERENCES_UPDATED',
          preferences: prefs
        });
      }
    } catch (wsErr) {}

    res.json(prefs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
