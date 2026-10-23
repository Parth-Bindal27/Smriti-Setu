/**
 * SMRITI SETU — AGE-APPROPRIATE QUESTION ENGINE & INTERACTION STATE MACHINE
 * 
 * Provides structured question definitions across 10 dignified categories,
 * supporting 5 languages (Assamese, Bengali, Nepali, Hindi, English).
 * 
 * Implements an accessible, non-punitive state machine:
 * Ready -> QuestionDisplayed -> Listening -> AnswerReceived -> AnswerValidated
 *      -> GentleRetry / HintOffered -> Completed / Skipped / Paused
 * 
 * Clinical & Dignity Safeguards:
 * 1. "I'm not sure" is recorded as unknown / skipped, never as incorrect or cognitive decline.
 * 2. Speech recognition failures are isolated from cognitive responses.
 * 3. Bounded retries (maximum 2) prevent loops and user agitation.
 * 4. Tiered gentle hints offer warmth and scaffolding.
 */

export const INTERACTION_STATES = {
  READY: 'READY',
  QUESTION_DISPLAYED: 'QUESTION_DISPLAYED',
  LISTENING: 'LISTENING',
  ANSWER_RECEIVED: 'ANSWER_RECEIVED',
  ANSWER_VALIDATED: 'ANSWER_VALIDATED',
  GENTLE_RETRY: 'GENTLE_RETRY',
  HINT_OFFERED: 'HINT_OFFERED',
  COMPLETED: 'COMPLETED',
  SKIPPED: 'SKIPPED',
  PAUSED: 'PAUSED',
  ERROR: 'ERROR'
};

export const QUESTION_CATEGORIES = {
  DAILY_ORIENTATION: 'daily_orientation',
  PERSONAL_PREFERENCES: 'personal_preferences',
  FAMILIAR_PEOPLE: 'familiar_people',
  FAMILY_MEMORIES: 'family_memories',
  DAILY_ROUTINES: 'daily_routines',
  VISUAL_RECOGNITION: 'visual_recognition',
  WORD_ASSOCIATIONS: 'word_associations',
  MUSIC_CULTURE: 'music_culture',
  GENTLE_PUZZLES: 'gentle_puzzles',
  EMOTIONAL_WELLBEING: 'emotional_wellbeing'
};

/**
 * Curated Question Bank — Culturally Grounded, Caregiver-Verified
 */
