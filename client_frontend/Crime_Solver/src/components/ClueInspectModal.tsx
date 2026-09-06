import React, { useEffect } from 'react';
import type { Clue } from '../types';
import { sound } from '../utils/soundEngine';
import { ThreeEvidenceViewer } from './ThreeEvidenceViewer';
import { X, Search, FileText, Camera, Key, FlaskConical, ShieldCheck, Check, Tag } from 'lucide-react';

interface ClueInspectModalProps {
  clue: Clue;
  onClose: () => void;
}

export const ClueInspectModal: React.FC<ClueInspectModalProps> = ({ clue, onClose }) => {
  useEffect(() => {
    // Speak forensic report on inspection
    sound.speak(`Evidence logged: ${clue.title}. ${clue.forensicAnalysis}`, 'narrator');

    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [clue]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT': return <FileText className="w-6 h-6 text-red-400" />;
      case 'PHOTO': return <Camera className="w-6 h-6 text-red-400" />;
      case 'OBJECT': return <Key className="w-6 h-6 text-red-400" />;
      case 'FORENSIC': return <FlaskConical className="w-6 h-6 text-rose-400" />;
      default: return <Search className="w-6 h-6 text-red-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none">
      
      {/* Outer Modal Frame */}
      <div className="relative w-full max-w-lg bg-[#070101] border-2 border-red-700/80 rounded-3xl shadow-[0_0_80px_rgba(220,38,38,0.4)] p-5 sm:p-7 text-left text-slate-100 font-sans max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playKeyClick();
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-black border border-red-900/80 hover:border-red-500 text-red-400 hover:text-white transition-colors cursor-pointer z-20 shadow-md"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Evidence Tag Header */}
        <div className="flex items-center gap-3 border-b border-red-900/60 pb-4 mb-4">
          <div className="p-3 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-400 shadow-md">
            {getIcon(clue.type)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded bg-red-700 text-white flex items-center gap-1 shadow-md">
                <Tag className="w-3 h-3 text-white" />
                CLASSIFIED EVIDENCE
              </span>
              <span className="text-[10px] font-mono text-red-400/80">
                CATEGORY: {clue.type}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-creepster font-bold text-white mt-1">
              {clue.title}
            </h2>
          </div>
        </div>

        {/* 3D Rotatable Evidence Viewer */}
        <div className="mb-4">
          <ThreeEvidenceViewer clue={clue} />
        </div>

        {/* Forensic Intelligence Cards */}
        <div className="space-y-3 font-sans text-xs">
          
          <div className="bg-black/90 p-3 rounded-2xl border border-red-900/60 shadow-md">
            <span className="text-red-400 font-mono font-bold block mb-0.5 uppercase tracking-wider text-[10px]">
              SECTOR DISCOVERED:
            </span>
            <span className="text-slate-100 font-medium text-xs sm:text-sm">{clue.locationFound}</span>
          </div>

          <div className="bg-red-950/30 p-3.5 rounded-2xl border border-red-700/60 shadow-md">
            <span className="text-red-300 font-mono flex items-center gap-1.5 font-bold mb-1.5 uppercase tracking-wider text-xs">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              FORENSIC LAB ANALYSIS:
            </span>
            <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed font-sans pl-1">
              {clue.forensicAnalysis}
            </p>
          </div>

          {clue.description && (
            <div className="bg-black/80 p-3 rounded-2xl border border-red-950 font-mono text-[11px] text-red-300/80">
              <span className="text-red-500/70 font-bold block mb-1">FIELD NOTES:</span>
              <p>{clue.description}</p>
            </div>
          )}

        </div>

        {/* Store Action Button */}
        <button
          onClick={() => {
            sound.playKeyClick();
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            onClose();
          }}
          className="w-full mt-5 py-3 rounded-2xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-creepster font-bold text-xs sm:text-sm tracking-wider transition-all shadow-[0_0_25px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>STORE IN EVIDENCE DOSSIER</span>
        </button>

      </div>
    </div>
  );
};
