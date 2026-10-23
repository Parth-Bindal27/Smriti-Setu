import React, { useState, useEffect } from 'react';
import { Sparkles, Droplets, Sun, RotateCcw, Volume2, Heart } from 'lucide-react';
import { speechService } from '../services/speechService';

const FLOWERS = [
  { id: 'kopou', name: { as: 'কপৌ ফুল (Assam Orchid)', hi: 'ऑर्किड फूल', en: 'Kopou Orchid' }, icon: '🌸', color: '#F472B6' },
  { id: 'marigold', name: { as: 'নাৰ্জী ফুল (Marigold)', hi: 'गेंदे का फूल', en: 'Golden Marigold' }, icon: '🌼', color: '#F59E0B' },
  { id: 'jasmine', name: { as: 'তগৰ ফুল (Jasmine)', hi: 'तगर / चमेली', en: 'White Jasmine' }, icon: '🤍', color: '#E2E8F0' },
  { id: 'hibiscus', name: { as: 'জবা ফুল (Hibiscus)', hi: 'गुड़हल का फूल', en: 'Red Hibiscus' }, icon: '🌺', color: '#EF4444' },
  { id: 'tulsi', name: { as: 'পৱিত্ৰ তুলসী (Tulsi Pot)', hi: 'पवित्र तुलसी', en: 'Sacred Tulsi' }, icon: '🪴', color: '#10B981' }
];

export default function GardenOfMemoriesGame({ onSessionComplete, selectedLanguage = 'as', t }) {
  const [gardenPots, setGardenPots] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('smriti_garden_pots');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: 1, flower: FLOWERS[0], watered: true },
      { id: 2, flower: FLOWERS[1], watered: false },
      { id: 3, flower: null, watered: false },
      { id: 4, flower: null, watered: false }
    ];
  });

  const [selectedFlower, setSelectedFlower] = useState(FLOWERS[2]);
  const [affirmation, setAffirmation] = useState('');

  // Persist garden
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('smriti_garden_pots', JSON.stringify(gardenPots));
      } catch (e) {}
    }
  }, [gardenPots]);

  const handlePlantFlower = (potId) => {
    setGardenPots(prev => prev.map(pot => {
      if (pot.id === potId) {
        return { ...pot, flower: selectedFlower, watered: false };
      }
      return pot;
    }));

    const flowerName = selectedFlower.name[selectedLanguage] || selectedFlower.name.en;
    const msg = selectedLanguage === 'as' 
      ? `সুন্দৰ! আপুনি ${flowerName} ৰোপণ কৰিলে।` 
      : `Planted ${flowerName} with care.`;
    setAffirmation(msg);
    speechService.speak(msg, selectedLanguage);
  };

  const handleWaterPot = (potId) => {
    setGardenPots(prev => prev.map(pot => {
      if (pot.id === potId && pot.flower) {
        return { ...pot, watered: true };
      }
      return pot;
    }));

    const msg = selectedLanguage === 'as' 
      ? 'পানী পাই ফুলবোৰ সতেজ হৈ ফুলি উঠিছে!' 
      : 'Watered gently! The blossoms are blooming in sunlight.';
    setAffirmation(msg);
    speechService.speak(msg, selectedLanguage);
  };

  const handleFinish = () => {
    if (onSessionComplete) {
      onSessionComplete({
        activityType: 'garden_of_memories',
        activityTitle: 'Garden of Memories — Virtual Living Sanctuary',
        completionStatus: 'completed'
      });
    }
  };

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '2rem 2.5rem',
        border: '2px solid #E2E8F0',
        boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span style={{
              background: '#DCFCE7',
              color: '#15803D',
              padding: '4px 12px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700
            }}>
              Garden of Memories • স্মৃতিৰ ফুলনি
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '6px 0 2px 0', color: '#1E293B' }}>
              {selectedLanguage === 'as' ? 'বাৰান্দাৰ শান্ত ফুলনি' : 'Your Peaceful Veranda Garden'}
            </h2>
            <p style={{ fontSize: '18px', color: '#64748B' }}>
              {selectedLanguage === 'as' ? 'পছন্দৰ ফুল বাছক আৰু টাবত ৰোপণ কৰক:' : 'Choose your favorite blossom and plant it in the sunny courtyard:'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            style={{
              background: '#10B981',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '14px',
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={18} />
            <span>Save Garden & Return</span>
          </button>
        </div>

        {affirmation && (
          <div style={{
            background: '#F0FDF4',
            border: '2px solid #86EFAC',
            borderRadius: '16px',
            padding: '12px 18px',
            color: '#166534',
            fontSize: '18px',
            fontWeight: 700,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Sparkles size={20} color="#16A34A" />
            <span>{affirmation}</span>
          </div>
        )}

        {/* Flower Palette Selector */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '10px', color: '#475569' }}>
            {selectedLanguage === 'as' ? 'ৰোপণৰ বাবে ফুল বাছক:' : 'Select a Blossom to Plant:'}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
            {FLOWERS.map(f => {
              const isSelected = selectedFlower.id === f.id;
              const name = f.name[selectedLanguage] || f.name.en;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFlower(f)}
                  style={{
                    background: isSelected ? '#FEF3C7' : '#F8FAFC',
                    border: isSelected ? '3px solid #F59E0B' : '2px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(245, 158, 11, 0.25)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '32px' }}>{f.icon}</span>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', textAlign: 'left' }}>{name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Veranda Garden Pots Grid */}
        <div style={{
          background: 'linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 45%, #86EFAC 100%)',
          borderRadius: '24px',
          padding: '2.5rem 1.5rem',
          border: '3px solid #93C5FD',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px'
        }}>
          {gardenPots.map(pot => {
            return (
              <div
                key={pot.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  borderRadius: '20px',
                  padding: '1.5rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
                  backdropFilter: 'blur(4px)'
                }}
              >
                <div style={{
                  fontSize: '56px',
                  minHeight: '70px',
                  display: 'flex',
                  alignItems: 'center',
                  transform: pot.watered ? 'scale(1.15)' : 'scale(1)',
                  transition: 'transform 0.3s ease'
                }}>
                  {pot.flower ? pot.flower.icon : '🪹'}
                </div>

                <span style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B' }}>
                  {pot.flower ? (pot.flower.name[selectedLanguage] || pot.flower.name.en) : (selectedLanguage === 'as' ? 'খালী টাব' : 'Empty Pot')}
                </span>

                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => handlePlantFlower(pot.id)}
                    style={{
                      background: '#F59E0B',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🌱 Plant
                  </button>

                  {pot.flower && (
                    <button
                      type="button"
                      onClick={() => handleWaterPot(pot.id)}
                      style={{
                        background: pot.watered ? '#0284C7' : '#E0F2FE',
                        color: pot.watered ? '#FFFFFF' : '#0369A1',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Droplets size={14} />
                      <span>{pot.watered ? 'Blooming ✨' : 'Water 💧'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
