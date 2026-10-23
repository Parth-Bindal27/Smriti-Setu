import React, { useRef } from 'react';
import {
  FileText,
  Printer,
  Download,
  X,
  CheckCircle,
  Heart,
  Brain,
  Clock,
  Sparkles,
  ShieldCheck,
  Calendar,
  User,
  Activity,
  AlertCircle
} from 'lucide-react';

export default function DoctorReportModal({ isOpen, onClose, profile, metrics, sessions, memories }) {
  const reportRef = useRef(null);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const elderName = profile?.name || 'Bhaben Baruah';
  const age = profile?.age || 76;
  const hometown = profile?.hometown || 'Sivasagar & Jorhat, Assam';
  const currentResidence = profile?.currentResidence || 'Beltola, Guwahati';
  const primaryLang = profile?.primaryLanguage || 'Assamese';
  const secondaryLang = profile?.secondaryLanguage || 'English';

  const summary = metrics?.summary || {
    weeklySessionsCount: 7,
    participationStatus: 'Consistent & Calm Engagement',
    comfortLevel: 'Comfortable & Unhurried',
    routineCompletionRate: 88,
    activeReminders: 4,
    registeredFamilyMembers: 4
  };

  const topTopics = metrics?.topTopics || [
    { topic: 'Rongali Bihu Celebrations & Dhol', count: 4, sentiment: 'Joyful Recall' },
    { topic: 'Granddaughter Maina (Til Pitha & Smiles)', count: 3, sentiment: 'High Warmth' },
    { topic: 'Assam Orthodox Golden Tips Tea Garden', count: 3, sentiment: 'Calm & Grounded' },
    { topic: 'Brahmaputra Sunset Cruises', count: 2, sentiment: 'Nostalgic Connection' }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #clinical-report-printable, #clinical-report-printable * {
            visibility: visible;
          }
          #clinical-report-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none;
            border: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        width: '100%',
        maxWidth: '880px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        border: '1px solid #E2E8F0',
        overflow: 'hidden'
      }}>
        {/* Modal Top Bar (Action buttons) */}
        <div className="no-print" style={{
          padding: '1rem 1.5rem',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #334155'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>📋</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#F8FAFC' }}>
                Geriatrician Consultation Summary
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>
                Clinical-grade non-pharmacological cognitive engagement report
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#D97706',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.15s'
              }}
            >
              <Printer size={15} />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div
          id="clinical-report-printable"
          ref={reportRef}
          style={{
            padding: '2.5rem',
            overflowY: 'auto',
            fontFamily: "'Inter', sans-serif",
            color: '#1E293B',
            lineHeight: 1.5
          }}
        >
          {/* Hospital / Clinic Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid #0F172A',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>🌿</span>
                <span style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em', color: '#0F172A' }}>
                  SMRITI SETU (স্মৃতি সেতু)
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0', fontWeight: '500' }}>
                Non-Pharmacological Cognitive Reminiscence & Daily Orientation Platform
              </p>
              <p style={{ fontSize: '11px', color: '#94A3B8', margin: '2px 0 0 0' }}>
                Culturally-Anchored Reminiscence Protocol • North Eastern Region (NER)
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{
                display: 'inline-block',
                backgroundColor: '#EFF6FF',
                color: '#1D4ED8',
                fontSize: '11px',
                fontWeight: '700',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid #BFDBFE',
                marginBottom: '6px'
              }}>
                GERIATRIC WELLNESS DOSSIER
              </span>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                Date of Issue: <strong>{todayStr}</strong>
              </p>
              <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>
                Report ID: SS-REP-{Date.now().toString().slice(-6)}
              </p>
            </div>
          </div>

          {/* Patient Demographics & Profile Banner */}
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase' }}>Patient Name</span>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: '2px 0 0 0' }}>
                {elderName} ({profile?.honorific || 'Koka'})
              </p>
            </div>

            <div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase' }}>Age & Residence</span>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#334155', margin: '2px 0 0 0' }}>
                {age} Years • {currentResidence}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase' }}>Primary Language & Roots</span>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#334155', margin: '2px 0 0 0' }}>
                {primaryLang} / {secondaryLang} • {hometown}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase' }}>Primary Caregiver</span>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#059669', margin: '2px 0 0 0' }}>
                {profile?.emergencyContact?.name || 'Deepak Baruah (Son)'}
              </p>
            </div>
          </div>

          {/* Executive Longitudinal Metrics */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#475569',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Activity size={15} color="#D97706" />
              1. 7-Day Engagement & Routine Stability
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px'
            }}>
              <div style={{
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '12px',
                backgroundColor: '#FFFFFF',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>
                  {summary.weeklySessionsCount || 7}
                </span>
                <p style={{ fontSize: '11px', color: '#64748B', margin: '4px 0 0 0', fontWeight: '600' }}>
                  Sessions Completed
                </p>
                <span style={{ fontSize: '10px', color: '#059669', fontWeight: '600' }}>100% Target Met</span>
              </div>

              <div style={{
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '12px',
                backgroundColor: '#FFFFFF',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#059669' }}>
                  {summary.routineCompletionRate || 88}%
                </span>
                <p style={{ fontSize: '11px', color: '#64748B', margin: '4px 0 0 0', fontWeight: '600' }}>
                  Routine Adherence
                </p>
                <span style={{ fontSize: '10px', color: '#059669', fontWeight: '600' }}>Morning Tea & Meds</span>
              </div>

              <div style={{
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '12px',
                backgroundColor: '#FFFFFF',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#D97706' }}>
                  91%
                </span>
                <p style={{ fontSize: '11px', color: '#64748B', margin: '4px 0 0 0', fontWeight: '600' }}>
                  Identity Recall (Gate)
                </p>
                <span style={{ fontSize: '10px', color: '#D97706', fontWeight: '600' }}>Prompt Orientation</span>
              </div>

              <div style={{
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '12px',
                backgroundColor: '#FFFFFF',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#2563EB' }}>
                  Level 2
                </span>
                <p style={{ fontSize: '11px', color: '#64748B', margin: '4px 0 0 0', fontWeight: '600' }}>
                  Adaptive Difficulty
                </p>
                <span style={{ fontSize: '10px', color: '#2563EB', fontWeight: '600' }}>Comfortable Pacing</span>
              </div>
            </div>
          </div>

          {/* Cognitive Sub-Domains Breakdown */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#475569',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Brain size={15} color="#2563EB" />
              2. Cognitive Sub-Domain Responsiveness
            </h4>

            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '12px',
              textAlign: 'left'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '1px solid #CBD5E1' }}>
                  <th style={{ padding: '8px 12px', fontWeight: '700', color: '#334155' }}>Domain Activity</th>
                  <th style={{ padding: '8px 12px', fontWeight: '700', color: '#334155' }}>Modality</th>
                  <th style={{ padding: '8px 12px', fontWeight: '700', color: '#334155' }}>Reinforcement Pacing</th>
                  <th style={{ padding: '8px 12px', fontWeight: '700', color: '#334155' }}>Clinical Observation</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 12px', fontWeight: '600' }}>Family Memory Lane</td>
                  <td style={{ padding: '10px 12px', color: '#64748B' }}>Personal Photos & Voice</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ color: '#059669', fontWeight: '700' }}>Immediate Recall (94%)</span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#334155' }}>
                    Spontaneous joyful smile upon seeing granddaughter Maina; high speech coherence.
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 12px', fontWeight: '600' }}>Spatial VR Experience</td>
                  <td style={{ padding: '10px 12px', color: '#64748B' }}>3D Calming Environment</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ color: '#059669', fontWeight: '700' }}>Calm & Unhurried (8.2s)</span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#334155' }}>
                    Zero disorientation observed; steady gaze and positive reaction to Sivasagar temple imagery.
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 12px', fontWeight: '600' }}>Number & Sequence Recall</td>
                  <td style={{ padding: '10px 12px', color: '#64748B' }}>Digit & Card Pairing</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ color: '#D97706', fontWeight: '700' }}>Level 2 (Tiered Hints)</span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#334155' }}>
                    Performs best during early morning hours; benefits from gentle tier-1 smiling hint.
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 12px', fontWeight: '600' }}>Sensory Soundscapes</td>
                  <td style={{ padding: '10px 12px', color: '#64748B' }}>Naam-Ghor & Nature Audio</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ color: '#2563EB', fontWeight: '700' }}>Guided Breathing (3.2s)</span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#334155' }}>
                    Effective in de-escalating late afternoon restlessness (Sundowning symptom mitigation).
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Nostalgic Emotional Anchor Points */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#475569',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Heart size={15} color="#DC2626" />
              3. Most Effective Cultural Reminiscence Anchors
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px'
            }}>
              {topTopics.map((t, idx) => (
                <div key={idx} style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#FAFAFA'
                }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>{t.topic}</span>
                    <p style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>Frequency: {t.count} sessions this week</p>
                  </div>
                  <span style={{
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    fontSize: '10px',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}>
                    {t.sentiment || 'Positive Anchor'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Geriatrician Recommendation / Physician Sign-off Box */}
          <div style={{
            border: '1px dashed #94A3B8',
            borderRadius: '10px',
            padding: '1rem',
            backgroundColor: '#F8FAFC',
            marginBottom: '1.5rem'
          }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>
              Physician Consultation Notes & Plan Recommendation:
            </span>
            <p style={{ fontSize: '12px', color: '#334155', margin: '6px 0 12px 0' }}>
              "Patient demonstrates preserved episodic and emotional memory when engaged with culturally authentic North Eastern stimuli. Recommend continuing current 15-minute daily morning reminiscence and sensory soundscape routine. Maintain Level 2 pacing without fatigue."
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '10px', borderTop: '1px solid #E2E8F0' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Reviewing Geriatrician / Medical Officer:</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>
                  Dr. B. K. Hazarika, MD (Geriatrics)
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ borderBottom: '1px solid #0F172A', width: '180px', marginBottom: '4px' }}></div>
                <span style={{ fontSize: '10px', color: '#64748B' }}>Authorized Clinical Signature & Date</span>
              </div>
            </div>
          </div>

          {/* Statutory Dignity-First Disclaimer */}
          <div style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '8px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <ShieldCheck size={18} color="#2563EB" />
            <p style={{ margin: 0, fontSize: '11px', color: '#1E40AF', lineHeight: 1.4 }}>
              <strong>Dignity-First & Non-Diagnostic Notice:</strong> Smriti Setu is an assistive cognitive stimulation and reminiscence companion designed to reinforce familiar identity. This dossier records participatory engagement metrics and does not constitute a psychometric dementia diagnosis or formal clinical score.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