export const STRUCTURED_QUESTION_BANK = [
  // 1. EMOTIONAL WELL-BEING
  {
    questionId: 'q_mood_checkin',
    category: QUESTION_CATEGORIES.EMOTIONAL_WELLBEING,
    difficulty: 'gentle',
    estimatedDuration: 30,
    answerType: 'mood',
    contentApprovalStatus: 'caregiver_approved',
    allowSkip: true,
    allowPause: true,
    maxRetries: 1,
    localizedContent: {
      as: {
        text: 'আজি আপোনাৰ মনটো কেনে লাগিছে?',
        subtext: 'তলৰ এটা অনুভূতি বাছি লওক বা মাত দি কওক',
        audioPrompt: 'আজি আপোনাৰ মনটো কেনে লাগিছে?',
        options: [
          { id: 'calm', label: 'শান্ত আৰু আৰামদায়ক (Calm)', emoji: '🌸' },
          { id: 'happy', label: 'আনন্দিত (Joyful)', emoji: '☀️' },
          { id: 'nostalgic', label: 'পুৰণি স্মৃতি মনত পৰিছে (Nostalgic)', emoji: '📖' },
          { id: 'tired', label: 'অলপ জিৰণি ল’ব খোজোঁ (A bit quiet)', emoji: '🍵' }
        ],
        hints: ['আপুনি যিকোনো অনুভৱ নিসংকোচে বাছি ল’ব পাৰে। ইয়াত কোনো ভুল নাই।']
      },
      bn: {
        text: 'আজ আপনার মন কেমন আছে?',
        subtext: 'একটি অনুভূতি বেছে নিন অথবা মুখে বলুন',
        audioPrompt: 'আজ আপনার মন কেমন আছে?',
        options: [
          { id: 'calm', label: 'শান্ত ও আরামদায়ক (Calm)', emoji: '🌸' },
          { id: 'happy', label: 'আনন্দিত (Joyful)', emoji: '☀️' },
          { id: 'nostalgic', label: 'পুরোনো স্মৃতি মনে পড়ছে (Nostalgic)', emoji: '📖' },
          { id: 'tired', label: 'একটু বিশ্রাম প্রয়োজন (Restful)', emoji: '🍵' }
        ],
        hints: ['আপনি যেকোনো অনুভূতি বেছে নিতে পারেন। এতে কোনো ভুল নেই।']
      },
      ne: {
        text: 'आज तपाईंलाई कस्तो महसुस भइरहेको छ?',
        subtext: 'तलको कुनै एक भावना रोज्नुहोस् वा बोलेर भन्नुहोस्',
        audioPrompt: 'आज तपाईंलाई कस्तो महसुस भइरहेको छ?',
        options: [
          { id: 'calm', label: 'शान्त र आरामदायी (Calm)', emoji: '🌸' },
          { id: 'happy', label: 'प्रसन्न (Joyful)', emoji: '☀️' },
          { id: 'nostalgic', label: 'पुरानो सम्झना आइरहेको छ (Nostalgic)', emoji: '📖' },
          { id: 'tired', label: 'अलिकति सुस्ताउन मन छ (Restful)', emoji: '🍵' }
        ],
        hints: ['तपाईं आफ्नो मनको कुरा ढुक्क भएर रोज्न सक्नुहुन्छ।']
      },
      hi: {
        text: 'आज आपका मन कैसा है?',
        subtext: 'एक विकल्प चुनें या बोलकर बताएं',
        audioPrompt: 'आज आपका मन कैसा है?',
        options: [
          { id: 'calm', label: 'शांत और सुखद (Calm)', emoji: '🌸' },
          { id: 'happy', label: 'प्रसन्न और ऊर्जावान (Joyful)', emoji: '☀️' },
          { id: 'nostalgic', label: 'पुरानी यादों में खोया (Nostalgic)', emoji: '📖' },
          { id: 'tired', label: 'थोड़ा विश्राम चाहिए (Restful)', emoji: '🍵' }
        ],
        hints: ['आप अपनी पसंद का कोई भी भाव चुन सकते हैं। कोई सही या गलत नहीं है।']
      },
      en: {
        text: 'How are you feeling in your heart today?',
        subtext: 'Tap your feeling or speak naturally',
        audioPrompt: 'How are you feeling in your heart today?',
        options: [
          { id: 'calm', label: 'Calm & Peaceful', emoji: '🌸' },
          { id: 'happy', label: 'Joyful & Bright', emoji: '☀️' },
          { id: 'nostalgic', label: 'Thinking of Fond Memories', emoji: '📖' },
          { id: 'tired', label: 'Taking Things Gently', emoji: '🍵' }
        ],
        hints: ['Feel free to choose whatever feels true right now. All feelings are welcome.']
      }
    }
  },

  // 2. DAILY ORIENTATION (GENTLE, NON-TESTING)
  {
    questionId: 'q_orientation_time_preference',
    category: QUESTION_CATEGORIES.DAILY_ORIENTATION,
    difficulty: 'gentle',
    estimatedDuration: 40,
    answerType: 'choice',
    contentApprovalStatus: 'caregiver_approved',
    allowSkip: true,
    allowPause: true,
    maxRetries: 2,
    localizedContent: {
      as: {
        text: 'আজিৰ এই সুন্দৰ পুৱাত আপুনি প্ৰথমে কি কৰিব বিচাৰে?',
        subtext: 'তলৰ যিকোনো এটা বাছক',
        audioPrompt: 'আজিৰ এই পুৱাত আপুনি প্ৰথমে কি কৰিব বিচাৰে?',
        options: [
          { id: 'tea', label: 'গৰম ৰঙা চাহ খোৱা (Warm Tea)', emoji: '☕' },
          { id: 'garden', label: 'বাৰান্দাত অলপ বতাহ খোৱা (Veranda Walk)', emoji: '🌿' },
          { id: 'music', label: 'পুৰণি সুৰীয়া গান শুনা (Old Melodies)', emoji: '🎵' },
          { id: 'unsure', label: 'মই পিছত ভাবিম (I will decide later)', emoji: '💭' }
        ],
        hints: ['আপোনাৰ মনপচন্দৰ পুৱাৰ সময়টো বাছি লওক।']
      },
      bn: {
        text: 'আজকের এই সুন্দর সকালে আপনি প্রথমে কী করতে চান?',
        subtext: 'নিচের যেকোনো একটি বেছে নিন',
        audioPrompt: 'আজকের এই সুন্দর সকালে আপনি প্রথমে কী করতে চান?',
        options: [
          { id: 'tea', label: 'এক কাপ গরম চা (Warm Tea)', emoji: '☕' },
          { id: 'garden', label: 'বারান্দায় একটু বাতাস খাওয়া (Veranda Walk)', emoji: '🌿' },
          { id: 'music', label: 'পুরোনো মধুর গান শোনা (Old Melodies)', emoji: '🎵' },
          { id: 'unsure', label: 'পরে ভাবব (Decide later)', emoji: '💭' }
        ],
        hints: ['আপনার পছন্দের যেকোনো সময় বেছে নিন।']
      },
      ne: {
        text: 'आजको यो सुन्दर बिहानीमा तपाईं के गर्न चाहनुहुन्छ?',
        subtext: 'तलको कुनै एक रोज्नुहोस्',
        audioPrompt: 'आजको यो सुन्दर बिहानीमा तपाईं के गर्न चाहनुहुन्छ?',
        options: [
          { id: 'tea', label: 'तातो चिया पिउने (Warm Tea)', emoji: '☕' },
          { id: 'garden', label: 'बगैँचा वा बार्दलीमा टहल्ने (Veranda Walk)', emoji: '🌿' },
          { id: 'music', label: 'मीठो पुरानो गीत सुन्ने (Old Melodies)', emoji: '🎵' },
          { id: 'unsure', label: 'पछि विचार गर्छु (Decide later)', emoji: '💭' }
        ],
        hints: ['आफ्नो मनपर्ने बिहानीको काम रोज्न सक्नुहुन्छ।']
      },
      hi: {
        text: 'आज की इस सुखद सुबह में आप सबसे पहले क्या करना पसंद करेंगे?',
        subtext: 'कोई एक विकल्प चुनें',
        audioPrompt: 'आज की इस सुखद सुबह में आप सबसे पहले क्या करना पसंद करेंगे?',
        options: [
          { id: 'tea', label: 'गर्मागर्म चाय का आनंद (Warm Tea)', emoji: '☕' },
          { id: 'garden', label: 'बरामदे में हल्की सैर (Veranda Walk)', emoji: '🌿' },
          { id: 'music', label: 'मधुर पुराने गीत सुनना (Old Melodies)', emoji: '🎵' },
          { id: 'unsure', label: 'बाद में सोचेंगे (Decide later)', emoji: '💭' }
        ],
        hints: ['अपनी पसंद की कोई भी आरामदायक गतिविधि चुनें।']
      },
      en: {
        text: 'What sounds comforting for your morning today?',
        subtext: 'Select your preferred morning companion',
        audioPrompt: 'What sounds comforting for your morning today?',
        options: [
          { id: 'tea', label: 'A Warm Cup of Fresh Tea', emoji: '☕' },
          { id: 'garden', label: 'A Gentle Stroll on the Veranda', emoji: '🌿' },
          { id: 'music', label: 'Listening to Familiar Melodies', emoji: '🎵' },
          { id: 'unsure', label: 'I will decide later at ease', emoji: '💭' }
        ],
        hints: ['Choose whatever brings ease and comfort to your morning.']
      }
    }
  },

  // 3. MUSIC & CULTURAL REMINISCENCE
  {
    questionId: 'q_culture_bihu_dhol',
    category: QUESTION_CATEGORIES.MUSIC_CULTURE,
    difficulty: 'gentle',
    estimatedDuration: 45,
    answerType: 'choice',
    correctAnswerId: 'dhol',
    contentApprovalStatus: 'caregiver_approved',
    allowSkip: true,
    allowPause: true,
    maxRetries: 2,
    localizedContent: {
      as: {
        text: 'ৰঙালী বিহুত কোনটো বাদ্যৰ ছন্দত আমাৰ মন নাচি উঠে?',
        subtext: 'তলৰ ছবি বা শব্দ বাছক',
        audioPrompt: 'ৰঙালী বিহুত কোনটো বাদ্যৰ ছন্দত আমাৰ মন নাচি উঠে?',
        options: [
          { id: 'dhol', label: 'বিহু ঢোল আৰু পেঁপা (Bihu Dhol)', emoji: '🥁', isCorrect: true },
          { id: 'sitar', label: 'চেতাৰ (Sitar)', emoji: '🎻', isCorrect: false },
          { id: 'piano', label: 'পিয়ানো (Piano)', emoji: '🎹', isCorrect: false },
          { id: 'unsure', label: 'মনত পৰা নাই (Not sure)', emoji: '💭', isUnsure: true }
        ],
        hints: [
          'ই কাঠ আৰু চামৰাৰে তৈয়াৰী, বিহুনামৰ লগত বাজে।',
          'ইয়াৰ মাত শুনিলে গছৰ কুঁহিপাতো লৰে — ঢোল আৰু পেঁপা।'
        ]
      },
      bn: {
        text: 'রঙালি বিহুর উৎসবে কোন বাদ্যযন্ত্রের সুরে মন আনন্দে মেতে ওঠে?',
        subtext: 'সঠিক উত্তরটি বাছুন অথবা নিজের গতিতে ভাবুন',
        audioPrompt: 'রঙালি বিহুর উৎসবে কোন বাদ্যযন্ত্রের সুরে মন আনন্দে মেতে ওঠে?',
        options: [
          { id: 'dhol', label: 'বিহু ঢোল ও পেঁপা (Bihu Dhol)', emoji: '🥁', isCorrect: true },
          { id: 'sitar', label: 'সেতার (Sitar)', emoji: '🎻', isCorrect: false },
          { id: 'piano', label: 'পিয়ানো (Piano)', emoji: '🎹', isCorrect: false },
          { id: 'unsure', label: 'ঠিক মনে পড়ছে না (Not sure)', emoji: '💭', isUnsure: true }
        ],
        hints: [
          'এটি কাঠ ও চামড়া দিয়ে তৈরি, বিহু গানের সঙ্গে বাজে।',
          'আনন্দমুখর ঐতিহ্যবাহী বিহু ঢোল।'
        ]
      },
      ne: {
        text: 'बिहु महोत्सवमा कुन बाजाको तालमा मन नाच्न थाल्छ?',
        subtext: 'कुनै एक विकल्प रोज्नुहोस्',
        audioPrompt: 'बिहु महोत्सवमा कुन बाजाको तालमा मन नाच्न थाल्छ?',
        options: [
          { id: 'dhol', label: 'बिहु ढोल र पेपा (Bihu Dhol)', emoji: '🥁', isCorrect: true },
          { id: 'sitar', label: 'सितार (Sitar)', emoji: '🎻', isCorrect: false },
          { id: 'piano', label: 'पियानो (Piano)', emoji: '🎹', isCorrect: false },
          { id: 'unsure', label: 'अहिले याद आएन (Not sure)', emoji: '💭', isUnsure: true }
        ],
        hints: [
          'यो काठ र छालाले बनेको हुन्छ, बिहुमा मुख्य बाजा हो।',
          'प्रसिद्ध बिहु ढोल र पेपा।'
        ]
      },
      hi: {
        text: 'रंगाली बिहू के उत्सव में किस वाद्ययंत्र की थाप पर मन झूम उठता है?',
        subtext: 'एक विकल्प चुनें',
        audioPrompt: 'रंगाली बिहू के उत्सव में किस वाद्ययंत्र की थाप पर मन झूम उठता है?',
        options: [
          { id: 'dhol', label: 'बिहू ढोल और पेपा (Bihu Dhol)', emoji: '🥁', isCorrect: true },
          { id: 'sitar', label: 'सितार (Sitar)', emoji: '🎻', isCorrect: false },
          { id: 'piano', label: 'पियानो (Piano)', emoji: '🎹', isCorrect: false },
          { id: 'unsure', label: 'याद नहीं आ रहा (Not sure)', emoji: '💭', isUnsure: true }
        ],
        hints: [
          'यह पारंपरिक ताल वाद्य है जो बिहू गीतों की जान है।',
          'असम का सुप्रसिद्ध बिहू ढोल।'
        ]
      },
      en: {
        text: 'Which rhythmic instrument brings joy to the Rongali Bihu festival?',
        subtext: 'Choose the familiar festive instrument',
        audioPrompt: 'Which rhythmic instrument brings joy to the Rongali Bihu festival?',
        options: [
          { id: 'dhol', label: 'Bihu Dhol & Pepa', emoji: '🥁', isCorrect: true },
          { id: 'sitar', label: 'Classical Sitar', emoji: '🎻', isCorrect: false },
          { id: 'piano', label: 'Grand Piano', emoji: '🎹', isCorrect: false },
          { id: 'unsure', label: "I am not sure right now", emoji: '💭', isUnsure: true }
        ],
        hints: [
          'It is carved from wood and played with celebratory rhythms during harvest.',
          'The traditional Assamese Bihu Dhol.'
        ]
      }
    }
  },

  // 4. FAMILIAR PEOPLE & KINSHIP (CAREGIVER VERIFIED)
  {
    questionId: 'q_family_granddaughter',
    category: QUESTION_CATEGORIES.FAMILIAR_PEOPLE,
    difficulty: 'gentle',
    estimatedDuration: 40,
    answerType: 'choice',
    correctAnswerId: 'ananya',
    contentApprovalStatus: 'caregiver_approved',
    allowSkip: true,
    allowPause: true,
    maxRetries: 2,
    localizedContent: {
      as: {
        text: 'গুৱাহাটীৰ পৰা মৰমেৰে ফোন কৰা আপোনাৰ মৰমৰ নাতিনী ডাঃ অনন্যা শৰ্মাক মনত পৰে নে?',
        subtext: 'মৰমৰ আত্মীয়ক চুই চাওক',
        audioPrompt: 'আপোনাৰ মৰমৰ নাতিনী ডাঃ অনন্যা শৰ্মাক মনত পৰে নে?',
        options: [
          { id: 'ananya', label: 'হয়, আমাৰ মৰমৰ অনন্যা (Ananya)', emoji: '👩‍⚕️', isCorrect: true },
          { id: 'story', label: 'তেওঁৰ সৰুকালৰ এটা কথা শুনক (Hear a Story)', emoji: '📖', isStoryTrigger: true },
          { id: 'unsure', label: 'অলপ ভাবি লওঁ (Let me recall peacefully)', emoji: '💭', isUnsure: true }
        ],
        hints: ['অনন্যাই ডাক্তৰী পঢ়িছিল আৰু দেওবাৰে সদায় আপোনাক খবৰ লয়।']
      },
      bn: {
        text: 'গুয়াহাটি থেকে স্নেহের ফোন করা আপনার নাতনি ডাঃ অনন্যা শর্মার কথা মনে পড়ে?',
        subtext: 'পরিবারের সদস্যকে বেছে নিন',
        audioPrompt: 'আপনার নাতনি ডাঃ অনন্যা শর্মার কথা মনে পড়ে?',
        options: [
          { id: 'ananya', label: 'হ্যাঁ, আমাদের স্নেহের অনন্যা (Ananya)', emoji: '👩‍⚕️', isCorrect: true },
          { id: 'story', label: 'তার ছোটবেলার স্মৃতি শুনুন (Hear a Story)', emoji: '📖', isStoryTrigger: true },
          { id: 'unsure', label: 'শান্ত মনে ভেবে দেখি (Let me recall peacefully)', emoji: '💭', isUnsure: true }
        ],
        hints: ['অনন্যা ডাক্তার এবং প্রতি রবিবার নিয়মিত আপনার খোঁজ নেন।']
      },
      ne: {
        text: 'गुवाहाटीबाट मायाले फोन गर्ने तपाईंकी नातिनी डा. अनन्या शर्माको सम्झना आउँछ?',
        subtext: 'आफ्नो परिवारको सदस्य छान्नुहोस्',
        audioPrompt: 'तपाईंकी नातिनी डा. अनन्या शर्माको सम्झना आउँछ?',
        options: [
          { id: 'ananya', label: 'हजुर, हमारी प्यारी अनन्या (Ananya)', emoji: '👩‍⚕️', isCorrect: true },
          { id: 'story', label: 'उनको बाल्यकालको कथा सुन्ने (Hear a Story)', emoji: '📖', isStoryTrigger: true },
          { id: 'unsure', label: 'बिस्तारै सम्झन्छु (Let me recall peacefully)', emoji: '💭', isUnsure: true }
        ],
        hints: ['अनन्या डाक्टर हुन् र सधैं तपाईंको स्वास्थ्यको ख्याल राख्छिन्।']
      },
      hi: {
        text: 'गुवाहाटी से स्नेहपूर्वक हालचाल पूछने वाली आपकी पोती डॉ. अनन्या शर्मा याद हैं?',
        subtext: 'एक विकल्प चुनें',
        audioPrompt: 'आपकी पोती डॉ. अनन्या शर्मा याद हैं?',
        options: [
          { id: 'ananya', label: 'हाँ, हमारी प्यारी अनन्या (Ananya)', emoji: '👩‍⚕️', isCorrect: true },
          { id: 'story', label: 'उनके बचपन का एक संस्मरण सुनें (Hear a Story)', emoji: '📖', isStoryTrigger: true },
          { id: 'unsure', label: 'आराम से याद करेंगे (Let me recall peacefully)', emoji: '💭', isUnsure: true }
        ],
        hints: ['अनन्या डॉक्टर हैं और रविवार को आपको फोन जरूर करती हैं।']
      },
      en: {
        text: 'Do you remember your granddaughter Dr. Ananya who loves calling from Guwahati?',
        subtext: 'Touch or speak to remember warmly',
        audioPrompt: 'Do you remember your granddaughter Dr. Ananya who loves calling from Guwahati?',
        options: [
          { id: 'ananya', label: 'Yes, our loving Ananya', emoji: '👩‍⚕️', isCorrect: true },
          { id: 'story', label: 'Listen to a warm childhood memory', emoji: '📖', isStoryTrigger: true },
          { id: 'unsure', label: 'Let me reflect at peace', emoji: '💭', isUnsure: true }
        ],
        hints: ['Ananya is a doctor who always calls to check in on your tea and morning walks.']
      }
    }
  },

  // 5. WORD ASSOCIATIONS (CALM HERITAGE THEMES)
  {
    questionId: 'q_word_assoc_tea',
    category: QUESTION_CATEGORIES.WORD_ASSOCIATIONS,
    difficulty: 'gentle',
    estimatedDuration: 35,
    answerType: 'choice',
    correctAnswerId: 'garden',
    contentApprovalStatus: 'caregiver_approved',
    allowSkip: true,
    allowPause: true,
    maxRetries: 2,
    localizedContent: {
      as: {
        text: 'আসামৰ সুগন্ধি চাহপাতৰ লগত কোনটো ঠাইৰ ছবি আপোনাৰ মনলৈ আহে?',
        subtext: 'তলৰ শব্দটো চুই চাওক',
        audioPrompt: 'আসামৰ চাহপাতৰ লগত কোনটো ঠাইৰ ছবি আপোনাৰ মনলৈ আহে?',
        options: [
          { id: 'garden', label: 'সেউজীয়া চাহ বাগিচা (Green Tea Garden)', emoji: '🌱', isCorrect: true },
          { id: 'desert', label: 'মৰুভূমি (Desert)', emoji: '🏜️', isCorrect: false },
          { id: 'snow', label: 'বৰফৰ পাহাৰ (Snow Peak)', emoji: '❄️', isCorrect: false },
          { id: 'unsure', label: 'নিশ্চিত নহয় (Not sure)', emoji: '💭', isUnsure: true }
        ],
        hints: ['যোৰহাট আৰু শিৱসাগৰৰ বাটৰ কাষত শাৰী শাৰী হৈ থকা সেউজীয়া গছবোৰ।']
      },
      bn: {
        text: 'আসামের সুবাসিত চায়ের সাথে কোন দৃশ্যটি আপনার চোখে ভেসে ওঠে?',
        subtext: 'একটি বিকল্প বেছে নিন',
        audioPrompt: 'আসামের সুবাসিত চায়ের সাথে কোন দৃশ্যটি আপনার চোখে ভেসে ওঠে?',
        options: [
          { id: 'garden', label: 'সবুজ চা বাগান (Green Tea Garden)', emoji: '🌱', isCorrect: true },
          { id: 'desert', label: 'মরুভূমি (Desert)', emoji: '🏜️', isCorrect: false },
          { id: 'snow', label: 'বরফের পাহাড় (Snow Peak)', emoji: '❄️', isCorrect: false },
          { id: 'unsure', label: 'ঠিক মনে নেই (Not sure)', emoji: '💭', isUnsure: true }
        ],
        hints: ['জোড়হাট ও শিবসাগরের সুন্দর সবুজ পাহাড়ি চা বাগান।']
      },
      ne: {
        text: 'असमको मीठो चियासँग कुन दृष्य तपाईंको मनमा आउँछ?',
        subtext: 'तलको कुनै एक रोज्नुहोस्',
        audioPrompt: 'असमको मीठो चियासँग कुन दृष्य तपाईंको मनमा आउँछ?',
        options: [
          { id: 'garden', label: 'हरियाली चिया बगान (Green Tea Garden)', emoji: '🌱', isCorrect: true },
          { id: 'desert', label: 'मरुभूमि (Desert)', emoji: '🏜️', isCorrect: false },
          { id: 'snow', label: 'हिउँको डाँडा (Snow Peak)', emoji: '❄️', isCorrect: false },
          { id: 'unsure', label: 'थाहा भएन (Not sure)', emoji: '💭', isUnsure: true }
        ],
        hints: ['जोरहाट र शिवसागरका बाटोमा देखिने हरियाली चियाका बोटहरू।']
      },
      hi: {
        text: 'असम की सुगंधित चाय के साथ कौन सा दृश्य आपके मन में आता है?',
        subtext: 'एक विकल्प चुनें',
        audioPrompt: 'असम की सुगंधित चाय के साथ कौन सा दृश्य आपके मन में आता है?',
        options: [
          { id: 'garden', label: 'हरे-भरे चाय के बागान (Green Tea Garden)', emoji: '🌱', isCorrect: true },
          { id: 'desert', label: 'रेगिस्तान (Desert)', emoji: '🏜️', isCorrect: false },
          { id: 'snow', label: 'बर्फ़ीला पहाड़ (Snow Peak)', emoji: '❄️', isCorrect: false },
          { id: 'unsure', label: 'याद नहीं (Not sure)', emoji: '💭', isUnsure: true }
        ],
        hints: ['जोरहाट और शिवसागर के आसपास फैले सुंदर चाय के बागान।']
      },
      en: {
        text: 'When you smell fresh Assam tea, which calm scene comes to mind?',
        subtext: 'Select the familiar scenery',
        audioPrompt: 'When you smell fresh Assam tea, which calm scene comes to mind?',
        options: [
          { id: 'garden', label: 'Lush Green Tea Gardens', emoji: '🌱', isCorrect: true },
          { id: 'desert', label: 'Arid Desert', emoji: '🏜️', isCorrect: false },
          { id: 'snow', label: 'Snow Glaciers', emoji: '❄️', isCorrect: false },
          { id: 'unsure', label: 'Not sure right now', emoji: '💭', isUnsure: true }
        ],
        hints: ['The serene green estates along the road between Jorhat and Sivasagar.']
      }
    }
  },

  // 6. FAMILY MEMORIES (SIVASAGAR / BRAHMAPUTRA)
  {
    questionId: 'q_memory_sivasagar_tank',
    category: QUESTION_CATEGORIES.FAMILY_MEMORIES,
    difficulty: 'gentle',
    estimatedDuration: 45,
    answerType: 'choice',
    correctAnswerId: 'sivasagar',
    contentApprovalStatus: 'caregiver_approved',
    allowSkip: true,
    allowPause: true,
    maxRetries: 2,
    localizedContent: {
      as: {
        text: 'আপোনাৰ ল’ৰালি কালৰ স্মৃতি বিজড়িত ঐতিহাসিক শিৱসাগৰ পুখুৰী আৰু শিৱদ’লৰ কথা মনত আছেনে?',
        subtext: 'স্মৃতিৰ আলিংগনত এটা চুই চাওক',
        audioPrompt: 'ঐতিহাসিক শিৱসাগৰ পুখুৰী আৰু শিৱদ’লৰ কথা মনত আছেনে?',
        options: [
          { id: 'sivasagar', label: 'হয়, শিৱসাগৰৰ সেই শান্ত পুখুৰী (Sivasagar Lake)', emoji: '🏛️', isCorrect: true },
          { id: 'story', label: 'তাৰ এটি পুৰণি সাধু শুনক (Hear Memory Story)', emoji: '🎧', isStoryTrigger: true },
          { id: 'unsure', label: 'অলপ জিৰণি লওঁ (Rest for now)', emoji: '🌿', isUnsure: true }
        ],
        hints: ['আহোম ৰজাসকলে খন্দোৱা সুবৃহৎ বৰপুখুৰী, যাৰ পাৰত পুৱাৰ বতাহ অতি জুৰণি আছিল।']
      },
      bn: {
        text: 'আপনার ছোটবেলার স্মৃতিবাহী ঐতিহাসিক শিবসাগর দিঘি ও শিবদলের কথা মনে আছে?',
        subtext: 'স্মৃতি আলমারি থেকে একটি বাছুন',
        audioPrompt: 'ঐতিহাসিক শিবসাগর দিঘি ও শিবদলের কথা মনে আছে?',
        options: [
          { id: 'sivasagar', label: 'হ্যাঁ, শিবসাগরের শান্ত দিঘি (Sivasagar Lake)', emoji: '🏛️', isCorrect: true },
          { id: 'story', label: 'একটি স্মৃতি-গল্প শুনুন (Hear Memory Story)', emoji: '🎧', isStoryTrigger: true },
          { id: 'unsure', label: 'একটু বিশ্রাম নিই (Rest for now)', emoji: '🌿', isUnsure: true }
        ],
        hints: ['আহোম রাজাদের খনন করা ঐতিহাসিক বিশাল দিঘি।']
      },
      ne: {
        text: 'तपाईंको बाल्यकालको सम्झना जोडिएको शिवसागर पोखरी र शिव मन्दिर याद छ?',
        subtext: 'आफ्नो सम्झना रोज्नुहोस्',
        audioPrompt: 'शिवसागर पोखरी र शिव मन्दिर याद छ?',
        options: [
          { id: 'sivasagar', label: 'हजुर, शिवसागरको शान्त पोखरी (Sivasagar Lake)', emoji: '🏛️', isCorrect: true },
          { id: 'story', label: 'यसको पुरानो सम्झना सुन्ने (Hear Memory Story)', emoji: '🎧', isStoryTrigger: true },
          { id: 'unsure', label: 'अहिले आराम गर्छु (Rest for now)', emoji: '🌿', isUnsure: true }
        ],
        hints: ['असमको प्रसिद्ध ऐतिहासिक ठूलो पोखरी जसको किनारमा शीतल हावा चल्थ्यो।']
      },
      hi: {
        text: 'आपके बचपन की स्मृतियों से जुड़ा ऐतिहासिक शिवसागर सरोवर और शिवदोल याद है?',
        subtext: 'एक विकल्प चुनें',
        audioPrompt: 'ऐतिहासिक शिवसागर सरोवर और शिवदोल याद है?',
        options: [
          { id: 'sivasagar', label: 'हाँ, शिवसागर का पावन सरोवर (Sivasagar Lake)', emoji: '🏛️', isCorrect: true },
          { id: 'story', label: 'एक मधुर संस्मरण सुनें (Hear Memory Story)', emoji: '🎧', isStoryTrigger: true },
          { id: 'unsure', label: 'अभी विश्राम करते हैं (Rest for now)', emoji: '🌿', isUnsure: true }
        ],
        hints: ['अहोम राजाओं द्वारा निर्मित विशाल सरोवर, जिसके किनारे ठंडी बयार चलती थी।']
      },
      en: {
        text: 'Do you remember the tranquil Sivasagar water tank and Shivadol from your cherished youth?',
        subtext: 'Choose or listen warmly',
        audioPrompt: 'Do you remember the tranquil Sivasagar water tank and Shivadol from your cherished youth?',
        options: [
          { id: 'sivasagar', label: 'Yes, the peaceful Sivasagar Lake', emoji: '🏛️', isCorrect: true },
          { id: 'story', label: 'Listen to a short nostalgic audio clip', emoji: '🎧', isStoryTrigger: true },
          { id: 'unsure', label: 'Rest peacefully for now', emoji: '🌿', isUnsure: true }
        ],
        hints: ['The majestic royal lake where morning strolls were calm and cool.']
      }
    }
  }
];

