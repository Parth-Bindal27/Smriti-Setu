import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, XCircle, ShieldCheck, Plus, Sparkles, Volume2, RefreshCw } from 'lucide-react';

export default function FamilyBoardModerator({ apiUrl }) {
  const [posts, setPosts] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [relation, setRelation] = useState('Granddaughter');
  const [location, setLocation] = useState('Bangalore');
  const [message, setMessage] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600');

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/family-board?role=caregiver`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.warn('Failed to load family board:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [apiUrl]);

  const handleModerate = async (postId, status) => {
    try {
      const res = await fetch(`${apiUrl}/api/family-board/${postId}/moderate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.warn('Moderation update failed:', err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/family-board/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName, relation, location, message, photoUrl })
      });
      if (res.ok) {
        setIsAddingNew(false);
        setMessage('');
        fetchPosts();
      }
    } catch (err) {
      console.warn('Post creation failed:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        border: '2px solid var(--border-color)',
        padding: '1.75rem 2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #F43F5E, #BE123C)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '26px',
            boxShadow: '0 4px 14px rgba(244, 63, 94, 0.3)'
          }}>
            💌
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                WellRemember Family Board Moderator
              </h1>
              <span className="badge-pill badge-pink">
                WellRememberBoard Inspired
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
              AI dignity filter and caregiver gatekeeping for incoming photos, postcards, and greetings before elder display.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          style={{
            background: '#BE123C',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 10px rgba(190, 18, 60, 0.25)'
          }}
        >
          <Plus size={16} />
          {isAddingNew ? 'Close Card Form' : 'Post Card for Family Member'}
        </button>
      </div>

      {/* New Card Modal / Form */}
      {isAddingNew && (
        <div style={{
          background: '#FFF1F2',
          border: '2px solid #FECDD3',
          borderRadius: '24px',
          padding: '1.75rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#9F1239', margin: '0 0 12px 0' }}>
            Compose New Family Greeting Card
          </h3>

          <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#881337', display: 'block', marginBottom: '4px' }}>Author Name</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={e => setAuthorName(e.target.value)}
                  placeholder="e.g. Maina (Rhea)"
                  required
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #FDA4AF', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#881337', display: 'block', marginBottom: '4px' }}>Kinship Relation</label>
                <input
                  type="text"
                  value={relation}
                  onChange={e => setRelation(e.target.value)}
                  placeholder="e.g. Granddaughter"
                  required
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #FDA4AF', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#881337', display: 'block', marginBottom: '4px' }}>City / Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Bangalore"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #FDA4AF', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#881337', display: 'block', marginBottom: '4px' }}>Photo Image URL</label>
              <input
                type="text"
                value={photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
                placeholder="https://..."
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #FDA4AF', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#881337', display: 'block', marginBottom: '4px' }}>Heartfelt Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Warm and comforting words for Koka..."
                rows={3}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #FDA4AF', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                style={{ background: '#FFFFFF', border: '1px solid #FDA4AF', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ background: '#BE123C', color: '#FFFFFF', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}
              >
                Submit for Moderation & Publishing
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Moderation Cards List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {posts.map(post => (
          <div
            key={post._id}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: post.moderationStatus === 'Approved' ? '2px solid #A7F3D0' : '2px solid #FDE68A',
              padding: '1.25rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{
                  background: post.moderationStatus === 'Approved' ? '#D1FAE5' : '#FEF3C7',
                  color: post.moderationStatus === 'Approved' ? '#065F46' : '#92400E',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '3px 10px',
                  borderRadius: '100px'
                }}>
                  {post.moderationStatus === 'Approved' ? '✅ Live on Elder Board' : '⏳ Pending Review'}
                </span>

                <span style={{ fontSize: '11px', color: '#64748B' }}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <img
                  src={post.photoUrl}
                  alt={post.authorName}
                  style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#1F2937', margin: 0 }}>
                    {post.authorName}
                  </h4>
                  <span style={{ fontSize: '13px', color: '#BE123C', fontWeight: '700' }}>
                    {post.relation} • {post.location}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5', margin: '0 0 12px 0', fontStyle: 'italic' }}>
                "{post.message}"
              </p>
            </div>

            {/* Moderation Controls */}
            <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
              {post.moderationStatus !== 'Approved' && (
                <button
                  onClick={() => handleModerate(post._id, 'Approved')}
                  style={{
                    flex: 1,
                    background: '#059669',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <CheckCircle2 size={14} /> Approve for Display
                </button>
              )}

              {post.moderationStatus === 'Approved' && (
                <button
                  onClick={() => handleModerate(post._id, 'Archived')}
                  style={{
                    flex: 1,
                    background: '#F1F5F9',
                    color: '#64748B',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Unpublish / Archive
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
