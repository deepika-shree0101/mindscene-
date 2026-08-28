import React from 'react';
import type { Clue } from '../types';
import { sound } from '../utils/soundEngine';
import { X, Search, FileText, Camera, Key, FlaskConical, ShieldCheck, Check, Tag } from 'lucide-react';

interface ClueInspectModalProps {
  clue: Clue;
  onClose: () => void;
}

export const ClueInspectModal: React.FC<ClueInspectModalProps> = ({ clue, onClose }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT': return <FileText className="w-8 h-8 text-amber-400" />;
      case 'PHOTO': return <Camera className="w-8 h-8 text-amber-400" />;
      case 'OBJECT': return <Key className="w-8 h-8 text-amber-400" />;
      case 'FORENSIC': return <FlaskConical className="w-8 h-8 text-cyan-400" />;
      default: return <Search className="w-8 h-8 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0d121c] border-2 border-amber-500/50 rounded-2xl shadow-2xl p-6 sm:p-7 text-left">
        
        <button
          onClick={() => {
            sound.playKeyClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Evidence Tag Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-5">
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40">
            {getIcon(clue.type)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-amber-400 text-slate-950 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                EVIDENCE CLASSIFIED
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                TYPE: {clue.type}
              </span>
            </div>
            <h2 className="text-xl font-orbitron font-bold text-white mt-1">
              {clue.title}
            </h2>
          </div>
        </div>

        {/* High-Contrast Information Cards */}
        <div className="space-y-3 font-sans text-xs">
          
          <div className="bg-[#131926] p-3.5 rounded-xl border border-slate-800">
            <span className="text-amber-400 font-mono font-bold block mb-1 uppercase tracking-wider text-[10px]">
              LOCATION DISCOVERED:
            </span>
            <span className="text-slate-100 font-medium text-sm">{clue.locationFound}</span>
          </div>

          <div className="bg-[#131926] p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-mono font-bold block mb-1 uppercase tracking-wider text-[10px]">
              PHYSICAL DESCRIPTION:
            </span>
            <p className="text-slate-100 font-normal leading-relaxed text-sm">
              {clue.description}
            </p>
          </div>

          <div className="bg-amber-950/30 p-4 rounded-xl border border-amber-500/40">
            <span className="text-amber-300 font-mono flex items-center gap-1.5 font-bold mb-1 uppercase tracking-wider text-xs">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              FORENSIC LAB ANALYSIS:
            </span>
            <p className="text-slate-100 font-normal leading-relaxed text-sm">
              {clue.forensicAnalysis}
            </p>
          </div>
        </div>

        {/* Store Action Button */}
        <button
          onClick={() => {
            sound.playKeyClick();
            onClose();
          }}
          className="w-full mt-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-orbitron font-bold text-xs tracking-wider transition-all shadow-lg hover:shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>STORE IN EVIDENCE DOSSIER</span>
        </button>

      </div>
    </div>
  );
};
