import React from 'react';
import { Globe, Check, ArrowRight } from 'lucide-react';

const REGIONAL_LANGUAGES = [
  {
    code: 'en',
    label: 'English',
    nativeName: 'English (Default)',
    greeting: 'Welcome & Continue in English',
    flag: '🇬🇧',
    isDefault: true
  },
  {
    code: 'hi',
    label: 'Hindi',
    nativeName: 'हिन्दी',
    greeting: 'नमस्ते! हिन्दी में आगे बढ़ें',
    flag: '🇮🇳',
    desc: 'North & Central India'
  },
  {
    code: 'bn',
    label: 'Bengali',
    nativeName: 'বাংলা',
    greeting: 'নমস্কার! বাংলায় এগিয়ে চলুন',
    flag: '🇮🇳',
    desc: 'West Bengal & Eastern India'
  },
  {
    code: 'as',
    label: 'Assamese',
    nativeName: 'অসমীয়া',
    greeting: 'নমস্কাৰ! অসমীয়াত আৰম্ভ কৰক',
    flag: '🇮🇳',
    desc: 'Assam & North-East India'
  },
  {
    code: 'ne',
    label: 'Nepali',
    nativeName: 'नेपाली',
    greeting: 'नमस्ते! नेपालीमा सुरु गर्नुहोस्',
    flag: '🇮🇳',
    desc: 'Himalayan & North-East India'
  }
];

export default function FirstTimeLanguageModal({ isOpen, onSelectLanguage, currentLanguage = 'en' }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1.5rem',
      animation: 'fadeIn 0.25s ease-out'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '28px',
        maxWidth: '740px',
        width: '100%',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
        border: '3px solid #E2E8F0',
        padding: '2.5rem',
        maxHeight: '92vh',
        overflowY: 'auto'
      }}>
        {/* Header Badge & Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FEF3C7',
            color: '#B45309',
            padding: '8px 18px',
            borderRadius: '24px',
            fontSize: '15px',
            fontWeight: 700,
            marginBottom: '1rem'
          }}>
            <Globe size={18} />
            <span>Welcome to Smriti Setu • স্মৃতি সেতু</span>
          </div>

          <h2 style={{
            fontSize: '32px',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '0.75rem',
            lineHeight: 1.25
          }}>
            Choose Your Comfortable Language
          </h2>

          <p style={{
            fontSize: '19px',
            color: '#475569',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.5
          }}>
            We are starting in <strong>English</strong>. You can continue in English or tap below to switch to your preferred regional Indian language.
          </p>
        </div>

        {/* Primary Default Action: Continue in English */}
        <div style={{ marginBottom: '1.75rem' }}>
          <button
            type="button"
            onClick={() => onSelectLanguage('en')}
            style={{
              width: '100%',
              backgroundColor: '#1E293B',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '20px',
              padding: '1.25rem 1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(15, 23, 42, 0.25)',
              transition: 'transform 0.15s, background-color 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}>
              <span style={{ fontSize: '32px' }}>🇬🇧</span>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 800 }}>Continue in English</div>
                <div style={{ fontSize: '15px', color: '#94A3B8' }}>Proceed with English as your main language</div>
              </div>
            </div>
            <ArrowRight size={26} color="#38BDF8" />
          </button>
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '1.5rem 0',
          color: '#94A3B8',
          fontSize: '15px',
          fontWeight: 700
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
          <span>OR CHOOSE YOUR REGIONAL LANGUAGE</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
        </div>

        {/* Regional Language Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
          marginBottom: '2rem'
        }}>
          {REGIONAL_LANGUAGES.filter(l => l.code !== 'en').map((lang) => {
            const isCurrent = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => onSelectLanguage(lang.code)}
                style={{
                  backgroundColor: isCurrent ? '#EFF6FF' : '#F8FAFC',
                  border: isCurrent ? '3px solid #3B82F6' : '2px solid #E2E8F0',
                  borderRadius: '18px',
                  padding: '1.15rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s'
                }}
              >
                <span style={{ fontSize: '30px' }}>{lang.flag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                    {lang.nativeName}
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B', marginLeft: '6px' }}>
                      ({lang.label})
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#B45309', fontWeight: 600, marginTop: '2px' }}>
                    {lang.greeting}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                    {lang.desc}
                  </div>
                </div>
                {isCurrent && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#3B82F6',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={16} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Dignified Reassurance Note */}
        <div style={{
          backgroundColor: '#F1F5F9',
          borderRadius: '16px',
          padding: '12px 18px',
          textAlign: 'center',
          fontSize: '15px',
          color: '#475569',
          fontWeight: 600
        }}>
          💡 <em>You can comfortably switch between languages at any second using the language pills at the top right of the screen.</em>
        </div>
      </div>
    </div>
  );
}
