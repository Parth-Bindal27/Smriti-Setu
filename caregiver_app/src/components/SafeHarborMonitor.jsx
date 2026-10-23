import React, { useState, useEffect } from 'react';
import { Compass, ShieldCheck, AlertTriangle, MapPin, Radio, Bell, CheckCircle2, RefreshCw } from 'lucide-react';

export default function SafeHarborMonitor({ apiUrl }) {
  const [harborStatus, setHarborStatus] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState('');

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/safe-harbor/status`);
      if (res.ok) {
        setHarborStatus(await res.json());
      }
    } catch (err) {
      console.warn('Failed to load safe harbor status:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  const handleSimulate = async (eventType) => {
    setIsSimulating(true);
    try {
      const res = await fetch(`${apiUrl}/api/safe-harbor/simulate-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType })
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationResult(`Simulation Event Fired: ${data.newStatus} (Risk: ${data.riskScore}%)`);
        fetchStatus();
      }
    } catch (err) {
      console.warn('Simulation failed:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const status = harborStatus || {
    currentLocation: 'Inside Safe Haven (Living Room & Veranda)',
    activeZone: 'Beltola Family Residence',
    wanderingRiskScore: 14,
    circadianRiskLevel: 'Low (Green)',
    safeZones: [],
    beaconTelemetry: { signalStrengthDbm: -62, batteryPercent: 94, lastVerifiedAt: new Date().toISOString() },
    caregiverGuidelines: 'All entry/veranda perimeters secured. Elder is relaxed inside the living room.'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
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
            background: 'linear-gradient(135deg, #10B981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '26px',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
          }}>
            🏡
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Safe Harbor Geofencing & Wandering Sentinel
              </h1>
              <span className="badge-pill badge-green">
                RecallAI & Wandering Prevention Inspired
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
              Passive room and garden perimeter monitoring ensuring elder freedom with discreet caregiver protection.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: '#ECFDF5',
            color: '#047857',
            border: '1.5px solid #A7F3D0',
            padding: '8px 16px',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Radio size={16} /> Beacon Active (94% Battery)
          </span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '18px'
      }}>
        {/* Status */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '2px solid #E2E8F0', padding: '1.25rem' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748B' }}>Current Safe Zone</span>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: '6px 0 2px 0' }}>
            {status.currentLocation}
          </div>
          <span style={{ fontSize: '12px', color: '#059669', fontWeight: '700' }}>
            ● Beltola Residence Haven
          </span>
        </div>

        {/* Wandering Risk Score */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '2px solid #E2E8F0', padding: '1.25rem' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748B' }}>Wandering Risk Index</span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: status.wanderingRiskScore > 50 ? '#DC2626' : '#059669', margin: '4px 0' }}>
            {status.wanderingRiskScore}%
          </div>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Circadian Level: <strong>{status.circadianRiskLevel}</strong>
          </span>
        </div>

        {/* Perimeter Telemetry */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '2px solid #E2E8F0', padding: '1.25rem' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748B' }}>BLE Signal Strength</span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0284C7', margin: '4px 0' }}>
            {status.beaconTelemetry?.signalStrengthDbm || -62} dBm
          </div>
          <span style={{ fontSize: '12px', color: '#059669', fontWeight: '700' }}>
            ● Strong & Constant Coverage
          </span>
        </div>
      </div>

      {/* Main Grid: Zones Map & Simulation Control */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Safe Zones List */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '2px solid var(--border-color)',
          padding: '1.75rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', margin: '0 0 14px 0' }}>
            Configured Safe Harbor Boundaries
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(status.safeZones || []).map(zone => (
              <div
                key={zone.zoneId}
                style={{
                  background: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <MapPin size={16} color="#059669" />
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1E293B', margin: 0 }}>
                      {zone.zoneName}
                    </h4>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      background: zone.zoneType === 'Primary_Safe' ? '#D1FAE5' : '#FEF3C7',
                      color: zone.zoneType === 'Primary_Safe' ? '#065F46' : '#92400E',
                      padding: '2px 8px',
                      borderRadius: '100px'
                    }}>
                      {zone.zoneType}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                    {zone.locationDescription} • Radius: {zone.coordinates?.radiusMeters}m
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#059669' }}>Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Simulation Testing Tool */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '2px solid var(--border-color)',
          padding: '1.75rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', margin: '0 0 8px 0' }}>
            Caregiver Verification & Simulation
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px 0' }}>
            Simulate elder movements between safe zones to test real-time alerts.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => handleSimulate('VERANDA_WALK')}
              disabled={isSimulating}
              style={{
                background: '#ECFDF5',
                color: '#065F46',
                border: '1.5px solid #A7F3D0',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              🌿 Simulate Gentle Garden Stroll (Safe Haven)
            </button>

            <button
              onClick={() => handleSimulate('PERIMETER_PROXIMITY')}
              disabled={isSimulating}
              style={{
                background: '#FEF2F2',
                color: '#991B1B',
                border: '1.5px solid #FECACA',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              ⚠️ Simulate Front Gate Proximity (Trigger Gentle Alert)
            </button>
          </div>

          {simulationResult && (
            <div style={{
              marginTop: '14px',
              padding: '10px 14px',
              background: '#F1F5F9',
              borderRadius: '10px',
              fontSize: '13px',
              color: '#334155',
              fontWeight: '600'
            }}>
              {simulationResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
