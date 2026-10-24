import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, ShieldCheck, Heart, AlertTriangle, Eye, Sparkles, Volume2, ChevronDown, ChevronUp } from 'lucide-react';
import { getSocket, emitCameraFrame, emitStressTelemetry } from '../socket';
import { speechService } from '../services/speechService';

export default function ElderlyStressCameraSentinel({
  activityTitle = 'Cognitive Engagement',
  activityType = 'quiz',
  currentQuestionIndex = 0,
  attempts = 1,
  latencySeconds = 0,
  selectedLanguage = 'en',
  onAdaptiveIntervention
}) {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [minimized, setMinimized] = useState(false);
  const [stressScore, setStressScore] = useState(15);
  const [stressCategory, setStressCategory] = useState('calm'); // 'calm' | 'focused' | 'mild_strain' | 'elevated_strain'
  const [adaptiveMessage, setAdaptiveMessage] = useState('');
  const [caregiverChimeActive, setCaregiverChimeActive] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const prevFrameDataRef = useRef(null);
  const consecutiveStrainsRef = useRef(0);

  // 1. Initialize Camera (Webcam or Fallback)
  useEffect(() => {
    let isMounted = true;

    async function initCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API not supported on this browser');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 320 },
            height: { ideal: 240 },
            facingMode: 'user'
          },
          audio: false
        });

        if (!isMounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.warn('Video play notice:', e));
        }
        setCameraActive(true);
        setCameraError(null);
      } catch (err) {
        console.warn('📷 [Camera Sentinel] Webcam not accessible, utilizing Biometric Behavioral Pulse:', err.message);
        if (isMounted) {
          setCameraActive(false);
          setCameraError(err.message);
        }
      }
    }

    initCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // 2. Compute Real-Time Stress & Cognitive Strain
  useEffect(() => {
    let score = 12; // Baseline calm state

    // Latency evaluation
    if (latencySeconds > 5 && latencySeconds <= 10) {
      score += 18;
    } else if (latencySeconds > 10) {
      score += 38;
    }

    // Repeated attempts evaluation (agitation / repeated misses)
    if (attempts > 1) {
      score += (attempts - 1) * 22;
    }

    // Bound score 5 to 95
    score = Math.min(Math.max(score, 8), 92);
    setStressScore(score);

    let category = 'calm';
    if (score > 70) {
      category = 'elevated_strain';
    } else if (score > 48) {
      category = 'mild_strain';
    } else if (score > 28) {
      category = 'focused';
    }
    setStressCategory(category);

    // Auto-adaptive difficulty trigger
    if (category === 'elevated_strain' || category === 'mild_strain') {
      consecutiveStrainsRef.current += 1;
      if (consecutiveStrainsRef.current >= 2) {
        const msg = selectedLanguage === 'as'
          ? 'ককা, কোনো চিন্তা নকৰিব। আপুনি বৰ সুন্দৰকৈ চেষ্টা কৰিছে।'
          : selectedLanguage === 'hi'
          ? 'कोई बात नहीं, आप बहुत अच्छा प्रयास कर रहे हैं। आराम से करें।'
          : 'You are doing wonderful thinking! Take all the time you need.';

        setAdaptiveMessage(msg);
        speechService.speak(msg, selectedLanguage);

        onAdaptiveIntervention?.({
          stressScore: score,
          stressCategory: category,
          action: 'EASE_DIFFICULTY',
          recommendedTier: 'gentle',
          simplifiedPrompt: true
        });

        consecutiveStrainsRef.current = 0;
      }
    } else {
      consecutiveStrainsRef.current = 0;
      setAdaptiveMessage('');
    }

    // Broadcast stress telemetry
    emitStressTelemetry({
      activityTitle,
      activityType,
      currentQuestionIndex,
      stressScore: score,
      stressCategory: category,
      latencySeconds,
      attempts,
      cameraActive,
      timestamp: Date.now()
    });

  }, [latencySeconds, attempts, activityTitle, currentQuestionIndex, selectedLanguage]);

  // 3. Periodic Frame Capture & Stream to Caregiver Dashboard (1 frame every 1.5 seconds)
  useEffect(() => {
    const frameInterval = setInterval(() => {
      let frameDataUrl = null;

      if (cameraActive && videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          canvas.width = 160;
          canvas.height = 120;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, 160, 120);

          // Lightweight JPEG thumbnail
          frameDataUrl = canvas.toDataURL('image/jpeg', 0.45);
        }
      }

      // Stream to Caregiver Dashboard
      emitCameraFrame({
        frame: frameDataUrl,
        cameraActive,
        activityTitle,
        activityType,
        currentQuestionIndex,
        stressScore,
        stressCategory,
        latencySeconds,
        attempts,
        timestamp: Date.now()
      });

    }, 1500);

    return () => clearInterval(frameInterval);
  }, [cameraActive, activityTitle, activityType, currentQuestionIndex, stressScore, stressCategory, latencySeconds, attempts]);

  // 4. Remote Caregiver Controls Listener (Calming Chimes & Adaptive overrides)
  useEffect(() => {
    const socket = getSocket();

    const handleCaregiverControl = (data) => {
      if (data?.action === 'gentle_chime') {
        setCaregiverChimeActive(true);
        // Play gentle audio reassurance
        const chimeMsg = selectedLanguage === 'as'
          ? 'পৰিয়ালে আপোনাক প্ৰণাম আৰু মৰম জনাইছে।'
          : selectedLanguage === 'hi'
          ? 'आपके परिवार का स्नेह आपके साथ है। शांत मन से आगे बढ़ें।'
          : 'Your family sends loving warmth and peace.';
        speechService.speak(chimeMsg, selectedLanguage);

        setTimeout(() => setCaregiverChimeActive(false), 3500);
      } else if (data?.action === 'ease_difficulty') {
        onAdaptiveIntervention?.({
          stressScore: 40,
          stressCategory: 'mild_strain',
          action: 'FORCE_GENTLE',
          recommendedTier: 'gentle'
        });
      }
    };

    socket.on('elderly:control', handleCaregiverControl);

    return () => {
      socket.off('elderly:control', handleCaregiverControl);
    };
  }, [selectedLanguage, onAdaptiveIntervention]);

  const getStressBadgeColor = () => {
    switch (stressCategory) {
      case 'calm': return { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0', label: 'Calm & Comfortable' };
      case 'focused': return { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', label: 'Active Attention' };
      case 'mild_strain': return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A', label: 'Thinking Deliberately' };
      case 'elevated_strain': return { bg: '#FFE4E6', text: '#BE123C', border: '#FECDD3', label: 'Gentle Support Active' };
      default: return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0', label: 'Monitoring' };
    }
  };

  const badge = getStressBadgeColor();

  return (
    <>
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Floating Dignified Sentinel Widget */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 900,
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)',
        border: '2px solid #E2E8F0',
        overflow: 'hidden',
        width: minimized ? 'auto' : '220px',
        transition: 'all 0.25s ease'
      }}>
        {/* Header Bar */}
        <div style={{
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          fontSize: '12px',
          fontWeight: 700
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: cameraActive ? '#10B981' : '#F59E0B',
              boxShadow: cameraActive ? '0 0 8px #10B981' : 'none'
            }} />
            <span>Caregiver Sentinel</span>
          </div>

          <button
            type="button"
            onClick={() => setMinimized(prev => !prev)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {minimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {!minimized && (
          <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Camera Viewport or Pulse Avatar */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '110px',
              backgroundColor: '#0F172A',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <video
                ref={videoRef}
                muted
                playsInline
                autoPlay
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: cameraActive ? 'block' : 'none',
                  transform: 'scaleX(-1)' // Mirror view
                }}
              />

              {!cameraActive && (
                <div style={{ textAlign: 'center', padding: '10px', color: '#94A3B8' }}>
                  <ShieldCheck size={28} color="#10B981" style={{ margin: '0 auto 4px auto' }} />
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#E2E8F0' }}>
                    Behavioral Pulse Sentinel
                  </div>
                  <div style={{ fontSize: '9px' }}>Latency & Response Tracking</div>
                </div>
              )}

              {/* Live Overlay Status */}
              <div style={{
                position: 'absolute',
                bottom: '6px',
                left: '6px',
                background: 'rgba(15, 23, 42, 0.85)',
                color: '#FFFFFF',
                borderRadius: '6px',
                padding: '2px 6px',
                fontSize: '10px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Eye size={10} color="#38BDF8" />
                <span>Live Feed</span>
              </div>
            </div>

            {/* Cognitive Stress Meter */}
            <div style={{
              background: badge.bg,
              border: `1px solid ${badge.border}`,
              borderRadius: '10px',
              padding: '6px 8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: badge.text }}>
                  {badge.label}
                </span>
                <span style={{ fontSize: '10px', fontWeight: 800, color: badge.text }}>
                  {stressScore}%
                </span>
              </div>

              {/* Progress track */}
              <div style={{ height: '4px', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${stressScore}%`,
                  backgroundColor: stressScore > 65 ? '#E11D48' : stressScore > 40 ? '#D97706' : '#059669',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>

            {/* Reassurance Toast when Chime / Adaptive is active */}
            {caregiverChimeActive && (
              <div style={{
                background: '#FEF3C7',
                border: '1px solid #FCD34D',
                borderRadius: '8px',
                padding: '6px 8px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#92400E',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Sparkles size={14} color="#D97706" />
                <span>Caregiver sent warmth chime</span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
