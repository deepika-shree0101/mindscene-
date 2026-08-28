import React, { useState, useEffect, useRef } from 'react';
import type { CaseData, CrimeScene, Clue, Hotspot } from '../types';
import { sound } from '../utils/soundEngine';
import { ClueInspectModal } from './ClueInspectModal';
import { EvidenceInventory } from './EvidenceInventory';
import { AiPartnerHUD } from './AiPartnerHUD';
import { DeductionModal } from './DeductionModal';
import { 
  Flashlight, Folder, BrainCircuit, ArrowLeft, 
  Search, Key, FileText, FlaskConical, Camera, 
  Sparkles, CheckCircle2, Clock, Eye, EyeOff, Tag, ListChecks, MapPin
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
  const [isDeductionOpen, setIsDeductionOpen] = useState<boolean>(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [isNightVisionOn, setIsNightVisionOn] = useState<boolean>(false);

  // Flashlight cursor tracking (percentages 0-100)
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isHoveringScene, setIsHoveringScene] = useState<boolean>(false);
  const sceneRef = useRef<HTMLDivElement>(null);

  const activeScene: CrimeScene = caseData.scenes[activeSceneIndex] || caseData.scenes[0];

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setMousePos({ x, y });
  };

  const handleHotspotClick = async (hotspot: Hotspot) => {
    sound.playScannerHum();

    if (!inspectedHotspotIds.includes(hotspot.id)) {
      setInspectedHotspotIds((prev) => [...prev, hotspot.id]);
    }

    if (hotspot.linkedClueId) {
      const clue = caseData.clues.find((c) => c.id === hotspot.linkedClueId);
      if (clue) {
        if (!discoveredClueIds.includes(clue.id)) {
          sound.playClueDiscovered();
          setDiscoveredClueIds((prev) => [...prev, clue.id]);
          setScanMessage(`EVIDENCE COLLECTED: "${clue.title}"`);
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

  const getHotspotIcon = (iconType: string) => {
    switch (iconType) {
      case 'file': return <FileText className="w-5 h-5 text-amber-300" />;
      case 'key': return <Key className="w-5 h-5 text-amber-300" />;
      case 'flask-conical': return <FlaskConical className="w-5 h-5 text-cyan-300" />;
      case 'camera': return <Camera className="w-5 h-5 text-amber-300" />;
      default: return <Search className="w-5 h-5 text-amber-300" />;
    }
  };

  const discoveredClues = caseData.clues.filter((c) => discoveredClueIds.includes(c.id));

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Check if hotspot is under flashlight beam radius (approx 16% distance in coordinate space)
  const isHotspotUnderBeam = (hx: number, hy: number) => {
    if (isNightVisionOn) return true;
    const dx = mousePos.x - hx;
    const dy = (mousePos.y - hy) * 1.2; // slight vertical perspective adjustment
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < 17;
  };

  // Get index of clue in discovered list to assign realistic evidence tag number (#01, #02)
  const getEvidenceTagNumber = (clueId?: string) => {
    if (!clueId) return '??';
    const idx = caseData.clues.findIndex((c) => c.id === clueId);
    return idx >= 0 ? `#0${idx + 1}` : '#??';
  };

  return (
    <div className="relative min-h-screen flex flex-col z-10 select-none bg-[#090c12] text-slate-100">
      
      {/* Top Noir Forensic Header */}
      <header className="sticky top-0 z-30 bg-[#0f1420]/95 border-b border-amber-500/30 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xl backdrop-blur-md">
        
        {/* Left: Case Info & Back Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playKeyClick();
              onReturnToDashboard();
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-mono text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>CASE FILES</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-bold text-sm text-white tracking-wide">
                {caseData.caseNumber}
              </span>
              <span className="text-xs font-semibold text-slate-200 hidden sm:inline">
                • {caseData.title}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-300">{activeScene.name}</span>
              <span>•</span>
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-300 font-bold">{formatTimer(timeSpentSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Center: Room Switcher */}
        <div className="flex items-center gap-1 bg-[#0b0e14] p-1 rounded-xl border border-slate-800">
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
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
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
          {/* Ambient Lighting Toggle Switch */}
          <button
            onClick={() => {
              sound.playKeyClick();
              setIsNightVisionOn(!isNightVisionOn);
            }}
            title={isNightVisionOn ? 'Turn on Forensic Spotlight' : 'Turn on Room Ambient Light'}
            className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              isNightVisionOn
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 font-bold'
                : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            {isNightVisionOn ? <Eye className="w-4 h-4 text-cyan-400" /> : <EyeOff className="w-4 h-4 text-amber-400" />}
            <span className="hidden md:inline">{isNightVisionOn ? 'ROOM LIGHTS ON' : 'SPOTLIGHT MODE'}</span>
          </button>

          {/* Evidence Dossier Button */}
          <button
            onClick={() => {
              sound.playKeyClick();
              setIsInventoryOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-amber-300 font-mono text-xs font-bold transition-colors cursor-pointer"
          >
            <Folder className="w-4 h-4 text-amber-400" />
            <span>EVIDENCE ({discoveredClues.length}/{caseData.clues.length})</span>
          </button>

          {/* Final Deduction Button */}
          <button
            onClick={() => {
              sound.playKeyClick();
              setIsDeductionOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-orbitron font-bold text-xs tracking-wider shadow-lg hover:shadow-red-500/25 transition-all cursor-pointer"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>SOLVE CASE 🔎</span>
          </button>
        </div>
      </header>

      {/* Investigation Progress Checklist Bar */}
      <div className="bg-[#0b0e17] border-b border-slate-800 px-6 py-2 flex flex-wrap items-center justify-between text-xs font-sans">
        <div className="flex items-center gap-6 text-slate-300">
          <div className="flex items-center gap-2 font-medium">
            <ListChecks className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold text-slate-100">OBJECTIVES:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
              discoveredClues.length > 0 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>
              {discoveredClues.length > 0 ? '✓' : '1'}
            </span>
            <span className={discoveredClues.length >= caseData.clues.length ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
              Scan rooms for hidden clues ({discoveredClues.length}/{caseData.clues.length} Collected)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
              discoveredClues.length >= 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>
              {discoveredClues.length >= 2 ? '✓' : '2'}
            </span>
            <span className="text-slate-300">
              Consult SPECTER AI on suspects & motives
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-amber-400 font-mono text-[11px]">
          <Flashlight className="w-3.5 h-3.5 animate-pulse" />
          <span>Move mouse to shine forensic light on hidden objects</span>
        </div>
      </div>

      {/* Toast Notification for Clue Discovered */}
      {scanMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-mono border-2 border-slate-950 animate-bounce">
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>{scanMessage}</span>
        </div>
      )}

      {/* Main Interactive Crime Scene Canvas */}
      <main className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
        
        <div
          ref={sceneRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHoveringScene(true)}
          onMouseLeave={() => setIsHoveringScene(false)}
          className="relative w-full max-w-5xl h-[64vh] sm:h-[70vh] rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl cursor-crosshair group select-none"
          style={{
            background: activeScene.visualTheme === 'manor-study'
              ? 'radial-gradient(circle at 50% 50%, #171c2a 0%, #0d111a 50%, #05070a 100%)'
              : activeScene.visualTheme === 'rainy-balcony'
              ? 'radial-gradient(circle at 40% 60%, #0d2137 0%, #09131e 50%, #03060a 100%)'
              : 'radial-gradient(circle at 50% 50%, #131d27 0%, #09121a 50%, #03060a 100%)',
          }}
        >
          {/* Darkness Shadow Mask with Flashlight Beam Cutout */}
          {!isNightVisionOn && (
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-200"
              style={{
                background: isHoveringScene
                  ? `radial-gradient(circle 210px at ${mousePos.x}% ${mousePos.y}%, rgba(245, 158, 11, 0.08) 0%, rgba(9, 12, 18, 0.75) 55%, rgba(5, 7, 10, 0.98) 100%)`
                  : 'rgba(5, 7, 10, 0.95)',
              }}
            />
          )}

          {/* Flashlight Beam Halo */}
          {!isNightVisionOn && isHoveringScene && (
            <div
              className="absolute w-12 h-12 rounded-full border-2 border-amber-400/40 pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
              style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
            >
              <div className="absolute inset-0 rounded-full border border-amber-300 animate-ping opacity-30" />
            </div>
          )}

          {/* Room Title Plate */}
          <div className="absolute top-6 left-6 z-20 pointer-events-none text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0b0e14]/90 border border-slate-700 text-amber-400 font-mono text-xs font-bold mb-1 shadow-lg">
              <MapPin className="w-3.5 h-3.5" />
              <span>{activeScene.name.toUpperCase()}</span>
            </div>
            <p className="text-xs text-slate-300 font-sans max-w-md bg-black/60 p-2 rounded-lg border border-slate-800/80 backdrop-blur-sm">
              {activeScene.description}
            </p>
          </div>

          {/* Radar Hotspots (Hidden until Flashlight reaches coordinates, or permanently pinned once Discovered) */}
          {activeScene.hotspots.map((hotspot) => {
            const isDiscovered = hotspot.linkedClueId && discoveredClueIds.includes(hotspot.linkedClueId);
            const isUnderBeam = isHotspotUnderBeam(hotspot.xPercent, hotspot.yPercent);
            const tagNumber = getEvidenceTagNumber(hotspot.linkedClueId);

            // Visibility Rule:
            // - If discovered: ALWAYS VISIBLE (with permanent yellow evidence marker tag)
            // - If not discovered: ONLY VISIBLE WHEN UNDER FLASHLIGHT BEAM
            const isVisible = isDiscovered || isUnderBeam;

            return (
              <div
                key={hotspot.id}
                style={{
                  left: `${hotspot.xPercent}%`,
                  top: `${hotspot.yPercent}%`,
                  opacity: isVisible ? 1 : 0,
                  pointerEvents: isVisible ? 'auto' : 'none',
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => handleHotspotClick(hotspot)}
                className="absolute z-20 cursor-pointer group/hotspot transition-opacity duration-300"
              >
                {isDiscovered ? (
                  /* PERMANENT LOGGED EVIDENCE TAG */
                  <div className="flex flex-col items-center">
                    <div className="bg-amber-400 text-slate-950 font-mono text-[10px] font-black px-2 py-0.5 rounded shadow-lg flex items-center gap-1 border border-slate-950 animate-in zoom-in-75">
                      <Tag className="w-3 h-3 text-slate-950" />
                      <span>{tagNumber} LOGGED</span>
                    </div>
                    <div className="w-9 h-9 mt-1 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-lg border-2 border-slate-950 group-hover/hotspot:scale-110 transition-transform">
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  </div>
                ) : (
                  /* HIDDEN HOTSPOT (REVEALED BY FLASHLIGHT) */
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-amber-950/90 border-2 border-amber-400 text-amber-300 flex items-center justify-center radar-marker shadow-2xl group-hover/hotspot:scale-115 transition-transform duration-200">
                      {getHotspotIcon(hotspot.iconType)}
                    </div>
                    <span className="mt-1 font-mono text-[10px] font-bold text-amber-300 bg-black/80 px-2 py-0.5 rounded border border-amber-500/60 shadow-md whitespace-nowrap">
                      🔎 CLICK TO EXAMINE
                    </span>
                  </div>
                )}

                {/* Tooltip Card on Hover */}
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-52 bg-[#0d121c] border border-amber-400/80 p-3 rounded-xl text-left pointer-events-none opacity-0 group-hover/hotspot:opacity-100 transition-opacity duration-200 shadow-2xl z-30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                      {isDiscovered ? 'EVIDENCE CATALOG' : 'SUSPICIOUS TRACE'}
                    </span>
                  </div>
                  <h4 className="text-xs font-sans font-bold text-white leading-tight">
                    {hotspot.title}
                  </h4>
                  <p className="text-[11px] font-sans text-slate-300 mt-1 leading-snug">
                    {hotspot.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Bottom Hint Banner */}
          <div className="absolute bottom-4 left-6 z-20 text-[11px] font-sans text-slate-300 bg-black/70 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur-sm flex items-center gap-2 pointer-events-none">
            <Flashlight className="w-3.5 h-3.5 text-amber-400" />
            <span>Search dark corners with your mouse. Clues stay tagged once discovered.</span>
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
