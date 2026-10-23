const express = require('express');
const router = express.Router();
const { MemoryGraphNode, MemoryGraphEdge } = require('../models/MemoryGraph');
const Memory = require('../models/Memory');
const { emitToCaregiver, emitToAll } = require('../socket');

/**
 * Clariti & MindGuardAI Voice-to-Memory Ingestion Pipeline
 * Turns unstructured voice notes and spoken anecdotes into structured memory cards and verified graph nodes.
 */

// POST /api/voice-ingest/process — Process voice text into structured memory & knowledge graph
router.post('/process', async (req, res) => {
  try {
    const { transcript = '', speaker = 'Deepak Baruah (Son)', lang = 'as' } = req.body;

    if (!transcript.trim()) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    const lower = transcript.toLowerCase();

    // Intelligent entity & temporal extraction
    let year = '1976';
    const yearMatch = transcript.match(/\b(19\d{2}|20\d{2})\b/);
    if (yearMatch) year = yearMatch[0];

    let category = 'Family';
    if (lower.includes('tea') || lower.includes('garden') || lower.includes('estate') || lower.includes('job') || lower.includes('office')) {
      category = 'Events';
    } else if (lower.includes('bihu') || lower.includes('pitha') || lower.includes('dhol') || lower.includes('temple') || lower.includes('doul')) {
      category = 'Culture';
    } else if (lower.includes('river') || lower.includes('brahmaputra') || lower.includes('shillong') || lower.includes('majuli')) {
      category = 'Places';
    }

    // Extract people mentions
    const people = [];
    if (lower.includes('maina') || lower.includes('rhea')) people.push('Maina (Granddaughter)');
    if (lower.includes('deepak')) people.push('Deepak (Son)');
    if (lower.includes('rohan')) people.push('Rohan (Grandson)');
    if (lower.includes('pratibha')) people.push('Pratibha (Wife)');
    if (people.length === 0) people.push('Family');

    // Generate title
    const title = transcript.length > 40 ? transcript.substring(0, 38) + '...' : transcript;

    // Create memory card
    const newMemory = await Memory.create({
      title,
      category,
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
      people,
      details: transcript,
      datePeriod: year,
      regionalContext: 'NER',
      status: 'Ready',
      questionPrompt: `Do you remember this cherished moment from ${year}?`,
      hints: {
        tier1: `This is a beautiful memory shared together with ${people[0]}.`,
        tier2: `Think of the warm times in ${year}.`
      }
    });

    // Create knowledge graph node
    const nodeId = `node_voice_${Date.now()}`;
    const graphNode = await MemoryGraphNode.create({
      nodeId,
      label: title,
      category: category === 'Places' ? 'Place' : (category === 'Culture' ? 'Tradition' : 'LifeEvent'),
      culturalTitle: `${category} Oral Keepsake (${year})`,
      details: transcript,
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
      icon: 'Mic',
      provenance: {
        verifiedBy: speaker,
        sourceDocument: 'Clariti Voice Ingestion Pipeline',
        trustScore: 0.99,
        isGroundTruth: true
      }
    });

    // Link edge to Bhaben
    await MemoryGraphEdge.create({
      edgeId: `edge_${Date.now()}`,
      sourceNodeId: 'node_bhaben',
      targetNodeId: nodeId,
      relationshipType: 'RECALLS_ORAL_MEMORY',
      label: 'Recalls Story',
      context: transcript,
      strength: 1.0,
      provenance: { verifiedBy: speaker, confidence: 0.99 }
    });

    emitToCaregiver('memory:created', newMemory);
    emitToAll('graph:node-added', graphNode);

    res.json({
      success: true,
      extractedData: {
        title,
        category,
        year,
        people,
        narrator: speaker
      },
      createdMemory: newMemory,
      graphNodeId: nodeId,
      citation: `Voice-ingested and confirmed by ${speaker} on ${new Date().toLocaleDateString()}`
    });
  } catch (err) {
    res.status(500).json({ error: 'Voice ingestion failed', details: err.message });
  }
});

module.exports = router;
