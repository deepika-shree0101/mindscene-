import React, { useEffect, useState } from 'react';
import type { CaseData } from '../types';
import { sound } from '../utils/soundEngine';
import { 
  UserCheck, ArrowRight, X, Clock, MapPin, 
  AlertTriangle, Users, ShieldAlert, Video, Volume2, VolumeX, Radio,
  ListOrdered, ChevronLeft, ChevronRight, Globe, Search, DoorOpen, Box, MessageSquare, Scale
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
  const [activeStep, setActiveStep] = useState<number>(1);

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

        {/* Step-by-Step Investigation Roadmap (Interactive Game Briefing Wizard) */}
        {(() => {
          const ROADMAP_STEPS = [
            {
              step: 1,
              badge: "STEP 1 // RECONNAISSANCE",
              title: "Intelligence Briefing & Victim Profile",
              icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
              tagline: "Before deploying, analyze the case file and crime scene intelligence.",
              instructions: [
                "Study the autopsy report: cause of death, time of incident, and location.",
                "Review each suspect's documented motive, alibi, and relationship to the victim.",
                "Formulate your preliminary working hypothesis before stepping into the field."
              ],
              proTip: "Knowing the victim's timeline helps identify false alibis during interrogation."
            },
            {
              step: 2,
              badge: "STEP 2 // SPATIAL SEARCH",
              title: "Crime Scene Exploration (2D Scan & 3D Room)",
              icon: <Globe className="w-5 h-5 text-cyan-400" />,
              tagline: "Canvas the crime scene using advanced optical and spectrum sensors.",
              instructions: [
                "Switch seamlessly between 360° Spherical 3D Room and 2.5D Tactical Flashlight beam.",
                "Move your cursor or finger to illuminate dark corners—hidden evidence only appears under direct beam.",
                "Toggle UV Forensic Blacklight to expose hidden blood splatters, chemical residues, and biological markings."
              ],
              proTip: "Listen closely—accelerating biometric heartbeats guide you when near hidden clues."
            },
            {
              step: 3,
              badge: "STEP 3 // ACQUISITION",
              title: "Evidence Discovery & Collection",
              icon: <Search className="w-5 h-5 text-amber-400" />,
              tagline: "Secure physical and digital artifacts without contaminating the crime scene.",
              instructions: [
                "Click directly on glowing beacons or illuminated objects to secure them.",
                "Evidence is automatically logged with forensic timestamps and secured in your Vault.",
                "Each secured clue unlocks critical context and cross-examination leverage."
              ],
              proTip: "Every clue in the room must be collected before the next room unlocks."
            },
            {
              step: 4,
              badge: "STEP 4 // SEQUENTIAL ACCESS",
              title: "Room Clearance & Advance to Next Chamber",
              icon: <DoorOpen className="w-5 h-5 text-emerald-400" />,
              tagline: "Canvas all interconnected crime scene chambers sequentially.",
              instructions: [
                "When all evidence in a room is collected, a 'ROOM CLEARED' confirmation flashes.",
                "The next room tab unlocks on the top header (e.g. Study → Balcony → Vault).",
                "Advance through all crime scene locations to uncover the full murder sequence."
              ],
              proTip: "Preceding rooms remain accessible if you need to re-examine spatial details."
            },
            {
              step: 5,
              badge: "STEP 5 // LABORATORY",
              title: "Inspect Evidence in 3D Vault",
              icon: <Box className="w-5 h-5 text-purple-400" />,
              tagline: "Perform deep laboratory examination of secured physical evidence.",
              instructions: [
                "Click VAULT on the top ribbon to view all collected case artifacts.",
                "Select '3D EXAMINE' on any item to launch the interactive 3D WebGL inspection laboratory.",
                "Rotate items 360°, zoom into engravings, and toggle UV scans to find hidden serial numbers or serial toxins."
              ],
              proTip: "Physical markings on weapons often directly link to specific suspect possessions."
            },
            {
              step: 6,
              badge: "STEP 6 // PSYCHOLOGICAL GRILL",
              title: "Adaptive Suspect Interrogation",
              icon: <MessageSquare className="w-5 h-5 text-red-400" />,
              tagline: "Confront persons of interest in the high-security interrogation chamber.",
              instructions: [
                "Ask questions in natural everyday English—no rigid multiple choice required.",
                "Watch the suspect's Deception & Stress Meter escalate in real time as contradictions are exposed.",
                "Listen to suspects speak aloud via synthesized audio; push their stress past 85% to break them."
              ],
              proTip: "Cite specific evidence found in the rooms to shatter false alibis."
            },
            {
              step: 7,
              badge: "STEP 7 // TRIBUNAL",
              title: "Deduction Tribunal & Case Verdict",
              icon: <Scale className="w-5 h-5 text-yellow-400" />,
              tagline: "Present formal charges and conclusive evidence before the C.I.B. Magistrate.",
              instructions: [
                "Click SOLVE CASE once all required evidence has been secured.",
                "Select the primary perpetrator, identify the murder weapon, and specify the true motive.",
                "Submit your indictment to receive the authoritative Case Solved or Unsolved verdict and career score."
              ],
              proTip: "Wrong accusations penalize your clearance score. Verify all proof before indicting!"
            }
          ];

          const current = ROADMAP_STEPS[activeStep - 1] || ROADMAP_STEPS[0];

          return (
            <div className="mb-6 relative z-20 bg-black/95 border-2 border-red-800/80 rounded-2xl p-4 sm:p-5 shadow-2xl">
              {/* Header with Title & Step Counter */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-900/60 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                    INVESTIGATION PROTOCOL: 7-STEP OPERATIONAL ROADMAP
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-red-950 border border-red-700 text-red-300">
                    STEP {activeStep} OF 7
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                    (Review steps sequentially)
                  </span>
                </div>
              </div>

              {/* Step Selector Pills / Progress Tabs */}
              <div className="grid grid-cols-7 gap-1.5 mb-4">
                {ROADMAP_STEPS.map((s) => {
                  const isActive = s.step === activeStep;
                  const isPassed = s.step < activeStep;
                  return (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => {
                        sound.playKeyClick();
                        setActiveStep(s.step);
                      }}
                      className={`py-1.5 px-1 rounded-xl text-center font-mono text-xs font-bold transition-all cursor-pointer border flex flex-col items-center justify-center gap-0.5 ${
                        isActive
                          ? 'bg-gradient-to-b from-red-700 to-red-900 border-red-400 text-white shadow-[0_0_15px_rgba(220,38,38,0.6)] scale-105 z-10'
                          : isPassed
                          ? 'bg-red-950/40 border-red-900/60 text-emerald-400 hover:bg-red-950/80'
                          : 'bg-black/60 border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                      }`}
                      title={s.title}
                    >
                      <span className="text-[10px]">
                        {isPassed ? '✓' : `0${s.step}`}
                      </span>
                      <span className="text-[9px] truncate max-w-full hidden md:inline">
                        {s.step === 1 ? 'Briefing' : s.step === 2 ? 'Explore' : s.step === 3 ? 'Collect' : s.step === 4 ? 'Rooms' : s.step === 5 ? 'Vault' : s.step === 6 ? 'Interrogate' : 'Solve'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Step Card Display (Single Step in Focus) */}
              <div className="bg-[#0f0303] border border-red-900/60 rounded-xl p-4 sm:p-5 shadow-inner transition-all animate-in fade-in duration-200">
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-600/80 flex items-center justify-center shrink-0 shadow-md">
                      {current.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest block">
                        {current.badge}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                        {current.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-red-200/90 font-sans italic mb-3">
                  "{current.tagline}"
                </p>

                {/* Instructions Bullet Points */}
                <div className="space-y-1.5 mb-3.5 text-xs font-sans">
                  {current.instructions.map((inst, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-200 bg-black/60 p-2 rounded-lg border border-red-950/80">
                      <span className="text-red-500 font-mono font-black text-xs shrink-0">▸</span>
                      <span className="leading-snug">{inst}</span>
                    </div>
                  ))}
                </div>

                {/* Pro-Tip Box */}
                <div className="bg-red-950/50 border border-red-800/60 p-2.5 rounded-lg flex items-center gap-2 text-[11px] font-mono text-red-300">
                  <span className="text-amber-400 font-bold shrink-0">💡 PRO TIP:</span>
                  <span>{current.proTip}</span>
                </div>
              </div>

              {/* Step Navigation Controls (Prev / Next) */}
              <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-red-900/60 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (activeStep > 1) {
                      sound.playKeyClick();
                      setActiveStep((prev) => prev - 1);
                    }
                  }}
                  disabled={activeStep === 1}
                  className={`px-4 py-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                    activeStep === 1
                      ? 'border-slate-900 text-slate-700 cursor-not-allowed bg-black/40'
                      : 'border-red-900/80 hover:border-red-500 text-red-300 hover:text-white bg-black cursor-pointer'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>PREVIOUS STEP</span>
                </button>

                {activeStep < 7 ? (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playKeyClick();
                      setActiveStep((prev) => prev + 1);
                    }}
                    className="px-5 py-2 rounded-xl bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 hover:text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-950"
                  >
                    <span>NEXT STEP</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStart}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse"
                  >
                    <span>READY: ENTER CRIME SCENE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })()}

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
