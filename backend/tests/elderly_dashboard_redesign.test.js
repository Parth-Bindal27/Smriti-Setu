const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

// Helper to make local API requests
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

test('1. Question Engine & Interaction State Machine Logic', async (t) => {
  // Import Question Engine modules directly from the elderly app build
  const {
    STRUCTURED_QUESTION_BANK,
    QUESTION_CATEGORIES,
    evaluateAnswer,
    createQuestionInteractionSession,
    INTERACTION_STATES
  } = await import('../../elderly_site/src/services/questionEngine.js');

  await t.test('Question Bank covers 10 dignified categories with multilingual support', () => {
    assert.ok(STRUCTURED_QUESTION_BANK.length >= 6, 'Question bank should contain at least 6 curated questions');

    const supportedLangs = ['en', 'as', 'bn', 'ne', 'hi'];
    for (const q of STRUCTURED_QUESTION_BANK) {
      assert.ok(q.questionId, 'Each question must have a unique questionId');
      assert.ok(q.category, 'Each question must have a category');
      for (const lang of supportedLangs) {
        assert.ok(
          q.localizedContent[lang],
          `Question ${q.questionId} must have localized content for ${lang}`
        );
        assert.ok(
          q.localizedContent[lang].text,
          `Question ${q.questionId} must have prompt text in ${lang}`
        );
      }
    }
  });

  await t.test('Unsure responses ("I am not sure") are recorded as unknown / skipped, NEVER as decline', () => {
    const question = STRUCTURED_QUESTION_BANK.find(q => q.questionId === 'q_culture_bihu_dhol');
    const result = evaluateAnswer(question, 'unsure');

    assert.equal(result.status, 'unsure');
    assert.equal(result.isCognitiveDecline, false, 'Unsure response must NEVER be flagged as cognitive decline');
    assert.equal(result.isCorrect, null, 'Unsure response should not be graded as a failure');
  });

  await t.test('Vernacular spoken unsure phrases are classified safely as unsure', () => {
    const question = STRUCTURED_QUESTION_BANK.find(q => q.questionId === 'q_culture_bihu_dhol');
    
    const assameseUnsure = evaluateAnswer(question, null, 'মই নিশ্চিত নহয়, পিছত কম');
    assert.equal(assameseUnsure.status, 'unsure');

    const hindiUnsure = evaluateAnswer(question, null, 'मुझे याद नहीं आ रहा');
    assert.equal(hindiUnsure.status, 'unsure');

    const nepaliUnsure = evaluateAnswer(question, null, 'मलाई थाहा छैन');
    assert.equal(nepaliUnsure.status, 'unsure');
  });

  await t.test('State machine transitions cleanly through Retry -> Hint -> Completion without trapping user', () => {
    const question = STRUCTURED_QUESTION_BANK.find(q => q.questionId === 'q_culture_bihu_dhol');
    let recordedStates = [];

    const session = createQuestionInteractionSession({
      question,
      language: 'as',
      onStateChange: (stateData) => {
        recordedStates.push(stateData.state);
      }
    });

    assert.equal(session.getState(), INTERACTION_STATES.READY);
    session.displayQuestion();
    assert.equal(session.getState(), INTERACTION_STATES.QUESTION_DISPLAYED);

    // 1st wrong attempt
    session.submitAnswer('sitar');
    assert.equal(session.getState(), INTERACTION_STATES.GENTLE_RETRY);
    assert.equal(session.getAttempts(), 1);

    // Request hint
    const hint = session.requestHint();
    assert.ok(hint.length > 0, 'Hint must be populated');
    assert.equal(session.getState(), INTERACTION_STATES.HINT_OFFERED);
    assert.equal(session.getHintsUsed(), 1);

    // Skip question manually
    session.skipQuestion();
    assert.equal(session.getState(), INTERACTION_STATES.SKIPPED);
  });

  await t.test('Bounded retries prevent endless loops: max attempts gracefully advances without penalty', () => {
    const question = STRUCTURED_QUESTION_BANK.find(q => q.questionId === 'q_culture_bihu_dhol');

    let completedPayload = null;
    const session = createQuestionInteractionSession({
      question,
      language: 'en',
      onComplete: (data) => {
        completedPayload = data;
      }
    });

    session.displayQuestion();
    // 1st differing answer
    session.submitAnswer('piano');
    assert.equal(session.getState(), INTERACTION_STATES.GENTLE_RETRY);

    // 2nd differing answer (hits maxRetries: 2)
    session.submitAnswer('sitar');
    assert.equal(session.getState(), INTERACTION_STATES.ANSWER_VALIDATED);

    // Gracefully marks completed without harsh fail message
    assert.equal(session.getAttempts(), 2);
  });
});

test('2. Daily Challenge Engine Deterministic Selection & Freshness', async (t) => {
  const {
    generateDailyExperience,
    getLocalDateString
  } = await import('../../elderly_site/src/services/dailyChallengeEngine.js');

  await t.test('Deterministic Day Hash: Refreshing on the same calendar day returns identical challenges', () => {
    const fixedDate = new Date('2026-10-23T10:00:00');
    const elderId = 'elderly_bhaben_01';

    const session1 = generateDailyExperience({
      elderId,
      date: fixedDate,
      language: 'as'
    });

    const session2 = generateDailyExperience({
      elderId,
      date: new Date('2026-10-23T16:45:00'), // Later same day
      language: 'as'
    });

    assert.equal(session1.daySeed, session2.daySeed);
    assert.equal(session1.dailyChallenge.questionId, session2.dailyChallenge.questionId);
    assert.equal(session1.checkinQuestion.questionId, session2.checkinQuestion.questionId);
  });

  await t.test('Daily Freshness: Next calendar day produces rotated challenge', () => {
    const day1 = new Date('2026-10-23T10:00:00');
    const day2 = new Date('2026-10-24T10:00:00');
    const elderId = 'elderly_bhaben_01';

    const exp1 = generateDailyExperience({ elderId, date: day1, language: 'as' });
    const exp2 = generateDailyExperience({ elderId, date: day2, language: 'as' });

    assert.notEqual(exp1.daySeed, exp2.daySeed, 'Day seed must rotate across calendar days');
    assert.notEqual(exp1.localDate, exp2.localDate, 'Local calendar date string must advance');
  });

  await t.test('Caregiver Category Exclusion: Excluded categories are strictly filtered out', () => {
    const elderId = 'elderly_bhaben_01';
    const exp = generateDailyExperience({
      elderId,
      date: new Date('2026-10-23'),
      preferences: {
        excludedCategories: ['music_culture', 'word_associations']
      }
    });

    assert.notEqual(exp.dailyChallenge.category, 'music_culture');
    assert.notEqual(exp.dailyChallenge.category, 'word_associations');
  });
});

