import React from 'react';
import { Settings, ArrowLeft, Globe, ShieldCheck } from 'lucide-react';

const LANGUAGES = [
  { code: 'as', label: 'অসমীয়া' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ne', label: 'नेपाली' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'en', label: 'English' }
];

export default function Header({
  profile,
  activeModule,
  onBackHome,
  onOpenDemoSetup,
  onOpenAssessment,
  currentLang = 'as',
  onLangChange,
  t
}) {
  const honorific = profile?.honorific || 'Koka';
  const name = profile?.name || 'Bhaben Baruah';
  const residence = profile?.currentResidence || 'Beltola, Guwahati';

  // Format today's date in a serene, readable style
  const today = new Date();
  const dateStr = today.toLocaleDateString(
    currentLang === 'en' ? 'en-US' : 
    currentLang === 'bn' ? 'bn-IN' : 
    currentLang === 'ne' ? 'ne-NP' : 
    currentLang === 'hi' ? 'hi-IN' : 'as-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header style={{
      position: 'relative',
      padding: '1.75rem 2.5rem 1.25rem',
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '2px solid var(--border-subtle)',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1.25rem'
    }}>
      {/* Gentle Daily Check-in */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button 
          className="corner-caregiver-btn"
          onClick={onOpenAssessment}
          style={{
            background: '#FEF3C7',
            color: '#92400E',
            borderColor: '#FCD34D',
            padding: '8px 18px',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
          title="Daily Gentle Memory Verification Check-in"
        >
          <ShieldCheck size={20} />
          <span>{t.memoryCheck || (currentLang === 'hi' ? 'दैनिक स्मृति जांच' : currentLang === 'bn' ? 'দৈনিক স্মৃতি যাচাই' : currentLang === 'as' ? 'দৈনিক স্মৃতি পৰীক্ষা' : 'Daily Memory Check-in')}</span>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {activeModule && (
          <button
            className="btn-large btn-outline"
            style={{ minHeight: '60px', padding: '10px 24px', fontSize: '20px', borderRadius: '16px' }}
            onClick={onBackHome}
            aria-label="Back to Main Menu"
          >
            <ArrowLeft size={24} />
            <span>{t.mainMenu}</span>
          </button>
        )}

        <div>
          <h1 style={{ fontSize: '36px', marginBottom: '4px' }}>
            {t.greeting}, {name.split(' ')[0]} {honorific}!
          </h1>
          <p style={{ fontSize: '20px', color: 'var(--text-muted)' }}>
            {dateStr} • {residence}
          </p>
        </div>
      </div>

      {/* Right Controls: Accessible Language Switcher & Peace Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        {/* Language Pills Switcher */}
        <div style={{
          background: '#FFFFFF',
          border: '2px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{ padding: '0 6px 0 8px', color: 'var(--text-muted)' }}>
            <Globe size={18} />
          </div>
          {LANGUAGES.map((lang) => {
            const isActive = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => onLangChange(lang.code)}
                style={{
                  background: isActive ? 'var(--accent-amber)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-main)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '8px 16px',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {lang.label}
              </button>
            );
          })}
        </div>

        <div style={{
          background: '#EFF6FF',
          color: '#1D4ED8',
          border: '1px solid #BFDBFE',
          padding: '8px 18px',
          borderRadius: '24px',
          fontSize: '17px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🇮🇳</span>
          <span>{profile?.culturalRegion || profile?.region || t.indiaBadge || 'Culturally Grounded • India'}</span>
        </div>

        <div style={{
          background: 'var(--affirm-green-light)',
          color: 'var(--affirm-green-hover)',
          padding: '8px 18px',
          borderRadius: '24px',
          fontSize: '18px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--affirm-green)', display: 'inline-block' }}></span>
          {t.peacefulDay}
        </div>
      </div>
    </header>
  );
}
