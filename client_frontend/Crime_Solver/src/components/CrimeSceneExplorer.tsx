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
  Sparkles, Clock, Eye, EyeOff, ListChecks, MapPin, UserMinus, Zap,
  Globe, Scan, Tag, CheckCircle2, Key, Fingerprint, FlaskConical, Search, Lock
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
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isHoveringScene, setIsHoveringScene] = useState<boolean>(false);
  const [discoveryFlash, setDiscoveryFlash] = useState<boolean>(false);
  const lastHeartbeatTime = useRef<number>(0);
  const activeScene: CrimeScene = caseData.scenes[activeSceneIndex] || caseData.scenes[0];

  const handleSceneMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });

    // Proximity check for heartbeat sound in 2D mode
    activeScene.hotspots.forEach((hs) => {
      const dx = hs.xPercent - x;
      const dy = hs.yPercent - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 14) {
        const now = Date.now();
        if (now - lastHeartbeatTime.current > 750) {
          sound.playHeartbeatOnce(1.3);
          lastHeartbeatTime.current = now;
        }
      }
    });
  };

  const isHotspotUnderBeam = (hx: number, hy: number) => {
    if (isNightVisionOn) return true;
    const dx = hx - mousePos.x;
    const dy = hy - mousePos.y;
    return Math.sqrt(dx * dx + dy * dy) < 18;
  };

  const renderHotspotIcon = (iconType: string) => {
    switch (iconType) {
      case 'file':
      case 'document':
        return <Folder className="w-5 h-5 text-red-300" />;
      case 'key':
        return <Key className="w-5 h-5 text-amber-300" />;
      case 'fingerprint':
        return <Fingerprint className="w-5 h-5 text-purple-300" />;
      case 'flask-conical':
        return <FlaskConical className="w-5 h-5 text-cyan-300" />;
      default:
        return <Search className="w-5 h-5 text-red-300" />;
    }
  };

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

          const updatedClues = [...discoveredClueIds, clue.id];
          setDiscoveredClueIds(updatedClues);
          setScanMessage(`🎯 EVIDENCE SECURED: "${clue.title.toUpperCase()}" // STORED IN VAULT`);
          setTimeout(() => setScanMessage(null), 4500);

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
        } else {
          sound.playFlashlightClick();
          setScanMessage(`ALREADY SECURED: "${clue.title.toUpperCase()}" // IN EVIDENCE VAULT`);
          setTimeout(() => setScanMessage(null), 3000);
        }
      }
    }
  };

  const currentRoomClueIds = activeScene.hotspots
    .map((h) => h.linkedClueId)
    .filter((id): id is string => Boolean(id));

  const isCurrentRoomCleared =
    currentRoomClueIds.length > 0 &&
    currentRoomClueIds.every((id) => discoveredClueIds.includes(id));

  const allCaseCluesCollected =
    caseData.clues.length > 0 &&
    discoveredClueIds.length >= caseData.clues.length;

  const discoveredClues = caseData.clues.filter((c) => discoveredClueIds.includes(c.id));

  // Sequential room gate: room idx is unlocked only if all previous rooms have their clues discovered
  const isRoomUnlocked = (idx: number) => {
    if (idx === 0) return true;
    for (let i = 0; i < idx; i++) {
      const sceneClueIds = caseData.scenes[i].hotspots
        .map((h) => h.linkedClueId)
        .filter((id): id is string => Boolean(id));
      const cleared =
        sceneClueIds.length > 0 &&
        sceneClueIds.every((id) => discoveredClueIds.includes(id));
      if (!cleared) return false;
    }
    return true;
  };

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

        {/* Center: Sequential Room Switcher */}
        <div className="flex items-center gap-1 bg-black/80 p-1 rounded-xl border border-red-900/60 overflow-x-auto">
          {caseData.scenes.map((scene, idx) => {
            const isCurrent = activeSceneIndex === idx;
            const sceneClueIds = scene.hotspots.map((h) => h.linkedClueId).filter(Boolean);
            const isSceneCleared =
              sceneClueIds.length > 0 &&
              sceneClueIds.every((id) => discoveredClueIds.includes(id!));
            const isUnlocked = isRoomUnlocked(idx);

            return (
              <button
                key={scene.id}
                onClick={() => {
                  if (isUnlocked) {
                    sound.playKeyClick();
                    setActiveSceneIndex(idx);
                  } else {
                    sound.playAccessDenied();
                    setScanMessage(`🔒 ACCESS RESTRICTED // CLEAR ROOM "${caseData.scenes[idx - 1]?.name.toUpperCase()}" FIRST`);
                    setTimeout(() => setScanMessage(null), 3500);
                  }
                }}
                title={!isUnlocked ? 'Locked: Clear earlier room first' : scene.name}
                className={`px-3 py-1.5 rounded-lg font-sans text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-red-800 text-white shadow-md shadow-red-950'
                    : isSceneCleared
                    ? 'text-emerald-400 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-700/50 cursor-pointer'
                    : isUnlocked
                    ? 'text-red-300 hover:text-white hover:bg-red-950/40 cursor-pointer'
                    : 'text-slate-600 bg-black/40 border border-slate-900 cursor-not-allowed opacity-60'
                }`}
              >
                {isUnlocked ? (
                  <MapPin className="w-3 h-3" />
                ) : (
                  <Lock className="w-3 h-3 text-red-500/70" />
                )}
                <span>{scene.name}</span>
                {isSceneCleared ? (
                  <span className="text-[10px] bg-emerald-600 text-black font-black px-1 rounded-full">
                    ✓
                  </span>
                ) : !isUnlocked ? (
                  <span className="text-[9px] font-mono text-red-500 bg-red-950/80 px-1 py-0.2 rounded border border-red-900/60">
                    LOCKED
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Right: Sequential Phase Pipeline Ribbon & Tools */}
        <div className="flex items-center gap-2">
          
          <FullscreenButton showLabel={false} />

          {/* View Mode Toggle: 3D 360 Room vs 2D Tactical Scan */}
          <button
            onClick={() => {
              sound.playKeyClick();
              setViewMode((prev) => (prev === '3D' ? '2D' : '3D'));
            }}
            title="Toggle between 3D 360° Spherical Room and 2.5D Tactical Forensic Scan"
            className="px-2.5 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-1 transition-all cursor-pointer bg-black border-red-800 hover:border-red-400 text-red-300 font-bold shadow-md"
          >
            {viewMode === '3D' ? (
              <>
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xl:inline">3D ROOM</span>
              </>
            ) : (
              <>
                <Scan className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xl:inline">2D SCAN</span>
              </>
            )}
          </button>

          {/* UV Blacklight Mode Toggle */}
          <button
            onClick={() => {
              sound.playFlashlightClick();
              setIsUvMode(!isUvMode);
            }}
            title={isUvMode ? "Switch to Normal Spotlight" : "Switch to UV Forensic Blacklight"}
            className={`p-2 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isUvMode
                ? 'bg-purple-950/90 border-purple-500 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-black border-red-900/60 text-red-400/80 hover:border-red-500'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-purple-400" />
          </button>

          {/* Ambient Lighting Toggle */}
          <button
            onClick={() => {
              sound.playFlashlightClick();
              setIsNightVisionOn(!isNightVisionOn);
            }}
            title={isNightVisionOn ? 'Turn on Forensic Spotlight' : 'Turn on Room Ambient Light'}
            className={`p-2 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              isNightVisionOn
                ? 'bg-red-950/90 border-red-500 text-red-200 font-bold'
                : 'bg-black border-red-900/60 text-red-400/80 hover:border-red-500'
            }`}
          >
            {isNightVisionOn ? <Eye className="w-3.5 h-3.5 text-red-400" /> : <EyeOff className="w-3.5 h-3.5 text-red-400" />}
          </button>

          <div className="w-px h-5 bg-red-900/60 hidden sm:block" />

          {/* Sequential Step 2: Evidence Vault */}
          <button
            onClick={() => {
              if (discoveredClues.length > 0) {
                sound.playKeyClick();
                setIsInventoryOpen(true);
              } else {
                sound.playAccessDenied();
                setScanMessage("FIND EVIDENCE IN THE ROOM FIRST");
                setTimeout(() => setScanMessage(null), 3000);
              }
            }}
            title={discoveredClues.length === 0 ? "Find evidence in the room first" : "Inspect collected clues in 3D"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
              discoveredClues.length === 0
                ? 'bg-black/40 border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                : allCaseCluesCollected
                ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse cursor-pointer'
                : 'bg-black border-red-900/60 hover:border-red-500 text-red-300 cursor-pointer'
            }`}
          >
            <Folder className="w-3.5 h-3.5 text-amber-400" />
            <span>VAULT ({discoveredClues.length}/{caseData.clues.length})</span>
          </button>

          {/* Sequential Step 3: Interrogate Suspects */}
          <button
            onClick={() => {
              if (discoveredClues.length > 0) {
                sound.playKeyClick();
                setIsInterrogationOpen(true);
              } else {
                sound.playAccessDenied();
                setScanMessage("COLLECT PHYSICAL EVIDENCE BEFORE INTERROGATION");
                setTimeout(() => setScanMessage(null), 3000);
              }
            }}
            title={discoveredClues.length === 0 ? "Collect evidence before interrogating" : "Interrogate suspects with evidence"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
              discoveredClues.length === 0
                ? 'bg-black/40 border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                : 'bg-red-950/80 border-red-800 hover:border-red-500 text-red-300 hover:text-white cursor-pointer shadow-md'
            }`}
          >
            <UserMinus className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">INTERROGATE ({caseData.suspects.length})</span>
          </button>

          {/* Sequential Step 4: Solve Case */}
          <button
            onClick={() => {
              if (allCaseCluesCollected) {
                sound.playKeyClick();
                setIsDeductionOpen(true);
              } else {
                sound.playAccessDenied();
                setScanMessage(`REMAINING: ${caseData.clues.length - discoveredClues.length} CLUES NEEDED TO ACCUSE`);
                setTimeout(() => setScanMessage(null), 3500);
              }
            }}
            title={!allCaseCluesCollected ? "Gather all clues in all rooms to reconstruct crime" : "Submit Final Accusation Matrix"}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-creepster font-bold text-xs tracking-wider transition-all ${
              allCaseCluesCollected
                ? 'bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-[0_0_25px_rgba(220,38,38,0.5)] animate-pulse cursor-pointer'
                : 'bg-black/60 border border-red-950 text-red-900 cursor-not-allowed opacity-50'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
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

          {/* Room Clearance Notification Banner & Dynamic Stage Transition Gate */}
          {isCurrentRoomCleared && (
            <div className="absolute top-4 right-4 z-20 animate-in fade-in slide-in-from-top duration-300 max-w-sm">
              <div className="flex flex-col gap-2 bg-emerald-950/95 border-2 border-emerald-500 text-emerald-200 p-3.5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.5)] font-mono text-xs font-bold backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
                  <span className="text-emerald-300 font-black tracking-wider">
                    {allCaseCluesCollected
                      ? 'ALL CRIME SCENE ROOMS SECURED!'
                      : `ROOM "${activeScene.name.toUpperCase()}" CLEARED!`}
                  </span>
                </div>
                
                <p className="text-[11px] text-emerald-100 font-sans font-medium leading-relaxed">
                  {allCaseCluesCollected
                    ? 'All physical evidence has been secured. Enter the Evidence Vault to inspect 3D clues or interrogate suspects.'
                    : `All clues in this room have been logged. Proceed to the next area.`}
                </p>

                {/* Dynamic Next Gate Button */}
                {activeSceneIndex < caseData.scenes.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playAccessGranted();
                      setActiveSceneIndex(activeSceneIndex + 1);
                    }}
                    className="w-full mt-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-mono text-xs font-black tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer"
                  >
                    <span>ENTER NEXT ROOM: {caseData.scenes[activeSceneIndex + 1].name.toUpperCase()} ➔</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playAccessGranted();
                      setIsInventoryOpen(true);
                    }}
                    className="w-full mt-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-creepster font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all transform hover:scale-[1.02] cursor-pointer"
                  >
                    <Folder className="w-3.5 h-3.5 text-slate-950" />
                    <span>INSPECT 3D EVIDENCE VAULT ➔</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {viewMode === '3D' ? (
            /* 360-Degree Three.js WebGL Crime Scene Engine (Unmounted when Clue 3D modal or Interrogation is open to ensure single WebGL context) */
            (inspectingClue || isInterrogationOpen) ? (
              <div className="w-full h-full bg-black flex flex-col items-center justify-center text-red-400 font-mono text-xs gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
                <span>3D CRIME SCENE PAUSED // FORENSIC MODAL ACTIVE</span>
              </div>
            ) : (
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
            )
          ) : (
            /* 2.5D Tactical Forensic Beam Scan View */
            <div
              onMouseMove={handleSceneMouseMove}
              onMouseEnter={() => setIsHoveringScene(true)}
              onMouseLeave={() => setIsHoveringScene(false)}
              className="relative w-full h-full bg-[#0d0404] overflow-hidden cursor-crosshair select-none"
            >
              {/* Atmospheric Background Palette */}
              <div
                className={`absolute inset-0 transition-opacity duration-700 ${
                  isUvMode ? 'bg-[#18042b]' : 'bg-[#1a0707]'
                }`}
                style={{
                  backgroundImage: `radial-gradient(ellipse at center, ${
                    isUvMode ? '#3b0764' : '#3f1010'
                  } 0%, #050101 85%)`,
                }}
              >
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_40%,rgba(239,68,68,0.25)_0%,transparent_60%)]" />
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent border-t border-red-900/30" />
              </div>

              {/* Flashlight Beam Halo Overlay */}
              {!isNightVisionOn && isHoveringScene && (
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-75"
                  style={{
                    background: `radial-gradient(circle 160px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.45) 60%, rgba(0, 0, 0, 0.94) 100%)`,
                  }}
                />
              )}

              {/* UV Blacklight Glow Mode */}
              {isUvMode && (
                <div className="absolute inset-0 pointer-events-none bg-purple-900/25 mix-blend-color-dodge" />
              )}

              {/* Radar Evidence Hotspots */}
              {activeScene.hotspots.map((hotspot) => {
                const isDiscovered = hotspot.linkedClueId && discoveredClueIds.includes(hotspot.linkedClueId);
                const isUnderBeam = isHotspotUnderBeam(hotspot.xPercent, hotspot.yPercent);
                const isVisible = isDiscovered || isUnderBeam;

                return (
                  <div
                    key={hotspot.id}
                    onClick={() => handleHotspotClick(hotspot)}
                    style={{
                      left: `${hotspot.xPercent}%`,
                      top: `${hotspot.yPercent}%`,
                      transform: 'translate(-50%, -50%)',
                      opacity: isVisible ? 1 : 0.08,
                    }}
                    className="absolute z-20 cursor-pointer group/hotspot transition-all duration-300"
                  >
                    {isDiscovered ? (
                      /* Discovered Clue Tag */
                      <div className="flex flex-col items-center">
                        <div className="bg-red-600 text-white font-mono text-[10px] font-black px-2 py-0.5 rounded shadow-lg flex items-center gap-1 border border-black animate-in zoom-in-75">
                          <Tag className="w-3 h-3 text-white" />
                          <span>LOGGED</span>
                        </div>
                        <div className="w-8 h-8 mt-1 rounded-full bg-red-900 text-white flex items-center justify-center font-bold shadow-lg border-2 border-red-500 group-hover/hotspot:scale-115 transition-transform">
                          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      </div>
                    ) : (
                      /* Hidden Hotspot Revealed by Beam */
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-11 h-11 rounded-full border-2 flex items-center justify-center shadow-2xl group-hover/hotspot:scale-115 transition-transform duration-200 ${
                            isUvMode
                              ? 'bg-purple-950/90 border-purple-400 text-purple-200'
                              : 'bg-red-950/90 border-red-500 text-red-200'
                          }`}
                        >
                          {renderHotspotIcon(hotspot.iconType)}
                        </div>
                        <span className="mt-1 font-mono text-[10px] font-bold text-red-200 bg-black/90 px-2 py-0.5 rounded border border-red-800 shadow-md whitespace-nowrap">
                          🔎 EXAMINE
                        </span>
                      </div>
                    )}

                    {/* Tooltip Card on Hover */}
                    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-52 bg-black border border-red-500/80 p-3 rounded-xl text-left pointer-events-none opacity-0 group-hover/hotspot:opacity-100 transition-opacity duration-200 shadow-2xl z-30">
                      <span className="text-[10px] font-mono text-red-400 font-bold uppercase block mb-0.5">
                        {isDiscovered ? 'EVIDENCE CATALOG' : 'SUSPICIOUS TRACE'}
                      </span>
                      <h4 className="text-xs font-sans font-bold text-white leading-tight">
                        {hotspot.title}
                      </h4>
                      <p className="text-[11px] font-sans text-red-300/80 mt-1 leading-snug">
                        {hotspot.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Game HUD Overlay */}
          <div className="absolute bottom-4 left-4 z-20 text-[11px] font-mono text-red-400/90 bg-black/85 px-3.5 py-1.5 rounded-xl border border-red-900/60 backdrop-blur-md flex items-center gap-2 pointer-events-none shadow-lg">
            <Flashlight className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>
              {viewMode === '3D'
                ? '3D 360° ROOM ACTIVE // DRAG TO LOOK // PROXIMITY HEARTBEATS LIVE'
                : '2D TACTICAL SCAN ACTIVE // MOVE FLASHLIGHT TO REVEAL TRACES'}
            </span>
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
        onProceedToInterrogation={() => {
          setIsInventoryOpen(false);
          setIsInterrogationOpen(true);
        }}
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
          onProceedToDeduction={() => {
            setIsInterrogationOpen(false);
            setIsDeductionOpen(true);
          }}
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
