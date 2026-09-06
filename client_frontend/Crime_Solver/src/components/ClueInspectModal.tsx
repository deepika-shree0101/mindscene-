import React, { useEffect, useState } from 'react';
import type { Clue } from '../types';
import { sound } from '../utils/soundEngine';
import { 
  X, FileText, Camera, Key, FlaskConical, ShieldCheck, Tag, 
  Volume2, Fingerprint, Sparkles, MapPin, Database, Search
} from 'lucide-react';

interface ClueInspectModalProps {
  clue: Clue;
  onClose: () => void;
}

export const ClueInspectModal: React.FC<ClueInspectModalProps> = ({ clue, onClose }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(true);

  useEffect(() => {
    // Speak forensic report on inspection
    sound.speak(`Evidence logged: ${clue.title}. ${clue.forensicAnalysis}`, 'narrator');

    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [clue]);

  const handleReplayVoice = () => {
    sound.playKeyClick();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    sound.speak(`${clue.title}. ${clue.forensicAnalysis}`, 'narrator');
    setIsPlayingAudio(true);
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT': return <FileText className="w-8 h-8 text-amber-400" />;
      case 'PHOTO': return <Camera className="w-8 h-8 text-blue-400" />;
      case 'OBJECT': return <Key className="w-8 h-8 text-red-400" />;
      case 'FORENSIC': return <FlaskConical className="w-8 h-8 text-emerald-400" />;
      default: return <Search className="w-8 h-8 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 select-none">
      
      {/* Outer Forensic Case Frame */}
      <div className="relative w-full max-w-lg bg-[#0a0202] border-2 border-red-700/90 rounded-3xl shadow-[0_0_80px_rgba(220,38,38,0.45)] p-5 sm:p-7 text-left text-slate-100 font-sans max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playKeyClick();
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-black border border-red-900/80 hover:border-red-500 text-red-400 hover:text-white transition-colors cursor-pointer z-20 shadow-md"
          title="Close Inspection"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Classified Header */}
        <div className="flex items-center gap-3 border-b border-red-900/60 pb-4 mb-4">
          <div className="p-3 rounded-2xl bg-red-950/80 border border-red-500/50 shadow-md">
            {getCategoryIcon(clue.type)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded bg-red-700 text-white flex items-center gap-1 shadow-md">
                <Tag className="w-3 h-3 text-white" />
                CLASSIFIED EVIDENCE
              </span>
              <span className="text-[10px] font-mono text-red-400/90">
                // {clue.type}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-creepster font-bold text-white mt-1 tracking-wide">
              {clue.title}
            </h2>
          </div>
        </div>

        {/* 2D Forensic Evidence Display Plate */}
        <div className="relative mb-5 p-5 rounded-2xl bg-[#140505] border border-red-900/70 overflow-hidden shadow-inner">
          {/* Subtle Background Scanlines */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.4)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
            {/* Visual Forensic Evidence Seal */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-black/90 border-2 border-red-600/80 flex flex-col items-center justify-center p-2 text-center shadow-lg relative group">
              <Fingerprint className="w-10 h-10 text-red-500 mb-1 animate-pulse" />
              <span className="text-[9px] font-mono text-red-300 font-bold tracking-widest">
                VERIFIED
              </span>
              <span className="text-[8px] font-mono text-red-500/80">
                TRACE #09
              </span>
            </div>

            {/* Evidence Intelligence Synopsis */}
            <div className="flex-1 text-left space-y-1.5">
              <div className="flex items-center gap-1.5 text-red-400 font-mono text-xs">
                <MapPin className="w-3.5 h-3.5" />
                <span className="font-bold text-white">LOCATED AT:</span>
                <span className="text-red-300">{clue.locationFound}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FORENSIC STATUS: LOGGED TO VAULT</span>
              </div>

              {/* Replay Voiceover Button */}
              <button
                onClick={handleReplayVoice}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black border border-red-900 hover:border-red-500 text-red-300 text-[11px] font-mono transition-colors cursor-pointer"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-green-400 animate-pulse' : 'text-red-400'}`} />
                <span>{isPlayingAudio ? 'PLAYING FORENSIC AUDIO' : 'REPLAY NARRATOR AUDIO'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Forensic Analysis Intelligence Dossier */}
        <div className="space-y-3 font-sans text-xs">
          
          <div className="bg-red-950/30 p-4 rounded-2xl border border-red-700/60 shadow-md">
            <span className="text-red-300 font-mono flex items-center gap-1.5 font-bold mb-2 uppercase tracking-wider text-xs">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              CIB FORENSIC LAB ANALYSIS:
            </span>
            <p className="text-xs sm:text-sm text-red-100/95 leading-relaxed font-sans pl-1">
              {clue.forensicAnalysis}
            </p>
          </div>

          {clue.description && (
            <div className="bg-black/90 p-3.5 rounded-2xl border border-red-950 font-mono text-[11px] text-red-300/90 leading-relaxed">
              <span className="text-red-500 font-bold block mb-1">FIELD NOTES:</span>
              <p>{clue.description}</p>
            </div>
          )}

        </div>

        {/* Store in Evidence Vault Action Button */}
        <button
          onClick={() => {
            sound.playKeyClick();
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            onClose();
          }}
          className="w-full mt-5 py-3.5 rounded-2xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-creepster font-bold text-sm tracking-wider transition-all shadow-[0_0_25px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
        >
          <Database className="w-4 h-4" />
          <span>CONFIRM & STORE IN EVIDENCE VAULT</span>
        </button>

      </div>
    </div>
  );
};
