import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, HelpCircle, RotateCcw, CheckCircle2, Music, Heart } from 'lucide-react';
import { speechService } from '../services/speechService';

// Procedural Web Audio Synthesizer (Zero External MP3s Needed, 100% Offline)
function playProceduralSound(type) {
  if (typeof window === 'undefined') return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();

  if (type === 'bell') {
    // Temple / Naamghar Bell: Pure harmonic chime with long decay
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1174.66, ctx.currentTime); // D6 Harmonic

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 3.0);
    osc2.stop(ctx.currentTime + 3.0);
  } else if (type === 'rain') {
    // Rain on tin roof: Filtered noise bursts
    const bufferSize = ctx.sampleRate * 2.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.Q.setValueAtTime(3.0, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 2.5);
  } else if (type === 'train') {
    // Steam train whistle: Two harmonized high sine waves
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(440, ctx.currentTime);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(554.37, ctx.currentTime); // C#5

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 2.2);
    osc2.stop(ctx.currentTime + 2.2);
  } else if (type === 'cuckoo') {
    // Cuckoo bird call: Two calm descending notes (High then Low)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    osc.frequency.setValueAtTime(523.25, ctx.currentTime + 0.3); // C5

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.9);
  }
}

const SOUND_QUESTS = [
  {
    id: 'quest_bell',
    soundType: 'bell',
    question: {
      as: 'এই পৱিত্ৰ ধ্বনিটো কাৰ বাবে বজা যেন লাগে?',
      bn: 'এই পবিত্র সুরটি কিসের কথা মনে করিয়ে দেয়?',
      ne: 'यो पवित्र ध्वनि के को सम्झना दिलाउँछ?',
      hi: 'यह पावन ध्वनि किस स्थान की याद दिलाती है?',
      en: 'What does this sacred resonance bring to heart?'
    },
    correctId: 'naamghar',
    choices: [
      { id: 'naamghar', icon: '🛕', label: { as: 'নামঘৰ বা মন্দিৰৰ কাঁহ-ঘণ্টা', hi: 'नामघर अथवा मंदिर का घंटा', en: 'Temple & Naamghar Bell' } },
      { id: 'car', icon: '🚗', label: { as: 'মটৰ গাড়ীৰ হৰ্ণ', hi: 'गाड़ी का हॉर्न', en: 'Automobile Horn' } },
      { id: 'whistle', icon: '⚽', label: { as: 'খেলপথাৰৰ হুইছেল', hi: 'सीटी की आवाज़', en: 'Sports Whistle' } }
    ]
  },
  {
    id: 'quest_rain',
    soundType: 'rain',
    question: {
      as: 'টিনৰ চালত টুপ-টুপ কৰি পৰা এই শব্দটো কিহৰ?',
      bn: 'টিনের চালে টুপটুপ করে পড়ার এই শব্দটি কিসের?',
      ne: 'टिनको छानामा खसेको यो आवाज के को हो?',
      hi: 'टिन की छत पर टप-टप गिरती यह ध्वनि किसकी है?',
      en: 'What is this rhythmic patter on the roof?'
    },
    correctId: 'rain',
    choices: [
      { id: 'rain', icon: '🌧️', label: { as: 'বৰষুণৰ টোপাল (Monsoon Rain)', hi: 'मानसून की बारिश (Raindrops)', en: 'Gentle Monsoon Rain' } },
      { id: 'drum', icon: '🥁', label: { as: 'বিহু ঢোল (Dhol Drum)', hi: 'बिहू ढोल (Drum)', en: 'Festival Drum' } },
      { id: 'leaves', icon: '🍂', label: { as: 'শুকান পাত সৰা (Falling Leaves)', hi: 'सूखे पत्ते', en: 'Dry Leaves' } }
    ]
  },
  {
    id: 'quest_train',
    soundType: 'train',
    question: {
      as: 'দূৰৰ চাহ বাগিচাৰ মাজেৰে যোৱা এই উকিটো কাৰ?',
      bn: 'চা বাগানের মাঝ দিয়ে যাওয়া এই বাঁশিটি কিসের?',
      ne: 'चिया बगान हुँदै जाने यो सिट्ठी के को हो?',
      hi: 'दूर चाय बागानों से आती यह सीटी किसकी है?',
      en: 'What makes this distant whistle across the hills?'
    },
    correctId: 'train',
    choices: [
      { id: 'train', icon: '🚂', label: { as: 'চাহ বাগিচাৰ পুৰণি ৰে’ল (Steam Train)', hi: 'चाय बागान की रेलगाड़ी (Train)', en: 'Heritage Steam Train' } },
      { id: 'boat', icon: '⛵', label: { as: 'ব্ৰহ্মপুত্ৰৰ নাও (River Ferry)', hi: 'नदी की नाव (Boat)', en: 'River Ferry' } },
      { id: 'bird', icon: '🦅', label: { as: 'আকাশৰ চিলনী (Kite Bird)', hi: 'पक्षी की आवाज़', en: 'Soaring Bird' } }
    ]
  }
];

