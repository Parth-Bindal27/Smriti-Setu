import React, { useState, useEffect, useRef } from 'react';
import { Video, Volume2, Heart, ArrowLeft, PhoneCall, Sparkles, CheckCircle2, RefreshCw, Smile } from 'lucide-react';
import { speechService } from '../services/speechService';

export default function VirtualPresenceRoom({ onSessionComplete, apiUrl, selectedLanguage = 'as', t }) {
  const [presences, setPresences] = useState([]);
  const [selectedPresence, setSelectedPresence] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elderResponseFeedback, setElderResponseFeedback] = useState(null);
  const [audioOnlyMode, setAudioOnlyMode] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchPresences();
  }, [apiUrl]);

  const fetchPresences = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/virtual-presence`);
      if (res.ok) {
        const data = await res.json();
        setPresences(data.presences || []);
        if (data.presences && data.presences.length > 0) {
          setSelectedPresence(data.presences[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to load virtual presence clips:', err);
    }
  };

  const handleSelectPresence = (presence) => {
    speechService.stop();
    setSelectedPresence(presence);
    setElderResponseFeedback(null);
    setIsPlaying(false);
  };

  const playVoiceReassurance = () => {
    if (!selectedPresence) return;
    const msg = selectedLanguage === 'as' && selectedPresence.spokenAssameseMessage
      ? selectedPresence.spokenAssameseMessage
      : selectedPresence.spokenMessage;

    speechService.speak(msg, selectedLanguage);
  };

  const handleSendElderResponse = (responseOption) => {
    speechService.stop();
    const affirmationText = selectedLanguage === 'as'
      ? 'আপোনাৰ মৰমৰ উত্তৰটো পৰিয়াললৈ প্ৰেৰণ কৰা হৈছে।'
      : 'Your warm message has been sent to your family member!';
    
    setElderResponseFeedback({
      message: responseOption.label,
      confirmed: true
    });

    speechService.speak(affirmationText, selectedLanguage);

    setTimeout(() => {
      setElderResponseFeedback(null);
    }, 4500);
  };

  const ELDER_RESPONSES = [
    {
      id: 'safe_travels',
      label: selectedLanguage === 'as' ? '‘দীপক, সাৱধানে আহিবা, মই চাহ বনাই ৰাখিম।’' : '‘Deepak, travel safely, I will have tea ready for you.’',
      icon: '🍵'
    },
    {
      id: 'sending_love',
      label: selectedLanguage === 'as' ? '‘মই তোমাক বহুত মৰম যাচিলোঁ আইটি।’' : '‘Sending you my deepest blessings and warm hugs.’',
      icon: '🌸'
    },
    {
      id: 'waiting_for_you',
      label: selectedLanguage === 'as' ? '‘তোমালোকক লগ পাবলৈ মই বাট চাই আছোঁ।’' : '‘I am waiting to see you this weekend.’',
      icon: '🏡'
    }
  ];

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '1.5rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Top Banner & Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        paddingBottom: '1.25rem',
        borderBottom: '2px solid #E2E8F0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #EC4899, #BE185D)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(190, 24, 93, 0.25)'
          }}>
            <Video size={36} />
          </div>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {selectedLanguage === 'as' ? 'পৰিয়ালৰ মৰমৰ সাক্ষাৎ কোঠা' : 'Family Virtual Presence Room'}
            </h1>
            <p style={{ fontSize: '18px', color: '#64748B', margin: '4px 0 0 0' }}>
              {selectedLanguage === 'as' 
                ? 'Relief & Dementia Assistance আৰ্হি • যেতিয়াই মন যায়, আপোনাৰ মৰমৰ সন্তান আৰু নাতি-নাতিনীৰ মুখখন চাওক।'
                : 'Relief & Dementia Assistance Pattern • Watch comforting video greetings and listen to heartfelt voices anytime.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            speechService.stop();
            onSessionComplete?.();
          }}
          style={{
            padding: '12px 24px',
            background: '#F1F5F9',
            border: '2px solid #CBD5E1',
            borderRadius: '16px',
            fontSize: '18px',
            fontWeight: 700,
            color: '#334155',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ArrowLeft size={22} /> {selectedLanguage === 'as' ? 'ঘৰলৈ উভতি যাওক' : 'Back to Home'}
        </button>
      </div>

      {/* Main Content Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '2rem'
      }}>
        {/* Left: Loved Ones Selection List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
            {selectedLanguage === 'as' ? 'আপোনাৰ পৰিয়াল' : 'Loved Ones Waiting For You'}
          </h3>

          {presences.map((p) => {
            const isSelected = selectedPresence?.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => handleSelectPresence(p)}
                style={{
                  padding: '1.25rem',
                  borderRadius: '20px',
                  background: isSelected ? '#FDF2F8' : '#FFFFFF',
                  border: isSelected ? '3px solid #BE185D' : '2px solid #E2E8F0',
                  boxShadow: isSelected ? '0 10px 25px rgba(190, 24, 93, 0.15)' : '0 2px 6px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <img
                  src={p.videoThumbnail}
                  alt={p.lovedOneName}
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '16px',
                    objectFit: 'cover',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {p.lovedOneName}
                    </h4>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      background: '#DCFCE7',
                      color: '#15803D',
                      padding: '4px 8px',
                      borderRadius: '999px'
                    }}>
                      {p.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '15px', color: '#BE185D', fontWeight: 700, margin: '3px 0 0' }}>
                    {p.relation}
                  </p>
                  <p style={{ fontSize: '14px', color: '#64748B', margin: '2px 0 0' }}>
                    📍 {p.currentLocation}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Quick Call Request Helper */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1.25rem',
            background: '#F8FAFC',
            borderRadius: '20px',
            border: '2px dashed #CBD5E1',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '15px', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.5 }}>
              {selectedLanguage === 'as' 
                ? 'আপুনি কি দীপক বা মাইনাক ফোনত কথা পাতিবলৈ বিচাৰে?'
                : 'Would you like Deepak or Maina to phone you right now?'}
            </p>
            <button
              onClick={() => {
                const reqText = selectedLanguage === 'as'
                  ? 'কেয়াৰগিভাৰ দীপকলৈ ফোন কৰাৰ অনুৰোধ প্ৰেৰণ কৰা হৈছে।'
                  : 'A direct call request has been sent to Deepak!';
                speechService.speak(reqText, selectedLanguage);
                alert(reqText);
              }}
              style={{
                width: '100%',
                padding: '12px',
                background: '#0284C7',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
              }}
            >
              <PhoneCall size={20} />
              {selectedLanguage === 'as' ? 'দীপকলৈ ফোন ৰিকুৱেষ্ট পঠাওক' : 'Request Family Call'}
            </button>
          </div>
        </div>

        {/* Right: Immersive Presence Display */}
        {selectedPresence ? (
          <div style={{
            background: '#FFFFFF',
            borderRadius: '28px',
            border: '2px solid #E2E8F0',
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Video Player or High-Def Portrait */}
            <div style={{ position: 'relative', width: '100%', height: '380px', background: '#0F172A' }}>
              <video
                ref={videoRef}
                src={selectedPresence.videoUrl}
                poster={selectedPresence.videoThumbnail}
                controls
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '8px 16px',
                borderRadius: '999px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Sparkles size={16} color="#F472B6" />
                {selectedPresence.lovedOneName} • {selectedPresence.relation}
              </div>
            </div>

            {/* Subtitles & Spoken Message */}
            <div style={{ padding: '2rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '1.25rem'
              }}>
                <div>
                  <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {selectedPresence.reassuranceTitle}
                  </h2>
                  <p style={{ fontSize: '16px', color: '#64748B', margin: '4px 0 0 0' }}>
                    Recorded today with love from {selectedPresence.currentLocation}
                  </p>
                </div>

                <button
                  onClick={playVoiceReassurance}
                  style={{
                    padding: '12px 20px',
                    background: '#FDF2F8',
                    border: '2px solid #F472B6',
                    borderRadius: '16px',
                    color: '#BE185D',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(190, 24, 93, 0.1)'
                  }}
                >
                  <Volume2 size={22} />
                  {selectedLanguage === 'as' ? 'বাৰ্তা শুনক' : 'Hear Voice Message'}
                </button>
              </div>

              {/* Message Quote Box */}
              <div style={{
                background: '#F8FAFC',
                borderLeft: '5px solid #BE185D',
                borderRadius: '16px',
                padding: '1.5rem',
                fontSize: '20px',
                lineHeight: 1.6,
                color: '#1E293B',
                fontStyle: 'italic',
                marginBottom: '1.75rem'
              }}>
                “{selectedLanguage === 'as' && selectedPresence.spokenAssameseMessage
                  ? selectedPresence.spokenAssameseMessage
                  : selectedPresence.spokenMessage}”
              </div>

              {/* Elder Interactive Responses */}
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#334155', marginBottom: '1rem' }}>
                  {selectedLanguage === 'as' ? 'মৰমেৰে উত্তৰ দিয়ক (Tap to respond):' : 'Tap to send a warm reply back:'}
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                  {ELDER_RESPONSES.map((resp) => (
                    <button
                      key={resp.id}
                      onClick={() => handleSendElderResponse(resp)}
                      style={{
                        padding: '14px 20px',
                        background: '#FFFFFF',
                        border: '2px solid #E2E8F0',
                        borderRadius: '16px',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#1E293B',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#BE185D';
                        e.currentTarget.style.background = '#FDF2F8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.background = '#FFFFFF';
                      }}
                    >
                      <span style={{ fontSize: '24px' }}>{resp.icon}</span>
                      <span style={{ flex: 1 }}>{resp.label}</span>
                      <Heart size={20} color="#BE185D" />
                    </button>
                  ))}
                </div>

                {/* Feedback Toast */}
                {elderResponseFeedback && (
                  <div style={{
                    marginTop: '1.25rem',
                    padding: '1rem 1.5rem',
                    background: '#ECFDF5',
                    border: '2px solid #10B981',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#065F46',
                    fontSize: '18px',
                    fontWeight: 700
                  }}>
                    <CheckCircle2 size={24} color="#10B981" />
                    {selectedLanguage === 'as'
                      ? 'মৰমৰ বাৰ্তা প্ৰেৰণ কৰা হ’ল! দীপকে সোনকালেই উত্তৰ দিব।'
                      : 'Your blessing has been sent to family!'}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#64748B',
            background: '#F8FAFC',
            borderRadius: '24px'
          }}>
            Loading family video greetings...
          </div>
        )}
      </div>
    </div>
  );
}
