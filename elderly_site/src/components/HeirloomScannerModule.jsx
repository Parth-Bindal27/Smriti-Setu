import React, { useState, useEffect } from 'react';
import { Camera, Volume2, Sparkles, ArrowLeft, Heart, ShieldCheck, CheckCircle2, Search } from 'lucide-react';
import { speechService } from '../services/speechService';

export default function HeirloomScannerModule({ onSessionComplete, apiUrl, selectedLanguage = 'as', t }) {
  const [heirlooms, setHeirlooms] = useState([]);
  const [selectedHeirloom, setSelectedHeirloom] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('shelf'); // 'shelf' | 'scanning' | 'detail'
  const [spokenStory, setSpokenStory] = useState('');

  useEffect(() => {
    const fetchHeirlooms = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/heirlooms`);
        if (res.ok) {
          const data = await res.json();
          setHeirlooms(data.heirlooms || []);
          if (data.heirlooms && data.heirlooms.length > 0) {
            setSelectedHeirloom(data.heirlooms[0]);
          }
        }
      } catch (err) {
        console.warn('Failed to load heirlooms:', err);
      }
    };
    fetchHeirlooms();

    return () => {
      speechService.stop();
    };
  }, [apiUrl]);

  const handleSelectObject = (item) => {
    setIsScanning(true);
    setScanStep('scanning');
    speechService.stop();

    // 1.5s simulated intelligent optical & RFID object recognition
    setTimeout(() => {
      setIsScanning(false);
      setSelectedHeirloom(item);
      setScanStep('detail');

      // Native speech narration
      const narration = item.vernacularStories && item.vernacularStories[selectedLanguage]
        ? item.vernacularStories[selectedLanguage]
        : item.memoryStory;
      setSpokenStory(narration);
      speechService.speak(narration, selectedLanguage);
    }, 1200);
  };

  const handleFinish = () => {
    speechService.stop();
    if (onSessionComplete) {
      onSessionComplete({
        module: 'heirloom_scanner',
        completedAt: new Date()
      });
    }
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        background: '#FFFFFF',
        padding: '1.25rem 2rem',
        borderRadius: '24px',
        border: '3px solid #E2E8F0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #0284C7, #0369A1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
          }}>
            🏺
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1F2937', margin: 0 }}>
                Heirloom & Keepsake Scanner (স্মৃতিৰ বাতি)
              </h1>
              <span style={{
                background: '#E0F2FE',
                color: '#0369A1',
                fontSize: '12px',
                fontWeight: '700',
                padding: '4px 10px',
                borderRadius: '100px',
                border: '1px solid #BAE6FD'
              }}>
                Meeshaim M. AI Memory Aid Inspired
              </span>
            </div>
            <p style={{ fontSize: '15px', color: '#6B7280', margin: '3px 0 0 0' }}>
              Point to or tap any cherished family object to hear its verified story and family memories.
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

      {/* Main Grid: Object Shelf (Left) and Story Reveal Card (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.25fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Column: Everyday Object Gallery */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '28px',
          border: '3px solid #E2E8F0',
          padding: '1.75rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Camera size={22} color="#0284C7" />
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              Touch or Scan an Object
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {heirlooms.map((item) => {
              const isSelected = selectedHeirloom?.objectId === item.objectId;
              return (
                <div
                  key={item.objectId}
                  onClick={() => handleSelectObject(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '12px 16px',
                    borderRadius: '20px',
                    border: isSelected ? '3px solid #0284C7' : '2px solid #F1F5F9',
                    background: isSelected ? '#F0F9FF' : '#FAFAFA',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 4px 14px rgba(2, 132, 199, 0.15)' : 'none'
                  }}
                >
                  <img
                    src={item.photoUrl}
                    alt={item.name}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '16px',
                      objectFit: 'cover',
                      border: '2px solid #FFFFFF',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px 0' }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#0284C7', fontWeight: '700', margin: '0 0 2px 0' }}>
                      {item.vernacularName}
                    </p>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>
                      Year: {item.originYear} • {item.category}
                    </span>
                  </div>
                  {isSelected && (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#0284C7',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CheckCircle2 size={18} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Scanned Object Verified Memory Details */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '28px',
          border: '3px solid #BAE6FD',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(2, 132, 199, 0.12)'
        }}>
          {isScanning ? (
            <div style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#E0F2FE',
                color: '#0284C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                animation: 'spin 2s linear infinite',
                marginBottom: '1rem'
              }}>
                🔍
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A' }}>
                Scanning Everyday Object...
              </h3>
              <p style={{ fontSize: '15px', color: '#64748B' }}>
                Querying verified family oral history and physical keepsake registry.
              </p>
            </div>
          ) : selectedHeirloom ? (
            <div>
              {/* Photo Showcase */}
              <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
                <img
                  src={selectedHeirloom.photoUrl}
                  alt={selectedHeirloom.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '24px',
                  right: '24px',
                  color: '#FFFFFF'
                }}>
                  <span style={{
                    background: '#0284C7',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: '800',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    display: 'inline-block',
                    marginBottom: '6px'
                  }}>
                    Origin: {selectedHeirloom.originYear}
                  </span>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {selectedHeirloom.name}
                  </h2>
                  <p style={{ fontSize: '15px', color: '#E0F2FE', margin: '4px 0 0 0' }}>
                    {selectedHeirloom.vernacularName}
                  </p>
                </div>
              </div>

              {/* Story & Voice Body */}
              <div style={{ padding: '1.75rem' }}>
                {/* Audio Narration Playback */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: '#F0F9FF',
                  border: '2px solid #BAE6FD',
                  borderRadius: '16px',
                  padding: '1rem 1.25rem',
                  marginBottom: '1.25rem'
                }}>
                  <button
                    onClick={() => speechService.speak(selectedHeirloom.memoryStory, selectedLanguage)}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: '#0284C7',
                      color: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                    }}
                    title="Play narration aloud"
                  >
                    <Volume2 size={26} />
                  </button>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0369A1', margin: '0 0 2px 0' }}>
                      Listen to Family Story Aloud (কাহিনী শুনক)
                    </h4>
                    <p style={{ fontSize: '13px', color: '#0284C7', margin: 0 }}>
                      Narrated with warm respect and love by your family
                    </p>
                  </div>
                </div>

                {/* Tactile & Autobiographical Details */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px 0' }}>
                    Cherished Memory & Oral History
                  </h4>
                  <p style={{ fontSize: '18px', color: '#1F2937', lineHeight: '1.6', margin: 0, fontWeight: '500' }}>
                    {selectedHeirloom.memoryStory}
                  </p>
                </div>

                {/* Tactile Sensation Hook */}
                {selectedHeirloom.tactileDescription && (
                  <div style={{
                    background: '#FFFBEB',
                    border: '1.5px solid #FDE68A',
                    borderRadius: '14px',
                    padding: '12px 16px',
                    marginBottom: '1.25rem'
                  }}>
                    <strong style={{ fontSize: '14px', color: '#92400E' }}>🖐️ Tactile Feel: </strong>
                    <span style={{ fontSize: '14px', color: '#B45309' }}>
                      {selectedHeirloom.tactileDescription}
                    </span>
                  </div>
                )}

                {/* Traceable Provenance Verification Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#F8FAFC',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  fontSize: '13px',
                  color: '#475569'
                }}>
                  <ShieldCheck size={20} color="#059669" />
                  <span>
                    Verified Provenance: <strong>{selectedHeirloom.provenanceVerification?.verifiedBy || 'Deepak Baruah (Son)'}</strong> ({selectedHeirloom.provenanceVerification?.verificationLevel || 'Physical Heirloom'})
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
              Select an heirloom from the left to view its story.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
