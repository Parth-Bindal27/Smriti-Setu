import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Activity,
  Heart,
  AlertTriangle,
  PhoneCall,
  FileText,
  Clock,
  CheckCircle,
  Sparkles,
  RefreshCw,
  User,
  Zap,
  Volume2,
  VolumeX,
  Send,
  Eye,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { getSocket } from '../socket';

export default function NeurologicalSentinel({ apiUrl, profile, onRefreshAll }) {
  const [sentinelData, setSentinelData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeAlert, setActiveAlert] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [actionNotes, setActionNotes] = useState('');
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const socket = getSocket();
  const audioContextRef = useRef(null);
  const sirenIntervalRef = useRef(null);

  // Play urgent pulsating chime when Tier 3 acute alert arrives
  const playEmergencyTone = () => {
    if (isAudioMuted) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {}
  };

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${apiUrl}/api/health-monitoring/status`);
      if (res.ok) {
        const data = await res.json();
        setSentinelData(data);
        if (data.activeAlerts && data.activeAlerts.length > 0) {
          setActiveAlert(data.activeAlerts[0]);
          if (data.activeAlerts[0].escalationTier === 3) {
            playEmergencyTone();
          }
        } else {
          setActiveAlert(null);
        }
      }
    } catch (err) {
      console.warn('Failed to load sentinel data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    if (!socket) return;

    const handleHealthAlert = (payload) => {
      console.log('⚡ [Neurological Sentinel] Live Alert Received:', payload);
      fetchStatus();
      if (payload?.escalationTier === 3) {
        playEmergencyTone();
      }
    };

    socket.on('caregiver:health-alert', handleHealthAlert);

    return () => {
      socket.off('caregiver:health-alert', handleHealthAlert);
    };
  }, [socket]);

  // Trigger interactive simulation scenarios for Shark Tank demonstration
  const handleSimulate = async (scenario) => {
    try {
      setIsSimulating(true);
      const res = await fetch(`${apiUrl}/api/health-monitoring/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario })
      });
      if (res.ok) {
        await fetchStatus();
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResolve = async (actionTaken) => {
    try {
      const res = await fetch(`${apiUrl}/api/health-monitoring/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anomalyId: activeAlert?._id,
          actionTaken,
          note: actionNotes
        })
      });
      if (res.ok) {
        setActionNotes('');
        setIsActionModalOpen(false);
        await fetchStatus();
        if (onRefreshAll) onRefreshAll();
      }
    } catch (err) {
      console.error('Resolve error:', err);
    }
  };

  const riskLevel = sentinelData?.overallRiskLevel || 'OPTIMAL_GREEN';
  const emergencyProfile = sentinelData?.emergencyProfile;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1350px', margin: '0 auto' }}>
      {/* Top Banner & Status Header */}
      <div style={{
        backgroundColor: riskLevel === 'CRITICAL_RED'
          ? '#7F1D1D'
          : riskLevel === 'PERSISTENT_YELLOW'
            ? '#78350F'
            : '#0F172A',
        border: riskLevel === 'CRITICAL_RED'
          ? '2px solid #EF4444'
          : riskLevel === 'PERSISTENT_YELLOW'
            ? '2px solid #F59E0B'
            : '2px solid #334155',
        borderRadius: '20px',
        padding: '1.75rem 2rem',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: riskLevel === 'CRITICAL_RED'
          ? '0 12px 35px rgba(239, 68, 68, 0.4)'
          : '0 8px 24px rgba(15, 23, 42, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: riskLevel === 'CRITICAL_RED'
              ? '#DC2626'
              : riskLevel === 'PERSISTENT_YELLOW'
                ? '#D97706'
                : 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            flexShrink: 0
          }}>
            {riskLevel === 'CRITICAL_RED' ? (
              <ShieldAlert size={32} color="#FFFFFF" className="animate-pulse" />
            ) : riskLevel === 'PERSISTENT_YELLOW' ? (
              <AlertTriangle size={30} color="#FFFFFF" />
            ) : (
              <Activity size={30} color="#34D399" />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                Neurological Sentinel & Hemorrhage / Stroke Early Warning
              </h2>
              <span style={{
                backgroundColor: riskLevel === 'CRITICAL_RED'
                  ? '#EF4444'
                  : riskLevel === 'PERSISTENT_YELLOW'
                    ? '#F59E0B'
                    : '#10B981',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: '800',
                padding: '3px 10px',
                borderRadius: '6px',
                textTransform: 'uppercase'
              }}>
                {riskLevel === 'CRITICAL_RED'
                  ? '🚨 TIER 3: ACUTE RED FLAG'
                  : riskLevel === 'PERSISTENT_YELLOW'
                    ? '⚠️ TIER 2: 48h PERSISTENT ABNORMALITY'
                    : '● TIER 1: CALM BASELINE (NORMAL)'}
              </span>
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#E2E8F0', maxWidth: '750px', lineHeight: 1.5 }}>
              {sentinelData?.riskDescription || 'Continuous non-invasive biomarker surveillance for BE-FAST symptoms, tap tremor asymmetry, and persistent headaches.'}
            </p>
          </div>
        </div>

        {/* Top Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
            title={isAudioMuted ? 'Unmute Emergency Siren' : 'Mute Emergency Siren'}
          >
            {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span>{isAudioMuted ? 'Muted' : 'Siren On'}</span>
          </button>

          <button
            onClick={fetchStatus}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>Sync Sentinel</span>
          </button>
        </div>
      </div>

      {/* Active Critical Alert Escalation Action Card */}
      {activeAlert && (
        <div style={{
          backgroundColor: activeAlert.escalationTier === 3 ? '#FEF2F2' : '#FFFBEB',
          border: activeAlert.escalationTier === 3 ? '2px solid #EF4444' : '2px solid #F59E0B',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: activeAlert.escalationTier === 3 ? '#DC2626' : '#D97706',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldAlert size={24} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    backgroundColor: activeAlert.escalationTier === 3 ? '#DC2626' : '#D97706',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {activeAlert.escalationTier === 3 ? '🚨 TIER 3 EMERGENCY SOS' : '⚠️ TIER 2 PERSISTENT WARNING'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    Triggered: {new Date(activeAlert.timestamp).toLocaleTimeString()} • Persistence: {activeAlert.persistenceHours}h
                  </span>
                </div>

                <h3 style={{ margin: '6px 0', fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
                  {activeAlert.title}
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#334155', maxWidth: '850px', lineHeight: 1.5 }}>
                  {activeAlert.description}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons for Caregiver */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {activeAlert.escalationTier === 3 ? (
                <>
                  <a
                    href="tel:108"
                    style={{
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      padding: '10px 18px',
                      fontSize: '13px',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
                    }}
                  >
                    <PhoneCall size={16} />
                    <span>Call 108 Ambulance</span>
                  </a>

                  <a
                    href={`tel:${emergencyProfile?.emergencyContact?.phone || '+919864012345'}`}
                    style={{
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      fontSize: '13px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <PhoneCall size={15} />
                    <span>Call Primary ({emergencyProfile?.emergencyContact?.name?.split(' ')[0] || 'Deepak'})</span>
                  </a>
                </>
              ) : (
                <button
                  onClick={() => handleResolve('Scheduled Geriatrician Tele-Consultation with Dr. Hazarika')}
                  style={{
                    backgroundColor: '#D97706',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Calendar size={15} />
                  <span>Book Physician Tele-Consult</span>
                </button>
              )}

              <button
                onClick={() => handleResolve('Caregiver verified vitals and attended patient in person')}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <CheckCircle size={15} color="#059669" />
                <span>Mark Acknowledged</span>
              </button>
            </div>
          </div>

          {/* BE-FAST Stroke / Hemorrhage Rapid Clinical Markers Ribbon */}
          {activeAlert.beFastMarkers && (
            <div style={{
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>
                BE-FAST Protocol Evaluation:
              </span>

              {[
                { label: 'B - Balance', flagged: activeAlert.beFastMarkers.balance },
                { label: 'E - Eyes / Vision', flagged: activeAlert.beFastMarkers.eyes },
                { label: 'F - Facial Droop', flagged: activeAlert.beFastMarkers.face },
                { label: 'A - Arm / Motor Tapping', flagged: activeAlert.beFastMarkers.arms },
                { label: 'S - Speech / Dysarthria', flagged: activeAlert.beFastMarkers.speech },
                { label: 'T - Time (<60m Golden Hour)', flagged: true }
              ].map((m, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: m.flagged ? '#FEE2E2' : '#F1F5F9',
                    color: m.flagged ? '#DC2626' : '#64748B',
                    border: m.flagged ? '1px solid #FCA5A5' : '1px solid #E2E8F0',
                    fontSize: '11px',
                    fontWeight: m.flagged ? '800' : '500',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}
                >
                  {m.flagged ? '⚠️ ' : '✓ '} {m.label}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interactive Simulation Strip for Live Pitch / Demo Testing */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#D97706', textTransform: 'uppercase' }}>
            Interactive Demo & Pitch Triage Testing
          </span>
          <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Simulate how the system detects acute stroke/hemorrhage symptoms vs 48-hour persistent complaints
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleSimulate('tier_1')}
            disabled={isSimulating}
            style={{
              backgroundColor: '#F8FAFC',
              color: '#334155',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            1. Mild Tap Latency
          </button>

          <button
            onClick={() => handleSimulate('tier_2')}
            disabled={isSimulating}
            style={{
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              border: '1px solid #FCD34D',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            2. 48h Persistent Headache & Dizziness
          </button>

          <button
            onClick={() => handleSimulate('tier_3')}
            disabled={isSimulating}
            style={{
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
            }}
          >
            <Zap size={14} />
            <span>3. Acute Stroke / Hemorrhage Beacon</span>
          </button>
        </div>
      </div>

      {/* 3 Core Sentinel Biomarker Telemetry Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Card 1: Speech Dysarthria & Phoneme Hesitation */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(217, 119, 6, 0.12)',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Volume2 size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', color: '#0F172A' }}>Speech Dysarthria & Hesitation</h4>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>Acoustic voice analysis during morning gate</p>
              </div>
            </div>
            <span style={{
              backgroundColor: activeAlert?.metrics?.speechHesitationScore > 50 ? '#FEE2E2' : '#ECFDF5',
              color: activeAlert?.metrics?.speechHesitationScore > 50 ? '#DC2626' : '#059669',
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              {activeAlert?.metrics?.speechHesitationScore > 50 ? '⚠️ Slurring Detected' : 'Clear & Coherent'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: '800', color: activeAlert?.metrics?.speechHesitationScore > 50 ? '#DC2626' : '#0F172A' }}>
              {activeAlert?.metrics?.speechHesitationScore || 12}
            </span>
            <span style={{ fontSize: '12px', color: '#64748B' }}>/ 100 Hesitation Index</span>
          </div>

          <div style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            backgroundColor: '#E2E8F0',
            overflow: 'hidden',
            marginBottom: '10px'
          }}>
            <div style={{
              width: `${Math.min(100, activeAlert?.metrics?.speechHesitationScore || 12)}%`,
              height: '100%',
              backgroundColor: activeAlert?.metrics?.speechHesitationScore > 50 ? '#DC2626' : '#10B981',
              borderRadius: '4px',
              transition: 'width 0.3s'
            }}></div>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
            Measures phonetic coherence and word-finding delay. Baseline: &lt; 25. Slurring warning: &gt; 50.
          </p>
        </div>

        {/* Card 2: Bilateral Motor Tap Symmetry & Agility */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(37, 99, 235, 0.12)',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Activity size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', color: '#0F172A' }}>Bilateral Motor Tap Symmetry</h4>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>Left vs. right touch screen latency</p>
              </div>
            </div>
            <span style={{
              backgroundColor: (activeAlert?.metrics?.tapSymmetryRatio || 0.96) < 0.6 ? '#FEE2E2' : '#ECFDF5',
              color: (activeAlert?.metrics?.tapSymmetryRatio || 0.96) < 0.6 ? '#DC2626' : '#059669',
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              {(activeAlert?.metrics?.tapSymmetryRatio || 0.96) < 0.6 ? '⚠️ Hemiparesis Suspected' : 'Symmetric (Balanced)'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: '800', color: (activeAlert?.metrics?.tapSymmetryRatio || 0.96) < 0.6 ? '#DC2626' : '#0F172A' }}>
              {Math.round((activeAlert?.metrics?.tapSymmetryRatio || 0.96) * 100)}%
            </span>
            <span style={{ fontSize: '12px', color: '#64748B' }}>Bilateral Agility Ratio</span>
          </div>

          <div style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            backgroundColor: '#E2E8F0',
            overflow: 'hidden',
            marginBottom: '10px'
          }}>
            <div style={{
              width: `${Math.round((activeAlert?.metrics?.tapSymmetryRatio || 0.96) * 100)}%`,
              height: '100%',
              backgroundColor: (activeAlert?.metrics?.tapSymmetryRatio || 0.96) < 0.6 ? '#DC2626' : '#2563EB',
              borderRadius: '4px',
              transition: 'width 0.3s'
            }}></div>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
            Flags unilateral weakness in right/left arm movements during games. Critical marker for focal brain lesions.
          </p>
        </div>

        {/* Card 3: 48-Hour Persistent Symptom Sentinel */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(5, 150, 105, 0.12)',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', color: '#0F172A' }}>Persistent Symptom Tracker</h4>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>Longitudinal duration tracking (&gt;48h)</p>
              </div>
            </div>
            <span style={{
              backgroundColor: (activeAlert?.persistenceHours || 0) >= 48 ? '#FEF3C7' : '#EFF6FF',
              color: (activeAlert?.persistenceHours || 0) >= 48 ? '#B45309' : '#1D4ED8',
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              {(activeAlert?.persistenceHours || 0) >= 48 ? '⚠️ 48h Escalation Active' : 'Normal Pacing'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: '800', color: (activeAlert?.persistenceHours || 0) >= 48 ? '#D97706' : '#0F172A' }}>
              {activeAlert?.persistenceHours || 0} hrs
            </span>
            <span style={{ fontSize: '12px', color: '#64748B' }}>Duration Recorded</span>
          </div>

          <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#334155' }}>
            <strong>Persistence Protocol:</strong> Symptoms persisting beyond 48 hours automatically escalate to Tier 2 Physician Tele-Consultation to rule out subdural hematoma or micro-hemorrhage.
          </p>

          <span style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>
            ✓ Daily Orientation Gate: Completed this morning
          </span>
        </div>
      </div>

      {/* Emergency First Responder Medical Dossier Packet Preview */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#D97706" />
              Emergency Paramedic / 108 Emergency Dossier (Instant Export)
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>
              Pre-packaged critical clinical data ready for first responders during stroke golden hour
            </p>
          </div>

          <button
            onClick={() => window.print()}
            style={{
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileText size={14} />
            <span>Print Emergency Sheet</span>
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          backgroundColor: '#F8FAFC',
          borderRadius: '12px',
          padding: '1.25rem',
          border: '1px solid #E2E8F0',
          fontSize: '12px'
        }}>
          <div>
            <span style={{ color: '#64748B', fontWeight: '600' }}>Patient:</span>
            <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>
              {emergencyProfile?.name || 'Bhaben Baruah'} (Age 76)
            </p>
          </div>

          <div>
            <span style={{ color: '#64748B', fontWeight: '600' }}>Blood Group:</span>
            <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: '800', color: '#DC2626' }}>
              {emergencyProfile?.bloodGroup || 'O Positive (O+)'}
            </p>
          </div>

          <div>
            <span style={{ color: '#64748B', fontWeight: '600' }}>Current Medications:</span>
            <p style={{ margin: '2px 0 0 0', color: '#334155' }}>
              {emergencyProfile?.currentMedications?.join(', ') || 'Amlodipine 5mg, Ecosprin 75mg'}
            </p>
          </div>

          <div>
            <span style={{ color: '#64748B', fontWeight: '600' }}>Preferred Hospital:</span>
            <p style={{ margin: '2px 0 0 0', color: '#2563EB', fontWeight: '600' }}>
              {emergencyProfile?.emergencyHospital || 'GNRC Hospitals, Dispur'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
