import React, { useState } from 'react';
import { Search, Sparkles, Volume2, HelpCircle, ArrowRight, RotateCcw, CheckCircle2, Home } from 'lucide-react';
import { speechService } from '../services/speechService';

const SCENES = [
  {
    id: 'scene_tea_veranda',
    title: {
      as: 'পুৱাৰ বাৰান্দা আৰু চাহৰ মেজ',
      bn: 'সকালের বারান্দা ও চায়ের টেবিল',
      ne: 'बिहानीको बार्दली र चिया टेबल',
      hi: 'सुबह का बरामदा और चाय की मेज़',
      en: 'Morning Veranda & Tea Table'
    },
    targetItem: {
      id: 'teacup',
      label: {
        as: 'ককাৰ কাঁহৰ চাহৰ বাতি (Bell-metal Cup)',
        bn: 'দাদুর কাঁসার চায়ের বাটি (Bell-metal Cup)',
        ne: 'हजुरबुबाको काँसको चिया कप (Bell-metal Cup)',
        hi: 'दादाजी का पीतल का चाय का प्याला',
        en: "Grandfather's Traditional Tea Cup"
      },
      hint: {
        as: 'মেজৰ সোঁমাজত হালধীয়া জিলিকি থকা বাতিটো চাওক।',
        bn: 'টেবিলের মাঝখানে পিতলের উজ্জ্বল বাটিটি দেখুন।',
        ne: 'टेबलको बीचमा चम्किएको काँसको कप हेर्नुहोस्।',
        hi: 'मेज़ के बीच में चमकता हुआ पारंपरिक प्याला देखिए।',
        en: 'Look near the center of the wooden table where the steam is rising.'
      }
    },
    items: [
      { id: 'glasses', icon: '👓', label: 'Reading Glasses', x: 22, y: 35, isTarget: false },
      { id: 'newspaper', icon: '📰', label: 'Daily Newspaper', x: 74, y: 40, isTarget: false },
      { id: 'teacup', icon: '☕', label: 'Brass Tea Cup', x: 48, y: 52, isTarget: true },
      { id: 'plant', icon: '🪴', label: 'Tulsi Planter', x: 85, y: 72, isTarget: false },
      { id: 'cane_chair', icon: '🪑', label: 'Cane Veranda Chair', x: 15, y: 70, isTarget: false }
    ],
    bgGradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #FDE047 100%)'
  },
  {
    id: 'scene_cozy_kitchen',
    title: {
      as: 'পৰম্পৰাগত ৰান্ধনিঘৰ',
      bn: 'ঐতিহ্যবাহী রান্নাঘর',
      ne: 'परम्परागत भान्सा कोठा',
      hi: 'पारंपरिक रसोईघर',
      en: 'Traditional Kitchen Hearth'
    },
    targetItem: {
      id: 'kettle',
      label: {
        as: 'গৰম পানীৰ চচপেন / কেটলী (Tea Kettle)',
        bn: 'গরম জলের কেটলি (Tea Kettle)',
        ne: 'तातो पानीको कित्ली (Tea Kettle)',
        hi: 'चाय की केतली (Tea Kettle)',
        en: 'The Warm Tea Kettle'
      },
      hint: {
        as: 'চুলাৰ কাষত ধোঁৱা ওলাই থকা কেটলীটো চাওক।',
        bn: 'চুলার পাশে বাষ্প ওঠা কেটলিটি দেখুন।',
        ne: 'चुल्हो छेउमा बाफ निस्किरहेको कित्ली हेर्नुहोस्।',
        hi: 'चूल्हे के पास भाप छोड़ती हुई केतली देखिए।',
        en: 'Look near the stove where the gentle steam rises.'
      }
    },
    items: [
      { id: 'mortar', icon: '🥣', label: 'Ginger Mortar', x: 20, y: 55, isTarget: false },
      { id: 'kettle', icon: '🫖', label: 'Tea Kettle', x: 50, y: 45, isTarget: true },
      { id: 'spice_box', icon: '🧂', label: 'Spice Container', x: 78, y: 58, isTarget: false },
      { id: 'bananas', icon: '🍌', label: 'Malbhog Bananas', x: 30, y: 78, isTarget: false }
    ],
    bgGradient: 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 50%, #FDBA74 100%)'
  }
];

