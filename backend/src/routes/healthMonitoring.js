const express = require('express');
const router = express.Router();
const HealthAnomaly = require('../models/HealthAnomaly');
const ElderlyProfile = require('../models/ElderlyProfile');
const { emitToCaregiver, emitToAll } = require('../socket');
const { broadcast } = require('../websocket');

// Default baseline profile stats for emergency triage
const DEFAULT_EMERGENCY_PROFILE = {
  bloodGroup: 'O Positive (O+)',
  chronicConditions: ['Hypertension (Mild)', 'Age-Related Memory Decline'],
  currentMedications: ['Amlodipine 5mg (Morning)', 'Ecosprin 75mg (Post Lunch)', 'Multivitamins'],
  allergies: ['Penicillin (Mild Rash)'],
  emergencyHospital: 'GNRC Hospitals, Dispur / Guwahati Medical College (GMCH)',
  emergencyContact: {
    name: 'Deepak Baruah (Son)',
    relation: 'Son & Primary Caregiver',
    phone: '+91 98640 12345'
  }
};

// GET /api/health-monitoring/status — Aggregated neurological sentinel status
router.get('/status', async (req, res) => {
  try {
    const profile = await ElderlyProfile.findOne();
    const anomalies = await HealthAnomaly.find().sort({ timestamp: -1 }).limit(20);

    const activeAlerts = anomalies.filter(a => a.status === 'active' || a.status === 'monitoring');
    const criticalAlerts = activeAlerts.filter(a => a.escalationTier === 3);
    const persistentAlerts = activeAlerts.filter(a => a.escalationTier === 2 || a.isPersistent);

    let overallRiskLevel = 'OPTIMAL_GREEN';
    let riskDescription = 'Neurological & motor biomarkers are within normal calm baseline.';

    if (criticalAlerts.length > 0) {
      overallRiskLevel = 'CRITICAL_RED';
      riskDescription = 'ACUTE RED FLAG: BE-FAST markers detected. Immediate medical intervention advised.';
    } else if (persistentAlerts.length > 0) {
      overallRiskLevel = 'PERSISTENT_YELLOW';
      riskDescription = 'PERSISTENT WARNING: Subtle abnormality persisting > 48 hours. Physician triage recommended.';
    } else if (activeAlerts.length > 0) {
      overallRiskLevel = 'MONITOR_BLUE';
      riskDescription = 'Mild variance recorded during morning session. Monitoring under soft watch.';
    }

    res.json({
      overallRiskLevel,
      riskDescription,
      activeAlertsCount: activeAlerts.length,
      criticalAlertsCount: criticalAlerts.length,
      persistentAlertsCount: persistentAlerts.length,
      activeAlerts,
      recentHistory: anomalies,
      emergencyProfile: {
        ...DEFAULT_EMERGENCY_PROFILE,
        name: profile?.name || 'Bhaben Baruah',
        age: profile?.age || 76,
        residence: profile?.currentResidence || 'Beltola, Guwahati'
      }
    });
  } catch (err) {
    console.error('[Health Monitoring Status Error]', err);
    res.status(500).json({ error: 'Failed to retrieve health monitoring status' });
  }
});