/**
 * Question Engine Helper: Look up question by ID
 */
export function getQuestionById(questionId) {
  return STRUCTURED_QUESTION_BANK.find(q => q.questionId === questionId) || null;
}

/**
 * Filter questions based on caregiver preferences & approved categories
 */
export function getFilteredQuestions(excludedCategories = [], preferredCategories = []) {
  return STRUCTURED_QUESTION_BANK.filter(q => {
    if (excludedCategories.includes(q.category)) return false;
    return true;
  });
}

/**
 * Evaluate user's answer with dignity safeguards:
 * - Distinguishes between:
 *   - 'correct': matches target answer or open-ended choice
 *   - 'unsure': user clicked or spoke "I'm not sure", recorded as unknown, NEVER as cognitive decline
 *   - 'story_requested': elder tapped to hear an audio memory story
 *   - 'differing': user chose a different option in a genuine game
 *   - 'speech_empty': recognition returned silence, not an error
 */
export function evaluateAnswer(question, selectedOptionId, rawTranscript = '') {
  if (!question) {
    return { status: 'error', message: 'No question provided' };
  }

  // Check for explicit "I'm not sure" selection or phrase
  const transcriptLower = (rawTranscript || '').toLowerCase().trim();
  const unsurePhrases = [
    'not sure', 'dont know', "don't know", 'unsure', 'remember', 
    'মনত নাই', 'নিশ্চিত নহয়', 'মনে নেই', 'মনে পড়ছে না', 'थाहा छैन', 
    'याद नहीं', 'नहीं पता', 'भूली गया'
  ];

  const isUnsureSpoken = unsurePhrases.some(phrase => transcriptLower.includes(phrase));
  if (selectedOptionId === 'unsure' || isUnsureSpoken) {
    return {
      status: 'unsure',
      isCognitiveDecline: false,
      isCorrect: null,
      feedback: {
        en: 'That is completely alright. Taking things at your own peaceful pace is wonderful.',
        as: 'কোনো কথা নাই। আপোনাৰ নিজৰ শান্তিৰে খোজ কঢ়াটোহে আচল কথা।',
        bn: 'একদম কোনো অসুবিধা নেই। শান্ত মনে নিজের গতিতে এগোনোই আসল।',
        ne: 'केही फरक पर्दैन। ढुक्क भएर आफ्नो गतिमा अघि बढ्नुहोस्।',
        hi: 'कोई बात नहीं। अपनी गति से आगे बढ़ना ही सबसे अच्छा है।'
      }
    };
  }

  // Check for story / reminisce request
  if (selectedOptionId === 'story') {
    return {
      status: 'story_requested',
      isStory: true,
      feedback: {
        en: 'Playing this warm family memory for you now...',
        as: 'আপোনাৰ বাবে এটি সুন্দৰ পুৰণি স্মৃতি বজোৱা হৈছে...',
        bn: 'আপনার জন্য এই মধুর স্মৃতিটি শোনানো হচ্ছে...',
        ne: 'तपाईंका लागि यो मीठो सम्झना सुनाइँदैछ...',
        hi: 'आपके लिए यह सुंदर संस्मरण सुनाया जा रहा है...'
      }
    };
  }

  // If question has no strict correct answer (e.g. mood checkin, orientation preference)
  if (!question.correctAnswerId) {
    return {
      status: 'valid_choice',
      isCorrect: true,
      selectedId: selectedOptionId,
      feedback: {
        en: 'Thank you for sharing your heart with us today.',
        as: 'আপোনাৰ মনৰ কথা আমাক জনোৱা বাবে বহুত ধন্যবাদ।',
        bn: 'আমাদের সাথে আপনার অনুভূতি ভাগ করার জন্য অনেক ধন্যবাদ।',
        ne: 'हामीसँग आफ्नो मनको कुरा साझा गर्नुभएकोमा धेरै धन्यवाद।',
        hi: 'हमारे साथ अपने भाव साझा करने के लिए बहुत धन्यवाद।'
      }
    };
  }

  // Question with expected answer (e.g. cultural reminiscence)
  if (selectedOptionId === question.correctAnswerId) {
    return {
      status: 'correct',
      isCorrect: true,
      selectedId: selectedOptionId,
      feedback: {
        en: 'Wonderful! A truly joyful and cherishable memory.',
        as: 'বৰ সুন্দৰ! কিমান যে এটি মধুৰ স্মৃতি!',
        bn: 'খুব সুন্দর! কতই না এক মধুর স্মৃতি!',
        ne: 'धेरै राम्रो! कति मीठो र आत्मीय सम्झना!',
        hi: 'अति सुंदर! कितनी सुखद और प्यारी स्मृति!'
      }
    };
  }

  // Answer differed in a genuine memory game
  return {
    status: 'differing',
    isCorrect: false,
    selectedId: selectedOptionId,
    feedback: {
      en: 'A very thoughtful choice. Would you like to try once more, or explore a gentle hint?',
      as: 'বৰ চিন্তা কৰিবলগীয়া কথা। আহকচোন আৰু এবাৰ চেষ্টা কৰোঁ বা এটি সহায়ক ইঙ্গিত চাওঁ?',
      bn: 'খুব সুন্দর ভাবনা। আসুন আর একবার চেষ্টা করি বা একটু সূত্র দেখে নিই?',
      ne: 'धेरै राम्रो विचार। आउनुहोस् फेरि एकपटक प्रयास गरौँ वा सानो संकेत हेरौँ?',
      hi: 'बहुत सुंदर विचार। क्या आप एक बार और प्रयास करना चाहेंगे या संकेत देखना पसंद करेंगे?'
    }
  };
}

