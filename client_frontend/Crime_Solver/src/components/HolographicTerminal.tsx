import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/soundEngine';
import { Shield, Lock, User, Terminal, CheckCircle, AlertTriangle, Fingerprint, Award } from 'lucide-react';
import { FullscreenButton } from './FullscreenButton';

export const HolographicTerminal: React.FC = () => {
  const { login, register, quickGuestAccess, error, isLoading } = useAuth();
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
      setBootLog('ACCESS GRANTED // WELCOME AGENT ' + (username || 'OPERATIVE').toUpperCase());
    } else {
      sound.playAccessDenied();
      setBootLog('ACCESS DENIED // CREDENTIAL REJECTED');
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
      <div className="absolute top-6 left-6 text-xs font-mono text-red-500/40 flex items-center gap-2">
        <Terminal className="w-4 h-4 animate-pulse" />
        <span>NODE: ASIA-SOUTH-PRIMARY // CIB-CLEARANCE-PORTAL</span>
      </div>

      {/* Fullscreen Immersion Toggle */}
      <div className="absolute top-6 right-6">
        <FullscreenButton showLabel={true} />
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left Side: Agent Holographic Badge Card */}
        <div className="md:col-span-5 glass-panel-crimson p-6 rounded-2xl border border-red-500/30 relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="w-20 h-20 rounded-full border-2 border-red-400 p-1 flex items-center justify-center mb-4 bg-red-950/40 relative group">
            <Fingerprint className="w-12 h-12 text-red-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-full border border-red-300 animate-ping opacity-25" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>CRIMINAL INVESTIGATION BUREAU</span>
          </div>

          <h2 className="text-2xl font-creepster font-bold text-white tracking-wider mb-1">
            {username ? username.toUpperCase() : 'UNKNOWN OPERATIVE'}
          </h2>

          <div className="text-xs font-mono text-red-400 mb-4 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-red-500" />
            <span>RANK: {rank}</span>
          </div>

          <div className="w-full bg-black/80 p-3 rounded-xl border border-red-900/60 text-left font-mono text-xs text-slate-300 space-y-1.5 mb-4 shadow-md">
            <div className="flex justify-between">
              <span className="text-red-500/70">CLEARANCE:</span>
              <span className="text-red-300 font-bold">{clearance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-500/70">PROTOCOL:</span>
              <span className="text-emerald-400">ENCRYPTED_SHA256</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-500/70">STATUS:</span>
              <span className="text-amber-400 font-bold">READY_FOR_DEPLOYMENT</span>
            </div>
          </div>

          {/* Preset Operative Credentials Button */}
          <div className="w-full pt-2 border-t border-red-900/40">
            <span className="text-[10px] font-mono text-slate-400 block mb-2">QUICK FILL OPERATIVE MATRIX:</span>
            <div className="flex flex-wrap gap-1.5 justify-center">
              <button
                type="button"
                onClick={() => handleQuickFill('AgentSpecter', 'VanceCase2024!', 'Lead Investigator')}
                className="px-2 py-1 rounded bg-red-950/60 hover:bg-red-900 border border-red-800 text-[10px] font-mono text-red-300 cursor-pointer transition-colors"
              >
                AgentSpecter
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('DetectiveHolmes', 'Moriarty#99', 'Senior Detective')}
                className="px-2 py-1 rounded bg-red-950/60 hover:bg-red-900 border border-red-800 text-[10px] font-mono text-red-300 cursor-pointer transition-colors"
              >
                DetectiveHolmes
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Holographic Credential Console */}
        <div className="md:col-span-7 glass-panel-crimson p-6 sm:p-8 rounded-2xl border border-red-500/40 shadow-2xl relative">
          
          <div className="flex items-center justify-between border-b border-red-900/60 pb-4 mb-6">
            <div>
              <span className="text-[10px] font-mono text-red-500 font-bold tracking-widest uppercase">
                {isRegisterMode ? 'NEW AGENT COMMISSIONING' : 'SECURE BUREAU GATEWAY'}
              </span>
              <h1 className="text-2xl font-creepster font-extrabold text-white mt-0.5 tracking-wide">
                {isRegisterMode ? 'ENROLL NEW DETECTIVE' : 'BUREAU AUTHENTICATION'}
              </h1>
            </div>

            <button
              type="button"
              onClick={handleModeToggle}
              className="text-xs font-mono px-3 py-1.5 rounded-lg border border-red-500/50 bg-red-950/40 text-red-300 hover:bg-red-900/60 hover:text-white transition-colors cursor-pointer"
            >
              {isRegisterMode ? 'SWITCH TO LOGIN' : 'CREATE DOSSIER'}
            </button>
          </div>

          <div className="bg-black/50 border border-red-900/50 rounded-lg p-2.5 mb-6 text-xs font-mono text-red-300/90 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0" />
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
                <User className="w-3.5 h-3.5 text-red-400" />
                <span>Agent Callsign / Username</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => handleInputChange(setUsername, e.target.value)}
                placeholder="e.g. AgentVance"
                className="w-full bg-black border border-red-900/80 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-100 font-mono text-sm px-4 py-3 rounded-xl outline-none transition-all placeholder:text-red-950/80"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-red-500" />
                <span>Security Cipher / Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => handleInputChange(setPassword, e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-black border border-red-900/80 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-100 font-mono text-sm px-4 py-3 rounded-xl outline-none transition-all placeholder:text-red-950/80"
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
                    className="w-full bg-black border border-red-900 text-slate-200 font-mono text-xs px-3 py-2.5 rounded-xl outline-none focus:border-red-500"
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
                    className="w-full bg-black border border-red-900 text-slate-200 font-mono text-xs px-3 py-2.5 rounded-xl outline-none focus:border-red-500"
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
              className="w-full mt-4 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-creepster font-bold text-base tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-[0_0_25px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>SYNCHRONIZING WITH CIB MAINFRAME...</span>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5" />
                  <span>{isRegisterMode ? 'AUTHENTICATE & ENROLL' : 'REQUEST BUREAU ACCESS'}</span>
                </>
              )}
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-red-950"></div>
              <span className="flex-shrink mx-3 text-[10px] font-mono text-red-400/60 uppercase">or instant entry</span>
              <div className="flex-grow border-t border-red-950"></div>
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playAccessGranted();
                quickGuestAccess(username || 'Operative');
              }}
              className="w-full bg-slate-900/90 hover:bg-slate-800 border border-red-700/60 hover:border-red-400 text-red-300 hover:text-white font-mono text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>⚡ INSTANT GUEST PASS (NETLIFY / DIRECT ENTRY)</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
