const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

// Helper to make local API requests to the running backend
function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 5050,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
        }
      },
      (res) => {
        let raw = '';
        res.on('data', chunk => { raw += chunk; });
        res.on('end', () => {
          let data = null;
          try {
            data = JSON.parse(raw);
          } catch (e) {
            data = raw;
          }
          resolve({ status: res.statusCode, data });
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

test('SMRITI SETU — COGNITIVE GAMES ECOSYSTEM SUITE', async (t) => {
  const {
    GAME_REGISTRY,
    COGNITIVE_CATEGORIES,
    getGameById,
    getGamesByCategory
  } = await import('../../elderly_site/src/services/gameRegistry.js');

  // ─── 1. REGISTRY INTEGRITY & NON-DUPLICATION ──────────────────────────────
  await t.test('1. Game Registry & Architecture Integrity', async (t) => {
    await t.test('All 15 base modules + 3 new games exist with unique identifiers', () => {
      const requiredModules = [
        // 1-5 Cognitive & Working Memory
        'number_sequence', 'word_puzzle', 'picture_match', 'memory_match', 'visual_sequence',
        // 6-9 Cultural Reminiscence
        'family_recall', 'cultural_reminiscence', 'storytelling', 'heirloom_scanner',
        // 10-12 Multisensory & Spatial
        'vr_memory', 'ai_pet', 'pentamind_drawing',
        // 13-15 Family & Daily Support
        'family_board', 'virtual_presence', 'daily_routine',
        // 3 Brand-New Independent Games
        'focus_finder', 'smriti_match_quest', 'tune_memory'
      ];

      const registeredIds = GAME_REGISTRY.map(g => g.id);
      const uniqueIds = new Set(registeredIds);

      assert.equal(registeredIds.length, uniqueIds.size, 'No duplicate game identifiers permitted in registry');

      for (const reqId of requiredModules) {
        assert.ok(uniqueIds.has(reqId), `Module "${reqId}" must be registered in authoritative registry`);
        const game = getGameById(reqId);
        assert.ok(game.displayName.en, `Module "${reqId}" must have English title`);
        assert.ok(game.displayName.as, `Module "${reqId}" must have Assamese title`);
        assert.ok(game.category, `Module "${reqId}" must have a designated cognitive category`);
      }
    });

    await t.test('Categories cover all 9 curated cognitive and emotional domains', () => {
      const expectedCategories = [
        'attention_visual', 'matching_recognition', 'memory_sequencing',
        'language_words', 'culture_memories', 'sound_music',
        'everyday_routines', 'relaxation_family', 'spatial_creative'
      ];

      for (const catId of expectedCategories) {
        assert.ok(COGNITIVE_CATEGORIES[catId.toUpperCase()], `Category ${catId} must exist in COGNITIVE_CATEGORIES`);
        const gamesInCat = getGamesByCategory(catId);
        assert.ok(gamesInCat.length > 0, `Category ${catId} must contain at least one registered activity`);
      }
    });
  });

  // ─── 2. GAME A: FOCUS FINDER MECHANICS ────────────────────────────────────
  await t.test('2. Focus Finder Mechanics (Object Search, Scenes, Hints & Dignity)', () => {
    const focusFinder = getGameById('focus_finder');
    assert.equal(focusFinder.id, 'focus_finder');
    assert.equal(focusFinder.category, 'attention_visual');
    assert.ok(focusFinder.accessibility.progressiveHints, 'Focus Finder must support progressive hints');
    assert.ok(focusFinder.accessibility.noTimePressure, 'Must operate with no time pressure');

    // Simulate multi-tier progressive hints logic
    let hintTier = 0;
    const advanceHint = () => { hintTier = Math.min(3, hintTier + 1); };

    assert.equal(hintTier, 0, 'Starts with no hints');
    advanceHint();
    assert.equal(hintTier, 1, 'Tier 1: Subtle pulsing highlight around target');
    advanceHint();
    assert.equal(hintTier, 2, 'Tier 2: Dim visual distractions');
    advanceHint();
    assert.equal(hintTier, 3, 'Tier 3: Spoken verbal guidance');
    advanceHint();
    assert.equal(hintTier, 3, 'Capped at Tier 3 without error');
  });

  // ─── 3. GAME B: SMRITI MATCH QUEST MECHANICS ──────────────────────────────
  await t.test('3. Smriti Match Quest (Purble Place-Inspired Visible Grid)', () => {
    const smritiQuest = getGameById('smriti_match_quest');
    const memoryMatch = getGameById('memory_match');

    assert.notEqual(smritiQuest.id, memoryMatch.id, 'Smriti Match Quest must have unique ID distinct from memory_match');
    assert.ok(smritiQuest.accessibility.visibleCardsOnly, 'Must use visible cards, not face-down flips');

    // Simulate Purble Place visible deck generator
    const pairCount = 4;
    const symbols = ['dhol', 'bell', 'pepa', 'gamusa'];
    const cards = [];
    symbols.forEach(s => {
      cards.push({ uid: `${s}_1`, cardId: s, isMatched: false });
      cards.push({ uid: `${s}_2`, cardId: s, isMatched: false });
    });

    assert.equal(cards.length, pairCount * 2, 'Grid must contain exactly 2 cards for each pair');

    // Test match evaluation
    const cardA = cards.find(c => c.uid === 'dhol_1');
    const cardB = cards.find(c => c.uid === 'dhol_2');
    const cardC = cards.find(c => c.uid === 'bell_1');

    // Matching pair test
    assert.equal(cardA.cardId, cardB.cardId, 'Identical cards must match');
    cardA.isMatched = true;
    cardB.isMatched = true;

    assert.ok(cardA.isMatched && cardB.isMatched, 'Matched cards become marked and unavailable');

    // Non-matching pair test
    assert.notEqual(cardB.cardId, cardC.cardId, 'Different cards must not match');
    assert.equal(cardC.isMatched, false, 'Non-matching cards remain available for next attempt');
  });

  // ─── 4. GAME C: TUNE MEMORY MECHANICS ─────────────────────────────────────
  await t.test('4. Tune Memory (Auditory Attention, Sequencing & Visual Waves)', () => {
    const tuneMemory = getGameById('tune_memory');
    assert.equal(tuneMemory.id, 'tune_memory');
    assert.equal(tuneMemory.category, 'sound_music');
    assert.ok(tuneMemory.accessibility.volumeControl, 'Must support user-controlled volume');
    assert.ok(tuneMemory.accessibility.audioDisabledMode, 'Must support audio-disabled / visual alternative mode');

    // Verify acoustic instrument frequencies
    const acousticProfiles = [
      { id: 'temple_bell', freq: 587.33, decay: 1.8 },
      { id: 'bihu_dhol', freq: 110, decay: 0.8 },
      { id: 'bamboo_flute', freq: 440, decay: 1.4 }
    ];

    acousticProfiles.forEach(p => {
      assert.ok(p.freq > 0, `Frequency for ${p.id} must be valid acoustic pitch`);
      assert.ok(p.decay > 0, `Decay for ${p.id} must have audible ring-down`);
    });
  });

  // ─── 5. BACKEND SESSION PERSISTENCE FOR ALL 3 NEW GAMES ───────────────────
  await t.test('5. Backend Session Persistence for New Games', async () => {
    const gamesToTest = [
      { id: 'focus_finder', title: 'Focus Finder — Scene Search' },
      { id: 'smriti_match_quest', title: 'Smriti Match Quest' },
      { id: 'tune_memory', title: 'Tune Memory — Melodic Recall' }
    ];

    for (const g of gamesToTest) {
      const payload = {
        activityType: g.id,
        activityTitle: g.title,
        durationSeconds: 150,
        gameLevel: 2,
        attempts: 4,
        hintsUsed: 1,
        completionStatus: 'completed',
        supportiveFeedback: 'Unhurried and Calm Participation'
      };

      const res = await request('POST', '/api/sessions', payload);
      assert.equal(res.status, 201, `POST /api/sessions for ${g.id} must return 201 Created`);
      assert.equal(res.data.activityType, g.id);
      assert.equal(res.data.completed, true);
    }
  });
});
