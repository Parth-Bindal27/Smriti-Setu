import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NavigationCards from './components/NavigationCards';
import MemoryLaneModule from './components/MemoryLaneModule';
import NumberSequenceGame from './components/NumberSequenceGame';
import WordPuzzleGame from './components/WordPuzzleGame';
import PictureMatchGame from './components/PictureMatchGame';
import CulturalReminiscenceModule from './components/CulturalReminiscenceModule';
import DailyRoutineModule from './components/DailyRoutineModule';
import StorytellingModule from './components/StorytellingModule';
import VRMemoryExperience from './components/VRMemoryExperience';
import DemoSetupModal from './components/DemoSetupModal';
import DailyAssessmentGate from './components/DailyAssessmentGate';
import MemoryMatchGame from './components/MemoryMatchGame';
import VisualSequenceGame from './components/VisualSequenceGame';
import AIPetCompanion from './components/AIPetCompanion';
import HeirloomScannerModule from './components/HeirloomScannerModule';
import FamilyBoardModule from './components/FamilyBoardModule';
import PentaMindCanvasModule from './components/PentaMindCanvasModule';
import VirtualPresenceRoom from './components/VirtualPresenceRoom';
import WelcomingDailyDashboard from './components/WelcomingDailyDashboard';
import EverydayDetectiveGame from './components/EverydayDetectiveGame';
import SoundMemoryQuestGame from './components/SoundMemoryQuestGame';
import RecipeRebuilderGame from './components/RecipeRebuilderGame';
import GardenOfMemoriesGame from './components/GardenOfMemoriesGame';
import FocusPeripheralGame from './components/FocusPeripheralGame';
import FocusFinderGame from './components/FocusFinderGame';
import SmritiMatchQuestGame from './components/SmritiMatchQuestGame';
import TuneMemoryGame from './components/TuneMemoryGame';
import { TRANSLATIONS } from './i18n/translations';
import { DEFAULT_MEMORY_ITEMS } from './data/memoryItems';
import { speechService } from './services/speechService';
import { Sparkles, WifiOff } from 'lucide-react';
import { getSocket, emitActivityStart, emitSessionComplete } from './socket';
import { initializeStorage, STORES } from './services/storage';
import { fetchWithLocalFallback, drainPendingMutations, initializeNetworkListeners } from './services/offlineSync';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const [isDemoSetupOpen, setIsDemoSetupOpen] = useState(false);
  const [sessionCompletedNotice, setSessionCompletedNotice] = useState(false);

  // Voluntary Daily Memory Assessment Gate state (Non-coercive, voluntary)
  const [showAssessmentGate, setShowAssessmentGate] = useState(false);

  // Authoritative language state ('as', 'bn', 'ne', 'hi', 'en')
  const [selectedLanguage, setSelectedLanguage] = useState('as');
  // Authoritative cultural region strictly bounded to the 8 sister states of the North Eastern Region of India
  const [selectedContentRegion] = useState('NER');
  const [vrPresetMemories, setVrPresetMemories] = useState(null);

  // Use Vite proxy for seamless routing on both localhost and mobile LAN IP
  const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);

  const handleLanguageChange = (newLang) => {
    speechService.stop();
    setSelectedLanguage(newLang);
  };

  const checkAssessmentGate = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/assessment/status`);
      if (res.ok) {
        const data = await res.json();
        const dismissed = sessionStorage.getItem('smriti_gate_completed_session');
        if (data.isRequired && !dismissed) {
          setShowAssessmentGate(true);
        }
      }
    } catch (err) {
      console.warn('Assessment status check notice:', err);
    }
  };

  const handleAssessmentComplete = () => {
    sessionStorage.setItem('smriti_gate_completed_session', 'true');
    setShowAssessmentGate(false);
    fetchData();
  };

  const fetchData = async () => {
    try {
      const [pRes, fRes, rRes, prefRes] = await Promise.all([
        fetchWithLocalFallback('/api/profile', STORES.ELDER_PROFILES, apiUrl),
        fetchWithLocalFallback('/api/family', STORES.CAREGIVER_PROFILES, apiUrl),
        fetchWithLocalFallback('/api/routines', STORES.CARE_ROUTINES, apiUrl),
        fetchWithLocalFallback('/api/profile/preferences', STORES.SYNC_METADATA, apiUrl)
      ]);

      if (pRes.data) {
        const p = pRes.data;
        setProfile(p);
      }
      if (prefRes.data) {
        const prefs = prefRes.data;
        setPreferences(prefs);
        if (prefs.language) {
          setSelectedLanguage(prefs.language);
        }
      } else if (pRes.data?.primaryLanguage) {
        const l = pRes.data.primaryLanguage.toLowerCase();
        if (l.includes('nepali')) setSelectedLanguage('ne');
        else if (l.includes('bengali') || l.includes('bangla')) setSelectedLanguage('bn');
        else if (l.includes('hindi')) setSelectedLanguage('hi');
        else if (l.includes('english')) setSelectedLanguage('en');
        else if (l.includes('assamese') || l.includes('as')) setSelectedLanguage('as');
      }

      if (fRes.data) setFamilyMembers(Array.isArray(fRes.data) ? fRes.data : []);
      if (rRes.data) setRoutines(Array.isArray(rRes.data) ? rRes.data : []);

      if (pRes.isOffline) setIsOffline(true);
      else setIsOffline(false);
    } catch (err) {
      console.warn('Backend fetch notice (serving from secure local store):', err.message);
      setIsOffline(true);
    }
  };

  useEffect(() => {
    initializeStorage().catch(err => console.warn('[App] Local storage init notice:', err));
    initializeNetworkListeners(apiUrl);

    const handleOnline = () => {
      setIsOffline(false);
      fetchData();
    };
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    fetchData();
    checkAssessmentGate();

    // WebSocket listener for remote Caregiver session trigger
    let reconnectTimeout = null;
    const connectWebSocket = () => {
      try {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsHost = apiUrl
          ? apiUrl.replace(/^http(s?):\/\//, '')
          : (window.location.hostname ? `${window.location.hostname}:5050` : 'localhost:5050');
        const wsUrl = `${wsProtocol}//${wsHost}/ws`;

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          ws.send(JSON.stringify({
            type: 'IDENTIFY',
            role: 'headset',
            client: 'ElderlySiteMain'
          }));
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'VR_SESSION_START') {
              if (msg.memories && msg.memories.length > 0) {
                setVrPresetMemories(msg.memories);
              }
              speechService.stop();
              setActiveModule('vr_memory');
            } else if (msg.type === 'VR_CONTROL_EVENT') {
              if (msg.action === 'FORCE_EXIT' || msg.action === 'PAUSE' || msg.action === 'TERMINATE') {
                console.log('🛑 [Elderly Site WS] Caregiver forced exit from VR to Home screen!');
                speechService.stop();
                setActiveModule(null);
              }
            } else if (msg.type === 'ASSESSMENT_FORCE_GATE') {
              console.log('🔒 [Elderly Site WS] Remote assessment gate trigger received!');
              speechService.stop();
              setActiveModule(null);
              setShowAssessmentGate(true);
            }
          } catch (e) {}
        };

        ws.onclose = () => {
          reconnectTimeout = setTimeout(connectWebSocket, 4000);
        };
      } catch (e) {
        reconnectTimeout = setTimeout(connectWebSocket, 5000);
      }
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [apiUrl]);

  // Real-Time Socket.IO Synchronization (Zero Page Refresh)
  useEffect(() => {
    const socket = getSocket();

    socket.on('memory:selection-changed', (updatedMemory) => {
      console.log('⚡ [Elderly Socket.IO] Memory selection changed by caregiver:', updatedMemory);
      // Auto-refresh data from MongoDB if memories were changed
      fetchData();
    });

    // Caregiver VR Pause Override / Force Exit listener
    socket.on('elderly:control', (data) => {
      console.log('⚡ [Elderly Socket.IO] Control received from caregiver:', data);
      if (data?.action === 'FORCE_EXIT_VR' || data?.action === 'PAUSE' || data?.action === 'FORCE_EXIT') {
        console.log('🛑 [Elderly Site Socket] Caregiver forced exit from VR to Home screen!');
        speechService.stop();
        setActiveModule(null);
      }
    });

    // Remote Assessment Gate trigger from Caregiver
    socket.on('assessment:force-gate', () => {
      console.log('🔒 [Elderly Site Socket] Remote assessment gate trigger received!');
      speechService.stop();
      setActiveModule(null);
      setShowAssessmentGate(true);
    });

    // Real-Time Caregiver Preferences Update listener
    socket.on('preferences:updated', (updatedPrefs) => {
      console.log('⚡ [Elderly Site Socket] Preferences updated by caregiver:', updatedPrefs);
      if (updatedPrefs) {
        setPreferences(updatedPrefs);
        if (updatedPrefs.language) {
          setSelectedLanguage(updatedPrefs.language);
        }
      }
    });

    return () => {
      socket.off('memory:selection-changed');
      socket.off('elderly:control');
      socket.off('assessment:force-gate');
      socket.off('preferences:updated');
    };
  }, []);

  const currentLang = selectedLanguage;
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  const handleSessionComplete = (savedSession) => {
    emitSessionComplete({
      activityName: activeModule || 'Cognitive Module',
      session: savedSession || null
    });
    setSessionCompletedNotice(true);
    setTimeout(() => {
      setSessionCompletedNotice(false);
      setActiveModule(null);
      fetchData();
    }, 3500);
  };

  // Optional / Remote Assessment Gate
  if (showAssessmentGate) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
        <div style={{
          padding: '1rem 2rem',
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setShowAssessmentGate(false)}
            style={{
              padding: '10px 22px',
              borderRadius: '14px',
              border: '2px solid #CBD5E1',
              background: '#FFFFFF',
              fontSize: '18px',
              fontWeight: 700,
              cursor: 'pointer',
              color: '#334155'
            }}
          >
            ← {t.mainMenu || 'Back to Home'}
          </button>
          <span style={{ color: '#64748B', fontWeight: 600, fontSize: '16px' }}>
            {t.nerBadge || 'Voluntary Daily Memory Check'}
          </span>
        </div>
        <DailyAssessmentGate
          onComplete={handleAssessmentComplete}
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
          apiUrl={apiUrl}
        />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>

      <Header
        profile={profile}
        activeModule={activeModule}
        onBackHome={() => setActiveModule(null)}
        onOpenDemoSetup={() => setIsDemoSetupOpen(true)}
        onOpenAssessment={() => setShowAssessmentGate(true)}
        currentLang={selectedLanguage}
        selectedLanguage={selectedLanguage}
        onLangChange={handleLanguageChange}
        t={t}
      />

      {/* Module Rendering */}
      {!activeModule && (
        <WelcomingDailyDashboard
          profile={profile}
          preferences={preferences}
          selectedLanguage={selectedLanguage}
          onSelectModule={(modId) => {
            emitActivityStart(modId);
            setActiveModule(modId);
          }}
          onOpenAssessment={() => setShowAssessmentGate(true)}
          isOffline={isOffline}
          t={t}
          apiUrl={apiUrl}
        />
      )}

      {activeModule === 'family_recall' && (
        <MemoryLaneModule
          items={DEFAULT_MEMORY_ITEMS}
          familyMembers={familyMembers}
          selectedLanguage={selectedLanguage}
          selectedContentRegion={selectedContentRegion}
          onLanguageChange={handleLanguageChange}
          onSessionComplete={handleSessionComplete}
          apiUrl={apiUrl}
          lang={selectedLanguage}
          t={t}
        />
      )}

      {activeModule === 'number_sequence' && (
        <NumberSequenceGame
          onSessionComplete={handleSessionComplete}
          apiUrl={apiUrl}
          selectedLanguage={selectedLanguage}
          selectedContentRegion={selectedContentRegion}
          lang={selectedLanguage}
          t={t}
        />
      )}

      {activeModule === 'word_puzzle' && (
        <WordPuzzleGame
          onSessionComplete={handleSessionComplete}
          apiUrl={apiUrl}
          selectedLanguage={selectedLanguage}
          selectedContentRegion={selectedContentRegion}
          lang={selectedLanguage}
          t={t}
        />
      )}

      {activeModule === 'picture_match' && (
        <PictureMatchGame
          onSessionComplete={handleSessionComplete}
          apiUrl={apiUrl}
          selectedLanguage={selectedLanguage}
          selectedContentRegion={selectedContentRegion}
          lang={selectedLanguage}
          t={t}
        />
      )}

      {activeModule === 'cultural_reminiscence' && (
        <CulturalReminiscenceModule
          onSessionComplete={handleSessionComplete}
          apiUrl={apiUrl}
          selectedLanguage={selectedLanguage}
          selectedContentRegion={selectedContentRegion}
          lang={selectedLanguage}
          t={t}
        />
      )}

      {activeModule === 'daily_routine' && (
        <DailyRoutineModule
          routines={routines}
          onRefreshRoutines={fetchData}
          onSessionComplete={handleSessionComplete}
          apiUrl={apiUrl}
        />
      )}

      {activeModule === 'storytelling' && (
        <StorytellingModule
          onSessionComplete={handleSessionComplete}
          apiUrl={apiUrl}
          selectedLanguage={selectedLanguage}
          selectedContentRegion={selectedContentRegion}
          lang={selectedLanguage}
          t={t}
        />
      )}

      {activeModule === 'vr_memory' && (
        <VRMemoryExperience
          onSessionComplete={handleSessionComplete}
          apiUrl={apiUrl}
          selectedLanguage={selectedLanguage}
          lang={selectedLanguage}
          t={t}
          presetMemories={vrPresetMemories}
        />
      )}

      {activeModule === 'memory_match' && (
        <MemoryMatchGame
          onSessionComplete={handleSessionComplete}
          apiUrl={apiUrl}
        />
      )}

      {activeModule === 'visual_sequence' && (
        <VisualSequenceGame
          onSessionComplete={handleSessionComplete}
          apiUrl={apiUrl}
        />
      )}

      {activeModule === 'ai_pet' && (
        <AIPetCompanion
          onSessionComplete={handleSessionComplete}
          apiUrl={apiUrl}
          selectedLanguage={selectedLanguage}
          t={t}
        />
      )}

      {activeModule === 'heirloom_scanner' && (
        <HeirloomScannerModule
          onSessionComplete={handleSessionComplete}
          apiUrl={apiUrl}
          selectedLanguage={selectedLanguage}
          t={t}
        />
      )}

      {activeModule === 'family_board' && (
        <FamilyBoardModule
          onSessionComplete={handleSessionComplete}
          apiUrl={apiUrl}
          selectedLanguage={selectedLanguage}
          t={t}
        />
      )}

      {activeModule === 'pentamind_drawing' && (
        <PentaMindCanvasModule
          onSessionComplete={handleSessionComplete}
          apiUrl={apiUrl}
          selectedLanguage={selectedLanguage}
          t={t}
        />
      )}

      {activeModule === 'virtual_presence' && (
        <VirtualPresenceRoom
          onSessionComplete={handleSessionComplete}
          apiUrl={apiUrl}
          selectedLanguage={selectedLanguage}
          t={t}
        />
      )}

      {activeModule === 'everyday_detective' && (
        <EverydayDetectiveGame
          onSessionComplete={handleSessionComplete}
          selectedLanguage={selectedLanguage}
          t={t}
        />
      )}

      {activeModule === 'sound_memory_quest' && (
        <SoundMemoryQuestGame
          onSessionComplete={handleSessionComplete}
          selectedLanguage={selectedLanguage}
          t={t}
        />
      )}

      {activeModule === 'recipe_rebuilder' && (
        <RecipeRebuilderGame
          onSessionComplete={handleSessionComplete}
          selectedLanguage={selectedLanguage}
          t={t}
        />
      )}

      {activeModule === 'garden_of_memories' && (
        <GardenOfMemoriesGame
          onSessionComplete={handleSessionComplete}
          selectedLanguage={selectedLanguage}
          t={t}
        />
      )}

      {activeModule === 'focus_peripheral' && (
        <FocusPeripheralGame
          onSessionComplete={handleSessionComplete}
          selectedLanguage={selectedLanguage}
          t={t}
        />
      )}

      {activeModule === 'focus_finder' && (
        <FocusFinderGame
          onSessionComplete={handleSessionComplete}
          selectedLanguage={selectedLanguage}
          t={t}
        />
      )}

      {activeModule === 'smriti_match_quest' && (
        <SmritiMatchQuestGame
          onSessionComplete={handleSessionComplete}
          selectedLanguage={selectedLanguage}
          t={t}
        />
      )}

      {activeModule === 'tune_memory' && (
        <TuneMemoryGame
          onSessionComplete={handleSessionComplete}
          selectedLanguage={selectedLanguage}
          t={t}
        />
      )}

      {/* Discrete Fallback Setup Modal */}
      <DemoSetupModal
        isOpen={isDemoSetupOpen}
        onClose={() => setIsDemoSetupOpen(false)}
        onDataUpdated={fetchData}
        apiUrl={apiUrl}
      />
    </div>
  );
}
