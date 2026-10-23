import React, { useState, useEffect, useRef } from 'react';
import { Eye, Sparkles, Volume2, ArrowRight, RotateCcw, CheckCircle2, Home, Info, ShieldCheck, Heart } from 'lucide-react';
import { speechService } from '../services/speechService';

const PERIPHERAL_TARGETS = [
  { id: 'golden_bell', icon: '🔔', label: { as: 'সোণালী ঘণ্টা', bn: 'সোনার ঘণ্টা', ne: 'सुनौलो घण्टी', hi: 'सुनहरी घंटी', en: 'Golden Bell' } },
  { id: 'orchid_flower', icon: '🌸', label: { as: 'কপৌ ফুল', bn: 'অর্কিড ফুল', ne: 'सुनाखरी फूल', hi: 'ऑर्किड का फूल', en: 'Orchid Bloom' } },
  { id: 'tea_cup', icon: '☕', label: { as: 'চাহৰ বাতি', bn: 'চায়ের বাটি', ne: 'चियाको कप', hi: 'चाय का प्याला', en: 'Tea Cup' } }
];

const PERIPHERAL_DISTRACTORS = [
  { id: 'green_leaf', icon: '🍃', label: { as: 'সেউজীয়া পাত', bn: 'সবুজ পাতা', ne: 'हरियो पात', hi: 'हरी पत्ती', en: 'Green Leaf' } },
  { id: 'grey_pebble', icon: '🪨', label: { as: 'নদীৰ শিলগুটি', bn: 'নদীর নুড়িপাথর', ne: 'नदीको ढुङ्गा', hi: 'नदी का कंकड़', en: 'River Pebble' } },
  { id: 'soft_cloud', icon: '☁️', label: { as: 'বগা মেঘ', bn: 'সাদা মেঘ', ne: 'सेतो बादल', hi: 'सफेद बादल', en: 'White Cloud' } }
];

// Peripheral coordinate offsets (% from center)
const PERIPHERAL_POSITIONS = [
  { id: 'top_left', x: 12, y: 15 },
  { id: 'top_center', x: 50, y: 10 },
  { id: 'top_right', x: 88, y: 15 },
  { id: 'mid_left', x: 8, y: 50 },
  { id: 'mid_right', x: 92, y: 50 },
  { id: 'bottom_left', x: 12, y: 85 },
  { id: 'bottom_center', x: 50, y: 88 },
  { id: 'bottom_right', x: 88, y: 85 }
];

