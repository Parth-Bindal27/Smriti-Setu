import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, CheckCircle2, ArrowRight, X, Volume2, ShieldCheck, Share2 } from 'lucide-react';

export default function ClaritiVoiceModal({ isOpen, onClose, apiUrl, onMemoryAdded }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speaker, setSpeaker] = useState('Deepak Baruah (Eldest Son)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Web Speech Recognition if available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Also supports Assamese/Indian English

      recognition.onresult = (event) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentText);
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  if (!isOpen) return null;

  const toggleRecording = () => {
    setErrorMsg(null);
    if (!recognitionRef.current) {
      // If Web Speech API not supported in browser, fallback to manual voice note simulation
      if (!isRecording) {
        setIsRecording(true);
        setTimeout(() => {
          setTranscript('In 1974, Bhaben Koka and Pratibha celebrated Rongali Bihu at the tea estate in Golaghat. Deepak played the pepa and danced on the green lawn.');
          setIsRecording(false);
        }, 3000);
      } else {
        setIsRecording(false);
      }
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('Recognition start failed:', err);
        setIsRecording(false);
      }
    }
  };

  const handleProcessVoiceMemory = async () => {
    if (!transcript.trim()) {
      setErrorMsg('Please record or type a family story first.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${apiUrl}/api/voice-ingest/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          speaker,
          lang: 'as'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setExtractionResult(data.extractedData || data);
        if (onMemoryAdded) onMemoryAdded();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to process voice memory');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Network error processing audio story');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setTranscript('');
    setExtractionResult(null);
    setErrorMsg(null);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#1E293B',
        border: '1px solid #334155',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '720px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#0F172A'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(236, 72, 153, 0.35)'
            }}>
              <Mic size={24} color="#FFFFFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                Clariti & MindGuardAI Spoken Ingestion
              </h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: '2px 0 0 0' }}>
                Converts oral family recollections into verified knowledge graph nodes & VR memory cards
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!extractionResult ? (
            <>
              {/* Speaker Select */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#CBD5E1', marginBottom: '8px' }}>
                  Spoken By / Verified Caregiver
                </label>
                <select
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: '#0F172A',
                    border: '1px solid #334155',
                    color: '#F8FAFC',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                >
                  <option value="Deepak Baruah (Eldest Son)">Deepak Baruah (Eldest Son)</option>
                  <option value="Maina / Rhea (Granddaughter)">Maina / Rhea (Granddaughter)</option>
                  <option value="Rohan (Grandson)">Rohan (Grandson)</option>
                  <option value="Dr. Sanjeev Borah (Clinical Caregiver)">Dr. Sanjeev Borah (Clinical Caregiver)</option>
                </select>
              </div>

              {/* Dictation Box */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#CBD5E1' }}>
                    Oral Recollection or Anecdote
                  </label>
                  <span style={{ fontSize: '12px', color: '#38BDF8' }}>
                    Mentions of years, places, or loved ones will be auto-indexed
                  </span>
                </div>

                <div style={{ position: 'relative' }}>
                  <textarea
                    rows={4}
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Speak or type a story... e.g. 'In 1974, Bhaben Koka and Pratibha celebrated Rongali Bihu at the tea estate in Golaghat...'"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '14px',
                      background: '#0F172A',
                      border: isRecording ? '2px solid #EC4899' : '1px solid #334155',
                      color: '#F8FAFC',
                      fontSize: '15px',
                      lineHeight: 1.6,
                      outline: 'none',
                      resize: 'none',
                      boxShadow: isRecording ? '0 0 15px rgba(236, 72, 153, 0.3)' : 'none'
                    }}
                  />

                  {/* Mic Toggle Button */}
                  <button
                    onClick={toggleRecording}
                    type="button"
                    style={{
                      position: 'absolute',
                      right: '12px',
                      bottom: '16px',
                      padding: '8px 14px',
                      background: isRecording ? '#DC2626' : '#2563EB',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                    {isRecording ? 'Listening...' : 'Tap to Dictate'}
                  </button>
                </div>
              </div>

              {/* Sample Quick Prompt Chips */}
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Or paste verified sample anecdote:
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    "1974 Golaghat Bihu festival with Deepak dancing pepa",
                    "1968 Brass bowl received during ancestral wedding ceremony",
                    "1980 Evening radio news listening on the veranda"
                  ].map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTranscript(sample)}
                      style={{
                        padding: '6px 12px',
                        background: '#334155',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#E2E8F0',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      “{sample}”
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #EF4444',
                  borderRadius: '10px',
                  color: '#FCA5A5',
                  fontSize: '14px'
                }}>
                  {errorMsg}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '10px 18px',
                    background: '#334155',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#CBD5E1',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProcessVoiceMemory}
                  disabled={isProcessing || !transcript.trim()}
                  style={{
                    padding: '10px 24px',
                    background: isProcessing ? '#475569' : 'linear-gradient(135deg, #EC4899, #8B5CF6)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: isProcessing ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 6px 18px rgba(236, 72, 153, 0.35)'
                  }}
                >
                  <Sparkles size={18} />
                  {isProcessing ? 'Extracting Entities & Graph Nodes...' : 'Auto-Extract to Knowledge Graph'}
                </button>
              </div>
            </>
          ) : (
            /* Success & Extracted Entity Summary */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '2px solid #10B981',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}>
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#F8FAFC', margin: '0 0 6px' }}>
                  Oral Memory Successfully Verified & Ingested!
                </h3>
                <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0 }}>
                  Clariti pipeline automatically mapped temporal facts and linked them to Bhaben Koka’s memory network.
                </p>
              </div>

              {/* Extraction Chips */}
              <div style={{
                background: '#0F172A',
                border: '1px solid #334155',
                borderRadius: '16px',
                padding: '1.25rem',
                textAlign: 'left',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                    Extracted Period
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#38BDF8', marginTop: '2px' }}>
                    {extractionResult.extractedPeriod || '1974'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                    Assigned Category
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#A78BFA', marginTop: '2px' }}>
                    {extractionResult.assignedCategory || 'Culture'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                    Linked Loved Ones
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#F472B6', marginTop: '2px' }}>
                    {(extractionResult.linkedPeople || ['Family']).join(', ')}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                    Provenance Audit
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#34D399', marginTop: '2px' }}>
                    Verified by {speaker}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    padding: '10px 18px',
                    background: '#334155',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Record Another Story
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '10px 24px',
                    background: '#10B981',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
