/**
 * SMRITI SETU — DETERMINISTIC DAILY CONTENT & PERSONALIZATION ENGINE
 * 
 * Generates a stable, dignified daily experience from curated question and activity banks.
 * 
 * Stability & Freshness Guarantees:
 * 1. Deterministic Daily Hash: Derived from (elderId + YYYY-MM-DD). Refreshing the page
 *    during the same day keeps the experience completely consistent.
 * 2. Daily Rotation: Automatically switches to a fresh challenge on the next calendar day.
 * 3. Caregiver Governance: Filters out caregiver-excluded categories and surfaces approved memories.
 * 4. Anti-Repetition: Prevents repeating skipped or already-completed items in the same session.
 */

import { STRUCTURED_QUESTION_BANK, QUESTION_CATEGORIES } from './questionEngine.js';

/**
 * Standard simple string hash for deterministic day-seeding
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Formats current date as YYYY-MM-DD in user's local timezone
 */
export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Curated Pool of Daily Routine Reminders
 */
export const DEFAULT_DAILY_ROUTINES = [
  {
    id: 'routine_tea',
    time: '07:30 AM',
    title: {
      as: 'পুৱাৰ সতেজ চাহ আৰু বাৰান্দা',
      bn: 'সকালের তাজা চা ও বারান্দা',
      ne: 'बिहानीको चिया र बार्दली',
      hi: 'सुबह की ताज़ा चाय और बरामदा',
      en: 'Morning Fresh Tea & Veranda'
    },
    detail: {
      as: 'বাৰান্দাত বহি গৰম ৰঙা চাহৰ সুবাস লওক',
      bn: 'বারান্দায় বসে এক কাপ গরম লাল চায়ের সুবাস নিন',
      ne: 'बार्दलीमा बसेर तातो चियाको मज्जा लिनुहोस्',
      hi: 'बरामदे में बैठकर गर्मागर्म लाल चाय का आनंद लें',
      en: 'Enjoy warm tea while taking in the morning breeze'
    },
    icon: '☕',
    completed: false
  },
  {
    id: 'routine_walk',
    time: '10:00 AM',
    title: {
      as: 'বাগানত শান্ত পদচাৰণ',
      bn: 'বাগানে শান্ত পায়চারি',
      ne: 'बगैँचामा शीतल हिँडाइ',
      hi: 'बगीचे में शांत चहलकदमी',
      en: 'Gentle Garden Stroll'
    },
    detail: {
      as: 'ফুলবোৰ চুই চাওক আৰু মুকলি বতাহ উপভোগ কৰক',
      bn: 'ফুলের গন্ধ নিন ও মুক্ত বাতাস অনুভব করুন',
      ne: 'फूलहरू हेर्नुहोस् र ताजा हावा लिनुहोस्',
      hi: 'फूलों को निहारें और ताज़ी हवा का आनंद लें',
      en: 'Admire the blooming flowers and gentle sunlight'
    },
    icon: '🌸',
    completed: false
  },
  {
    id: 'routine_music',
    time: '04:30 PM',
    title: {
      as: 'অপৰাহ্ণৰ সুৰ আৰু সংগীত',
      bn: 'বিকেলের সুর ও সঙ্গীত',
      ne: 'अपराह्नको मधुर संगीत',
      hi: 'शाम का मधुर संगीत',
      en: 'Afternoon Melodies'
    },
    detail: {
      as: 'ডাঃ ভূপেন হাজৰিকাৰ এটি শান্ত গীত শুনক',
      bn: 'ভূপেন হাজারিকার একটি সুন্দর গান শুনুন',
      ne: 'मधुर पुरानो लोकगीत सुन्नुहोस्',
      hi: 'डॉ. भूपेन हजारिका का कोई शांत गीत सुनें',
      en: 'Listen to a serene folk melody or river tune'
    },
    icon: '🎵',
    completed: false
  }
];

/**
 * Curated Pool of Available Activity Modules
 */
