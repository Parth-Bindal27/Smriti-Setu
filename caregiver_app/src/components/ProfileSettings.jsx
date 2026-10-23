import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  MapPin,
  Phone,
  Heart,
  Globe,
  Save,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Info,
  Clock,
  Compass,
  AlertCircle
} from 'lucide-react';

const CULTURAL_REGIONS = [
  { id: 'PAN_INDIA', label: 'Pan-Indian / Cosmopolitan' },
  { id: 'NORTH', label: 'North India (Delhi, UP, Punjab, Haryana, Rajasthan, HP, J&K)' },
  { id: 'SOUTH', label: 'South India (Tamil Nadu, Karnataka, Kerala, Andhra Pradesh, Telangana)' },
  { id: 'EAST', label: 'East India (West Bengal, Odisha, Bihar, Jharkhand)' },
  { id: 'NORTH_EAST', label: 'North-East India (Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal, Sikkim)' },
  { id: 'WEST', label: 'West India (Maharashtra, Gujarat, Goa)' },
  { id: 'CENTRAL', label: 'Central India (Madhya Pradesh, Chhattisgarh)' }
];

const HONORIFIC_GROUPS = [
  {
    category: 'Grandfathers / Paternal & Maternal Elders',
    options: [
      { value: 'Dadaji', label: 'Dadaji (Paternal Grandfather — Hindi / Punjabi)' },
      { value: 'Nanaji', label: 'Nanaji (Maternal Grandfather — Hindi / North / West)' },
      { value: 'Thatha', label: 'Thatha (Grandfather — Tamil / Telugu)' },
      { value: 'Ajja', label: 'Ajja (Grandfather — Kannada)' },
      { value: 'Muthatthan', label: 'Muthatthan (Grandfather — Malayalam)' },
      { value: 'Aaba', label: 'Aaba (Elder / Grandfather — Marathi)' },
      { value: 'Dada', label: 'Dada (Grandfather — Gujarati / West)' },
      { value: 'Dadu', label: 'Dadu (Grandfather — Bengali)' },
      { value: 'Koka', label: 'Koka (Grandfather — Assamese)' },
      { value: 'Baje', label: 'Baje (Grandfather — Nepali)' },
      { value: 'Pitaji', label: 'Pitaji / Appa / Bapuji / Bauji (Father)' }
    ]
  },
  {
    category: 'Grandmothers / Matriarchs & Mothers',
    options: [
      { value: 'Dadimaa', label: 'Dadimaa (Paternal Grandmother — Hindi / Punjabi)' },
      { value: 'Nanimaa', label: 'Nanimaa (Maternal Grandmother — Hindi / North / West)' },
      { value: 'Patti', label: 'Patti / Paati (Grandmother — Tamil)' },
      { value: 'Ammamma', label: 'Ammamma (Grandmother — Telugu)' },
      { value: 'Ajji', label: 'Ajji (Grandmother — Kannada)' },
      { value: 'Muthassi', label: 'Muthassi (Grandmother — Malayalam)' },
      { value: 'Aaji', label: 'Aaji (Grandmother — Marathi)' },
      { value: 'Baa', label: 'Baa (Grandmother — Gujarati)' },
      { value: 'Thakuma', label: 'Thakuma (Grandmother — Bengali)' },
      { value: 'Aita', label: 'Aita (Grandmother — Assamese)' },
      { value: 'Boju', label: 'Boju (Grandmother — Nepali)' },
      { value: 'Maa', label: 'Maa / Amma / Aai / Mataji (Mother)' }
    ]
  },
  {
    category: 'Custom / Other Calling Name',
    options: [
      { value: 'Custom', label: '✏️ Enter Custom Calling Name (e.g. Babuji, Maji, Tauji)...' }
    ]
  }
];

const ALL_HONORIFIC_VALUES = HONORIFIC_GROUPS.flatMap(g => g.options.map(o => o.value));

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

const GREETING_SUGGESTIONS = [
  'Suprabhat',
  'Namaskar',
  'Vanakkam',
  'Pranaam',
  'Nomoshkar',
  'Sat Sri Akal',
  'Radhe Radhe',
  'Jai Shri Krishna',
  'Good Morning'
];

