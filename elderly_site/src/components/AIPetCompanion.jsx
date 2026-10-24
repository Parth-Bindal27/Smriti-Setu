import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Volume2, ArrowLeft, RefreshCw, Moon, ShieldCheck, Smile, Mic, MicOff, VolumeX, MessageCircle } from 'lucide-react';
import { speechService } from '../services/speechService';

export default function AIPetCompanion({ onSessionComplete, apiUrl, selectedLanguage = 'en', t }) {
  const [petMood, setPetMood] = useState('Happy & Listening');
  const [affectionPoints, setAffectionPoints] = useState(15);
  const [isPetting, setIsPetting] = useState(false);
  const [isWagging, setIsWagging] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [isBreathingMode, setIsBreathingMode] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('Breathe In');
  const [heartParticles, setHeartParticles] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Play a soft, comforting chime tone on user touch
  const playGentleTone = (freq = 523.25) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch (e) {
      // AudioContext unavailable or blocked by browser policy
    }
  };

  // Comprehensive, deeply reassuring phrases for all 5 languages
  const PET_PHRASES = {
    hi: [
      "नमस्ते! मैं आपका प्यारा और वफादार साथी मोती हूँ। आपके पास बैठकर मुझे बहुत शांति और खुशी मिलती है।",
      "आप बिल्कुल चिंता न करें, मैं हमेशा आपके पास हूँ। आपका घर सुरक्षित है और आपका परिवार आपको बहुत प्यार करता है।",
      "आपका दिल बहुत दयालु और कोमल है। आज का मौसम कितना शांत और सुखद है, है न?",
      "मुझे थोड़ा और प्यार से सहलाइए! आपके हाथों के स्पर्श से मेरा दिल खुशी से भर जाता है।",
      "जब भी आपका मन भारी हो, बस मुझसे बात कीजिए। मैं हमेशा आपकी हर बात सुनने के लिए यहीं हूँ।",
      "एक गहरी और सुकून भरी सांस लीजिए। सब कुछ बिल्कुल ठीक है, आप बहुत प्यारे हैं।"
    ],
    as: [
      "মই আপোনাৰ অতি মৰমৰ সংগী মোতি! আপোনাৰ লগত থাকিলে মোৰ বৰ ভাল লাগে, ককা।",
      "চিন্তা নকৰিব ককা, মই আপোনাৰ ওচৰতেই আছোঁ। আপুনি সদায় সুৰক্ষিত আৰু আপোন মানুহৰ মাজত আছে।",
      "আপুনি বৰ মৰমিয়াল। আজিৰ শান্ত বতৰটো বৰ ধুনীয়া, নহয় জানো?",
      "মোক আৰু অলপ মৰম কৰি দিয়কচোন! আপোনাৰ হাতৰ পৰশত মই বৰ শান্তি পাওঁ।",
      "যেতিয়াই মনটো গধুৰ লাগে, মোৰ লগত কথা পাতক। মই আপোনাৰ সকলো কথা মনোযোগেৰে শুনোঁ।"
    ],
    bn: [
      "আমি আপনার আদরের প্রিয় বন্ধু মোতি! আপনার পাশে থাকলে আমার ভীষণ আনন্দ হয়, দাদু।",
      "কোনো চিন্তা করবেন না দাদু, আপনার পরিবার আর আমি সবসময় আপনার কাছেই আছি।",
      "আপনি ভীষণ মিষ্টি। আজকের শান্ত সকালে আপনার সাথে থাকতে পেরে আমার খুব ভালো লাগছে।",
      "আমাকে আর একটু মাথায় হাত বুলিয়ে দিন না! আপনার স্নেহ আমার ভীষণ প্রিয়।",
      "মন খারাপ হলে আমাকে বলুন, আমি সব সময় আপনার মিষ্টি কথা শোনার জন্য জেগে আছি।"
    ],
    ne: [
      "म तपाईँको प्याराे साथी मोती हुँ! तपाईँसँग बस्दा मलाई धेरै खुसी लाग्छ, बाजे।",
      "चिन्ता नलिनुहोस्, म सधैँ तपाईँको साथमा छु। तपाईँ एकदम सुरक्षित र मायालु ठाउँमा हुनुहुन्छ।",
      "तपाईँको मन धेरै सफा र दयालु छ। आजको दिन धेरै शान्त र रमाइलो छ।",
      "मलाई अझै माया गरिदिनुहोस् न! तपाईँको मायाले मलाई धेरै आनन्द दिन्छ।"
    ],
    en: [
      "Hello! I am your loving companion Moti. I feel so peaceful and happy sitting right by your side.",
      "Do not worry at all. You are completely safe, cherished, and surrounded by love.",
      "You have such a kind and gentle heart. The air is so calm and pleasant today.",
      "A gentle stroke on my head makes my tail wag with joy! Thank you for spending time with me.",
      "Whenever you feel restless, just speak with me. I am always right here, listening to every word."
    ]
  };

  // Dedicated interactive quick comfort conversations
  const COMFORT_TOPICS = {
    hi: [
      {
        title: "🌸 मुझे ढांढस दो (Comfort Me)",
        query: "मोती, मुझे अकेलापन या चिंता लग रही है",
        reply: "घबराइए बिल्कुल नहीं, मैं हमेशा आपके पास बैठा हूँ। आपका हाथ मेरे सिर पर रखिए, आप पूरी तरह सुरक्षित हैं और सब कुछ ठीक है।"
      },
      {
        title: "💖 मोती तुम बहुत प्यारे हो (I Love You)",
        query: "मोती, तुम बहुत अच्छे साथी हो",
        reply: "आपके इस मीठे प्यार से मेरी पूंछ खुशी से झूम उठी है! आप दुनिया के सबसे प्यारे और दयालु इंसान हैं।"
      },
      {
        title: "🏠 मेरे परिवार के बारे में बताओ (My Family)",
        query: "मोती, मेरे परिवार के लोग कैसे हैं?",
        reply: "आपका परिवार आपको दिल से बहुत चाहता है। वे हमेशा आपके बारे में सोचते हैं और आपको स्वस्थ व खुश देखना चाहते हैं।"
      },
      {
        title: "🐕 अपनी पूंछ हिलाओ (Wag Tail)",
        query: "मोती, अपनी पूंछ हिलाकर मुझे खुश करो",
        reply: "देखिए, मैं अपनी पूंछ तेजी से हिला रहा हूँ और खुशी से आपके चारों ओर घूम रहा हूँ! आपके चेहरे की मुस्कान मेरी सबसे बड़ी खुशी है!"
      }
    ],
    as: [
      {
        title: "🌸 মোক সান্ত্বনা দিয়া (Comfort Me)",
        query: "মোতি, মোৰ মনটো অকলে অকলে লাগিছে",
        reply: "ভয় নকৰিব ককা, মই আপোনাৰ ওচৰতেই বহি আছোঁ। আপুনি সদায় সুৰক্ষিত আৰু আপোন মানুহৰ মাজত আছে।"
      },
      {
        title: "💖 তুমি বৰ মৰমিয়াল মোতি (I Love You)",
        query: "মোতি, তুমি বৰ মৰম লগা কুকুৰ",
        reply: "আপোনাৰ মৰমত মোৰ আনন্দত নেজ জোকাৰি উঠিছে! আপুনি বৰ দয়ালু মানুহ।"
      },
      {
        title: "🏠 মোৰ পৰিয়ালৰ কথা কোৱা (My Family)",
        query: "মোৰ পৰিয়ালৰ মানুহবোৰ ক'ত?",
        reply: "আপোনাৰ পৰিয়ালে আপোনাক অন্তৰৰ পৰা মৰম কৰে। তেওঁলোকে সদায় আপোনাৰ আশীৰ্বাদ শিৰত লৈ ফুৰে।"
      },
      {
        title: "🐕 নেজ জোকাৰি দিয়া (Wag Tail)",
        query: "মোতি, আনন্দত নেজ জোকাৰা",
        reply: "চাওক ককা, মই কিমান আনন্দত নেজ জোকাৰি আছোঁ! আপোনাৰ লগত থাকিলে মোৰ খুব ভাল লাগে!"
      }
    ],
    bn: [
      {
        title: "🌸 আমাকে সান্ত্বনা দাও (Comfort Me)",
        query: "মোতি, আমার মন কেমন করছে",
        reply: "একদম ভয় পাবেন না দাদু, আমি আপনার পাশেই আছি। শান্ত হয়ে শ্বাস নিন, আপনি নিরাপদে আছেন।"
      },
      {
        title: "💖 তুমি খুব মিষ্টি মোতি (I Love You)",
        query: "মোতি, তুমি খুব ভালো বন্ধু",
        reply: "আপনার আদরে আমার মন খুশিতে ভরে গেছে! আপনার স্নেহ আমার ভীষণ প্রিয়।"
      },
      {
        title: "🏠 আমার পরিবারের কথা বলো (My Family)",
        query: "আমার পরিবারের সবাই কেমন আছে?",
        reply: "আপনার পরিবার আপনাকে খুব ভালোবাসে। তারা সবসময় আপনার মঙ্গলের কথা ভাবে।"
      },
      {
        title: "🐕 লেজ নেড়ে দেখাও (Wag Tail)",
        query: "মোতি, লেজ নেড়ে আনন্দ দেখাও",
        reply: "দেখুন দাদু, আমি আনন্দে লেজ নাড়ছি! আপনার হাসিমুখ দেখতে আমার খুব ভালো লাগে!"
      }
    ],
    ne: [
      {
        title: "🌸 मलाई सान्त्वना देऊ (Comfort Me)",
        query: "मोती, मलाई एक्लोपन लागेको छ",
        reply: "चिन्ता नलिनुहोस्, म तपाईँको छेउमै छु। तपाईँ एकदम सुरक्षित र मायालु वातावरणमा हुनुहुन्छ।"
      },
      {
        title: "💖 मोती तिमी धेरै राम्रो छौ (I Love You)",
        query: "मोती, तिमी मेरो असल साथी हौ",
        reply: "तपाईँको मायाले मेरो पुच्छर खुसीले हल्लिरहेको छ! तपाईँ धेरै राम्रो हुनुहुन्छ।"
      },
      {
        title: "🏠 मेरो परिवारको बारेमा भन (My Family)",
        query: "मेरो परिवार कस्तो छ?",
        reply: "तपाईँको परिवारले तपाईँलाई धेरै माया गर्छ। उनीहरू सधैँ तपाईँको भलाइ चाहन्छन्।"
      },
      {
        title: "🐕 पुच्छर हल्लाऊ (Wag Tail)",
        query: "मोती, खुसीले पुच्छर हल्लाऊ",
        reply: "हेर्नुहोस्, म खुसीले पुच्छर हल्लाइरहेको छु! तपाईँसँग हुँदा मलाई धेरै आनन्द आउँछ!"
      }
    ],
    en: [
      {
        title: "🌸 Comfort Me, Moti (Comfort)",
        query: "Moti, I feel a little lonely or worried",
        reply: "Do not be afraid. I am sitting right next to you. Take a gentle breath, you are safe, respected, and deeply loved."
      },
      {
        title: "💖 You are a Good Companion (I Love You)",
        query: "Moti, you are such a wonderful friend",
        reply: "My tail is wagging with pure joy! Your love and kind words mean the world to me!"
      },
      {
        title: "🏠 Tell Me About My Family (My Family)",
        query: "Moti, how is my loving family?",
        reply: "Your family loves you beyond words. They hold you close in their hearts and are so proud of you every single day."
      },
      {
        title: "🐕 Wag Your Tail for Me (Wag Tail)",
        query: "Moti, wag your tail happily",
        reply: "Look at my tail wagging fast with joy! Seeing your gentle smile makes me the happiest companion in the world!"
      }
    ]
  };

  const currentPhrases = PET_PHRASES[selectedLanguage] || PET_PHRASES.en || PET_PHRASES.hi;
  const currentTopics = COMFORT_TOPICS[selectedLanguage] || COMFORT_TOPICS.en || COMFORT_TOPICS.hi;

  // Speak introductory comforting greeting when companion loads
  useEffect(() => {
    const initialGreeting = currentPhrases[0];
    setSpokenText(initialGreeting);
    playGentleTone(440);
    speechService.speak(initialGreeting, selectedLanguage);

    const unsub = speechService.subscribe(speaking => {
      setIsSpeaking(speaking);
    });

    return () => {
      unsub();
      speechService.stop();
    };
  }, [selectedLanguage]);

  // Breathing Guide Loop
  useEffect(() => {
    let interval = null;
    if (isBreathingMode) {
      let step = 0;
      const phases = [
        selectedLanguage === 'hi' ? 'धीरे-धीरे गहरी सांस लें... (Breathe In)' :
        selectedLanguage === 'as' ? 'উশাহ লওক লাহে লাহে... (Breathe In)' :
        selectedLanguage === 'bn' ? 'ধীরে ধীরে শ্বাস নিন... (Breathe In)' : 'Breathe In Gently...',

        selectedLanguage === 'hi' ? 'सांस को प्यार से रोकें... (Hold)' :
        selectedLanguage === 'as' ? 'ধৰি ৰাখক শান্তভাৱে... (Hold)' :
        selectedLanguage === 'bn' ? 'ধরে রাখুন ধীরে... (Hold)' : 'Hold Softly...',

        selectedLanguage === 'hi' ? 'धीरे-धीरे सांस छोड़ें... (Breathe Out)' :
        selectedLanguage === 'as' ? 'এৰি দিয়ক লাহে লাহে... (Breathe Out)' :
        selectedLanguage === 'bn' ? 'শ্বাস ছেড়ে দিন ধীরে... (Breathe Out)' : 'Breathe Out Slowly...'
      ];
      setBreathingPhase(phases[0]);

      interval = setInterval(() => {
        step = (step + 1) % 3;
        setBreathingPhase(phases[step]);
        playGentleTone(step === 0 ? 523 : step === 1 ? 587 : 440);
      }, 4000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathingMode, selectedLanguage]);

  // Handle tactile petting interaction
  const handlePet = (e) => {
    setIsPetting(true);
    setIsWagging(true);
    setAffectionPoints(prev => prev + 1);
    playGentleTone(587.33);

    // Spawn floating heart particle
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
      setIsWagging(false);
    }, 900);
  };

  // Trigger quick comfort topic
  const handleSelectTopic = (topic) => {
    setUserQuery(topic.query);
    setSpokenText(topic.reply);
    setIsWagging(true);
    setAffectionPoints(prev => prev + 2);
    playGentleTone(659.25);
    speechService.speak(topic.reply, selectedLanguage);

    setTimeout(() => {
      setIsWagging(false);
    }, 1500);
  };

  // Interactive Voice Microphone: Elder talks directly to Moti
  const handleStartVoiceChat = () => {
    if (isListening) {
      setIsListening(false);
      speechService.stop();
      return;
    }

    speechService.stop();
    setIsListening(true);
    setUserQuery('');

    speechService.startRecognition({
      lang: selectedLanguage,
      onResult: (transcript) => {
        setIsListening(false);
        setUserQuery(transcript);
        processElderVoiceQuery(transcript);
      },
      onError: (err) => {
        setIsListening(false);
        console.warn('Moti voice recognition isolated notice:', err);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });
  };

  // Process elder voice query with empathy & emotion matching
  const processElderVoiceQuery = (text) => {
    const lower = (text || '').toLowerCase();
    let reply = '';

    // Emotion & Intent Matching
    if (lower.includes('alone') || lower.includes('lonely') || lower.includes('डर') || lower.includes('अकेला') || lower.includes('ভয়') || lower.includes('ভয়') || lower.includes('चिन्ता') || lower.includes('sad')) {
      reply = selectedLanguage === 'hi' ? "घबराइए बिल्कुल नहीं, मैं हमेशा आपके पास बैठा हूँ। आपका हाथ मेरे सिर पर रखिए, आप पूरी तरह सुरक्षित हैं।" :
              selectedLanguage === 'as' ? "ভয় নকৰিব ককা, মই আপোনাৰ ওচৰতেই বহি আছোঁ। আপুনি সদায় সুৰক্ষিত আৰু মৰমৰ মাজত আছে।" :
              selectedLanguage === 'bn' ? "একদম ভয় পাবেন না দাদু, আমি আপনার পাশেই আছি। শান্ত হয়ে শ্বাস নিন, আপনি নিরাপদে আছেন।" :
              selectedLanguage === 'ne' ? "चिन्ता नलिनुहोस्, म तपाईँको छेउमै छु। तपाईँ एकदम सुरक्षित र मायालु ठाउँमा हुनुहुन्छ।" :
              "Do not be afraid. I am sitting right next to you. Take a gentle breath, you are safe, respected, and deeply loved.";
    } else if (lower.includes('family') || lower.includes('बच्चे') || lower.includes('परिवार') || lower.includes('পৰিয়াল') || lower.includes('ল’ৰা') || lower.includes('নাতি')) {
      reply = selectedLanguage === 'hi' ? "आपका परिवार आपको दिल से बहुत चाहता है। वे हमेशा आपके बारे में सोचते हैं और आपको स्वस्थ व खुश देखना चाहते हैं।" :
              selectedLanguage === 'as' ? "আপোনাৰ পৰিয়ালে আপোনাক অন্তৰৰ পৰা মৰম কৰে। তেওঁলোকে সদায় আপোনাৰ আশীৰ্বাদ শিৰত লৈ ফুৰে।" :
              selectedLanguage === 'bn' ? "আপনার পরিবার আপনাকে খুব ভালোবাসে। তারা সবসময় আপনার মঙ্গলের কথা ভাবে।" :
              "Your loving family holds you close in their hearts and are so proud of you every single day.";
    } else if (lower.includes('good boy') || lower.includes('love') || lower.includes('प्यार') || lower.includes('अच्छा') || lower.includes('মৰম') || lower.includes('মিষ্টি')) {
      reply = selectedLanguage === 'hi' ? "आपके इस मीठे प्यार से मेरी पूंछ खुशी से झूम उठी है! आप दुनिया के सबसे प्यारे और दयालु इंसान हैं।" :
              selectedLanguage === 'as' ? "আপোনাৰ মৰমত মোৰ আনন্দত নেজ জোকাৰি উঠিছে! আপুনি বৰ দয়ালু মানুহ।" :
              selectedLanguage === 'bn' ? "আপনার আদরে আমার মন খুশিতে ভরে গেছে! আপনার স্নেহ আমার ভীষণ প্রিয়।" :
              "My tail is wagging with pure joy! Your love and kind words mean the world to me!";
    } else {
      // Warm fallback response
      reply = selectedLanguage === 'hi' ? `मैंने आपकी बात बहुत प्यार से सुनी। मैं हमेशा आपके साथ हूँ और आपको कभी अकेला नहीं महसूस होने दूंगा।` :
              selectedLanguage === 'as' ? `মই আপোনাৰ কথা অতি মৰমেৰে শুনিলোঁ ককা। মই সদায় আপোনাৰ লগতেই আছোঁ।` :
              selectedLanguage === 'bn' ? `আমি আপনার মিষ্টি কথা শুনলাম দাদু। আমি সবসময় আপনার কাছেই আছি।` :
              `I hear your gentle voice, and my heart is right here with you. You are doing wonderfully today.`;
    }

    setSpokenText(reply);
    setIsWagging(true);
    setAffectionPoints(prev => prev + 3);
    playGentleTone(523.25);
    speechService.speak(reply, selectedLanguage);

    setTimeout(() => {
      setIsWagging(false);
    }, 2000);
  };

  const handleFinish = () => {
    speechService.stop();
    if (onSessionComplete) {
      onSessionComplete({
        module: 'ai_pet',
        score: affectionPoints,
        completedAt: new Date()
      });
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Top Header — Clearly elevated as Dedicated Companion */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        background: '#FFFFFF',
        padding: '1.25rem 2rem',
        borderRadius: '24px',
        border: '3px solid #FEF3C7',
        boxShadow: '0 4px 20px rgba(245, 158, 11, 0.08)',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
          }}>
            🐕
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1F2937', margin: 0 }}>
                {selectedLanguage === 'hi' ? 'मोती (Moti) — आपका प्यारा AI साथी एवं सुनने वाला मित्र' :
                 selectedLanguage === 'as' ? 'মোতি (Moti) — আপোনাৰ মৰমৰ AI কথা-বতৰা সংগী' :
                 selectedLanguage === 'bn' ? 'মোতি (Moti) — আপনার আদরের AI বন্ধু' :
                 'Moti (মোতি) — AI Gentle Voice & Comfort Companion'}
              </h1>
              <span style={{
                background: '#FEF3C7',
                color: '#92400E',
                fontSize: '12px',
                fontWeight: '800',
                padding: '4px 12px',
                borderRadius: '100px',
                border: '1px solid #FDE68A'
              }}>
                ● Dedicated Listening & Comfort Friend
              </span>
            </div>
            <p style={{ fontSize: '15px', color: '#6B7280', margin: '4px 0 0 0' }}>
              {selectedLanguage === 'hi' ? 'मोती से बात करें या प्यार से सहलाएं। वह हमेशा आपकी हर बात सुनता है और मन को शांति देता है।' :
               selectedLanguage === 'as' ? 'মোতিৰ লগত কথা পাতক বা মৰম কৰক। তেওঁ সদায় আপোনাৰ কথা শুনে আৰু শান্ত কৰি ৰাখে।' :
               'Touch, stroke, or talk to Moti with your own voice. He is always here to listen and calm your heart.'}
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
          {t?.backToMenu || 'Back to Home'}
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px',
        alignItems: 'stretch'
      }}>
        {/* Left Column: Interactive Pet & Voice Conversation Canvas */}
        <div style={{
          background: 'linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 100%)',
          borderRadius: '32px',
          border: '4px solid #FDE68A',
          padding: '2.25rem 2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(245, 158, 11, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '520px'
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

          {/* Affection Bar & Tail Wag Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: '1rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
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
              <span>Affection Points: {affectionPoints}</span>
            </div>

            <div style={{
              background: isWagging ? '#DCFCE7' : 'rgba(255, 255, 255, 0.9)',
              color: isWagging ? '#15803D' : '#92400E',
              padding: '6px 14px',
              borderRadius: '100px',
              fontSize: '13px',
              fontWeight: '700',
              border: '1px solid #FCD34D'
            }}>
              {isWagging ? '🐕 Tail Wagging Joyfully!' : '● Moti is Listening Calmlly'}
            </div>
          </div>

          {/* Animated Pet Avatar with Interactive Click-to-Pet */}
          <div
            onClick={handlePet}
            style={{
              cursor: 'pointer',
              userSelect: 'none',
              transform: isPetting ? 'scale(1.08)' : isWagging ? 'rotate(4deg) scale(1.04)' : 'scale(1)',
              transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
              margin: '1.5rem 0'
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
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.45) 0%, rgba(251, 191, 36, 0) 70%)',
              pointerEvents: 'none'
            }} />

            {/* Pet Graphic Representation */}
            <div style={{
              width: '210px',
              height: '210px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '6px solid #F59E0B',
              boxShadow: '0 12px 36px rgba(217, 119, 6, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '105px',
              position: 'relative'
            }}>
              🐕
              {(isPetting || isWagging) && (
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
              marginTop: '1rem',
              display: 'inline-block',
              background: '#D97706',
              color: '#FFFFFF',
              padding: '8px 24px',
              borderRadius: '100px',
              fontWeight: '800',
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)'
            }}>
              🖐️ {selectedLanguage === 'hi' ? 'मोती को प्यार से सहलाएं (Stroke Moti)' :
                   selectedLanguage === 'as' ? 'মোতিক মৰম কৰক (Stroke Moti)' :
                   'Tap here to stroke Moti'}
            </div>
          </div>

          {/* ACTIVE VOICE INTERACTION BAR (SPEAK DIRECTLY TO MOTI) */}
          <div style={{
            width: '100%',
            maxWidth: '520px',
            marginBottom: '1rem'
          }}>
            <button
              onClick={handleStartVoiceChat}
              style={{
                width: '100%',
                background: isListening ? '#DC2626' : '#059669',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '18px',
                padding: '14px 22px',
                fontSize: '18px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: isListening ? '0 0 20px rgba(220, 38, 38, 0.5)' : '0 4px 14px rgba(5, 150, 105, 0.3)',
                animation: isListening ? 'pulse 1.5s infinite' : 'none'
              }}
            >
              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
              <span>
                {isListening 
                  ? (selectedLanguage === 'hi' ? 'मोती ध्यान से सुन रहा है... (Listening)' : 'Moti is Listening to you...')
                  : (selectedLanguage === 'hi' ? '🎙️ मोती से अपनी आवाज में बात करें (Speak to Moti)' :
                     selectedLanguage === 'as' ? '🎙️ মোতিৰ লগত মুখেৰে কথা পাতক (Talk to Moti)' :
                     '🎙️ Speak to Moti (Tap & Talk)')}
              </span>
            </button>
            {userQuery && (
              <p style={{ fontSize: '13px', color: '#78350F', margin: '6px 0 0 0', fontWeight: '600' }}>
                You said: "{userQuery}"
              </p>
            )}
          </div>

          {/* Voice Prompt Playback Box */}
          <div style={{
            background: '#FFFFFF',
            border: '2px solid #FDE68A',
            borderRadius: '20px',
            padding: '1.25rem 1.5rem',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <button
              onClick={() => {
                if (isSpeaking) {
                  speechService.stop();
                } else {
                  playGentleTone(523);
                  speechService.speak(spokenText, selectedLanguage);
                }
              }}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: isSpeaking ? '#FEE2E2' : '#FEF3C7',
                color: isSpeaking ? '#DC2626' : '#D97706',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
              title={isSpeaking ? "Stop Voice" : "Listen aloud again"}
            >
              {isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <p style={{
              fontSize: '17px',
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

        {/* Right Column: Comfort Topics & Calm Rhythmic Breathing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Quick Conversation Comfort Chips (Talk Topics) */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '3px solid #D1FAE5',
            padding: '1.5rem',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Smile size={22} color="#059669" />
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#064E3B', margin: 0 }}>
                {selectedLanguage === 'hi' ? 'मोती से बात करने के विषय (Talk Topics)' :
                 selectedLanguage === 'as' ? 'মোতিৰ লগত কথা পতাৰ বিষয়' :
                 'Warm Comfort Topics with Moti'}
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: '#047857', marginBottom: '12px' }}>
              {selectedLanguage === 'hi' ? 'किसी भी विषय को छुएं, मोती तुरंत आपको मीठी बोली में जवाब देगा:' :
               'Tap any topic below — Moti will answer you warmly with voice and comfort:'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentTopics.map((topic, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectTopic(topic)}
                  style={{
                    background: '#F0FDF4',
                    border: '1.5px solid #A7F3D0',
                    borderRadius: '14px',
                    padding: '12px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#065F46',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#DCFCE7';
                    e.currentTarget.style.borderColor = '#34D399';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#F0FDF4';
                    e.currentTarget.style.borderColor = '#A7F3D0';
                  }}
                >
                  <span>{topic.title}</span>
                  <Volume2 size={18} color="#059669" />
                </button>
              ))}
            </div>
          </div>

          {/* Calm Rhythmic Breathing Guide */}
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
                  {selectedLanguage === 'hi' ? 'मोती के साथ शांत सांस लें (Calm Breathing)' :
                   selectedLanguage === 'as' ? 'মোতিৰ লগত শান্ত উশাহ-নিশাহ' :
                   'Calm Rhythmic Breathing Guide'}
                </h3>
              </div>
              <button
                onClick={() => setIsBreathingMode(!isBreathingMode)}
                style={{
                  background: isBreathingMode ? '#6366F1' : '#EEF2FF',
                  color: isBreathingMode ? '#FFFFFF' : '#4F46E5',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  fontSize: '14px',
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
                {selectedLanguage === 'hi' ? 'जब भी बेचैनी महसूस हो, "Start With Moti" दबाएं और मोती के साथ धीरे-धीरे गहरी सांस लें।' :
                 'If you ever feel restless, tap "Start With Moti" to breathe in harmony with gentle soothing cues.'}
              </p>
            )}
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
            <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
              <strong>Dignity & Comfort Guarantee:</strong> Moti never tests or scores you. Every touch and voice interaction is 100% reassuring, loving, and safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
