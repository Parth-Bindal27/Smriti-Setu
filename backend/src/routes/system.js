const express = require('express');
const router = express.Router();
const os = require('os');
const seedData = require('../seed');
const ElderlyProfile = require('../models/ElderlyProfile');
const FamilyMember = require('../models/FamilyMember');
const Routine = require('../models/Routine');
const Reminder = require('../models/Reminder');
const GameSession = require('../models/GameSession');

// Helper to get local network IP
function getLocalNetworkIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      // IPv4 and non-internal
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

// GET system network info
router.get('/network', (req, res) => {
  const lanIp = getLocalNetworkIp();
  res.json({
    lanIp,
    caregiverAppUrl: `http://${lanIp}:3000`,
    elderlySiteUrl: `http://${lanIp}:3001`,
    backendApiUrl: `http://${lanIp}:5000`,
    localhostUrls: {
      caregiver: 'http://localhost:3000',
      elderly: 'http://localhost:3001',
      backend: 'http://localhost:5000',
      aiProxy: 'http://localhost:8000'
    }
  });
});

// POST reset and reseed demo data (fail-safe for demo)
router.post('/reset-demo', async (req, res) => {
  try {
    await Promise.all([
      ElderlyProfile.deleteMany({}),
      FamilyMember.deleteMany({}),
      Routine.deleteMany({}),
      Reminder.deleteMany({}),
      GameSession.deleteMany({})
    ]);

    await seedData();
    res.json({ success: true, message: 'Smriti Setu demo data reseeded successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const { saveSnapshot, restoreSnapshotIfEmpty, LATEST_SNAPSHOT_FILE } = require('../services/snapshotService');
const fs = require('fs');

// POST /api/system/snapshot/save — Save database state to disk snapshot
router.post('/snapshot/save', async (req, res) => {
  const result = await saveSnapshot(req.body.tag || 'manual_caregiver');
  res.json(result);
});

// POST /api/system/snapshot/restore — Force restore from disk snapshot
router.post('/snapshot/restore', async (req, res) => {
  if (!fs.existsSync(LATEST_SNAPSHOT_FILE)) {
    return res.status(404).json({ error: 'No snapshot file found on disk' });
  }
  const restored = await restoreSnapshotIfEmpty();
  res.json({ success: restored, message: 'Database restored from disk snapshot.' });
});

// GET /api/system/snapshot/status — Check latest snapshot metadata
router.get('/snapshot/status', (req, res) => {
  if (!fs.existsSync(LATEST_SNAPSHOT_FILE)) {
    return res.json({ exists: false, message: 'No snapshot recorded yet' });
  }
  try {
    const raw = fs.readFileSync(LATEST_SNAPSHOT_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    res.json({
      exists: true,
      timestamp: parsed.timestamp,
      version: parsed.version,
      tag: parsed.tag,
      counts: parsed.counts
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to read snapshot status', details: e.message });
  }
});

module.exports = router;