const SAMPLE_PROFILES = [
  {
    id: 'south_tamil',
    label: 'South India',
    subLabel: 'Rameshwar (Thatha)',
    badge: 'Tamil',
    data: {
      name: 'Rameshwar Iyer',
      age: 78,
      honorific: 'Thatha',
      culturalRegion: 'South India (Tamil Nadu, Karnataka, Kerala, Andhra Pradesh, Telangana)',
      greetingTitle: 'Vanakkam & Suprabhatam',
      hometown: 'Mylapore, Chennai, Tamil Nadu',
      currentResidence: 'Indiranagar, Bengaluru',
      primaryLanguage: 'Tamil (தமிழ்)',
      secondaryLanguage: 'English',
      comfortNotes: 'Responds warmly to M.S. Subbulakshmi Carnatic ragas, Kapaleeshwarar temple bells, morning filter coffee aroma, and childhood memories in Thanjavur.',
      emergencyName: 'Karthik Iyer (Son)',
      emergencyPhone: '+91 98401 23456'
    }
  },
  {
    id: 'north_hindi',
    label: 'North India',
    subLabel: 'Shanti Devi (Dadimaa)',
    badge: 'Hindi',
    data: {
      name: 'Shanti Devi Sharma',
      age: 75,
      honorific: 'Dadimaa',
      culturalRegion: 'North India (Delhi, UP, Punjab, Haryana, Rajasthan, HP, J&K)',
      greetingTitle: 'Pranaam & Suprabhat',
      hometown: 'Varanasi (Kashi), Uttar Pradesh',
      currentResidence: 'Vasant Kunj, New Delhi',
      primaryLanguage: 'Hindi (हिन्दी)',
      secondaryLanguage: 'English',
      comfortNotes: 'Comforted by memories of Dashashwamedh Ghat aarti bells, Krishna bhajans, marigold garlands, and winter morning chai with family.',
      emergencyName: 'Amit Sharma (Son)',
      emergencyPhone: '+91 98111 87654'
    }
  },
  {
    id: 'east_bengali',
    label: 'East India',
    subLabel: 'Subhash (Dadu)',
    badge: 'Bengali',
    data: {
      name: 'Subhash Chandra Mukherjee',
      age: 74,
      honorific: 'Dadu',
      culturalRegion: 'East India (West Bengal, Odisha, Bihar, Jharkhand)',
      greetingTitle: 'Nomoshkar & Suprabhat',
      hometown: 'North Kolkata, West Bengal',
      currentResidence: 'Salt Lake, Kolkata',
      primaryLanguage: 'Bengali (বাংলা)',
      secondaryLanguage: 'English',
      comfortNotes: 'Deeply soothed by Rabindrasangeet tunes, childhood tram rides by the Hooghly river, College Street bookstalls, and Durga Puja dhaak rhythms.',
      emergencyName: 'Debolina Mukherjee (Daughter)',
      emergencyPhone: '+91 98300 45678'
    }
  },
  {
    id: 'northwest_punjabi',
    label: 'North-West',
    subLabel: 'Harbhajan (Dadaji)',
    badge: 'Punjabi',
    data: {
      name: 'Sardar Harbhajan Singh',
      age: 77,
      honorific: 'Dadaji',
      culturalRegion: 'North India (Delhi, UP, Punjab, Haryana, Rajasthan, HP, J&K)',
      greetingTitle: 'Sat Sri Akal',
      hometown: 'Amritsar, Punjab',
      currentResidence: 'Model Town, Ludhiana',
      primaryLanguage: 'Punjabi (ਪੰਜਾਬੀ)',
      secondaryLanguage: 'Hindi (हिन्दी)',
      comfortNotes: 'Finds peace in Golden Temple Gurbani kirtan, childhood memories of lush mustard fields, bhangra dhol rhythms, and fresh winter sarson saag.',
      emergencyName: 'Gurpreet Singh (Son)',
      emergencyPhone: '+91 98722 34567'
    }
  },
  {
    id: 'northeast_assamese',
    label: 'North-East',
    subLabel: 'Bhaben (Koka)',
    badge: 'Assamese',
    data: {
      name: 'Bhaben Baruah',
      age: 76,
      honorific: 'Koka',
      culturalRegion: 'North-East India (Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal, Sikkim)',
      greetingTitle: 'Suprabhat & Nomoskar',
      hometown: 'Sivasagar & Jorhat, Assam',
      currentResidence: 'Beltola, Guwahati',
      primaryLanguage: 'Assamese (অসমীয়া)',
      secondaryLanguage: 'English',
      comfortNotes: 'Responds warmly to memories of Sivasagar historic tank, Rongali Bihu dhol beats, Brahmaputra river breeze, and childhood tea gardens.',
      emergencyName: 'Deepak Baruah (Son)',
      emergencyPhone: '+91 98640 12345'
    }
  },
  {
    id: 'west_marathi',
    label: 'West India',
    subLabel: 'Prabhakar (Aaba)',
    badge: 'Marathi',
    data: {
      name: 'Prabhakar Kulkarni',
      age: 76,
      honorific: 'Aaba',
      culturalRegion: 'West India (Maharashtra, Gujarat, Goa)',
      greetingTitle: 'Namaskar & Shubh Prabhat',
      hometown: 'Sadashiv Peth, Pune, Maharashtra',
      currentResidence: 'Thane, Mumbai MMR',
      primaryLanguage: 'Marathi (मराठी)',
      secondaryLanguage: 'English',
      comfortNotes: 'Comforted by Natyasangeet melodies, Ganpati dhol tasha beats, childhood treks up Sinhagad fort, and fragrant morning poha with tea.',
      emergencyName: 'Nitin Kulkarni (Son)',
      emergencyPhone: '+91 98200 98765'
    }
  }
];

