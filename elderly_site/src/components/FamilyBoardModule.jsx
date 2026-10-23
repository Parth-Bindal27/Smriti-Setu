import React, { useState, useEffect } from 'react';
import { Volume2, Heart, MapPin, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import { speechService } from '../services/speechService';
import { getSocket } from '../socket';

export default function FamilyBoardModule({ onSessionComplete, apiUrl, selectedLanguage = 'as', t }) {
  const [posts, setPosts] = useState([]);
  const [activeVoicePostId, setActiveVoicePostId] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/family-board?role=elder`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.warn('Failed to fetch family board posts:', err);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Listen for live updates via Socket.IO
    const socket = getSocket();
    const handleUpdate = () => {
      fetchPosts();
    };

    socket.on('familyboard:approved-update', handleUpdate);

    return () => {
      socket.off('familyboard:approved-update', handleUpdate);
      speechService.stop();
    };
  }, [apiUrl]);

  const handlePlayMessage = (post) => {
    speechService.stop();
    setActiveVoicePostId(post._id);
    const textToRead = `${post.authorName} writes: ${post.message}`;
    speechService.speak(textToRead, selectedLanguage, () => {
      setActiveVoicePostId(null);
    });
  };

  const handleFinish = () => {
    speechService.stop();
    if (onSessionComplete) {
      onSessionComplete({
        module: 'family_board',
        completedAt: new Date()
      });
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        background: '#FFFFFF',
        padding: '1.25rem 2rem',
        borderRadius: '24px',
        border: '3px solid #FECDD3',
        boxShadow: '0 4px 20px rgba(244, 63, 94, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #F43F5E, #E11D48)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: '0 4px 14px rgba(244, 63, 94, 0.3)'
          }}>
            💌
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1F2937', margin: 0 }}>
                WellRemember Family Board (মৰমৰ চিঠি)
              </h1>
              <span style={{
                background: '#FFE4E6',
                color: '#BE123C',
                fontSize: '12px',
                fontWeight: '700',
                padding: '4px 10px',
                borderRadius: '100px',
                border: '1px solid #FECDD3'
              }}>
                WellRememberBoard Inspired
              </span>
            </div>
            <p style={{ fontSize: '15px', color: '#6B7280', margin: '3px 0 0 0' }}>
              Heartfelt photos, voice greetings, and updates sent with love by your family across India.
            </p>
          </div>
        </div>

        <button
          onClick={handleFinish}
          style={{
            background: '#F3F4F6',
            color: '#374151',
            border: '2px solid #E5E7EB',
            borderRadius: '14px',
            padding: '10px 18px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ArrowLeft size={18} />
          {t?.backToMenu || 'Back to Menu'}
        </button>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {posts.map((post) => (
          <div
            key={post._id}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '3px solid #FFE4E6',
              overflow: 'hidden',
              boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              position: 'relative'
            }}
          >
            {/* Photo Header */}
            <div style={{ position: 'relative', height: '220px' }}>
              <img
                src={post.photoUrl}
                alt={post.authorName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(4px)',
                padding: '6px 14px',
                borderRadius: '100px',
                fontSize: '13px',
                fontWeight: '800',
                color: '#BE123C',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Heart size={14} fill="#E11D48" color="#E11D48" />
                <span>{post.relation}</span>
              </div>

              {post.location && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(4px)',
                  padding: '6px 12px',
                  borderRadius: '100px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <MapPin size={12} />
                  <span>{post.location}</span>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1F2937', margin: '0 0 8px 0' }}>
                  {post.authorName}
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#374151',
                  lineHeight: '1.6',
                  margin: '0 0 16px 0',
                  fontStyle: 'italic'
                }}>
                  "{post.message}"
                </p>
              </div>

              {/* Big Voice Button */}
              <button
                onClick={() => handlePlayMessage(post)}
                style={{
                  background: activeVoicePostId === post._id ? '#BE123C' : '#FFF1F2',
                  color: activeVoicePostId === post._id ? '#FFFFFF' : '#E11D48',
                  border: '2px solid #FECDD3',
                  borderRadius: '16px',
                  padding: '12px 20px',
                  fontSize: '16px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 2px 10px rgba(225, 29, 72, 0.15)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Volume2 size={22} />
                <span>{activeVoicePostId === post._id ? 'Speaking Message...' : 'Listen to Message Aloud'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
