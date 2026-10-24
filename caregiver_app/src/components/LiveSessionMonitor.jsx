import React, { useState, useEffect } from 'react';
import {
  Radio,
  Eye,
  Clock,
  HelpCircle,
  MessageSquare,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Volume2,
  Camera,
  CameraOff,
  Activity,
  Heart,
  Shield,
  Coffee,
  ChevronDown,
  ChevronUp,
  Sliders
} from 'lucide-react';
import { getSocket } from '../socket';

export default function LiveSessionMonitor({ onSessionCompleted, activeTab = 'dashboard' }) {
  const [sessionState, setSessionState] = useState({
    isActive: false,
    activityTitle: '',
    activityType: '',
    status: 'Idle — Awaiting Elder Activity',
    attempts: 0,
    hintsDelivered: 0,
    responseTimeSec: 0,
    userVoiceTranscript: '',
    isCorrect: null,
    lastUpdate: null
  });

  const [connected, setConnected] = useState(false);
  const [elapsedTimer, setElapsedTimer] = useState(0);

  // Live Camera & Cognitive Stress Telemetry States
  const [liveCameraFrame, setLiveCameraFrame] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stressScore, setStressScore] = useState(18);
  const [stressCategory, setStressCategory] = useState('calm'); // 'calm' | 'focused' | 'mild_strain' | 'elevated_strain'
  const [adaptiveNotice, setAdaptiveNotice] = useState('Dynamic Dignity Pacing Active');
  const [cameraExpanded, setCameraExpanded] = useState(true);
  const [manualCameraCheck, setManualCameraCheck] = useState(false);
  const [actionFeedback, setActionFeedback] = useState('');
  const [isDemoActive, setIsDemoActive] = useState(false);

  const toggleDemoMode = () => {
    setIsDemoActive(prev => {
      const next = !prev;
      if (next) {
        setSessionState({
          isActive: true,
          activityTitle: 'Morning Cognitive Reminiscence & Orientation Gate',
          activityType: 'daily_assessment',
          status: 'Elder responding to Question 3 with calm deliberation',
          attempts: 1,
          hintsDelivered: 1,
          responseTimeSec: 4.8,
          userVoiceTranscript: 'Guwahati, Assam',
          isCorrect: true,
          lastUpdate: Date.now()
        });
        setCameraActive(true);
        setStressScore(26);
        setStressCategory('calm');
        setAdaptiveNotice('● Dignity Sentinel: Elder is relaxed, latency normal (<5s)');
        setActionFeedback('⚡ Live Presentation Demo Mode Activated — All Dignity Controls Operational');
        setTimeout(() => setActionFeedback(''), 4000);
      } else {
        setSessionState({
          isActive: false,
          activityTitle: '',
          activityType: '',
          status: 'Idle — Awaiting Elder Activity',
          attempts: 0,
          hintsDelivered: 0,
          responseTimeSec: 0,
          userVoiceTranscript: '',
          isCorrect: null,
          lastUpdate: null
        });
        setCameraActive(false);
        setStressScore(18);
        setStressCategory('calm');
        setActionFeedback('Demo Mode Stopped — Returning to Live Socket');
        setTimeout(() => setActionFeedback(''), 3000);
      }
      return next;
    });
  };

  useEffect(() => {
    const socket = getSocket();
    setConnected(socket.connected);

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    // 1. Listen for activity start
    const handleActivityStart = (data) => {
      console.log('⚡ [Live Monitor] Activity Started:', data);
      setSessionState(prev => ({
        ...prev,
        isActive: true,
        activityTitle: data?.activityName || data?.title || 'Cognitive Engagement',
        activityType: data?.activityType || 'game',
        status: 'Elderly participant entered activity',
        attempts: 1,
        hintsDelivered: 0,
        responseTimeSec: 0,
        userVoiceTranscript: '',
        isCorrect: null,
        lastUpdate: Date.now()
      }));
      setElapsedTimer(0);
    };

    // 2. High-Frequency Live Telemetry
    const handleTelemetry = (data) => {
      setSessionState(prev => ({
        ...prev,
        isActive: true,
        activityTitle: data?.memoryTitle || data?.activityTitle || prev.activityTitle || 'Active Engagement',
        status: data?.status || data?.userStatus || 'User responding...',
        attempts: data?.attempts ?? prev.attempts,
        hintsDelivered: data?.hintsDelivered ?? prev.hintsDelivered,
        responseTimeSec: data?.responseTimeSec || data?.responseTimeSeconds || prev.responseTimeSec,
        userVoiceTranscript: data?.userVoiceTranscript || prev.userVoiceTranscript,
        isCorrect: data?.isCorrect ?? prev.isCorrect,
        lastUpdate: Date.now()
      }));
    };

    // 3. Live Camera Frame Stream from Elderly device
    const handleCameraStream = (data) => {
      if (data?.frame) {
        setLiveCameraFrame(data.frame);
      }
      if (data?.cameraActive !== undefined) {
        setCameraActive(data.cameraActive);
      }
      if (data?.stressScore !== undefined) {
        setStressScore(data.stressScore);
      }
      if (data?.stressCategory) {
        setStressCategory(data.stressCategory);
      }
      if (data?.activityTitle && !sessionState.isActive) {
        setSessionState(prev => ({
          ...prev,
          isActive: true,
          activityTitle: data.activityTitle,
          status: 'Active on quiz / game sentinel'
        }));
      }
    };

    // 4. Real-Time Stress Telemetry
    const handleStressTelemetry = (data) => {
      if (data?.stressScore !== undefined) {
        setStressScore(data.stressScore);
      }
      if (data?.stressCategory) {
        setStressCategory(data.stressCategory);
      }
      if (data?.stressCategory === 'elevated_strain') {
        setAdaptiveNotice('⚡ Auto-Eased: Next question simplified to Gentle Tier to protect dignity');
      } else if (data?.stressCategory === 'mild_strain') {
        setAdaptiveNotice('💡 Hesitation Detected: Friendly visual memory cues provided');
      }
    };

    // 5. Session Complete
    const handleSessionComplete = (data) => {
      console.log('⚡ [Live Monitor] Session Completed:', data);
      setSessionState(prev => ({
        ...prev,
        isActive: false,
        status: 'Completed — Saved to MongoDB',
        lastUpdate: Date.now()
      }));
      if (onSessionCompleted) {
        setTimeout(() => onSessionCompleted(data), 1000);
        setTimeout(() => onSessionCompleted(data), 2500);
      }
    };

    socket.on('caregiver:activity-started', handleActivityStart);
    socket.on('elderly:activity-started', handleActivityStart);
    socket.on('caregiver:live-telemetry', handleTelemetry);
    socket.on('caregiver:live-telemetry-broadcast', handleTelemetry);
    socket.on('caregiver:live-camera-stream', handleCameraStream);
    socket.on('caregiver:live-camera-stream-broadcast', handleCameraStream);
    socket.on('caregiver:stress-telemetry', handleStressTelemetry);
    socket.on('caregiver:stress-telemetry-broadcast', handleStressTelemetry);
    socket.on('caregiver:session-completed', handleSessionComplete);
    socket.on('caregiver:session-completed-broadcast', handleSessionComplete);
    socket.on('caregiver:game-completed', handleSessionComplete);
    socket.on('caregiver:vr-completed', handleSessionComplete);

    return () => {
      socket.off('caregiver:activity-started', handleActivityStart);
      socket.off('elderly:activity-started', handleActivityStart);
      socket.off('caregiver:live-telemetry', handleTelemetry);
      socket.off('caregiver:live-telemetry-broadcast', handleTelemetry);
      socket.off('caregiver:live-camera-stream', handleCameraStream);
      socket.off('caregiver:live-camera-stream-broadcast', handleCameraStream);
      socket.off('caregiver:stress-telemetry', handleStressTelemetry);
      socket.off('caregiver:stress-telemetry-broadcast', handleStressTelemetry);
      socket.off('caregiver:session-completed', handleSessionComplete);
      socket.off('caregiver:session-completed-broadcast', handleSessionComplete);
      socket.off('caregiver:game-completed', handleSessionComplete);
      socket.off('caregiver:vr-completed', handleSessionComplete);
    };
  }, [onSessionCompleted, sessionState.isActive]);

  // Live timer tick when active
  useEffect(() => {
    let interval = null;
    if (sessionState.isActive) {
      interval = setInterval(() => {
        setElapsedTimer(prev => Number((prev + 0.5).toFixed(1)));
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionState.isActive]);

  const sendRemoteControl = (action) => {
    const socket = getSocket();
    socket.emit('caregiver:control', { action, timestamp: Date.now() });

    let label = 'Command sent to Elder tablet';
    if (action === 'gentle_chime') label = '🌿 Calming raga chime sent to Elder';
    else if (action === 'ease_difficulty') label = '🛡️ Eased difficulty: Question simplified to Gentle Tier';
    else if (action === 'suggest_break') label = '☕ Rest break recommendation sent';
    else if (action === 'skip') label = '⏭️ Advanced to next question';

    setActionFeedback(label);
    setTimeout(() => setActionFeedback(''), 4000);
  };

  // If not on dashboard and no active session, do not pollute other tabs
  if (!sessionState.isActive && !manualCameraCheck && activeTab !== 'dashboard') {
    return null;
  }

  const getStressBadge = () => {
    switch (stressCategory) {
      case 'calm':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34D399', border: '#10B981', label: 'Calm & Comfortable' };
      case 'focused':
        return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38BDF8', border: '#0284C7', label: 'Active Focus & Deliberation' };
      case 'mild_strain':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: '#D97706', label: 'Mild Effort / Hesitation' };
      case 'elevated_strain':
        return { bg: 'rgba(225, 29, 72, 0.2)', text: '#FB7185', border: '#E11D48', label: 'Elevated Strain — Adaptive Cues Active' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94A3B8', border: '#475569', label: 'Monitoring' };
    }
  };

  const stressBadge = getStressBadge();

  return (
    <div style={{
      background: sessionState.isActive 
        ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)' 
        : '#1E293B',
      border: sessionState.isActive 
        ? (stressCategory === 'elevated_strain' ? '2px solid #E11D48' : '2px solid #10B981') 
        : '1px solid #334155',
      borderRadius: '20px',
      padding: '1.4rem 1.6rem',
      marginBottom: '2rem',
      boxShadow: sessionState.isActive ? '0 10px 35px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0,0,0,0.15)',
      color: '#FFFFFF',
      transition: 'all 0.3s ease'
    }}>
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.8rem',
        borderBottom: '1px solid #334155',
        paddingBottom: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: sessionState.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.1)',
            color: sessionState.isActive ? '#34D399' : '#94A3B8',
            padding: '0.4rem 0.95rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 700
          }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: sessionState.isActive ? '#10B981' : '#64748B',
              boxShadow: sessionState.isActive ? '0 0 12px #10B981' : 'none',
              animation: sessionState.isActive ? 'pulse 1.5s infinite' : 'none'
            }} />
            {sessionState.isActive ? 'LIVE ELDER ENGAGEMENT & STRESS MONITOR' : 'LIVE SENTINEL & TELEMETRY (STANDBY)'}
          </div>

          <span style={{ fontSize: '0.8rem', color: connected ? '#38BDF8' : '#F87171' }}>
            {connected ? '● Socket.IO Connected' : '○ Reconnecting Socket...'}
          </span>

          {cameraActive && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34D399',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700
            }}>
              <Camera size={12} /> Live Webcam Stream (1.5s)
            </span>
          )}
        </div>

        {/* Remote Caregiver Quick Control Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {sessionState.isActive && (
            <>
              <button
                onClick={() => sendRemoteControl('gentle_chime')}
                style={{
                  background: '#0F172A',
                  color: '#38BDF8',
                  border: '1px solid #38BDF8',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Sparkles size={14} color="#38BDF8" /> Send Calming Chime
              </button>

              <button
                onClick={() => sendRemoteControl('ease_difficulty')}
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#FBBF24',
                  border: '1px solid #F59E0B',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Shield size={14} color="#FBBF24" /> Ease Question Difficulty
              </button>

              <button
                onClick={() => sendRemoteControl('suggest_break')}
                style={{
                  background: '#334155',
                  color: '#CBD5E1',
                  border: '1px solid #475569',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Coffee size={14} color="#CBD5E1" /> Suggest Rest
              </button>
            </>
          )}

          {!sessionState.isActive && (
            <button
              onClick={() => setManualCameraCheck(prev => !prev)}
              style={{
                background: manualCameraCheck ? '#0F172A' : '#0284C7',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.45rem 0.95rem',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Camera size={14} />
              <span>{manualCameraCheck ? 'Hide Live Camera' : 'Check Live Camera'}</span>
            </button>
          )}

          <button
            onClick={toggleDemoMode}
            style={{
              background: isDemoActive ? '#DC2626' : 'linear-gradient(135deg, #059669, #047857)',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.45rem 0.95rem',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: isDemoActive ? '0 0 12px rgba(220, 38, 38, 0.4)' : '0 2px 8px rgba(5, 150, 105, 0.3)'
            }}
          >
            <Activity size={14} />
            <span>{isDemoActive ? '⏹ Stop Sentinel Test' : '⚡ Test Live Sentinel'}</span>
          </button>
        </div>
      </div>

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div style={{
          background: 'rgba(56, 189, 248, 0.15)',
          border: '1px solid #38BDF8',
          borderRadius: '10px',
          padding: '8px 14px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#38BDF8',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={16} />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Main Monitoring Grid */}
      {(sessionState.isActive || manualCameraCheck) ? (
        <div style={{ display: 'grid', gridTemplateColumns: liveCameraFrame || cameraActive ? '260px 1fr' : '1fr', gap: '1.25rem', alignItems: 'start' }}>
          
          {/* Live Camera Viewport Column */}
          <div style={{
            background: '#0F172A',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#38BDF8' }}>
                <Camera size={14} />
                <span>Live Elder Viewport</span>
              </div>
              <span style={{ fontSize: '10px', color: '#94A3B8' }}>
                {cameraActive ? 'Webcam Online' : 'Biometric Pulse'}
              </span>
            </div>

            <div style={{
              position: 'relative',
              width: '100%',
              height: '160px',
              backgroundColor: '#020617',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #1E293B'
            }}>
              {liveCameraFrame ? (
                <img
                  src={liveCameraFrame}
                  alt="Live Elder Camera Stream"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)' // Natural mirror
                  }}
                />
              ) : isDemoActive ? (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '85px',
                    height: '85px',
                    borderRadius: '20px',
                    border: '2px dashed #10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    boxShadow: '0 0 16px rgba(16, 185, 129, 0.3)',
                    position: 'relative'
                  }}>
                    🧓
                    <span style={{
                      position: 'absolute',
                      bottom: '-7px',
                      background: '#10B981',
                      color: '#0F172A',
                      fontSize: '8px',
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: '4px'
                    }}>
                      FACE TRACKED
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#34D399', fontWeight: 700, marginTop: '8px' }}>
                    Live Sentinel Stream Active
                  </div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                    Pulse: 72 bpm • Micro-expression: Calm
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '12px', color: '#64748B' }}>
                  <Shield size={32} color="#10B981" style={{ margin: '0 auto 6px auto' }} />
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>
                    Caregiver Sentinel Guard
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>
                    {connected ? 'Awaiting camera frame or quiz start' : 'Connecting to device stream...'}
                  </div>
                </div>
              )}

              {/* Live Tag Overlay */}
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                background: 'rgba(15, 23, 42, 0.85)',
                color: '#10B981',
                padding: '2px 6px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                <span>LIVE</span>
              </div>
            </div>

            {/* Subtext info */}
            <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.3 }}>
              Monitors facial strain, restlessness, and hesitations during quizzes to protect dignity.
            </div>
          </div>

          {/* Real-Time Metrics & Cognitive Stress HUD Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Stress & Fatigue Barometer */}
            <div style={{
              background: '#0F172A',
              border: `1px solid ${stressBadge.border}`,
              borderRadius: '16px',
              padding: '1.1rem 1.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color={stressBadge.text} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#E2E8F0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Cognitive Stress & Strain Barometer:
                  </span>
                </div>
                <div style={{
                  background: stressBadge.bg,
                  color: stressBadge.text,
                  border: `1px solid ${stressBadge.border}`,
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700
                }}>
                  {stressBadge.label} ({stressScore}%)
                </div>
              </div>

              {/* Progress Gauge */}
              <div style={{ height: '8px', backgroundColor: '#1E293B', borderRadius: '9999px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{
                  height: '100%',
                  width: `${stressScore}%`,
                  background: stressScore > 70 
                    ? 'linear-gradient(90deg, #F59E0B, #E11D48)' 
                    : stressScore > 45 
                    ? 'linear-gradient(90deg, #10B981, #F59E0B)' 
                    : 'linear-gradient(90deg, #059669, #10B981)',
                  transition: 'width 0.4s ease'
                }} />
              </div>

              {/* Adaptive Action Notice */}
              <div style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color="#D97706" />
                <span>{adaptiveNotice}</span>
              </div>
            </div>

            {/* Metrics Row: 4 Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.85rem' }}>
              <div style={{ background: '#0F172A', padding: '0.9rem', borderRadius: '12px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Task</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', marginTop: '0.2rem' }}>
                  {sessionState.activityTitle || 'Cognitive Assessment / Quiz'}
                </div>
              </div>

              <div style={{ background: '#0F172A', padding: '0.9rem', borderRadius: '12px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current State</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#38BDF8', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Eye size={15} /> {sessionState.status}
                </div>
              </div>

              <div style={{ background: '#0F172A', padding: '0.9rem', borderRadius: '12px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Response Latency</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FBBF24', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={15} /> {elapsedTimer}s
                </div>
              </div>

              <div style={{ background: '#0F172A', padding: '0.9rem', borderRadius: '12px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Attempts & Hints</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#CBD5E1', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <HelpCircle size={15} color="#FBBF24" /> {sessionState.hintsDelivered} Hints · {sessionState.attempts} Attempts
                </div>
              </div>
            </div>

            {/* Voice Transcript Bar */}
            {sessionState.userVoiceTranscript && (
              <div style={{
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '12px',
                padding: '0.8rem 1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem'
              }}>
                <Volume2 size={18} color="#38BDF8" />
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Real-Time Spoken Response:</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#F8FAFC' }}>
                    "{sessionState.userVoiceTranscript}"
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Standby state on dashboard */
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#CBD5E1' }}>
              Cognitive Stress & Camera Sentinel Standby
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.2rem' }}>
              When the elder begins daily quizzes or cognitive games, live video snapshots, stress gauges, and adaptive pacing telemetry will stream here automatically.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0F172A', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #334155', fontSize: '0.8rem', color: '#94A3B8' }}>
            <Radio size={14} color="#38BDF8" /> Real-time stream active on Socket.IO
          </div>
        </div>
      )}
    </div>
  );
}