export default function SoundMemoryQuestGame({ onSessionComplete, selectedLanguage = 'as', t }) {
  const [questIndex, setQuestIndex] = useState(0);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [success, setSuccess] = useState(false);

  const quest = SOUND_QUESTS[questIndex];
  const questionText = quest.question[selectedLanguage] || quest.question.en;

  const handlePlaySound = () => {
    setIsPlayingSound(true);
    playProceduralSound(quest.soundType);
    setTimeout(() => setIsPlayingSound(false), 2600);
  };

  const handleSelect = (choice) => {
    setSelectedChoice(choice.id);
    if (choice.id === quest.correctId) {
      setSuccess(true);
      const affirm = selectedLanguage === 'as' 
        ? 'বৰ সুন্দৰ সোঁৱৰণি! আপোনাৰ মনত পৰিল।' 
        : 'Wonderful ear! That brought back the melody.';
      speechService.speak(affirm, selectedLanguage);

      setTimeout(() => {
        if (questIndex < SOUND_QUESTS.length - 1) {
          setQuestIndex(prev => prev + 1);
          setSelectedChoice(null);
          setSuccess(false);
        } else {
          if (onSessionComplete) {
            onSessionComplete({
              activityType: 'sound_memory_quest',
              activityTitle: 'Sound-to-Memory Auditory Reminiscence',
              completionStatus: 'completed'
            });
          }
        }
      }, 2400);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '2rem 2.5rem',
        border: '2px solid #E2E8F0',
        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        textAlign: 'center'
      }}>
        <span style={{
          background: '#EEF2FF',
          color: '#4F46E5',
          padding: '4px 14px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: 700
        }}>
          Sound-to-Memory Quest • সুৰ আৰু স্মৃতি
        </span>

        <h2 style={{ fontSize: '30px', fontWeight: 800, margin: '14px 0 8px 0', color: '#1E293B' }}>
          {questionText}
        </h2>
        <p style={{ fontSize: '18px', color: '#64748B', marginBottom: '2rem' }}>
          {selectedLanguage === 'as' ? 'সুৰটো শুনক আৰু চিনাকি ছবিখন বাছক:' : 'Listen to the familiar sound and choose what it brings to heart:'}
        </p>

        {/* Big Audio Play Button */}
        <div style={{ margin: '0 auto 2.5rem' }}>
          <button
            type="button"
            onClick={handlePlaySound}
            style={{
              background: isPlayingSound ? '#DC2626' : 'linear-gradient(135deg, #0284C7, #0369A1)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              width: '120px',
              height: '120px',
              fontSize: '48px',
              cursor: 'pointer',
              boxShadow: isPlayingSound ? '0 0 30px rgba(220, 38, 38, 0.6)' : '0 10px 24px rgba(2, 132, 199, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            title="Tap to listen to sound"
          >
            {isPlayingSound ? <VolumeX size={52} /> : <Volume2 size={52} />}
          </button>
          <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 700, color: '#0369A1' }}>
            {isPlayingSound ? (selectedLanguage === 'as' ? 'সুৰ বাজি আছে...' : 'Listening...') : (selectedLanguage === 'as' ? 'সুৰটো শুনক (Tap to Listen)' : 'Tap to Listen Sound')}
          </div>
        </div>

        {/* Choice Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {quest.choices.map(choice => {
            const isSelected = selectedChoice === choice.id;
            const choiceLabel = choice.label[selectedLanguage] || choice.label.en;
            return (
              <button
                key={choice.id}
                type="button"
                onClick={() => handleSelect(choice)}
                style={{
                  background: isSelected ? '#F0FDF4' : '#F8FAFC',
                  border: isSelected ? '3px solid #16A34A' : '2px solid #CBD5E1',
                  borderRadius: '20px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: '48px' }}>{choice.icon}</span>
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>{choiceLabel}</span>
              </button>
            );
          })}
        </div>

        {success && (
          <div style={{
            marginTop: '2rem',
            background: '#DCFCE7',
            border: '2px solid #86EFAC',
            borderRadius: '16px',
            padding: '16px',
            color: '#166534',
            fontSize: '20px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <Sparkles size={24} />
            <span>{selectedLanguage === 'as' ? 'অপূৰ্ব সোঁৱৰণি! আপুনি চিনি পালে।' : 'Wonderful recall! The melody is recognized.'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
