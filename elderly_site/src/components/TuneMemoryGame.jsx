import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, RotateCcw, Home, Play, HelpCircle, ShieldCheck, Music, Sliders } from 'lucide-react';
import { speechService } from '../services/speechService';

// Audio Instruments & Acoustic Profiles synthesized procedurally via Web Audio API
const SOUND_ITEMS = {
  temple_bell: {
    id: 'temple_bell',
    name: { en: 'Temple Bell', as: 'মন্দিৰৰ কাঁহ-ঘণ্টা', hi: 'मंदिर का घंटा', bn: 'মন্দিরের কাঁসর-ঘণ্টা', ne: 'मन्दिरको घण्टी' },
    icon: '🔔',
    freq: 587.33, // D5
    type: 'sine',
    decay: 1.8,
    visualColor: '#F59E0B'
  },
  bihu_dhol: {
    id: 'bihu_dhol',
    name: { en: 'Bihu Dhol (Drum)', as: 'বিহু ঢোল', hi: 'बीहू ढोल', bn: 'বিহু ঢোল', ne: 'बिहु ढोल' },
    icon: '🥁',
    freq: 110, // A2 low drum thump
    type: 'triangle',
    decay: 0.8,
    visualColor: '#DC2626'
  },
  bamboo_flute: {
    id: 'bamboo_flute',
    name: { en: 'Bamboo Flute', as: 'বাঁহৰ বাঁহী', hi: 'बांसुरी', bn: 'বাঁশের বাঁশি', ne: 'बाँसुरी' },
    icon: '🪈',
    freq: 440, // A4 lyrical flute
    type: 'sine',
    decay: 1.4,
    visualColor: '#10B981'
  },
  monsoon_rain: {
    id: 'monsoon_rain',
    name: { en: 'Monsoon Rain on Roof', as: 'টিনৰ চালত বৰষুণৰ টোপাল', hi: 'छत पर बारिश', bn: 'টিনের চালে বৃষ্টির শব্দ', ne: 'टिनको छानामा वर्षा' },
    icon: '🌧️',
    freq: 280,
    isNoise: true,
    decay: 1.6,
    visualColor: '#0284C7'
  },
  forest_cuckoo: {
    id: 'forest_cuckoo',
    name: { en: 'Forest Cuckoo Bird', as: 'কুলি চৰাইৰ মাত', hi: 'कोयल की कूक', bn: 'কোকিলের ডাক', ne: 'कोइलीको आवाज' },
    icon: '🐦',
    freq: 698.46, // F5
    type: 'sine',
    isCuckoo: true,
    decay: 1.2,
    visualColor: '#8B5CF6'
  },
  tea_kettle: {
    id: 'tea_kettle',
    name: { en: 'Tea Kettle Whistle', as: 'কেটলীৰ সুহুৰি', hi: 'केतली की सीटी', bn: 'কেটলির মৃদু শব্দ', ne: 'कित्लीको सिठी' },
    icon: '🫖',
    freq: 880, // A5 whistle
    type: 'sine',
    decay: 1.5,
    visualColor: '#D97706'
  }
};

const SOUND_LIST = Object.values(SOUND_ITEMS);