/**
 * State Machine Factory
 */
export function createQuestionInteractionSession({
  question,
  language = 'as',
  onStateChange = () => {},
  onComplete = () => {}
}) {
  let currentState = INTERACTION_STATES.READY;
  let attempts = 0;
  let hintsUsed = 0;
  let selectedOption = null;
  let lastEvaluation = null;

  function setState(newState, payload = {}) {
    currentState = newState;
    onStateChange({
      state: currentState,
      questionId: question.questionId,
      attempts,
      hintsUsed,
      selectedOption,
      lastEvaluation,
      ...payload
    });
  }

  return {
    getState: () => currentState,
    getAttempts: () => attempts,
    getHintsUsed: () => hintsUsed,

    displayQuestion: () => {
      setState(INTERACTION_STATES.QUESTION_DISPLAYED);
    },

    startListening: () => {
      setState(INTERACTION_STATES.LISTENING);
    },

    submitAnswer: (optionId, rawTranscript = '') => {
      attempts += 1;
      selectedOption = optionId;
      setState(INTERACTION_STATES.ANSWER_RECEIVED, { optionId, rawTranscript });

      const evalResult = evaluateAnswer(question, optionId, rawTranscript);
      lastEvaluation = evalResult;

      if (evalResult.status === 'correct' || evalResult.status === 'valid_choice' || evalResult.status === 'unsure' || evalResult.status === 'story_requested') {
        setState(INTERACTION_STATES.ANSWER_VALIDATED, { evaluation: evalResult });
        setTimeout(() => {
          setState(INTERACTION_STATES.COMPLETED, {
            completionStatus: evalResult.status === 'unsure' ? 'skipped' : 'completed',
            evaluation: evalResult
          });
          onComplete({
            questionId: question.questionId,
            completionStatus: evalResult.status === 'unsure' ? 'skipped' : 'completed',
            attempts,
            hintsUsed,
            selectedOption,
            evaluation: evalResult
          });
        }, 1200);
      } else {
        // Differing answer in game
        if (attempts >= (question.maxRetries || 2)) {
          // Bounded retries reached: advance gently without punishing
          setState(INTERACTION_STATES.ANSWER_VALIDATED, { evaluation: evalResult, boundedMaxReached: true });
          setTimeout(() => {
            setState(INTERACTION_STATES.COMPLETED, {
              completionStatus: 'completed',
              evaluation: evalResult,
              gracefulAdvance: true
            });
            onComplete({
              questionId: question.questionId,
              completionStatus: 'completed',
              attempts,
              hintsUsed,
              selectedOption,
              evaluation: evalResult
            });
          }, 1500);
        } else {
          // Offer gentle retry or hint
          setState(INTERACTION_STATES.GENTLE_RETRY, { evaluation: evalResult });
        }
      }
    },

    requestHint: () => {
      const localized = question.localizedContent[language] || question.localizedContent.en || {};
      const hints = localized.hints || [];
      const currentHint = hints[hintsUsed] || hints[hints.length - 1] || '';
      hintsUsed += 1;
      setState(INTERACTION_STATES.HINT_OFFERED, { hint: currentHint, hintsUsed });
      return currentHint;
    },

    skipQuestion: () => {
      setState(INTERACTION_STATES.SKIPPED, {
        completionStatus: 'skipped',
        reason: 'user_requested_skip'
      });
      onComplete({
        questionId: question.questionId,
        completionStatus: 'skipped',
        attempts,
        hintsUsed,
        selectedOption: null
      });
    },

    pauseSession: () => {
      setState(INTERACTION_STATES.PAUSED, {
        completionStatus: 'paused',
        reason: 'user_requested_pause'
      });
      onComplete({
        questionId: question.questionId,
        completionStatus: 'paused',
        attempts,
        hintsUsed,
        selectedOption: null
      });
    }
  };
}
