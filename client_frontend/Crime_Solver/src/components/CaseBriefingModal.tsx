import React, { useState, useEffect } from 'react';
import type { CaseData } from '../types';
import { sound } from '../utils/soundEngine';
import { FileText, UserCheck, ArrowRight, X, Clock, MapPin, AlertTriangle, Users, ShieldAlert } from 'lucide-react';

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
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTypingDone, setIsTypingDone] = useState<boolean>(false);

  useEffect(() => {
    let index = 0;
    const fullText = caseData.briefingText;
    setDisplayedText('');
    setIsTypingDone(false);

    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        if (index % 5 === 0) {
          sound.playKeyClick();
        }
        index++;
      } else {
        setIsTypingDone(true);
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [caseData.briefingText]);

  const handleSkipTyping = () => {
    setDisplayedText(caseData.briefingText);
    setIsTypingDone(true);
  };

  const handleStart = () => {
    sound.playAccessGranted();
    onEnterInvestigation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0d121c] border-2 border-amber-500/50 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playKeyClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 pb-4 mb-5">
          <div className="px-3 py-1 rounded bg-amber-400 text-slate-950 font-mono text-xs font-black tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-950" />
            <span>{caseData.caseNumber} // INCIDENT DOSSIER</span>
          </div>
          <span className="text-xs font-mono text-amber-400 font-bold uppercase">
            FORENSIC CRIME BRIEFING
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-orbitron font-extrabold text-white mb-1.5">
          {caseData.title}
        </h1>
        <p className="text-xs sm:text-sm font-sans text-amber-200/90 italic mb-6">
          "{caseData.subtitle}"
        </p>

        {/* Top Intelligence Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 font-sans text-xs">
          <div className="bg-[#131926] p-3.5 rounded-xl border border-slate-800">
            <div className="text-amber-400 font-mono font-bold flex items-center gap-1.5 mb-1 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>INCIDENT LOCATION</span>
            </div>
            <span className="text-slate-100 font-bold text-sm">{caseData.location}</span>
          </div>

          <div className="bg-[#131926] p-3.5 rounded-xl border border-slate-800">
            <div className="text-cyan-400 font-mono font-bold flex items-center gap-1.5 mb-1 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>TIME OF CRIME</span>
            </div>
            <span className="text-slate-100 font-bold text-sm">{caseData.timeOfCrime}</span>
          </div>

          <div className="bg-[#131926] p-3.5 rounded-xl border border-slate-800">
            <div className="text-amber-400 font-mono font-bold flex items-center gap-1.5 mb-1 text-[11px]">
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>PRIMARY VICTIM</span>
            </div>
            <span className="text-slate-100 font-bold text-sm">{caseData.victimName} ({caseData.victimStatus})</span>
          </div>
        </div>

        {/* Typewriter Story Briefing Box */}
        <div className="bg-[#090c14] border-2 border-amber-500/30 p-5 rounded-2xl mb-6 relative shadow-inner">
          <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-bold mb-2">
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" />
              AUDIO DISPATCH RECORDING
            </span>
            {!isTypingDone && (
              <button
                onClick={handleSkipTyping}
                className="text-[11px] font-mono text-slate-400 hover:text-amber-300 underline cursor-pointer"
              >
                Skip Typing
              </button>
            )}
          </div>
          <p className="font-sans text-sm text-slate-100 leading-relaxed min-h-[70px] font-normal">
            {displayedText}
            {!isTypingDone && <span className="inline-block w-2 h-4 ml-1 bg-amber-400 animate-pulse" />}
          </p>
        </div>

        {/* Suspects Briefing Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-3">
            <Users className="w-4 h-4 text-amber-400" />
            <span>PERSONS OF INTEREST / SUSPECTS ({caseData.suspects.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {caseData.suspects.map((suspect) => (
              <div
                key={suspect.id}
                className="bg-[#131926] border border-slate-800 p-3.5 rounded-xl hover:border-amber-400/60 transition-colors shadow-md"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-full bg-amber-950/80 border border-amber-500 flex items-center justify-center text-amber-300 font-mono text-xs font-bold">
                    {suspect.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-sans font-bold text-white">{suspect.name}</h4>
                    <span className="text-[10px] font-mono text-amber-400">{suspect.role}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-snug">
                  <strong className="text-slate-400 font-mono text-[10px] uppercase">Motive:</strong> {suspect.motive}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs font-sans text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Scan dark rooms to find all clues before filing your accusation.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                sound.playKeyClick();
                onClose();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 font-mono text-xs text-slate-300 transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 font-orbitron font-bold text-xs tracking-wider text-slate-950 shadow-lg hover:shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
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
