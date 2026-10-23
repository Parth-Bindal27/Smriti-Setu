import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, ShieldCheck, Save, Heart, Sparkles } from 'lucide-react';

export default function ProfileSettings({ profile, onRefresh, apiUrl }) {
  const [form, setForm] = useState({
    name: 'Bhaben Baruah',
    honorific: 'Koka',
    greetingTitle: 'Suprabhat',
    hometown: 'Sivasagar & Jorhat, Assam',
    currentResidence: 'Beltola, Guwahati',
    primaryLanguage: 'Assamese',
    secondaryLanguage: 'English',
    comfortNotes: 'Responds warmly to memories of the Sivasagar historic tank, Rongali Bihu dhol beats, and childhood tea gardens.',
    emergencyName: 'Deepak Baruah (Son)',
    emergencyPhone: '+91 98640 12345'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || 'Bhaben Baruah',
        honorific: profile.honorific || 'Koka',
        greetingTitle: profile.greetingTitle || 'Suprabhat',
        hometown: profile.hometown || 'Sivasagar & Jorhat, Assam',
        currentResidence: profile.currentResidence || 'Beltola, Guwahati',
        primaryLanguage: profile.primaryLanguage || 'Assamese',
        secondaryLanguage: profile.secondaryLanguage || 'English',
        comfortNotes: profile.comfortNotes || '',
        emergencyName: profile.emergencyContact?.name || 'Deepak Baruah (Son)',
        emergencyPhone: profile.emergencyContact?.phone || '+91 98640 12345'
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch(`${apiUrl}/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          honorific: form.honorific,
          greetingTitle: form.greetingTitle,
          hometown: form.hometown,
          currentResidence: form.currentResidence,
          primaryLanguage: form.primaryLanguage,
          secondaryLanguage: form.secondaryLanguage,
          comfortNotes: form.comfortNotes,
          emergencyContact: {
            name: form.emergencyName,
            relation: 'Primary Caregiver',
            phone: form.emergencyPhone
          }
        })
      });

      if (res.ok) {
        setSuccess(true);
        onRefresh();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="exec-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '20px', color: '#FFFFFF' }}>Elderly Profile & Regional Sensitivity</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Personalize greetings, honorifics, and cultural touchpoints for the Elderly Support Site.
            </p>
          </div>
          <div className="badge-pill badge-emerald">
            NER Sensitivity Configured
          </div>
        </div>

        {success && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: '#34D399',
            fontSize: '14px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={16} />
            <span>Profile successfully updated! Changes are reflected immediately on the Elderly Site.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Elder's Full Name:
              </label>
              <input
                type="text"
                className="input-dark"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Cultural Honorific:
              </label>
              <select
                className="input-dark"
                value={form.honorific}
                onChange={(e) => setForm({ ...form, honorific: e.target.value })}
              >
                <option value="Koka">Koka (Grandfather - Assamese)</option>
                <option value="Aita">Aita (Grandmother - Assamese)</option>
                <option value="Deuta">Deuta (Father - Assamese)</option>
                <option value="Maa">Maa (Mother)</option>
                <option value="Dadu">Dadu (Grandfather - Bengali)</option>
                <option value="Thakuma">Thakuma (Grandmother - Bengali)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Birthplace / Ancestral Hometown:
              </label>
              <input
                type="text"
                className="input-dark"
                value={form.hometown}
                onChange={(e) => setForm({ ...form, hometown: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Current Residence:
              </label>
              <input
                type="text"
                className="input-dark"
                value={form.currentResidence}
                onChange={(e) => setForm({ ...form, currentResidence: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Primary Language / Dialect:
              </label>
              <select
                className="input-dark"
                value={form.primaryLanguage}
                onChange={(e) => setForm({ ...form, primaryLanguage: e.target.value })}
              >
                <option value="Assamese">অসমীয়া (Assamese)</option>
                <option value="English">English</option>
                <option value="Nepali">नेपाली (Nepali)</option>
                <option value="Bengali">বাংলা (Bengali)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Greeting Title:
              </label>
              <input
                type="text"
                className="input-dark"
                value={form.greetingTitle}
                onChange={(e) => setForm({ ...form, greetingTitle: e.target.value })}
                placeholder="e.g. Suprabhat, Namaskar"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Comfort & Nostalgia Notes:
            </label>
            <textarea
              className="input-dark"
              rows={3}
              value={form.comfortNotes}
              onChange={(e) => setForm({ ...form, comfortNotes: e.target.value })}
            />
          </div>

          <div style={{ borderTop: '1px solid #28374D', paddingTop: '14px' }}>
            <h4 style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '10px' }}>Emergency Contact:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Contact Name & Relation:
                </label>
                <input
                  type="text"
                  className="input-dark"
                  value={form.emergencyName}
                  onChange={(e) => setForm({ ...form, emergencyName: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Phone Number:
                </label>
                <input
                  type="tel"
                  className="input-dark"
                  value={form.emergencyPhone}
                  onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="submit" className="btn-indigo" disabled={loading}>
              <Save size={16} />
              <span>{loading ? 'Saving...' : 'Update Profile in MongoDB'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Adaptive Dashboard & Caregiver Governance Card */}
      <div className="exec-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '20px', color: '#FFFFFF' }}>Adaptive Dashboard & Accessibility Governance</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Configure real-time accessibility, language, and activity guardrails for the elderly dashboard.
            </p>
          </div>
          <div className="badge-pill badge-emerald">
            Live Socket Synchronization
          </div>
        </div>

        <CaregiverPreferenceForm apiUrl={apiUrl} onRefresh={onRefresh} />
      </div>
    </div>
  );
}

function CaregiverPreferenceForm({ apiUrl, onRefresh }) {
  const [prefForm, setPrefForm] = useState({
    language: 'as',
    preferredInteractionMode: 'mixed',
    fontSize: 'large',
    highContrast: false,
    speechRate: 0.85,
    preferredSessionDuration: 'standard',
    excludedCategories: [],
    morningTeaReminder: true,
    routineAudioCue: true
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/api/profile/preferences`)
      .then(r => r.json())
      .then(data => {
        if (data) {
          setPrefForm({
            language: data.language || 'as',
            preferredInteractionMode: data.preferredInteractionMode || 'mixed',
            fontSize: data.accessibilitySettings?.fontSize || 'large',
            highContrast: Boolean(data.accessibilitySettings?.highContrast),
            speechRate: data.accessibilitySettings?.speechRate || 0.85,
            preferredSessionDuration: data.preferredSessionDuration || 'standard',
            excludedCategories: data.excludedCategories || [],
            morningTeaReminder: data.reminderSettings?.morningTeaReminder !== false,
            routineAudioCue: data.reminderSettings?.routineAudioCue !== false
          });
        }
      })
      .catch(err => console.warn('Preferences fetch notice:', err));
  }, [apiUrl]);

  const handlePrefSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch(`${apiUrl}/api/profile/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elderId: 'elderly_bhaben_01',
          language: prefForm.language,
          preferredInteractionMode: prefForm.preferredInteractionMode,
          accessibilitySettings: {
            fontSize: prefForm.fontSize,
            highContrast: prefForm.highContrast,
            speechRate: parseFloat(prefForm.speechRate) || 0.85,
            reducedMotion: false
          },
          excludedCategories: prefForm.excludedCategories,
          preferredSessionDuration: prefForm.preferredSessionDuration,
          reminderSettings: {
            morningTeaReminder: prefForm.morningTeaReminder,
            routineAudioCue: prefForm.routineAudioCue
          }
        })
      });

      if (res.ok) {
        setSuccess(true);
        if (onRefresh) onRefresh();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      alert('Error saving preferences: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryExclusion = (catId) => {
    setPrefForm(prev => {
      const exists = prev.excludedCategories.includes(catId);
      return {
        ...prev,
        excludedCategories: exists
          ? prev.excludedCategories.filter(c => c !== catId)
          : [...prev.excludedCategories, catId]
      };
    });
  };

  return (
    <form onSubmit={handlePrefSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {success && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '10px',
          padding: '12px 16px',
          color: '#34D399',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={16} />
          <span>Caregiver settings synchronized in real-time with the Elderly Dashboard!</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
            Elder Interface Language:
          </label>
          <select
            className="input-dark"
            value={prefForm.language}
            onChange={(e) => setPrefForm({ ...prefForm, language: e.target.value })}
          >
            <option value="as">অসমীয়া (Assamese)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="ne">नेपाली (Nepali)</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="en">English (Indian)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
            Default Interaction Mode:
          </label>
          <select
            className="input-dark"
            value={prefForm.preferredInteractionMode}
            onChange={(e) => setPrefForm({ ...prefForm, preferredInteractionMode: e.target.value })}
          >
            <option value="mixed">Mixed (Voice + Touch Buttons)</option>
            <option value="touch">Touch / Large Buttons Only</option>
            <option value="voice">Voice Prompt Preferred</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
            Default Font Size:
          </label>
          <select
            className="input-dark"
            value={prefForm.fontSize}
            onChange={(e) => setPrefForm({ ...prefForm, fontSize: e.target.value })}
          >
            <option value="standard">Standard (Readable)</option>
            <option value="large">Large (Recommended for Elders)</option>
            <option value="extra-large">Extra Large (High Visibility)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
            Target Session Duration:
          </label>
          <select
            className="input-dark"
            value={prefForm.preferredSessionDuration}
            onChange={(e) => setPrefForm({ ...prefForm, preferredSessionDuration: e.target.value })}
          >
            <option value="short">Short (3-5 minutes, Unhurried)</option>
            <option value="standard">Standard (10-15 minutes)</option>
            <option value="extended">Extended (Gentle Leisure)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
            Speech Synthesis Rate: {prefForm.speechRate}x
          </label>
          <input
            type="range"
            min="0.65"
            max="1.0"
            step="0.05"
            value={prefForm.speechRate}
            onChange={(e) => setPrefForm({ ...prefForm, speechRate: parseFloat(e.target.value) })}
            style={{ width: '100%', marginTop: '8px' }}
          />
        </div>
      </div>

      {/* Category Exclusion Safeguard */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          Content Exclusions (Deselect if any category causes confusion or agitation):
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {[
            { id: 'gentle_puzzles', label: 'Number Sequences & Puzzles' },
            { id: 'word_associations', label: 'Word Spelling Puzzles' },
            { id: 'visual_recognition', label: 'Picture Match Cards' },
            { id: 'music_culture', label: 'Music & Cultural Topics' }
          ].map(cat => {
            const isExcluded = prefForm.excludedCategories.includes(cat.id);
            return (
              <label
                key={cat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: isExcluded ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                  border: isExcluded ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #334155',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: isExcluded ? '#FCA5A5' : '#E2E8F0'
                }}
              >
                <input
                  type="checkbox"
                  checked={isExcluded}
                  onChange={() => toggleCategoryExclusion(cat.id)}
                />
                <span>Exclude {cat.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <button type="submit" className="btn-emerald" disabled={loading}>
          <Save size={16} />
          <span>{loading ? 'Synchronizing...' : 'Save & Push to Elder Dashboard'}</span>
        </button>
      </div>
    </form>
  );
}
