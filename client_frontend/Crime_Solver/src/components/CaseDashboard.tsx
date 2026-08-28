import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { CaseData } from '../types';
import { sound } from '../utils/soundEngine';
import { Shield, Clock, MapPin, Award, LogOut, Volume2, VolumeX, FolderLock, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CaseDashboardProps {
  cases: CaseData[];
  onSelectCase: (c: CaseData) => void;
  isLoading: boolean;
}

export const CaseDashboard: React.FC<CaseDashboardProps> = ({ cases, onSelectCase, isLoading }) => {
  const { user, logout } = useAuth();
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const handleAudioToggle = () => {
    const nextMute = sound.toggleMute();
    setIsMuted(nextMute);
  };

  const handleCaseClick = (caseItem: CaseData) => {
    sound.playKeyClick();
    onSelectCase(caseItem);
  };

  const isCaseCompleted = (caseId: string) => {
    return user?.completedCaseIds?.includes(caseId) || false;
  };

  return (
    <div className="relative min-h-screen z-10 pb-16 bg-[#090c12] text-slate-100 select-none">
      
      {/* Top Detective Command Header */}
      <header className="sticky top-0 z-30 bg-[#0f1420]/95 border-b border-amber-500/30 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-bold text-sm tracking-wider text-white">CIB DETECTIVE ARCHIVE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold">
                FORENSIC SYSTEM
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">CRIMINAL INVESTIGATION BUREAU // COLD CASE DOSSIERS</span>
          </div>
        </div>

        {/* Agent Badge Summary */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3.5 bg-[#131926] border border-slate-800 px-4 py-2 rounded-xl text-xs font-sans">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-slate-400 font-mono text-[11px]">OPERATIVE:</span>
              <span className="text-amber-400 font-bold">{user?.username || 'AGENT'}</span>
            </div>
            <div className="w-px h-4 bg-slate-800" />
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{user?.score || 0} PTS</span>
            </div>
            <div className="w-px h-4 bg-slate-800" />
            <div className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SOLVED: {user?.completedCaseIds?.length || 0} / {cases.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAudioToggle}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={() => {
                sound.playKeyClick();
                logout();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/40 border border-red-800/60 hover:border-red-500 text-red-300 font-mono text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">DISCONNECT</span>
            </button>
          </div>
        </div>
      </header>

      {/* Case Selection Grid */}
      <main className="max-w-6xl mx-auto px-4 pt-10">
        
        {/* Banner Section */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ACTIVE COLD CASE INVESTIGATION UNIT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-orbitron font-extrabold text-white tracking-wide">
              SELECT AN INCIDENT FILE
            </h1>
            <p className="text-sm font-sans text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Explore crime scene rooms, discover hidden physical clues, examine forensic reports, and consult with the AI assistant SPECTER to solve the case.
            </p>
          </div>

          <div className="font-mono text-xs text-slate-300 bg-[#131926] border border-slate-800 p-3 rounded-xl shrink-0 shadow-md">
            <div>STATUS: <span className="text-emerald-400 font-bold">CLEARANCE VERIFIED</span></div>
            <div>AVAILABLE DOSSIERS: <span className="text-amber-400 font-bold">{cases.length}</span></div>
          </div>
        </div>

        {/* Cases Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 rounded-full border-3 border-amber-400 border-t-transparent animate-spin" />
            <span className="font-mono text-sm text-amber-300 tracking-widest animate-pulse font-bold">
              RETRIEVING FORENSIC CASE DOSSIERS...
            </span>
          </div>
        ) : cases.length === 0 ? (
          <div className="bg-[#131926] p-12 rounded-2xl text-center max-w-md mx-auto border border-amber-500/30 shadow-2xl">
            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h3 className="font-orbitron font-bold text-lg text-white">NO ACTIVE CASES IN QUEUE</h3>
            <p className="font-sans text-xs text-slate-400 mt-2">
              All files are currently archived.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cases.map((caseItem) => {
              const solved = isCaseCompleted(caseItem.id);
              const isCase1 = caseItem.caseNumber === 'CASE-01';

              return (
                <div
                  key={caseItem.id}
                  onClick={() => handleCaseClick(caseItem)}
                  className={`group relative bg-[#0f1420] rounded-2xl border-2 transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1.5 shadow-2xl ${
                    solved 
                      ? 'border-emerald-500/50 hover:border-emerald-400 shadow-emerald-950/20' 
                      : 'border-slate-800 hover:border-amber-400 shadow-amber-950/20'
                  }`}
                >
                  {/* Top Graphic Banner */}
                  <div className={`h-48 relative overflow-hidden flex items-center justify-center p-6 ${
                    isCase1 
                      ? 'bg-gradient-to-br from-[#121a2d] via-[#0d121c] to-[#070a10]' 
                      : 'bg-gradient-to-br from-[#1a1710] via-[#0d121c] to-[#070a10]'
                  }`}>
                    {/* Visual Stamp Ribbon */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="font-mono text-xs font-black px-2.5 py-1 rounded bg-black/80 border border-slate-700 text-amber-300">
                        {caseItem.caseNumber}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 z-10">
                      <span className={`font-mono text-xs px-3 py-1 rounded font-black uppercase tracking-wider border shadow-lg ${
                        solved 
                          ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300'
                          : 'bg-amber-950/90 border-amber-400 text-amber-300'
                      }`}>
                        {solved ? '✓ SOLVED 🔎' : 'CONFIDENTIAL // UNSOLVED'}
                      </span>
                    </div>

                    {/* Central Icon */}
                    <div className="relative z-10 text-center transform group-hover:scale-105 transition-transform duration-300">
                      <FolderLock className={`w-16 h-16 mx-auto mb-2 ${isCase1 ? 'text-cyan-400' : 'text-amber-400'}`} />
                      <span className="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase">
                        {caseItem.crimeType}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4 text-left">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-mono font-bold uppercase ${
                          caseItem.difficulty === 'MASTERMIND' ? 'text-red-400' : 'text-amber-400'
                        }`}>
                          DIFFICULTY: {caseItem.difficulty}
                        </span>
                        <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          {caseItem.estimatedTime}
                        </span>
                      </div>

                      <h2 className="text-xl font-orbitron font-bold text-white group-hover:text-amber-300 transition-colors">
                        {caseItem.title}
                      </h2>
                      <p className="text-xs font-sans text-amber-200/80 mt-1 italic">
                        "{caseItem.subtitle}"
                      </p>
                    </div>

                    <p className="text-xs font-sans text-slate-300 line-clamp-2 leading-relaxed">
                      {caseItem.synopsis}
                    </p>

                    {/* Location & Time Metadata */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-sans text-slate-300 bg-[#131926] p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate text-slate-200 font-medium">{caseItem.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{caseItem.timeOfCrime}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      className={`w-full py-3 px-4 rounded-xl font-orbitron font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                        solved
                          ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      <span>{solved ? 'REVIEW CASE DOSSIER' : 'COMMENCE INVESTIGATION'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
