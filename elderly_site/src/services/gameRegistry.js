/**
 * SMRITI SETU (স্মৃতি সেতু) — AUTHORITATIVE COGNITIVE GAMES & MODULES REGISTRY
 * 
 * Provides an immutable, centralized manifest of all 18+ games and interactive modules.
 * Ensures consistent metadata, accessibility capabilities, interaction modes, and
 * clear differentiation between distinct game mechanics.
 */

export const COGNITIVE_CATEGORIES = {
  ATTENTION_VISUAL: {
    id: 'attention_visual',
    title: {
      en: 'Attention & Visual Search',
      as: 'মনোযোগ আৰু দৃশ্য সন্ধান',
      hi: 'ध्यान एवं दृश्य खोज',
      bn: 'মনোযোগ ও দৃশ্য সন্ধান',
      ne: 'ध्यान र दृश्य खोजी'
    },
    icon: 'Search',
    color: '#D97706',
    bgColor: '#FFFBEB'
  },
  MATCHING_RECOGNITION: {
    id: 'matching_recognition',
    title: {
      en: 'Matching & Recognition',
      as: 'মিল আৰু চিনাক্তকৰণ',
      hi: 'मिलान एवं पहचान',
      bn: 'মিল ও সনাক্তকরণ',
      ne: 'मिलान र पहिचान'
    },
    icon: 'CheckSquare',
    color: '#059669',
    bgColor: '#ECFDF5'
  },
  MEMORY_SEQUENCING: {
    id: 'memory_sequencing',
    title: {
      en: 'Memory & Sequencing',
      as: 'স্মৃতি আৰু ক্ৰম অনুধাৱন',
      hi: 'स्मृति एवं क्रम निर्धारण',
      bn: 'স্মৃতি ও ক্রম নির্ধারণ',
      ne: 'स्मृति र क्रमबद्धता'
    },
    icon: 'Hash',
    color: '#7C3AED',
    bgColor: '#F5F3FF'
  },
  LANGUAGE_WORDS: {
    id: 'language_words',
    title: {
      en: 'Language & Word Activities',
      as: 'ভাষা আৰু শব্দ চৰ্চা',
      hi: 'भाषा एवं शब्द पहेली',
      bn: 'ভাষা ও শব্দচর্চা',
      ne: 'भाषा र शब्द खेल'
    },
    icon: 'FileText',
    color: '#4F46E5',
    bgColor: '#EEF2FF'
  },
  CULTURE_MEMORIES: {
    id: 'culture_memories',
    title: {
      en: 'Culture & Personal Memories',
      as: 'ঐতিহ্য আৰু ব্যক্তিগত স্মৃতি',
      hi: 'सांस्कृतिक एवं व्यक्तिगत स्मृतियां',
      bn: 'ঐতিহ্য ও ব্যক্তিগত স্মৃতি',
      ne: 'संस्कृति र व्यक्तिगत सम्झना'
    },
    icon: 'Compass',
    color: '#0284C7',
    bgColor: '#F0F9FF'
  },
  SOUND_MUSIC: {
    id: 'sound_music',
    title: {
      en: 'Sound & Music',
      as: 'সুৰ আৰু সংগীত',
      hi: 'ध्वनि एवं संगीत',
      bn: 'সুর ও সঙ্গীত',
      ne: 'ध्वनि र संगीत'
    },
    icon: 'Music',
    color: '#DB2777',
    bgColor: '#FDF2F8'
  },
  EVERYDAY_ROUTINES: {
    id: 'everyday_routines',
    title: {
      en: 'Everyday Routines',
      as: 'দৈনন্দিন অভ্যাস আৰু দিনচৰ্যা',
      hi: 'दैनिक दिनचर्या एवं आदतें',
      bn: 'দৈনন্দিন রুটিন ও অভ্যাস',
      ne: 'दैनिक तालिका र बानीहरू'
    },
    icon: 'Calendar',
    color: '#10B981',
    bgColor: '#F0FDF4'
  },
  RELAXATION_FAMILY: {
    id: 'relaxation_family',
    title: {
      en: 'Relaxation & Family Connection',
      as: 'পৰিয়ালৰ মৰম আৰু প্ৰশান্তি',
      hi: 'पारिवारिक स्नेह एवं मानसिक शांति',
      bn: 'পারিবারিক মমতা ও প্রশান্তি',
      ne: 'पारिवारिक सम्बन्ध र शान्ति'
    },
    icon: 'Heart',
    color: '#DC2626',
    bgColor: '#FEF2F2'
  },
  SPATIAL_CREATIVE: {
    id: 'spatial_creative',
    title: {
      en: 'Spatial & Creative Experiences',
      as: 'স্থানিক দৃষ্টি আৰু সৃষ্টিশীলতা',
      hi: 'स्थानिक समझ एवं रचनात्मकता',
      bn: 'স্থানিক ধারণা ও সৃজনশীলতা',
      ne: 'स्थानिक चेतना र सिर्जनशीलता'
    },
    icon: 'Sparkles',
    color: '#8B5CF6',
    bgColor: '#F5F3FF'
  }
};