export default function ProfileSettings({ profile, onRefresh, apiUrl }) {
  const [form, setForm] = useState({
    name: '',
    age: 75,
    honorific: 'Dadaji',
    customHonorific: '',
    culturalRegion: 'Pan-Indian / Cosmopolitan',
    greetingTitle: 'Suprabhat',
    hometown: '',
    currentResidence: '',
    primaryLanguage: 'English',
    secondaryLanguage: '',
    comfortNotes: '',
    emergencyName: '',
    emergencyPhone: ''
  });

  const [isCustomHonorific, setIsCustomHonorific] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeSampleId, setActiveSampleId] = useState(null);

  // References to completely shield active typing from background poll overwrites
  const isDirtyRef = useRef(false);
  const initialLoadedRef = useRef(false);

  // Synchronize incoming profile ONLY if user is not currently editing
  useEffect(() => {
    if (!profile) return;

    if (!initialLoadedRef.current || !isDirtyRef.current) {
      const knownHonorific = ALL_HONORIFIC_VALUES.filter(v => v !== 'Custom').includes(profile.honorific);
      const isCustom = !knownHonorific && Boolean(profile.honorific);

      setForm({
        name: profile.name || '',
        age: profile.age || 75,
        honorific: isCustom ? 'Custom' : (profile.honorific || 'Dadaji'),
        customHonorific: isCustom ? profile.honorific : '',
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

      setIsCustomHonorific(isCustom);
      initialLoadedRef.current = true;
    }
  }, [profile]);

  // Robust field updater that protects state from polling
  const updateField = (field, value) => {
    isDirtyRef.current = true;
    setIsDirty(true);
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleHonorificSelect = (val) => {
    isDirtyRef.current = true;
    setIsDirty(true);
    if (val === 'Custom') {
      setIsCustomHonorific(true);
      setForm(prev => ({ ...prev, honorific: 'Custom' }));
    } else {
      setIsCustomHonorific(false);
      setForm(prev => ({ ...prev, honorific: val, customHonorific: '' }));
    }
  };

  const applySample = (sample) => {
    isDirtyRef.current = true;
    setIsDirty(true);
    setActiveSampleId(sample.id);

    const knownHonorific = ALL_HONORIFIC_VALUES.filter(v => v !== 'Custom').includes(sample.data.honorific);
    const isCustom = !knownHonorific;

    setForm({
      ...sample.data,
      customHonorific: isCustom ? sample.data.honorific : '',
      honorific: isCustom ? 'Custom' : sample.data.honorific
    });
    setIsCustomHonorific(isCustom);
  };

  const handleResetBlank = () => {
    isDirtyRef.current = true;
    setIsDirty(true);
    setActiveSampleId(null);
    setIsCustomHonorific(false);

    setForm({
      name: '',
      age: 70,
      honorific: 'Dadaji',
      customHonorific: '',
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

  const handleDiscardChanges = () => {
    if (!profile) return;
    isDirtyRef.current = false;
    setIsDirty(false);
    setActiveSampleId(null);

    const knownHonorific = ALL_HONORIFIC_VALUES.filter(v => v !== 'Custom').includes(profile.honorific);
    const isCustom = !knownHonorific && Boolean(profile.honorific);

    setForm({
      name: profile.name || '',
      age: profile.age || 75,
      honorific: isCustom ? 'Custom' : (profile.honorific || 'Dadaji'),
      customHonorific: isCustom ? profile.honorific : '',
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
    setIsCustomHonorific(isCustom);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // Compute active honorific
    const finalHonorific = (isCustomHonorific && form.customHonorific.trim())
      ? form.customHonorific.trim()
      : (form.honorific === 'Custom' ? 'Elder' : form.honorific);

    try {
      // 1. Update Core Profile
      const res = await fetch(`${apiUrl}/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          age: parseInt(form.age, 10) || 75,
          honorific: finalHonorific,
          greetingTitle: form.greetingTitle.trim(),
          region: form.culturalRegion,
          culturalRegion: form.culturalRegion,
          hometown: form.hometown.trim(),
          currentResidence: form.currentResidence.trim(),
          primaryLanguage: form.primaryLanguage,
          secondaryLanguage: form.secondaryLanguage.trim(),
          comfortNotes: form.comfortNotes.trim(),
          emergencyContact: {
            name: form.emergencyName.trim(),
            relation: 'Primary Caregiver',
            phone: form.emergencyPhone.trim()
          }
        })
      });

      // 2. Map primary language to preferences
      let langCode = 'en';
      const pl = form.primaryLanguage.toLowerCase();
      if (pl.includes('hindi')) langCode = 'hi';
      else if (pl.includes('bengali') || pl.includes('bangla')) langCode = 'bn';
      else if (pl.includes('assamese')) langCode = 'as';
      else if (pl.includes('nepali')) langCode = 'ne';
      else if (pl.includes('tamil')) langCode = 'ta';
      else if (pl.includes('telugu')) langCode = 'te';

      await fetch(`${apiUrl}/api/profile/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: langCode,
          speechLanguage: langCode === 'hi' ? 'hi-IN' : langCode === 'bn' ? 'bn-IN' : langCode === 'as' ? 'as-IN' : langCode === 'ne' ? 'ne-NP' : 'en-US'
        })
      }).catch(err => console.warn('Preferences sync note:', err));

      if (res.ok) {
        isDirtyRef.current = false;
        setIsDirty(false);
        setSuccess(true);
        if (onRefresh) onRefresh();
        setTimeout(() => setSuccess(false), 4500);
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
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Page Header */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '18px',
        padding: '1.75rem 2rem',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
            border: '1px solid #FCD34D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#B45309',
            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.12)'
          }}>
            <User size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Elder Profile & Cultural Personalization
              </h2>
            </div>
            <p style={{ fontSize: '14px', color: '#64748B', margin: '4px 0 0 0', lineHeight: 1.4 }}>
              Configure familiar calling names, native roots, and soothing memories for dignified, personalized care.
            </p>
          </div>
        </div>

        {/* Dynamic Status Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '9999px',
          fontSize: '13px',
          fontWeight: 700,
          background: isDirty ? '#FFFBEB' : '#ECFDF5',
          border: isDirty ? '1px solid #FDE68A' : '1px solid #A7F3D0',
          color: isDirty ? '#B45309' : '#047857',
          transition: 'all 0.2s'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isDirty ? '#F59E0B' : '#10B981',
            display: 'inline-block'
          }} />
          <span>{isDirty ? 'Unsaved Edits in Form' : 'Synchronized with Tablet'}</span>
        </div>
      </div>

      {/* Optional Sample Profiles Inspiration Bar */}
      <div style={{
        background: '#FAF8F5',
        border: '1px solid #E7E0D6',
        borderRadius: '16px',
        padding: '1.1rem 1.4rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#D97706" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
              Need inspiration? Load a sample Indian elder profile (optional):
            </span>
          </div>
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
              textDecoration: 'underline',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RotateCcw size={12} />
            <span>Clear to Blank Form</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {SAMPLE_PROFILES.map((p) => {
            const isSelected = activeSampleId === p.id || (!isDirty && form.name === p.data.name);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applySample(p)}
                style={{
                  background: isSelected ? '#0F172A' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#334155',
                  border: isSelected ? '1px solid #0F172A' : '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '7px 12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s',
                  boxShadow: isSelected ? '0 2px 8px rgba(15, 23, 42, 0.15)' : 'none'
                }}
              >
                <span>{p.label}:</span>
                <span style={{ fontWeight: 400, opacity: isSelected ? 0.9 : 0.85 }}>{p.subLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Success Banner */}
      {success && (
        <div style={{
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          borderRadius: '14px',
          padding: '14px 18px',
          color: '#065F46',
          fontSize: '14px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.08)'
        }}>
          <CheckCircle2 size={20} color="#059669" />
          <span>Profile changes saved to database! Live updates are instantly synchronized to the Elderly Tablet.</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Section 1: Personal Identity */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '1.5rem 1.75rem',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
            <User size={18} color="#D97706" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              1. Personal Identity & Preferred Calling Name
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Elder's Full Name: <span style={{ color: '#E11D48' }}>*</span>
              </label>
              <input
                type="text"
                className="input-dark"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g. Rameshwar Iyer, Shanti Devi"
                required
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: '#0F172A',
                  width: '100%'
                }}
              />
              <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                Full family or legal name
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Age: <span style={{ color: '#E11D48' }}>*</span>
              </label>
              <input
                type="number"
                className="input-dark"
                value={form.age}
                onChange={(e) => updateField('age', e.target.value)}
                min="40"
                max="125"
                required
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: '#0F172A',
                  width: '100%'
                }}
              />
              <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                Current age
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Familiar Calling Name / Honorific: <span style={{ color: '#E11D48' }}>*</span>
              </label>
              <select
                className="input-dark"
                value={form.honorific}
                onChange={(e) => handleHonorificSelect(e.target.value)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: '#0F172A',
                  width: '100%'
                }}
              >
                {HONORIFIC_GROUPS.map((grp) => (
                  <optgroup key={grp.category} label={grp.category}>
                    {grp.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                How family & AI companion address them
              </span>
            </div>
          </div>

          {/* Conditional Custom Honorific Input */}
          {isCustomHonorific && (
            <div style={{
              marginTop: '14px',
              padding: '12px 14px',
              background: '#FEF3C7',
              border: '1px solid #FDE68A',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#92400E', marginBottom: '4px' }}>
                  Enter Custom Calling Name / Honorific:
                </label>
                <input
                  type="text"
                  value={form.customHonorific}
                  onChange={(e) => updateField('customHonorific', e.target.value)}
                  placeholder="e.g. Babuji, Maji, Tauji, Periyamma, Peddananna, Chachi Ji"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #F59E0B',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: '#0F172A',
                    width: '100%'
                  }}
                  autoFocus
                />
              </div>
              <p style={{ fontSize: '12px', color: '#78350F', margin: 0, maxWidth: '280px' }}>
                Type any affectionate or regional title your family uses.
              </p>
            </div>
          )}
        </div>

        {/* Section 2: Cultural Heritage & Language */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '1.5rem 1.75rem',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
            <Globe size={18} color="#D97706" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              2. Cultural Background, Language & Daily Greeting
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Indian Cultural Region:
              </label>
              <select
                className="input-dark"
                value={form.culturalRegion}
                onChange={(e) => updateField('culturalRegion', e.target.value)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: '#0F172A',
                  width: '100%'
                }}
              >
                {CULTURAL_REGIONS.map((r) => (
                  <option key={r.id} value={r.label}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Morning Greeting Phrase:
              </label>
              <input
                type="text"
                className="input-dark"
                value={form.greetingTitle}
                onChange={(e) => updateField('greetingTitle', e.target.value)}
                placeholder="e.g. Suprabhat, Vanakkam, Pranaam"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: '#0F172A',
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* Quick Greeting Suggestion Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Quick Greetings:</span>
            {GREETING_SUGGESTIONS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => updateField('greetingTitle', g)}
                style={{
                  background: form.greetingTitle === g ? '#FEF3C7' : '#F1F5F9',
                  color: form.greetingTitle === g ? '#92400E' : '#475569',
                  border: form.greetingTitle === g ? '1px solid #FCD34D' : '1px solid #E2E8F0',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {g}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Primary Language:
              </label>
              <select
                className="input-dark"
                value={form.primaryLanguage}
                onChange={(e) => updateField('primaryLanguage', e.target.value)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: '#0F172A',
                  width: '100%'
                }}
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                Used for voice recognition & on-screen prompts
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Secondary Language (Optional):
              </label>
              <input
                type="text"
                className="input-dark"
                value={form.secondaryLanguage}
                onChange={(e) => updateField('secondaryLanguage', e.target.value)}
                placeholder="e.g. English, Hindi"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: '#0F172A',
                  width: '100%'
                }}
              />
              <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                Additional language spoken at home
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Native Roots & Current Residence */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '1.5rem 1.75rem',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
            <MapPin size={18} color="#D97706" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              3. Roots & Current Living Environment
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Ancestral Hometown / Native Place:
              </label>
              <input
                type="text"
                className="input-dark"
                value={form.hometown}
                onChange={(e) => updateField('hometown', e.target.value)}
                placeholder="e.g. Mylapore, Chennai or Varanasi, UP or Jorhat, Assam"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: '#0F172A',
                  width: '100%'
                }}
              />
              <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                Used in reminiscence therapy, nostalgic photo quizzes & soothing stories
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Current City of Residence:
              </label>
              <input
                type="text"
                className="input-dark"
                value={form.currentResidence}
                onChange={(e) => updateField('currentResidence', e.target.value)}
                placeholder="e.g. Indiranagar, Bengaluru or Beltola, Guwahati"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: '#0F172A',
                  width: '100%'
                }}
              />
              <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                Where the elder currently resides
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Reminiscence & Emotional Comfort Anchors */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '1.5rem 1.75rem',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
            <Heart size={18} color="#D97706" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              4. Emotional Anchors & Nostalgic Comfort Cues
            </h3>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Familiar Comfort Notes & Sensory Anchors:
            </label>
            <textarea
              className="input-dark"
              rows={3}
              value={form.comfortNotes}
              onChange={(e) => updateField('comfortNotes', e.target.value)}
              placeholder="Familiar cultural cues, favorite ragas or songs, morning coffee aromas, temple visits, or childhood stories that bring reassurance during disorientation."
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '10px',
                padding: '12px 14px',
                fontSize: '14px',
                color: '#0F172A',
                width: '100%',
                lineHeight: 1.5,
                resize: 'vertical'
              }}
            />
            <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px', display: 'block' }}>
              💡 Example: "Responds warmly to M.S. Subbulakshmi Carnatic ragas, filter coffee aroma, mentions childhood trips to Thanjavur."
            </span>
          </div>
        </div>

        {/* Section 5: Primary Family Caregiver Contact */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '1.5rem 1.75rem',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
            <Phone size={18} color="#D97706" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              5. Primary Family Caregiver Contact
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Caregiver Name & Relationship:
              </label>
              <input
                type="text"
                className="input-dark"
                value={form.emergencyName}
                onChange={(e) => updateField('emergencyName', e.target.value)}
                placeholder="e.g. Karthik Iyer (Son) or Deepak Baruah (Son)"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: '#0F172A',
                  width: '100%'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Contact Phone Number:
              </label>
              <input
                type="tel"
                className="input-dark"
                value={form.emergencyPhone}
                onChange={(e) => updateField('emergencyPhone', e.target.value)}
                placeholder="+91 98XXX XXXXX"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: '#0F172A',
                  width: '100%'
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '1.25rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
        }}>
          <div>
            {isDirty ? (
              <button
                type="button"
                onClick={handleDiscardChanges}
                style={{
                  background: 'transparent',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#64748B',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RotateCcw size={15} />
                <span>Discard Changes</span>
              </button>
            ) : (
              <span style={{ fontSize: '13px', color: '#64748B' }}>
                All fields are synchronized with the database.
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #0F172A, #1E293B)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 28px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            <Save size={18} />
            <span>{loading ? 'Saving Profile...' : 'Save Profile & Sync'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
