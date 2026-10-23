import React, { useState, useEffect } from 'react';
import { Bot, HeartHandshake, ShieldCheck, FileText, Send, Sparkles, BookOpen, AlertCircle, CheckCircle2, Copy } from 'lucide-react';

export default function CaregiverCopilot({ apiUrl }) {
  const [selectedScenario, setSelectedScenario] = useState('sundowning');
  const [councilAdvice, setCouncilAdvice] = useState(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  // Journal State
  const [journalEntries, setJournalEntries] = useState([]);
  const [newObservation, setNewObservation] = useState('');
  const [newMood, setNewMood] = useState('Anxious / Restless');
  const [newTimeOfDay, setNewTimeOfDay] = useState('Evening (Sundowning Period)');
  const [isSubmittingJournal, setIsSubmittingJournal] = useState(false);

  // SBAR Modal / View
  const [sbarData, setSbarData] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const fetchAdvice = async (scenario) => {
    setIsLoadingAdvice(true);
    try {
      const res = await fetch(`${apiUrl}/api/copilot/deescalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioType: scenario })
      });
      if (res.ok) {
        setCouncilAdvice(await res.json());
      }
    } catch (err) {
      console.warn('Failed to load de-escalation advice:', err);
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  const fetchJournal = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/copilot/journal`);
      if (res.ok) {
        const data = await res.json();
        setJournalEntries(data.entries || []);
      }
    } catch (err) {
      console.warn('Failed to fetch journal:', err);
    }
  };

  const fetchSbar = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/copilot/sbar-report`);
      if (res.ok) {
        const data = await res.json();
        setSbarData(data.sbar);
      }
    } catch (err) {
      console.warn('Failed to generate SBAR report:', err);
    }
  };

  useEffect(() => {
    fetchAdvice(selectedScenario);
    fetchJournal();
    fetchSbar();
  }, [apiUrl]);

  const handleScenarioChange = (scenario) => {
    setSelectedScenario(scenario);
    fetchAdvice(scenario);
  };

  const handleAddJournalEntry = async (e) => {
    e.preventDefault();
    if (!newObservation.trim()) return;

    setIsSubmittingJournal(true);
    try {
      const res = await fetch(`${apiUrl}/api/copilot/journal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          observation: newObservation,
          elderMood: newMood,
          timeOfDay: newTimeOfDay
        })
      });
      if (res.ok) {
        setNewObservation('');
        fetchJournal();
        fetchSbar();
      }
    } catch (err) {
      console.warn('Failed to submit journal entry:', err);
    } finally {
      setIsSubmittingJournal(false);
    }
  };

  const copySbarText = () => {
    if (!sbarData) return;
    const text = `SBAR CLINICAL HANDOFF REPORT
Patient: ${sbarData.patientName} (Age: ${sbarData.age})
Caregiver: ${sbarData.primaryCaregiver}

SITUATION:
${sbarData.clinicianHandoff.situation}

BACKGROUND:
${sbarData.clinicianHandoff.background}

ASSESSMENT:
- Predominant Mood: ${sbarData.clinicianHandoff.assessment.predominantMood}
- Trigger Prevalence: ${sbarData.clinicianHandoff.assessment.triggerPrevalence}
- Biomarker Status: ${sbarData.clinicianHandoff.assessment.biomarkerStatus}
- Ground Truth Ratio: ${sbarData.clinicianHandoff.assessment.memoryGraphGroundTruthRatio}

RECOMMENDATION:
1. ${sbarData.clinicianHandoff.recommendation.action1}
2. ${sbarData.clinicianHandoff.recommendation.action2}
3. ${sbarData.clinicianHandoff.recommendation.action3}
`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
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
            background: 'linear-gradient(135deg, #059669, #047857)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '26px',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)'
          }}>
            🤝
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Caregiver AI Co-Pilot & "Council of Care" Advisor
              </h1>
              <span className="badge-pill badge-green">
                DASH Lab & AI-DEVA Inspired
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
              Evidence-grounded behavioral de-escalation scripts, trigger tracking, and automated physician SBAR summaries.
            </p>
          </div>
        </div>

        <button
          onClick={copySbarText}
          style={{
            background: '#0F172A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 10px rgba(15, 23, 42, 0.2)'
          }}
        >
          <Copy size={16} />
          {isCopied ? 'Copied SBAR Report!' : 'Export SBAR Doctor Briefing'}
        </button>
      </div>

      {/* Main Grid: Live De-escalation Council (Left) & Observation Journal (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Column: Behavioral De-escalation Protocol Suite */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '2px solid var(--border-color)',
          padding: '1.75rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: '0 0 6px 0' }}>
              Active Symptom & De-escalation Scenario
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              Select what is currently occurring. The 3-agent Council delivers non-pharmacological care protocols.
            </p>
          </div>

          {/* Scenario Selector Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {[
              { id: 'sundowning', label: '🌅 Twilight Sundowning (5-7 PM)' },
              { id: 'repetitive_questioning', label: '🔁 Repetitive Questioning' },
              { id: 'wandering_anxiety', label: '🚶 Urgent Wandering Impulse' },
              { id: 'agitation_restlessness', label: '⚡ Agitation / Restlessness' }
            ].map((sc) => (
              <button
                key={sc.id}
                onClick={() => handleScenarioChange(sc.id)}
                style={{
                  background: selectedScenario === sc.id ? '#059669' : '#F1F5F9',
                  color: selectedScenario === sc.id ? '#FFFFFF' : '#334155',
                  border: selectedScenario === sc.id ? '2px solid #047857' : '1px solid #CBD5E1',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {sc.label}
              </button>
            ))}
          </div>

          {/* Council of Care Breakdown */}
          {isLoadingAdvice ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
              Consulting Multi-Agent Care Council...
            </div>
          ) : councilAdvice ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Agent 1: Clinical Non-Pharmacological Specialist */}
              <div style={{
                background: '#F0FDF4',
                border: '2px solid #BBF7D0',
                borderRadius: '16px',
                padding: '14px 18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <ShieldCheck size={18} color="#059669" />
                  <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#065F46', margin: 0 }}>
                    1. Geriatric Non-Pharmacological Strategy
                  </h4>
                </div>
                <p style={{ fontSize: '14px', color: '#166534', lineHeight: '1.5', margin: 0 }}>
                  {councilAdvice.councilAgents?.agentGeriatric?.advice}
                </p>
              </div>

              {/* Agent 2: Native Empathy Script (What to say) */}
              <div style={{
                background: '#FEF3C7',
                border: '2px solid #FDE68A',
                borderRadius: '16px',
                padding: '14px 18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Bot size={18} color="#D97706" />
                  <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#92400E', margin: 0 }}>
                    2. Exact Reassuring Script (What to Say)
                  </h4>
                </div>
                <p style={{ fontSize: '15px', color: '#78350F', lineHeight: '1.5', margin: '0 0 8px 0', fontWeight: '600', fontStyle: 'italic' }}>
                  "{councilAdvice.councilAgents?.agentEmpathy?.script}"
                </p>
                {councilAdvice.councilAgents?.agentEmpathy?.vernacularAssameseScript && (
                  <div style={{ background: 'rgba(255,255,255,0.7)', padding: '8px 12px', borderRadius: '10px', fontSize: '13px', color: '#92400E' }}>
                    <strong>অসমীয়া সংলাপ: </strong> "{councilAdvice.councilAgents.agentEmpathy.vernacularAssameseScript}"
                  </div>
                )}
              </div>

              {/* Agent 3: Safety Sentinel (What to avoid) */}
              <div style={{
                background: '#FEF2F2',
                border: '2px solid #FECACA',
                borderRadius: '16px',
                padding: '14px 18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <AlertCircle size={18} color="#DC2626" />
                  <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#991B1B', margin: 0 }}>
                    3. Safety Sentinel: What NEVER to Do
                  </h4>
                </div>
                <p style={{ fontSize: '13px', color: '#B91C1C', lineHeight: '1.5', margin: 0 }}>
                  {councilAdvice.councilAgents?.agentSafety?.guidelines}
                </p>
              </div>

              {/* Sensory Redirection Hook */}
              <div style={{
                background: '#EFF6FF',
                border: '1.5px solid #BFDBFE',
                borderRadius: '14px',
                padding: '10px 14px',
                fontSize: '13px',
                color: '#1E40AF',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Sparkles size={16} />
                <span>Recommended Sensory Hook: <strong>{councilAdvice.recommendedSensoryHook}</strong></span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Right Column: Daily Caregiver Journal & Trigger Logger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* New Observation Input */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '2px solid var(--border-color)',
            padding: '1.5rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="#059669" />
              Log Daily Observation
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 12px 0' }}>
              Notes are parsed by AI to extract behavioral triggers and update clinical trendlines.
            </p>

            <form onSubmit={handleAddJournalEntry}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                <select
                  value={newTimeOfDay}
                  onChange={e => setNewTimeOfDay(e.target.value)}
                  style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                >
                  <option value="Morning">Morning (8 AM - 12 PM)</option>
                  <option value="Afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="Evening (Sundowning Period)">Evening / Sundowning (5 PM - 8 PM)</option>
                  <option value="Night">Night (Post 8 PM)</option>
                </select>

                <select
                  value={newMood}
                  onChange={e => setNewMood(e.target.value)}
                  style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                >
                  <option value="Calm & Joyful">Calm & Joyful</option>
                  <option value="Slightly Confused">Slightly Confused</option>
                  <option value="Anxious / Restless">Anxious / Restless</option>
                  <option value="Agitated / Pacing">Agitated / Pacing</option>
                  <option value="Withdrawn / Fatigued">Withdrawn / Fatigued</option>
                </select>
              </div>

              <textarea
                value={newObservation}
                onChange={e => setNewObservation(e.target.value)}
                placeholder="e.g. Koka was pacing near the front door at 6 PM asking where his bicycle from the tea estate was..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13px',
                  marginBottom: '10px',
                  boxSizing: 'border-box'
                }}
              />

              <button
                type="submit"
                disabled={isSubmittingJournal || !newObservation.trim()}
                style={{
                  width: '100%',
                  background: '#059669',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Send size={15} />
                {isSubmittingJournal ? 'Logging & Parsing...' : 'Log Observation with AI Trigger Extraction'}
              </button>
            </form>
          </div>

          {/* Recent Journal History */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '2px solid var(--border-color)',
            padding: '1.5rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', margin: '0 0 12px 0' }}>
              Recent Care Observations & AI Insights ({journalEntries.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '360px', overflowY: 'auto' }}>
              {journalEntries.map(entry => (
                <div
                  key={entry._id}
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '14px',
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#059669' }}>
                      {entry.timeOfDay} • {entry.elderMood}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#1E293B', margin: '0 0 6px 0', lineHeight: '1.4' }}>
                    {entry.observation}
                  </p>
                  {entry.triggersIdentified?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                      {entry.triggersIdentified.map((trig, idx) => (
                        <span key={idx} style={{
                          background: '#E2E8F0',
                          color: '#475569',
                          fontSize: '10px',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: '100px'
                        }}>
                          🏷️ {trig}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