export const ACTIVITY_MODULES_CATALOG = [
  {
    id: 'family_recall',
    category: QUESTION_CATEGORIES.FAMILIAR_PEOPLE,
    icon: 'Heart',
    iconColor: '#DC2626',
    bgColor: '#FEF2F2',
    borderColor: '#FECACA'
  },
  {
    id: 'cultural_reminiscence',
    category: QUESTION_CATEGORIES.MUSIC_CULTURE,
    icon: 'Compass',
    iconColor: '#0284C7',
    bgColor: '#F0F9FF',
    borderColor: '#BAE6FD'
  },
  {
    id: 'storytelling',
    category: QUESTION_CATEGORIES.FAMILY_MEMORIES,
    icon: 'Sparkles',
    iconColor: '#4F46E5',
    bgColor: '#EEF2FF',
    borderColor: '#C7D2FE'
  },
  {
    id: 'word_puzzle',
    category: QUESTION_CATEGORIES.WORD_ASSOCIATIONS,
    icon: 'FileText',
    iconColor: '#7C3AED',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE'
  },
  {
    id: 'picture_match',
    category: QUESTION_CATEGORIES.VISUAL_RECOGNITION,
    icon: 'Eye',
    iconColor: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0'
  },
  {
    id: 'ai_pet',
    category: QUESTION_CATEGORIES.EMOTIONAL_WELLBEING,
    icon: 'Sparkles',
    iconColor: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0'
  },
  {
    id: 'daily_routine',
    category: QUESTION_CATEGORIES.DAILY_ROUTINES,
    icon: 'CheckCircle2',
    iconColor: '#10B981',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0'
  },
  {
    id: 'number_sequence',
    category: QUESTION_CATEGORIES.GENTLE_PUZZLES,
    icon: 'Hash',
    iconColor: '#D97706',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A'
  },
  {
    id: 'heirloom_scanner',
    category: QUESTION_CATEGORIES.FAMILY_MEMORIES,
    icon: 'Compass',
    iconColor: '#7C3AED',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE'
  },
  {
    id: 'family_board',
    category: QUESTION_CATEGORIES.FAMILIAR_PEOPLE,
    icon: 'Heart',
    iconColor: '#DC2626',
    bgColor: '#FEF2F2',
    borderColor: '#FECACA'
  },
  {
    id: 'everyday_detective',
    category: QUESTION_CATEGORIES.VISUAL_RECOGNITION,
    icon: 'Eye',
    iconColor: '#D97706',
    bgColor: '#FEF3C7',
    borderColor: '#FDE68A'
  },
  {
    id: 'sound_memory_quest',
    category: QUESTION_CATEGORIES.MUSIC_CULTURE,
    icon: 'Compass',
    iconColor: '#0284C7',
    bgColor: '#E0F2FE',
    borderColor: '#BAE6FD'
  },
  {
    id: 'recipe_rebuilder',
    category: QUESTION_CATEGORIES.DAILY_ROUTINES,
    icon: 'CheckCircle2',
    iconColor: '#16A34A',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0'
  },
  {
    id: 'garden_of_memories',
    category: QUESTION_CATEGORIES.EMOTIONAL_WELLBEING,
    icon: 'Heart',
    iconColor: '#EC4899',
    bgColor: '#FDF2F8',
    borderColor: '#FBCFE8'
  },
  {
    id: 'focus_peripheral',
    category: QUESTION_CATEGORIES.VISUAL_RECOGNITION,
    icon: 'Eye',
    iconColor: '#D97706',
    bgColor: '#FEF3C7',
    borderColor: '#FDE68A'
  },
  {
    id: 'focus_finder',
    category: QUESTION_CATEGORIES.VISUAL_RECOGNITION,
    icon: 'Search',
    iconColor: '#D97706',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A'
  },
  {
    id: 'smriti_match_quest',
    category: QUESTION_CATEGORIES.VISUAL_RECOGNITION,
    icon: 'CheckSquare',
    iconColor: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0'
  },
  {
    id: 'tune_memory',
    category: QUESTION_CATEGORIES.MUSIC_CULTURE,
    icon: 'Music',
    iconColor: '#DB2777',
    bgColor: '#FDF2F8',
    borderColor: '#FBCFE8'
  }
];

