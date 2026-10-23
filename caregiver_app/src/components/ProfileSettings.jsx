import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, ShieldCheck, Save, Heart, Sparkles, Globe, Compass, RefreshCw } from 'lucide-react';

const PAN_INDIA_REGIONS = [
  { id: 'PAN_INDIA', label: 'Pan-Indian / Cosmopolitan' },
  { id: 'NORTH', label: '🏛️ North India (Delhi, UP, Punjab, Haryana, Rajasthan, HP, J&K)' },
  { id: 'WEST', label: '🌊 West India (Maharashtra, Gujarat, Goa)' },
  { id: 'SOUTH', label: '🪔 South India (Tamil Nadu, Karnataka, Kerala, Andhra Pradesh, Telangana)' },
  { id: 'EAST', label: '🌺 East India (West Bengal, Odisha, Bihar, Jharkhand)' },
  { id: 'NORTH_EAST', label: '🌿 North-East India (Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal, Sikkim)' },
  { id: 'CENTRAL', label: '🌾 Central India (Madhya Pradesh, Chhattisgarh)' }
];

const HONORIFICS = [
  { value: 'Dadaji', label: 'Dadaji (Paternal Grandfather - Hindi / North / Punjabi)' },
  { value: 'Dadimaa', label: 'Dadimaa (Paternal Grandmother - Hindi / North / Punjabi)' },
  { value: 'Nanaji', label: 'Nanaji (Maternal Grandfather - Hindi / North / West)' },
  { value: 'Nanimaa', label: 'Nanimaa (Maternal Grandmother - Hindi / North / West)' },
  { value: 'Thatha', label: 'Thatha (Grandfather - Tamil / Telugu)' },
  { value: 'Patti', label: 'Patti / Paati (Grandmother - Tamil)' },
  { value: 'Ammamma', label: 'Ammamma (Grandmother - Telugu)' },
  { value: 'Ajja', label: 'Ajja (Grandfather - Kannada)' },
  { value: 'Ajji', label: 'Ajji (Grandmother - Kannada)' },
  { value: 'Muthatthan', label: 'Muthatthan (Grandfather - Malayalam)' },
  { value: 'Muthassi', label: 'Muthassi (Grandmother - Malayalam)' },
  { value: 'Aaba', label: 'Aaba (Elder / Grandfather - Marathi)' },
  { value: 'Aaji', label: 'Aaji (Grandmother - Marathi)' },
  { value: 'Dada', label: 'Dada (Grandfather - Gujarati / West)' },
  { value: 'Baa', label: 'Baa (Grandmother / Mother - Gujarati)' },
  { value: 'Dadu', label: 'Dadu (Grandfather - Bengali)' },
  { value: 'Thakuma', label: 'Thakuma (Grandmother - Bengali)' },
  { value: 'Koka', label: 'Koka (Grandfather - Assamese)' },
  { value: 'Aita', label: 'Aita (Grandmother - Assamese)' },
  { value: 'Baje', label: 'Baje (Grandfather - Nepali)' },
  { value: 'Boju', label: 'Boju (Grandmother - Nepali)' },
  { value: 'Pitaji', label: 'Pitaji / Bauji / Appa / Bapuji (Father)' },
  { value: 'Maa', label: 'Maa / Mataji / Amma / Aai (Mother)' }
];

const LANGUAGES = [
  'English',
  'Hindi (हिन्दी)',
  'Bengali (বাংলা)',
  'Assamese (অসমীয়া)',
  'Nepali (नेपाली)',
  'Tamil (தமிழ்)',
  'Telugu (తెలుగు)',
  'Kannada (ಕನ್ನಡ)',
  'Malayalam (മലയാളം)',
  'Marathi (मराठी)',
  'Gujarati (ગુજરાતી)',
  'Punjabi (ਪੰਜਾਬੀ)',
  'Odia (ଓଡ଼ିଆ)'
];

