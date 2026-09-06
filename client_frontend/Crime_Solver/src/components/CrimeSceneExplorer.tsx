import React, { useState, useEffect, useRef } from 'react';
import type { CaseData, CrimeScene, Clue, Hotspot } from '../types';
import { sound } from '../utils/soundEngine';
import { ClueInspectModal } from './ClueInspectModal';
import { EvidenceInventory } from './EvidenceInventory';
import { AiPartnerHUD } from './AiPartnerHUD';
import { AiInterrogationRoom } from './AiInterrogationRoom';
import { DeductionModal } from './DeductionModal';
import { FullscreenButton } from './FullscreenButton';
import { ThreeSceneRoom } from './ThreeSceneRoom';
import { 
  Flashlight, Folder, BrainCircuit, ArrowLeft, 
  Sparkles, Clock, Eye, EyeOff, ListChecks, MapPin, UserMinus, Zap
} from 'lucide-react';

interface CrimeSceneExplorerProps {
  caseData: CaseData;
  onReturnToDashboard: () => void;
  onUpdateScore: (score: number, caseId: string) => void;
}

export const CrimeSceneExplorer: React.FC<CrimeSceneExplorerProps> = ({
  caseData,
  onReturnToDashboard,
  onUpdateScore,
}) => {
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [discoveredClueIds, setDiscoveredClueIds] = useState<string[]>([]);
  const [inspectedHotspotIds, setInspectedHotspotIds] = useState<string[]>([]);
  const [inspectingClue, setInspectingClue] = useState<Clue | null>(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [isInterrogationOpen, setIsInterrogationOpen] = useState<boolean>(false);
  const [isDeductionOpen, setIsDeductionOpen] = useState<boolean>(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [isNightVisionOn, setIsNightVisionOn] = useState<boolean>(false);
  const [isUvMode, setIsUvMode] = useState<boolean>(false);
  const [discoveryFlash, setDiscoveryFlash] = useState<boolean>(false);
  const lastHeartbeatTime = useRef<number>(0);
  const activeScene: CrimeScene = caseData.scenes[activeSceneIndex] || caseData.scenes[0];

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleHotspotClick = async (hotspot: Hotspot) => {
    sound.playScannerHum();

    if (!inspectedHotspotIds.includes(hotspot.id)) {
      setInspectedHotspotIds((prev) => [...prev, hotspot.id]);
    }

    if (hotspot.linkedClueId) {
      const clue = caseData.clues.find((c) => c.id === hotspot.linkedClueId);
      if (clue) {
        if (!discoveredClueIds.includes(clue.id)) {
          setDiscoveryFlash(true);
          setTimeout(() => setDiscoveryFlash(false), 200);
          sound.playClueDiscovered();

          setDiscoveredClueIds((prev) => [...prev, clue.id]);
          setScanMessage(`CRUCIAL EVIDENCE LOGGED: "${clue.title.toUpperCase()}"`);
          setTimeout(() => setScanMessage(null), 4000);

          // Sync discovery to backend
          try {
            const savedToken = localStorage.getItem('cib_token');
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (savedToken) headers['Authorization'] = `Bearer ${savedToken}`;

            await fetch(`/api/cases/${caseData.id}/discover`, {
              method: 'POST',
              headers,
              body: JSON.stringify({ clueId: clue.id, hotspotId: hotspot.id }),
            });
          } catch (e) {
            console.error('Failed to sync discovery', e);
          }
        }
        setInspectingClue(clue);
      }
    }
  };

  const discoveredClues = caseData.clues.filter((c) => discoveredClueIds.includes(c.id));

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative min-h-screen flex flex-col z-10 select-none bg-[#040101] text-red-100 font-sans">
      
      {/* Camera Shutter Discovery Flash */}
      {discoveryFlash && (
        <div className="fixed inset-0 z-50 pointer-events-none bg-white/40 mix-blend-screen transition-opacity duration-150" />
      )}

      {/* Top Forensic Header */}
      <header className="sticky top-0 z-30 bg-[#0d0202]/95 border-b border-red-900/60 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xl backdrop-blur-md">
        
        {/* Left: Case Info & Back Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playKeyClick();
              onReturnToDashboard();
            }}
            className="px-3 py-1.5 rounded-lg bg-black border border-red-900/60 hover:border-red-500 text-red-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-mono text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-red-400" />
            <span>CASE FILES</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-creepster font-bold text-sm sm:text-base text-white tracking-wide">
                {caseData.caseNumber}
              </span>
              <span className="text-xs font-semibold text-red-300 hidden sm:inline">
                • {caseData.title}
              </span>
            </div>
            <div className="text-[11px] font-mono text-red-400/70 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span className="text-red-200">{activeScene.name}</span>
              <span>•</span>
              <Clock className="w-3.5 h-3.5 text-red-400" />
              <span className="text-red-300 font-bold">{formatTimer(timeSpentSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Center: Room Switcher */}
        <div className="flex items-center gap-1 bg-black/80 p-1 rounded-xl border border-red-900/60">
          {caseData.scenes.map((scene, idx) => {
            const isCurrent = activeSceneIndex === idx;
            return (
              <button
                key={scene.id}
                onClick={() => {
                  sound.playKeyClick();
                  setActiveSceneIndex(idx);
                }}
                className={`px-3 py-1.5 rounded-lg font-sans text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-red-800 text-white shadow-md shadow-red-950'
                    : 'text-red-400/70 hover:text-red-200 hover:bg-red-950/40'
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>{scene.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-2">
          
          <FullscreenButton showLabel={false} />

          {/* UV Blacklight Mode Toggle */}
          <button
            onClick={() => {
              sound.playFlashlightClick();
              setIsUvMode(!isUvMode);
            }}
            title={isUvMode ? "Switch to Normal Spotlight" : "Switch to UV Forensic Blacklight"}
            className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isUvMode
                ? 'bg-purple-950/90 border-purple-500 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-black border-red-900/60 text-red-400/80 hover:border-red-500'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">{isUvMode ? 'UV BLACKLIGHT ON' : 'UV MODE'}</span>
          </button>

          {/* Ambient Lighting Toggle */}
          <button
            onClick={() => {
              sound.playFlashlightClick();
              setIsNightVisionOn(!isNightVisionOn);
            }}
            title={isNightVisionOn ? 'Turn on Forensic Spotlight' : 'Turn on Room Ambient Light'}
            className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              isNightVisionOn
                ? 'bg-red-950/90 border-red-500 text-red-200 font-bold'
                : 'bg-black border-red-900/60 text-red-400/80 hover:border-red-500'
            }`}
          >
            {isNightVisionOn ? <Eye className="w-4 h-4 text-red-400" /> : <EyeOff className="w-4 h-4 text-red-400" />}
            <span className="hidden md:inline">{isNightVisionOn ? 'LIGHTS ON' : 'SPOTLIGHT'}</span>
          </button>

          {/* Interrogate Suspect Button */}
          <button
            onClick={() => {
              sound.playKeyClick();
              setIsInterrogationOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-900/90 border border-red-500/80 hover:bg-red-800 text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-[0_0_20px_rgba(220,38,38,0.4)] animate-pulse"
          >
            <UserMinus className="w-4 h-4 text-red-300" />
            <span className="hidden lg:inline">INTERROGATE ({caseData.suspects.length})</span>
          </button>

          {/* Evidence Dossier Button */}
          <button
            onClick={() => {
              sound.playKeyClick();
              setIsInventoryOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black border border-red-900/60 hover:border-red-500 text-red-300 font-mono text-xs font-bold transition-colors cursor-pointer"
          >
            <Folder className="w-4 h-4 text-red-400" />
            <span>EVIDENCE ({discoveredClues.length}/{caseData.clues.length})</span>
          </button>

          {/* Final Deduction Button */}
          <button
            onClick={() => {
              sound.playKeyClick();
              setIsDeductionOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-creepster font-bold text-xs tracking-wider shadow-lg hover:shadow-red-500/30 transition-all cursor-pointer"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>SOLVE CASE 🔎</span>
          </button>

        </div>
      </header>

      {/* Investigation Progress Checklist Bar */}
      <div className="bg-[#080202] border-b border-red-950/80 px-6 py-2 flex flex-wrap items-center justify-between text-xs font-sans">
        <div className="flex items-center gap-6 text-red-300/80">
          <div className="flex items-center gap-2 font-medium">
            <ListChecks className="w-4 h-4 text-red-500 shrink-0" />
            <span className="font-bold text-white font-mono">OBJECTIVES:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
              discoveredClues.length > 0 ? 'bg-red-600 text-white' : 'bg-red-950 text-red-500'
            }`}>
              {discoveredClues.length > 0 ? '✓' : '1'}
            </span>
            <span className={discoveredClues.length >= caseData.clues.length ? 'text-red-400 font-bold' : 'text-red-300/90'}>
              Scan crime scenes for physical traces ({discoveredClues.length}/{caseData.clues.length} Collected)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
              discoveredClues.length >= 2 ? 'bg-red-600 text-white' : 'bg-red-950 text-red-500'
            }`}>
              {discoveredClues.length >= 2 ? '✓' : '2'}
            </span>
            <span className="text-red-300/90">
              Interrogate Suspects & Present Collected Evidence
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-red-400 font-mono text-[11px]">
          <Flashlight className="w-3.5 h-3.5 animate-pulse text-red-500" />
          <span>Move mouse to direct forensic beam. Listen for accelerating heartbeats.</span>
        </div>
      </div>

      {/* Toast Notification for Clue Discovered */}
      {scanMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white font-bold px-6 py-2.5 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.8)] flex items-center gap-2 text-xs font-mono border-2 border-white animate-bounce">
          <Sparkles className="w-4 h-4 text-white" />
          <span>{scanMessage}</span>
        </div>
      )}

      {/* Main Interactive Crime Scene Canvas */}
      <main className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
        
        <div
          className={`relative w-full max-w-5xl h-[64vh] sm:h-[72vh] rounded-3xl overflow-hidden border-2 shadow-2xl transition-colors duration-500 ${
            isUvMode ? 'border-purple-600/80 shadow-[0_0_50px_rgba(147,51,234,0.3)]' : 'border-red-900/60 shadow-[0_0_50px_rgba(220,38,38,0.25)]'
          }`}
        >
          {/* Room Title Plate */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/90 border border-red-900 text-red-400 font-mono text-xs font-bold mb-1 shadow-lg">
              <MapPin className="w-3.5 h-3.5" />
              <span>{activeScene.name.toUpperCase()}</span>
            </div>
            <p className="text-xs text-red-200/90 font-sans max-w-md bg-black/80 p-2 rounded-xl border border-red-950 backdrop-blur-sm shadow-md">
              {activeScene.description}
            </p>
          </div>

          {/* 360-Degree Three.js WebGL Crime Scene Engine */}
          <ThreeSceneRoom
            activeScene={activeScene}
            discoveredClueIds={discoveredClueIds}
            isNightVisionOn={isNightVisionOn}
            isUvMode={isUvMode}
            onHotspotClick={handleHotspotClick}
            onProximityChange={(dist) => {
              if (dist < 3.5) {
                const now = Date.now();
                if (now - lastHeartbeatTime.current > 700) {
                  sound.playHeartbeatOnce(1.3);
                  lastHeartbeatTime.current = now;
                }
              }
            }}
          />

          {/* Bottom Game HUD Overlay */}
          <div className="absolute bottom-4 left-4 z-20 text-[11px] font-mono text-red-400/90 bg-black/85 px-3.5 py-1.5 rounded-xl border border-red-900/60 backdrop-blur-md flex items-center gap-2 pointer-events-none shadow-lg">
            <Flashlight className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>3D ROOM ACTIVE // 360° DRAG TO LOOK // PROXIMITY HEARTBEATS LIVE</span>
          </div>

        </div>

      </main>

      {/* Floating SPECTER AI Partner HUD */}
      <AiPartnerHUD
        caseId={caseData.id}
        discoveredClues={discoveredClues}
        activeSceneName={activeScene.name}
      />

      {/* Evidence Drawer */}
      <EvidenceInventory
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        discoveredClues={discoveredClues}
        allSuspects={caseData.suspects}
        onInspectClue={(clue) => setInspectingClue(clue)}
      />

      {/* Clue Inspection Modal */}
      {inspectingClue && (
        <ClueInspectModal
          clue={inspectingClue}
          onClose={() => setInspectingClue(null)}
        />
      )}

      {/* AI Interrogation Room */}
      {isInterrogationOpen && (
        <AiInterrogationRoom
          caseData={caseData}
          discoveredClueIds={discoveredClueIds}
          onClose={() => setIsInterrogationOpen(false)}
        />
      )}

      {/* Final Case Deduction Modal */}
      {isDeductionOpen && (
        <DeductionModal
          caseData={caseData}
          discoveredClues={discoveredClues}
          timeTakenSeconds={timeSpentSeconds}
          onClose={() => setIsDeductionOpen(false)}
          onCaseSolved={(score) => onUpdateScore(score, caseData.id)}
          onReturnToDashboard={onReturnToDashboard}
        />
      )}

    </div>
  );
};
