import React, { useState, useEffect } from 'react';
import {
  Heart,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  HelpCircle,
  RotateCcw,
  SkipForward,
  Pause,
  Home,
  CheckCircle2,
  Calendar,
  Compass,
  FileText,
  Eye,
  Hash,
  Wifi,
  WifiOff,
  Sun,
  Coffee,
  Smile,
  Star,
  Search,
  Music,
  CheckSquare,
  Layers,
  Activity
} from 'lucide-react';
import { speechService } from '../services/speechService';
import {
  generateDailyExperience,
  toggleRoutineCompletion,
  getLocalDateString
} from '../services/dailyChallengeEngine';
import {
  createQuestionInteractionSession,
  INTERACTION_STATES,
  evaluateAnswer
} from '../services/questionEngine';
import {
  GAME_REGISTRY,
  COGNITIVE_CATEGORIES,
  getGameById
} from '../services/gameRegistry';

export default function WelcomingDailyDashboard({
  profile,
  preferences,
  selectedLanguage = 'as',
  onSelectModule,
  onOpenAssessment,
  isOffline,
  t,
  apiUrl
}) {
  const honorific = profile?.honorific || '';
  const name = profile?.name || (selectedLanguage === 'hi' ? 'प्रिय मित्र' : selectedLanguage === 'bn' ? 'প্রিয় বন্ধু' : selectedLanguage === 'as' ? 'মৰমৰ বন্ধু' : 'Dear Friend');
  const firstName = name.split(' ')[0];

  // Daily Experience computation
  const [dailyExperience, setDailyExperience] = useState(() =>
    generateDailyExperience({
      elderId: profile?._id || 'elderly_bhaben_01',
      date: new Date(),
      language: selectedLanguage,
      preferences: preferences || {},
      completedToday: []
    })
  );

  // Daily Check-in state
  const [checkinAnswer, setCheckinAnswer] = useState(null);
  const [checkinMessage, setCheckinMessage] = useState(null);

  // Challenge modal / interactive session state
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const [challengeSession, setChallengeSession] = useState(null);
  const [sessionState, setSessionState] = useState(INTERACTION_STATES.READY);
  const [activeHint, setActiveHint] = useState('');
  const [challengeFeedback, setChallengeFeedback] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  // Audio speaking state
  const [isAudioSpeaking, setIsAudioSpeaking] = useState(false);

  // Accessibility States
  const [fontSizeMode, setFontSizeMode] = useState('large'); // 'standard' | 'large' | 'extra-large'
  const [highContrast, setHighContrast] = useState(false);

  // Routines local completion state
  const [routinesList, setRoutinesList] = useState(dailyExperience.routines || []);
  const [completedChallenges, setCompletedChallenges] = useState([]);

  // Cognitive Play Hub: Category Filter & User-Controlled Favorites
  const [selectedHubCategory, setSelectedHubCategory] = useState('all');
  const [userFavorites, setUserFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('smriti_favorite_games');
      return saved ? JSON.parse(saved) : ['family_recall', 'focus_finder', 'smriti_match_quest', 'tune_memory'];
    } catch (e) {
      return ['family_recall', 'focus_finder', 'smriti_match_quest', 'tune_memory'];
    }
  });

  const toggleFavorite = (modId, e) => {
    e.stopPropagation();
    setUserFavorites(prev => {
      const next = prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId];
      try {
        localStorage.setItem('smriti_favorite_games', JSON.stringify(next));
      } catch (err) {}
      return next;
    });
  };

  // Subscribe to speech service
  useEffect(() => {
    const unsub = speechService.subscribe(speaking => {
      setIsAudioSpeaking(speaking);
    });
    return () => {
      unsub();
      speechService.stop();
    };
  }, []);

  // Update daily experience if language or preferences change
  useEffect(() => {
    const exp = generateDailyExperience({
      elderId: profile?._id || 'elderly_bhaben_01',
      date: new Date(),
      language: selectedLanguage,
      preferences: preferences || {},
      completedToday: completedChallenges
    });
    setDailyExperience(exp);
    setRoutinesList(exp.routines || []);
  }, [selectedLanguage, preferences, profile, completedChallenges]);

  const dashT = t?.dashboard || {};
  const currentLangContent = dailyExperience.checkinQuestion?.localizedContent?.[selectedLanguage] ||
    dailyExperience.checkinQuestion?.localizedContent?.en || {};
  const challengeLangContent = dailyExperience.dailyChallenge?.localizedContent?.[selectedLanguage] ||
    dailyExperience.dailyChallenge?.localizedContent?.en || {};

  // Formatted date
  const today = new Date();
  const dateStr = today.toLocaleDateString(
    selectedLanguage === 'en' ? 'en-US' :
    selectedLanguage === 'bn' ? 'bn-IN' :
    selectedLanguage === 'ne' ? 'ne-NP' :
    selectedLanguage === 'hi' ? 'hi-IN' : 'as-IN',
    { weekday: 'long', month: 'long', day: 'numeric' }
  );

  // Handle Speech Readout for greeting
  const handleReadGreeting = () => {
    if (isAudioSpeaking) {
      speechService.stop();
    } else {
      const greetingText = `${t.greeting || 'Namaskar'}, ${firstName} ${honorific}! ${dashT.welcomeMessage || 'Welcome to your peaceful day.'}`;
      speechService.speak(greetingText, selectedLanguage);
    }
  };

  // Handle Mood Check-in
  const handleMoodSelect = (option) => {
    setCheckinAnswer(option.id);
    const evalRes = evaluateAnswer(dailyExperience.checkinQuestion, option.id);
    const feedbackText = evalRes.feedback?.[selectedLanguage] || evalRes.feedback?.en || dashT.checkinSubtitle;
    setCheckinMessage(feedbackText);
    speechService.speak(feedbackText, selectedLanguage);

    // Save check-in response locally
    try {
      const key = `smriti_mood_${dailyExperience.localDate}`;
      localStorage.setItem(key, JSON.stringify({
        optionId: option.id,
        label: option.label,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {}
  };

  // Toggle routine done
  const handleToggleRoutine = (routineId) => {
    const localDate = getLocalDateString();
    toggleRoutineCompletion(profile?._id || 'elderly_bhaben_01', localDate, routineId);
    setRoutinesList(prev => prev.map(r => r.id === routineId ? { ...r, completed: !r.completed } : r));
  };

  // Launch Challenge Modal
  const handleStartChallenge = () => {
    speechService.stop();
    const session = createQuestionInteractionSession({
      question: dailyExperience.dailyChallenge,
      language: selectedLanguage,
      onStateChange: (stateData) => {
        setSessionState(stateData.state);
        if (stateData.evaluation) {
          setChallengeFeedback(stateData.evaluation.feedback?.[selectedLanguage] || stateData.evaluation.feedback?.en);
        }
      },
      onComplete: (completionData) => {
        setCompletedChallenges(prev => [...prev, completionData.questionId]);
        setTimeout(() => {
          setIsChallengeOpen(false);
          setChallengeSession(null);
          setChallengeFeedback(null);
          setActiveHint('');
        }, 2200);

        // Record session to backend API if available
        if (apiUrl) {
          fetch(`${apiUrl}/api/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              activityType: dailyExperience.dailyChallenge.category,
              activityTitle: challengeLangContent.text || 'Daily Challenge',
              durationSeconds: 60,
              attempts: completionData.attempts || 1,
              hintsUsed: completionData.hintsUsed || 0,
              completionStatus: completionData.completionStatus || 'completed',
              responseMethod: 'choice',
              supportiveFeedback: 'Consistent Participation'
            })
          }).catch(err => console.warn('Offline session log stored locally:', err.message));
        }
      }
    });

    setChallengeSession(session);
    setIsChallengeOpen(true);
    setActiveHint('');
    setChallengeFeedback(null);
    session.displayQuestion();

    // Read question aloud calmly
    if (challengeLangContent.text) {
      speechService.speak(challengeLangContent.text, selectedLanguage);
    }
  };

  // STT Voice Answer Handler
  const handleStartVoice = () => {
    if (isListening) return;
    setIsListening(true);
    setRecognizedText('');

    const stopFn = speechService.startRecognition({
      lang: selectedLanguage,
      onResult: (text) => {
        setIsListening(false);
        setRecognizedText(text);

        // Check if spoken text matches an option or unsure
        if (challengeSession) {
          const options = challengeLangContent.options || [];
          let matchedOption = null;
          const lowerText = text.toLowerCase();

          for (const opt of options) {
            if (lowerText.includes(opt.id) || lowerText.includes(opt.label.toLowerCase())) {
              matchedOption = opt.id;
              break;
            }
          }

          if (matchedOption) {
            challengeSession.submitAnswer(matchedOption, text);
          } else {
            // Check for unsure phrases or submit raw transcript
            challengeSession.submitAnswer('voice_transcript', text);
          }
        }
      },
      onError: (err) => {
        setIsListening(false);
        console.warn('Voice recognition isolated notice:', err);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });
  };

  // Font Size Styles
  const fontMultiplier = fontSizeMode === 'extra-large' ? 1.25 : fontSizeMode === 'large' ? 1.1 : 1.0;
  const containerContrastBg = highContrast ? '#000000' : '#FBFBF9';
  const textContrastColor = highContrast ? '#FFFFFF' : '#1E293B';
  const cardContrastBg = highContrast ? '#18181B' : '#FFFFFF';
  const borderContrast = highContrast ? '2px solid #F59E0B' : '1px solid #E2E8F0';

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1.5rem 4rem',
      backgroundColor: containerContrastBg,
      color: textContrastColor,
      transition: 'all 0.2s ease',
      fontSize: `${18 * fontMultiplier}px`
    }}>

      {/* Top Accessibility Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: highContrast ? '#27272A' : '#F1F5F9',
        borderRadius: '16px',
        padding: '10px 18px',
        marginBottom: '1.5rem',
        border: borderContrast
      }}>
        {/* Offline & Sync Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isOffline ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: 600 }}>
              <WifiOff size={20} />
              <span>{dashT.safeOfflineActive || 'Safe Offline Mode'}</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 600 }}>
              <Wifi size={20} />
              <span>{dashT.syncedWithCaregiver || 'Connected & Synchronized'}</span>
            </div>
          )}
        </div>

        {/* Accessibility Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* High Contrast Toggle */}
          <button
            type="button"
            onClick={() => setHighContrast(prev => !prev)}
            style={{
              padding: '6px 14px',
              borderRadius: '12px',
              border: '2px solid #CBD5E1',
              background: highContrast ? '#F59E0B' : '#FFFFFF',
              color: highContrast ? '#000000' : '#334155',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '15px'
            }}
            title="Toggle High Contrast"
          >
            {highContrast ? '☀️ Normal Contrast' : '🌙 High Contrast'}
          </button>

          {/* Text Size Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', borderRadius: '12px', border: '2px solid #CBD5E1', overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => setFontSizeMode('standard')}
              style={{
                padding: '6px 12px',
                border: 'none',
                background: fontSizeMode === 'standard' ? 'var(--accent-amber, #D97706)' : 'transparent',
                color: fontSizeMode === 'standard' ? '#FFFFFF' : '#334155',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSizeMode('large')}
              style={{
                padding: '6px 12px',
                border: 'none',
                background: fontSizeMode === 'large' ? 'var(--accent-amber, #D97706)' : 'transparent',
                color: fontSizeMode === 'large' ? '#FFFFFF' : '#334155',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => setFontSizeMode('extra-large')}
              style={{
                padding: '6px 12px',
                border: 'none',
                background: fontSizeMode === 'extra-large' ? 'var(--accent-amber, #D97706)' : 'transparent',
                color: fontSizeMode === 'extra-large' ? '#FFFFFF' : '#334155',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              A++
            </button>
          </div>
        </div>
      </div>

      {/* 1. HERO GREETING CARD */}
      <div style={{
        background: cardContrastBg,
        borderRadius: '24px',
        padding: '2rem 2.5rem',
        border: borderContrast,
        boxShadow: highContrast ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.05)',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px' }}>🌸</span>
            <span style={{
              fontSize: `${18 * fontMultiplier}px`,
              color: highContrast ? '#FBBF24' : '#D97706',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {t.suprabhat || 'Good Morning'} • {dateStr}
            </span>
          </div>

          <h1 style={{
            fontSize: `${36 * fontMultiplier}px`,
            fontWeight: 800,
            margin: '0 0 10px 0',
            color: highContrast ? '#FFFFFF' : '#0F172A',
            lineHeight: 1.2
          }}>
            {t.greeting || 'Namaskar'}, {firstName} {honorific}!
          </h1>

          <p style={{
            fontSize: `${20 * fontMultiplier}px`,
            color: highContrast ? '#D4D4D8' : '#64748B',
            margin: 0,
            lineHeight: 1.4
          }}>
            {dashT.welcomeMessage || 'Welcome to your peaceful day with Smriti Setu.'}
          </p>
        </div>

        {/* Read Greeting Aloud Button */}
        <button
          type="button"
          onClick={handleReadGreeting}
          className="btn-large"
          style={{
            background: isAudioSpeaking ? '#DC2626' : (highContrast ? '#F59E0B' : '#059669'),
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '20px',
            padding: '16px 28px',
            fontSize: `${20 * fontMultiplier}px`,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)'
          }}
          aria-label={isAudioSpeaking ? 'Stop Audio' : 'Hear Greeting Aloud'}
        >
          {isAudioSpeaking ? <VolumeX size={26} /> : <Volume2 size={26} />}
          <span>{isAudioSpeaking ? (dashT.voiceStop || 'Stop') : (dashT.voiceReadout || 'Hear Greeting')}</span>
        </button>
      </div>

      {/* 2. GENTLE DAILY CHECK-IN CARD */}
      <div style={{
        background: highContrast ? '#18181B' : '#FEF9C3',
        borderRadius: '24px',
        padding: '2rem 2.25rem',
        border: highContrast ? '2px solid #F59E0B' : '2px solid #FDE047',
        marginBottom: '2.5rem',
        boxShadow: highContrast ? 'none' : '0 4px 16px rgba(245, 158, 11, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{
              fontSize: `${28 * fontMultiplier}px`,
              fontWeight: 800,
              color: highContrast ? '#FEF08A' : '#713F12',
              margin: '0 0 4px 0'
            }}>
              {currentLangContent.text || dashT.checkinTitle || 'How are you feeling today?'}
            </h2>
            <p style={{
              fontSize: `${18 * fontMultiplier}px`,
              color: highContrast ? '#FDE68A' : '#854D0E',
              margin: 0
            }}>
              {currentLangContent.subtext || dashT.checkinSubtitle || 'Choose a feeling below or speak peacefully'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => speechService.speak(currentLangContent.text || dashT.checkinTitle, selectedLanguage)}
            style={{
              background: '#FFFFFF',
              color: '#854D0E',
              border: '2px solid #FDE047',
              borderRadius: '16px',
              padding: '10px 18px',
              fontSize: `${18 * fontMultiplier}px`,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Volume2 size={20} />
            <span>{dashT.voiceReadout || 'Listen'}</span>
          </button>
        </div>

        {/* Mood Option Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '1rem'
        }}>
          {(currentLangContent.options || []).map((opt) => {
            const isSelected = checkinAnswer === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleMoodSelect(opt)}
                style={{
                  background: isSelected ? '#F59E0B' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#1E293B',
                  border: isSelected ? '3px solid #D97706' : '2px solid #FDE68A',
                  borderRadius: '18px',
                  padding: '16px 20px',
                  fontSize: `${20 * fontMultiplier}px`,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: isSelected ? '0 4px 12px rgba(245, 158, 11, 0.3)' : '0 2px 6px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: '28px' }}>{opt.emoji || '🌸'}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {checkinMessage && (
          <div style={{
            background: '#FFFFFF',
            borderRadius: '14px',
            padding: '12px 18px',
            fontSize: `${18 * fontMultiplier}px`,
            color: '#15803D',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={20} color="#15803D" />
            <span>{checkinMessage}</span>
          </div>
        )}
      </div>

      {/* 2.5 DEDICATED HIGHLIGHTED COMPANION: MOTI AI (NOT A GAME) */}
      <div style={{
        background: highContrast
          ? '#18181B'
          : 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)',
        borderRadius: '26px',
        padding: '2rem 2.25rem',
        border: highContrast ? '2px solid #F59E0B' : '3px solid #FCD34D',
        marginBottom: '2.5rem',
        boxShadow: highContrast ? 'none' : '0 8px 30px rgba(245, 158, 11, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', maxWidth: '680px' }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '26px',
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '44px',
            boxShadow: '0 6px 20px rgba(217, 119, 6, 0.35)',
            flexShrink: 0
          }}>
            🐕
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span style={{
                background: '#D97706',
                color: '#FFFFFF',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.04em'
              }}>
                ALWAYS HERE FOR YOU • NOT A GAME
              </span>
              <span style={{ fontSize: '13px', color: '#047857', fontWeight: 800 }}>
                ● 24/7 Empathetic Voice & Listening Friend
              </span>
            </div>
            <h3 style={{
              fontSize: `${28 * fontMultiplier}px`,
              fontWeight: 800,
              color: '#78350F',
              margin: '0 0 6px 0'
            }}>
              {selectedLanguage === 'hi' ? '🐾 मोती से बात करें — आपका प्यारा AI साथी' :
               selectedLanguage === 'as' ? '🐾 মোতিৰ লগত কথা পাতক — আপোনাৰ মৰমৰ সংগী' :
               selectedLanguage === 'bn' ? '🐾 মোতির সাথে কথা বলুন — আপনার আদরের বন্ধু' :
               '🐾 Talk with Moti — Your Caring AI Listening Companion'}
            </h3>
            <p style={{
              fontSize: `${18 * fontMultiplier}px`,
              color: '#92400E',
              margin: 0,
              lineHeight: 1.45
            }}>
              {selectedLanguage === 'hi' ? 'अकेलापन या घबराहट महसूस हो रही है? मोती से अपनी आवाज में बात करें या उसे सहलाएं। वह हमेशा आपको दिलासा और सुकून देने के लिए तैयार है।' :
               selectedLanguage === 'as' ? 'মনটো গধুৰ বা অকলে লাগিছে নেকি? মোতিৰ লগত কথা পাতক বা মৰম কৰক। তেওঁ সদায় আপোনাক সান্ত্বনা আৰু মৰম দিবলৈ ওচৰতে আছে।' :
               selectedLanguage === 'bn' ? 'একা বা উদ্বিগ্ন লাগছে? মোতির সাথে মুখে কথা বলুন বা তাকে আদর করুন। সে সবসময় আপনার পাশে আছে।' :
               'Feeling lonely or uneasy? Talk to Moti with your own voice or gently stroke him. He is always here to comfort, reassure, and listen to your heart.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => onSelectModule('ai_pet')}
            style={{
              background: '#059669',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '18px',
              padding: '16px 28px',
              fontSize: `${20 * fontMultiplier}px`,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 6px 20px rgba(5, 150, 105, 0.35)',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Mic size={24} />
            <span>
              {selectedLanguage === 'hi' ? '🎙️ मोती से बात करें (Speak to Moti)' :
               selectedLanguage === 'as' ? '🎙️ মোতিৰ লগত কথা পাতক (Talk)' :
               selectedLanguage === 'bn' ? '🎙️ মোতির সাথে কথা বলুন' :
               '🎙️ Speak & Talk with Moti'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectModule('ai_pet')}
            style={{
              background: '#FFFFFF',
              color: '#92400E',
              border: '2px solid #FCD34D',
              borderRadius: '16px',
              padding: '12px 22px',
              fontSize: `${17 * fontMultiplier}px`,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <Heart size={20} color="#D97706" />
            <span>
              {selectedLanguage === 'hi' ? '🖐️ सहलाएं एवं शांत सांस लें' :
               selectedLanguage === 'as' ? '🖐️ মৰম কৰক আৰু উশাহ লওক' :
               '🖐️ Stroke & Gentle Breathing'}
            </span>
          </button>
        </div>
      </div>

      {/* 3. FEATURED DAILY CHALLENGE (OPTIONAL & GENTLE) */}
      <div style={{
        background: cardContrastBg,
        borderRadius: '24px',
        padding: '2rem 2.25rem',
        border: borderContrast,
        boxShadow: highContrast ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.05)',
        marginBottom: '2.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: '#EEF2FF',
              color: '#4F46E5',
              padding: '6px 14px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.04em'
            }}>
              {dashT.todayChallengeBadge || 'Today’s Featured Memory'}
            </span>
            {completedChallenges.includes(dailyExperience.dailyChallenge.questionId) && (
              <span style={{
                background: '#DCFCE7',
                color: '#15803D',
                padding: '6px 14px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CheckCircle2 size={16} />
                {dashT.routineDone || 'Completed with warmth!'}
              </span>
            )}
          </div>

          <span style={{ fontSize: `${16 * fontMultiplier}px`, color: 'var(--text-muted, #64748B)' }}>
            {dashT.nextActivity || 'Optional & Low-Pressure'}
          </span>
        </div>

        <h3 style={{
          fontSize: `${28 * fontMultiplier}px`,
          fontWeight: 800,
          color: highContrast ? '#FFFFFF' : '#1E293B',
          margin: '0 0 10px 0'
        }}>
          {challengeLangContent.text || dashT.todayChallengeTitle}
        </h3>

        <p style={{
          fontSize: `${20 * fontMultiplier}px`,
          color: highContrast ? '#D4D4D8' : '#475569',
          margin: '0 0 1.5rem 0'
        }}>
          {challengeLangContent.subtext || 'Revisit a peaceful family or cultural memory together.'}
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleStartChallenge}
            style={{
              background: 'var(--accent-amber, #D97706)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '18px',
              padding: '16px 32px',
              fontSize: `${22 * fontMultiplier}px`,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 4px 14px rgba(217, 119, 6, 0.25)'
            }}
          >
            <Sparkles size={24} />
            <span>{dashT.takeChallengeBtn || 'Explore Today’s Challenge'}</span>
          </button>

          <button
            type="button"
            onClick={() => speechService.speak(challengeLangContent.text, selectedLanguage)}
            style={{
              background: '#FFFFFF',
              color: '#334155',
              border: '2px solid #CBD5E1',
              borderRadius: '18px',
              padding: '14px 24px',
              fontSize: `${20 * fontMultiplier}px`,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Volume2 size={22} />
            <span>{dashT.voiceReadout || 'Hear Question'}</span>
          </button>
        </div>
      </div>

      {/* 4. DAILY ROUTINES TIMELINE (CAREGIVER REMINDERS) */}
      <div style={{
        background: cardContrastBg,
        borderRadius: '24px',
        padding: '2rem 2.25rem',
        border: borderContrast,
        boxShadow: highContrast ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.05)',
        marginBottom: '2.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Calendar size={28} color="#059669" />
            <h3 style={{
              fontSize: `${26 * fontMultiplier}px`,
              fontWeight: 800,
              color: highContrast ? '#FFFFFF' : '#1E293B',
              margin: 0
            }}>
              {dashT.dailyRoutinesTitle || 'Caregiver’s Routine Reminders'}
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {routinesList.map((routine) => {
            const localizedTitle = routine.title?.[selectedLanguage] || routine.title?.en;
            const localizedDetail = routine.detail?.[selectedLanguage] || routine.detail?.en;

            return (
              <div
                key={routine.id}
                style={{
                  background: routine.completed ? (highContrast ? '#14532D' : '#F0FDF4') : (highContrast ? '#27272A' : '#F8FAFC'),
                  border: routine.completed ? '2px solid #86EFAC' : '1px solid #E2E8F0',
                  borderRadius: '18px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '32px' }}>{routine.icon || '☕'}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 700 }}>{routine.time}</span>
                      <h4 style={{
                        fontSize: `${22 * fontMultiplier}px`,
                        fontWeight: 700,
                        margin: 0,
                        color: routine.completed ? '#166534' : textContrastColor
                      }}>
                        {localizedTitle}
                      </h4>
                    </div>
                    <p style={{
                      fontSize: `${17 * fontMultiplier}px`,
                      color: routine.completed ? '#15803D' : '#64748B',
                      margin: '4px 0 0 0'
                    }}>
                      {localizedDetail}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Speak Routine */}
                  <button
                    type="button"
                    onClick={() => speechService.speak(`${localizedTitle}. ${localizedDetail}`, selectedLanguage)}
                    style={{
                      background: '#FFFFFF',
                      color: '#475569',
                      border: '1px solid #CBD5E1',
                      borderRadius: '12px',
                      padding: '8px 12px',
                      cursor: 'pointer'
                    }}
                    title="Hear routine"
                  >
                    <Volume2 size={18} />
                  </button>

                  {/* Mark Done Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleRoutine(routine.id)}
                    style={{
                      background: routine.completed ? '#16A34A' : '#FFFFFF',
                      color: routine.completed ? '#FFFFFF' : '#334155',
                      border: routine.completed ? 'none' : '2px solid #CBD5E1',
                      borderRadius: '14px',
                      padding: '10px 18px',
                      fontSize: `${18 * fontMultiplier}px`,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <CheckCircle2 size={20} />
                    <span>{routine.completed ? (dashT.routineDone || 'Done') : (dashT.routineMarkDone || 'Mark Done')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. UNIFIED COGNITIVE PLAY HUB (ALL 18+ MODULES PROPERLY CATEGORIZED & ACCESSIBLE) */}
      <div style={{ marginTop: '3.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                background: '#FEF3C7',
                color: '#92400E',
                padding: '3px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800
              }}>
                COGNITIVE PLAY HUB • 9 CURATED DOMAINS
              </span>
              <span style={{ fontSize: '13px', color: '#059669', fontWeight: 700 }}>
                ● Dignity First • Non-Diagnostic
              </span>
            </div>
            <h3 style={{
              fontSize: `${28 * fontMultiplier}px`,
              fontWeight: 800,
              color: highContrast ? '#FFFFFF' : '#1E293B',
              margin: '0 0 4px 0'
            }}>
              {selectedLanguage === 'as' ? 'মনন সেতু — মগজুৰ সক্ৰিয়তা আৰু সাংস্কৃতিক সোঁৱৰণি' :
               selectedLanguage === 'hi' ? 'स्मृति सेतु — मानसिक सक्रियता एवं सांस्कृतिक खेल' :
               'Smriti Setu Cognitive Play Hub'}
            </h3>
            <p style={{
              fontSize: `${17 * fontMultiplier}px`,
              color: highContrast ? '#D4D4D8' : '#64748B',
              margin: 0
            }}>
              {t.menuSub || 'Engage your mind with joyful nostalgia, gentle practice, and warm family memories.'}
            </p>
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '1.5rem',
          scrollbarWidth: 'none'
        }}>
          <button
            type="button"
            onClick={() => setSelectedHubCategory('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: selectedHubCategory === 'all' ? '#1E293B' : (highContrast ? '#27272A' : '#FFFFFF'),
              color: selectedHubCategory === 'all' ? '#FFFFFF' : textContrastColor,
              border: selectedHubCategory === 'all' ? '2px solid #0F172A' : '1px solid #CBD5E1',
              boxShadow: selectedHubCategory === 'all' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {selectedLanguage === 'as' ? 'সকলো খেল ও কাৰ্যসূচী' : 'All Activities (18+)'}
          </button>

          {Object.entries(COGNITIVE_CATEGORIES).map(([catKey, catData]) => {
            const isSelected = selectedHubCategory === catData.id;
            const localizedCatTitle = catData.title[selectedLanguage] || catData.title.en;

            return (
              <button
                key={catData.id}
                type="button"
                onClick={() => setSelectedHubCategory(catData.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  background: isSelected ? catData.color : (highContrast ? '#27272A' : '#FFFFFF'),
                  color: isSelected ? '#FFFFFF' : textContrastColor,
                  border: isSelected ? `2px solid ${catData.color}` : '1px solid #CBD5E1',
                  boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {localizedCatTitle}
              </button>
            );
          })}
        </div>

        {/* Filtered Activities Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {GAME_REGISTRY
            .filter(game => {
              if (game.id === 'ai_pet') return false; // Highlighted separately above as dedicated companion, NOT a game!
              if (selectedHubCategory === 'all') return true;
              return game.category === selectedHubCategory;
            })
            .sort((a, b) => {
              // Favorites pinned to top!
              const aFav = userFavorites.includes(a.id) ? 1 : 0;
              const bFav = userFavorites.includes(b.id) ? 1 : 0;
              return bFav - aFav;
            })
            .map((game) => {
              const modInfo = t?.modules?.[game.id] || {};
              const title = modInfo.title || game.displayName[selectedLanguage] || game.displayName.en;
              const subtitle = modInfo.subtitle || game.mechanic;
              const isFav = userFavorites.includes(game.id);
              const catData = Object.values(COGNITIVE_CATEGORIES).find(c => c.id === game.category);

              return (
                <div
                  key={game.id}
                  onClick={() => onSelectModule(game.id)}
                  style={{
                    background: cardContrastBg,
                    borderRadius: '22px',
                    padding: '1.75rem',
                    border: isFav ? '2px solid #F59E0B' : borderContrast,
                    boxShadow: isFav
                      ? '0 6px 20px rgba(245, 158, 11, 0.15)'
                      : highContrast ? 'none' : '0 4px 14px rgba(0, 0, 0, 0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                >
                  <div>
                    {/* Top Row: Category Badge & Favorite Star */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          background: catData?.bgColor || '#F1F5F9',
                          color: catData?.color || '#475569',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 800
                        }}>
                          {catData?.title[selectedLanguage] || catData?.title.en || 'Cognitive Activity'}
                        </span>
                        {game.isNewExclusive && (
                          <span style={{
                            background: '#FEF3C7',
                            color: '#92400E',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 800
                          }}>
                            NEW
                          </span>
                        )}
                      </div>

                      {/* User-Controlled Favorite Star Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(game.id, e)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isFav ? '#F59E0B' : '#94A3B8'
                        }}
                        title={isFav ? "Pinned to Favorites" : "Add to Favorites"}
                      >
                        <Star size={22} fill={isFav ? '#F59E0B' : 'none'} />
                      </button>
                    </div>

                    <h4 style={{
                      fontSize: `${22 * fontMultiplier}px`,
                      fontWeight: 800,
                      color: highContrast ? '#FFFFFF' : '#0F172A',
                      margin: '0 0 8px 0',
                      lineHeight: 1.3
                    }}>
                      {title}
                    </h4>

                    <p style={{
                      fontSize: `${16 * fontMultiplier}px`,
                      color: highContrast ? '#D4D4D8' : '#64748B',
                      margin: 0,
                      lineHeight: 1.45
                    }}>
                      {subtitle}
                    </p>

                    {/* Accessibility Indicators */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                      <span style={{ fontSize: '11px', background: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                        ✋ Easy Touch
                      </span>
                      <span style={{ fontSize: '11px', background: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                        🔄 No Timer
                      </span>
                      {game.accessibility?.audioGuidance || game.accessibility?.spokenAudio || game.interactionModes.includes('audio_listen') ? (
                        <span style={{ fontSize: '11px', background: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                          🔊 Audio Support
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <span style={{
                      color: 'var(--accent-amber, #D97706)',
                      fontWeight: 700,
                      fontSize: `${17 * fontMultiplier}px`
                    }}>
                      {t.open || 'Play & Explore'} →
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* CHALLENGE INTERACTION MODAL (POWERED BY QUESTION ENGINE) */}
      {isChallengeOpen && challengeSession && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: cardContrastBg,
            borderRadius: '28px',
            maxWidth: '750px',
            width: '100%',
            padding: '2.5rem',
            border: highContrast ? '3px solid #F59E0B' : 'none',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            {/* Modal Header Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{
                background: '#EEF2FF',
                color: '#4F46E5',
                padding: '6px 14px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 700
              }}>
                {dashT.todayChallengeBadge || 'Today’s Gentle Memory'}
              </span>

              <button
                type="button"
                onClick={() => {
                  speechService.stop();
                  challengeSession.pauseSession();
                  setIsChallengeOpen(false);
                }}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: '#475569'
                }}
              >
                ✕ {dashT.finishNow || 'Return Home'}
              </button>
            </div>

            {/* Question Text */}
            <h2 style={{
              fontSize: `${32 * fontMultiplier}px`,
              fontWeight: 800,
              color: highContrast ? '#FFFFFF' : '#0F172A',
              margin: '0 0 12px 0',
              lineHeight: 1.3
            }}>
              {challengeLangContent.text}
            </h2>

            <p style={{
              fontSize: `${20 * fontMultiplier}px`,
              color: highContrast ? '#D4D4D8' : '#64748B',
              margin: '0 0 1.5rem 0'
            }}>
              {challengeLangContent.subtext}
            </p>

            {/* Audio Controls (Hear / Replay Question) */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => speechService.speak(challengeLangContent.text, selectedLanguage)}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  borderRadius: '14px',
                  padding: '10px 18px',
                  fontSize: `${18 * fontMultiplier}px`,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Volume2 size={20} />
                <span>{dashT.voiceReadout || 'Hear Question'}</span>
              </button>

              <button
                type="button"
                onClick={handleStartVoice}
                style={{
                  background: isListening ? '#DC2626' : '#F8FAFC',
                  color: isListening ? '#FFFFFF' : '#334155',
                  border: isListening ? 'none' : '1px solid #CBD5E1',
                  borderRadius: '14px',
                  padding: '10px 18px',
                  fontSize: `${18 * fontMultiplier}px`,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                <span>{isListening ? (dashT.listening || 'Listening...') : (dashT.speakAnswer || 'Speak Answer')}</span>
              </button>
            </div>

            {/* Answer Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem' }}>
              {(challengeLangContent.options || []).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => challengeSession.submitAnswer(opt.id)}
                  style={{
                    background: highContrast ? '#27272A' : '#FFFFFF',
                    color: textContrastColor,
                    border: highContrast ? '2px solid #52525B' : '2px solid #E2E8F0',
                    borderRadius: '18px',
                    padding: '18px 24px',
                    fontSize: `${22 * fontMultiplier}px`,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '30px' }}>{opt.emoji || '✨'}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Hint Box if Requested */}
            {activeHint && (
              <div style={{
                background: '#FEF3C7',
                border: '2px solid #FCD34D',
                borderRadius: '16px',
                padding: '14px 20px',
                color: '#92400E',
                fontSize: `${18 * fontMultiplier}px`,
                fontWeight: 700,
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <HelpCircle size={22} color="#D97706" />
                <span>{activeHint}</span>
              </div>
            )}

            {/* Feedback Message */}
            {challengeFeedback && (
              <div style={{
                background: '#ECFDF5',
                border: '2px solid #A7F3D0',
                borderRadius: '16px',
                padding: '14px 20px',
                color: '#065F46',
                fontSize: `${19 * fontMultiplier}px`,
                fontWeight: 700,
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Sparkles size={22} color="#059669" />
                <span>{challengeFeedback}</span>
              </div>
            )}

            {/* Gentle Bottom Controls (Hint / Skip / Take Break) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '2px solid #F1F5F9',
              paddingTop: '1.25rem',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <button
                type="button"
                onClick={() => {
                  const h = challengeSession.requestHint();
                  setActiveHint(h);
                  if (h) speechService.speak(h, selectedLanguage);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent-amber, #D97706)',
                  fontWeight: 700,
                  fontSize: `${18 * fontMultiplier}px`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <HelpCircle size={20} />
                <span>{dashT.gentleHint || 'Gentle Clue'}</span>
              </button>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    speechService.stop();
                    challengeSession.skipQuestion();
                  }}
                  style={{
                    background: '#F1F5F9',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 18px',
                    fontSize: `${17 * fontMultiplier}px`,
                    fontWeight: 700,
                    color: '#64748B',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <SkipForward size={18} />
                  <span>{dashT.skipQuestion || 'Skip for Now'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    speechService.stop();
                    challengeSession.pauseSession();
                    setIsChallengeOpen(false);
                  }}
                  style={{
                    background: '#F1F5F9',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 18px',
                    fontSize: `${17 * fontMultiplier}px`,
                    fontWeight: 700,
                    color: '#64748B',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Pause size={18} />
                  <span>{dashT.takeBreak || 'Take a Break'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
