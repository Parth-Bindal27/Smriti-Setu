import React, { useState } from 'react';
import { ChefHat, Sparkles, Volume2, HelpCircle, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';
import { speechService } from '../services/speechService';

const RECIPES = [
  {
    id: 'recipe_tea',
    title: {
      as: 'অসমীয়া ৰঙা চাহ (Traditional Assam Tea)',
      bn: 'আসামের সুবাসিত লাল চা (Assam Red Tea)',
      ne: 'परम्परागत असमिया रातो चिया (Assam Tea)',
      hi: 'पारंपरिक असम लाल चाय (Assam Tea)',
      en: 'Traditional Assam Ronga Saah (Red Tea)'
    },
    steps: [
      { id: 1, order: 1, icon: '🫖', text: { as: 'কেটলীত বিশুদ্ধ পানী উতলাওক', hi: 'केतली में पानी उबालें', en: 'Boil clean water in kettle' } },
      { id: 2, order: 2, icon: '🫚', text: { as: 'অলপ আদা আৰু ইলাচী পিহি দিয়ক', hi: 'कुटी हुई अदरक व इलायची डालें', en: 'Add crushed ginger and cardamom' } },
      { id: 3, order: 3, icon: '🍃', text: { as: 'সুগন্ধি আসাম চাহপাত দিয়ক', hi: 'सुगंधित असम चायपत्ती डालें', en: 'Add fragrant Assam tea leaves' } },
      { id: 4, order: 4, icon: '☕', text: { as: 'কাঁহৰ বাতিত গৰমে গৰমে বাকি দিয়ক', hi: 'पारंपरिक प्याले में गर्मागर्म छानें', en: 'Pour steaming tea into traditional cup' } }
    ]
  }
];

export default function RecipeRebuilderGame({ onSessionComplete, selectedLanguage = 'as', t }) {
  const recipe = RECIPES[0];
  const recipeTitle = recipe.title[selectedLanguage] || recipe.title.en;

  // Shuffle initial pool
  const [availableCards, setAvailableCards] = useState(() => {
    return [...recipe.steps].sort(() => Math.random() - 0.5);
  });
  const [placedSteps, setPlacedSteps] = useState([]);
  const [hintMessage, setHintMessage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectCard = (card) => {
    const nextExpectedOrder = placedSteps.length + 1;
    if (card.order === nextExpectedOrder) {
      const newPlaced = [...placedSteps, card];
      setPlacedSteps(newPlaced);
      setAvailableCards(prev => prev.filter(c => c.id !== card.id));
      setHintMessage('');

      const stepText = card.text[selectedLanguage] || card.text.en;
      speechService.speak(stepText, selectedLanguage);

      if (newPlaced.length === recipe.steps.length) {
        setIsCompleted(true);
        const win = selectedLanguage === 'as' 
          ? 'বৰ সুন্দৰ! চাহৰ সোৱাদ আপোনাৰ সম্পূৰ্ণ মনত আছে।' 
          : 'Wonderfully brewed! You recreated the cherished recipe perfectly.';
        setTimeout(() => speechService.speak(win, selectedLanguage), 1000);

        setTimeout(() => {
          if (onSessionComplete) {
            onSessionComplete({
              activityType: 'recipe_rebuilder',
              activityTitle: 'Recipe Rebuilder — Procedural Kitchen Recall',
              completionStatus: 'completed'
            });
          }
        }, 3000);
      }
    } else {
      // Gentle hint without punishment
      const gentleText = selectedLanguage === 'as' 
        ? 'ই এটা সুন্দৰ পদক্ষেপ, কিন্তু ইয়াৰ আগতে কিবা এটা কৰিব লাগে নেকি ভাবি চাওক।' 
        : 'A wonderful step, but think what comes just before this.';
      setHintMessage(gentleText);
      speechService.speak(gentleText, selectedLanguage);
    }
  };

  const handleReset = () => {
    setPlacedSteps([]);
    setAvailableCards([...recipe.steps].sort(() => Math.random() - 0.5));
    setHintMessage('');
    setIsCompleted(false);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '2rem 2.5rem',
        border: '2px solid #E2E8F0',
        boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span style={{
              background: '#FEF3C7',
              color: '#92400E',
              padding: '4px 12px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700
            }}>
              Recipe Rebuilder • পাকঘৰৰ স্মৃতি
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '6px 0 2px 0' }}>
              {recipeTitle}
            </h2>
            <p style={{ fontSize: '18px', color: '#64748B' }}>
              {selectedLanguage === 'as' ? 'চাহ বনোৱাৰ সঠিক ক্ৰমটো বাছক:' : 'Tap the steps in the order you prepare your tea:'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            style={{
              background: '#F8FAFC',
              border: '2px solid #CBD5E1',
              borderRadius: '12px',
              padding: '8px 16px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={16} />
            <span>Start Fresh</span>
          </button>
        </div>

        {hintMessage && (
          <div style={{
            background: '#FEF9C3',
            border: '2px solid #FDE047',
            borderRadius: '14px',
            padding: '10px 16px',
            color: '#854D0E',
            fontSize: '16px',
            fontWeight: 700,
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <HelpCircle size={18} color="#D97706" />
            <span>{hintMessage}</span>
          </div>
        )}

        {/* Recipe Timeline Track (Placed Steps) */}
        <div style={{
          background: '#F8FAFC',
          border: '2px dashed #CBD5E1',
          borderRadius: '20px',
          padding: '1.5rem',
          minHeight: '140px',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          {placedSteps.length === 0 ? (
            <p style={{ color: '#94A3B8', fontSize: '18px', fontStyle: 'italic', margin: '0 auto' }}>
              {selectedLanguage === 'as' ? 'তলৰ পৰা প্ৰথম পদক্ষেপটো চুই চাওক' : 'Tap the first step below to begin brewing'}
            </p>
          ) : (
            placedSteps.map((step, idx) => {
              const text = step.text[selectedLanguage] || step.text.en;
              return (
                <div
                  key={step.id}
                  style={{
                    background: '#FFFFFF',
                    border: '2px solid #16A34A',
                    borderRadius: '16px',
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                  }}
                >
                  <span style={{
                    background: '#16A34A',
                    color: '#FFF',
                    borderRadius: '50%',
                    width: '26px',
                    height: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 800
                  }}>
                    {idx + 1}
                  </span>
                  <span style={{ fontSize: '28px' }}>{step.icon}</span>
                  <span style={{ fontSize: '17px', fontWeight: 700, color: '#1E293B' }}>{text}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Available Cards Pool */}
        {!isCompleted && (
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px', color: '#475569' }}>
              {selectedLanguage === 'as' ? 'পৰৱৰ্তী পদক্ষেপ বাছক:' : 'Choose the next step:'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {availableCards.map(card => {
                const text = card.text[selectedLanguage] || card.text.en;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleSelectCard(card)}
                    style={{
                      background: '#FFFFFF',
                      border: '2px solid #E2E8F0',
                      borderRadius: '18px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontSize: '36px' }}>{card.icon}</span>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#1E293B' }}>{text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isCompleted && (
          <div style={{
            background: '#DCFCE7',
            border: '2px solid #86EFAC',
            borderRadius: '20px',
            padding: '2rem',
            textAlign: 'center',
            color: '#166534'
          }}>
            <Sparkles size={48} style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '28px', fontWeight: 800 }}>
              {selectedLanguage === 'as' ? 'চাহৰ সুবাসে মন জুৰালে!' : 'A Perfect Warm Cup of Tea!'}
            </h3>
            <p style={{ fontSize: '18px', marginTop: '6px' }}>
              {selectedLanguage === 'as' ? 'আপোনাৰ স্মৃতিৰ ক্ৰম অতি সুন্দৰ।' : 'You remembered the exact steps with wonderful warmth.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
