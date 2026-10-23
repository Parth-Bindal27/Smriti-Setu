const ElderlyProfile = require('./models/ElderlyProfile');
const FamilyMember = require('./models/FamilyMember');
const Routine = require('./models/Routine');
const Reminder = require('./models/Reminder');
const GameSession = require('./models/GameSession');
const Memory = require('./models/Memory');
const { MemoryGraphNode, MemoryGraphEdge } = require('./models/MemoryGraph');
const HeirloomObject = require('./models/HeirloomObject');
const SafeHarborZone = require('./models/SafeHarborZone');
const CaregiverJournal = require('./models/CaregiverJournal');
const VoiceBiomarker = require('./models/VoiceBiomarker');
const FamilyBoardPost = require('./models/FamilyBoardPost');

async function seedData() {
  console.log('[Seed] Checking database collections...');

  const profileCount = await ElderlyProfile.countDocuments();
  let profile = await ElderlyProfile.findOne();
  if (profileCount === 0) {
    console.log('[Seed] Seeding Elderly Profile...');
    profile = await ElderlyProfile.create({
      name: 'Bhaben Baruah',
      age: 76,
      preferredLanguage: 'Assamese / English',
      region: 'Jorhat, Assam',
      interests: [
        'Tea gardens',
        'Bihu folk songs',
        'Brahmaputra boat cruises',
        'Morning strolls'
      ],
      currentLevel: {
        photoRecall: 1,
        nameRecall: 1,
        routineSequencing: 1
      },
      honorific: 'Koka',
      greetingTitle: 'Suprabhat',
      hometown: 'Sivasagar & Jorhat, Assam',
      currentResidence: 'Beltola, Guwahati',
      primaryLanguage: 'Assamese',
      secondaryLanguage: 'English',
      culturalInterests: [
        'Rongali Bihu Celebrations',
        'Brahmaputra Sunset Cruises',
        'Majuli Island Mask Art',
        'Assam Orthodox Golden Tips Tea',
        'Naam-Ghor Spiritual Chants'
      ],
      comfortNotes: 'Responds warmly to memories of the Sivasagar historic tank, Rongali Bihu dhol beats, and childhood tea gardens.',
      emergencyContact: {
        name: 'Deepak Baruah (Son)',
        relation: 'Son',
        phone: '+91 98640 12345'
      },
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80'
    });
  } else if (!profile.currentLevel) {
    profile.currentLevel = { photoRecall: 1, nameRecall: 1, routineSequencing: 1 };
    profile.age = profile.age || 76;
    profile.region = profile.region || 'Jorhat, Assam';
    profile.preferredLanguage = profile.preferredLanguage || 'Assamese / English';
    await profile.save();
  }

  const familyCount = await FamilyMember.countDocuments();
  if (familyCount === 0) {
    console.log('[Seed] Seeding Family Members with authentic NER cultural memory hooks...');
    await FamilyMember.insertMany([
      {
        name: 'Maina (Rhea)',
        relation: 'Granddaughter',
        culturalRelation: 'Naati-Suwali',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
        memoryHook: 'She lives in Bangalore as a teacher. Whenever she returns for Magh Bihu, she sits beside you on the cane mora making warm Til Pitha and Narikol Laru!',
        voicePrompt: 'Look Koka, this is your granddaughter Maina, who loves making Bihu pitha with you.',
        favoriteMemory: 'Laughing together as the first pitha rolls out warm and fragrant.',
        residence: 'Bangalore / Guwahati',
        recallChoices: ['Maina (Granddaughter)', 'Rupa (Niece)', 'Ananya (Daughter)'],
        orderIndex: 1
      },
      {
        name: 'Rohan',
        relation: 'Grandson',
        culturalRelation: 'Naati-Lora',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
        memoryHook: 'He plays the Bihu dhol with great joy at the Guwahati Latasil field. He always puts on a red Phulam Gamusa and plays the rhythmic beats just for you!',
        voicePrompt: 'Here is your grandson Rohan, who loves playing the Bihu dhol for you.',
        favoriteMemory: 'Teaching him the classic 3-beat rhythm of Bohag Bihu on your veranda.',
        residence: 'Guwahati, Assam',
        recallChoices: ['Rohan (Grandson)', 'Bikash (Neighbor)', 'Deepak (Son)'],
        orderIndex: 2
      },
      {
        name: 'Deepak Baruah',
        relation: 'Son',
        culturalRelation: 'Dangor Lora',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
        memoryHook: 'Your eldest son who manages the tea gardens in Golaghat. Every weekend he brings you a box of fresh first-flush Assam orthodox tea leaves.',
        voicePrompt: 'This is Deepak, your caring son who brings the fragrant tea leaves from Golaghat.',
        favoriteMemory: 'Walking together through the morning mist of the tea estate inspecting tender green buds.',
        residence: 'Golaghat / Guwahati',
        recallChoices: ['Deepak (Son)', 'Pradip (Brother)', 'Rohan (Grandson)'],
        orderIndex: 3
      },
      {
        name: 'Dr. Ananya Sarma',
        relation: 'Daughter',
        culturalRelation: 'Maju Suwali',
        photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80',
        memoryHook: 'A physician at Guwahati Medical College. She visits every Sunday evening in her Muga silk Mekhela Sador to prepare your favorite ginger-cinnamon tea.',
        voicePrompt: 'Look Koka, it is your daughter Dr. Ananya, bringing your warm evening tea.',
        favoriteMemory: 'Sitting together as the evening river breeze sweeps across the garden.',
        residence: 'Guwahati, Assam',
        recallChoices: ['Ananya (Daughter)', 'Maina (Granddaughter)', 'Kalyani (Sister)'],
        orderIndex: 4
      }
    ]);
  }

  const routineCount = await Routine.countDocuments();
  if (routineCount === 0) {
    console.log('[Seed] Seeding Daily Routines...');
    await Routine.insertMany([
      {
        title: 'Morning Refreshment & Jolpan (পুৱাৰ চাহ আৰু জলপান)',
        time: '07:30 AM',
        period: 'Morning',
        culturalNote: 'Traditional Assam morning with warm red tea and delicious Doi-Chira.',
        orderIndex: 1,
        steps: [
          {
            stepNumber: 1,
            title: 'Sip warm lemon water',
            description: 'Drink half a glass of warm soothing water to gently wake up your body.',
            completed: false,
            audioPrompt: 'Take a gentle sip of warm water from your brass tumbler.'
          },
          {
            stepNumber: 2,
            title: 'Enjoy fresh Assam Red Tea (Ronga Saah)',
            description: 'Take your time savoring the warm, fragrant tea brewed with fresh ginger.',
            completed: false,
            audioPrompt: 'Savor your cup of fresh ginger tea, warm and comforting.'
          },
          {
            stepNumber: 3,
            title: 'Taste soft Doi-Chira with Jaggery (Gur)',
            description: 'Enjoy a light bowl of soaked flattened rice with curd and sweet jaggery.',
            completed: false,
            audioPrompt: 'Enjoy your delicious bowl of Doi-Chira at your own peaceful pace.'
          }
        ]
      },
      {
        title: 'Veranda Sun & Garden Walk (বাৰান্দাৰ ৰোদ আৰু খোজ)',
        time: '09:30 AM',
        period: 'Morning',
        culturalNote: 'Fresh gentle sunlight on the veranda amidst blooming orchids.',
        orderIndex: 2,
        steps: [
          {
            stepNumber: 1,
            title: 'Put on soft walking slippers',
            description: 'Ensure your feet are comfortable and secure.',
            completed: false,
            audioPrompt: 'Let us put on your comfortable walking slippers.'
          },
          {
            stepNumber: 2,
            title: 'Take 10 gentle steps along the sunny railing',
            description: 'Feel the morning breeze and watch the birds on the Nahor tree.',
            completed: false,
            audioPrompt: 'Walk gently along the veranda, breathing in the fresh morning air.'
          },
          {
            stepNumber: 3,
            title: 'Gentle hand stretch and deep breath',
            description: 'Raise your hands gently, take three calming deep breaths.',
            completed: false,
            audioPrompt: 'Breathe in slowly, and exhale with a smile.'
          }
        ]
      },
      {
        title: 'Evening Prayer & Calm Relaxation (সন্ধিয়াৰ নাম-প্ৰসংগ)',
        time: '05:30 PM',
        period: 'Evening',
        culturalNote: 'Quiet contemplation with earthen lamp and soothing flute melodies.',
        orderIndex: 3,
        steps: [
          {
            stepNumber: 1,
            title: 'Light the brass Diya at the prayer corner',
            description: 'A calming warm glow for the evening peace.',
            completed: false,
            audioPrompt: 'Light the gentle brass lamp and listen to the evening bells.'
          },
          {
            stepNumber: 2,
            title: 'Listen to soft Naam-Ghor chanting',
            description: 'Rest comfortably on the armchair and let the sacred verses bring peace.',
            completed: false,
            audioPrompt: 'Close your eyes and listen to the peaceful evening prayer.'
          }
        ]
      }
    ]);
  }

  const reminderCount = await Reminder.countDocuments();
  if (reminderCount === 0) {
    console.log('[Seed] Seeding Daily Reminders...');
    await Reminder.insertMany([
      {
        title: 'Morning Wellness Tablet with Warm Water',
        time: '08:15 AM',
        category: 'Medication',
        voiceText: 'Koka, it is time for your morning herbal supplement with warm water.',
        isActive: true,
        isCompletedToday: false
      },
      {
        title: 'Midday Hydration & Coconut Water',
        time: '11:30 AM',
        category: 'Hydration',
        voiceText: 'Koka, please enjoy a cool, refreshing glass of fresh coconut water.',
        isActive: true,
        isCompletedToday: false
      },
      {
        title: 'Afternoon Veranda Relaxation',
        time: '03:30 PM',
        category: 'Gentle Walk',
        voiceText: 'Time to sit on the cane chair and feel the gentle afternoon breeze.',
        isActive: true,
        isCompletedToday: false
      },
      {
        title: 'Evening Call with Deepak & Maina',
        time: '07:00 PM',
        category: 'Family Call',
        voiceText: 'Your granddaughter Maina and son Deepak are looking forward to chatting with you.',
        isActive: true,
        isCompletedToday: false
      }
    ]);
  }

  const sessionCount = await GameSession.countDocuments();
  if (sessionCount === 0) {
    console.log('[Seed] Seeding dignity-first engagement session records...');
    const sampleDates = [
      new Date(Date.now() - 6 * 86400000),
      new Date(Date.now() - 5 * 86400000),
      new Date(Date.now() - 4 * 86400000),
      new Date(Date.now() - 3 * 86400000),
      new Date(Date.now() - 2 * 86400000),
      new Date(Date.now() - 1 * 86400000),
      new Date()
    ];

    await GameSession.insertMany([
      {
        activityType: 'family_recall',
        activityTitle: 'Smriti Ghor (Family Memory Lane)',
        durationSeconds: 320,
        supportiveFeedback: 'Consistent Participation',
        favoriteTopicRevisited: 'Granddaughter Maina & Magh Bihu Pitha',
        itemsEngaged: 4,
        paceObservation: 'Comfortable & Unhurried',
        createdAt: sampleDates[0]
      },
      {
        activityType: 'cultural_reminiscence',
        activityTitle: 'Oxom & NER Heritage Journey',
        durationSeconds: 410,
        supportiveFeedback: 'High Recall Day',
        favoriteTopicRevisited: 'Kaziranga Morning Mist & Rhinos',
        itemsEngaged: 5,
        paceObservation: 'Joyful & Talkative',
        createdAt: sampleDates[1]
      },
      {
        activityType: 'routine_guidance',
        activityTitle: 'Niyomiya Sahay (Morning Tea Routine)',
        durationSeconds: 240,
        supportiveFeedback: 'Consistent Participation',
        favoriteTopicRevisited: 'Doi-Chira Breakfast Steps',
        itemsEngaged: 3,
        paceObservation: 'Comfortable & Unhurried',
        createdAt: sampleDates[2]
      },
      {
        activityType: 'family_recall',
        activityTitle: 'Smriti Ghor (Family Memory Lane)',
        durationSeconds: 360,
        supportiveFeedback: 'High Recall Day',
        favoriteTopicRevisited: 'Grandson Rohan & Bihu Dhol',
        itemsEngaged: 4,
        paceObservation: 'Joyful & Connected',
        createdAt: sampleDates[3]
      },
      {
        activityType: 'sensory_soundscape',
        activityTitle: 'Xanti Baani (Calming Soundscapes)',
        durationSeconds: 480,
        supportiveFeedback: 'Relaxed & Peaceful Interaction',
        favoriteTopicRevisited: 'Brahmaputra Rain & Bamboo Flute',
        itemsEngaged: 2,
        paceObservation: 'Deeply Soothing',
        createdAt: sampleDates[4]
      },
      {
        activityType: 'cultural_reminiscence',
        activityTitle: 'Oxom & NER Heritage Journey',
        durationSeconds: 390,
        supportiveFeedback: 'Consistent Participation',
        favoriteTopicRevisited: 'Majuli Mask Making Tradition',
        itemsEngaged: 4,
        paceObservation: 'Comfortable & Unhurried',
        createdAt: sampleDates[5]
      },
      {
        activityType: 'family_recall',
        activityTitle: 'Smriti Ghor (Family Memory Lane)',
        durationSeconds: 300,
        supportiveFeedback: 'High Recall Day',
        favoriteTopicRevisited: 'Son Deepak & Golaghat Tea Garden',
        itemsEngaged: 4,
        paceObservation: 'Warm & Engaged',
        createdAt: sampleDates[6]
      }
    ]);
  }

  const memoryCount = await Memory.countDocuments();
  if (memoryCount === 0) {
    console.log('[Seed] Seeding Personalized Memory Album & VR Experiences for Bhaben Baruah (NER Scope)...');
    await Memory.insertMany([
      {
        title: 'Family Picnic at Majuli – 2018',
        category: 'Family',
        imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1000&auto=format&fit=crop&q=80',
        people: ['Ananya (Granddaughter)', 'Minoti (Daughter)'],
        relationship: 'Granddaughter & Daughter',
        location: 'Majuli River Bank, Brahmaputra',
        details: 'Winter family boat picnic across the Brahmaputra with hot cardamom tea in clay cups and fresh Til Pitha.',
        datePeriod: 'Winter 2018',
        state: 'Assam',
        regionalContext: 'NER',
        questionPrompt: 'Who is smiling beside you with the warm cup of tea?',
        expectedAnswers: ['ananya', 'granddaughter', 'nati', 'minoti', 'daughter'],
        hints: {
          tier1: 'She is your granddaughter who loves visiting you during winter holidays.',
          tier2: 'Her name starts with A — Ananya.'
        },
        isSelectedForSession: true,
        status: 'Selected',
        lastSessionInsights: {
          lastPlayedAt: new Date(Date.now() - 86400000 * 2),
          recallStatus: 'Successful',
          attempts: 1,
          hintsDelivered: 0,
          responseTimeSeconds: 4.8,
          observationalNotes: 'Prompt recall with a joyful smile; recognized Ananya instantly.'
        },
        sessionHistory: [{
          playedAt: new Date(Date.now() - 86400000 * 2),
          recallStatus: 'Successful',
          attempts: 1,
          hintsDelivered: 0,
          responseTimeSeconds: 4.8,
          observationalNotes: 'Prompt recall with a joyful smile; recognized Ananya instantly.'
        }]
      },
      {
        title: "Granddaughter Ananya's Graduation Day",
        category: 'People',
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80',
        people: ['Ananya Baruah'],
        relationship: 'Granddaughter',
        location: 'Guwahati University Auditorium',
        details: 'Ananya dressed in her golden Muga silk mekhela sador holding her university degree with great pride.',
        datePeriod: 'Autumn 2021',
        state: 'Assam',
        regionalContext: 'NER',
        questionPrompt: 'Do you remember what special day we were celebrating here?',
        expectedAnswers: ['graduation', 'college', 'degree', 'ananya', 'university'],
        hints: {
          tier1: 'Think of the proud day when your granddaughter completed her university degree.',
          tier2: 'She was wearing her golden Muga silk graduation sash.'
        },
        isSelectedForSession: true,
        status: 'Selected',
        lastSessionInsights: {
          lastPlayedAt: new Date(Date.now() - 86400000 * 4),
          recallStatus: 'Successful',
          attempts: 1,
          hintsDelivered: 1,
          responseTimeSeconds: 6.4,
          observationalNotes: 'Looked closely at the photo, smiled warmly upon hearing the graduation hint.'
        },
        sessionHistory: [{
          playedAt: new Date(Date.now() - 86400000 * 4),
          recallStatus: 'Successful',
          attempts: 1,
          hintsDelivered: 1,
          responseTimeSeconds: 6.4,
          observationalNotes: 'Looked closely at the photo, smiled warmly upon hearing the graduation hint.'
        }]
      },
      {
        title: 'Old Ancestral Wooden Home in Sivasagar',
        category: 'Places',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
        people: ['Bhaben Baruah', 'Brothers'],
        relationship: 'Childhood Home',
        location: 'Sivasagar, Upper Assam',
        details: 'The wooden front veranda overlooking the betel nut garden where you spent calm mornings with hot tea.',
        datePeriod: '1965 – 1980',
        state: 'Assam',
        regionalContext: 'NER',
        questionPrompt: 'Which peaceful place in Upper Assam is this ancestral veranda?',
        expectedAnswers: ['sivasagar', 'home', 'sibasagar', 'ancestral home', 'ghor'],
        hints: {
          tier1: 'This is the beloved town with the grand historic Borpukhuri tank.',
          tier2: 'The name starts with S — Sivasagar.'
        },
        isSelectedForSession: false,
        status: 'Ready',
        lastSessionInsights: {
          lastPlayedAt: new Date(Date.now() - 86400000 * 7),
          recallStatus: 'Needed assistance',
          attempts: 2,
          hintsDelivered: 2,
          responseTimeSeconds: 11.2,
          observationalNotes: 'Needed gentle assistance; recalled the morning tea ritual warmly after hint 2.'
        },
        sessionHistory: [{
          playedAt: new Date(Date.now() - 86400000 * 7),
          recallStatus: 'Needed assistance',
          attempts: 2,
          hintsDelivered: 2,
          responseTimeSeconds: 11.2,
          observationalNotes: 'Needed gentle assistance; recalled the morning tea ritual warmly after hint 2.'
        }]
      },
      {
        title: 'Bohag Bihu Dhol Utsav with Childhood Friend',
        category: 'Events',
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80',
        people: ['Pranab (Friend)', 'Bhaben Baruah'],
        relationship: 'Childhood Friend',
        location: 'Courtyard, Sivasagar',
        details: 'Playing the wooden Bihu dhol rhythmically on the courtyard on the first day of Bohag.',
        datePeriod: 'April 1974',
        state: 'Assam',
        regionalContext: 'NER',
        questionPrompt: 'What joyful springtime festival were you playing the dhol for?',
        expectedAnswers: ['bihu', 'bohag bihu', 'rongali bihu', 'festival'],
        hints: {
          tier1: 'It is the most beloved springtime New Year festival of Assam.',
          tier2: 'Everyone ties red Phulam Gamusas and plays the dhol — Bohag Bihu.'
        },
        isSelectedForSession: false,
        status: 'Ready'
      },
      {
        title: 'Trip to Shillong Pine Ridge with Late Wife',
        category: 'Places',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80',
        people: ['Nirmala (Wife)', 'Bhaben Baruah'],
        relationship: 'Wife',
        location: 'Barapani Lake & Shillong Hills, Meghalaya',
        details: 'Cool mountain drive winding past misty pine trees, stopping for hot roasted corn by the sparkling lake.',
        datePeriod: 'Autumn 1985',
        state: 'Meghalaya',
        regionalContext: 'NER',
        questionPrompt: 'Which misty hill station in Meghalaya did you travel to together?',
        expectedAnswers: ['shillong', 'meghalaya', 'barapani', 'hills'],
        hints: {
          tier1: 'The scenic Scotland of the East in Meghalaya with tall fragrant pine trees.',
          tier2: 'The capital of Meghalaya — Shillong.'
        },
        isSelectedForSession: false,
        status: 'Ready'
      },
      {
        title: 'Hornbill Cultural Gathering in Kohima',
        category: 'Culture',
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000&auto=format&fit=crop&q=80',
        people: ['Local Village Artisans', 'Bhaben'],
        relationship: 'Cultural Travel',
        location: 'Kisama Heritage Village, Nagaland',
        details: 'Admiring the vibrant handwoven Naga shawls and listening to the traditional log drum beats.',
        datePeriod: 'December 2012',
        state: 'Nagaland',
        regionalContext: 'NER',
        questionPrompt: 'Which vibrant heritage village in Nagaland did we visit for the festival?',
        expectedAnswers: ['kisama', 'kohima', 'nagaland', 'hornbill'],
        hints: {
          tier1: 'It is the famous festival of festivals held at the foot of Mount Japfu.',
          tier2: 'The heritage village name is Kisama in Nagaland.'
        },
        isSelectedForSession: false,
        status: 'Ready'
      }
    ]);
  }

  // --- Seed Verified Personal Memory Graph ---
  const graphNodeCount = await MemoryGraphNode.countDocuments();
  if (graphNodeCount === 0) {
    console.log('[Seed] Seeding Verified Personal Memory Graph nodes & provenance edges...');
    await MemoryGraphNode.insertMany([
      {
        nodeId: 'node_bhaben',
        label: 'Bhaben Baruah (Koka)',
        category: 'Person',
        culturalTitle: 'ককা (Koka) — Respected Patriarch',
        details: 'Age 76, retired tea executive from Assam Tea Corp in Jorhat. Now resides in Beltola, Guwahati.',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400',
        icon: 'User',
        provenance: {
          verifiedBy: 'Deepak Baruah (Eldest Son)',
          sourceDocument: 'Government Pension ID & Family Chronicle',
          trustScore: 1.0,
          isGroundTruth: true
        }
      },
      {
        nodeId: 'node_deepak',
        label: 'Deepak Baruah',
        category: 'Person',
        culturalTitle: 'ডাঙৰ ল’ৰা (Dangor Lora) — Eldest Son',
        details: 'Manages tea estates in Golaghat. Primary family caregiver. Brings fresh first-flush orthodox tea weekly.',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        icon: 'HeartHandshake',
        provenance: {
          verifiedBy: 'Self-Verified Caregiver Profile',
          sourceDocument: 'Family Oral History & Aadhaar Identity',
          trustScore: 1.0,
          isGroundTruth: true
        }
      },
      {
        nodeId: 'node_maina',
        label: 'Maina (Rhea)',
        category: 'Person',
        culturalTitle: 'নাতিনী (Naati-Suwali) — Beloved Granddaughter',
        details: 'School teacher in Bangalore. Visits for Magh Bihu every winter to make Til Pitha and Narikol Laru with Koka.',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
        icon: 'Sparkles',
        provenance: {
          verifiedBy: 'Deepak Baruah (Father)',
          sourceDocument: 'Family Archive & Video Call Confirmation',
          trustScore: 0.99,
          isGroundTruth: true
        }
      },
      {
        nodeId: 'node_rohan',
        label: 'Rohan',
        category: 'Person',
        culturalTitle: 'নাতি (Naati-Lora) — Grandson & Dhol Player',
        details: 'College student in Guwahati. Plays the Bihu dhol at Latasil playground with a bright red Phulam Gamusa.',
        imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
        icon: 'Music',
        provenance: {
          verifiedBy: 'Deepak Baruah (Father)',
          sourceDocument: 'Bihu Competition Certificate',
          trustScore: 0.99,
          isGroundTruth: true
        }
      },
      {
        nodeId: 'node_jorhat',
        label: 'Jorhat & Cinnamara Estate',
        category: 'Place',
        culturalTitle: 'চাহৰ দেশ (Tea Heartland)',
        details: 'Where Koka worked for 35 glorious years with Assam Tea Corporation. He loved walking the misty tea rows at dawn.',
        imageUrl: 'https://images.unsplash.com/photo-1588600878108-578307a3cc9d?w=600',
        icon: 'MapPin',
        provenance: {
          verifiedBy: 'Service Records 1973-2008',
          sourceDocument: 'Assam Tea Corporation Commendation Letter',
          trustScore: 1.0,
          isGroundTruth: true
        }
      },
      {
        nodeId: 'node_sivasagar',
        label: 'Sivasagar Ancestral Home',
        category: 'Place',
        culturalTitle: 'ঐতিহাসিক শিৱসাগৰ (Historic Sivasagar)',
        details: 'Ancestral birthplace near the sacred Shiva Doul and the vast waters of Joysagar Pukhuri.',
        imageUrl: 'https://images.unsplash.com/photo-1609137144822-4752530a6c0f?w=600',
        icon: 'Home',
        provenance: {
          verifiedBy: 'Ancestral Land Deed & Oral Chronicle',
          sourceDocument: 'Baruah Family Genealogy Tree',
          trustScore: 1.0,
          isGroundTruth: true
        }
      },
      {
        nodeId: 'node_bihu',
        label: 'Rongali & Magh Bihu',
        category: 'Tradition',
        culturalTitle: 'ব’হাগ আৰু মাঘ বিহু (The Great Festival)',
        details: 'The heartbeat of family life. Scent of Kopou orchids, sound of dhol, and steaming plates of Til Pitha.',
        imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=600',
        icon: 'Flame',
        provenance: {
          verifiedBy: 'Family Photo Albums 1968-2025',
          sourceDocument: 'Annual Bihu Gathering Photos',
          trustScore: 1.0,
          isGroundTruth: true
        }
      },
      {
        nodeId: 'node_heirloom_cup',
        label: 'Ancestral Brass Kahi-Bati',
        category: 'Heirloom',
        culturalTitle: 'কাঁহৰ বাটি (Bell-Metal Brass Bowl)',
        details: 'Gifted to Bhaben and his late wife Pratibha at their 1968 wedding in Sivasagar. Used for morning Doi-Chira.',
        imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600',
        icon: 'Coffee',
        provenance: {
          verifiedBy: 'Deepak Baruah (Son)',
          sourceDocument: 'Physical Heirloom in Guwahati Residence',
          trustScore: 1.0,
          isGroundTruth: true
        }
      },
      {
        nodeId: 'node_heirloom_radio',
        label: '1980 Vintage Philips Radio',
        category: 'Heirloom',
        culturalTitle: 'ফিলিপছ ৰেডিঅ’ (Wooden Valve Radio)',
        details: 'Bhaben Koka listened to the 7:00 PM All India Radio Guwahati news every evening on his veranda.',
        imageUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=600',
        icon: 'Radio',
        provenance: {
          verifiedBy: 'Family Keepsake Archive',
          sourceDocument: 'Preserved on study shelf',
          trustScore: 1.0,
          isGroundTruth: true
        }
      }
    ]);

    await MemoryGraphEdge.insertMany([
      {
        edgeId: 'edge_1',
        sourceNodeId: 'node_bhaben',
        targetNodeId: 'node_deepak',
        relationshipType: 'FATHER_OF',
        label: 'Father ➔ Eldest Son',
        context: 'Deepak cares for Koka daily and manages the family affairs.',
        strength: 1.0,
        provenance: { verifiedBy: 'Deepak Baruah', confidence: 1.0 }
      },
      {
        edgeId: 'edge_2',
        sourceNodeId: 'node_deepak',
        targetNodeId: 'node_maina',
        relationshipType: 'FATHER_OF',
        label: 'Father ➔ Daughter',
        context: 'Maina is Deepak’s daughter and Koka’s granddaughter.',
        strength: 1.0,
        provenance: { verifiedBy: 'Deepak Baruah', confidence: 1.0 }
      },
      {
        edgeId: 'edge_3',
        sourceNodeId: 'node_bhaben',
        targetNodeId: 'node_maina',
        relationshipType: 'GRANDFATHER_OF',
        label: 'Paternal Grandfather ➔ Granddaughter',
        context: 'Koka taught Maina how to fold Bihu pithas on the cane stool.',
        strength: 1.0,
        provenance: { verifiedBy: 'Deepak Baruah', confidence: 1.0 }
      },
      {
        edgeId: 'edge_4',
        sourceNodeId: 'node_bhaben',
        targetNodeId: 'node_rohan',
        relationshipType: 'GRANDFATHER_OF',
        label: 'Grandfather ➔ Grandson',
        context: 'Koka bought Rohan his first Bihu dhol from the Sivasagar market.',
        strength: 1.0,
        provenance: { verifiedBy: 'Deepak Baruah', confidence: 1.0 }
      },
      {
        edgeId: 'edge_5',
        sourceNodeId: 'node_bhaben',
        targetNodeId: 'node_jorhat',
        relationshipType: 'CAREER_LEGACY',
        label: 'Worked 35 Years At',
        context: 'Assam Tea Corporation senior superintendent from 1973 to 2008.',
        strength: 1.0,
        provenance: { verifiedBy: 'Tea Board records', confidence: 1.0 }
      },
      {
        edgeId: 'edge_6',
        sourceNodeId: 'node_bhaben',
        targetNodeId: 'node_sivasagar',
        relationshipType: 'ANCESTRAL_ROOT',
        label: 'Born & Raised At',
        context: 'Ancestral roots and childhood memories of Joysagar tank.',
        strength: 1.0,
        provenance: { verifiedBy: 'Oral Chronicle', confidence: 1.0 }
      },
      {
        edgeId: 'edge_7',
        sourceNodeId: 'node_maina',
        targetNodeId: 'node_bihu',
        relationshipType: 'MAKES_PITHA_FOR',
        label: 'Makes Til Pitha For',
        context: 'Maina travels from Bangalore every January for Magh Bihu.',
        strength: 1.0,
        provenance: { verifiedBy: 'Deepak Baruah', confidence: 1.0 }
      },
      {
        edgeId: 'edge_8',
        sourceNodeId: 'node_bhaben',
        targetNodeId: 'node_heirloom_cup',
        relationshipType: 'OWNS_HEIRLOOM',
        label: 'Cherishes Wedding Gift',
        context: '1968 wedding brass bowl used for morning curd and molasses.',
        strength: 1.0,
        provenance: { verifiedBy: 'Family Heirloom Registry', confidence: 1.0 }
      },
      {
        edgeId: 'edge_9',
        sourceNodeId: 'node_bhaben',
        targetNodeId: 'node_heirloom_radio',
        relationshipType: 'LISTENS_TO',
        label: 'Listens to AIR Guwahati',
        context: 'Evening veranda ritual with All India Radio broadcasts.',
        strength: 1.0,
        provenance: { verifiedBy: 'Deepak Baruah', confidence: 1.0 }
      }
    ]);
  }

  // --- Seed Everyday Heirlooms ---
  const heirloomCount = await HeirloomObject.countDocuments();
  if (heirloomCount === 0) {
    console.log('[Seed] Seeding Everyday Heirloom Objects for Memory Scanner...');
    await HeirloomObject.insertMany([
      {
        objectId: 'heirloom_kahi_bati',
        name: '1968 Ancestral Brass Kahi-Bati',
        vernacularName: 'কাঁহৰ কাঁহী-বাটি (Sarthebari Bell Metal Bowl)',
        category: 'Kitchen & Tea',
        photoUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600',
        tactileDescription: 'Heavy bell-metal brass, cool to the touch with soft carved floral borders along the rim.',
        memoryStory: 'Gifted to Bhaben Koka and Pratibha Aita on their wedding day in Sivasagar in 1968 by Koka’s grandmother. For over 50 years, Koka has enjoyed fresh Doi-Chira and golden molasses from this very bowl.',
        storyNarrator: 'Deepak Baruah (Son)',
        associatedPerson: 'Pratibha Baruah (Wife)',
        originYear: '1968',
        provenanceVerification: {
          verifiedBy: 'Deepak Baruah',
          verificationLevel: 'Physical Heirloom on Dining Shelf, Guwahati'
        }
      },
      {
        objectId: 'heirloom_gamusa',
        name: 'Handwoven Red Phulam Gamusa',
        vernacularName: 'ৰঙা ফুলম গামোচা (Handloom Cotton Towel of Honor)',
        category: 'Attire & Textile',
        photoUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=600',
        tactileDescription: 'Crisp hand-spun white cotton with raised red hand-embroidered floral motifs (kalka & orchids).',
        memoryStory: 'Presented to Koka during the 1974 Bohag Bihu celebration in Jorhat when he organized the community Bihu husori. He always holds it gently across his shoulders when listening to Bihu dhol beats.',
        storyNarrator: 'Deepak Baruah (Son)',
        associatedPerson: 'Rohan (Grandson)',
        originYear: '1974',
        provenanceVerification: {
          verifiedBy: 'Deepak Baruah',
          verificationLevel: 'Preserved in Koka’s wardrobe'
        }
      },
      {
        objectId: 'heirloom_radio',
        name: '1980 Vintage Philips Wooden Valve Radio',
        vernacularName: 'ফিলিপছ কাঠৰ ৰেডিঅ’ (Philips Tabletop Receiver)',
        category: 'Keepsake & Tool',
        photoUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=600',
        tactileDescription: 'Polished teakwood casing with amber tuning dial and warm mechanical rotary knobs.',
        memoryStory: 'Bought with his first managerial bonus at the Cinnamara tea estate in 1980. Every evening at 7:00 PM, the whole family would gather on the veranda to listen to AIR Guwahati news and Borgeet melodies.',
        storyNarrator: 'Deepak Baruah (Son)',
        associatedPerson: 'Deepak & Maina',
        originYear: '1980',
        provenanceVerification: {
          verifiedBy: 'Deepak Baruah',
          verificationLevel: 'Restored & kept on study desk'
        }
      },
      {
        objectId: 'heirloom_parker_pen',
        name: '1982 Parker 51 Golden Nib Fountain Pen',
        vernacularName: 'সোণালী নিবৰ ফাউণ্টেন কলম (Parker Pen)',
        category: 'Keepsake & Tool',
        photoUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600',
        tactileDescription: 'Smooth black resin body with a 14k brushed golden cap and fine arrow clip.',
        memoryStory: 'Used by Koka to sign tea quality tasting reports and write heartfelt letters to Deepak when Deepak was studying in Guwahati. Koka always kept it in his top shirt pocket.',
        storyNarrator: 'Deepak Baruah (Son)',
        associatedPerson: 'Bhaben Koka',
        originYear: '1982',
        provenanceVerification: {
          verifiedBy: 'Deepak Baruah',
          verificationLevel: 'Family heirloom in bedside chest'
        }
      }
    ]);
  }

  // --- Seed Safe Harbor Geofencing Zones ---
  const safeZoneCount = await SafeHarborZone.countDocuments();
  if (safeZoneCount === 0) {
    console.log('[Seed] Seeding Safe Harbor Geofencing Zones...');
    await SafeHarborZone.insertMany([
      {
        zoneId: 'zone_living_haven',
        zoneName: 'Living Room & Bedroom Haven',
        zoneType: 'Primary_Safe',
        locationDescription: 'Main living room, armchair, and bedroom at Beltola residence',
        coordinates: { lat: 26.1445, lng: 91.7362, radiusMeters: 30 },
        activeHours: { start: '00:00', end: '23:59' },
        currentStatus: 'Inside Safe Haven',
        wanderingRiskScore: 8
      },
      {
        zoneId: 'zone_veranda_garden',
        zoneName: 'Veranda & Orchid Garden',
        zoneType: 'Secondary_Safe',
        locationDescription: 'Open-air morning stroll corridor with cane chairs and potted orchids',
        coordinates: { lat: 26.1446, lng: 91.7364, radiusMeters: 20 },
        activeHours: { start: '06:00', end: '19:00' },
        currentStatus: 'Inside Safe Haven',
        wanderingRiskScore: 22
      },
      {
        zoneId: 'zone_front_perimeter',
        zoneName: 'Beltola Front Gate Perimeter',
        zoneType: 'Perimeter_Boundary',
        locationDescription: 'Gate leading to lane towards Beltola market',
        coordinates: { lat: 26.1449, lng: 91.7368, radiusMeters: 15 },
        activeHours: { start: '07:00', end: '18:00' },
        currentStatus: 'Inside Safe Haven',
        wanderingRiskScore: 65
      }
    ]);
  }

  // --- Seed Caregiver Journal Observations ---
  const journalCount = await CaregiverJournal.countDocuments();
  if (journalCount === 0) {
    console.log('[Seed] Seeding Caregiver Journal & AI Council logs...');
    await CaregiverJournal.insertMany([
      {
        timestamp: new Date(Date.now() - 86400000 * 2),
        timeOfDay: 'Morning',
        observation: 'Koka woke up cheerful. Enjoyed his morning Doi-Chira in the ancestral brass bowl and pointed at the Kopou orchid blooming on the veranda.',
        elderMood: 'Calm & Joyful',
        triggersIdentified: ['Morning Freshness', 'Familiar Brass Bowl'],
        deEscalationApplied: {
          protocolUsed: 'Positive Reminiscence Anchoring',
          actionTaken: 'Sat together naming orchids and humming a morning Borgeet.',
          outcome: 'Resolved Calmly'
        },
        aiCouncilAnalysis: {
          clinicalInsight: 'High orientation and positive affect stimulated by tactile heirloom object.',
          empathySuggestion: 'Continue reinforcing morning routine with authentic tea ritual.',
          factVerificationNote: 'Verified: Brass bowl is confirmed wedding gift from 1968.',
          recommendedNextStep: 'Present Level 1 Photo Recall game during peak morning alertness.'
        }
      },
      {
        timestamp: new Date(Date.now() - 86400000),
        timeOfDay: 'Evening (Sundowning Period)',
        observation: 'Around 5:45 PM as dusk settled, Koka looked around restlessly and asked where his briefcase was, saying the tea factory bell was about to ring.',
        elderMood: 'Anxious / Restless',
        triggersIdentified: ['Twilight Sundowning', 'Past Work Routine Identity'],
        deEscalationApplied: {
          protocolUsed: 'Validation & Sensory Reminiscence',
          actionTaken: 'Deepak gently affirmed: "Your work at the tea estate is completed with honors, Koka. Everything is safe." Turned on warm yellow lamps and played soft flute music.',
          outcome: 'Resolved Calmly'
        },
        aiCouncilAnalysis: {
          clinicalInsight: 'Circadian sundowning triggered by dimming natural light. Excellent non-pharmacological response by son.',
          empathySuggestion: 'Never contradict or say "You retired 18 years ago". Reassure safety and sense of accomplishment.',
          factVerificationNote: 'Verified: Bhaben retired as Senior Superintendent in 2008.',
          recommendedNextStep: 'Ensure ambient warm lighting is turned on automatically at 5:00 PM.'
        }
      }
    ]);
  }

  // --- Seed Voice Biomarkers ---
  const voiceCount = await VoiceBiomarker.countDocuments();
  if (voiceCount === 0) {
    console.log('[Seed] Seeding Acoustic Voice Biomarker Telemetry...');
    await VoiceBiomarker.insertMany([
      {
        timestamp: new Date(Date.now() - 86400000 * 3),
        sessionType: 'MemoryLane',
        timeOfDay: 'Morning',
        metrics: {
          speechLatencyMs: 1240,
          pauseToSpeechRatio: 0.21,
          hesitationMarkersCount: 1,
          semanticRetrievalSeconds: 2.3,
          acousticComfortIndex: 94,
          diurnalFatigueFlag: false
        },
        notes: 'Rapid and cheerful recognition of granddaughter Maina. Vocal warmth optimal.'
      },
      {
        timestamp: new Date(Date.now() - 86400000 * 2),
        sessionType: 'StoryRecall',
        timeOfDay: 'Twilight/Evening',
        metrics: {
          speechLatencyMs: 2850,
          pauseToSpeechRatio: 0.38,
          hesitationMarkersCount: 4,
          semanticRetrievalSeconds: 4.8,
          acousticComfortIndex: 82,
          diurnalFatigueFlag: true
        },
        notes: 'Mild evening hesitation noted during Majuli Satra recall. Voice cadence quiet but calm.'
      },
      {
        timestamp: new Date(Date.now() - 86400000),
        sessionType: 'AIPetChat',
        timeOfDay: 'Morning',
        metrics: {
          speechLatencyMs: 1380,
          pauseToSpeechRatio: 0.23,
          hesitationMarkersCount: 1,
          semanticRetrievalSeconds: 2.6,
          acousticComfortIndex: 92,
          diurnalFatigueFlag: false
        },
        notes: 'Interactive dialogue with Moti the AI pet was effortless and smiling.'
      }
    ]);
  }

  // --- Seed WellRemember Family Board Posts ---
  const boardCount = await FamilyBoardPost.countDocuments();
  if (boardCount === 0) {
    console.log('[Seed] Seeding WellRemember Family Memory Board cards...');
    await FamilyBoardPost.insertMany([
      {
        authorName: 'Maina (Rhea)',
        relation: 'Granddaughter',
        location: 'Bangalore',
        message: 'Koka, sending you so much love from Bangalore! Look at this photo from last Magh Bihu when we rolled warm Til Pitha together on the veranda. I cannot wait to be back in Guwahati this winter! Take your morning tea peacefully.',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
        moderationStatus: 'Approved',
        dignityCheckPassed: true,
        pinnedForElderDisplay: true,
        caregiverNotes: 'Verified video call snippet. Safe and deeply comforting for Koka.'
      },
      {
        authorName: 'Rohan',
        relation: 'Grandson',
        location: 'Guwahati',
        message: 'Koka! I practiced the 3-beat rhythm you taught me on the Bihu dhol today. Everyone at college cheered! Tomorrow morning after your stroll I will come play it live for you on the cane mora.',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600',
        moderationStatus: 'Approved',
        dignityCheckPassed: true,
        pinnedForElderDisplay: true,
        caregiverNotes: 'Rohan visiting tomorrow morning.'
      },
      {
        authorName: 'Ananya Baruah',
        relation: 'Daughter-in-law',
        location: 'Golaghat',
        message: 'Deuta, Deepak and I packed the finest first-flush golden tips orthodox tea from the estate today. He is driving back to Guwahati tomorrow with the fresh batch for your 4 PM tea!',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
        moderationStatus: 'Approved',
        dignityCheckPassed: true,
        pinnedForElderDisplay: true,
        caregiverNotes: 'Warm family reassurance.'
      }
    ]);
  }

  console.log('[Seed] Database populated successfully with culturally authentic NER data, verified memory graphs, and caregiver intelligence.');
}

module.exports = seedData;

if (require.main === module) {
  const { connectDB, closeDB } = require('./db');
  connectDB()
    .then(() => seedData())
    .then(() => closeDB())
    .then(() => {
      console.log('[Seed] Completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed] Error:', err);
      process.exit(1);
    });
}