const PRESETS = [
  {
    tag: '🪔 South India',
    name: 'Rameshwar Iyer',
    age: 78,
    honorific: 'Thatha',
    culturalRegion: '🪔 South India (Tamil Nadu, Karnataka, Kerala, Andhra Pradesh, Telangana)',
    greetingTitle: 'Vanakkam & Suprabhatam',
    hometown: 'Mylapore, Chennai, Tamil Nadu',
    currentResidence: 'Indiranagar, Bengaluru',
    primaryLanguage: 'Tamil (தமிழ்)',
    secondaryLanguage: 'English',
    comfortNotes: 'Responds warmly to M.S. Subbulakshmi Carnatic ragas, Kapaleeshwarar temple bells, morning filter coffee aroma, and childhood memories in Thanjavur.',
    emergencyName: 'Karthik Iyer (Son)',
    emergencyPhone: '+91 98401 23456'
  },
  {
    tag: '🌺 North India',
    name: 'Shanti Devi Sharma',
    age: 75,
    honorific: 'Dadimaa',
    culturalRegion: '🏛️ North India (Delhi, UP, Punjab, Haryana, Rajasthan, HP, J&K)',
    greetingTitle: 'Pranaam & Suprabhat',
    hometown: 'Varanasi (Kashi), Uttar Pradesh',
    currentResidence: 'Vasant Kunj, New Delhi',
    primaryLanguage: 'Hindi (हिन्दी)',
    secondaryLanguage: 'English',
    comfortNotes: 'Comforted by memories of Ganga Ghat aarti bells, Krishna bhajans, marigold flower garlands, and winter morning rooftop tea with family.',
    emergencyName: 'Amit Sharma (Son)',
    emergencyPhone: '+91 98111 87654'
  },
  {
    tag: '🎨 East India',
    name: 'Subhash Chandra Mukherjee',
    age: 74,
    honorific: 'Dadu',
    culturalRegion: '🌺 East India (West Bengal, Odisha, Bihar, Jharkhand)',
    greetingTitle: 'Nomoshkar & Suprabhat',
    hometown: 'North Kolkata, West Bengal',
    currentResidence: 'Salt Lake, Kolkata',
    primaryLanguage: 'Bengali (বাংলা)',
    secondaryLanguage: 'English',
    comfortNotes: 'Deeply soothed by Rabindrasangeet tunes, childhood tram rides by the Hooghly river, College Street bookstalls, and Durga Puja dhaak beats.',
    emergencyName: 'Debolina Mukherjee (Daughter)',
    emergencyPhone: '+91 98300 45678'
  },
  {
    tag: '🌾 North-West',
    name: 'Sardar Harbhajan Singh',
    age: 77,
    honorific: 'Dadaji',
    culturalRegion: '🏛️ North India (Delhi, UP, Punjab, Haryana, Rajasthan, HP, J&K)',
    greetingTitle: 'Sat Sri Akal',
    hometown: 'Amritsar, Punjab',
    currentResidence: 'Model Town, Ludhiana',
    primaryLanguage: 'Punjabi (ਪੰਜਾਬੀ)',
    secondaryLanguage: 'Hindi (हिन्दी)',
    comfortNotes: 'Finds peace in Golden Temple Gurbani kirtan, childhood memories of lush mustard fields, bhangra dhol rhythms, and fresh winter sarson saag.',
    emergencyName: 'Gurpreet Singh (Son)',
    emergencyPhone: '+91 98722 34567'
  },
  {
    tag: '🌿 North-East',
    name: 'Bhaben Baruah',
    age: 76,
    honorific: 'Koka',
    culturalRegion: '🌿 North-East India (Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal, Sikkim)',
    greetingTitle: 'Suprabhat & Nomoskar',
    hometown: 'Sivasagar & Jorhat, Assam',
    currentResidence: 'Beltola, Guwahati',
    primaryLanguage: 'Assamese (অসমীয়া)',
    secondaryLanguage: 'English',
    comfortNotes: 'Responds warmly to memories of Sivasagar historic tank, Rongali Bihu dhol beats, Brahmaputra river breeze, and childhood tea gardens.',
    emergencyName: 'Deepak Baruah (Son)',
    emergencyPhone: '+91 98640 12345'
  },
  {
    tag: '🌊 West India',
    name: 'Prabhakar Kulkarni',
    age: 76,
    honorific: 'Aaba',
    culturalRegion: '🌊 West India (Maharashtra, Gujarat, Goa)',
    greetingTitle: 'Namaskar & Shubh Prabhat',
    hometown: 'Sadashiv Peth, Pune, Maharashtra',
    currentResidence: 'Thane, Mumbai MMR',
    primaryLanguage: 'Marathi (मराठी)',
    secondaryLanguage: 'English',
    comfortNotes: 'Comforted by Natyasangeet melodies, Ganpati dhol tasha beats, childhood treks up Sinhagad fort, and fragrant morning poha with tea.',
    emergencyName: 'Nitin Kulkarni (Son)',
    emergencyPhone: '+91 98200 98765'
  }
];

