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
      case 'DOCUMENT': return <FileText className="w-8 h-8 text-orange-400" />;
      case 'PHOTO': return <Camera className="w-8 h-8 text-orange-400" />;
      case 'OBJECT': return <Key className="w-8 h-8 text-orange-400" />;
      case 'FORENSIC': return <FlaskConical className="w-8 h-8 text-red-400" />;
      default: return <Search className="w-8 h-8 text-orange-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0d121c] border-2 border-orange-500/50 rounded-2xl shadow-2xl p-6 sm:p-7 text-left">
        
        <button
          onClick={() => {
            sound.playKeyClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-orange-400 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Evidence Tag Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-5">
          <div className="p-3 rounded-xl bg-orange-950/60 border border-orange-500/40">
            {getIcon(clue.type)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-orange-400 text-slate-950 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                EVIDENCE CLASSIFIED
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                TYPE: {clue.type}
              </span>
            </div>
            <h2 className="text-xl font-creepster font-bold text-white mt-1">
              {clue.title}
            </h2>
          </div>
        </div>

        {/* High-Contrast Information Cards */}
        <div className="space-y-3 font-sans text-xs">
          
          <div className="bg-[#1a0505] p-3.5 rounded-xl border border-slate-800">
            <span className="text-orange-400 font-mono font-bold block mb-1 uppercase tracking-wider text-[10px]">
              LOCATION DISCOVERED:
            </span>
            <span className="text-slate-100 font-medium text-sm">{clue.locationFound}</span>
          </div>

          <div className="bg-[#1a0505] rounded-xl border border-slate-800 overflow-hidden relative h-40">
            <img 
              src={`https://picsum.photos/seed/${clue.id}/400/200?grayscale`} 
              alt="Clue Visual" 
              className="w-full h-full object-cover opacity-80 mix-blend-luminosity brightness-75 contrast-150 sepia hue-rotate-[-50deg] saturate-200"
            />
            <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black to-transparent">
               <span className="text-white font-mono font-bold block drop-shadow-md text-[10px]">
                  EVIDENCE VISUAL CAPTURE
               </span>
            </div>
          </div>

          <div className="bg-red-950/30 p-4 rounded-xl border border-red-500/40">
            <span className="text-red-300 font-mono flex items-center gap-1.5 font-bold mb-3 uppercase tracking-wider text-xs">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              FORENSIC LAB ANALYSIS (AUDIO):
            </span>
            <audio controls className="w-full h-8 opacity-80 grayscale contrast-150 invert sepia hue-rotate-180">
              <source src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_5157147b3b.mp3?filename=horror-background-atmosphere-156462.mp3" type="audio/mpeg" />
            </audio>
          </div>
        </div>

        {/* Store Action Button */}
        <button
          onClick={() => {
            sound.playKeyClick();
            onClose();
          }}
          className="w-full mt-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-creepster font-bold text-xs tracking-wider transition-all shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>STORE IN EVIDENCE DOSSIER</span>
        </button>

      </div>
    </div>
  );
};
