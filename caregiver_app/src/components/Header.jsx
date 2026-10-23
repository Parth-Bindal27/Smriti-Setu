import React, { useState, useEffect, useRef } from 'react';
import { QrCode, RefreshCw, Sparkles, Shield, FileText, ChevronDown, Check } from 'lucide-react';

export default function Header({
  profile,
  onOpenMobileConnect,
  onRefresh,
  activeTab,
  onTabChange,
  onOpenDoctorReport
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const navGroups = [
    {
      type: 'direct',
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊'
    },
    {
      type: 'dropdown',
      id: 'group_ai',
      label: 'AI & Clinical Intelligence',
      icon: '🤖',
      items: [
        { id: 'copilot', label: 'AI Caregiver Co-Pilot & Council', desc: 'De-escalation scripts & SBAR handoffs', icon: '🤝' },
        { id: 'graph', label: 'Verified Memory Graph', desc: 'Traceable kinship & anti-hallucination', icon: '🕸️' },
        { id: 'ai_lab', label: 'AI Cultural Lab', desc: 'Native NER dialect prompt playground', icon: '🧪' }
      ]
    },
    {
      type: 'dropdown',
      id: 'group_sentinels',
      label: 'Sentinels & Health',
      icon: '🛡️',
      items: [
        { id: 'sentinel', label: 'Stroke & Hemorrhage Sentinel', desc: 'BE-FAST tremor & ptosis detection', icon: '🚨' },
        { id: 'voice_biomarkers', label: 'Acoustic & Speech Sentinel', desc: 'Speech latency & sundowning fatigue', icon: '🎙️' },
        { id: 'assessment', label: 'Daily Cognitive Assessment', desc: 'Pre-UI gate telemetry & memory trends', icon: '🛡️' },
        { id: 'safe_harbor', label: 'Safe Harbor & Geofencing', desc: 'Room & garden boundary perimeter', icon: '🏡' }
      ]
    },
    {
      type: 'dropdown',
      id: 'group_memory',
      label: 'Memories & Family',
      icon: '📸',
      items: [
        { id: 'memory_album', label: 'Memory Album & VR Studio', desc: 'Curate photos & live 3D VR sessions', icon: '🖼️' },
        { id: 'family', label: 'Family & Memory Clues', desc: 'Loved ones, relationships & clues', icon: '👨‍👩‍👦' },
        { id: 'family_board', label: 'WellRemember Family Board', desc: 'Moderate live postcard greetings', icon: '💌' }
      ]
    },
    {
      type: 'dropdown',
      id: 'group_routines',
      label: 'Daily Care & Routines',
      icon: '⏰',
      items: [
        { id: 'routines', label: 'Routine Builder', desc: 'Step-by-step tea & stroll routines', icon: '📋' },
        { id: 'reminders', label: 'Reminders & Alerts', desc: 'Medication & prayer chimes', icon: '🔔' }
      ]
    },
    {
      type: 'direct',
      id: 'profile',
      label: 'Elder Profile',
      icon: '👤'
    }
  ];

  return (
    <header style={{
      background: '#FFFFFF',
      borderBottom: '2px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 2px 12px rgba(15, 23, 42, 0.06)'
    }}>
      {/* Top Bar */}
      <div style={{
        maxWidth: '1350px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        {/* Brand & Elder Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #D97706, #B45309)',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)'
          }}>
            <span style={{ fontSize: '22px' }}>🌿</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '20px', letterSpacing: '-0.02em', color: 'var(--text-main)', margin: 0 }}>
                Smriti Setu <span style={{ color: 'var(--accent-amber)', fontSize: '15px', fontWeight: '500' }}>স্মৃতি সেতু</span>
              </h1>
              <span className="badge-pill badge-indigo">Caregiver Executive Suite</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Monitoring: <strong style={{ color: 'var(--text-main)' }}>{profile?.name || 'Elder Profile'}</strong> ({profile?.honorific || 'Elder'}) • {profile?.hometown || profile?.region || 'India'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Doctor Report Button */}
          <button
            onClick={onOpenDoctorReport}
            style={{
              background: '#0F172A',
              color: '#FFFFFF',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '7px 14px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 0.15s'
            }}
            title="Generate 1-page printable Geriatrician consultation report"
          >
            <FileText size={15} color="#38BDF8" />
            <span>Doctor Report</span>
          </button>

          {/* Mobile LAN QR Access button */}
          <button
            className="btn-indigo"
            onClick={onOpenMobileConnect}
            style={{ padding: '7px 12px', fontSize: '13px' }}
            title="Scan QR Code to open on Mobile Wi-Fi"
          >
            <QrCode size={15} />
            <span>Mobile QR</span>
          </button>

          <button
            className="btn-secondary"
            onClick={onRefresh}
            style={{ padding: '7px 10px' }}
            title="Refresh records"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Single-View Navigation Bar (Non-Scrolling with Smart Dropdowns) */}
      <nav
        ref={dropdownRef}
        style={{
          maxWidth: '1350px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          overflow: 'visible',
          borderTop: '1px solid #F1F5F9'
        }}
      >
        {navGroups.map((group) => {
          if (group.type === 'direct') {
            const isActive = activeTab === group.id;
            return (
              <button
                key={group.id}
                onClick={() => {
                  setOpenDropdown(null);
                  onTabChange(group.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? `3px solid var(--accent-amber)` : '3px solid transparent',
                  padding: '12px 14px',
                  color: isActive ? 'var(--accent-amber-hover)' : 'var(--text-muted)',
                  fontWeight: isActive ? '800' : '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s'
                }}
              >
                <span>{group.icon}</span>
                <span>{group.label}</span>
              </button>
            );
          }

          // Dropdown group
          const isChildActive = group.items.some(i => i.id === activeTab);
          const activeChild = group.items.find(i => i.id === activeTab);
          const isOpen = openDropdown === group.id;

          return (
            <div key={group.id} style={{ position: 'relative' }}>
              <button
                onClick={() => setOpenDropdown(isOpen ? null : group.id)}
                style={{
                  background: isOpen ? '#FEF3C7' : (isChildActive ? '#FFFBEB' : 'none'),
                  border: 'none',
                  borderBottom: isChildActive ? `3px solid var(--accent-amber)` : '3px solid transparent',
                  borderRadius: '8px 8px 0 0',
                  padding: '12px 14px',
                  color: isChildActive ? 'var(--accent-amber-hover)' : 'var(--text-muted)',
                  fontWeight: isChildActive ? '800' : '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s'
                }}
              >
                <span>{group.icon}</span>
                <span>
                  {group.label}
                  {activeChild && (
                    <span style={{
                      marginLeft: '6px',
                      fontSize: '11px',
                      background: '#D97706',
                      color: '#FFFFFF',
                      padding: '2px 8px',
                      borderRadius: '100px',
                      fontWeight: '700'
                    }}>
                      {activeChild.label.split(' ')[0]}
                    </span>
                  )}
                </span>
                <ChevronDown
                  size={14}
                  style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    color: isChildActive ? 'var(--accent-amber-hover)' : '#94A3B8'
                  }}
                />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  background: '#FFFFFF',
                  borderRadius: '18px',
                  border: '2px solid #E2E8F0',
                  boxShadow: '0 12px 36px rgba(15, 23, 42, 0.14)',
                  padding: '8px',
                  minWidth: '310px',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  animation: 'fadeIn 0.15s ease-out'
                }}>
                  <div style={{ padding: '6px 12px', borderBottom: '1px solid #F1F5F9', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {group.label} Suite
                    </span>
                  </div>

                  {group.items.map((subItem) => {
                    const isSubActive = activeTab === subItem.id;
                    return (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          onTabChange(subItem.id);
                          setOpenDropdown(null);
                        }}
                        style={{
                          background: isSubActive ? '#FEF3C7' : '#FFFFFF',
                          border: isSubActive ? '1px solid #FDE68A' : '1px solid transparent',
                          borderRadius: '12px',
                          padding: '10px 14px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSubActive) e.currentTarget.style.background = '#F8FAFC';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSubActive) e.currentTarget.style.background = '#FFFFFF';
                        }}
                      >
                        <span style={{ fontSize: '20px', lineHeight: '1' }}>{subItem.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '13px',
                            fontWeight: '800',
                            color: isSubActive ? '#92400E' : '#1E293B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}>
                            <span>{subItem.label}</span>
                            {isSubActive && <Check size={14} color="#D97706" />}
                          </div>
                          <p style={{
                            fontSize: '11px',
                            color: isSubActive ? '#B45309' : '#64748B',
                            margin: '2px 0 0 0',
                            lineHeight: '1.3'
                          }}>
                            {subItem.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </header>
  );
}