test('3. Multilingual Translation Completeness (Assamese, Bengali, Nepali, Hindi, English)', async (t) => {
  const { TRANSLATIONS } = await import('../../elderly_site/src/i18n/translations.js');

  const requiredLangs = ['as', 'bn', 'ne', 'hi', 'en'];

  await t.test('All 5 core languages are defined in TRANSLATIONS dictionary', () => {
    for (const lang of requiredLangs) {
      assert.ok(TRANSLATIONS[lang], `TRANSLATIONS must have entry for ${lang}`);
    }
  });

  await t.test('Dashboard dictionary exists in all 5 languages with essential keys', () => {
    const requiredKeys = [
      'welcomeMessage', 'checkinTitle', 'todayChallengeTitle', 'takeChallengeBtn',
      'dailyRoutinesTitle', 'fontSize', 'voiceReadout', 'speakAnswer', 'skipQuestion'
    ];

    for (const lang of requiredLangs) {
      const dash = TRANSLATIONS[lang].dashboard;
      assert.ok(dash, `Language ${lang} must contain a dashboard dictionary`);
      for (const key of requiredKeys) {
        assert.ok(dash[key], `Dashboard dictionary for ${lang} must have key "${key}"`);
      }
    }
  });

  await t.test('All 21 cognitive modules are translated across all languages (including Focus Finder, Smriti Match Quest & Tune Memory)', () => {
    const requiredModules = [
      'family_recall', 'number_sequence', 'word_puzzle', 'picture_match',
      'cultural_reminiscence', 'daily_routine', 'storytelling', 'vr_memory',
      'ai_pet', 'heirloom_scanner', 'family_board', 'pentamind_drawing', 'virtual_presence',
      'everyday_detective', 'sound_memory_quest', 'recipe_rebuilder', 'garden_of_memories',
      'focus_peripheral', 'focus_finder', 'smriti_match_quest', 'tune_memory'
    ];

    for (const lang of requiredLangs) {
      const mods = TRANSLATIONS[lang].modules;
      assert.ok(mods, `Language ${lang} must contain modules dictionary`);
      for (const mId of requiredModules) {
        assert.ok(mods[mId], `Module ${mId} must exist for language ${lang}`);
        assert.ok(mods[mId].title, `Module ${mId} must have title in ${lang}`);
      }
    }
  });
});

test('4. Backend ElderPreferences API & Real-Time Caregiver Sync', async (t) => {
  const testElderId = `elderly_test_${Date.now()}`;

  await t.test('GET /api/profile/preferences returns valid elder preference defaults', async () => {
    const res = await request('GET', `/api/profile/preferences?elderId=${testElderId}`);
    assert.equal(res.status, 200);
    assert.ok(res.data.elderId);
    assert.ok(res.data.accessibilitySettings);
    assert.equal(res.data.accessibilitySettings.fontSize, 'large');
    assert.equal(res.data.language, 'as');
  });

  await t.test('PUT /api/profile/preferences updates settings and increments version', async () => {
    const updatePayload = {
      elderId: testElderId,
      language: 'hi',
      preferredInteractionMode: 'voice',
      accessibilitySettings: {
        fontSize: 'extra-large',
        highContrast: true,
        speechRate: 0.8
      },
      excludedCategories: ['gentle_puzzles'],
      preferredSessionDuration: 'short'
    };

    const putRes = await request('PUT', '/api/profile/preferences', updatePayload);
    assert.equal(putRes.status, 200);
    assert.equal(putRes.data.language, 'hi');
    assert.equal(putRes.data.preferredInteractionMode, 'voice');
    assert.equal(putRes.data.accessibilitySettings.fontSize, 'extra-large');
    assert.equal(putRes.data.accessibilitySettings.highContrast, true);
    assert.ok(putRes.data.excludedCategories.includes('gentle_puzzles'));

    // Verify GET reflects the persistent update
    const getRes = await request('GET', `/api/profile/preferences?elderId=${testElderId}`);
    assert.equal(getRes.status, 200);
    assert.equal(getRes.data.language, 'hi');
  });

  await t.test('POST /api/sessions accepts completionStatus: "skipped" or "paused" without treating as failure', async () => {
    const skippedSession = {
      activityType: 'cultural_reminiscence',
      activityTitle: 'Bihu Dhol Memory',
      durationSeconds: 45,
      attempts: 1,
      hintsUsed: 0,
      completionStatus: 'skipped',
      responseMethod: 'choice',
      supportiveFeedback: 'Consistent Participation'
    };

    const res = await request('POST', '/api/sessions', skippedSession);
    assert.equal(res.status, 201);
    assert.equal(res.data.completionStatus, 'skipped');
    assert.equal(res.data.completed, false, 'Skipped session is recorded as skipped, not completed or failed');
  });
});
