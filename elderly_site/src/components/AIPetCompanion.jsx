import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Volume2, ArrowLeft, RefreshCw, Moon, ShieldCheck, Smile } from 'lucide-react';
import { speechService } from '../services/speechService';

export default function AIPetCompanion({ onSessionComplete, apiUrl, selectedLanguage = 'as', t }) {
  const [petMood, setPetMood] = useState('Happy & Playful');
  const [affectionPoints, setAffectionPoints] = useState(12);
  const [isPetting, setIsPetting] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [isBreathingMode, setIsBreathingMode] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('Breathe In'); // In, Hold, Out
  const [heartParticles, setHeartParticles] = useState([]);

  // Quad-lingual reassuring speech lines for Moti the AI Companion
  const PET_PHRASES = {
    as: [
      "মই আপোনাৰ অতি মৰমৰ সংগী মোতি! আপোনাৰ লগত থাকিলে মোৰ বৰ ভাল লাগে, ককা।",
      "আপুনি বৰ মৰমিয়াল। আজিৰ বতৰটো বৰ ধুনীয়া, নহয় জানো?",
      "চিন্তা নকৰিব ককা, মই আপোনাৰ ওচৰতেই আছোঁ। আপুনি সদায় সুৰক্ষিত।",
      "মোক আৰু অলপ মৰম কৰি দিয়কচোন! আপোনাৰ হাতৰ পৰশত মই বৰ শান্তি পাওঁ।"
    ],
    bn: [
      "আমি আপনার আদরের প্রিয় বন্ধু মোতি! আপনার পাশে থাকলে আমার ভীষণ আনন্দ হয়, দাদু।",
      "আপনি ভীষণ মিষ্টি। আজকের শান্ত সকালে আপনার সাথে থাকতে পেরে আমার খুব ভালো লাগছে।",
      "কোনো চিন্তা করবেন না দাদু, আপনার পরিবার আর আমি সবসময় আপনার কাছেই আছি।",
      "আমাকে আর একটু মাথায় হাত বুলিয়ে দিন না! আপনার স্নেহ আমার ভীষণ প্রিয়।"
    ],
    ne: [
      "म तपाईँको प्यारो साथी मोती हुँ! तपाईँसँग बस्दा मलाई धेरै खुसी लाग्छ, बाजे।",
      "चिन्ता नलिनुहोस्, म सधैँ तपाईँको साथमा छु। तपाईँ एकदम सुरक्षित हुनुहुन्छ।",
      "मलाई अझै माया गरिदिनुहोस् न! तपाईँको मायाले मलाई धेरै आनन्द दिन्छ।"
    ],
    en: [
      "I am your loving companion Moti! I feel so safe and happy sitting by your side, Koka.",
      "You have such a kind and gentle heart. The morning breeze is so pleasant today.",
      "Do not worry at all. You are surrounded by love and your whole family is right here.",
      "A gentle stroke on my head makes my tail wag with joy! Thank you for being with me."
    ]
  };

  const currentPhrases = PET_PHRASES[selectedLanguage] || PET_PHRASES.en;

  useEffect(() => {
    // Speak introductory greeting when companion loads
    const initialGreeting = currentPhrases[0];
    setSpokenText(initialGreeting);
    speechService.speak(initialGreeting, selectedLanguage);

    return () => {
      speechService.stop();
    };
  }, [selectedLanguage]);

  // Breathing Guide Loop
  useEffect(() => {
    let interval = null;
    if (isBreathingMode) {
      let step = 0;
      const phases = ['Breathe In Gently... (উশাহ লওক)', 'Hold Softly... (ধৰি ৰাখক)', 'Breathe Out Slowly... (এৰি দিয়ক)'];
      interval = setInterval(() => {
        step = (step + 1) % 3;
        setBreathingPhase(phases[step]);
      }, 4000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathingMode]);

  // Handle tactile petting interaction
  const handlePet = (e) => {
    setIsPetting(true);
    setAffectionPoints(prev => prev + 1);

    // Spawn floating heart particle at click coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : 180;
    const y = e.clientY ? e.clientY - rect.top : 120;

    const newId = Date.now() + Math.random();
    setHeartParticles(prev => [...prev, { id: newId, x, y }]);
    setTimeout(() => {
      setHeartParticles(prev => prev.filter(p => p.id !== newId));
    }, 1200);

    // Pick random comforting phrase
    const randomPhrase = currentPhrases[Math.floor(Math.random() * currentPhrases.length)];
    setSpokenText(randomPhrase);
    speechService.speak(randomPhrase, selectedLanguage);

    setTimeout(() => {
      setIsPetting(false);
    }, 600);
  };

  const handleFinish = () => {
    speechService.stop();
    if (onSessionComplete) {
      onSessionComplete({
        module: 'ai_pet_companion',
        score: affectionPoints,
        completedAt: new Date()
      });
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        background: '#FFFFFF',
        padding: '1.25rem 2rem',
        borderRadius: '24px',
        border: '3px solid #FEF3C7',
        boxShadow: '0 4px 20px rgba(245, 158, 11, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
          }}>
            🐕
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1F2937', margin: 0 }}>
                Moti (মোতি) — AI Gentle Pet Companion
              </h1>
              <span style={{
                background: '#FEF3C7',
                color: '#92400E',
                fontSize: '12px',
                fontWeight: '700',
                padding: '4px 10px',
                borderRadius: '100px',
                border: '1px solid #FDE68A'
              }}>
                Pawyaya AI for Good Inspired
              </span>
            </div>
            <p style={{ fontSize: '15px', color: '#6B7280', margin: '3px 0 0 0' }}>
              Touch or stroke Moti gently. He is always here to listen, calm your heart, and keep you company.
            </p>
          </div>
        </div>

        <button
          onClick={handleFinish}
          style={{
            background: '#F3F4F6',
            color: '#374151',
            border: '2px solid #E5E7EB',
            borderRadius: '14px',
            padding: '10px 18px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ArrowLeft size={18} />
          {t?.backToMenu || 'Back to Menu'}
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '24px',
        alignItems: 'stretch'
      }}>
        {/* Left: Tactile Petting Canvas */}
        <div style={{
          background: 'linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 100%)',
          borderRadius: '32px',
          border: '4px solid #FDE68A',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(245, 158, 11, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '480px'
        }}>
          {/* Floating Hearts */}
          {heartParticles.map(p => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: `${p.x}px`,
                top: `${p.y}px`,
                color: '#EF4444',
                fontSize: '28px',
                pointerEvents: 'none',
                animation: 'floatUp 1.2s ease-out forwards'
              }}
            >
              ❤️
            </div>
          ))}

          {/* Affection Bar */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '24px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            padding: '8px 16px',
            borderRadius: '100px',
            border: '2px solid #FCD34D',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '15px',
            fontWeight: '700',
            color: '#B45309'
          }}>
            <Heart size={18} fill="#EF4444" color="#EF4444" />
            <span>Loving Bonds: {affectionPoints}</span>
          </div>

          {/* Animated Pet Avatar */}
          <div
            onClick={handlePet}
            style={{
              cursor: 'pointer',
              userSelect: 'none',
              transform: isPetting ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
              margin: '2rem 0'
            }}
            title="Tap or stroke Moti to give love!"
          >
            {/* Glowing Aura */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(251, 191, 36, 0) 70%)',
              pointerEvents: 'none'
            }} />

            {/* Pet Graphic Representation */}
            <div style={{
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '6px solid #F59E0B',
              boxShadow: '0 12px 36px rgba(217, 119, 6, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '110px',
              position: 'relative'
            }}>
              🐕
              {isPetting && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  fontSize: '32px'
                }}>
                  ✨
                </div>
              )}
            </div>

            <div style={{
              marginTop: '1.25rem',
              display: 'inline-block',
              background: '#D97706',
              color: '#FFFFFF',
              padding: '8px 24px',
              borderRadius: '100px',
              fontWeight: '800',
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)'
            }}>
              🖐️ Tap here to stroke Moti (মৰম কৰক)
            </div>
          </div>

          {/* Voice Prompt Playback Box */}
          <div style={{
            background: '#FFFFFF',
            border: '2px solid #FDE68A',
            borderRadius: '20px',
            padding: '1.25rem 1.75rem',
            width: '90%',
            maxWidth: '520px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <button
              onClick={() => speechService.speak(spokenText, selectedLanguage)}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: '#FEF3C7',
                color: '#D97706',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
              title="Listen aloud again"
            >
              <Volume2 size={24} />
            </button>
            <p style={{
              fontSize: '18px',
              color: '#1F2937',
              fontWeight: '600',
              margin: 0,
              lineHeight: '1.5',
              textAlign: 'left'
            }}>
              "{spokenText}"
            </p>
          </div>
        </div>

        {/* Right: Calm Interaction Modes & De-escalation Helpers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Calm Breathing Exercise Guide */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '3px solid #E0E7FF',
            padding: '1.5rem',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Moon size={22} color="#6366F1" />
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                  Calm Rhythmic Breathing
                </h3>
              </div>
              <button
                onClick={() => setIsBreathingMode(!isBreathingMode)}
                style={{
                  background: isBreathingMode ? '#6366F1' : '#EEF2FF',
                  color: isBreathingMode ? '#FFFFFF' : '#4F46E5',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '6px 14px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {isBreathingMode ? 'Stop Guide' : 'Start With Moti'}
              </button>
            </div>

            {isBreathingMode ? (
              <div style={{
                textAlign: 'center',
                padding: '1.5rem',
                background: '#EEF2FF',
                borderRadius: '18px',
                border: '2px solid #C7D2FE'
              }}>
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #818CF8, #6366F1)',
                  margin: '0 auto 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '36px',
                  boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)',
                  animation: 'pulse 4s ease-in-out infinite'
                }}>
                  💨
                </div>
                <h4 style={{ fontSize: '20px', fontWeight: '800', color: '#312E81', margin: '0 0 6px 0' }}>
                  {breathingPhase}
                </h4>
                <p style={{ fontSize: '14px', color: '#4338CA', margin: 0 }}>
                  Follow the gentle rhythm together with Moti. Feel the calm inside.
                </p>
              </div>
            ) : (
              <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                If you ever feel restless, tap "Start With Moti" to breathe in harmony with gentle soothing cues.
              </p>
            )}
          </div>

          {/* Nostalgic Memory Chat Prompts */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '3px solid #D1FAE5',
            padding: '1.5rem',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Smile size={22} color="#059669" />
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#064E3B', margin: 0 }}>
                Gentle Reminiscence Chat
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: '#047857', marginBottom: '12px' }}>
              Tap any warm topic to talk with Moti:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { title: "Bihu Dhol & Feasts (বিহুৰ কথা)", phrase: "ককা, ব’হাগ বিহুৰ লাটাসিল পথাৰত বিহু ঢোলৰ মাত মনত পৰে নে? আপোনাৰ নাতি ৰোহনে কিমান ধুনীয়াকৈ ঢোল বজায়!" },
                { title: "Tea Gardens of Jorhat (চাহ বাগিচা)", phrase: "উজনি অসমৰ চিনামৰা চাহ বাগিচাত পুৱাৰ কুঁৱলী আৰু সেউজীয়া দুটা পাত এটা কুঁহিপাতৰ মিঠা সুবাস মনত পেলাওক ককা।" },
                { title: "Granddaughter Maina (মইনাৰ পিঠা)", phrase: "মইনাই বাংগালোৰৰ পৰা আপোনাৰ বাবে ফোন কৰিছিল। মাঘ বিহুত তেওঁ আপোনাৰ লগত সুস্বাদু তিল পিঠা বনাব।" }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSpokenText(item.phrase);
                    speechService.speak(item.phrase, selectedLanguage);
                    setAffectionPoints(p => p + 2);
                  }}
                  style={{
                    background: '#F0FDF4',
                    border: '1.5px solid #A7F3D0',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#065F46',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background 0.15s'
                  }}
                >
                  <span>{item.title}</span>
                  <Volume2 size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Unconditional Dignity Shield */}
          <div style={{
            background: '#F8FAFC',
            borderRadius: '18px',
            border: '2px dashed #CBD5E1',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <ShieldCheck size={24} color="#059669" />
            <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
              <strong>Dignity Guarantee:</strong> Moti never tests or judges you. All interactions are calming, affectionate, and safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