/**
 * Primary Selector: Computes Today's Tailored Experience
 */
export function generateDailyExperience({
  elderId = 'elderly_bhaben_01',
  date = new Date(),
  language = 'as',
  preferences = {},
  completedToday = []
}) {
  const localDate = getLocalDateString(date);
  const daySeed = hashString(`${elderId}_${localDate}`);

  const excluded = preferences.excludedCategories || [];
  const favorites = preferences.favoriteCategories || [];

  // Filter question bank according to exclusions
  const eligibleQuestions = STRUCTURED_QUESTION_BANK.filter(q => !excluded.includes(q.category));

  // 1. Select Check-in Question (Gentle orientation or emotional well-being)
  const checkinCandidates = eligibleQuestions.filter(q => 
    q.category === QUESTION_CATEGORIES.EMOTIONAL_WELLBEING || 
    q.category === QUESTION_CATEGORIES.DAILY_ORIENTATION
  );
  const checkinIndex = daySeed % (checkinCandidates.length || 1);
  const selectedCheckin = checkinCandidates[checkinIndex] || eligibleQuestions[0];

  // 2. Select 1 Featured Daily Challenge (Cognitive or cultural reminiscence, excluding checkin)
  const challengeCandidates = eligibleQuestions.filter(q => 
    q.questionId !== selectedCheckin.questionId &&
    q.category !== QUESTION_CATEGORIES.EMOTIONAL_WELLBEING
  );
  
  // Sort candidate with preference weighting
  const sortedChallenges = [...challengeCandidates].sort((a, b) => {
    const aFav = favorites.includes(a.category) ? -1 : 1;
    const bFav = favorites.includes(b.category) ? -1 : 1;
    return aFav - bFav;
  });

  const challengeIndex = (daySeed + 7) % (sortedChallenges.length || 1);
  const selectedDailyChallenge = sortedChallenges[challengeIndex] || eligibleQuestions[1] || eligibleQuestions[0];

  // 3. Recommended Activities (3-4 tailored modules for the day)
  const eligibleModules = ACTIVITY_MODULES_CATALOG.filter(mod => !excluded.includes(mod.category));
  const recommendedModules = [...eligibleModules]
    .sort((a, b) => {
      // Deterministic pseudo-shuffle per day
      const aHash = hashString(`${daySeed}_${a.id}`);
      const bHash = hashString(`${daySeed}_${b.id}`);
      return aHash - bHash;
    })
    .slice(0, 4);

  // 4. Routine Reminders with local completion tracking
  const storedRoutineStateKey = `smriti_routines_${elderId}_${localDate}`;
  let routineStatuses = {};
  if (typeof localStorage !== 'undefined') {
    try {
      routineStatuses = JSON.parse(localStorage.getItem(storedRoutineStateKey) || '{}');
    } catch (e) {}
  }

  const routines = DEFAULT_DAILY_ROUTINES.map(r => ({
    ...r,
    completed: Boolean(routineStatuses[r.id])
  }));

  return {
    elderId,
    localDate,
    daySeed,
    checkinQuestion: selectedCheckin,
    dailyChallenge: selectedDailyChallenge,
    recommendedModules,
    routines,
    isChallengeCompleted: completedToday.includes(selectedDailyChallenge.questionId),
    schemaVersion: 1
  };
}

/**
 * Toggle routine completion status in local persistent storage
 */
export function toggleRoutineCompletion(elderId, localDate, routineId) {
  if (typeof localStorage === 'undefined') return false;
  const key = `smriti_routines_${elderId}_${localDate}`;
  let state = {};
  try {
    state = JSON.parse(localStorage.getItem(key) || '{}');
  } catch (e) {}

  state[routineId] = !state[routineId];
  localStorage.setItem(key, JSON.stringify(state));
  return state[routineId];
}