/**
 * COMPLETE COGNITIVE MODULES REGISTRY
 */
export const GAME_REGISTRY = [
  // ─── 1. ATTENTION & VISUAL SEARCH ──────────────────────────────────────────
  {
    id: 'focus_finder',
    displayName: {
      en: 'Focus Finder — Scene Search',
      as: 'মনোযোগ সন্ধান — Focus Finder',
      hi: 'फोकस खोजकर्ता — Focus Finder',
      bn: 'মনোযোগ সন্ধান — Focus Finder',
      ne: 'ध्यान खोजी — Focus Finder'
    },
    category: 'attention_visual',
    mechanic: 'Search an illustrated domestic or cultural scene to spot requested items with progressive gentle highlights.',
    interactionModes: ['touch', 'mouse', 'voice_readout'],
    accessibility: {
      highContrast: true,
      textScaling: true,
      noTimePressure: true,
      progressiveHints: true,
      audioGuidance: true
    },
    status: 'available',
    isNewExclusive: true,
    badge: 'Visual Search & Attention'
  },
  {
    id: 'everyday_detective',
    displayName: {
      en: 'Everyday Detective',
      as: 'চিনাকি দৃশ্য — Everyday Detective',
      hi: 'दैनिक जासूस — Everyday Detective',
      bn: 'পরিচিত দৃশ্য সন্ধান — Everyday Detective',
      ne: 'परिचित दृश्य खोजी — Everyday Detective'
    },
    category: 'attention_visual',
    mechanic: 'Explore familiar household scenes like the morning tea veranda and cozy kitchen to spot beloved items in context.',
    interactionModes: ['touch', 'mouse'],
    accessibility: {
      highContrast: true,
      textScaling: true,
      noTimePressure: true,
      audioGuidance: true
    },
    status: 'available',
    badge: 'Contextual Object Recall'
  },
  {
    id: 'focus_peripheral',
    displayName: {
      en: 'Focus & Peripheral Awareness',
      as: 'দৃষ্টিকেন্দ্ৰ আৰু চাৰিওফালৰ দৃষ্টি',
      hi: 'ध्यान एवं परिधीय सजगता',
      bn: 'দৃষ্টিসংযোগ ও পারিপার্শ্বিক সচেতনতা',
      ne: 'केन्द्र ध्यान र परिधीय चेतना'
    },
    category: 'attention_visual',
    mechanic: 'Gentle gaze anchor on a central golden flame while noticing targets in outer peripheral margins.',
    interactionModes: ['touch', 'accessible_bottom_button'],
    accessibility: {
      highContrast: true,
      noTimePressure: true,
      dualInputMethods: true
    },
    status: 'available',
    badge: 'Sustained Attention & Periphery'
  },

  // ─── 2. MATCHING & RECOGNITION ─────────────────────────────────────────────
  {
    id: 'smriti_match_quest',
    displayName: {
      en: 'Smriti Match Quest (Visible Grid)',
      as: 'স্মৃতি মিলন অভিযান — Smriti Match Quest',
      hi: 'स्मृति मैच क्वेस्ट — Smriti Match Quest',
      bn: 'স্মৃতি মেলানো অভিযান — Smriti Match Quest',
      ne: 'स्मृति मिलान — Smriti Match Quest'
    },
    category: 'matching_recognition',
    mechanic: 'Purble Place-inspired matching with a grid of completely VISIBLE cards. Select one card, then find its identical twin in the grid.',
    interactionModes: ['touch', 'mouse', 'voice_readout'],
    accessibility: {
      visibleCardsOnly: true,
      candidateHighlight: true,
      gridReduction: true,
      noTimePressure: true
    },
    status: 'available',
    isNewExclusive: true,
    badge: 'Visible Grid Discrimination'
  },
  {
    id: 'memory_match',
    displayName: {
      en: 'Memory Match Card Pairs',
      as: 'যোৰ মেলোৱা খেলা — Memory Match',
      hi: 'स्मृति ताश जोड़ी खेल — Memory Match',
      bn: 'তাস মেলানো খেলা — Memory Match',
      ne: 'जोडी मिलाउने खेल — Memory Match'
    },
    category: 'matching_recognition',
    mechanic: 'Classic working memory exercise: Flip face-down cards to remember spatial positions and match pairs.',
    interactionModes: ['touch', 'mouse'],
    accessibility: {
      highContrast: true,
      gentleMistakeAllowance: true,
      noTimePressure: true
    },
    status: 'available',
    badge: 'Face-Down Working Memory'
  },
  {
    id: 'picture_match',
    displayName: {
      en: 'Match the First Picture',
      as: 'প্ৰথম ছবিখন মিলাওক — Picture Match',
      hi: 'प्रथम चित्र मिलान खेल — Picture Match',
      bn: 'প্রথম ছবি মেলানো — Picture Match',
      ne: 'पहिलो चित्र मिलान — Picture Match'
    },
    category: 'matching_recognition',
    mechanic: 'Look at the target cultural picture and choose the exact matching item from large visual cards.',
    interactionModes: ['touch', 'mouse'],
    accessibility: {
      highContrast: true,
      largeTouchTargets: true,
      voiceGuidance: true
    },
    status: 'available',
    badge: 'Visual Discrimination'
  },

  // ─── 3. MEMORY & SEQUENCING ────────────────────────────────────────────────
  {
    id: 'number_sequence',
    displayName: {
      en: 'Number Sequence Memory',
      as: 'সংখ্যা স্মৃতি — Number Sequence',
      hi: 'संख्या क्रम स्मृति खेल — Number Sequence',
      bn: 'সংখ্যা স্মৃতি — Number Sequence',
      ne: 'संख्या क्रम स्मृति — Number Sequence'
    },
    category: 'memory_sequencing',
    mechanic: 'Calmly watch a sequence of numbers, then tap them back in the exact same order with tiered hints.',
    interactionModes: ['touch', 'mouse'],
    accessibility: {
      highContrast: true,
      boundedRetries: true,
      undoSupport: true
    },
    status: 'available',
    badge: 'Digit Memory (Levels 1-4)'
  },
  {
    id: 'visual_sequence',
    displayName: {
      en: 'Visual Sequence Recall',
      as: 'দৃশ্য ক্ৰম সোঁৱৰণি — Visual Sequence',
      hi: 'दृश्य क्रम स्मरण — Visual Sequence',
      bn: 'দৃশ্য ক্রম স্মরণ — Visual Sequence',
      ne: 'दृश्य क्रम सम्झना — Visual Sequence'
    },
    category: 'memory_sequencing',
    mechanic: 'Observe a calm sequence of cultural symbols, then recall and reconstruct the pattern.',
    interactionModes: ['touch', 'mouse'],
    accessibility: {
      largeSymbols: true,
      reversibleSteps: true,
      noTimePressure: true
    },
    status: 'available',
    badge: 'Pattern Recall'
  },
  {
    id: 'recipe_rebuilder',
    displayName: {
      en: 'Recipe Rebuilder (Heritage Kitchen)',
      as: 'পাকঘৰৰ সোৱাদ — Recipe Rebuilder',
      hi: 'पारंपरिक व्यंजन क्रम — Recipe Rebuilder',
      bn: 'রান্নাঘরের স্বাদ — Recipe Rebuilder',
      ne: 'भान्साको परिकार क्रम — Recipe Rebuilder'
    },
    category: 'memory_sequencing',
    mechanic: 'Reconstruct beloved recipes like Assam Orthodox Tea step-by-step using visual cards and gentle guidance.',
    interactionModes: ['touch', 'mouse'],
    accessibility: {
      reversibleTimeline: true,
      audioInstructions: true,
      gentleHints: true
    },
    status: 'available',
    badge: 'Procedural Recall'
  },

  // ─── 4. LANGUAGE & WORD ACTIVITIES ─────────────────────────────────────────
  {
    id: 'word_puzzle',
    displayName: {
      en: 'Word & Memory Puzzle',
      as: 'শব্দ সেতু — Word Puzzle',
      hi: 'शब्द एवं स्मृति पहेली — Word Puzzle',
      bn: 'শব্দ সেতু — Word Puzzle',
      ne: 'शब्द सेतु — Word Puzzle'
    },
    category: 'language_words',
    mechanic: 'Spell beloved hometowns, family names, and routines with 3 tiers of gentle contextual clues.',
    interactionModes: ['touch', 'mouse', 'voice_readout'],
    accessibility: {
      tieredHints: true,
      letterPruning: true,
      undoButton: true
    },
    status: 'available',
    badge: 'Tiered Gentle Hints'
  },

  // ─── 5. CULTURE & PERSONAL MEMORIES ────────────────────────────────────────
  {
    id: 'family_recall',
    displayName: {
      en: 'Family Memory Lane',
      as: 'স্মৃতি ঘৰ — Family Memory Lane',
      hi: 'पारिवारिक स्मृति संजोना — Family Recall',
      bn: 'স্মৃতি ঘর — Family Memory Lane',
      ne: 'पारिवारिक सम्झना — Family Recall'
    },
    category: 'culture_memories',
    mechanic: 'See caregiver-approved loved ones, cherish sweet moments, and listen to authentic oral history stories.',
    interactionModes: ['touch', 'speech'],
    accessibility: {
      largeFaces: true,
      oralHistoryReadout: true,
      unhurriedBrowsing: true
    },
    status: 'available',
    badge: 'Autobiographical Recall'
  },
  {
    id: 'cultural_reminiscence',
    displayName: {
      en: 'Heritage Journey',
      as: 'ঐতিহ্য যাত্ৰা — Heritage Journey',
      hi: 'विरासत की यात्रा — Heritage Journey',
      bn: 'ঐতিহ্যের যাত্রা — Heritage Journey',
      ne: 'सांस्कृतिक यात्रा — Heritage Journey'
    },
    category: 'culture_memories',
    mechanic: 'Nostalgic memories of Rongali Bihu, tea gardens, Majuli Satras, and the mighty Brahmaputra river.',
    interactionModes: ['touch', 'voice_readout'],
    accessibility: {
      bilingualAudio: true,
      highContrastText: true
    },
    status: 'available',
    badge: 'Cultural Reminiscence'
  },
  {
    id: 'storytelling',
    displayName: {
      en: 'Folk Stories & Travel Diaries',
      as: 'সাধুকথা আৰু যাত্ৰাৰ ডায়েৰী — Storytelling',
      hi: 'लोककथाएं एवं यात्रा संस्मरण — Storytelling',
      bn: 'লোকগাথা ও ভ্রমণ স্মৃতি — Storytelling',
      ne: 'लोककथा र यात्रा संस्मरण — Storytelling'
    },
    category: 'culture_memories',
    mechanic: 'Immerse in beloved folk tales, steamer river journeys, and test story recall with serene ambient music.',
    interactionModes: ['touch', 'voice_readout'],
    accessibility: {
      audioNarrator: true,
      ambientBackgroundTune: true,
      textScaling: true
    },
    status: 'available',
    badge: 'Story Narrative Recall'
  },
  {
    id: 'heirloom_scanner',
    displayName: {
      en: 'Everyday Keepsake Scanner',
      as: 'পুৰণি স্মৃতিৰ বাতি ও বস্তু — Keepsake Scanner',
      hi: 'पारिवारिक धरोहर स्कैनर — Keepsake Scanner',
      bn: 'পুরনো স্মৃতি সামগ্রী — Keepsake Scanner',
      ne: 'पारिवारिक पुरानो सम्झना — Keepsake Scanner'
    },
    category: 'culture_memories',
    mechanic: 'Touch or scan family brass cups, wedding gamusas, and radios to listen to verified oral history recordings.',
    interactionModes: ['touch', 'camera_scan', 'audio'],
    accessibility: {
      nfcScanSupport: true,
      spokenAudio: true
    },
    status: 'available',
    badge: 'Physical Keepsake Recall'
  },

  // ─── 6. SOUND & MUSIC ──────────────────────────────────────────────────────
  {
    id: 'tune_memory',
    displayName: {
      en: 'Tune Memory — Melodic Recall',
      as: 'সুৰ স্মৃতি — Tune Memory',
      hi: 'धुन स्मृति — Tune Memory',
      bn: 'সুর স্মৃতি — Tune Memory',
      ne: 'धुन सम्झना — Tune Memory'
    },
    category: 'sound_music',
    mechanic: 'Listen to familiar sounds or short musical sequences, then identify the sound or reproduce the melody with visual wave alternatives.',
    interactionModes: ['touch', 'audio_listen', 'visual_waveform'],
    accessibility: {
      volumeControl: true,
      audioDisabledMode: true,
      replayUnlimited: true,
      visualWaveAlternative: true
    },
    status: 'available',
    isNewExclusive: true,
    badge: 'Auditory Sequencing & Discrimination'
  },
  {
    id: 'sound_memory_quest',
    displayName: {
      en: 'Sound-to-Memory Quest',
      as: 'সুৰ আৰু স্মৃতি — Sound Memory Quest',
      hi: 'ध्वनि से स्मृति यात्रा — Sound Memory Quest',
      bn: 'সুর ও স্মৃতির সন্ধান — Sound Memory Quest',
      ne: 'ध्वनि र सम्झना यात्रा — Sound Memory Quest'
    },
    category: 'sound_music',
    mechanic: 'Acoustic synthesis of temple bells, monsoon rain, and tea garden train whistles matched to visual cards.',
    interactionModes: ['touch', 'audio_listen'],
    accessibility: {
      proceduralWebAudio: true,
      offline100Percent: true,
      replayOption: true
    },
    status: 'available',
    badge: 'Acoustic Synthesis Recall'
  },

  // ─── 7. EVERYDAY ROUTINES ──────────────────────────────────────────────────
  {
    id: 'daily_routine',
    displayName: {
      en: 'Daily Routine Companion',
      as: 'দৈনন্দিন অভ্যাস — Daily Routine',
      hi: 'दैनिक दिनचर्या साथी — Daily Routine',
      bn: 'দৈনন্দিন রুটিন সঙ্গী — Daily Routine',
      ne: 'दैनिक तालिका साथी — Daily Routine'
    },
    category: 'everyday_routines',
    mechanic: 'Step-by-step gentle companion for morning tea, veranda walks, prayers, and hydration with voice guidance.',
    interactionModes: ['touch', 'voice_readout'],
    accessibility: {
      spokenReminders: true,
      largeToggleButtons: true
    },
    status: 'available',
    badge: 'Guided Routines'
  },

  // ─── 8. RELAXATION & FAMILY CONNECTION ─────────────────────────────────────
  {
    id: 'family_board',
    displayName: {
      en: 'WellRemember Family Board',
      as: 'মৰমৰ চিঠি — Family Board',
      hi: 'पारिवारिक संदेश बोर्ड — Family Board',
      bn: 'মমতার চিঠি — Family Board',
      ne: 'पारिवारिक सन्देश बोर्ड — Family Board'
    },
    category: 'relaxation_family',
    mechanic: 'Listen to warm voice greetings and see heartfelt photo cards sent by loved ones across India.',
    interactionModes: ['touch', 'audio_playback'],
    accessibility: {
      largePostcards: true,
      voicePlayback: true
    },
    status: 'available',
    badge: 'Live Family Postcards'
  },
  {
    id: 'virtual_presence',
    displayName: {
      en: 'Family Virtual Presence Room',
      as: 'পৰিয়ালৰ মৰমৰ সাক্ষাৎ কোঠা — Virtual Presence',
      hi: 'पारिवारिक आभासी उपस्थिति — Virtual Presence',
      bn: 'পারিবারিক ভার্চুয়াল সাক্ষাত — Virtual Presence',
      ne: 'पारिवारिक भर्चुअल भेटघाट — Virtual Presence'
    },
    category: 'relaxation_family',
    mechanic: 'See familiar video greetings from children and grandchildren whenever comfort or reassurance is needed.',
    interactionModes: ['touch', 'video_playback'],
    accessibility: {
      subtitlesInVernacular: true,
      comfortMode: true
    },
    status: 'available',
    badge: 'Empathetic Family Video'
  },
  {
    id: 'ai_pet',
    displayName: {
      en: 'Moti — AI Pet Companion',
      as: 'মোতি — মৰমৰ AI পোহনীয়া সংগী',
      hi: 'मोती — प्यारा पालतू साथी',
      bn: 'মোতি — আদরের পোষা বন্ধু',
      ne: 'मोती — प्याराे साथी'
    },
    category: 'relaxation_family',
    mechanic: 'Stroke, pet, and talk to your loyal golden retriever companion with synchronized calm rhythmic breathing.',
    interactionModes: ['touch', 'voice_conversation'],
    accessibility: {
      tactileFeedback: true,
      rhythmicBreathing: true
    },
    status: 'available',
    badge: 'Tactile Breathing & Reassurance'
  },
  {
    id: 'garden_of_memories',
    displayName: {
      en: 'Garden of Memories',
      as: 'স্মৃতিৰ ফুলনি — Garden of Memories',
      hi: 'स्मृतियों का उपवन — Garden of Memories',
      bn: 'স্মৃতির বাগান — Garden of Memories',
      ne: 'सम्झनाको बगैंचा — Garden of Memories'
    },
    category: 'relaxation_family',
    mechanic: 'Nurture your peaceful courtyard garden: choose orchids, marigolds, and sacred tulsi in a calm sanctuary.',
    interactionModes: ['touch'],
    accessibility: {
      zeroScoring: true,
      persistentGrowth: true,
      calmAmbiance: true
    },
    status: 'available',
    badge: 'Sensory Sanctuary'
  },

  // ─── 9. SPATIAL & CREATIVE EXPERIENCES ─────────────────────────────────────
  {
    id: 'vr_memory',
    displayName: {
      en: 'Personalized 3D VR Memory Palace',
      as: 'ব্যক্তিগত VR স্মৃতি জগত — VR Memory',
      hi: 'व्यक्तिगत 3D आभासी स्मृति महल — VR Memory',
      bn: 'ব্যক্তিগত ভিআর স্মৃতি লোক — VR Memory',
      ne: 'व्यक्तिगत VR स्मृति संसार — VR Memory'
    },
    category: 'spatial_creative',
    mechanic: 'Immerse in your personal family memories, ancestral courtyard, and joyful moments in an unhurried 3D space.',
    interactionModes: ['touch', 'device_motion', 'spatial_webgl'],
    accessibility: {
      gyroscopeMotion: true,
      seatedModeOnly: true,
      caregiverExitOverride: true
    },
    status: 'available',
    badge: '3D Spatial Reminiscence'
  },
  {
    id: 'pentamind_drawing',
    displayName: {
      en: 'PentaMind Visuospatial Polygon Drawing',
      as: 'পঞ্চভুজ আৰু ঘড়ী অংকন — PentaMind',
      hi: 'पेंटामाइंड सौम्य चित्रांकन — PentaMind',
      bn: 'পঞ্চভুজ ও ঘড়ি অঙ্কন — PentaMind',
      ne: 'पञ्चभुज र घडी चित्र — PentaMind'
    },
    category: 'spatial_creative',
    mechanic: 'Gently trace and draw intersecting pentagons and clock faces with calm strokes. Clinical vector scoring without anxiety.',
    interactionModes: ['touch_pen', 'mouse_drag'],
    accessibility: {
      strokeSmoothing: true,
      undoRedo: true,
      vectorGuidance: true
    },
    status: 'available',
    badge: 'Visuospatial Hand-Eye Drawing'
  }
];

export function getGameById(id) {
  return GAME_REGISTRY.find(g => g.id === id) || null;
}

export function getGamesByCategory(categoryId) {
  return GAME_REGISTRY.filter(g => g.category === categoryId);
}
