import React, { useState } from 'react';
import type { Clue, Suspect } from '../types';
import { sound } from '../utils/soundEngine';
import { Folder, FileText, Camera, Key, FlaskConical, Users, X, Eye, ShieldAlert, Tag, CheckCircle2 } from 'lucide-react';

interface EvidenceInventoryProps {
  isOpen: boolean;
  onClose: () => void;
  discoveredClues: Clue[];
  allSuspects: Suspect[];
  onInspectClue: (clue: Clue) => void;
  onProceedToInterrogation?: () => void;
}

export const EvidenceInventory: React.FC<EvidenceInventoryProps> = ({
  isOpen,
  onClose,
  discoveredClues,
  allSuspects,
  onInspectClue,
  onProceedToInterrogation,
}) => {
  const [activeTab, setActiveTab] = useState<'CLUES' | 'SUSPECTS'>('CLUES');

  if (!isOpen) return null;

  const getClueIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT': return <FileText className="w-4 h-4 text-orange-400" />;
      case 'PHOTO': return <Camera className="w-4 h-4 text-orange-400" />;
      case 'OBJECT': return <Key className="w-4 h-4 text-orange-400" />;
      case 'FORENSIC': return <FlaskConical className="w-4 h-4 text-red-400" />;
      default: return <FileText className="w-4 h-4 text-orange-400" />;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] z-50 bg-[#0c1018]/95 border-l-2 border-orange-500/40 shadow-2xl flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-300 select-none">
      
      {/* Drawer Header */}
      <div className="p-4 bg-[#111722] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-orange-950/80 border border-orange-500/40">
            <Folder className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h2 className="font-creepster font-bold text-sm tracking-wider text-white">
              EVIDENCE DOSSIER
            </h2>
            <span className="text-[11px] font-mono text-slate-400">ACTIVE CRIME ARCHIVE</span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playKeyClick();
            onClose();
          }}
          className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-orange-400 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 p-2 gap-2 border-b border-slate-800 bg-[#090d14]">
        <button
          onClick={() => {
            sound.playKeyClick();
            setActiveTab('CLUES');
          }}
          className={`py-2.5 rounded-lg font-sans text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeTab === 'CLUES'
              ? 'bg-orange-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>CLUES COLLECTED ({discoveredClues.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playKeyClick();
            setActiveTab('SUSPECTS');
          }}
          className={`py-2.5 rounded-lg font-sans text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeTab === 'SUSPECTS'
              ? 'bg-orange-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>SUSPECTS ({allSuspects.length})</span>
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'CLUES' ? (
          discoveredClues.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-sans text-xs space-y-2">
              <ShieldAlert className="w-12 h-12 mx-auto text-orange-500/60" />
              <p className="font-semibold text-slate-300">No evidence gathered in this room yet.</p>
              <p className="text-slate-500">Shine your flashlight around the crime scene to uncover items.</p>
            </div>
          ) : (
            discoveredClues.map((clue, idx) => (
              <div
                key={clue.id}
                onClick={() => {
                  sound.playKeyClick();
                  onInspectClue(clue);
                }}
                className="bg-[#131926] hover:bg-[#182133] border border-slate-800 hover:border-orange-400/80 p-4 rounded-xl transition-all cursor-pointer group text-left shadow-lg"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-400 text-slate-950 font-mono text-[10px] font-black px-1.5 py-0.5 rounded">
                      #0{idx + 1}
                    </span>
                    {getClueIcon(clue.type)}
                    <span className="text-[10px] font-mono font-bold text-orange-300">
                      {clue.type}
                    </span>
                  </div>
                  <Eye className="w-4 h-4 text-slate-500 group-hover:text-orange-300 transition-colors" />
                </div>
                <h4 className="text-sm font-sans font-bold text-white group-hover:text-orange-200">
                  {clue.title}
                </h4>
                <p className="text-xs font-sans text-slate-300 line-clamp-2 mt-1 leading-snug">
                  {clue.description}
                </p>
                <div className="mt-2 text-[10px] font-mono text-rose-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>LOGGED IN DOSSIER • CLICK TO VIEW LAB REPORT</span>
                </div>
              </div>
            ))
          )
        ) : (
          allSuspects.map((suspect) => (
            <div
              key={suspect.id}
              className="bg-[#131926] border border-slate-800 p-4 rounded-xl space-y-2.5 text-left shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-950/80 border border-orange-500 flex items-center justify-center text-orange-300 font-mono font-black text-sm">
                  {suspect.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-sans font-bold text-white">{suspect.name}</h4>
                  <span className="text-xs font-mono text-orange-400">{suspect.role} (Age {suspect.age})</span>
                </div>
              </div>

              <div className="text-xs font-sans space-y-1.5 bg-[#0a0d14] p-3 rounded-lg border border-slate-800">
                <div><strong className="text-slate-400">Suspected Motive:</strong> <span className="text-slate-100 ml-1">{suspect.motive}</span></div>
                <div><strong className="text-slate-400">Claimed Alibi:</strong> <span className="text-slate-100 ml-1">{suspect.alibi}</span></div>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider block mb-1">
                  Interrogation Statements:
                </span>
                {suspect.initialStatements.map((stmt, idx) => (
                  <p key={idx} className="text-xs font-sans text-slate-200 italic bg-[#0f1420] p-2.5 rounded-lg border border-slate-800/80 mb-1.5 leading-relaxed">
                    "{stmt}"
                  </p>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dynamic Stage Gate to Suspect Interrogation */}
      {onProceedToInterrogation && (
        <div className="p-4 bg-[#090d14] border-t border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => {
              sound.playAccessGranted();
              onProceedToInterrogation();
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-creepster font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all cursor-pointer transform hover:scale-[1.02]"
          >
            <span>PROCEED TO SUSPECT INTERROGATION ➔</span>
          </button>
        </div>
      )}

    </div>
  );
};
