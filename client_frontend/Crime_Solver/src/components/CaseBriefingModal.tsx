import React, { useEffect, useState } from 'react';
import type { CaseData } from '../types';
import { sound } from '../utils/soundEngine';
import { 
  UserCheck, ArrowRight, X, Clock, MapPin, 
  AlertTriangle, Users, ShieldAlert, Video, Volume2, VolumeX, Radio,
  ListOrdered
} from 'lucide-react';

interface CaseBriefingModalProps {
  caseData: CaseData;
  onClose: () => void;
  onEnterInvestigation: () => void;
}

export const CaseBriefingModal: React.FC<CaseBriefingModalProps> = ({
  caseData,
  onClose,
  onEnterInvestigation,
}) => {
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<boolean>(false);

  // Auto-speak the briefing on modal open
  useEffect(() => {
    sound.playThunder();
    if (isVoiceActive) {
      sound.speak(
        `Incident Briefing: ${caseData.title}. Location: ${caseData.location}. Victim: ${caseData.victimName}. ${caseData.briefingText}`,
        'narrator'
      );
    }

    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [caseData, isVoiceActive]);

  const handleStart = () => {
    sound.playAccessGranted();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    onEnterInvestigation();
  };

  // High-availability public domain atmospheric video streams
  const videoSource = caseData.thumbnailTheme === 'manor'
    ? "https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-a-window-at-night-42283-large.mp4"
    : "https://assets.mixkit.co/videos/preview/mixkit-fog-over-the-forest-at-night-41584-large.mp4";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto select-none animate-in fade-in duration-200">
      
      {/* Outer Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#080202] border-2 border-red-700/80 rounded-3xl shadow-[0_0_80px_rgba(220,38,38,0.35)] p-5 sm:p-8 my-6 text-left max-h-[92vh] overflow-y-auto text-slate-100 font-sans">
        
        {/* CRT Scanline and Vignette */}
        <div className="absolute inset-0 scanlines pointer-events-none opacity-30 rounded-3xl" />
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(185,28,28,0.2)] pointer-events-none rounded-3xl" />

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playKeyClick();
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            onClose();
          }}
          className="absolute top-5 right-5 p-2.5 rounded-xl bg-black border border-red-900/80 hover:border-red-500 text-red-400 hover:text-white transition-colors cursor-pointer z-30 shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Stamp */}
        <div className="flex flex-wrap items-center gap-3 border-b border-red-900/60 pb-4 mb-5 relative z-20">
          <div className="px-3 py-1 rounded-lg bg-red-700 text-white font-mono text-xs font-black tracking-wider flex items-center gap-1.5 shadow-md shadow-red-950">
            <ShieldAlert className="w-4 h-4 text-white" />
            <span>{caseData.caseNumber} // CLASSIFIED MURDER DOSSIER</span>
          </div>
          <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-widest flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            LIVE FORENSIC BRIEFING
          </span>
        </div>

        {/* Title & Tagline */}
        <div className="relative z-20 mb-5">
          <h1 className="text-2xl sm:text-4xl font-creepster font-extrabold text-white tracking-wider text-glow-red">
            {caseData.title}
          </h1>
          <p className="text-xs sm:text-sm font-sans text-red-300/80 italic mt-1">
            "{caseData.subtitle}"
          </p>
        </div>

        {/* Top Intelligence Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 font-sans text-xs relative z-20">
          <div className="bg-black/80 p-3.5 rounded-2xl border border-red-900/60 shadow-md">
            <div className="text-red-400 font-mono font-bold flex items-center gap-1.5 mb-1 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>INCIDENT LOCATION</span>
            </div>
            <span className="text-slate-100 font-bold text-sm">{caseData.location}</span>
          </div>

          <div className="bg-black/80 p-3.5 rounded-2xl border border-red-900/60 shadow-md">
            <div className="text-red-400 font-mono font-bold flex items-center gap-1.5 mb-1 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-red-500" />
              <span>TIME OF INCIDENT</span>
            </div>
            <span className="text-slate-100 font-bold text-sm">{caseData.timeOfCrime}</span>
          </div>

          <div className="bg-black/80 p-3.5 rounded-2xl border border-red-900/60 shadow-md">
            <div className="text-red-400 font-mono font-bold flex items-center gap-1.5 mb-1 text-[11px]">
              <UserCheck className="w-3.5 h-3.5 text-red-500" />
              <span>PRIMARY VICTIM</span>
            </div>
            <span className="text-slate-100 font-bold text-sm">{caseData.victimName} ({caseData.victimStatus})</span>
          </div>
        </div>

        {/* Cinematic Crime Scene Video Player */}
        <div className="bg-black border-2 border-red-600/60 rounded-2xl mb-6 relative shadow-[0_0_40px_rgba(220,38,38,0.25)] overflow-hidden flex flex-col z-20">
          
          <div className="relative h-56 sm:h-64 w-full bg-[#0d0202] overflow-hidden flex items-center justify-center">
            
            {/* Live Camera REC HUD Overlay */}
            <div className="absolute top-3 left-4 z-20 flex items-center gap-2 font-mono text-xs font-bold text-red-400 bg-black/70 px-2.5 py-1 rounded-md border border-red-900/60">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span>REC // CRIME SCENE SURVEILLANCE</span>
            </div>

            <div className="absolute top-3 right-4 z-20 font-mono text-[11px] text-red-400 bg-black/70 px-2.5 py-1 rounded-md border border-red-900/60">
              CAM-04 // 23:45:12 EST
            </div>

            {/* Actual Looping Video */}
            {!videoError ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                onError={() => setVideoError(true)}
                className="w-full h-full object-cover opacity-80 mix-blend-screen filter contrast-125 brightness-90 saturate-150"
                src={videoSource}
              />
            ) : (
              /* Fallback animated visual */
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/${caseData.id}/900/500?grayscale`}
                  alt="Crime Scene Visual"
                  className="w-full h-full object-cover opacity-70 filter contrast-150 brightness-75 sepia hue-rotate-[-50deg] saturate-200 animate-pulse"
                  style={{ animationDuration: '6s' }}
                />
                <div className="absolute inset-0 bg-red-950/20 mix-blend-color" />
              </div>
            )}

            {/* Bottom Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
            
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-2 text-xs font-mono text-red-300 font-bold">
                <Video className="w-4 h-4 text-red-400 animate-pulse" />
                <span>ACTIVE SCENE RECONSTRUCTION</span>
              </div>
              
              <button
                onClick={() => {
                  const next = !isVoiceActive;
                  setIsVoiceActive(next);
                  if (!next && window.speechSynthesis) window.speechSynthesis.cancel();
                }}
                className="px-2.5 py-1 rounded-lg bg-red-950/80 border border-red-600 text-red-200 text-xs font-mono flex items-center gap-1.5 hover:bg-red-900 cursor-pointer"
              >
                {isVoiceActive ? <Volume2 className="w-3.5 h-3.5 text-red-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{isVoiceActive ? 'VOICE NARRATION LIVE' : 'VOICE MUTED'}</span>
              </button>
            </div>

          </div>

          {/* Audio Dispatch Description Transcript */}
          <div className="p-4 bg-[#0a0202] border-t border-red-900/60 font-sans text-xs sm:text-sm text-red-100/90 leading-relaxed">
            <div className="flex items-center gap-2 font-mono text-[11px] text-red-400 font-bold mb-1">
              <Radio className="w-3.5 h-3.5 text-red-500" />
              <span>DISPATCH RECORDING TRANSCRIPT:</span>
            </div>
            <p className="pl-5 border-l-2 border-red-700/60 font-mono text-xs sm:text-sm text-red-200/90">
              {caseData.briefingText}
            </p>
          </div>

        </div>

        {/* 7-Step Detective Protocol & Guidelines */}
        <div className="mb-6 relative z-20 bg-black/90 border border-red-800/80 rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-red-900/60 pb-2.5 mb-3.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
              <ListOrdered className="w-4 h-4 text-red-500" />
              <span>INVESTIGATION PROTOCOL: 7-STEP OPERATIONAL ROADMAP</span>
            </div>
            <span className="text-[10px] font-mono bg-red-950/80 border border-red-700/60 text-red-300 px-2 py-0.5 rounded">
              STANDARD C.I.B. PROCEDURE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs font-sans">
            <div className="bg-[#120404] border border-red-900/40 p-3 rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-red-700 text-white font-mono font-black text-xs flex items-center justify-center shrink-0">1</span>
              <div>
                <h4 className="font-bold text-white text-[12px]">Intelligence Briefing</h4>
                <p className="text-[11px] text-red-200/80 mt-0.5 leading-snug">
                  Absorb victim records, incident timeline, and suspect motives before entering the scene.
                </p>
              </div>
            </div>

            <div className="bg-[#120404] border border-red-900/40 p-3 rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-red-700 text-white font-mono font-black text-xs flex items-center justify-center shrink-0">2</span>
              <div>
                <h4 className="font-bold text-white text-[12px]">Scene Exploration (2D / 3D)</h4>
                <p className="text-[11px] text-red-200/80 mt-0.5 leading-snug">
                  Toggle between 360° 3D room and 2.5D tactical beam. Toggle UV Blacklight for hidden traces.
                </p>
              </div>
            </div>

            <div className="bg-[#120404] border border-red-900/40 p-3 rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-red-700 text-white font-mono font-black text-xs flex items-center justify-center shrink-0">3</span>
              <div>
                <h4 className="font-bold text-white text-[12px]">Collect & Secure Room</h4>
                <p className="text-[11px] text-red-200/80 mt-0.5 leading-snug">
                  Click hotspots to secure clues safely into your Vault. Heartbeats guide you near traces.
                </p>
              </div>
            </div>

            <div className="bg-[#120404] border border-red-900/40 p-3 rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-red-700 text-white font-mono font-black text-xs flex items-center justify-center shrink-0">4</span>
              <div>
                <h4 className="font-bold text-white text-[12px]">Room Cleared → Next Scene</h4>
                <p className="text-[11px] text-red-200/80 mt-0.5 leading-snug">
                  Look for "Room Cleared" alert, then use the top room switcher to canvas other crime scenes.
                </p>
              </div>
            </div>

            <div className="bg-[#120404] border border-red-900/40 p-3 rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-red-700 text-white font-mono font-black text-xs flex items-center justify-center shrink-0">5</span>
              <div>
                <h4 className="font-bold text-white text-[12px]">Inspect Clues in 3D Vault</h4>
                <p className="text-[11px] text-red-200/80 mt-0.5 leading-snug">
                  Open Evidence Vault to inspect 3D objects with full zoom/rotation without WebGL conflicts.
                </p>
              </div>
            </div>

            <div className="bg-[#120404] border border-red-900/40 p-3 rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-red-700 text-white font-mono font-black text-xs flex items-center justify-center shrink-0">6</span>
              <div>
                <h4 className="font-bold text-white text-[12px]">AI Suspect Interrogation</h4>
                <p className="text-[11px] text-red-200/80 mt-0.5 leading-snug">
                  Grill suspects, present collected physical evidence, and watch their deception stress meters spike.
                </p>
              </div>
            </div>

            <div className="bg-[#120404] border border-red-700/60 p-3 rounded-xl flex items-start gap-2.5 sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-red-950/60 to-black">
              <span className="w-6 h-6 rounded-full bg-red-600 text-white font-mono font-black text-xs flex items-center justify-center shrink-0">7</span>
              <div>
                <h4 className="font-bold text-red-300 text-[12px]">
                  Case Deduction & Verdict (Success or Failure)
                </h4>
                <p className="text-[11px] text-red-200/90 mt-0.5 leading-snug">
                  Click <strong>SOLVE CASE</strong>, select the culprit, formulate your motive conclusion, attach corroborating evidence, and receive the definitive Case Solved or Case Unsolved verdict!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Suspects Briefing Cards */}
        <div className="mb-6 relative z-20">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-3">
            <Users className="w-4 h-4 text-red-500" />
            <span>PERSONS OF INTEREST ({caseData.suspects.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {caseData.suspects.map((suspect) => (
              <div
                key={suspect.id}
                className="bg-black/90 border border-red-900/60 p-3.5 rounded-2xl hover:border-red-500/80 transition-all shadow-md group"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-full bg-red-950 border border-red-500 flex items-center justify-center text-red-300 font-mono text-xs font-bold group-hover:scale-110 transition-transform">
                    {suspect.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-sans font-bold text-white group-hover:text-red-400 transition-colors">
                      {suspect.name}
                    </h4>
                    <span className="text-[10px] font-mono text-red-400/80">{suspect.role}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-snug">
                  <strong className="text-red-400/80 font-mono text-[10px] uppercase">Motive:</strong> {suspect.motive || 'Secretive'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-red-900/60 relative z-20">
          <div className="flex items-center gap-2 text-xs font-mono text-red-300/80">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span>Shine your spotlight on dark corners to uncover physical evidence before making deductions.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                sound.playKeyClick();
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                onClose();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-red-900/60 hover:border-red-500 font-mono text-xs text-red-300 transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 font-creepster font-bold text-xs sm:text-sm tracking-wider text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              <span>ENTER CRIME SCENE</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
