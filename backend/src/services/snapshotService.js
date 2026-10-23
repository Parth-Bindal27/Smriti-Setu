/**
 * SMRITI SETU (স্মৃতি সেতু) — SERVER-SIDE SNAPSHOT & PERSISTENCE SERVICE
 * Saves and restores complete database states to disk to prevent data loss across restarts.
 */

const fs = require('fs');
const path = require('path');

const ElderlyProfile = require('../models/ElderlyProfile');
const Memory = require('../models/Memory');
const CaregiverJournal = require('../models/CaregiverJournal');
const { MemoryGraphNode, MemoryGraphEdge } = require('../models/MemoryGraph');
const SafeHarborZone = require('../models/SafeHarborZone');
const VoiceBiomarker = require('../models/VoiceBiomarker');
const HeirloomObject = require('../models/HeirloomObject');
const FamilyBoardPost = require('../models/FamilyBoardPost');
const Routine = require('../models/Routine');
const GameSession = require('../models/GameSession');
const { AssessmentQuestion, AssessmentLog } = require('../models/Assessment');

const SNAPSHOT_DIR = path.join(__dirname, '../../data/snapshots');
const LATEST_SNAPSHOT_FILE = path.join(SNAPSHOT_DIR, 'latest_snapshot.json');

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Save complete MongoDB snapshot to disk as formatted JSON
 */
async function saveSnapshot(tag = 'auto') {
  try {
    ensureDirectoryExists(SNAPSHOT_DIR);

    const [
      profiles,
      memories,
      journals,
      nodes,
      edges,
      zones,
      biomarkers,
      heirlooms,
      posts,
      routines,
      sessions,
      assessmentQuestions,
      assessmentLogs
    ] = await Promise.all([
      ElderlyProfile.find().lean(),
      Memory.find().lean(),
      CaregiverJournal.find().lean(),
      MemoryGraphNode.find().lean(),
      MemoryGraphEdge.find().lean(),
      SafeHarborZone.find().lean(),
      VoiceBiomarker.find().lean(),
      HeirloomObject.find().lean(),
      FamilyBoardPost.find().lean(),
      Routine.find().lean(),
      GameSession.find().lean(),
      AssessmentQuestion.find().lean(),
      AssessmentLog.find().lean()
    ]);

    const payload = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      tag,
      counts: {
        profiles: profiles.length,
        memories: memories.length,
        journals: journals.length,
        graphNodes: nodes.length,
        graphEdges: edges.length,
        zones: zones.length,
        biomarkers: biomarkers.length,
        heirlooms: heirlooms.length,
        posts: posts.length,
        routines: routines.length,
        sessions: sessions.length,
        assessmentQuestions: assessmentQuestions.length,
        assessmentLogs: assessmentLogs.length
      },
      data: {
        profiles,
        memories,
        journals,
        nodes,
        edges,
        zones,
        biomarkers,
        heirlooms,
        posts,
        routines,
        sessions,
        assessmentQuestions,
        assessmentLogs
      }
    };

    fs.writeFileSync(LATEST_SNAPSHOT_FILE, JSON.stringify(payload, null, 2), 'utf8');
    console.log(`[Snapshot] Database snapshot saved successfully (${payload.counts.memories} memories, ${payload.counts.graphNodes} nodes)`);
    return { success: true, timestamp: payload.timestamp, counts: payload.counts };
  } catch (err) {
    console.error('[Snapshot] Failed to write database snapshot:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Restore from latest snapshot if database is empty
 */
async function restoreSnapshotIfEmpty() {
  try {
    if (!fs.existsSync(LATEST_SNAPSHOT_FILE)) {
      console.log('[Snapshot] No prior snapshot file found. Proceeding to initial seed.');
      return false;
    }

    const memoryCount = await Memory.countDocuments();
    if (memoryCount > 0) {
      console.log(`[Snapshot] Database already contains ${memoryCount} records. Skipping restore.`);
      return true;
    }

    console.log(`[Snapshot] Empty database detected. Restoring from ${LATEST_SNAPSHOT_FILE}...`);
    const content = fs.readFileSync(LATEST_SNAPSHOT_FILE, 'utf8');
    const snapshot = JSON.parse(content);
    const d = snapshot.data;

    if (!d) return false;

    if (d.profiles?.length) await ElderlyProfile.insertMany(d.profiles);
    if (d.memories?.length) await Memory.insertMany(d.memories);
    if (d.journals?.length) await CaregiverJournal.insertMany(d.journals);
    if (d.nodes?.length) await MemoryGraphNode.insertMany(d.nodes);
    if (d.edges?.length) await MemoryGraphEdge.insertMany(d.edges);
    if (d.zones?.length) await SafeHarborZone.insertMany(d.zones);
    if (d.biomarkers?.length) await VoiceBiomarker.insertMany(d.biomarkers);
    if (d.heirlooms?.length) await HeirloomObject.insertMany(d.heirlooms);
    if (d.posts?.length) await FamilyBoardPost.insertMany(d.posts);
    if (d.routines?.length) await Routine.insertMany(d.routines);
    if (d.sessions?.length) await GameSession.insertMany(d.sessions);
    if (d.assessmentQuestions?.length) await AssessmentQuestion.insertMany(d.assessmentQuestions);
    if (d.assessmentLogs?.length) await AssessmentLog.insertMany(d.assessmentLogs);

    console.log(`[Snapshot] Restored ${d.memories?.length || 0} memories & ${d.nodes?.length || 0} graph nodes from disk snapshot!`);
    return true;
  } catch (err) {
    console.warn('[Snapshot] Restore notice:', err.message);
    return false;
  }
}

module.exports = {
  saveSnapshot,
  restoreSnapshotIfEmpty,
  LATEST_SNAPSHOT_FILE
};
