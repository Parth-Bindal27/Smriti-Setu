import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Volume2, HelpCircle, ArrowRight, RotateCcw, Home, Eye, Compass, ShieldCheck } from 'lucide-react';
import { speechService } from '../services/speechService';

// Curated Scene Data for Focus Finder
const SCENES = [
  {
    id: 'veranda',
    themeName: {
      en: 'Morning Tea Veranda',
      as: 'পুৱাৰ বাৰান্দা আৰু চাহৰ মেজ',
      hi: 'सुबह का बरामदा और चाय की मेज़',
      bn: 'সকালের বারান্দা ও চায়ের টেবিল',
      ne: 'बिहानीको बार्दली र चिया टेबल'
    },
    bgGradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 45%, #FDE047 100%)',
    targets: [
      {
        id: 'bellmetal_cup',
        label: {
          en: "Traditional Bell-Metal Tea Cup",
          as: "কাঁহৰ চাহৰ বাতি (Bell-metal Cup)",
          hi: "पारंपरिक पीतल का चाय का प्याला",
          bn: "কাঁসার চায়ের বাটি (Bell-metal Cup)",
          ne: "परम्परागत काँसको चिया कप"
        },
        hintText: {
          en: "Look near the center of the wooden tea table where the tea is warm.",
          as: "কাঠৰ মেজৰ সোঁমাজত হালধীয়া জিলিকি থকা বাতিটো চাওক।",
          hi: "मेज़ के बीच में जहां गर्मागर्म चाय है, वहां देखिए।",
          bn: "টেবিলের মাঝখানে পিতলের উজ্জ্বল বাটিটি দেখুন।",
          ne: "टेबलको बीचमा चम्किएको काँसको कप हेर्नुहोस्।"
        },
        x: 48,
        y: 45
      },
      {
        id: 'reading_spectacles',
        label: {
          en: "Reading Spectacles",
          as: "পঢ়া চশমাযোৰ (Reading Glasses)",
          hi: "पढ़ने का चश्मा (Reading Glasses)",
          bn: "পড়ার চশমা (Reading Glasses)",
          ne: "पढ्ने चश्मा (Reading Glasses)"
        },
        hintText: {
          en: "Resting comfortably beside the morning daily newspaper.",
          as: "বাতৰি কাকতৰ কাষতে মেজৰ বাওঁফালে আছে।",
          hi: "अख़बार के ठीक बगल में रखा हुआ है।",
          bn: "সংবাদপত্রের ঠিক পাশেই রয়েছে।",
          ne: "दैनिक पत्रिकाको छेउमा राखिएको छ।"
        },
        x: 24,
        y: 38
      }
    ],
    objects: [
      { id: 'bellmetal_cup', icon: '☕', label: 'Tea Cup', x: 48, y: 45, minLevel: 'gentle' },
      { id: 'reading_spectacles', icon: '👓', label: 'Glasses', x: 24, y: 38, minLevel: 'gentle' },
      { id: 'newspaper', icon: '📰', label: 'Newspaper', x: 74, y: 35, minLevel: 'gentle' },
      { id: 'tulsi_planter', icon: '🪴', label: 'Tulsi Plant', x: 86, y: 72, minLevel: 'gentle' },
      { id: 'wicker_chair', icon: '🪑', label: 'Cane Chair', x: 16, y: 72, minLevel: 'comfortable' },
      { id: 'brass_lamp', icon: '🪔', label: 'Brass Diya', x: 50, y: 78, minLevel: 'comfortable' },
      { id: 'wooden_slippers', icon: '🩴', label: 'Slippers', x: 30, y: 84, minLevel: 'explore' },
      { id: 'handheld_fan', icon: '🪭', label: 'Bamboo Fan', x: 72, y: 68, minLevel: 'explore' }
    ]
  },
  {
    id: 'kitchen',
    themeName: {
      en: "Grandmother's Cozy Kitchen",
      as: "আইতাৰ পৰম্পৰাগত ৰান্ধনিঘৰ",
      hi: "दादीजी की पारंपरिक रसोई",
      bn: "ঠাকুমার ঐতিহ্যবাহী রান্নাঘর",
      ne: "हजुरआमाको परम्परागत भान्सा"
    },
    bgGradient: 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 45%, #FDBA74 100%)',
    targets: [
      {
        id: 'brass_kettle',
        label: {
          en: "Warm Tea Kettle",
          as: "চাহৰ কেটলী (Tea Kettle)",
          hi: "चाय की केतली (Tea Kettle)",
          bn: "চায়ের কেটলি (Tea Kettle)",
          ne: "चियाको कित्ली (Tea Kettle)"
        },
        hintText: {
          en: "Resting near the stove where gentle steam is rising.",
          as: "চুলাৰ ওচৰত ধোঁৱা ওলাই থকা কেটলীটো চাওক।",
          hi: "चूल्हे के पास जहां से हल्की भाप निकल रही है।",
          bn: "উনানের পাশে যেখানে বাষ্প উঠছে।",
          ne: "चुल्हो छेउमा जहाँबाट बाफ आइरहेको छ।"
        },
        x: 50,
        y: 42
      },
      {
        id: 'spice_box',
        label: {
          en: "Brass Spice Box",
          as: "মচলাৰ বাতি (Spice Box)",
          hi: "पारंपरिक मसालदानी",
          bn: "মশলাদানি (Spice Box)",
          ne: "मसलादानी (Spice Box)"
        },
        hintText: {
          en: "Placed neatly on the right side of the wooden counter.",
          as: "ৰান্ধনি চালিৰ সোঁফালে সজাই থোৱা আছে।",
          hi: "रसोई के स्लैब पर दाईं तरफ रखी है।",
          bn: "রান্নাঘরের তাকে ডানদিকে রাখা রয়েছে।",
          ne: "भान्साको स्ल्याबमा दायाँतर्फ सजाइएको छ।"
        },
        x: 78,
        y: 48
      }
    ],
    objects: [
      { id: 'brass_kettle', icon: '🫖', label: 'Kettle', x: 50, y: 42, minLevel: 'gentle' },
      { id: 'spice_box', icon: '🧂', label: 'Spice Box', x: 78, y: 48, minLevel: 'gentle' },
      { id: 'clay_pot', icon: '🏺', label: 'Clay Pot', x: 22, y: 52, minLevel: 'gentle' },
      { id: 'mortar_pestle', icon: '🥣', label: 'Mortar', x: 34, y: 76, minLevel: 'gentle' },
      { id: 'rolling_pin', icon: '🥢', label: 'Rolling Pin', x: 64, y: 74, minLevel: 'comfortable' },
      { id: 'ginger_root', icon: '🫚', label: 'Fresh Ginger', x: 44, y: 82, minLevel: 'comfortable' },
      { id: 'brass_thali', icon: '🍽️', label: 'Brass Plate', x: 82, y: 78, minLevel: 'explore' },
      { id: 'banana_leaf', icon: '🍃', label: 'Banana Leaf', x: 16, y: 80, minLevel: 'explore' }
    ]
  },
  {
    id: 'garden',
    themeName: {
      en: "Courtyard Garden Sanctuary",
      as: "চোতালৰ শান্ত ফুলনি",
      hi: "आंगन का शांतिमय उपवन",
      bn: "আঙিনার শান্ত বাগান",
      ne: "आँगनको शान्त बगैँचा"
    },
    bgGradient: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 45%, #86EFAC 100%)',
    targets: [
      {
        id: 'foxtail_orchid',
        label: {
          en: "Blooming Foxtail Orchid (কপৌ ফুল)",
          as: "ফুলি থকা কপৌ ফুল (Kopou Orchid)",
          hi: "खिला हुआ फॉक्सटेल ऑर्किड",
          bn: "প্রস্ফুটিত অর্কিড ফুল",
          ne: "फुलेको सुनाखरी फूल"
        },
        hintText: {
          en: "Hanging gracefully from the green bamboo post.",
          as: "বাঁহৰ খুটিৰ ওপৰত ওলমি থকা সুন্দৰ ফুলপাহলৈ চাওক।",
          hi: "बांस के खंभे पर खूबसूरती से लटकी हुई है।",
          bn: "বাঁশের খুঁটিতে ঝুলন্ত সুন্দর ফুলটি দেখুন।",
          ne: "बाँसको खम्बामा फुलेको सुन्दर फूल हेर्नुहोस्।"
        },
        x: 52,
        y: 35
      },
      {
        id: 'watering_can',
        label: {
          en: "Green Watering Can",
          as: "পানী দিয়া পাত্ৰ (Watering Can)",
          hi: "पौधों में पानी देने की केतली",
          bn: "জল দেওয়ার পাত্র (Watering Can)",
          ne: "पानी हाल्ने भाँडो (Watering Can)"
        },
        hintText: {
          en: "Resting beside the flowering marigold pots on the left.",
          as: "বাওঁফালে নাৰ্জী ফুলৰ টাবৰ কাষত আছে।",
          hi: "बाईं तरफ गेंदे के गमलों के पास रखी है।",
          bn: "বাঁদিকের গাঁদা ফুলের টবের কাছে রাখা।",
          ne: "बायाँतर्फ सयपत्रीको गमला छेउमा छ।"
        },
        x: 20,
        y: 65
      }
    ],
    objects: [
      { id: 'foxtail_orchid', icon: '🌸', label: 'Orchid', x: 52, y: 35, minLevel: 'gentle' },
      { id: 'watering_can', icon: '🪴', label: 'Watering Can', x: 20, y: 65, minLevel: 'gentle' },
      { id: 'marigold', icon: '🌼', label: 'Marigold', x: 78, y: 60, minLevel: 'gentle' },
      { id: 'singing_bird', icon: '🐦', label: 'Singing Bird', x: 74, y: 25, minLevel: 'gentle' },
      { id: 'bamboo_basket', icon: '🧺', label: 'Basket', x: 42, y: 75, minLevel: 'comfortable' },
      { id: 'butterfly', icon: '🦋', label: 'Butterfly', x: 28, y: 30, minLevel: 'comfortable' },
      { id: 'garden_trowel', icon: '⛏️', label: 'Trowel', x: 62, y: 78, minLevel: 'explore' },
      { id: 'red_hibiscus', icon: '🌺', label: 'Hibiscus', x: 88, y: 75, minLevel: 'explore' }
    ]
  }
];

