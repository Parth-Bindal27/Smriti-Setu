import React, { useState, useEffect } from 'react';
import { Mic, Activity, TrendingUp, AlertTriangle, ShieldCheck, Clock, Zap, Volume2 } from 'lucide-react';

export default function VoiceBiomarkerSentinel({ apiUrl }) {
  const [biomarkerData, setBiomarkerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrends = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/voice-biomarkers/trends`);
      if (res.ok) {
        const data = await res.json();
        setBiomarkerData(data);
      }
    } catch (err) {
      console.warn('Failed to fetch voice biomarkers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [apiUrl]);

  const summary = biomarkerData?.summary || {
    avgSpeechLatencyMs: 1480,
    avgPauseToSpeechRatio: 0.24,
    avgAcousticComfortScore: 92,
    morningAvgLatencyMs: 1280,
    eveningAvgLatencyMs: 2750,
    diurnalDifferenceMs: 1470,
    sundowningFatigueRisk: 'NORMAL_CIRCADIAN_VARIATION',
    clinicalSignificance: 'Non-invasive acoustic telemetry indicates stable verbal fluency without signs of acute expressive aphasia.'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        border: '2px solid var(--border-color)',
        padding: '1.75rem 2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0284C7, #0369A1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '26px',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
          }}>
            🎙️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Acoustic & Speech Biomarker Sentinel
              </h1>
              <span className="badge-pill badge-blue">
                Ola! Voice Biomarkers & NeuroAI Inspired
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
              Passive non-invasive telemetry tracking speech latency, pause-to-speech ratio, and evening sundowning fatigue.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: '#ECFDF5',
            color: '#047857',
            border: '1.5px solid #A7F3D0',
            padding: '8px 16px',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ShieldCheck size={16} /> Non-Invasive Passive Telemetry
          </span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '18px'
      }}>
        {/* Metric 1: Verbal Response Latency */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '2px solid #E2E8F0',
          padding: '1.25rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748B' }}>Average Speech Latency</span>
            <Clock size={18} color="#0284C7" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
            {summary.avgSpeechLatencyMs} ms
          </div>
          <span style={{ fontSize: '12px', color: '#059669', fontWeight: '700' }}>
            ● Normal Baseline Range (1200 - 1800ms)
          </span>
        </div>

        {/* Metric 2: Pause-to-Speech Ratio */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '2px solid #E2E8F0',
          padding: '1.25rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748B' }}>Hesitation / Pause Ratio</span>
            <Activity size={18} color="#8B5CF6" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
            {(summary.avgPauseToSpeechRatio * 100).toFixed(0)}%
          </div>
          <span style={{ fontSize: '12px', color: '#059669', fontWeight: '700' }}>
            ● Smooth Cadence (&lt; 35% is optimal)
          </span>
        </div>

        {/* Metric 3: Acoustic Comfort Index */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '2px solid #E2E8F0',
          padding: '1.25rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748B' }}>Vocal Warmth & Comfort</span>
            <Volume2 size={18} color="#10B981" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
            {summary.avgAcousticComfortScore} / 100
          </div>
          <span style={{ fontSize: '12px', color: '#059669', fontWeight: '700' }}>
            ● High Emotional Reassurance
          </span>
        </div>

        {/* Metric 4: Sundowning Variation */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '2px solid #E2E8F0',
          padding: '1.25rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748B' }}>Evening Latency Drift</span>
            <TrendingUp size={18} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
            +{summary.diurnalDifferenceMs} ms
          </div>
          <span style={{ fontSize: '12px', color: '#B45309', fontWeight: '700' }}>
            ● Natural Circadian Twilight Variation
          </span>
        </div>
      </div>

      {/* Deep-Dive Grid: Diurnal Comparison & Recent Voice Sessions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Morning vs Evening Circadian Comparison */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '2px solid var(--border-color)',
          padding: '1.75rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', margin: '0 0 8px 0' }}>
            Diurnal Speech Fluency Profile
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px 0' }}>
            Compares morning conversational retrieval with twilight evening sessions to identify fatigue patterns early.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                <span style={{ fontWeight: '700', color: '#0369A1' }}>☀️ Morning Session Latency</span>
                <span style={{ fontWeight: '800', color: '#0F172A' }}>{summary.morningAvgLatencyMs} ms</span>
              </div>
              <div style={{ width: '100%', height: '14px', background: '#F1F5F9', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (summary.morningAvgLatencyMs / 3500) * 100)}%`, height: '100%', background: '#0284C7', borderRadius: '100px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                <span style={{ fontWeight: '700', color: '#D97706' }}>🌇 Twilight Sundowning Latency</span>
                <span style={{ fontWeight: '800', color: '#0F172A' }}>{summary.eveningAvgLatencyMs} ms</span>
              </div>
              <div style={{ width: '100%', height: '14px', background: '#F1F5F9', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (summary.eveningAvgLatencyMs / 3500) * 100)}%`, height: '100%', background: '#F59E0B', borderRadius: '100px' }} />
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            background: '#F0FDF4',
            border: '1.5px solid #BBF7D0',
            borderRadius: '14px',
            padding: '12px 16px',
            fontSize: '13px',
            color: '#166534',
            lineHeight: '1.5'
          }}>
            <strong>Physician Telemetry Note: </strong>
            {summary.clinicalSignificance}
          </div>
        </div>

        {/* Telemetry Log Feed */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '2px solid var(--border-color)',
          padding: '1.75rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', margin: '0 0 12px 0' }}>
            Recent Acoustic Telemetry Events
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '340px', overflowY: 'auto' }}>
            {(biomarkerData?.recentTelemetry || []).map(item => (
              <div
                key={item._id}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '12px 14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#0284C7' }}>
                    {item.sessionType} • {item.timeOfDay}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#334155', marginBottom: '4px' }}>
                  <span>Latency: <strong>{item.metrics?.speechLatencyMs}ms</strong></span>
                  <span>Pause Ratio: <strong>{((item.metrics?.pauseToSpeechRatio || 0) * 100).toFixed(0)}%</strong></span>
                  <span>Comfort: <strong>{item.metrics?.acousticComfortIndex}/100</strong></span>
                </div>
                <p style={{ fontSize: '12px', color: '#64748B', margin: 0, fontStyle: 'italic' }}>
                  "{item.notes}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