// POST /api/health-monitoring/report-anomaly — Ingest real-time symptom / biomarker telemetry
router.post('/report-anomaly', async (req, res) => {
  try {
    const {
      type,
      severity = 'mild',
      title,
      description,
      persistenceHours = 0,
      beFastMarkers = {},
      metrics = {},
      source = 'elderly_device'
    } = req.body;

    // Automated Triage & Escalation Rule Engine:
    // 1. Acute Stroke / Intracranial Hemorrhage (BE-FAST Red Flag)
    const hasAcuteBeFast = beFastMarkers.speech || beFastMarkers.arms || beFastMarkers.face || beFastMarkers.eyes;
    const hasSevereSlur = (metrics.speechHesitationScore || 0) >= 60;
    const hasSevereAsymmetry = (metrics.tapSymmetryRatio !== undefined && metrics.tapSymmetryRatio < 0.55);

    let escalationTier = 1;
    let computedSeverity = severity;

    if (hasAcuteBeFast || hasSevereSlur || hasSevereAsymmetry || severity === 'critical') {
      escalationTier = 3;
      computedSeverity = 'critical';
    } else if (persistenceHours >= 48 || severity === 'moderate') {
      escalationTier = 2;
      computedSeverity = 'moderate';
    }

    const isPersistent = persistenceHours >= 24;

    const recommendedActions = [];
    if (escalationTier === 3) {
      recommendedActions.push('CALL_108_AMBULANCE');
      recommendedActions.push('ALERT_PRIMARY_CAREGIVER_PHONE');
      recommendedActions.push('PREPARE_HOSPITAL_DOSSIER');
      recommendedActions.push('KEEP_PATIENT_SEATED_RESTING');
    } else if (escalationTier === 2) {
      recommendedActions.push('SCHEDULE_TELE_CONSULT_GERIATRICIAN');
      recommendedActions.push('CHECK_BLOOD_PRESSURE_TWICE_DAILY');
      recommendedActions.push('REVIEW_HYDRATION_AND_SALT_INTAKE');
    } else {
      recommendedActions.push('MAINTAIN_HYDRATION');
      recommendedActions.push('OFFER_WARM_HERBAL_TEA');
      recommendedActions.push('CONTINUE_SOFT_MONITORING');
    }

    const anomaly = await HealthAnomaly.create({
      type: type || 'speech_slur_aphasia',
      severity: computedSeverity,
      title: title || 'Subtle Neurological Divergence Detected',
      description: description || 'Biomarker tracking recorded a deviation from established 7-day baseline.',
      persistenceHours,
      isPersistent,
      escalationTier,
      beFastMarkers: {
        balance: Boolean(beFastMarkers.balance),
        eyes: Boolean(beFastMarkers.eyes),
        face: Boolean(beFastMarkers.face),
        arms: Boolean(beFastMarkers.arms),
        speech: Boolean(beFastMarkers.speech),
        timeMinutes: beFastMarkers.timeMinutes || 10
      },
      metrics: {
        speechHesitationScore: metrics.speechHesitationScore || 0,
        tapLatencyMs: metrics.tapLatencyMs || 0,
        tapSymmetryRatio: metrics.tapSymmetryRatio || 1.0,
        orientationAccuracyDelta: metrics.orientationAccuracyDelta || 0
      },
      recommendedActions,
      status: 'active'
    });

    // Real-time broadcast to Caregiver Portal
    const alertPayload = {
      event: 'HEALTH_ANOMALY_ALERT',
      anomaly,
      escalationTier,
      timestamp: Date.now()
    };

    emitToCaregiver('caregiver:health-alert', alertPayload);
    emitToAll('caregiver:health-alert', alertPayload);
    broadcast({
      type: 'HEALTH_ANOMALY_ALERT',
      data: alertPayload
    });

    console.log(`[Health Sentinel] New Anomaly Logged: Tier ${escalationTier} (${computedSeverity}) - ${title}`);

    res.json({
      success: true,
      anomaly,
      escalationTier,
      message: escalationTier === 3 ? '🚨 CRITICAL EMERGENCY BEACON FIRED' : 'Anomaly recorded and analyzed'
    });
  } catch (err) {
    console.error('[Health Anomaly Ingestion Error]', err);
    res.status(500).json({ error: 'Failed to record health anomaly' });
  }
});