export default function FocusPeripheralGame({ onSessionComplete, selectedLanguage = 'as', t }) {
  const [level, setLevel] = useState(1); // 1 = Gentle, 2 = Awareness with distractor, 3 = Dynamic
  const [targetTypeIdx, setTargetTypeIdx] = useState(0);
  const [activeItem, setActiveItem] = useState(null); // { id, icon, isTarget, x, y, spawnTime }
  const [secondaryDistractor, setSecondaryDistractor] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [celebration, setCelebration] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [showCaregiverSummary, setShowCaregiverSummary] = useState(false);

  // Engagement tracking (strictly non-punitive)
  const [metrics, setMetrics] = useState({
    roundsTotal: 0,
    targetsNoticed: 0,
    distractorsIgnored: 0,
    unsureSkips: 0,
    latencies: []
  });

  const timerRef = useRef(null);
  const currentTarget = PERIPHERAL_TARGETS[targetTypeIdx];
  const targetLabel = currentTarget.label[selectedLanguage] || currentTarget.label.en;

  const playSoftChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5 pleasant chime
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {}
  };

  const getInstructions = () => {
    switch (selectedLanguage) {
      case 'hi':
        return `स्क्रीन के बीच में जलते हुए सुंदर दीपक पर अपनी दृष्टि टिकाए रखें। जब किनारों पर "${targetLabel}" दिखाई दे, तो उस पर स्पर्श करें। कोई जल्दबाज़ी नहीं है।`;
      case 'bn':
        return `পর্দার মাঝে সুন্দর প্রদীপের শিখায় শান্তভাবে দৃষ্টি রাখুন। যখনই প্রান্তভাগে "${targetLabel}" দেখা যাবে, স্পর্শ করুন। কোনো তাড়াহুড়ো নেই।`;
      case 'ne':
        return `पर्दाको बीचमा बलिरहेको शान्त दियोमा ध्यान दिनुहोस्। जब छेउमा "${targetLabel}" देखिन्छ, तब छुनुहोस्। कुनै हतार छैन।`;
      case 'en':
        return `Gently rest your gaze on the calm golden flame in the center. Tap when you notice the "${targetLabel}" in the outer corners. No rush at all.`;
      case 'as':
      default:
        return `পৰ্দাৰ সোঁমাজৰ শান্ত প্ৰদীপৰ শিখাত মন দিয়ক। চাৰিওফালে যেতিয়া "${targetLabel}" ওলাব, স্পৰ্শ কৰক। কোনো খৰখেদা নাই।`;
    }
  };

  const speakInstructions = () => {
    speechService.speak(getInstructions(), selectedLanguage);
  };

  // Spawn an unhurried peripheral item
  const spawnPeripheralItem = () => {
    if (!isRunning) return;

    // Pick random peripheral position
    const pos = PERIPHERAL_POSITIONS[Math.floor(Math.random() * PERIPHERAL_POSITIONS.length)];
    
    // In Level 1, 80% targets. In Level 2 & 3, 60% targets, 40% distractors
    const isTarget = level === 1 ? true : Math.random() < 0.65;
    
    let itemData;
    if (isTarget) {
      itemData = {
        ...currentTarget,
        isTarget: true,
        x: pos.x,
        y: pos.y,
        spawnTime: Date.now()
      };
    } else {
      const distractor = PERIPHERAL_DISTRACTORS[Math.floor(Math.random() * PERIPHERAL_DISTRACTORS.length)];
      itemData = {
        ...distractor,
        isTarget: false,
        x: pos.x,
        y: pos.y,
        spawnTime: Date.now()
      };
    }

    setActiveItem(itemData);

    // In Level 3, optionally spawn a quiet secondary distractor elsewhere
    if (level === 3 && isTarget) {
      const otherPositions = PERIPHERAL_POSITIONS.filter(p => p.id !== pos.id);
      const secondPos = otherPositions[Math.floor(Math.random() * otherPositions.length)];
      const dist = PERIPHERAL_DISTRACTORS[0];
      setSecondaryDistractor({
        ...dist,
        isTarget: false,
        x: secondPos.x,
        y: secondPos.y
      });
    } else {
      setSecondaryDistractor(null);
    }

    setMetrics(prev => ({ ...prev, roundsTotal: prev.roundsTotal + 1 }));

    // Unhurried exposure: item stays for 9 seconds before naturally rotating
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleItemExpiries();
    }, 9000);
  };

  const handleItemExpiries = () => {
    // If target faded without tap, peacefully proceed without negative noise
    setActiveItem(null);
    setSecondaryDistractor(null);
    setFeedbackText(
      selectedLanguage === 'as' ? 'শান্তভাৱে আগবাঢ়িছোঁ। সোঁমাজৰ প্ৰদীপটোলৈ চাওক।' :
      selectedLanguage === 'hi' ? 'शांति से आगे बढ़ रहे हैं। बीच के दीपक पर ध्यान रखें।' :
      'Continuing gently. Rest your gaze on the central flame.'
    );

    // Pause briefly before next spawn
    timerRef.current = setTimeout(() => {
      spawnPeripheralItem();
    }, 2500);
  };

  const handleItemClick = (item) => {
    if (!item) return;
    clearTimeout(timerRef.current);

    const latencyMs = Date.now() - (item.spawnTime || Date.now());
    const latencySec = (latencyMs / 1000).toFixed(1);

    if (item.isTarget) {
      playSoftChime();
      setCelebration(true);
      setMetrics(prev => ({
        ...prev,
        targetsNoticed: prev.targetsNoticed + 1,
        latencies: [...prev.latencies, latencyMs]
      }));

      const praise = selectedLanguage === 'as'
        ? `বৰ সুন্দৰ মনসংযোগ! আপুনি ${item.label?.as || 'লক্ষ্য'} দেখা পালে।`
        : selectedLanguage === 'hi'
        ? `बहुत सुंदर ध्यान! आपने ${item.label?.hi || 'वस्तु'} पहचान ली।`
        : `Wonderful visual awareness! You noticed the ${item.label?.en || 'target'}.`;

      setFeedbackText(praise);
      speechService.speak(praise, selectedLanguage);

      setTimeout(() => {
        setCelebration(false);
        setActiveItem(null);
        setSecondaryDistractor(null);
        timerRef.current = setTimeout(spawnPeripheralItem, 2000);
      }, 2500);
    } else {
      // Distractor tapped: gentle non-punitive guidance
      setMetrics(prev => ({ ...prev, distractorsIgnored: prev.distractorsIgnored }));
      const gentleNote = selectedLanguage === 'as'
        ? `ই আছিল ${item.label?.as || 'পাত'}। সোঁমাজৰ পৰা ${targetLabel} লৈ মন দিয়ক।`
        : selectedLanguage === 'hi'
        ? `यह ${item.label?.hi || 'पत्ती'} थी। केंद्र पर ध्यान बनाए रखें और ${targetLabel} की प्रतीक्षा करें।`
        : `That was the ${item.label?.en || 'distractor'}. Keep focus on the center for the ${targetLabel}.`;

      setFeedbackText(gentleNote);
      speechService.speak(gentleNote, selectedLanguage);

      setTimeout(() => {
        setActiveItem(null);
        setSecondaryDistractor(null);
        timerRef.current = setTimeout(spawnPeripheralItem, 2000);
      }, 2000);
    }
  };

  // Start / Stop exercise
  const toggleStart = () => {
    if (isRunning) {
      setIsRunning(false);
      clearTimeout(timerRef.current);
      setActiveItem(null);
      setSecondaryDistractor(null);
      setFeedbackText('');
    } else {
      setIsRunning(true);
      setFeedbackText(
        selectedLanguage === 'as' ? 'অনুশীলন আৰম্ভ হৈছে... প্ৰদীপৰ শিখাত মন দিয়ক।' :
        selectedLanguage === 'hi' ? 'अभ्यास प्रारंभ हो चुका है... दीपक पर दृष्टि रखें।' :
        'Exercise started... focus gently on the flame.'
      );
      speakInstructions();
      timerRef.current = setTimeout(() => {
        spawnPeripheralItem();
      }, 3500);
    }
  };

  const handleUnsure = () => {
    setMetrics(prev => ({ ...prev, unsureSkips: prev.unsureSkips + 1 }));
    setFeedbackText(
      selectedLanguage === 'as' ? 'একদম ঠিকেই আছে। শান্তভাৱে প্ৰদীপটোলৈ চাই জিৰণি লওক।' :
      selectedLanguage === 'hi' ? 'बिल्कुल ठीक है। आराम से दीपक को देखते हुए विश्राम लें।' :
      'Completely okay. Take your time and rest your eyes on the flame.'
    );
  };

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      speechService.stop();
    };
  }, []);

  const avgLatency = metrics.latencies.length > 0
    ? (metrics.latencies.reduce((a, b) => a + b, 0) / metrics.latencies.length / 1000).toFixed(1)
    : '—';

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '1.5rem',
      minHeight: '85vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Header & Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '1.25rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid #E2E8F0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => onSessionComplete?.({ module: 'focus_peripheral', metrics })}
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
                EXCLUSIVE • VISUAL FOCUS & PERIPHERY
              </span>
              <span style={{ fontSize: '13px', color: '#059669', fontWeight: 700 }}>
                ● Non-Diagnostic Engagement
              </span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '4px 0 0 0' }}>
              {selectedLanguage === 'as' ? 'দৃষ্টিকেন্দ্ৰ আৰু চাৰিওফালৰ দৃষ্টি' :
               selectedLanguage === 'hi' ? 'ध्यान एवं परिधीय सजगता' :
               selectedLanguage === 'bn' ? 'দৃষ্টিসংযোগ ও পারিপার্শ্বিক সচেতনতা' :
               selectedLanguage === 'ne' ? 'ध्यान र परिधीय चेतना' :
               'Focus & Peripheral Awareness'}
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={speakInstructions}
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
            <span>{selectedLanguage === 'as' ? 'নিৰ্দেশনা শুনক' : selectedLanguage === 'hi' ? 'निर्देश सुनें' : 'Listen'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCaregiverSummary(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '14px',
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              color: '#475569',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Info size={18} />
            <span>Caregiver Notes</span>
          </button>
        </div>
      </div>

      {/* Target Specifier & Level Selector */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '18px',
        padding: '14px 20px',
        border: '1px solid #E2E8F0',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: '#FEF3C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            border: '2px solid #FCD34D'
          }}>
            {currentTarget.icon}
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
              {selectedLanguage === 'as' ? 'লক্ষ্য বস্তু (Target)' : 'Current Target Object'}
            </span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#92400E' }}>
              {targetLabel}
            </div>
          </div>
        </div>

        {/* Level Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
            {selectedLanguage === 'as' ? 'স্তৰ:' : 'Difficulty:'}
          </span>
          {[
            { lvl: 1, label: selectedLanguage === 'as' ? '১: শান্ত' : '1: Gentle' },
            { lvl: 2, label: selectedLanguage === 'as' ? '২: সচেতন' : '2: Shapes' },
            { lvl: 3, label: selectedLanguage === 'as' ? '৩: বৈচিত্ৰ্য' : '3: Active' }
          ].map(l => (
            <button
              key={l.lvl}
              type="button"
              onClick={() => { setLevel(l.lvl); setActiveItem(null); setSecondaryDistractor(null); }}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                background: level === l.lvl ? '#F59E0B' : '#F1F5F9',
                color: level === l.lvl ? '#FFFFFF' : '#475569',
                border: level === l.lvl ? '2px solid #D97706' : '1px solid #CBD5E1'
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visual Arena (Center Beacon + Peripheral Zones) */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '420px',
        background: 'radial-gradient(circle at center, #FFFBEB 0%, #FEF3C7 35%, #F8FAFC 85%)',
        borderRadius: '24px',
        border: '3px solid #FDE68A',
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 12px rgba(245, 158, 11, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}>
        {/* Subtle Guide Concentric Rings */}
        <div style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          border: '1px dashed rgba(245, 158, 11, 0.25)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          border: '1px dashed rgba(245, 158, 11, 0.35)',
          pointerEvents: 'none'
        }} />

        {/* Central Focus Beacon (Radiant Golden Diya Flame) */}
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #F59E0B, #DC2626)',
            boxShadow: '0 0 35px rgba(245, 158, 11, 0.6), 0 0 70px rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '44px',
            animation: 'pulseGaze 3s infinite alternate ease-in-out',
            border: '4px solid #FFFFFF'
          }}>
            🪔
          </div>
          <span style={{
            marginTop: '8px',
            fontSize: '13px',
            fontWeight: 800,
            color: '#78350F',
            background: 'rgba(255, 255, 255, 0.85)',
            padding: '3px 10px',
            borderRadius: '8px',
            backdropFilter: 'blur(4px)'
          }}>
            {selectedLanguage === 'as' ? 'দৃষ্টিকেন্দ্ৰ (Keep Gaze Here)' : 'Center Focus'}
          </span>
        </div>

        {/* Active Peripheral Item (Target or Distractor) */}
        {activeItem && (
          <button
            type="button"
            onClick={() => handleItemClick(activeItem)}
            style={{
              position: 'absolute',
              top: `${activeItem.y}%`,
              left: `${activeItem.x}%`,
              transform: 'translate(-50%, -50%)',
              width: '74px',
              height: '74px',
              borderRadius: '20px',
              background: celebration && activeItem.isTarget ? '#DCFCE7' : '#FFFFFF',
              border: activeItem.isTarget ? '3px solid #F59E0B' : '2px solid #CBD5E1',
              boxShadow: activeItem.isTarget ? '0 8px 24px rgba(245, 158, 11, 0.4)' : '0 4px 12px rgba(0,0,0,0.06)',
              fontSize: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              animation: 'gentlePop 0.4s ease-out',
              zIndex: 20,
              transition: 'all 0.2s ease'
            }}
            title={activeItem.label?.[selectedLanguage] || activeItem.label?.en}
          >
            {activeItem.icon}
          </button>
        )}

        {/* Secondary Distractor (Level 3) */}
        {secondaryDistractor && (
          <div
            onClick={() => handleItemClick(secondaryDistractor)}
            style={{
              position: 'absolute',
              top: `${secondaryDistractor.y}%`,
              left: `${secondaryDistractor.x}%`,
              transform: 'translate(-50%, -50%)',
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: '#F8FAFC',
              border: '2px dashed #94A3B8',
              opacity: 0.85,
              fontSize: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 15
            }}
          >
            {secondaryDistractor.icon}
          </div>
        )}

        {/* Start Overlay if paused */}
        {!isRunning && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 30,
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <Eye size={48} color="#D97706" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>
              {selectedLanguage === 'as' ? 'শান্তিৰে দৃষ্টি অনুশীলন আৰম্ভ কৰক' :
               selectedLanguage === 'hi' ? 'शांतिपूर्वक दृष्टि अभ्यास प्रारंभ करें' :
               'Gentle Visual Focus & Peripheral Awareness'}
            </h3>
            <p style={{ maxWidth: '480px', color: '#64748B', fontSize: '15px', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {getInstructions()}
            </p>
            <button
              type="button"
              onClick={toggleStart}
              style={{
                padding: '14px 32px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '18px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)'
              }}
            >
              {selectedLanguage === 'as' ? '▶ আৰম্ভ কৰক (Begin Calmly)' : '▶ Begin Calmly'}
            </button>
          </div>
        )}
      </div>

      {/* Primary Accessible Response Bar */}
      <div style={{
        marginTop: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Giant Accessibility Button: Method B (for users with tremors or small screen limits) */}
        <button
          type="button"
          disabled={!isRunning}
          onClick={() => activeItem && handleItemClick(activeItem)}
          style={{
            flex: '1 1 280px',
            padding: '16px 24px',
            borderRadius: '18px',
            background: activeItem?.isTarget ? '#16A34A' : '#FFFFFF',
            color: activeItem?.isTarget ? '#FFFFFF' : '#334155',
            border: activeItem?.isTarget ? '3px solid #15803D' : '2px solid #CBD5E1',
            fontSize: '18px',
            fontWeight: 800,
            cursor: isRunning ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: activeItem?.isTarget ? '0 8px 20px rgba(22, 163, 74, 0.3)' : '0 2px 6px rgba(0,0,0,0.04)',
            transition: 'all 0.2s ease',
            opacity: isRunning ? 1 : 0.6
          }}
        >
          <span style={{ fontSize: '24px' }}>{currentTarget.icon}</span>
          <span>
            {selectedLanguage === 'as' ? `মই ${targetLabel} দেখা পালোঁ!` :
             selectedLanguage === 'hi' ? `मुझे ${targetLabel} दिखाई दी!` :
             `I noticed the ${targetLabel}!`}
          </span>
        </button>

        {/* Peaceful Skip / Take Breath */}
        <button
          type="button"
          disabled={!isRunning}
          onClick={handleUnsure}
          style={{
            padding: '16px 20px',
            borderRadius: '18px',
            background: '#F8FAFC',
            border: '2px solid #E2E8F0',
            color: '#64748B',
            fontSize: '16px',
            fontWeight: 700,
            cursor: isRunning ? 'pointer' : 'not-allowed'
          }}
        >
          {selectedLanguage === 'as' ? 'জিৰণি লওঁ (Rest for a moment)' : "Take a Rest"}
        </button>

        {/* Start / Pause Control */}
        <button
          type="button"
          onClick={toggleStart}
          style={{
            padding: '16px 22px',
            borderRadius: '18px',
            background: isRunning ? '#EF4444' : '#F59E0B',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {isRunning ? (selectedLanguage === 'as' ? '⏸ জিৰণি' : 'Pause') : (selectedLanguage === 'as' ? '▶ আৰম্ভ' : 'Resume')}
        </button>
      </div>

      {/* Gentle Live Feedback Bar */}
      {feedbackText && (
        <div style={{
          marginTop: '1rem',
          padding: '12px 18px',
          background: celebration ? '#DCFCE7' : '#FEF3C7',
          color: celebration ? '#166534' : '#92400E',
          borderRadius: '14px',
          fontSize: '16px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          border: celebration ? '2px solid #86EFAC' : '2px solid #FDE68A'
        }}>
          <Sparkles size={20} />
          <span>{feedbackText}</span>
        </div>
      )}

      {/* Caregiver Clinical Transparency Drawer */}
      {showCaregiverSummary && (
        <div style={{
          marginTop: '1.5rem',
          background: '#0B0F17',
          color: '#F8FAFC',
          borderRadius: '20px',
          padding: '1.5rem 1.75rem',
          border: '1px solid #334155'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <ShieldCheck size={20} color="#10B981" />
            <h4 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
              Caregiver Progress & Dignity Summary
            </h4>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '10px',
            margin: '12px 0'
          }}>
            <div style={{ background: '#1E293B', padding: '10px 14px', borderRadius: '12px' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Targets Noticed</span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#10B981' }}>{metrics.targetsNoticed}</div>
            </div>
            <div style={{ background: '#1E293B', padding: '10px 14px', borderRadius: '12px' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Distractor Filters</span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#38BDF8' }}>{metrics.distractorsIgnored}</div>
            </div>
            <div style={{ background: '#1E293B', padding: '10px 14px', borderRadius: '12px' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Avg Notice Latency</span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#FBBF24' }}>{avgLatency}s</div>
            </div>
            <div style={{ background: '#1E293B', padding: '10px 14px', borderRadius: '12px' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Peaceful Skips</span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#CBD5E1' }}>{metrics.unsureSkips}</div>
            </div>
          </div>

          <p style={{
            fontSize: '12px',
            color: '#94A3B8',
            lineHeight: 1.5,
            margin: '10px 0 0 0',
            borderTop: '1px solid #1E293B',
            paddingTop: '8px'
          }}>
            <strong>Clinical Guardrail:</strong> Visual attention exercises encourage active scanning and engagement. 
            They are strictly non-diagnostic and do not measure true ophthalmological peripheral fields. 
            A lower score may simply reflect room lighting, posture, eye dryness, or normal evening fatigue—never interpret as cognitive decline.
          </p>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes pulseGaze {
          0% { transform: scale(0.96); box-shadow: 0 0 25px rgba(245, 158, 11, 0.4); }
          100% { transform: scale(1.05); box-shadow: 0 0 45px rgba(245, 158, 11, 0.7); }
        }
        @keyframes gentlePop {
          0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