export default function EverydayDetectiveGame({ onSessionComplete, selectedLanguage = 'as', t }) {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [foundItems, setFoundItems] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [celebration, setCelebration] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const scene = SCENES[currentSceneIdx];
  const targetLabel = scene.targetItem.label[selectedLanguage] || scene.targetItem.label.en;
  const targetHint = scene.targetItem.hint[selectedLanguage] || scene.targetItem.hint.en;
  const sceneTitle = scene.title[selectedLanguage] || scene.title.en;

  const handleItemClick = (item) => {
    setAttempts(prev => prev + 1);
    if (item.isTarget) {
      setFoundItems(prev => [...prev, item.id]);
      setCelebration(true);
      const winMsg = selectedLanguage === 'as' 
        ? 'বৰ সুন্দৰ! আপুনি চাহৰ বাতিটো বিচাৰি পালে।' 
        : selectedLanguage === 'hi' 
        ? 'बहुत सुंदर! आपने वस्तु पहचान ली।' 
        : 'Splendid observation! You found it.';
      speechService.speak(winMsg, selectedLanguage);

      setTimeout(() => {
        if (currentSceneIdx < SCENES.length - 1) {
          setCurrentSceneIdx(prev => prev + 1);
          setCelebration(false);
          setShowHint(false);
        } else {
          // Complete session
          if (onSessionComplete) {
            onSessionComplete({
              activityType: 'everyday_detective',
              activityTitle: 'Everyday Detective — Familiar Scene Recall',
              attempts: attempts + 1,
              hintsUsed: showHint ? 1 : 0,
              completionStatus: 'completed'
            });
          }
        }
      }, 2500);
    } else {
      // Gentle encouragement
      const tryMsg = selectedLanguage === 'as' 
        ? 'ই এটা সুন্দৰ বস্তু, কিন্তু কাষলৈ লক্ষ্য কৰক।' 
        : 'A lovely object. Look gently nearby.';
      speechService.speak(tryMsg, selectedLanguage);
    }
  };

  const handleReadInstruction = () => {
    const prompt = selectedLanguage === 'as' 
      ? `আহক বিচাৰোঁ: ${targetLabel}` 
      : `Let's find: ${targetLabel}`;
    speechService.speak(prompt, selectedLanguage);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Header Banner */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '1.75rem 2rem',
        border: '2px solid #E2E8F0',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <span style={{
            background: '#FEF3C7',
            color: '#92400E',
            padding: '4px 12px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700
          }}>
            Everyday Detective • চিনাকি দৃশ্য
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '6px 0 2px 0' }}>
            {sceneTitle}
          </h2>
          <p style={{ fontSize: '18px', color: '#475569' }}>
            {selectedLanguage === 'as' ? 'বিচাৰকচোন:' : 'Can you find:'} <strong style={{ color: '#D97706' }}>{targetLabel}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleReadInstruction}
            style={{
              background: '#F8FAFC',
              border: '2px solid #CBD5E1',
              borderRadius: '14px',
              padding: '10px 18px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Volume2 size={20} />
            <span>Hear Aloud</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowHint(true);
              speechService.speak(targetHint, selectedLanguage);
            }}
            style={{
              background: '#FEF3C7',
              border: '2px solid #FCD34D',
              color: '#92400E',
              borderRadius: '14px',
              padding: '10px 18px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <HelpCircle size={20} />
            <span>Gentle Clue</span>
          </button>
        </div>
      </div>

      {showHint && (
        <div style={{
          background: '#FEF9C3',
          border: '2px solid #FDE047',
          borderRadius: '16px',
          padding: '12px 20px',
          color: '#854D0E',
          fontSize: '17px',
          fontWeight: 700,
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Sparkles size={20} color="#D97706" />
          <span>{targetHint}</span>
        </div>
      )}

      {/* Interactive Scene Canvas */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '480px',
        background: scene.bgGradient,
        borderRadius: '28px',
        border: '3px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)'
      }}>
        {/* Background Decorative Architecture */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '140px',
          background: 'rgba(255, 255, 255, 0.45)',
          borderTop: '3px solid rgba(0, 0, 0, 0.08)'
        }} />

        {/* Clickable Objects */}
        {scene.items.map(item => {
          const isTargetAndHinted = item.isTarget && showHint;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item)}
              style={{
                position: 'absolute',
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)',
                background: isTargetAndHinted ? '#FEF08A' : '#FFFFFF',
                border: isTargetAndHinted ? '4px solid #D97706' : '3px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '50%',
                width: '84px',
                height: '84px',
                fontSize: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: isTargetAndHinted ? '0 0 24px rgba(217, 119, 6, 0.6)' : '0 6px 18px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              title={item.label}
            >
              {item.icon}
            </button>
          );
        })}

        {/* Celebratory Completion Overlay */}
        {celebration && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(16, 185, 129, 0.88)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            zIndex: 10,
            backdropFilter: 'blur(3px)'
          }}>
            <Sparkles size={64} style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '32px', fontWeight: 800 }}>
              {selectedLanguage === 'as' ? 'সুন্দৰ বিচাৰ পালে!' : 'Wonderfully Spotted!'}
            </h3>
            <p style={{ fontSize: '20px', marginTop: '6px' }}>
              {targetLabel}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