// POST /api/health-monitoring/simulate — Trigger interactive scenarios for clinical triage verification
router.post('/simulate', async (req, res) => {
  try {
    const { scenario = 'tier_3' } = req.body;

    let simulationConfig = {};

    if (scenario === 'tier_3') {
      // Acute Cerebral Hemorrhage / Acute Stroke Warning
      simulationConfig = {
        type: 'composite_stroke_warning',
        severity: 'critical',
        title: 'ACUTE STROKE / HEMORRHAGE RED FLAG: Sudden Speech Dysarthria & Right-Arm Motor Drop',
        description: 'Elder exhibited sudden 65% voice phoneme hesitation and unilateral right-side touch tap deficit during morning recall. Positive BE-FAST speech & arm markers.',
        persistenceHours: 0.5,
        beFastMarkers: {
          balance: false,
          eyes: true,
          face: true,
          arms: true,
          speech: true,
          timeMinutes: 15
        },
        metrics: {
          speechHesitationScore: 78,
          tapLatencyMs: 1420,
          tapSymmetryRatio: 0.42, // severe right side motor deficit
          orientationAccuracyDelta: -60
        }
      };
    } else if (scenario === 'tier_2') {
      // 48-Hour Persistent Abnormality (Subdural / Micro-bleed / Severe Hypertension Warning)
      simulationConfig = {
        type: 'reported_headache_dizziness',
        severity: 'moderate',
        title: 'PERSISTENT WARNING (48h): Occipital Headache & Mild Orientation Decline',
        description: 'Persistent morning dizziness and throbbing headache reported across 2 consecutive days. Blood pressure spike suspected; tele-consultation required.',
        persistenceHours: 52,
        beFastMarkers: {
          balance: true,
          eyes: false,
          face: false,
          arms: false,
          speech: false,
          timeMinutes: 3120
        },
        metrics: {
          speechHesitationScore: 28,
          tapLatencyMs: 820,
          tapSymmetryRatio: 0.88,
          orientationAccuracyDelta: -25
        }
      };
    } else {
      // Tier 1 Mild Watch
      simulationConfig = {
        type: 'motor_tap_asymmetry',
        severity: 'mild',
        title: 'MILD VARIANCE: Slight Morning Motor Tap Hesitation',
        description: 'Elder took 1.2s longer to pair memory cards. Completely cleared with warm tea and relaxed pacing.',
        persistenceHours: 4,
        beFastMarkers: {
          balance: false,
          eyes: false,
          face: false,
          arms: false,
          speech: false,
          timeMinutes: 240
        },
        metrics: {
          speechHesitationScore: 12,
          tapLatencyMs: 460,
          tapSymmetryRatio: 0.94,
          orientationAccuracyDelta: -5
        }
      };
    }

    // Call report anomaly logic internally
    const response = await fetch(`http://127.0.0.1:5050/api/health-monitoring/report-anomaly`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(simulationConfig)
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('[Simulation Error]', err);
    res.status(500).json({ error: 'Simulation failed: ' + err.message });
  }
});

// POST /api/health-monitoring/resolve — Caregiver acknowledges or resolves alert
router.post('/resolve', async (req, res) => {
  try {
    const { anomalyId, actionTaken = 'Checked on patient in person', note = '' } = req.body;

    if (!anomalyId) {
      // Resolve all active
      await HealthAnomaly.updateMany(
        { status: 'active' },
        { 
          $set: { status: 'resolved' },
          $push: { actionsTaken: actionTaken }
        }
      );
      return res.json({ success: true, message: 'All active health alerts marked resolved' });
    }

    const updated = await HealthAnomaly.findByIdAndUpdate(
      anomalyId,
      {
        $set: { status: 'resolved' },
        $push: { actionsTaken: `${actionTaken} ${note ? '(' + note + ')' : ''}` }
      },
      { new: true }
    );

    res.json({ success: true, anomaly: updated });
  } catch (err) {
    console.error('[Resolve Alert Error]', err);
    res.status(500).json({ error: 'Failed to resolve anomaly' });
  }
});

// GET /api/health-monitoring/emergency-dossier — 1-Click First Responder Medical Packet
router.get('/emergency-dossier', async (req, res) => {
  try {
    const profile = await ElderlyProfile.findOne();
    const activeCritical = await HealthAnomaly.findOne({ escalationTier: 3, status: 'active' }).sort({ timestamp: -1 });

    const dossier = {
      patientName: profile?.name || 'Bhaben Baruah',
      age: profile?.age || 76,
      currentLocation: profile?.currentResidence || 'House No. 14, Beltola Tiniali, Guwahati, Assam',
      primaryCaregiver: profile?.emergencyContact?.name || 'Deepak Baruah',
      primaryCaregiverPhone: profile?.emergencyContact?.phone || '+91 98640 12345',
      ambulanceContact: '108 Emergency Medical Services',
      bloodGroup: 'O Positive (O+)',
      chronicIllnesses: ['Hypertension', 'Mild Age-Related Memory Decline'],
      dailyMedications: ['Amlodipine 5mg (Daily morning)', 'Ecosprin 75mg (Daily after lunch)'],
      allergies: ['Penicillin (Mild drug reaction)'],
      hospitalPreference: 'GNRC Hospitals (Super Specialty), Dispur, Guwahati',
      incidentSummary: activeCritical ? {
        symptomOnset: activeCritical.symptomOnsetDate,
        durationMinutes: activeCritical.beFastMarkers?.timeMinutes || 15,
        flaggedMarkers: Object.entries(activeCritical.beFastMarkers || {})
          .filter(([k, v]) => v === true)
          .map(([k]) => k.toUpperCase()),
        observedDeficit: activeCritical.description
      } : {
        status: 'No active critical stroke/hemorrhage event flagged in last 60 minutes.'
      }
    };

    res.json(dossier);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate emergency dossier' });
  }
});

module.exports = router;