export default function FocusFinderGame({ onSessionComplete, selectedLanguage = 'as', t }) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [targetIdx, setTargetIdx] = useState(0);
  const [difficulty, setDifficulty] = useState('gentle'); // gentle, comfortable, explore
  const [hintTier, setHintTier] = useState(0); // 0 = none, 1 = pulse highlight, 2 = dim distractions, 3 = spoken guidance
  const [isPaused, setIsPaused] = useState(false);
  const [celebration, setCelebration] = useState(false);
  const [foundTargets, setFoundTargets] = useState([]);
  const [showCaregiverNotes, setShowCaregiverNotes] = useState(false);
  const [sessionStartTime] = useState(Date.now());

  const currentScene = SCENES[sceneIdx];
  const currentTarget = currentScene.targets[targetIdx % currentScene.targets.length];
  const targetLabel = currentTarget.label[selectedLanguage] || currentTarget.label.en;
  const targetHint = currentTarget.hintText[selectedLanguage] || currentTarget.hintText.en;
  const sceneTitle = currentScene.themeName[selectedLanguage] || currentScene.themeName.en;

  // Filter objects based on difficulty
  const visibleObjects = currentScene.objects.filter(obj => {
    if (difficulty === 'gentle') return obj.minLevel === 'gentle';
    if (difficulty === 'comfortable') return obj.minLevel === 'gentle' || obj.minLevel === 'comfortable';
    return true; // 'explore' shows all
  });

  const speakPrompt = () => {
    const prompt = selectedLanguage === 'as'
      ? `অনুগ্ৰহ কৰি দৃশ্যখনত "${targetLabel}" বিচাৰি উলিয়াওক।`
      : selectedLanguage === 'hi'
      ? `कृपया इस दृश्य में "${targetLabel}" खोजें।`
      : selectedLanguage === 'bn'
      ? `দয়া করে এই দৃশ্যে "${targetLabel}" খুঁজে বের করুন।`
      : `Please find the "${targetLabel}" in this scene.`;
    speechService.speak(prompt, selectedLanguage);
  };

  const handleNextHint = () => {
    const nextTier = Math.min(3, hintTier + 1);
    setHintTier(nextTier);
    if (nextTier === 3) {
      speechService.speak(targetHint, selectedLanguage);
    }
  };

  const handleObjectClick = (obj) => {
    if (isPaused) return;

    if (obj.id === currentTarget.id) {
      setCelebration(true);
      setFoundTargets(prev => [...prev, obj.id]);

      const successMsg = selectedLanguage === 'as'
        ? `বৰ সুন্দৰ! আপুনি ${targetLabel} বিচাৰি পালে।`
        : selectedLanguage === 'hi'
        ? `बहुत सुंदर! आपने ${targetLabel} खोज लिया।`
        : `Splendid observation! You found the ${targetLabel}.`;

      speechService.speak(successMsg, selectedLanguage);

      setTimeout(() => {
        setCelebration(false);
        setHintTier(0);
        // Advance to next target or next scene
        if (targetIdx + 1 < currentScene.targets.length) {
          setTargetIdx(prev => prev + 1);
        } else {
          // Advance to next scene gently
          setSceneIdx(prev => (prev + 1) % SCENES.length);
          setTargetIdx(0);
        }
      }, 2400);
    } else {
      // Gentle non-punitive guidance
      const softMsg = selectedLanguage === 'as'
        ? `ই আছিল ${obj.label}। আমি ${targetLabel} বিচাৰি আছোঁ।`
        : selectedLanguage === 'hi'
        ? `यह ${obj.label} है। हम ${targetLabel} की खोज कर रहे हैं।`
        : `That was the ${obj.label}. Let's look for the ${targetLabel}.`;
      speechService.speak(softMsg, selectedLanguage);
    }
  };

  const handleCompleteSession = (status = 'completed') => {
    const duration = Math.round((Date.now() - sessionStartTime) / 1000);
    onSessionComplete?.({
      activityType: 'focus_finder',
      activityTitle: 'Focus Finder — Scene Search',
      durationSeconds: duration,
      difficulty,
      itemsEngaged: foundTargets.length,
      completionStatus: status,
      supportiveFeedback: 'Unhurried Visual Search Engagement'
    });
  };

  return (
    <div style={{
      maxWidth: '1050px',
      margin: '0 auto',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      {/* Top Bar with Navigation & Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '2px solid #E2E8F0',
        paddingBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => handleCompleteSession('exited')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '14px',
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              color: '#334155',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            <Home size={18} />
            <span>{t?.mainMenu || 'Main Menu'}</span>
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: '#FEF3C7',
                color: '#92400E',
                padding: '3px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800
              }}>
                EXCLUSIVE • VISUAL ATTENTION & SEARCH
              </span>
              <span style={{ fontSize: '13px', color: '#059669', fontWeight: 700 }}>
                ● Dignity First
              </span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '4px 0 0 0' }}>
              {selectedLanguage === 'as' ? 'মনোযোগ সন্ধান (Focus Finder)' :
               selectedLanguage === 'hi' ? 'फोकस खोजकर्ता (Focus Finder)' :
               selectedLanguage === 'bn' ? 'মনোযোগ সন্ধান (Focus Finder)' :
               selectedLanguage === 'ne' ? 'ध्यान खोजी (Focus Finder)' :
               'Focus Finder — Scene Search'}
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={speakPrompt}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '14px',
              background: '#EFF6FF',
              border: '2px solid #BFDBFE',
              color: '#1D4ED8',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Volume2 size={18} />
            <span>{selectedLanguage === 'as' ? 'প্ৰশ্ন শুনক' : 'Hear Target'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCaregiverNotes(prev => !prev)}
            style={{
              padding: '10px 14px',
              borderRadius: '14px',
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              color: '#475569',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={18} color="#059669" />
            <span>Caregiver Info</span>
          </button>
        </div>
      </div>

      {/* Target Search Banner & Scene Selection */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '1rem 1.5rem',
        border: '2px solid #FDE68A',
        boxShadow: '0 4px 14px rgba(245, 158, 11, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        {/* Active Target Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: '#FEF3C7',
            border: '2px solid #F59E0B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px'
          }}>
            🔍
          </div>
          <div>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#D97706', textTransform: 'uppercase' }}>
              {selectedLanguage === 'as' ? 'বিচাৰিব লগা বস্তু (Requested Target)' : 'Find this item:'}
            </span>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#1E293B' }}>
              {targetLabel}
            </div>
          </div>
        </div>

        {/* Scene Picker & Difficulty */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Scenes */}
          <div style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '12px' }}>
            {SCENES.map((sc, sIdx) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => { setSceneIdx(sIdx); setTargetIdx(0); setHintTier(0); }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: sceneIdx === sIdx ? '#FFFFFF' : 'transparent',
                  color: sceneIdx === sIdx ? '#1E293B' : '#64748B',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: sceneIdx === sIdx ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                {sc.themeName[selectedLanguage] || sc.themeName.en}
              </button>
            ))}
          </div>

          {/* Difficulty Stepper */}
          <div style={{ display: 'flex', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '12px', overflow: 'hidden' }}>
            {[
              { id: 'gentle', label: selectedLanguage === 'as' ? 'শান্ত' : 'Gentle' },
              { id: 'comfortable', label: selectedLanguage === 'as' ? 'আৰামদায়ক' : 'Comfortable' },
              { id: 'explore', label: selectedLanguage === 'as' ? 'বৈচিত্ৰ্য' : 'Explore' }
            ].map(d => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDifficulty(d.id)}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  background: difficulty === d.id ? '#D97706' : 'transparent',
                  color: difficulty === d.id ? '#FFFFFF' : '#475569',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Illustrated Scene Canvas */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '460px',
        background: currentScene.bgGradient,
        borderRadius: '24px',
        border: '3px solid #FCD34D',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
        userSelect: 'none'
      }}>
        {/* Subtle Watermark Theme Label */}
        <div style={{
          position: 'absolute',
          top: '14px',
          left: '18px',
          background: 'rgba(255, 255, 255, 0.75)',
          padding: '4px 12px',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: 700,
          color: '#78350F',
          backdropFilter: 'blur(4px)',
          zIndex: 5
        }}>
          {sceneTitle}
        </div>

        {/* Scene Objects */}
        {visibleObjects.map(obj => {
          const isTarget = obj.id === currentTarget.id;
          const isHighlighted = isTarget && hintTier >= 1;
          const isDimmed = !isTarget && hintTier >= 2;

          return (
            <button
              key={obj.id}
              type="button"
              onClick={() => handleObjectClick(obj)}
              style={{
                position: 'absolute',
                top: `${obj.y}%`,
                left: `${obj.x}%`,
                transform: 'translate(-50%, -50%)',
                width: difficulty === 'gentle' ? '82px' : '72px',
                height: difficulty === 'gentle' ? '82px' : '72px',
                borderRadius: '22px',
                background: isTarget && celebration ? '#DCFCE7' : 'rgba(255, 255, 255, 0.92)',
                border: isHighlighted ? '4px solid #D97706' : '2px solid rgba(255, 255, 255, 0.8)',
                boxShadow: isHighlighted ? '0 0 25px rgba(217, 119, 6, 0.7)' : '0 4px 14px rgba(0,0,0,0.08)',
                fontSize: difficulty === 'gentle' ? '44px' : '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                opacity: isDimmed ? 0.35 : 1,
                transition: 'all 0.3s ease',
                animation: isHighlighted ? 'pulseHint 1.8s infinite ease-in-out' : 'none',
                zIndex: isTarget ? 15 : 10
              }}
              title={obj.label}
            >
              {obj.icon}
            </button>
          );
        })}

        {/* Celebration Overlay Banner */}
        {celebration && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 30,
            animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{
              background: '#FFFFFF',
              border: '3px solid #16A34A',
              padding: '1.5rem 2.5rem',
              borderRadius: '24px',
              textAlign: 'center',
              boxShadow: '0 12px 30px rgba(22, 163, 74, 0.25)'
            }}>
              <Sparkles size={48} color="#16A34A" style={{ margin: '0 auto 8px' }} />
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#166534', margin: 0 }}>
                {selectedLanguage === 'as' ? 'সুন্দৰ সোঁৱৰণি ও সন্ধান!' : 'Splendid Discovery!'}
              </h3>
              <p style={{ fontSize: '16px', color: '#15803D', marginTop: '6px', fontWeight: 600 }}>
                {targetLabel}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Interactive Toolbar: Hints, Pause, Skip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: '#FFFFFF',
        borderRadius: '18px',
        padding: '12px 20px',
        border: '1px solid #E2E8F0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Progressive Hint Button */}
          <button
            type="button"
            onClick={handleNextHint}
            style={{
              padding: '12px 20px',
              borderRadius: '14px',
              background: hintTier > 0 ? '#FEF3C7' : '#F1F5F9',
              border: hintTier > 0 ? '2px solid #F59E0B' : '1px solid #CBD5E1',
              color: hintTier > 0 ? '#92400E' : '#475569',
              fontWeight: 700,
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <HelpCircle size={18} />
            <span>
              {hintTier === 0 ? (selectedLanguage === 'as' ? 'সহায় / ইংগিত' : 'Need a Clue?') :
               hintTier === 1 ? (selectedLanguage === 'as' ? 'ইংগিত ২: কম দৃশ্য' : 'Clue 2: Dim Others') :
               (selectedLanguage === 'as' ? 'ইংগিত ৩: কণ্ঠ সহায়' : 'Clue 3: Spoken Voice')}
            </span>
          </button>

          {/* Hint Readout Feedback */}
          {hintTier >= 3 && (
            <span style={{ fontSize: '14px', color: '#92400E', fontWeight: 600 }}>
              💡 {targetHint}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Skip Target */}
          <button
            type="button"
            onClick={() => {
              setHintTier(0);
              setTargetIdx(prev => prev + 1);
            }}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              color: '#64748B',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            {selectedLanguage === 'as' ? 'পৰৱৰ্তী বস্তু' : 'Skip Target'}
          </button>

          {/* Finish Session */}
          <button
            type="button"
            onClick={() => handleCompleteSession('completed')}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              background: '#16A34A',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {selectedLanguage === 'as' ? 'সম্পূৰ্ণ কৰক' : 'Finish Session'}
          </button>
        </div>
      </div>

      {/* Caregiver Clinical Transparency Drawer */}
      {showCaregiverNotes && (
        <div style={{
          background: '#0B0F17',
          color: '#F8FAFC',
          borderRadius: '18px',
          padding: '1.25rem 1.5rem',
          border: '1px solid #334155'
        }}>
          <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0', color: '#FCD34D' }}>
            Caregiver Notes — Focus Finder (Visual Search & Attention)
          </h4>
          <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5, margin: 0 }}>
            This game exercises selective visual scanning and object identification in familiar domestic settings.
            Objects found: <strong>{foundTargets.length}</strong>. Current level: <strong>{difficulty}</strong>.
            <br />
            <em>Clinical Guardrail: Speed of identification or missed items are non-diagnostic and may vary with lighting, eyeglass prescription, or natural daily fatigue.</em>
          </p>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes pulseHint {
          0% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 15px rgba(217, 119, 6, 0.5); }
          50% { transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 0 30px rgba(217, 119, 6, 0.9); }
          100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 15px rgba(217, 119, 6, 0.5); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
