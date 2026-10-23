import React, { useState, useEffect } from 'react';
import { Sparkles, Volume2, RotateCcw, Home, HelpCircle, CheckCircle2, ShieldCheck, Grid2X2 } from 'lucide-react';
import { speechService } from '../services/speechService';

// Thematic Card Sets
const CARD_THEMES = {
  culture: {
    id: 'culture',
    name: { en: 'Cultural Heritage', as: 'সাংস্কৃতিক বাদ্য ও বস্তু', hi: 'पारंपरिक वस्तुएं एवं वाद्य' },
    cards: [
      { id: 'dhol', emoji: '🥁', label: { en: 'Bihu Dhol', as: 'বিহু ঢোল' } },
      { id: 'bell', emoji: '🔔', label: { en: 'Temple Bell', as: 'মন্দিৰৰ কাঁহ-ঘণ্টা' } },
      { id: 'pepa', emoji: '🎺', label: { en: 'Buffalo Horn Pepa', as: 'ম’হৰ শিঙৰ পেঁপা' } },
      { id: 'gamusa', emoji: '🧣', label: { en: 'Phulam Gamusa', as: 'ফুলম গামোচা' } },
      { id: 'diya', emoji: '🪔', label: { en: 'Brass Diya', as: 'মাটিৰ চাকি / পিতলৰ চাকি' } },
      { id: 'japi', emoji: '👒', label: { en: 'Conical Japi', as: 'অসমীয়া জাপি' } }
    ]
  },
  nature: {
    id: 'nature',
    name: { en: 'Flowers & Nature', as: 'ফুল আৰু প্ৰকৃতি', hi: 'फूल एवं प्रकृति' },
    cards: [
      { id: 'orchid', emoji: '🌸', label: { en: 'Foxtail Orchid', as: 'কপৌ ফুল' } },
      { id: 'marigold', emoji: '🌼', label: { en: 'Golden Marigold', as: 'নাৰ্জী ফুল' } },
      { id: 'lotus', emoji: '🪷', label: { en: 'Sacred Lotus', as: 'পদ্ম ফুল' } },
      { id: 'leaf', emoji: '🍃', label: { en: 'Green Leaf', as: 'সেউজীয়া পাত' } },
      { id: 'rose', emoji: '🌹', label: { en: 'Velvet Rose', as: 'গোলাপ ফুল' } },
      { id: 'sunflower', emoji: '🌻', label: { en: 'Bright Sunflower', as: 'সূৰ্যমুখী ফুল' } }
    ]
  },
  household: {
    id: 'household',
    name: { en: 'Household Heirlooms', as: 'ঘৰুৱা চিনাকি বস্তু', hi: 'घरेलू सामान' },
    cards: [
      { id: 'teacup', emoji: '☕', label: { en: 'Brass Tea Cup', as: 'কাঁহৰ চাহৰ বাতি' } },
      { id: 'glasses', emoji: '👓', label: { en: 'Reading Glasses', as: 'পঢ়া চশমা' } },
      { id: 'kettle', emoji: '🫖', label: { en: 'Tea Kettle', as: 'চাহৰ কেটলী' } },
      { id: 'mortar', emoji: '🥣', label: { en: 'Ginger Mortar', as: 'মছলা বটা পাত্ৰ' } },
      { id: 'basket', emoji: '🧺', label: { en: 'Cane Basket', as: 'বাঁহৰ খৰাহী' } },
      { id: 'lantern', emoji: '🏮', label: { en: 'Veranda Lantern', as: 'পুৰণি চাকি' } }
    ]
  }
};

const DIFFICULTY_SETTINGS = {
  gentle: { pairs: 2, label: { en: 'Gentle (2 pairs)', as: 'শান্ত (২ যোৰ)' } },
  comfortable: { pairs: 4, label: { en: 'Comfortable (4 pairs)', as: 'আৰামদায়ক (৪ যোৰ)' } },
  explore: { pairs: 6, label: { en: 'More to Explore (6 pairs)', as: 'বৈচিত্ৰ্য (৬ যোৰ)' } }
};

