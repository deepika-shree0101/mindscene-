import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/soundEngine';
import { Shield, Lock, User, Terminal, CheckCircle, AlertTriangle, Fingerprint, Award } from 'lucide-react';

export const HolographicTerminal: React.FC = () => {
  const { login, register, error, isLoading } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rank, setRank] = useState<string>('Lead Investigator');
  const [clearance, setClearance] = useState<string>('LEVEL-3 CONFIDENTIAL');
  const [bootLog, setBootLog] = useState<string>('C.I.B. PROTOCOL ONLINE // READY FOR BIOMETRIC CLEARANCE');

  const handleModeToggle = () => {
    sound.playKeyClick();
    setIsRegisterMode(!isRegisterMode);
  };

  const handleInputChange = (setter: (val: string) => void, val: string) => {
    sound.playKeyClick();
    setter(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      sound.playAccessDenied();
      setBootLog('ERROR: Incomplete credential matrix provided.');
      return;
    }

    setBootLog('VERIFYING ENCRYPTED CLEARANCE TOKEN...');
    let success = false;
    if (isRegisterMode) {
      success = await register(username, password, rank, clearance);
    } else {
      success = await login(username, password);
    }

    if (success) {
      sound.playAccessGranted();
      setBootLog('ACCESS GRANTED // WELCOME AGENT ' + username.toUpperCase());
    } else {
      sound.playAccessDenied();
      setBootLog('ACCESS DENIED // CREDENTIAL REJECTED BY MAINFRAME');
    }
  };

  const handleQuickFill = (name: string, pass: string, quickRank: string) => {
    sound.playKeyClick();
    setUsername(name);
    setPassword(pass);
    setRank(quickRank);
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center p-4 z-10">
      {/* Decorative Grid Corner Markers */}
      <div className="absolute top-6 left-6 text-xs font-mono text-cyan-500/40 flex items-center gap-2">
        <Terminal className="w-4 h-4 animate-pulse" />
        <span>NODE: ASIA-SOUTH-PRIMARY // CIB-CLEARANCE-PORTAL</span>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left Side: Agent Holographic Badge Card */}
        <div className="md:col-span-5 glass-panel p-6 rounded-2xl border border-cyan-500/30 relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="w-20 h-20 rounded-full border-2 border-cyan-400 p-1 flex items-center justify-center mb-4 bg-cyan-950/40 relative group">
            <Fingerprint className="w-12 h-12 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-full border border-cyan-300 animate-ping opacity-25" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>CRIMINAL INVESTIGATION BUREAU</span>
          </div>

          <h2 className="text-xl font-orbitron font-bold text-slate-100 tracking-wider mb-1">
            {username ? username.toUpperCase() : 'UNKNOWN OPERATIVE'}
          </h2>

          <div className="text-xs font-mono text-cyan-400 mb-4 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            <span>RANK: {rank}</span>
          </div>

          <div className="w-full bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-left font-mono text-xs text-slate-300 space-y-1.5 mb-4">
            <div className="flex justify-between">
              <span className="text-slate-500">CLEARANCE:</span>
              <span className="text-amber-400 font-semibold">{clearance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">SYS_STATUS:</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> ONLINE
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ENCRYPTION:</span>
              <span className="text-cyan-400">AES-256-GCM</span>
            </div>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="w-full text-left">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
              ⚡ Instant 1-Click Access:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('SpecterAgent', 'pass123456', 'Senior Detective')}
                className="text-xs font-mono bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/60 hover:border-cyan-400 py-1.5 px-2 rounded transition-all"
              >
                Detective Call
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('RookieCadet', 'pass123456', 'Cadet Investigator')}
                className="text-xs font-mono bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 hover:border-amber-400 py-1.5 px-2 rounded transition-all"
              >
                Cadet Pass
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Access Terminal Form */}
        <div className="md:col-span-7 glass-panel p-8 rounded-2xl border border-slate-700/50 shadow-2xl relative">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div>
              <h1 className="text-2xl font-orbitron font-extrabold text-white tracking-wide flex items-center gap-2">
                <Terminal className="w-6 h-6 text-cyan-400" />
                {isRegisterMode ? 'ENROLL AGENT' : 'TERMINAL LOGIN'}
              </h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Enter your forensic identity keys to access cold case dossiers.
              </p>
            </div>

            <button
              onClick={handleModeToggle}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer"
            >
              {isRegisterMode ? 'Switch to Login' : 'Create Agent ID'}
            </button>
          </div>

          {/* System Terminal Boot Log Status */}
          <div className="bg-black/50 border border-cyan-900/50 rounded-lg p-2.5 mb-6 text-xs font-mono text-cyan-300/90 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <span className="truncate">{bootLog}</span>
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-800/80 rounded-lg p-3 mb-6 text-xs font-mono text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Agent Callsign / Username</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => handleInputChange(setUsername, e.target.value)}
                placeholder="e.g. AgentVance"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-100 font-mono text-sm px-4 py-2.5 rounded-lg outline-none transition-all placeholder:text-slate-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Security Cipher / Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => handleInputChange(setPassword, e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-100 font-mono text-sm px-4 py-2.5 rounded-lg outline-none transition-all placeholder:text-slate-600"
                required
              />
            </div>

            {isRegisterMode && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1">
                    Designated Rank
                  </label>
                  <select
                    value={rank}
                    onChange={(e) => handleInputChange(setRank, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 font-mono text-xs px-3 py-2 rounded-lg outline-none focus:border-cyan-400"
                  >
                    <option value="Cadet Investigator">Cadet Investigator</option>
                    <option value="Lead Investigator">Lead Investigator</option>
                    <option value="Senior Detective">Senior Detective</option>
                    <option value="Forensic Specialist">Forensic Specialist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1">
                    Clearance Tier
                  </label>
                  <select
                    value={clearance}
                    onChange={(e) => handleInputChange(setClearance, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 font-mono text-xs px-3 py-2 rounded-lg outline-none focus:border-cyan-400"
                  >
                    <option value="LEVEL-1 ROOKIE">LEVEL-1 ROOKIE</option>
                    <option value="LEVEL-2 AGENT">LEVEL-2 AGENT</option>
                    <option value="LEVEL-3 CONFIDENTIAL">LEVEL-3 CONFIDENTIAL</option>
                    <option value="TOP-SECRET CIB">TOP-SECRET CIB</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-orbitron font-bold text-sm tracking-wider py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>SYNCHRONIZING WITH CIB...</span>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5" />
                  <span>{isRegisterMode ? 'AUTHENTICATE & ENROLL' : 'REQUEST BUREAU ACCESS'}</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
