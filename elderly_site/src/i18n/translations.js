// Smriti Setu — Quad-Lingual Localization Dictionary with Storytelling & Travel Diaries
// Supported: English ('en'), Assamese ('as'), Nepali ('ne'), Bengali ('bn')

export const TRANSLATIONS = {
  en: {
    greeting: "Hello",
    suprabhat: "Good Morning",
    peacefulDay: "Peaceful Day",
    nerBadge: "North Eastern Region (NER)",
    mainMenu: "Main Menu",
    backToMenu: "Back to Main Menu",
    listenAloud: "Listen Aloud",
    listenStory: "Listen to Story Aloud",
    listenHint: "Listen to Hint Aloud",
    speaking: "Speaking... (Tap to Pause)",
    demoSetup: "Caregiver / Demo Setup",
    completedBanner: "A Beautiful Memory Session Completed!",
    completedBannerSub: "Thank you for sharing your precious time and memories with us today.",

    // Menu Cards
    menuHeader: "Cognitive Memory & Cultural Activities",
    menuSub: "Engage your mind with joyful nostalgia and gentle practice",
    open: "Play & Explore",

    modules: {
      family_recall: {
        title: "Family Memory Lane",
        subtitle: "See loved ones, remember cherished moments, and listen to warm family stories.",
        badge: "Face & Story Recall"
      },
      number_sequence: {
        title: "Number Sequence Memory",
        subtitle: "Memorize the calm sequence of numbers and tap them back in the same order.",
        badge: "Digit Memory (Levels 1-4)"
      },
      word_puzzle: {
        title: "Word & Memory Puzzle",
        subtitle: "Spell favorite places, family names, and routines with gentle tiered hints.",
        badge: "Tiered Gentle Hints"
      },
      picture_match: {
        title: "Match the First Picture",
        subtitle: "Look at the target cultural picture and choose the matching one from the cards.",
        badge: "Visual Recognition"
      },
      cultural_reminiscence: {
        title: "Heritage Journey",
        subtitle: "Nostalgic memories of Rongali Bihu, tea gardens, Majuli Satras, and the Brahmaputra.",
        badge: "Cultural Reminiscence"
      },
      daily_routine: {
        title: "Daily Routines",
        subtitle: "Step-by-step gentle companion for your morning tea, veranda walk, and daily wellness.",
        badge: "Guided Routines"
      },
      storytelling: {
        title: "Folk Stories & Travel Diaries",
        subtitle: "Immerse in beloved folk tales, river journeys, and test your story memory.",
        badge: "Storytelling & Recall"
      },
      vr_memory: {
        title: "Personalized VR Memory Experience",
        subtitle: "Immerse in your personal family memories, cherished hometowns, and joyful moments in a calm 3D space.",
        badge: "Spatial VR & Voice Memory"
      },
      ai_pet: {
        title: "Moti — AI Pet Companion",
        subtitle: "Stroke, pet, and talk to your gentle companion. Enjoy calm rhythmic breathing and warm reassurance.",
        badge: "Tactile & Calm Breathing"
      },
      heirloom_scanner: {
        title: "Everyday Keepsake Scanner",
        subtitle: "Touch or scan family brass cups, wedding gamusas, and radios to listen to verified oral history.",
        badge: "Object Memory & Oral History"
      },
      family_board: {
        title: "WellRemember Family Board",
        subtitle: "Listen to warm voice greetings and see heartfelt photo cards sent by your loved ones across India.",
        badge: "Live Family Postcards"
      },
      pentamind_drawing: {
        title: "PentaMind Visuospatial Drawing",
        subtitle: "Gently trace and draw intersecting pentagons and clock faces with calm strokes. Clinical vector scoring.",
        badge: "PentaMind Research • Visuospatial Drawing"
      },
      virtual_presence: {
        title: "Family Virtual Presence Room",
        subtitle: "See familiar video greetings from Deepak in Golaghat and Maina in Bangalore whenever you need comfort.",
        badge: "Relief Inspired • Empathetic Companion Room"
      },
      everyday_detective: {
        title: "Everyday Detective",
        subtitle: "Explore familiar household scenes like the morning tea veranda and cozy kitchen to spot beloved items.",
        badge: "Visual Attention & Association"
      },
      sound_memory_quest: {
        title: "Sound-to-Memory Quest",
        subtitle: "Listen to authentic acoustic sounds—temple bells, monsoon rain on tin roofs, and tea garden train whistles.",
        badge: "Auditory Attention & Recall"
      },
      recipe_rebuilder: {
        title: "Recipe Rebuilder",
        subtitle: "Recreate cherished recipes like Assam Red Tea step-by-step using visual cards and gentle guidance.",
        badge: "Procedural Recall & Sequencing"
      },
      garden_of_memories: {
        title: "Garden of Memories",
        subtitle: "Nurture your peaceful courtyard garden: choose orchids, marigolds, and sacred tulsi in a calm sanctuary.",
        badge: "Creative Choice & Sensory Sanctuary"
      },
      focus_peripheral: {
        title: "Focus & Peripheral Awareness",
        subtitle: "Gently rest your gaze on the central golden diya while noticing targets appearing in the outer corners.",
        badge: "Visual Attention & Periphery"
      },
      focus_finder: {
        title: "Focus Finder — Scene Search",
        subtitle: "Search illustrated domestic scenes like the tea veranda, kitchen, and courtyard to spot requested items.",
        badge: "Visual Search & Attention"
      },
      smriti_match_quest: {
        title: "Smriti Match Quest (Visible Grid)",
        subtitle: "Purble Place-inspired matching with a grid of visible cards. Select a card, then find its identical twin.",
        badge: "Visible Grid Discrimination"
      },
      tune_memory: {
        title: "Tune Memory — Melodic Recall",
        subtitle: "Listen to authentic sounds—temple bells, flutes, and rain—and identify or recall the melodic order.",
        badge: "Auditory Sequencing & Recall"
      }
    },

    numberWords: {
      0: "Zero", 1: "One", 2: "Two", 3: "Three", 4: "Four",
      5: "Five", 6: "Six", 7: "Seven", 8: "Eight", 9: "Nine"
    },

    numberGame: {
      watchPrompt: "Watch the numbers calmly:",
      tapPrompt: "Now, tap the numbers in the same order:",
      gentleGuide: "Gentle Guidance: The target numbers are highlighted in amber below!",
      replay: "Show Sequence Again",
      undo: "Undo Last Digit",
      successTitle: "Wonderfully Remembered!",
      successMsg: "Every number in perfect order.",
      nextLevel: "Proceed to Next Level",
      complete: "Complete Activity"
    },

    wordGame: {
      title: "Word & Memory Puzzle",
      category: "Category",
      tieredHints: "Tiered Gentle Hints",
      hint1Btn: "Hint 1 (Context)",
      hint2Btn: "Hint 2 (Sensory)",
      hint3Btn: "Hint 3 (Letters)",
      adaptiveNotice: "Gentle Adaptive Pace: Distractor letters have been removed. Only the letters needed are below!",
      formWord: "Form the word",
      undo: "Undo Letter",
      clear: "Clear All",
      successTitle: "Splendid Memory!",
      nextWord: "Next Word",
      complete: "Complete Puzzle"
    },

    pictureGame: {
      title: "Match the First Picture",
      studyPrompt: "Study this picture carefully:",
      readyBtn: "I Have Seen It, Ready to Find!",
      whichMatch: "Which picture matches the one you just saw?",
      adaptiveNotice: "Gentle Pace: Options have been simplified down to 2 choices for you!",
      previewAgain: "Preview Target Picture Again",
      successTitle: "Spot On!",
      nextLevel: "Next Level",
      complete: "Complete Activity"
    },

    familyGame: {
      title: "Family Memory Lane",
      visitingPrompt: "Who is this visiting with you?",
      giveClue: "Give me a gentle clue",
      cluePrefix: "Gentle Clue:",
      adaptiveNotice: "Gentle Pace: Options have been simplified down to 2 choices for you!",
      successTitle: "Wonderfully Remembered!",
      nextPhoto: "Next Photo",
      complete: "Complete"
    },

    storytelling: {
      title: "Folk Stories & Travel Diaries",
      selectStory: "Choose a Story to Listen & Remember:",
      listenWithAmbience: "Listen to Story (With Calming Music)",
      testRecallBtn: "Reflect on Story Memories (Memory Game)",
      backToStory: "Back to Story",
      adaptiveNotice: "Gentle Pace: Choices simplified down to 2 options!",
      successTitle: "Splendid Story Recall!",
      successMsg: "You remembered the details from our story with wonderful clarity.",
      nextStory: "Next Story / Diary",
      finish: "Finish Stories"
    },

    dashboard: {
      welcomeMessage: "Welcome to your calm and joyful space today.",
      checkinTitle: "Daily Gentle Check-in",
      checkinSubtitle: "How is your heart feeling today?",
      todayChallengeTitle: "Today's Gentle Activity",
      todayChallengeBadge: "Daily Memory & Joy",
      takeChallengeBtn: "Explore Activity",
      challengeCompleted: "Completed with warmth today!",
      favoriteMemoriesTitle: "Cherished Memories & Stories",
      dailyRoutinesTitle: "Caregiver's Routine Reminders",
      routineDone: "Done",
      routineMarkDone: "Mark Done",
      completedActivities: "Completed Today",
      nextActivity: "Next Activity",
      allActivitiesTitle: "All Calm Activities & Games",
      fontSize: "Text Size",
      contrast: "High Contrast",
      voiceReadout: "Hear Question",
      voicePause: "Pause",
      voiceResume: "Resume",
      voiceReplay: "Repeat Question",
      voiceStop: "Stop Audio",
      speakAnswer: "Speak Answer",
      listening: "Listening...",
      tryAgain: "Try Again",
      gentleHint: "Gentle Clue",
      skipQuestion: "Skip for Now",
      takeBreak: "Take a Break",
      finishNow: "Return Home",
      notSure: "I'm not sure right now",
      safeOfflineActive: "Safe Offline Mode Active",
      syncedWithCaregiver: "Synchronized with Caregiver"
    }
  },

  as: {
    greeting: "নমস্কাৰ",
    suprabhat: "সুপ্ৰভাত",
    peacefulDay: "শান্তিময় দিন",
    nerBadge: "উত্তৰ-পূব ভাৰতৰ (NER) ঐতিহ্য",
    mainMenu: "মুখ্য পৃষ্ঠা",
    backToMenu: "মুখ্য পৃষ্ঠালৈ ঘূৰি যাওক",
    listenAloud: "সাধু শুনক",
    listenStory: "সাধু শুনক (আৱহ সুৰৰ সৈতে)",
    listenHint: "সহায় শুনক",
    speaking: "পঢ়ি থকা হৈছে... (ৰখাবলৈ স্পৰ্শ কৰক)",
    demoSetup: "পৰিচৰ্যা / ছেটআপ",
    completedBanner: "সুন্দৰ সোঁৱৰণি সমাপ্ত হ’ল!",
    completedBannerSub: "আজি আপোনাৰ বহুমূলীয়া সোঁৱৰণি আমাৰ লগত ভাগ-বতৰা কৰাৰ বাবে ধন্যবাদ।",

    menuHeader: "মগজুৰ সক্ৰিয়তা আৰু স্মৃতি অনুশীলন",
    menuSub: "মনলৈ আনন্দ আৰু শান্তি অনা সাংস্কৃতিক স্মৃতিৰ খেলা",
    open: "আৰম্ভ কৰক",

    modules: {
      family_recall: {
        title: "স্মৃতি ঘৰ — Family Memory Lane",
        subtitle: "আপোনাৰ মৰমৰ পৰিয়ালৰ মানুহবোৰক চাওক আৰু পুৰণি মিঠা স্মৃতি শুনক।",
        badge: "পৰিয়াল সোঁৱৰণি"
      },
      number_sequence: {
        title: "সংখ্যা স্মৃতি — Number Sequence",
        subtitle: "মন দি সংখ্যা কেইটা চাওক আৰু একোদিক্ৰমে স্পৰ্শ কৰক।",
        badge: "সংখ্যা অনুশীলন (স্তৰ ১-৪)"
      },
      word_puzzle: {
        title: "শব্দ সেতু — Word & Memory Puzzle",
        subtitle: "প্ৰিয় স্থান, পৰিয়ালৰ নাম আৰু জলপানৰ শব্দ সজাওক।",
        badge: "পৰ্যায়ক্ৰমিক সহায়"
      },
      picture_match: {
        title: "ছবি মিলোৱা — Match the First Picture",
        subtitle: "প্ৰথম ছবিখন মন দি চাওক আৰু তাৰ পিছত সঠিক ছবিখন বাছনি কৰক।",
        badge: "ছবি চিনাক্তকৰণ"
      },
      cultural_reminiscence: {
        title: "অসম আৰু উত্তৰ-পূব — Heritage Journey",
        subtitle: "ৰঙালী বিহু, চাহ বাগিচা, কাজিৰঙা আৰু মাজুলীৰ পুৰণি সোঁৱৰণি।",
        badge: "ঐতিহ্য যাত্ৰা"
      },
      daily_routine: {
        title: "নিয়মীয়া সহায় — Daily Routines",
        subtitle: "পুৱাৰ ৰঙা চাহ, বাৰান্দাৰ খোজ আৰু সন্ধিয়াৰ নাম-প্ৰসংগৰ সংগী।",
        badge: "দৈনন্দিন সহায়"
      },
      storytelling: {
        title: "সাধুকথা আৰু ভ্ৰমণ স্মৃতি — Folk Stories & Travel",
        subtitle: "পুৰণি ষ্টিমাৰ যাত্ৰা, বুঢ়ী আইৰ সাধু আৰু স্মৃতি পৰীক্ষাৰ খেলা।",
        badge: "সাধুকথা আৰু স্মৃতি"
      },
      vr_memory: {
        title: "ব্যক্তিগত VR স্মৃতি জগত",
        subtitle: "শান্ত ত্ৰিমাত্ৰিক পৰিৱেশত আপোনাৰ আপোন পৰিয়াল, পুৰণি ঘৰ আৰু সুখৰ দিনবোৰ মৰমেৰে সোঁৱৰক।",
        badge: "Spatial VR & Voice Memory"
      },
      ai_pet: {
        title: "মোতি — মৰমৰ AI পোহনীয়া সংগী",
        subtitle: "মোতিক মৰম কৰক, কথা পাতক আৰু শান্ত ছন্দোময় উশাহ-নিশাহৰ অনুশীলন কৰক।",
        badge: "মৰম আৰু শান্ত উশাহ"
      },
      heirloom_scanner: {
        title: "পুৰণি স্মৃতিৰ বাতি ও বস্তু",
        subtitle: "কাঁহৰ বাটি, ফুলম গামোচা আৰু ৰেডিঅ' চুই পুৰণি মধুৰ কাহিনী শুনক।",
        badge: "বস্তু আৰু কাহিনী স্মৃতি"
      },
      family_board: {
        title: "মৰমৰ চিঠি — পাৰিবাৰিক ফলক",
        subtitle: "দূৰৈৰ পৰা আপোন নাতি-নাতিনীয়ে পঠোৱা মৰমৰ মাত আৰু ছবি চাওক।",
        badge: "পৰিয়ালৰ পোনপটীয়া বাৰ্তা"
      },
      pentamind_drawing: {
        title: "পঞ্চভুজ আৰু ঘড়ী অংকন — PentaMind",
        subtitle: "শান্তভাৱে এটাৰ মাজত আনটো সোমাই থকা পঞ্চভুজ আঁকি মনৰ একাগ্রতা বৃদ্ধি কৰক।",
        badge: "ক্লিনিকেল হস্তাঙ্কন পৰীক্ষা"
      },
      virtual_presence: {
        title: "পৰিয়ালৰ মৰমৰ সাক্ষাৎ কোঠা",
        subtitle: "গোলাঘাটৰ পৰা দীপক আৰু বাংগালোৰৰ পৰা মাইনাৰ মুখনি আৰু মৰমৰ মাত শুনক।",
        badge: "Relief আৰ্হি • মৰমৰ উপস্থিতি"
      },
      everyday_detective: {
        title: "চিনাকি দৃশ্য — Everyday Detective",
        subtitle: "পুৱাৰ চাহৰ বাৰাণ্ডা আৰু পাকঘৰৰ দৰে চিনাকি ঘৰুৱা দৃশ্যত প্ৰিয় বস্তুবোৰ বিচাৰি উলিয়াওক।",
        badge: "দৃশ্য মনোযোগ আৰু চিনাকি বস্তু"
      },
      sound_memory_quest: {
        title: "সুৰ আৰু স্মৃতি — Sound Memory Quest",
        subtitle: "মন্দিৰৰ কাঁহ-ঘণ্টা, টিনৰ চালত বৰষুণৰ টোপাল আৰু চাহ বাগানৰ ৰে’লৰ উকি শুনি মনত পেলাওক।",
        badge: "শ্ৰৱণ মনোযোগ আৰু পুৰণি সোঁৱৰণি"
      },
      recipe_rebuilder: {
        title: "পাকঘৰৰ সোৱাদ — Recipe Rebuilder",
        subtitle: "অসমীয়া ৰঙা চাহ আৰু পৰম্পৰাগত জলপান বনোৱাৰ ধাপবোৰ ধুনীয়াকৈ ক্ৰমত সজাওক।",
        badge: "পদ্ধতিগত স্মৃতি আৰু পৰিকল্পনা"
      },
      garden_of_memories: {
        title: "স্মৃতিৰ ফুলনি — Garden of Memories",
        subtitle: "আপোনাৰ চোতালৰ শান্ত ফুলনিত কপৌ ফুল, নাৰ্জী আৰু পবিত্ৰ তুলসী ৰোপণ কৰি শান্তি লভক।",
        badge: "সৃষ্টিশীল আনন্দ আৰু সংবেদনশীল শান্তি"
      },
      focus_peripheral: {
        title: "দৃষ্টিকেন্দ্ৰ আৰু চাৰিওফালৰ দৃষ্টি — Focus & Periphery",
        subtitle: "সোঁমাজৰ শান্ত প্ৰদীপৰ শিখাত মন দিয়ক আৰু চাৰিওফালে ওলোৱা সুন্দৰ বস্তুবোৰ শান্তভাৱে লক্ষ্য কৰক।",
        badge: "দৃশ্য মনোযোগ আৰু চাৰিওফালৰ অনুভূতি"
      },
      focus_finder: {
        title: "মনোযোগ সন্ধান — Focus Finder",
        subtitle: "পুৱাৰ চাহৰ বাৰান্দা, পাকঘৰ আৰু চোতালৰ চিনাকি দৃশ্যত বিচৰা বস্তুবোৰ বিচাৰি উলিয়াওক।",
        badge: "দৃশ্য সন্ধান আৰু মনোযোগ"
      },
      smriti_match_quest: {
        title: "স্মৃতি মিলন অভিযান — Smriti Match Quest",
        subtitle: "সকলো কাৰ্ড খোলা থকা দৃশ্যমান ফলকত একে ছবি থকা যোৰ কাৰ্ড চিনাক্ত কৰি মিল কৰক।",
        badge: "দৃশ্যমান কাৰ্ড মিলন"
      },
      tune_memory: {
        title: "সুৰ স্মৃতি — Tune Memory",
        subtitle: "মন্দিৰৰ ঘণ্টা, বাঁহী আৰু বৰষুণৰ মিঠা সুৰ শুনি বাদ্য চিনাক্ত কৰক আৰু সুৰৰ ক্ৰম মনত ৰাখক।",
        badge: "শ্ৰৱণ মনোযোগ আৰু সুৰ স্মৃতি"
      }
    },

    numberWords: {
      0: "শূণ্য", 1: "এক", 2: "দুই", 3: "তিনি", 4: "চাৰি",
      5: "পাঁচ", 6: "ছয়", 7: "সাত", 8: "আঠ", 9: "ন"
    },

    numberGame: {
      watchPrompt: "মন দি চাওক, সংখ্যাবোৰ আহিব:",
      tapPrompt: "এতিয়া একে ক্ৰমত সংখ্যাবোৰ স্পৰ্শ কৰক:",
      gentleGuide: "সহজ সহায়: লক্ষ্য সংখ্যাবোৰ তলত হালধীয়াকৈ দেখুওৱা হৈছে!",
      replay: "পুনৰ দেখুৱাওক",
      undo: "মচক",
      successTitle: "সুন্দৰ সোঁৱৰণি!",
      successMsg: "সকলো সংখ্যা শুদ্ধ ক্ৰমত সম্পন্ন হ’ল।",
      nextLevel: "পৰৱৰ্তী স্তৰলৈ যাওক",
      complete: "সম্পূৰ্ণ হ’ল"
    },

    wordGame: {
      title: "শব্দ সেতু — Word Puzzle",
      category: "বিষয়",
      tieredHints: "পৰ্যায়ক্ৰমিক মিঠা সহায়",
      hint1Btn: "সহায় ১ (পৰিবেশ)",
      hint2Btn: "সহায় ২ (অনুভূতি)",
      hint3Btn: "সহায় ৩ (আখৰ)",
      adaptiveNotice: "সহজ গতি: অপ্ৰয়োজনীয় আখৰ আতঁৰাই কেৱল প্ৰয়োজনীয়খিনি ৰখা হৈছে!",
      formWord: "শব্দটো সজাওক",
      undo: "আখৰ মচক",
      clear: "সকলো মচক",
      successTitle: "সুন্দৰ উত্তৰ!",
      nextWord: "পৰৱৰ্তী শব্দ",
      complete: "সম্পূৰ্ণ হ’ল"
    },

    pictureGame: {
      title: "ছবি মিলোৱা — Picture Match",
      studyPrompt: "এই ছবিখন মন দি চাওক:",
      readyBtn: "মই দেখিলোঁ, বিচাৰিবলৈ সাজু!",
      whichMatch: "আপুনি এতিয়াই দেখা ছবিখন কোনখন?",
      adaptiveNotice: "সহজ গতি: আপোনাৰ বাবে বিকল্প মাত্ৰ ২টালৈ হ্ৰাস কৰা হৈছে!",
      previewAgain: "ছবিখন পুনৰ চাওক",
      successTitle: "নিখুঁত চিনাক্তকৰণ!",
      nextLevel: "পৰৱৰ্তী স্তৰ",
      complete: "সম্পূৰ্ণ হ’ল"
    },

    familyGame: {
      title: "স্মৃতি ঘৰ — Family Memory",
      visitingPrompt: "আপোনাৰ ওচৰলৈ ছবিত কোন আহিছে?",
      giveClue: "সহায় লওক",
      cluePrefix: "সহায়:",
      adaptiveNotice: "সহজ গতি: আপোনাৰ বাবে বিকল্প মাত্ৰ ২টালৈ হ্ৰাস কৰা হৈছে!",
      successTitle: "সুন্দৰ সোঁৱৰণি!",
      nextPhoto: "পৰৱৰ্তী ছবি",
      complete: "সম্পূৰ্ণ হ’ল"
    },

    storytelling: {
      title: "সাধুকথা আৰু ভ্ৰমণ স্মৃতি",
      selectStory: "শুনিবলৈ আৰু সোঁৱৰিবলৈ এটি সাধু বাছক:",
      listenWithAmbience: "সাধু শুনক (প্ৰশান্তি সংগীতৰ সৈতে)",
      testRecallBtn: "সাধুৰ স্মৃতি সোঁৱৰক (স্মৃতি খেলা)",
      backToStory: "সাধুলৈ ঘূৰি যাওক",
      adaptiveNotice: "সহজ গতি: আপোনাৰ বাবে বিকল্প মাত্ৰ ২টালৈ হ্ৰাস কৰা হৈছে!",
      successTitle: "অপূৰ্ব সোঁৱৰণি!",
      successMsg: "সাধুটোৰ বিষয়ে আপুনি সকলো কথা সুন্দৰকৈ মনত ৰাখিলে।",
      nextStory: "পৰৱৰ্তী সাধু / ভ্ৰমণ স্মৃতি",
      finish: "সমাপ্ত কৰক"
    },

    dashboard: {
      welcomeMessage: "আজিৰ এই শান্তিময় দিনটোলৈ আপোনাক স্বাগতম।",
      checkinTitle: "দৈনিক মনৰ বুজ লোৱা",
      checkinSubtitle: "আজি আপোনাৰ মনটো কেনে লাগিছে?",
      todayChallengeTitle: "আজিৰ এটি মধুৰ স্মৃতি খেলা",
      todayChallengeBadge: "দৈনিক সোঁৱৰণি",
      takeChallengeBtn: "খেলা আৰম্ভ কৰক",
      challengeCompleted: "আজি মৰমেৰে সম্পন্ন হ’ল!",
      favoriteMemoriesTitle: "চেনেহৰ স্মৃতি আৰু সাধুকথা",
      dailyRoutinesTitle: "দৈনন্দিন কামৰ সংগী",
      routineDone: "সম্পন্ন",
      routineMarkDone: "সম্পন্ন হিচাপে ৰাখক",
      completedActivities: "আজি সম্পন্ন কৰা কাৰ্য্য",
      nextActivity: "পৰৱৰ্তী কাৰ্য্য",
      allActivitiesTitle: "সকলো আনন্দদায়ক খেলা আৰু স্মৃতি",
      fontSize: "অক্ষৰৰ আকাৰ",
      contrast: "স্পষ্ট ৰং (Contrast)",
      voiceReadout: "কথা শুনক",
      voicePause: "ৰখাওক",
      voiceResume: "পুনৰ শুনক",
      voiceReplay: "আকৌ শুনক",
      voiceStop: "বন্ধ কৰক",
      speakAnswer: "মাত দি কওক",
      listening: "শুনি থকা হৈছে...",
      tryAgain: "আকৌ চেষ্টা কৰক",
      gentleHint: "সহায় বিচাৰক",
      skipQuestion: "পিছলৈ থওক (Skip)",
      takeBreak: "অলপ জিৰণি লওক",
      finishNow: "ঘৰলৈ ঘূৰি যাওক",
      notSure: "মনত পৰা নাই",
      safeOfflineActive: "নিৰাপদ অফলাইন মোড সক্ৰিয়",
      syncedWithCaregiver: "তত্ত্বাৱধায়কৰ সৈতে সংযুক্ত"
    }
  },

  ne: {
    greeting: "नमस्ते",
    suprabhat: "शुभ प्रभात",
    peacefulDay: "शान्त दिन",
    nerBadge: "उत्तर-पूर्व भारतको (NER) सम्पदा",
    mainMenu: "मुख्य पृष्ठ",
    backToMenu: "मुख्य पृष्ठमा फर्कनुहोस्",
    listenAloud: "कथा सुन्नुहोस्",
    listenStory: "कथा सुन्नुहोस् (शान्त संगीतसँगै)",
    listenHint: "संकेत सुन्नुहोस्",
    speaking: "बोल्दैछ... (रोक्न थिच्नुहोस्)",
    demoSetup: "हेरचाहकर्ता / सेटअप",
    completedBanner: "सुन्दर स्मृति सत्र सम्पन्न भयो!",
    completedBannerSub: "आज हामीसँग आफ्नो अमूल्य सम्झनाहरू बाँड्नु भएकोमा धन्यवाद।",

    menuHeader: "मानसिक सक्रियता र स्मृति अभ्यास",
    menuSub: "मनलाई शान्ति र आनन्द दिने सांस्कृतिक सम्झनाहरूको अभ्यास",
    open: "सुरु गर्नुहोस्",

    modules: {
      family_recall: {
        title: "परिवारको सम्झना — Family Memory Lane",
        subtitle: "आफ्ना प्रिय परिवारजनलाई हेर्नुहोस् र पुराना रमाइला कथाहरू सुन्नुहोस्।",
        badge: "परिवार सम्झना"
      },
      number_sequence: {
        title: "संख्या स्मृति — Number Sequence",
        subtitle: "संख्याहरूलाई ध्यान दिएर हेर्नुहोस् र त्यसै क्रममा थिच्नुहोस्।",
        badge: "संख्या अभ्यास (स्तर १-४)"
      },
      word_puzzle: {
        title: "शब्द सेतु — Word & Memory Puzzle",
        subtitle: "मनपर्ने ठाउँ, परिवारका नाम र चिया-नास्ताका शब्दहरू बनाउनुहोस्।",
        badge: "चरणबद्ध संकेत"
      },
      picture_match: {
        title: "तस्विर मिलाउनुहोस् — Match the First Picture",
        subtitle: "पहिलो तस्विरलाई ध्यान दिएर हेर्नुहोस् र मिल्दो तस्विर छान्नुहोस्।",
        badge: "तस्विर पहिचान"
      },
      cultural_reminiscence: {
        title: "सांस्कृतिक यात्रा — Heritage Journey",
        subtitle: "चिया बगान, बिहु, काजिरङ्गा र पहाडका पुराना सम्झनाहरू।",
        badge: "सांस्कृतिक स्मृति"
      },
      daily_routine: {
        title: "दैनिक तालिका — Daily Routines",
        subtitle: "बिहानको चिया, घाम ताप्ने र साँझको प्रार्थनाको साथी।",
        badge: "दैनिक सहयोग"
      },
      storytelling: {
        title: "लोककथा र यात्रा संस्मरण — Folk Stories & Travel",
        subtitle: "पुरानो डुङ्गा यात्रा, हजुरआमाका कथा र स्मृति स्मरण खेल।",
        badge: "कथा र स्मृति खेल"
      },
      vr_memory: {
        title: "व्यक्तिगत VR स्मृति संसार",
        subtitle: "शान्त थ्रीडी वातावरणमा आफ्ना प्रिय परिवार, पुरानो घर र सुखद सम्झनाहरूमा रमाउनुहोस्।",
        badge: "Spatial VR & Voice Memory"
      },
      ai_pet: {
        title: "मोती — प्याराे AI साथी",
        subtitle: "मोतीलाई माया गर्नुहोस्, कुराकानी गर्नुहोस् र शान्त सास फेर्ने अभ्यास गर्नुहोस्।",
        badge: "माया र शान्ति"
      },
      heirloom_scanner: {
        title: "पारिवारिक पुरानो सम्झना स्क्यानर",
        subtitle: "पुराना पित्तलका भाँडा, परम्परागत लुगा र रेडियो छोएर ती दिनका कथाहरू सुन्नुहोस्।",
        badge: "वस्तु र सम्झना"
      },
      family_board: {
        title: "पारिवारिक मायालु सन्देश बोर्ड",
        subtitle: "टाढा रहेका छोराछोरी र नातिनातिनाले पठाएका मीठा आवाज र तस्विरहरू हेर्नुहोस्।",
        badge: "प्रत्यक्ष सन्देश"
      },
      pentamind_drawing: {
        title: "पञ्चभुज र घडी चित्र कोर्ने — PentaMind",
        subtitle: "दुईवटा पाँचकुने आकार जोडेर बिस्तारै चित्र कोर्नुहोस् र एकाग्रता बढाउनुहोस्।",
        badge: "क्लिनिकल रेखाचित्र मूल्याङ्कन"
      },
      virtual_presence: {
        title: "पारिवारिक भर्चुअल भेटघाट कोठा",
        subtitle: "गोलाघाटबाट दीपक र बेङ्गलोरबाट मैनाको भिडियो सन्देश र मीठो आवाज सुन्नुहोस्।",
        badge: "Relief शैली • न्यानो उपस्थिति"
      },
      everyday_detective: {
        title: "परिचित दृश्य खोजी — Everyday Detective",
        subtitle: "बिहानको चियाको बार्दली र भान्साकोठा जस्ता परिचित दृश्यहरूमा मनपर्ने सामानहरू खोज्नुहोस्।",
        badge: "दृश्य ध्यान र वस्तु पहिचान"
      },
      sound_memory_quest: {
        title: "ध्वनि र सम्झना यात्रा — Sound Memory Quest",
        subtitle: "मन्दिरको घण्टी, टिनको छानामा पानीको आवाज र चिया बगानको रेलको सिठी सुनेर पहिचान गर्नुहोस्।",
        badge: "श्रवण ध्यान र पुराना सम्झना"
      },
      recipe_rebuilder: {
        title: "भान्साको परिकार क्रम — Recipe Rebuilder",
        subtitle: "असमिया रातो चिया बनाउने परम्परागत चरणहरूलाई चित्रहरूको मद्दतले सही क्रममा मिलाउनुहोस्।",
        badge: "प्रक्रियात्मक स्मृति र योजना"
      },
      garden_of_memories: {
        title: "सम्झनाको बगैंचा — Garden of Memories",
        subtitle: "आफ्नो आँगनको शान्त बगैंचा सजाउनुहोस्: सुनाखरी (अर्चिड), सयपत्री र पवित्र तुलसी रोप्नुहोस्।",
        badge: "सिर्जनात्मक शान्ति र संवेदी आनन्द"
      },
      focus_peripheral: {
        title: "केन्द्र ध्यान र परिधीय चेतना — Focus & Periphery",
        subtitle: "पर्दाको बीचमा बलिरहेको शान्त दियोमा ध्यान दिनुहोस् र छेउछाउमा देखिने वस्तुहरू सहजै पहिचान गर्नुहोस्।",
        badge: "दृश्य ध्यान र परिधीय सजगता"
      },
      focus_finder: {
        title: "ध्यान खोजी — Focus Finder",
        subtitle: "बार्दली, भान्सा र आँगनका परिचित दृश्यहरूमा खोजिएको सामान पत्ता लगाउनुहोस्।",
        badge: "दृश्य खोजी र ध्यान"
      },
      smriti_match_quest: {
        title: "स्मृति मिलान — Smriti Match Quest",
        subtitle: "सबै कार्डहरू खुला रहेको ग्रिडमा एउटै चित्र भएका जोडी कार्डहरू पहिचान गर्नुहोस्।",
        badge: "दृश्यमान कार्ड मिलान"
      },
      tune_memory: {
        title: "धुन सम्झना — Tune Memory",
        subtitle: "मन्दिरको घण्टी, बाँसुरी र वर्षाका धुन सुनेर बाजा पहिचान गर्नुहोस् र धुनको क्रम सम्झनुहोस्।",
        badge: "श्रवण ध्यान र धुन स्मरण"
      }
    },

    numberWords: {
      0: "शून्य", 1: "एक", 2: "दुई", 3: "तीन", 4: "चार",
      5: "पाँच", 6: "छ", 7: "सात", 8: "आठ", 9: "नौ"
    },

    numberGame: {
      watchPrompt: "ध्यान दिएर हेर्नुहोस्, संख्याहरू आउनेछन्:",
      tapPrompt: "अब उही क्रममा संख्याहरू थिच्नुहोस्:",
      gentleGuide: "सजिलो संकेत: सही संख्याहरू तल पहेंलो रंगमा देखाइएका छन्!",
      replay: "पुनः देखाउनुहोस्",
      undo: "हटाउनुहोस्",
      successTitle: "अति सुन्दर सम्झना!",
      successMsg: "सबै संख्याहरू सही क्रममा मिलाउनु भयो।",
      nextLevel: "अर्को स्तरमा जानुहोस्",
      complete: "सम्पन्न भयो"
    },

    wordGame: {
      title: "शब्द सेतु — Word Puzzle",
      category: "विषय",
      tieredHints: "चरणबद्ध मिठा संकेतहरू",
      hint1Btn: "संकेत १ (परिवेश)",
      hint2Btn: "संकेत २ (अनुभूति)",
      hint3Btn: "संकेत ३ (अक्षर)",
      adaptiveNotice: "सजिलो गति: नचाहिने अक्षरहरू हटाइएका छन्, केवल चाहिने अक्षरहरू राखिएका छन्!",
      formWord: "शब्द बनाउनुहोस्",
      undo: "अक्षर हटाउनुहोस्",
      clear: "सबै हटाउनुहोस्",
      successTitle: "धेरै राम्रो उत्तर!",
      nextWord: "अर्को शब्द",
      complete: "सम्पन्न भयो"
    },

    pictureGame: {
      title: "तस्विर मिलाउनुहोस् — Picture Match",
      studyPrompt: "यो तस्विर ध्यान दिएर हेर्नुहोस्:",
      readyBtn: "मैले हेरेँ, खोज्न तयार छु!",
      whichMatch: "तपाईंले भर्खरै देख्नुभएको तस्विर कुन हो?",
      adaptiveNotice: "सजिलो गति: तपाईंको लागि विकल्पहरू केवल २ वटामा घटाइएको छ!",
      previewAgain: "तस्विर पुनः हेर्नुहोस्",
      successTitle: "सटीक पहिचान!",
      nextLevel: "अर्को स्तर",
      complete: "सम्पन्न भयो"
    },

    familyGame: {
      title: "परिवारको सम्झना — Family Memory",
      visitingPrompt: "तस्विरमा तपाईंसँग को हुनुहुन्छ?",
      giveClue: "संकेत लिनुहोस्",
      cluePrefix: "संकेत:",
      adaptiveNotice: "सजिलो गति: तपाईंको लागि विकल्पहरू केवल २ वटामा घटाइएको छ!",
      successTitle: "अति सुन्दर सम्झना!",
      nextPhoto: "अर्को तस्विर",
      complete: "सम्पन्न भयो"
    },

    storytelling: {
      title: "लोककथा र यात्रा संस्मरण",
      selectStory: "सुन्न र सम्झिन कथा छान्नुहोस्:",
      listenWithAmbience: "कथा सुन्नुहोस् (शान्त धुनसँगै)",
      testRecallBtn: "कथाको सम्झना अभ्यास (स्मृति खेल)",
      backToStory: "कथामा फर्कनुहोस्",
      adaptiveNotice: "सजिलो गति: विकल्पहरू केवल २ वटामा घटाइएको छ!",
      successTitle: "धेरै राम्रो सम्झना!",
      successMsg: "कथाका विवरणहरू तपाईंले स्पष्ट रूपमा सम्झिनु भयो।",
      nextStory: "अर्को कथा वा यात्रा संस्मरण",
      finish: "सम्पन्न गर्नुहोस्"
    },

    dashboard: {
      welcomeMessage: "आजको यो शान्त र सुखद दिनमा तपाईंलाई स्वागत छ।",
      checkinTitle: "दैनिक मनको हालचाल",
      checkinSubtitle: "आज तपाईंको मन कस्तो छ?",
      todayChallengeTitle: "आजको रमाइलो सम्झना खेल",
      todayChallengeBadge: "दैनिक सम्झना",
      takeChallengeBtn: "खेल सुरु गर्नुहोस्",
      challengeCompleted: "आज सफलतापूर्वक सम्पन्न भयो!",
      favoriteMemoriesTitle: "मीठा सम्झनाहरू र कथाहरू",
      dailyRoutinesTitle: "दैनिक तालिका साथी",
      routineDone: "सम्पन्न",
      routineMarkDone: "सम्पन्न भयो",
      completedActivities: "आज गरिएका गतिविधिहरू",
      nextActivity: "अर्को गतिविधि",
      allActivitiesTitle: "सबै शान्त खेलहरू र गतिविधिहरू",
      fontSize: "अक्षरको आकार",
      contrast: "स्पष्ट रङ (Contrast)",
      voiceReadout: "सुन्नुहोस्",
      voicePause: "रोक्नुहोस्",
      voiceResume: "जारी राख्नुहोस्",
      voiceReplay: "फेरि सुन्नुहोस्",
      voiceStop: "बन्द गर्नुहोस्",
      speakAnswer: "बोलेर भन्नुहोस्",
      listening: "सुन्दैछ...",
      tryAgain: "फेरि प्रयास गर्नुहोस्",
      gentleHint: "संकेत हेर्नुहोस्",
      skipQuestion: "पछि गर्ने (Skip)",
      takeBreak: "अलिकति आराम गर्नुहोस्",
      finishNow: "गृहपृष्ठमा फर्कनुहोस्",
      notSure: "अहिले याद आएन",
      safeOfflineActive: "सुरक्षित अफलाइन मोड सक्रिय",
      syncedWithCaregiver: "हेरचाहकर्तासँग जोडिएको"
    }
  },

  bn: {
    greeting: "নমস্কার",
    suprabhat: "সুপ্রভাত",
    peacefulDay: "শান্তিময় দিন",
    nerBadge: "উত্তর-পূর্ব ভারতের (NER) ঐতিহ্য",
    mainMenu: "মূল পৃষ্ঠা",
    backToMenu: "মূল পৃষ্ঠায় ফিরে যান",
    listenAloud: "গল্প শুনুন",
    listenStory: "গল্প শুনুন (শান্ত সুরের সাথে)",
    listenHint: "ইঙ্গিত শুনুন",
    speaking: "পড়া হচ্ছে... (থামাতে স্পর্শ করুন)",
    demoSetup: "পরিচর্যা / সেটআপ",
    completedBanner: "একটি সুন্দর স্মৃতি সেশন সম্পন্ন হয়েছে!",
    completedBannerSub: "আজ আপনার মূল্যবান স্মৃতি আমাদের সাথে ভাগ করে নেওয়ার জন্য ধন্যবাদ।",

    menuHeader: "মানসিক সক্রিয়তা ও স্মৃতি অনুশীলন",
    menuSub: "আনন্দ ও শান্তির সাথে স্মৃতিচারণের অনুশীলন",
    open: "শুরু করুন",

    modules: {
      family_recall: {
        title: "পরিবারের স্মৃতি — Family Memory Lane",
        subtitle: "প্রিয় মানুষদের দেখুন এবং মিষ্টি পারিবারিক স্মৃতি শুনুন।",
        badge: "পরিবার স্মরণ"
      },
      number_sequence: {
        title: "সংখ্যা স্মৃতি — Number Sequence",
        subtitle: "মন দিয়ে সংখ্যাগুলি দেখুন এবং একই ক্রমানুসারে স্পর্শ করুন।",
        badge: "সংখ্যা অনুশীলন (স্তর ১-৪)"
      },
      word_puzzle: {
        title: "শব্দ সেতু — Word & Memory Puzzle",
        subtitle: "প্রিয় স্থান, পরিবারের নাম এবং জলখাবারের শব্দ সাজান।",
        badge: "ধাপভিত্তিক ইঙ্গিত"
      },
      picture_match: {
        title: "ছবি মেলানো — Match the First Picture",
        subtitle: "প্রথম ছবিটি মন দিয়ে দেখুন এবং সঠিক ছবিটি বেছে নিন।",
        badge: "ছবি সনাক্তকরণ"
      },
      cultural_reminiscence: {
        title: "ঐতিহ্যের যাত্রা — Heritage Journey",
        subtitle: "রঙালী বিহু, চা বাগান, কাজিরাঙা ও ব্রহ্মপুত্রের স্মৃতি।",
        badge: "সাংস্কৃতিক স্মৃতি"
      },
      daily_routine: {
        title: "দৈনন্দিন রুটিন — Daily Routines",
        subtitle: "সকালের লাল চা, বারান্দায় হাঁটা ও সন্ধ্যার প্রার্থনার সঙ্গী।",
        badge: "নিয়মিত সহায়তা"
      },
      storytelling: {
        title: "লোকগাথা ও ভ্রমণ স্মৃতি — Folk Stories & Travel",
        subtitle: "পুরনো স্টিমার ভ্রমণ, রূপকথা ও গল্পের স্মৃতি পরীক্ষা।",
        badge: "গল্প ও স্মৃতি পরীক্ষা"
      },
      vr_memory: {
        title: "ব্যক্তিগত ভিআর স্মৃতি লোক",
        subtitle: "শান্ত ত্রিমাত্রিক পরিবেশে আপনার পরিবার, পুরনো ভিটে ও মধুর স্মৃতির মাঝে ফিরে যান।",
        badge: "Spatial VR & Voice Memory"
      },
      ai_pet: {
        title: "মোতি — আদরের AI পোষা বন্ধু",
        subtitle: "মোতিকে আদর করুন, কথা বলুন এবং শান্ত ছন্দের শ্বাস-প্রশ্বাসের অভ্যাস করুন।",
        badge: "আদর ও শান্ত শ্বাস"
      },
      heirloom_scanner: {
        title: "পুরনো স্মৃতি সামগ্রী ও বাটি স্ক্যানার",
        subtitle: "কাঁসার বাটি, লাল গামোছা ও রেডিও স্পর্শ করে পুরনো সোনালী দিনের গল্প শুনুন।",
        badge: "স্মৃতি সামগ্রী ও গল্প"
      },
      family_board: {
        title: "মমতার চিঠি — পারিবারিক ফলক",
        subtitle: "দূর থেকে আপনার ছেলেমেয়ে ও নাতি-নাতনিদের পাঠানো মিষ্টি চিঠি ও কণ্ঠস্বর শুনুন।",
        badge: "পরিবারের সরাসরি বার্তা"
      },
      pentamind_drawing: {
        title: "পঞ্চভুজ ও ঘড়ি অঙ্কন — PentaMind",
        subtitle: "দুটি পঞ্চভুজ একে অপরের সাথে সংযুক্ত করে শান্তভাবে ছবি আঁকুন এবং মনোযোগ বাড়ান।",
        badge: "ক্লিনিক্যাল ড্রয়িং মূল্যায়ন"
      },
      virtual_presence: {
        title: "পারিবারিক ভার্চুয়াল সাক্ষাত কক্ষ",
        subtitle: "গোলাঘাট থেকে দীপক ও ব্যাঙ্গালোর থেকে ময়নার মিষ্টি ভিডিও ও আশীর্বাদের কণ্ঠস্বর শুনুন।",
        badge: "Relief ধরণ • মমতার উপস্থিতি"
      },
      everyday_detective: {
        title: "পরিচিত দৃশ্য সন্ধান — Everyday Detective",
        subtitle: "সকালের চায়ের বারান্দা ও রান্নাঘরের মতো পরিচিত পারিবারিক দৃশ্যে প্রিয় জিনিসগুলি খুঁজে নিন।",
        badge: "দৃষ্টিসংযোগ ও গৃহস্থালী পরিচয়"
      },
      sound_memory_quest: {
        title: "সুর ও স্মৃতির সন্ধান — Sound Memory Quest",
        subtitle: "মন্দিরের কাঁসর-ঘণ্টা, টিনের চালে বৃষ্টির শব্দ ও চা বাগানের ট্রেনের বাঁশি শুনে স্মৃতি রোমন্থন করুন।",
        badge: "শ্রবণ মনোযোগ ও স্মৃতি রোমন্থন"
      },
      recipe_rebuilder: {
        title: "রান্নাঘরের স্বাদ — Recipe Rebuilder",
        subtitle: "আসামের লাল চা ও ঐতিহ্যবাহী জলখাবার তৈরির সুন্দর ধাপগুলি ক্রমানুসারে সাজান।",
        badge: "ধারাবাহিক স্মৃতি ও সহজ পরিকল্পনা"
      },
      garden_of_memories: {
        title: "স্মৃতির বাগান — Garden of Memories",
        subtitle: "শান্ত আঙিনার বাগান গড়ে তুলুন: পছন্দের অর্কিড, গাঁদা ফুল ও পবিত্র তুলসী গাছ রোপণ করুন।",
        badge: "সৃজনশীল প্রশান্তি ও ইন্দ্রিয় সুখ"
      },
      focus_peripheral: {
        title: "দৃষ্টিসংযোগ ও পারিপার্শ্বিক সচেতনতা — Focus & Periphery",
        subtitle: "মাঝের শান্ত প্রদীপের শিখায় চোখ রেখে চারপাশের প্রান্তে ভেসে ওঠা পরিচিত লক্ষ্য চিহ্নিত করুন।",
        badge: "দৃষ্টিসংযোগ ও পারিপার্শ্বিক অনুভূতি"
      },
      focus_finder: {
        title: "মনোযোগ সন্ধান — Focus Finder",
        subtitle: "বারান্দা, রান্নাঘর ও উঠোনের সুন্দর দৃশ্যে নির্দিষ্ট জিনিসগুলি চিহ্নিত করুন।",
        badge: "দৃশ্য সন্ধান ও মনোযোগ"
      },
      smriti_match_quest: {
        title: "স্মৃতি মেলানো অভিযান — Smriti Match Quest",
        subtitle: "খোলা কার্ডের গ্রিডে একই ছবির দুটি জোড়া খুঁজে নিয়ে সুন্দরভাবে মিলিয়ে ফেলুন।",
        badge: "দৃশ্যমান কার্ড মেলানো"
      },
      tune_memory: {
        title: "সুর স্মৃতি — Tune Memory",
        subtitle: "মন্দিরের ঘণ্টা, বাঁশি ও বৃষ্টির সুর শুনে বাদ্যযন্ত্র চিনুন এবং সুরের ধারা মনে রাখুন।",
        badge: "শ্রবণ মনোযোগ ও সুর স্মরণ"
      }
    },

    numberWords: {
      0: "শূন্য", 1: "এক", 2: "দুই", 3: "তিন", 4: "চার",
      5: "পাঁচ", 6: "ছয়", 7: "সাত", 8: "আট", 9: "নয়"
    },

    numberGame: {
      watchPrompt: "মন দিয়ে দেখুন, সংখ্যাগুলি আসবে:",
      tapPrompt: "এখন একই ক্রমানুসারে সংখ্যাগুলি স্পর্শ করুন:",
      gentleGuide: "সহজ সহায়তা: সঠিক সংখ্যাগুলি নিচে হলুদ রঙে দেখানো হয়েছে!",
      replay: "আবার দেখান",
      undo: "মুছুন",
      successTitle: "চমৎকার স্মৃতিশক্তি!",
      successMsg: "সবকটি সংখ্যা সঠিক ক্রমে মনে রেখেছেন।",
      nextLevel: "পরবর্তী স্তরে যান",
      complete: "সম্পূর্ণ হলো"
    },

    wordGame: {
      title: "শব্দ সেতু — Word Puzzle",
      category: "বিষয়",
      tieredHints: "ধাপভিত্তিক মিষ্টি ইঙ্গিত",
      hint1Btn: "ইঙ্গিত ১ (পরিবেশ)",
      hint2Btn: "ইঙ্গিত ২ (অনুভূতি)",
      hint3Btn: "ইঙ্গিত ৩ (অক্ষর)",
      adaptiveNotice: "সহজ গতি: অপ্রয়োজনীয় অক্ষর সরিয়ে শুধু প্রয়োজনীয় অক্ষরগুলি রাখা হয়েছে!",
      formWord: "শব্দটি গঠন করুন",
      undo: "অক্ষর মুছুন",
      clear: "সব মুছুন",
      successTitle: "অপূর্ব উত্তর!",
      nextWord: "পরবর্তী শব্দ",
      complete: "সম্পূর্ণ হলো"
    },

    pictureGame: {
      title: "ছবি মেলানো — Picture Match",
      studyPrompt: "এই ছবিটি মন দিয়ে দেখুন:",
      readyBtn: "আমি দেখেছি, খুঁজতে প্রস্তুত!",
      whichMatch: "আপনি মাত্র যে ছবিটি দেখলেন সেটি কোনটি?",
      adaptiveNotice: "সহজ গতি: আপনার জন্য বিকল্প মাত্র ২টি করে দেওয়া হয়েছে!",
      previewAgain: "ছবিটি আবার দেখুন",
      successTitle: "সঠিক সনাক্তকরণ!",
      nextLevel: "পরবর্তী স্তর",
      complete: "সম্পূর্ণ হলো"
    },

    familyGame: {
      title: "পরিবারের স্মৃতি — Family Memory",
      visitingPrompt: "ছবিতে আপনার সাথে কে দেখা করতে এসেছেন?",
      giveClue: "ইঙ্গিত নিন",
      cluePrefix: "ইঙ্গিত:",
      adaptiveNotice: "সহজ গতি: আপনার জন্য বিকল্প মাত্র ২টি করে দেওয়া হয়েছে!",
      successTitle: "চমৎকার স্মৃতিশক্তি!",
      nextPhoto: "পরবর্তী ছবি",
      complete: "সম্পূর্ণ হলো"
    },

    storytelling: {
      title: "লোকগাথা ও ভ্রমণ স্মৃতি",
      selectStory: "শুনতে ও স্মৃতিচারণ করতে একটি গল্প বেছে নিন:",
      listenWithAmbience: "গল্প শুনুন (শান্ত আবহের সাথে)",
      testRecallBtn: "গল্পের স্মৃতি স্মরণ (স্মৃতি খেলা)",
      backToStory: "গল্পে ফিরে যান",
      adaptiveNotice: "সহজ গতি: বিকল্প মাত্র ২টি করে দেওয়া হয়েছে!",
      successTitle: "অপূর্ব স্মৃতিচারণ!",
      successMsg: "গল্পের প্রতিটি খুঁটিনাটি আপনি চমৎকারভাবে মনে রেখেছেন।",
      nextStory: "পরবর্তী গল্প বা ভ্রমণ ডায়েরি",
      finish: "সম্পূর্ণ করুন"
    },

    dashboard: {
      welcomeMessage: "আজকের শান্তিময় দিনে আপনাকে সাদর অভ্যর্থনা।",
      checkinTitle: "দৈনিক মনের খোঁজ নেওয়া",
      checkinSubtitle: "আজ আপনার মন কেমন আছে?",
      todayChallengeTitle: "আজকের একটি মধুর স্মৃতি খেলা",
      todayChallengeBadge: "দৈনিক স্মৃতি ও আনন্দ",
      takeChallengeBtn: "খেলা শুরু করুন",
      challengeCompleted: "আজ স্নেহের সাথে সম্পন্ন হয়েছে!",
      favoriteMemoriesTitle: "স্নেহের স্মৃতি ও গল্পগাথা",
      dailyRoutinesTitle: "দৈনন্দিন রুটিন সঙ্গী",
      routineDone: "সম্পন্ন",
      routineMarkDone: "সম্পন্ন চিহ্নিত করুন",
      completedActivities: "আজকের সম্পন্ন কার্যকলাপ",
      nextActivity: "পরবর্তী কার্যকলাপ",
      allActivitiesTitle: "সকল শান্ত খেলা ও কার্যকলাপ",
      fontSize: "অক্ষরের আকার",
      contrast: "স্পষ্ট রঙ (Contrast)",
      voiceReadout: "প্রশ্নটি শুনুন",
      voicePause: "থামান",
      voiceResume: "পুনরায় শুনুন",
      voiceReplay: "আবার শুনুন",
      voiceStop: "বন্ধ করুন",
      speakAnswer: "মুখে বলুন",
      listening: "শোনা হচ্ছে...",
      tryAgain: "আবার চেষ্টা করুন",
      gentleHint: "সূত্র দেখুন",
      skipQuestion: "পরের জন্য রাখুন (Skip)",
      takeBreak: "একটু বিশ্রাম নিন",
      finishNow: "মূল পাতায় ফিরুন",
      notSure: "ঠিক মনে নেই",
      safeOfflineActive: "নিরাপদ অফলাইন মোড সক্রিয়",
      syncedWithCaregiver: "পরিচর্যাকারীর সাথে সংযুক্ত"
    }
  },

  hi: {
    greeting: "नमस्ते",
    suprabhat: "शुभ प्रभात",
    peacefulDay: "शांत और सुखद दिन",
    nerBadge: "पूर्वोत्तर भारत (NER) की सांस्कृतिक धरोहर",
    mainMenu: "मुख्य पृष्ठ",
    backToMenu: "मुख्य पृष्ठ पर लौटें",
    listenAloud: "बोलकर सुनें",
    listenStory: "कहानी सुनें (शांत संगीत के साथ)",
    listenHint: "संकेत सुनें",
    speaking: "बोला जा रहा है... (रोकने के लिए स्पर्श करें)",
    demoSetup: "देखभालकर्ता सेटअप",
    completedBanner: "एक सुंदर स्मृति सत्र संपन्न हुआ!",
    completedBannerSub: "आज अपने अनमोल पल और यादें हमारे साथ साझा करने के लिए धन्यवाद।",

    menuHeader: "मानसिक सक्रियता एवं सांस्कृतिक स्मृतियां",
    menuSub: "आनंदमय स्मृतियों और सौम्य अभ्यास से मन को तरोताज़ा रखें",
    open: "खेलें और अनुभव करें",

    modules: {
      family_recall: {
        title: "पारिवारिक स्मृति संजोना",
        subtitle: "प्रियजनों के चेहरे पहचानें, सुनहरी यादें ताज़ा करें और पारिवारिक संस्मरण सुनें।",
        badge: "चेहरे और संस्मरण"
      },
      number_sequence: {
        title: "संख्या क्रम स्मृति खेल",
        subtitle: "स्क्रीन पर आने वाली संख्याओं के शांत क्रम को याद रखें और उसी क्रम में स्पर्श करें।",
        badge: "अंक स्मृति (स्तर 1-4)"
      },
      word_puzzle: {
        title: "शब्द एवं स्मृति पहेली",
        subtitle: "मनपसंद स्थानों, परिजनों के नामों और दैनिक आदतों को मधुर संकेतों की सहायता से बनाएं।",
        badge: "सौम्य स्तरीय संकेत"
      },
      picture_match: {
        title: "चित्र मिलान खेल",
        subtitle: "सांस्कृतिक चित्र को ध्यानपूर्वक देखें और कार्ड्स में से वही चित्र पहचानें।",
        badge: "दृश्य पहचान"
      },
      cultural_reminiscence: {
        title: "विरासत की यात्रा",
        subtitle: "रंगाली बिहू, चाय बागान, माजुली के सत्र और ब्रह्मपुत्र की कल-कल बहती धारा की स्मृतियां।",
        badge: "सांस्कृतिक संस्मरण"
      },
      daily_routine: {
        title: "दैनिक दिनचर्या",
        subtitle: "सुबह की चाय, बरामदे की सैर और दिनभर के सुखद स्वास्थ्य का मार्गदर्शक साथी।",
        badge: "सुलभ दिनचर्या"
      },
      storytelling: {
        title: "लोककथाएं एवं यात्रा संस्मरण",
        subtitle: "सुप्रसिद्ध लोकगाथाओं, नदी यात्राओं में लीन हों और कहानी की स्मृतियों का आनंद लें।",
        badge: "कथावाचन एवं स्मरण"
      },
      vr_memory: {
        title: "व्यक्तिगत 3D स्मृति अनुभव",
        subtitle: "अपने पैतृक गांव, घर-आंगन और खुशी के पलों को शांत आभासी वातावरण में महसूस करें।",
        badge: "आभासी स्मृति"
      },
      ai_pet: {
        title: "मोती — साथी पालतू साथी",
        subtitle: "प्यार से सहलाएं, बातें करें। शांत लयबद्ध श्वास और स्नेहपूर्ण जुड़ाव का आनंद लें।",
        badge: "शांत श्वास एवं स्पर्श"
      },
      heirloom_scanner: {
        title: "पारिवारिक धरोहर स्कैनर",
        subtitle: "पारिवारिक पीतल के पात्र, शादी का गमोसा और पुराने रेडियो को छूकर उनकी कहानी सुनें।",
        badge: "धरोहर एवं मौखिक इतिहास"
      },
      family_board: {
        title: "पारिवारिक संदेश बोर्ड",
        subtitle: "देशभर में बसे परिजनों के भेजे हुए प्रेमपूर्ण वॉयस संदेश और तस्वीरें देखें।",
        badge: "सजीव पारिवारिक पोस्टकार्ड"
      },
      pentamind_drawing: {
        title: "पेंटामाइंड सौम्य चित्रांकन",
        subtitle: "पंचकोण और घड़ी के मुख को शांत हाथों से आरेखित करें। सौम्य और गैर-तनावपूर्ण।",
        badge: "दृश्य-स्थानिक चित्रांकन"
      },
      virtual_presence: {
        title: "पारिवारिक आभासी उपस्थिति कक्ष",
        subtitle: "गोलाघाट से दीपक और बैंगलोर से मैना के आत्मीय वीडियो संदेश जब चाहें देखें।",
        badge: "आत्मीय उपस्थिति"
      },
      everyday_detective: {
        title: "दैनिक जासूस (दृश्य पहचान)",
        subtitle: "सुबह की चाय की मेज़ और रसोईघर जैसे परिचित दृश्यों में पसंदीदा वस्तुओं को खोजें।",
        badge: "दृश्य ध्यान एवं पहचान"
      },
      sound_memory_quest: {
        title: "ध्वनि से स्मृति यात्रा (सुर और यादें)",
        subtitle: "मंदिर के घंटे, छत पर बारिश और चाय बागान की सीटी जैसी मधुर ध्वनियां सुनकर पहचानें।",
        badge: "श्रवण ध्यान एवं संस्मरण"
      },
      recipe_rebuilder: {
        title: "पारंपरिक व्यंजन क्रम (रसोईघर की यादें)",
        subtitle: "असमिया लाल चाय बनाने के पारंपरिक चरणों को चित्रों की सहायता से सही क्रम में सजाएं।",
        badge: "प्रक्रियात्मक स्मृति एवं योजना"
      },
      garden_of_memories: {
        title: "स्मृतियों का उपवन (शांतिमय बगीचा)",
        subtitle: "अपने आंगन का सुंदर बगीचा सजाएं: ऑर्किड, गेंदा, चमेली और तुलसी के पौधे लगाएं।",
        badge: "रचनात्मक शांति एवं संवेदी सुकून"
      },
      focus_peripheral: {
        title: "ध्यान एवं परिधीय सजगता — Focus & Periphery",
        subtitle: "स्क्रीन के केंद्र में जलते शांत दीपक पर दृष्टि बनाए रखें और कोनों में उभरती परिचित वस्तुओं को पहचानें।",
        badge: "दृश्य ध्यान एवं परिधीय सजगता"
      },
      focus_finder: {
        title: "फोकस खोजकर्ता — Focus Finder",
        subtitle: "बरामदा, रसोई और आंगन के घरेलू दृश्यों में पूछे गए सामान को खोजें।",
        badge: "दृश्य खोज एवं ध्यान"
      },
      smriti_match_quest: {
        title: "स्मृति मैच क्वेस्ट — Smriti Match Quest",
        subtitle: "खुले कार्ड्स के ग्रिड में से एक कार्ड चुनें और उसके जैसी हूबहू जोड़ी खोजें।",
        badge: "दृश्यमान कार्ड मिलान"
      },
      tune_memory: {
        title: "धुन स्मृति — Tune Memory",
        subtitle: "मंदिर की घंटी, बांसुरी और बारिश की ध्वनियां सुनकर वाद्य पहचानें एवं धुन का क्रम याद रखें।",
        badge: "श्रवण ध्यान एवं धुन स्मरण"
      }
    },

    numberWords: {
      0: "शून्य", 1: "एक", 2: "दो", 3: "तीन", 4: "चार",
      5: "पांच", 6: "छह", 7: "सात", 8: "आठ", 9: "नौ"
    },

    numberGame: {
      watchPrompt: "संख्याओं को शांत मन से देखें:",
      tapPrompt: "अब, उसी क्रम में संख्याओं को स्पर्श करें:",
      gentleGuide: "मार्गदर्शन: नीचे आवश्यक संख्याएं सुनहरे रंग में हाइलाइट हैं!",
      replay: "क्रम पुनः देखें",
      undo: "पिछला अंक हटाएं",
      successTitle: "अद्भुत स्मरण!",
      successMsg: "हर संख्या बिल्कुल सही क्रम में याद रखी।",
      nextLevel: "अगले स्तर पर जाएं",
      complete: "सत्र पूर्ण करें"
    },

    wordGame: {
      title: "शब्द एवं स्मृति पहेली",
      category: "विषय",
      tieredHints: "सौम्य चरणबद्ध संकेत",
      hint1Btn: "संकेत 1 (संदर्भ)",
      hint2Btn: "संकेत 2 (भाव)",
      hint3Btn: "संकेत 3 (अक्षर)",
      adaptiveNotice: "सरल गति: केवल आवश्यक अक्षर ही नीचे दिए गए हैं!",
      formWord: "शब्द बनाएं",
      undo: "अक्षर हटाएं",
      clear: "सब हटाएं",
      successTitle: "शानदार उत्तर!",
      nextWord: "अगला शब्द",
      complete: "सत्र पूर्ण हुआ"
    },

    pictureGame: {
      title: "चित्र मिलान खेल",
      studyPrompt: "इस चित्र को ध्यान से देखिए:",
      readyBtn: "मैंने देख लिया, खोजने के लिए तैयार!",
      whichMatch: "आपने अभी जो चित्र देखा वह इनमें से कौन सा है?",
      adaptiveNotice: "सरल गति: आपके लिए केवल 2 सरल विकल्प रखे गए हैं!",
      previewAgain: "चित्र फिर से देखें",
      successTitle: "सटीक पहचान!",
      nextLevel: "अगला स्तर",
      complete: "सत्र पूर्ण हुआ"
    },

    familyGame: {
      title: "पारिवारिक स्मृति संजोना",
      visitingPrompt: "तस्वीर में आपसे मिलने कौन आया है?",
      giveClue: "संकेत लें",
      cluePrefix: "संकेत:",
      adaptiveNotice: "सरल गति: आपके लिए विकल्प केवल 2 कर दिए गए हैं!",
      successTitle: "अति सुंदर स्मरण शक्ति!",
      nextPhoto: "अगली तस्वीर",
      complete: "सत्र पूर्ण हुआ"
    },

    storytelling: {
      title: "लोककथाएं एवं यात्रा संस्मरण",
      selectStory: "सुनने और याद करने के लिए एक कथा चुनें:",
      listenWithAmbience: "कथा सुनें (शांत संगीत के साथ)",
      testRecallBtn: "कथा के मुख्य अंश याद करें (स्मृति खेल)",
      backToStory: "कथा पर वापस जाएं",
      adaptiveNotice: "सरल गति: विकल्प केवल 2 कर दिए गए हैं!",
      successTitle: "अद्भुत स्मरण!",
      successMsg: "कथा का हर प्रसंग आपने अत्यंत स्पष्टता से याद रखा।",
      nextStory: "अगली कथा अथवा संस्मरण",
      finish: "समाप्त करें"
    },

    dashboard: {
      welcomeMessage: "आज के इस शांत और सुखद दिन में आपका स्नेहपूर्ण स्वागत है।",
      checkinTitle: "दैनिक मन का हालचाल",
      checkinSubtitle: "आज आपका मन कैसा है?",
      todayChallengeTitle: "आज की सुखद स्मृति गतिविधि",
      todayChallengeBadge: "दैनिक स्मरण एवं आनंद",
      takeChallengeBtn: "गतिविधि प्रारंभ करें",
      challengeCompleted: "आज आत्मीयता से पूर्ण हुआ!",
      favoriteMemoriesTitle: "प्रिय स्मृतियां एवं संस्मरण",
      dailyRoutinesTitle: "दैनिक दिनचर्या साथी",
      routineDone: "पूर्ण",
      routineMarkDone: "पूर्ण चिह्नित करें",
      completedActivities: "आज पूर्ण की गई गतिविधियां",
      nextActivity: "अगली गतिविधि",
      allActivitiesTitle: "सभी शांत खेल एवं गतिविधियां",
      fontSize: "अक्षर का आकार",
      contrast: "स्पष्ट रंग (Contrast)",
      voiceReadout: "प्रश्न सुनें",
      voicePause: "रोकें",
      voiceResume: "जारी रखें",
      voiceReplay: "पुनः सुनें",
      voiceStop: "आवाज़ बंद करें",
      speakAnswer: "बोलकर उत्तर दें",
      listening: "सुन रहे हैं...",
      tryAgain: "फिर प्रयास करें",
      gentleHint: "संकेत देखें",
      skipQuestion: "बाद के लिए छोड़ें (Skip)",
      takeBreak: "थोड़ा विश्राम करें",
      finishNow: "मुख्य पृष्ठ पर लौटें",
      notSure: "अभी याद नहीं आ रहा",
      safeOfflineActive: "सुरक्षित ऑफ़लाइन मोड सक्रिय",
      syncedWithCaregiver: "देखभालकर्ता से जुड़ा हुआ"
    }
  }
};