export default function SmritiMatchQuestGame({ onSessionComplete, selectedLanguage = 'as', t }) {
  const [selectedTheme, setSelectedTheme] = useState('culture');
  const [difficulty, setDifficulty] = useState('gentle'); // gentle, comfortable, explore
  const [deck, setDeck] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null); // UID of first selected visible card
  const [highlightCandidates, setHighlightCandidates] = useState(false);
  const [celebration, setCelebration] = useState(false);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [showCaregiverNotes, setShowCaregiverNotes] = useState(false);
  const [sessionStartTime] = useState(Date.now());

  // Procedural Web Audio for gentle chime
  const playMatchChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {}
  };

  // Generate a deck of VISIBLE duplicate pairs
  const generateDeck = (themeKey, diffKey) => {
    const pairCount = DIFFICULTY_SETTINGS[diffKey].pairs;
    const pool = CARD_THEMES[themeKey].cards;
    const chosenCards = pool.slice(0, pairCount);

    // Create exactly 2 instances of each chosen card
    const cards = [];
    chosenCards.forEach((c, idx) => {
      // First card
      cards.push({
        uid: `${c.id}_1`,
        cardId: c.id,
        emoji: c.emoji,
        label: c.label,
        isMatched: false
      });
      // Duplicate matching card
      cards.push({
        uid: `${c.id}_2`,
        cardId: c.id,
        emoji: c.emoji,
        label: c.label,
        isMatched: false
      });
    });

    // Shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    setDeck(cards);
    setSelectedCardId(null);
    setMatchedPairsCount(0);
    setCelebration(false);
    setHighlightCandidates(false);
  };

  useEffect(() => {
    generateDeck(selectedTheme, difficulty);
  }, [selectedTheme, difficulty]);

  const speakInstructions = () => {
    const text = selectedLanguage === 'as'
      ? 'তলৰ কাৰ্ডবোৰ খোলা আছে। যিকোনো এখন কাৰ্ড স্পৰ্শ কৰক আৰু তাৰ পাছত একে ছবি থকা আনখন কাৰ্ড বিচাৰি স্পৰ্শ কৰক।'
      : selectedLanguage === 'hi'
      ? 'नीचे सभी कार्ड खुले हुए हैं। पहले एक कार्ड छुएं, फिर उसके जैसा दूसरा कार्ड ढूंढकर छुएं।'
      : 'All cards below are visible. Tap one card, then look across the grid to find and tap its identical match.';
    speechService.speak(text, selectedLanguage);
  };

  const handleCardClick = (card) => {
    if (card.isMatched) return;

    // Case 1: First card selected
    if (!selectedCardId) {
      setSelectedCardId(card.uid);
      setHighlightCandidates(false);
      const prompt = selectedLanguage === 'as'
        ? `আপুনি ${card.label?.as || 'কাৰ্ড'} বাছিলে। এতিয়া একে ছবি থকা আনখন বিচাৰক।`
        : `Selected ${card.label?.en || 'card'}. Now tap its identical match.`;
      setFeedbackText(prompt);
      return;
    }

    // If user clicked the same card again, deselect
    if (selectedCardId === card.uid) {
      setSelectedCardId(null);
      setFeedbackText('');
      return;
    }

    // Case 2: Second card selected, check for match!
    const firstCard = deck.find(c => c.uid === selectedCardId);
    if (!firstCard) return;

    if (firstCard.cardId === card.cardId) {
      // MATCH FOUND!
      playMatchChime();
      const newDeck = deck.map(c => 
        (c.uid === firstCard.uid || c.uid === card.uid)
          ? { ...c, isMatched: true }
          : c
      );
      setDeck(newDeck);
      setSelectedCardId(null);
      const newCount = matchedPairsCount + 1;
      setMatchedPairsCount(newCount);

      const winMsg = selectedLanguage === 'as'
        ? `সুন্দৰ মিল! আপুনি ${card.label?.as || 'যোৰ'} বিচাৰি পালে।`
        : `Splendid match! You found both ${card.label?.en || 'cards'}.`;
      setFeedbackText(winMsg);
      speechService.speak(winMsg, selectedLanguage);

      // Check if all pairs cleared
      const totalPairs = DIFFICULTY_SETTINGS[difficulty].pairs;
      if (newCount >= totalPairs) {
        setCelebration(true);
        const victoryMsg = selectedLanguage === 'as'
          ? 'সকলো কাৰ্ড সফলতাৰে মিলিল! বৰ আনন্দ লাগিল।'
          : 'All visible pairs matched splendidly! Wonderful attention.';
        speechService.speak(victoryMsg, selectedLanguage);
      }
    } else {
      // Non-matching pair: gentle feedback, cards remain available
      setSelectedCardId(null);
      const retryMsg = selectedLanguage === 'as'
        ? 'ইখন বেলেগ আছিল। শান্তভাৱে আকৌ চেষ্টা কৰক।'
        : "Those two are different. Let's try finding the matching one!";
      setFeedbackText(retryMsg);
      speechService.speak(retryMsg, selectedLanguage);
    }
  };

  const handleHelpCandidate = () => {
    if (!selectedCardId) {
      // Auto select the first unmatched card
      const firstUnmatched = deck.find(c => !c.isMatched);
      if (firstUnmatched) {
        setSelectedCardId(firstUnmatched.uid);
      }
    }
    setHighlightCandidates(true);
  };

  const handleCompleteSession = (status = 'completed') => {
    const duration = Math.round((Date.now() - sessionStartTime) / 1000);
    onSessionComplete?.({
      activityType: 'smriti_match_quest',
      activityTitle: 'Smriti Match Quest (Visible Grid)',
      durationSeconds: duration,
      difficulty,
      itemsEngaged: matchedPairsCount * 2,
      completionStatus: status,
      supportiveFeedback: 'Unhurried Visible Grid Matching'
    });
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '2px solid #E2E8F0',
        paddingBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => handleCompleteSession('exited')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '14px',
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              color: '#334155',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            <Home size={18} />
            <span>{t?.mainMenu || 'Main Menu'}</span>
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: '#DCFCE7',
                color: '#166534',
                padding: '3px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800
              }}>
                EXCLUSIVE • VISIBLE CARD DISCRIMINATION
              </span>
              <span style={{ fontSize: '13px', color: '#059669', fontWeight: 700 }}>
                ● Purble Place Inspired
              </span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '4px 0 0 0' }}>
              {selectedLanguage === 'as' ? 'স্মৃতি মিলন অভিযান (Smriti Match Quest)' :
               selectedLanguage === 'hi' ? 'स्मृति मैच क्वेस्ट (Smriti Match Quest)' :
               'Smriti Match Quest — Visible Card Pairs'}
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={speakInstructions}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '14px',
              background: '#EFF6FF',
              border: '2px solid #BFDBFE',
              color: '#1D4ED8',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Volume2 size={18} />
            <span>{selectedLanguage === 'as' ? 'নিৰ্দেশনা শুনক' : 'Hear Rules'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCaregiverNotes(prev => !prev)}
            style={{
              padding: '10px 14px',
              borderRadius: '14px',
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              color: '#475569',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={18} color="#059669" />
            <span>Caregiver Info</span>
          </button>
        </div>
      </div>

      {/* Control Banner: Theme Selection, Difficulty & Assistance */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '1rem 1.5rem',
        border: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Themes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#475569' }}>Theme:</span>
          {Object.entries(CARD_THEMES).map(([tKey, tData]) => (
            <button
              key={tKey}
              type="button"
              onClick={() => setSelectedTheme(tKey)}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                background: selectedTheme === tKey ? '#10B981' : '#F1F5F9',
                color: selectedTheme === tKey ? '#FFFFFF' : '#334155',
                border: selectedTheme === tKey ? '2px solid #059669' : '1px solid #CBD5E1'
              }}
            >
              {tData.name[selectedLanguage] || tData.name.en}
            </button>
          ))}
        </div>

        {/* Difficulty */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#475569' }}>Pairs:</span>
          {Object.entries(DIFFICULTY_SETTINGS).map(([dKey, dData]) => (
            <button
              key={dKey}
              type="button"
              onClick={() => setDifficulty(dKey)}
              style={{
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                background: difficulty === dKey ? '#D97706' : '#F8FAFC',
                color: difficulty === dKey ? '#FFFFFF' : '#475569',
                border: difficulty === dKey ? '2px solid #B45309' : '1px solid #CBD5E1'
              }}
            >
              {dData.label[selectedLanguage] || dData.label.en}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visible Cards Grid Arena */}
      <div style={{
        background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 45%, #F0FDF4 100%)',
        borderRadius: '24px',
        padding: '2rem',
        border: '3px solid #86EFAC',
        minHeight: '380px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {/* Grid of Visible Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${difficulty === 'gentle' ? 2 : difficulty === 'comfortable' ? 4 : 4}, minmax(110px, 1fr))`,
          gap: '16px',
          width: '100%',
          maxWidth: difficulty === 'gentle' ? '360px' : '720px'
        }}>
          {deck.map((card) => {
            const isSelected = selectedCardId === card.uid;
            const isTwin = highlightCandidates && selectedCardId && !card.isMatched &&
              deck.find(c => c.uid === selectedCardId)?.cardId === card.cardId && card.uid !== selectedCardId;

            return (
              <button
                key={card.uid}
                type="button"
                disabled={card.isMatched}
                onClick={() => handleCardClick(card)}
                style={{
                  height: '130px',
                  borderRadius: '20px',
                  background: card.isMatched
                    ? '#F0FDF4'
                    : isSelected
                    ? '#FEF3C7'
                    : '#FFFFFF',
                  border: card.isMatched
                    ? '3px solid #86EFAC'
                    : isSelected
                    ? '4px solid #F59E0B'
                    : isTwin
                    ? '3px dashed #10B981'
                    : '2px solid #CBD5E1',
                  boxShadow: isSelected
                    ? '0 0 20px rgba(245, 158, 11, 0.45)'
                    : card.isMatched
                    ? 'none'
                    : '0 4px 12px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: card.isMatched ? 'default' : 'pointer',
                  opacity: card.isMatched ? 0.6 : 1,
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  padding: '8px'
                }}
              >
                <span style={{ fontSize: '48px', lineHeight: 1 }}>{card.emoji}</span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: card.isMatched ? '#16A34A' : isSelected ? '#92400E' : '#475569',
                  marginTop: '8px',
                  textAlign: 'center'
                }}>
                  {card.label?.[selectedLanguage] || card.label?.en}
                </span>

                {card.isMatched && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: '#16A34A',
                    color: '#FFF',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px'
                  }}>
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Celebration Overlay Banner */}
        {celebration && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(5px)',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20
          }}>
            <Sparkles size={48} color="#16A34A" style={{ marginBottom: '8px' }} />
            <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#166534', margin: 0 }}>
              {selectedLanguage === 'as' ? 'সুন্দৰ মিলন সম্পূৰ্ণ হ’ল!' : 'All Visible Pairs Matched!'}
            </h3>
            <p style={{ fontSize: '16px', color: '#15803D', marginTop: '6px', fontWeight: 600 }}>
              {selectedLanguage === 'as' ? 'মনযোগ আৰু দৃষ্টিৰ বাবে ধন্যবাদ।' : 'Thank you for your warm engagement.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => generateDeck(selectedTheme, difficulty)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '14px',
                  background: '#16A34A',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {selectedLanguage === 'as' ? 'পুনৰ খেলক' : 'Play Again'}
              </button>
              <button
                type="button"
                onClick={() => handleCompleteSession('completed')}
                style={{
                  padding: '12px 24px',
                  borderRadius: '14px',
                  background: '#F1F5F9',
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: '15px',
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer'
                }}
              >
                {selectedLanguage === 'as' ? 'মুখ্য পৃষ্ঠালৈ ঘূৰি যাওক' : 'Return Home'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Helper Toolbar */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '18px',
        padding: '12px 20px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Highlight Twin Hint */}
          <button
            type="button"
            onClick={handleHelpCandidate}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              background: '#FEF3C7',
              border: '2px solid #F59E0B',
              color: '#92400E',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={16} />
            <span>{selectedLanguage === 'as' ? 'মিলা কাৰ্ড দেখুৱাওক' : 'Highlight Match'}</span>
          </button>

          {/* Feedback notice */}
          {feedbackText && (
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#166534' }}>
              {feedbackText}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => generateDeck(selectedTheme, difficulty)}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              color: '#64748B',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={16} style={{ display: 'inline', marginRight: '4px' }} />
            <span>{selectedLanguage === 'as' ? 'নতুন খেল' : 'Reset'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleCompleteSession('completed')}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              background: '#16A34A',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {selectedLanguage === 'as' ? 'সম্পূৰ্ণ হ’ল' : 'Finish'}
          </button>
        </div>
      </div>

      {/* Caregiver Clinical Transparency Drawer */}
      {showCaregiverNotes && (
        <div style={{
          background: '#0B0F17',
          color: '#F8FAFC',
          borderRadius: '18px',
          padding: '1.25rem 1.5rem',
          border: '1px solid #334155'
        }}>
          <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0', color: '#86EFAC' }}>
            Caregiver Notes — Smriti Match Quest (Visible Grid Discrimination)
          </h4>
          <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5, margin: 0 }}>
            <strong>Distinct Mechanic:</strong> Unlike the face-down <em>Memory Match</em> game which tests hidden working memory, 
            <em>Smriti Match Quest</em> presents all cards face up. It exercises visual discrimination, scanning, and duplicate identification.
            <br />
            Matched Pairs: <strong>{matchedPairsCount} / {DIFFICULTY_SETTINGS[difficulty].pairs}</strong>.
            <br />
            <em>Clinical Guardrail: Non-matching selections are normal visual search behavior. No failure scoring is applied.</em>
          </p>
        </div>
      )}
    </div>
  );
}
