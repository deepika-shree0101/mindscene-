import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { CaseData } from '../types';
import { sound } from '../utils/soundEngine';
import { 
  Shield, Clock, MapPin, Award, LogOut, Volume2, VolumeX, 
  FolderLock, Sparkles, AlertCircle, CheckCircle2, Skull
} from 'lucide-react';
import { FullscreenButton } from './FullscreenButton';

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
    sound.playHeartbeatOnce(1.3);
    sound.playKeyClick();
    onSelectCase(caseItem);
  };

  const isCaseCompleted = (caseId: string) => {
    return user?.completedCaseIds?.includes(caseId) || false;
  };

  return (
    <div className="relative min-h-screen z-10 pb-20 bg-[#040101] text-red-100 select-none font-sans">
      
      {/* Top Detective Command Header */}
      <header className="sticky top-0 z-30 bg-[#0d0202]/95 border-b border-red-900/60 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-2xl backdrop-blur-md">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-500/70 flex items-center justify-center text-red-400 shadow-lg shadow-red-950">
            <Skull className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-creepster font-bold text-base sm:text-lg tracking-wider text-white">
                CIB FORENSIC ARCHIVE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-700 text-white font-bold tracking-widest">
                LEVEL-4 RESTRICTED
              </span>
            </div>
            <span className="text-[11px] font-mono text-red-400/70">
              TACTICAL COLD CASE HOMICIDE DOSSIERS
            </span>
          </div>
        </div>

        {/* Agent Badge Summary & Action Controls */}
        <div className="flex items-center gap-4">
          
          <div className="hidden sm:flex items-center gap-3.5 bg-black/80 border border-red-900/60 px-4 py-2 rounded-xl text-xs font-sans shadow-md">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-red-500/70 font-mono text-[11px]">AGENT:</span>
              <span className="text-red-300 font-bold">{user?.username?.toUpperCase() || 'OPERATIVE'}</span>
            </div>
            <div className="w-px h-4 bg-red-900/60" />
            <div className="flex items-center gap-1.5 text-red-400 font-bold">
              <Award className="w-4 h-4 text-red-500" />
              <span>{user?.score || 0} SCORE</span>
            </div>
            <div className="w-px h-4 bg-red-900/60" />
            <div className="text-red-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
              <span>SOLVED: {user?.completedCaseIds?.length || 0} / {cases.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FullscreenButton showLabel={false} />

            <button
              onClick={handleAudioToggle}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2.5 rounded-xl bg-black border border-red-900/60 hover:border-red-500 text-red-400 hover:text-white transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-red-400 animate-pulse" />}
            </button>

            <button
              onClick={() => {
                sound.playKeyClick();
                logout();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/60 border border-red-800/80 hover:border-red-500 text-red-300 font-mono text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">DISCONNECT</span>
            </button>
          </div>

        </div>
      </header>

      {/* Case Selection Grid */}
      <main className="max-w-6xl mx-auto px-4 pt-8 sm:pt-12">
        
        {/* Banner Section */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-red-900/60 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-mono font-bold mb-2 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>ACTIVE FORENSIC CRIME SCENE RECONSTRUCTION</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-creepster font-extrabold text-white tracking-wider text-glow-red">
              SELECT AN INCIDENT FILE
            </h1>
            <p className="text-xs sm:text-sm font-sans text-red-300/80 mt-1 max-w-2xl leading-relaxed">
              Examine crime scenes with your forensic spotlight, collect physical clues, interrogate suspects in the polygraph room, and reconstruct the homicide sequence.
            </p>
          </div>

          <div className="font-mono text-xs text-red-300 bg-black/80 border border-red-900/60 p-3 rounded-2xl shrink-0 shadow-lg">
            <div>STATUS: <span className="text-red-400 font-bold">LEVEL-4 AUTHORIZED</span></div>
            <div>ACTIVE FILES: <span className="text-white font-bold">{cases.length} INCIDENTS</span></div>
          </div>
        </div>

        {/* Cases Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 rounded-full border-3 border-red-500 border-t-transparent animate-spin" />
            <span className="font-mono text-sm text-red-300 tracking-widest animate-pulse font-bold">
              RETRIEVING FORENSIC CASE DOSSIERS...
            </span>
          </div>
        ) : cases.length === 0 ? (
          <div className="bg-black p-12 rounded-2xl text-center max-w-md mx-auto border border-red-900/60 shadow-2xl">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="font-creepster font-bold text-lg text-white">NO ACTIVE CASES IN QUEUE</h3>
            <p className="font-sans text-xs text-red-400/80 mt-2">
              All files are currently archived.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cases.map((caseItem) => {
              const solved = isCaseCompleted(caseItem.id);

              return (
                <div
                  key={caseItem.id}
                  onClick={() => handleCaseClick(caseItem)}
                  className={`group relative bg-[#090202] rounded-3xl border-2 transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-2 shadow-2xl ${
                    solved 
                      ? 'border-emerald-600/70 hover:border-emerald-400 shadow-emerald-950/30' 
                      : 'border-red-900/70 hover:border-red-500 shadow-[0_0_40px_rgba(220,38,38,0.2)] hover:shadow-[0_0_60px_rgba(220,38,38,0.4)]'
                  }`}
                >
                  {/* Top Graphic Banner */}
                  <div className="h-52 relative overflow-hidden flex items-center justify-center p-6 bg-gradient-to-br from-[#1c0404] via-[#0f0202] to-[#040101]">
                    
                    {/* Background Texture & Red Radial */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/30 via-transparent to-black" />

                    {/* Case Number Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="font-mono text-xs font-black px-2.5 py-1 rounded bg-black/90 border border-red-900/80 text-red-300 shadow-md">
                        {caseItem.caseNumber}
                      </span>
                    </div>

                    {/* Status Stamp Ribbon */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`font-mono text-xs px-3 py-1 rounded font-black uppercase tracking-wider border shadow-lg ${
                        solved 
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                          : 'bg-red-950 border-red-500 text-red-200'
                      }`}>
                        {solved ? '✓ SOLVED 🔎' : 'CONFIDENTIAL // UNSOLVED'}
                      </span>
                    </div>

                    {/* Central Icon */}
                    <div className="relative z-10 text-center transform group-hover:scale-110 transition-transform duration-300">
                      <FolderLock className={`w-16 h-16 mx-auto mb-2 ${solved ? 'text-emerald-400' : 'text-red-500'}`} />
                      <span className="text-xs font-mono font-bold tracking-widest text-red-300 uppercase block">
                        {caseItem.crimeType}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4 text-left">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-mono font-bold uppercase ${
                          caseItem.difficulty === 'MASTERMIND' ? 'text-red-400' : 'text-orange-400'
                        }`}>
                          DIFFICULTY: {caseItem.difficulty}
                        </span>
                        <span className="text-xs font-mono text-red-400/80 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-red-500" />
                          {caseItem.estimatedTime}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-creepster font-bold text-white group-hover:text-red-400 transition-colors">
                        {caseItem.title}
                      </h2>
                      <p className="text-xs font-sans text-red-300/80 mt-1 italic">
                        "{caseItem.subtitle}"
                      </p>
                    </div>

                    <p className="text-xs font-sans text-slate-300 line-clamp-2 leading-relaxed">
                      {caseItem.synopsis}
                    </p>

                    {/* Location & Time Metadata */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-sans text-slate-300 bg-black/80 p-3 rounded-2xl border border-red-900/50">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="truncate text-slate-200 font-medium">{caseItem.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-red-400 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="truncate">{caseItem.timeOfCrime}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      className={`w-full py-3.5 px-4 rounded-2xl font-creepster font-bold text-xs sm:text-sm tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                        solved
                          ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500'
                          : 'bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-[0_0_25px_rgba(220,38,38,0.4)]'
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