export default function ProfileSettings({ profile, onRefresh, apiUrl }) {
  const [form, setForm] = useState({
    name: 'Rameshwar Iyer',
    age: 78,
    honorific: 'Thatha',
    culturalRegion: '🪔 South India (Tamil Nadu, Karnataka, Kerala, Andhra Pradesh, Telangana)',
    greetingTitle: 'Vanakkam & Suprabhatam',
    hometown: 'Mylapore, Chennai',
    currentResidence: 'Indiranagar, Bengaluru',
    primaryLanguage: 'English',
    secondaryLanguage: 'Tamil (தமிழ்)',
    comfortNotes: 'Responds warmly to Carnatic ragas, temple chimes, and childhood memories.',
    emergencyName: 'Karthik Iyer (Son)',
    emergencyPhone: '+91 98401 23456'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        age: profile.age || 75,
        honorific: profile.honorific || 'Elder',
        culturalRegion: profile.culturalRegion || profile.region || 'Pan-Indian / Cosmopolitan',
        greetingTitle: profile.greetingTitle || 'Suprabhat',
        hometown: profile.hometown || '',
        currentResidence: profile.currentResidence || '',
        primaryLanguage: profile.primaryLanguage || 'English',
        secondaryLanguage: profile.secondaryLanguage || '',
        comfortNotes: profile.comfortNotes || '',
        emergencyName: profile.emergencyContact?.name || '',
        emergencyPhone: profile.emergencyContact?.phone || ''
      });
    }
  }, [profile]);

  const applyPreset = (preset) => {
    setForm({
      name: preset.name,
      age: preset.age,
      honorific: preset.honorific,
      culturalRegion: preset.culturalRegion,
      greetingTitle: preset.greetingTitle,
      hometown: preset.hometown,
      currentResidence: preset.currentResidence,
      primaryLanguage: preset.primaryLanguage,
      secondaryLanguage: preset.secondaryLanguage,
      comfortNotes: preset.comfortNotes,
      emergencyName: preset.emergencyName,
      emergencyPhone: preset.emergencyPhone
    });
  };

  const handleResetBlank = () => {
    setForm({
      name: '',
      age: 70,
      honorific: 'Dadaji',
      culturalRegion: 'Pan-Indian / Cosmopolitan',
      greetingTitle: 'Namaskar',
      hometown: '',
      currentResidence: '',
      primaryLanguage: 'English',
      secondaryLanguage: '',
      comfortNotes: '',
      emergencyName: '',
      emergencyPhone: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // 1. Update Core Profile
      const res = await fetch(`${apiUrl}/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          age: parseInt(form.age, 10) || 75,
          honorific: form.honorific,
          greetingTitle: form.greetingTitle,
          region: form.culturalRegion,
          culturalRegion: form.culturalRegion,
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

      // 2. Also map to preferences for language code
      let langCode = 'en';
      const pl = form.primaryLanguage.toLowerCase();
      if (pl.includes('hindi')) langCode = 'hi';
      else if (pl.includes('bengali') || pl.includes('bangla')) langCode = 'bn';
      else if (pl.includes('assamese')) langCode = 'as';
      else if (pl.includes('nepali')) langCode = 'ne';

      await fetch(`${apiUrl}/api/profile/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: langCode,
          speechLanguage: langCode === 'hi' ? 'hi-IN' : langCode === 'bn' ? 'bn-IN' : langCode === 'as' ? 'as-IN' : langCode === 'ne' ? 'ne-NP' : 'en-US'
        })
      }).catch(err => console.warn('Preferences sync note:', err));

      if (res.ok) {
        setSuccess(true);
        if (onRefresh) onRefresh();
        setTimeout(() => setSuccess(false), 3500);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert('Failed to save profile: ' + (errData.error || res.statusText));
      }
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header Card */}
      <div className="exec-card" style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '16px', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>🇮🇳</span>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Pan-India Elder Profile & Cultural Personalization
              </h2>
            </div>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
              Personalize greetings, cultural honorifics, hometown memories, and language for any elder across India.
            </p>
          </div>
          <div style={{
            background: '#EFF6FF',
            color: '#1D4ED8',
            border: '1px solid #BFDBFE',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 700
          }}>
            Active Pan-India Engine
          </div>
        </div>

        {/* Quick Regional Presets Bar */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '14px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
              ⚡ Quick Cultural Templates (Instant Fill):
            </span>
            <button
              type="button"
              onClick={handleResetBlank}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748B',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Clear to Blank
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {PRESETS.map((p) => (
              <button
                key={p.tag}
                type="button"
                onClick={() => applyPreset(p)}
                style={{
                  background: form.name === p.name ? '#0F172A' : '#FFFFFF',
                  color: form.name === p.name ? '#FFFFFF' : '#1E293B',
                  border: form.name === p.name ? '1px solid #0F172A' : '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {p.tag}: {p.name.split(' ')[0]} ({p.honorific})
              </button>
            ))}
          </div>
        </div>

        {success && (
          <div style={{
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#065F46',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={18} color="#059669" />
            <span>Profile successfully updated in database! Live changes are now active on the Elderly Site.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Row 1: Name, Age & Honorific */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Elder's Full Name:
              </label>
              <input
                type="text"
                className="input-dark"
                style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', borderRadius: '10px', padding: '10px 14px', width: '100%' }}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Rameshwar Iyer, Shanti Devi"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Age:
              </label>
              <input
                type="number"
                className="input-dark"
                style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', borderRadius: '10px', padding: '10px 14px', width: '100%' }}
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                min="50"
                max="120"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Cultural Honorific:
              </label>
              <select
                className="input-dark"
                style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', borderRadius: '10px', padding: '10px 14px', width: '100%' }}
                value={form.honorific}
                onChange={(e) => setForm({ ...form, honorific: e.target.value })}
              >
                {HONORIFICS.map(h => (
                  <option key={h.value} value={h.value}>{h.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Cultural Region & Greeting */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Indian Cultural Region:
              </label>
              <select
                className="input-dark"
                style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', borderRadius: '10px', padding: '10px 14px', width: '100%' }}
                value={form.culturalRegion}
                onChange={(e) => setForm({ ...form, culturalRegion: e.target.value })}
              >
                {PAN_INDIA_REGIONS.map(r => (
                  <option key={r.id} value={r.label}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Morning Greeting:
              </label>
              <input
                type="text"
                className="input-dark"
                style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', borderRadius: '10px', padding: '10px 14px', width: '100%' }}
                value={form.greetingTitle}
                onChange={(e) => setForm({ ...form, greetingTitle: e.target.value })}
                placeholder="e.g. Vanakkam, Pranaam, Suprabhat"
              />
            </div>
          </div>

          {/* Row 3: Hometown & Current Residence */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Birthplace / Ancestral Hometown:
              </label>
              <input
                type="text"
                className="input-dark"
                style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', borderRadius: '10px', padding: '10px 14px', width: '100%' }}
                value={form.hometown}
                onChange={(e) => setForm({ ...form, hometown: e.target.value })}
                placeholder="e.g. Mylapore Chennai, Varanasi, Jorhat"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Current Living City / Residence:
              </label>
              <input
                type="text"
                className="input-dark"
                style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', borderRadius: '10px', padding: '10px 14px', width: '100%' }}
                value={form.currentResidence}
                onChange={(e) => setForm({ ...form, currentResidence: e.target.value })}
                placeholder="e.g. Indiranagar Bengaluru, Vasant Kunj Delhi"
              />
            </div>
          </div>

          {/* Row 4: Languages */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Primary Language:
              </label>
              <select
                className="input-dark"
                style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', borderRadius: '10px', padding: '10px 14px', width: '100%' }}
                value={form.primaryLanguage}
                onChange={(e) => setForm({ ...form, primaryLanguage: e.target.value })}
              >
                {LANGUAGES.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Secondary Language (Optional):
              </label>
              <input
                type="text"
                className="input-dark"
                style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', borderRadius: '10px', padding: '10px 14px', width: '100%' }}
                value={form.secondaryLanguage}
                onChange={(e) => setForm({ ...form, secondaryLanguage: e.target.value })}
                placeholder="e.g. English, Hindi"
              />
            </div>
          </div>

          {/* Row 5: Nostalgia & Comfort Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Comfort & Cultural Nostalgia Notes:
            </label>
            <textarea
              className="input-dark"
              style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', borderRadius: '10px', padding: '10px 14px', width: '100%', resize: 'vertical' }}
              rows={3}
              value={form.comfortNotes}
              onChange={(e) => setForm({ ...form, comfortNotes: e.target.value })}
              placeholder="Familiar cultural cues, favorite foods, songs, childhood memories, or temple visits that bring comfort."
            />
          </div>

          {/* Row 6: Emergency Contact */}
          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>
              Primary Family Caregiver Contact:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Caregiver Name & Relation:
                </label>
                <input
                  type="text"
                  className="input-dark"
                  style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', borderRadius: '10px', padding: '10px 14px', width: '100%' }}
                  value={form.emergencyName}
                  onChange={(e) => setForm({ ...form, emergencyName: e.target.value })}
                  placeholder="e.g. Karthik Iyer (Son)"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Phone Number:
                </label>
                <input
                  type="tel"
                  className="input-dark"
                  style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', borderRadius: '10px', padding: '10px 14px', width: '100%' }}
                  value={form.emergencyPhone}
                  onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })}
                  placeholder="+91 98XXX XXXXX"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)'
              }}
            >
              <Save size={18} />
              <span>{loading ? 'Saving Profile...' : 'Save & Sync to Elderly App'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