export default function TuneMemoryGame({ onSessionComplete, selectedLanguage = 'as', t }) {
  const [mode, setMode] = useState('single'); // 'single' (Identify Sound) or 'sequence' (Recall Melodic Order)
  const [volume, setVolume] = useState(0.8);
  const [audioDisabled, setAudioDisabled] = useState(false); // Visual Alternative Mode
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [targetSound, setTargetSound] = useState(SOUND_LIST[0]);
  const [targetSequence, setTargetSequence] = useState([]); // Array of sound objects
  const [userSequenceIndex, setUserSequenceIndex] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [celebration, setCelebration] = useState(false);
  const [visualWaveActive, setVisualWaveActive] = useState(null); // ID of currently active sound wave
  const [showCaregiverNotes, setShowCaregiverNotes] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  const audioCtxRef = useRef(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Procedural Sound Generator (100% offline, zero missing files)
  const playSynthesizedSound = (soundObj, durationMultiplier = 1) => {
    // Show visual animation regardless of audio muted status
    setVisualWaveActive(soundObj.id);
    setTimeout(() => setVisualWaveActive(null), 1200);

    if (audioDisabled) return; // Silent visual alternative

    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(volume * 0.4, now);

      if (soundObj.isNoise) {
        // Synthesize soft filtered monsoon rain
        const bufferSize = ctx.sampleRate * 1.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.2;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);

        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + (soundObj.decay * durationMultiplier));
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start(now);
        noise.stop(now + (soundObj.decay * durationMultiplier));
      } else if (soundObj.isCuckoo) {
        // Synthesize two-tone melodic cuckoo call (High F5 -> Low D5)
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(783.99, now); // G5
        osc.frequency.setValueAtTime(659.25, now + 0.3); // E5
        gainNode.gain.setValueAtTime(volume * 0.35, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.2);
      } else {
        // Standard harmonic instrument tone
        const osc = ctx.createOscillator();
        osc.type = soundObj.type || 'sine';
        osc.frequency.setValueAtTime(soundObj.freq, now);

        if (soundObj.id === 'bihu_dhol') {
          // Add quick pitch drop for percussive drum thump
          osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);
        }

        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + (soundObj.decay * durationMultiplier));
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + (soundObj.decay * durationMultiplier));
      }
    } catch (e) {
      console.warn('[TuneMemory] Audio synthesis notice:', e.message);
    }
  };

  // Play the entire target sequence
  const playTargetAudio = () => {
    setIsPlayingAudio(true);
    if (mode === 'single') {
      playSynthesizedSound(targetSound);
      setTimeout(() => setIsPlayingAudio(false), targetSound.decay * 1000 + 300);
    } else {
      // Sequence playback with gentle gaps
      let delay = 0;
      targetSequence.forEach((snd, i) => {
        setTimeout(() => {
          playSynthesizedSound(snd);
          if (i === targetSequence.length - 1) {
            setTimeout(() => setIsPlayingAudio(false), snd.decay * 1000 + 400);
          }
        }, delay);
        delay += (snd.decay * 1000) + 400;
      });
    }
  };

  // Start new round
  const startNewRound = (newMode = mode) => {
    setCelebration(false);
    setUserSequenceIndex(0);
    setFeedbackText('');

    if (newMode === 'single') {
      const randomSound = SOUND_LIST[Math.floor(Math.random() * SOUND_LIST.length)];
      setTargetSound(randomSound);
      setTimeout(() => {
        playSynthesizedSound(randomSound);
      }, 500);
    } else {
      // 2-step sequence for gentle comfort
      const seq = [
        SOUND_LIST[Math.floor(Math.random() * SOUND_LIST.length)],
        SOUND_LIST[Math.floor(Math.random() * SOUND_LIST.length)]
      ];
      setTargetSequence(seq);
      setTimeout(() => {
        let delay = 0;
        seq.forEach((snd, i) => {
          setTimeout(() => {
            playSynthesizedSound(snd);
          }, delay);
          delay += (snd.decay * 1000) + 400;
        });
      }, 500);
    }
  };

  useEffect(() => {
    startNewRound(mode);
  }, [mode]);

  const speakPrompt = () => {
    const text = selectedLanguage === 'as'
      ? (mode === 'single' ? 'সুৰটো মন দি শুনক আৰু কোনটো বাদ্যৰ সুৰ চিনাক্ত কৰক।' : 'সুৰৰ ক্ৰমটো মন দি শুনক আৰু একে ক্ৰমত স্পৰ্শ কৰক।')
      : (mode === 'single' ? 'Listen gently to the sound, then tap the matching instrument or nature card.' : 'Listen to the musical sequence and tap the instruments in the same order.');
    speechService.speak(text, selectedLanguage);
  };

  const handleCardSelection = (soundObj) => {
    // Play preview sound on tap
    playSynthesizedSound(soundObj);

    if (mode === 'single') {
      if (soundObj.id === targetSound.id) {
        setCelebration(true);
        setRoundsCompleted(prev => prev + 1);
        const praise = selectedLanguage === 'as'
          ? `সুন্দৰ শ্ৰৱণ! ই আছিল ${soundObj.name?.as || 'বাদ্য'}।`
          : `Splendid listening! That was the ${soundObj.name?.en || 'instrument'}.`;
        setFeedbackText(praise);
        speechService.speak(praise, selectedLanguage);

        setTimeout(() => {
          startNewRound('single');
        }, 2200);
      } else {
        const gentleNote = selectedLanguage === 'as'
          ? `ই আছিল ${soundObj.name?.as}। পুনৰ শুনিবলৈ 'পুনৰ শুনক' বুটামত স্পৰ্শ কৰক।`
          : `That was the ${soundObj.name?.en}. Tap Replay to listen again at your own pace.`;
        setFeedbackText(gentleNote);
        speechService.speak(gentleNote, selectedLanguage);
      }
    } else {
      // Sequence recall check
      const expectedSound = targetSequence[userSequenceIndex];
      if (soundObj.id === expectedSound.id) {
        const nextIdx = userSequenceIndex + 1;
        setUserSequenceIndex(nextIdx);

        if (nextIdx >= targetSequence.length) {
          // Completed full sequence!
          setCelebration(true);
          setRoundsCompleted(prev => prev + 1);
          const praise = selectedLanguage === 'as'
            ? 'অপূৰ্ব! আপুনি দুয়োটা সুৰ সঠিক ক্ৰমত মনত ৰাখিলে।'
            : 'Wonderful! You remembered the musical sequence perfectly.';
          setFeedbackText(praise);
          speechService.speak(praise, selectedLanguage);

          setTimeout(() => {
            startNewRound('sequence');
          }, 2400);
        } else {
          setFeedbackText(selectedLanguage === 'as' ? 'প্ৰথম সুৰ মিলিল! এতিয়া দ্বিতীয়টো স্পৰ্শ কৰক।' : 'First note matched! Now tap the second.');
        }
      } else {
        // Gentle sequence restart
        setUserSequenceIndex(0);
        const retryNote = selectedLanguage === 'as'
          ? 'শান্তভাৱে আকৌ প্ৰথম সুৰটোৰ পৰা আৰম্ভ কৰোঁ।'
          : "Let's restart from the first note peacefully. You can replay the tune anytime.";
        setFeedbackText(retryNote);
        speechService.speak(retryNote, selectedLanguage);
      }
    }
  };

  const handleCompleteSession = (status = 'completed') => {
    const duration = Math.round((Date.now() - sessionStartTime) / 1000);
    onSessionComplete?.({
      activityType: 'tune_memory',
      activityTitle: 'Tune Memory — Melodic Recall',
      durationSeconds: duration,
      difficulty: mode,
      itemsEngaged: roundsCompleted,
      completionStatus: status,
      supportiveFeedback: 'Peaceful Auditory Engagement'
    });
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      {/* Top Header Bar */}
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
                background: '#FDF2F8',
                color: '#BE185D',
                padding: '3px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800
              }}>
                EXCLUSIVE • AUDITORY ATTENTION & SEQUENCING
              </span>
              <span style={{ fontSize: '13px', color: '#059669', fontWeight: 700 }}>
                ● 100% Offline Synthesis
              </span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '4px 0 0 0' }}>
              {selectedLanguage === 'as' ? 'সুৰ স্মৃতি (Tune Memory)' :
               selectedLanguage === 'hi' ? 'धुन स्मृति (Tune Memory)' :
               'Tune Memory — Melodic Recall'}
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
            <span>{selectedLanguage === 'as' ? 'নিৰ্দেশনা শুনক' : 'Hear Rules'}</span>
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

      {/* Control Banner: Mode Selection, Volume, and Visual Alternative */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '1rem 1.5rem',
        border: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Game Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#475569' }}>Activity:</span>
          {[
            { id: 'single', label: selectedLanguage === 'as' ? '১: সুৰ চিনাক্তকৰণ' : '1: Sound ID' },
            { id: 'sequence', label: selectedLanguage === 'as' ? '২: সুৰৰ ক্ৰম (Sequence)' : '2: Melodic Sequence' }
          ].map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                background: mode === m.id ? '#DB2777' : '#F1F5F9',
                color: mode === m.id ? '#FFFFFF' : '#334155',
                border: mode === m.id ? '2px solid #BE185D' : '1px solid #CBD5E1'
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Audio Controls & Visual Alternative Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Visual Alternative Toggle (for hearing impaired or quiet environments) */}
          <button
            type="button"
            onClick={() => setAudioDisabled(prev => !prev)}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              background: audioDisabled ? '#F59E0B' : '#F8FAFC',
              color: audioDisabled ? '#000000' : '#475569',
              border: audioDisabled ? '2px solid #D97706' : '1px solid #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {audioDisabled ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span>{audioDisabled ? 'Visual Waves Mode Active' : 'Sound Enabled'}</span>
          </button>

          {/* Volume Slider */}
          {!audioDisabled && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Volume2 size={16} color="#64748B" />
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                style={{ width: '80px', cursor: 'pointer' }}
                title="Adjust Volume"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Soundstage Arena: Replay Beacon & Animated Soundwave */}
      <div style={{
        background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 45%, #FDF2F8 100%)',
        borderRadius: '24px',
        padding: '2.5rem',
        border: '3px solid #FBCFE8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {/* Animated Sound Waveform Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          height: '60px',
          marginBottom: '1.25rem'
        }}>
          {[40, 70, 100, 60, 90, 50, 80, 45].map((h, i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: isPlayingAudio ? `${h}%` : '20%',
                background: isPlayingAudio ? '#DB2777' : '#F472B6',
                borderRadius: '6px',
                transition: 'height 0.15s ease',
                animation: isPlayingAudio ? `waveDance ${0.4 + (i * 0.1)}s infinite alternate ease-in-out` : 'none'
              }}
            />
          ))}
        </div>

        {/* Big Replay Sound Button */}
        <button
          type="button"
          onClick={playTargetAudio}
          style={{
            padding: '16px 32px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #DB2777, #BE185D)',
            color: '#FFFFFF',
            fontSize: '20px',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 25px rgba(219, 39, 119, 0.35)',
            transform: isPlayingAudio ? 'scale(1.04)' : 'scale(1)',
            transition: 'all 0.2s ease'
          }}
        >
          <Play size={24} fill="#FFFFFF" />
          <span>
            {mode === 'single'
              ? (selectedLanguage === 'as' ? '▶ সুৰটো পুনৰ শুনক (Replay Sound)' : '▶ Replay Sound')
              : (selectedLanguage === 'as' ? '▶ সুৰৰ ক্ৰম শুনক (Replay Melody)' : '▶ Replay Melody Sequence')}
          </span>
        </button>

        <p style={{ fontSize: '14px', color: '#9D174D', marginTop: '10px', fontWeight: 600 }}>
          {selectedLanguage === 'as' ? 'যতবাৰ ইচ্ছা ততবাৰ শুনক, কোনো খৰখেদা নাই।' : 'Replay as many times as you like. There is zero rush.'}
        </p>

        {/* Feedback / Encouragement bar */}
        {feedbackText && (
          <div style={{
            marginTop: '1.25rem',
            padding: '10px 20px',
            borderRadius: '12px',
            background: celebration ? '#DCFCE7' : '#FFFFFF',
            color: celebration ? '#166534' : '#9D174D',
            fontSize: '16px',
            fontWeight: 700,
            border: celebration ? '2px solid #86EFAC' : '1px solid #FBCFE8',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={18} />
            <span>{feedbackText}</span>
          </div>
        )}
      </div>

      {/* Choice Instrument Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '14px'
      }}>
        {SOUND_LIST.map((snd) => {
          const isWaveActive = visualWaveActive === snd.id;

          return (
            <button
              key={snd.id}
              type="button"
              onClick={() => handleCardSelection(snd)}
              style={{
                background: isWaveActive ? '#FCE7F3' : '#FFFFFF',
                borderRadius: '18px',
                padding: '1.25rem 1rem',
                border: isWaveActive ? '3px solid #DB2777' : '2px solid #CBD5E1',
                boxShadow: isWaveActive ? '0 0 20px rgba(219, 39, 119, 0.35)' : '0 2px 8px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.18s ease'
              }}
            >
              <span style={{ fontSize: '42px', lineHeight: 1 }}>{snd.icon}</span>
              <span style={{
                fontSize: '14px',
                fontWeight: 800,
                color: isWaveActive ? '#BE185D' : '#1E293B',
                marginTop: '10px',
                textAlign: 'center'
              }}>
                {snd.name?.[selectedLanguage] || snd.name?.en}
              </span>
            </button>
          );
        })}
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
          <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0', color: '#F472B6' }}>
            Caregiver Notes — Tune Memory (Auditory Attention & Discrimination)
          </h4>
          <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5, margin: 0 }}>
            Auditory pathways often remain remarkably receptive in moderate dementia. 
            This exercise supports auditory discrimination and sequence recall using 100% offline Web Audio acoustic synthesis.
            <br />
            Rounds enjoyed: <strong>{roundsCompleted}</strong>. Current mode: <strong>{mode}</strong>.
            <br />
            <em>Clinical Guardrail: Recognizing a tune or missing a sound is non-diagnostic. Hearing sensitivity varies with ear canal comfort, ambient noise, and daily rest.</em>
          </p>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes waveDance {
          0% { height: 25%; }
          100% { height: 95%; }
        }
      `}</style>
    </div>
  );
}
