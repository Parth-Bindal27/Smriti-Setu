import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  Volume2,
  Tv,
  TrendingUp,
  ShieldAlert,
  HelpCircle,
  X,
  Radio,
  Cpu,
  Target,
  DollarSign,
  ChevronRight,
  Send,
  Eye,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { getSocket } from '../socket';

export default function SharkTankPitchModal({ isOpen, onClose, apiUrl, profile }) {
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator', 'pitch_deck', 'shark_qa'
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  const [isSimulatingElderly, setIsSimulatingElderly] = useState(false);
  const [elderlyStatus, setElderlyStatus] = useState('Idle in Courtyard');
  const [currentActivity, setCurrentActivity] = useState('Rongali Bihu VR Memory');
  const [customVoicePrompt, setCustomVoicePrompt] = useState('');

  const socket = getSocket();

  useEffect(() => {
    if (!isOpen || !socket) return;

    const handleTelemetry = (data) => {
      setTelemetryLogs(prev => [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          source: 'Headset / Screen',
          detail: data?.activityName || data?.title || 'Telemetry Pulse Received',
          type: 'success'
        },
        ...prev.slice(0, 7)
      ]);
    };

    const handleControl = (data) => {
      setTelemetryLogs(prev => [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          source: 'Caregiver Controller',
          detail: `Command dispatched: ${data?.action || 'Gentle Audio Prompt'}`,
          type: 'info'
        },
        ...prev.slice(0, 7)
      ]);
    };

    socket.on('caregiver:live-telemetry', handleTelemetry);
    socket.on('caregiver:live-telemetry-broadcast', handleTelemetry);
    socket.on('caregiver:activity-started', handleTelemetry);
    socket.on('elderly:control', handleControl);

    return () => {
      socket.off('caregiver:live-telemetry', handleTelemetry);
      socket.off('caregiver:live-telemetry-broadcast', handleTelemetry);
      socket.off('caregiver:activity-started', handleTelemetry);
      socket.off('elderly:control', handleControl);
    };
  }, [isOpen, socket]);

  if (!isOpen) return null;

  // 1-Click Shark Tank Interactive Triggers
  const triggerElderlyAction = (activityName, userStatus, hintText) => {
    setIsSimulatingElderly(true);
    setElderlyStatus(userStatus);
    setCurrentActivity(activityName);

    const payload = {
      activityName,
      title: activityName,
      userStatus,
      responseTimeSeconds: 4.8,
      hintsDelivered: hintText ? 1 : 0,
      activeMemoryTitle: 'Bihu Dhol at Latasil Field',
      imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&auto=format&fit=crop&q=80',
      timestamp: Date.now()
    };

    if (socket) {
      socket.emit('elderly:telemetry', payload);
      socket.emit('elderly:activity-start', payload);
    }

    setTelemetryLogs(prev => [
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        source: 'Elderly Action',
        detail: `[SIMULATED] Elder engaged with "${activityName}" — ${userStatus}`,
        type: 'success'
      },
      ...prev.slice(0, 7)
    ]);

    setTimeout(() => setIsSimulatingElderly(false), 2000);
  };

  const sendCaregiverPrompt = (promptText) => {
    const textToSend = promptText || customVoicePrompt || "Koka, look at your loving granddaughter Maina's smile.";
    if (socket) {
      socket.emit('caregiver:control', {
        action: 'VOICE_PROMPT',
        prompt: textToSend,
        timestamp: Date.now()
      });
    }
    setCustomVoicePrompt('');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#0F172A',
        color: '#F8FAFC',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '1180px',
        maxHeight: '94vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px -15px rgba(217, 119, 6, 0.35)',
        border: '2px solid rgba(217, 119, 6, 0.4)',
        overflow: 'hidden'
      }}>
        {/* Shark Tank Header */}
        <div style={{
          padding: '1.25rem 2rem',
          backgroundColor: '#1E293B',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)'
            }}>
              <span style={{ fontSize: '24px' }}>🦈</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em', color: '#F8FAFC' }}>
                  Shark Tank Interactive Pitch & Live Split Showcase
                </h2>
                <span style={{
                  backgroundColor: '#D97706',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}>
                  PITCH MODE
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94A3B8' }}>
                Instant real-time demonstration: simulate the elderly VR interface & watch the caregiver suite react
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Tab switchers */}
            <div style={{
              display: 'flex',
              backgroundColor: '#0F172A',
              padding: '3px',
              borderRadius: '10px',
              border: '1px solid #334155'
            }}>
              <button
                onClick={() => setActiveTab('simulator')}
                style={{
                  backgroundColor: activeTab === 'simulator' ? '#D97706' : 'transparent',
                  color: activeTab === 'simulator' ? '#FFFFFF' : '#94A3B8',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                ⚡ Live Split Demo
              </button>

              <button
                onClick={() => setActiveTab('pitch_deck')}
                style={{
                  backgroundColor: activeTab === 'pitch_deck' ? '#D97706' : 'transparent',
                  color: activeTab === 'pitch_deck' ? '#FFFFFF' : '#94A3B8',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                📊 Pitch Deck & TAM
              </button>

              <button
                onClick={() => setActiveTab('shark_qa')}
                style={{
                  backgroundColor: activeTab === 'shark_qa' ? '#D97706' : 'transparent',
                  color: activeTab === 'shark_qa' ? '#FFFFFF' : '#94A3B8',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                🛡️ Shark Q&A Defense
              </button>
            </div>

            <button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab 1: Live Split Demo & Interactive Simulator */}
        {activeTab === 'simulator' && (
          <div style={{
            padding: '1.75rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {/* Top Interactive Trigger Bar */}
            <div style={{
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: '14px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#F59E0B', textTransform: 'uppercase' }}>
                  Live Demo Controller (Click to trigger instant telemetry on screen)
                </span>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#E2E8F0' }}>
                  Demonstrate the sub-second sync between Koka's headset and caregiver's phone
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => triggerElderlyAction('Rongali Bihu Dhol Recall', 'Joyful Recognition & Smiling', null)}
                  style={{
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={14} />
                  <span>1. Koka Recognizes Bihu Memory</span>
                </button>

                <button
                  onClick={() => triggerElderlyAction('Granddaughter Maina Story', 'Gentle Tier-1 Hint Requested', 'Look at the cheerful girl in the red mekhala chador')}
                  style={{
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Eye size={14} />
                  <span>2. Trigger AI Dignity Hint</span>
                </button>

                <button
                  onClick={() => triggerElderlyAction('Morning Tea & Meds Routine', 'Completed Routine On Time', null)}
                  style={{
                    backgroundColor: '#D97706',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle size={14} />
                  <span>3. Routine Milestone Complete</span>
                </button>
              </div>
            </div>

            {/* Split Dual-Panel Simulator */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
              gap: '1.5rem'
            }}>
              {/* Left Panel: Elderly POV (Tablet/VR Viewport) */}
              <div style={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>🧓</span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#F8FAFC' }}>
                        Elderly Viewport (Koka's Screen / VR Headset)
                      </h4>
                      <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8' }}>
                        High-contrast, audio-enabled, zero complex menus
                      </p>
                    </div>
                  </div>

                  <a
                    href="http://localhost:3001"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#F59E0B',
                      fontSize: '11px',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    <span>Open Standalone :3001</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Simulated Screen View */}
                <div style={{
                  backgroundColor: '#0F172A',
                  borderRadius: '12px',
                  border: isSimulatingElderly ? '2px solid #10B981' : '1px solid #334155',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  minHeight: '260px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative'
                }}>
                  {isSimulatingElderly && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: '#059669',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      animation: 'pulse 1s infinite'
                    }}>
                      STREAMING TELEMETRY
                    </div>
                  )}

                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(217, 119, 6, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#F59E0B',
                    fontSize: '32px'
                  }}>
                    🌺
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: '700', textTransform: 'uppercase' }}>
                      Current Activity Focus
                    </span>
                    <h3 style={{ margin: '4px 0', fontSize: '18px', color: '#F8FAFC' }}>
                      {currentActivity}
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94A3B8' }}>
                      Status: <strong style={{ color: '#34D399' }}>{elderlyStatus}</strong>
                    </p>
                  </div>

                  <div style={{
                    backgroundColor: '#1E293B',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#E2E8F0',
                    border: '1px solid #334155'
                  }}>
                    🗣️ Spoken in Assamese: <em>"ব’হাগ বিহুৰ লাটাসিল পথাৰৰ ধোলৰ মাত মনত পৰে নে?"</em>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    Language: <strong>Assamese (অসমীয়া)</strong> • Audio Synthesis Active
                  </span>
                  <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '600' }}>
                    ● 60 FPS VR Canvas Synchronized
                  </span>
                </div>
              </div>

              {/* Right Panel: Caregiver Live Receiver & Remote Voice Intercom */}
              <div style={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Radio size={18} color="#10B981" />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#F8FAFC' }}>
                        Caregiver Real-time Intercom & Live Telemetry
                      </h4>
                      <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8' }}>
                        Sub-second WebSocket sync on Port 5050
                      </p>
                    </div>
                  </div>

                  <span style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#34D399',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}>
                    CONNECTED (0ms LAG)
                  </span>
                </div>

                {/* Live Telemetry Stream Box */}
                <div style={{
                  backgroundColor: '#0F172A',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  padding: '1rem',
                  minHeight: '160px',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  {telemetryLogs.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#64748B', fontSize: '12px', margin: 'auto' }}>
                      Click any test trigger above to see live telemetry stream here.
                    </div>
                  ) : (
                    telemetryLogs.map(log => (
                      <div key={log.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '11px',
                        padding: '4px 8px',
                        backgroundColor: '#1E293B',
                        borderRadius: '6px',
                        borderLeft: log.type === 'success' ? '3px solid #10B981' : '3px solid #3B82F6'
                      }}>
                        <span style={{ color: '#E2E8F0' }}>{log.detail}</span>
                        <span style={{ color: '#64748B', fontSize: '10px' }}>{log.time}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Remote Voice Prompt Intercom */}
                <div style={{
                  backgroundColor: '#0F172A',
                  borderRadius: '12px',
                  padding: '12px',
                  border: '1px solid #334155'
                }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>
                    Send Gentle Spoken Prompt to Koka's Screen:
                  </span>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <input
                      type="text"
                      placeholder="e.g. Koka, take your time with tea..."
                      value={customVoicePrompt}
                      onChange={(e) => setCustomVoicePrompt(e.target.value)}
                      style={{
                        flex: 1,
                        backgroundColor: '#1E293B',
                        border: '1px solid #475569',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        color: '#FFFFFF',
                        fontSize: '12px'
                      }}
                    />
                    <button
                      onClick={() => sendCaregiverPrompt()}
                      style={{
                        backgroundColor: '#D97706',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 14px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Send size={13} />
                      <span>Transmit</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Pitch Deck, TAM & Unit Economics */}
        {activeTab === 'pitch_deck' && (
          <div style={{
            padding: '2rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem'
          }}>
            {/* The Hook & The Market */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem'
            }}>
              <div style={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '14px',
                padding: '1.25rem'
              }}>
                <span style={{ color: '#F59E0B', fontSize: '28px', fontWeight: '800' }}>8.8M+</span>
                <h4 style={{ margin: '4px 0', fontSize: '14px', color: '#F8FAFC' }}>Dementia Patients in India</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>
                  Doubling to 17M+ by 2036. 3rd highest burden globally.
                </p>
              </div>

              <div style={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '14px',
                padding: '1.25rem'
              }}>
                <span style={{ color: '#10B981', fontSize: '28px', fontWeight: '800' }}>₹10,500 Cr</span>
                <h4 style={{ margin: '4px 0', fontSize: '14px', color: '#F8FAFC' }}>Serviceable Market (TAM)</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>
                  Elderly digital wellness, memory care homes, and home nursing.
                </p>
              </div>

              <div style={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '14px',
                padding: '1.25rem'
              }}>
                <span style={{ color: '#3B82F6', fontSize: '28px', fontWeight: '800' }}>0 Competitors</span>
                <h4 style={{ margin: '4px 0', fontSize: '14px', color: '#F8FAFC' }}>In Regional / North East Dialects</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>
                  Western apps only cater to English; zero culturally-tailored tools for Tier-2/3.
                </p>
              </div>
            </div>

            {/* Business Model & Monetization Tiers */}
            <div style={{
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '16px', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={18} color="#F59E0B" />
                The Business Model & Revenue Streams
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{
                  backgroundColor: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  padding: '1.25rem'
                }}>
                  <span style={{
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    B2C CONSUMER (FREEMIUM)
                  </span>
                  <h4 style={{ margin: '10px 0 4px 0', fontSize: '20px', color: '#F8FAFC' }}>₹499 / month</h4>
                  <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#94A3B8' }}>
                    Purchased by adult working children (aged 28–50) for their parents.
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '12px', color: '#CBD5E1', lineHeight: 1.6 }}>
                    <li>Unlimited AI Voice Reminiscence & Prompts</li>
                    <li>Custom 3D VR Family Spatial Albums</li>
                    <li>Weekly Doctor Consultation PDF Export</li>
                    <li>Daily WhatsApp Orientation SMS/Alerts</li>
                  </ul>
                </div>

                <div style={{
                  backgroundColor: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  padding: '1.25rem'
                }}>
                  <span style={{
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    B2B ENTERPRISE (CARE HOMES)
                  </span>
                  <h4 style={{ margin: '10px 0 4px 0', fontSize: '20px', color: '#F8FAFC' }}>₹15,000 / month</h4>
                  <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#94A3B8' }}>
                    Licensed to Old Age Homes, Memory Care Facilities, and Geriatric Hospitals.
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '12px', color: '#CBD5E1', lineHeight: 1.6 }}>
                    <li>Multi-senior centralized monitoring dashboard</li>
                    <li>Nurse shift handover notes & agitation alerts</li>
                    <li>Sundowning sensory soundscape group therapy</li>
                    <li>Hardware bundled ($4 cardboard headsets)</li>
                  </ul>
                </div>

                <div style={{
                  backgroundColor: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  padding: '1.25rem'
                }}>
                  <span style={{
                    backgroundColor: '#D97706',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    GOVERNMENT & CSR GRANTS
                  </span>
                  <h4 style={{ margin: '10px 0 4px 0', fontSize: '20px', color: '#F8FAFC' }}>Grant Subsidies</h4>
                  <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#94A3B8' }}>
                    Ministry of Social Justice, North Eastern Council (NEC), and PSU CSR funds.
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '12px', color: '#CBD5E1', lineHeight: 1.6 }}>
                    <li>Pilot rollouts in District Senior Citizen Centers</li>
                    <li>Vernacular digital health inclusion initiatives</li>
                    <li>Zero-cost deployment for low-income rural seniors</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* The Ask */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '2px solid rgba(217, 119, 6, 0.5)',
              borderRadius: '14px',
              padding: '1.25rem 1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: '800', textTransform: 'uppercase' }}>The Investment Ask</span>
                <h3 style={{ margin: '4px 0', fontSize: '22px', color: '#FFFFFF' }}>
                  ₹50 Lakhs for 5% Equity <span style={{ fontSize: '15px', color: '#94A3B8' }}>(₹10 Cr Valuation)</span>
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#CBD5E1' }}>
                  Funds deployed for: (1) Clinical trial partnerships with AIIMS Guwahati, (2) Expanding into 8 North Eastern dialects, (3) GTM physician outreach.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('simulator')}
                style={{
                  backgroundColor: '#D97706',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Back to Live Demo ⚡
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Shark Q&A Defense Cards */}
        {activeTab === 'shark_qa' && (
          <div style={{
            padding: '2rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '16px', color: '#F8FAFC' }}>
              Anticipated Shark Questions & Golden Responses
            </h3>

            <div style={{
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <h4 style={{ margin: '0 0 6px 0', color: '#F59E0B', fontSize: '14px' }}>
                Shark: "Are you a medical device? What about CDSCO or FDA approvals?"
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5 }}>
                <strong>You:</strong> "No, Sharks. We are intentionally structured as a <strong>Digital Cognitive Wellness & Reminiscence Companion</strong>, not a diagnostic medical device. This enables immediate zero-friction consumer rollout without multi-year clinical trial delays, while partnering with neurologists as a non-pharmacological supportive therapy."
              </p>
            </div>

            <div style={{
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <h4 style={{ margin: '0 0 6px 0', color: '#F59E0B', fontSize: '14px' }}>
                Shark: "What prevents Apple, Google, or a ChatGPT wrapper from copying you tomorrow?"
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5 }}>
                <strong>You:</strong> "Three defensible moats: (1) <strong>Hyper-local cultural datasets:</strong> OpenAI or Apple have zero training corpora on regional customs like Sivasagar Satras, Rongali Bihu rituals, or Assamese dialects. (2) <strong>$4 Hardware Compatibility:</strong> Apple Vision Pro costs ₹3.5 Lakhs; Smriti Setu runs web-based 3D VR on a ₹300 cardboard viewer. (3) <strong>Offline-first edge AI:</strong> Our system runs in remote tea-garden villages with zero internet connectivity."
              </p>
            </div>

            <div style={{
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <h4 style={{ margin: '0 0 6px 0', color: '#F59E0B', fontSize: '14px' }}>
                Shark: "Who actually pays for this? The elderly have no income!"
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5 }}>
                <strong>You:</strong> "The user is the elder, but <strong>the payer is the working adult child (aged 28–50)</strong>. In India, 72% of dementia family caregivers experience intense emotional burnout and guilt when away at work. Paying ₹499/month for verified morning orientation and peace of mind is an impulse purchase for this demographic."
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
