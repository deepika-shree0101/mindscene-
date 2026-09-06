import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/soundEngine';
import { 
  Send, X, UserMinus, ShieldAlert, Activity, 
  Volume2, VolumeX, Flame, 
  CheckCircle2, Folder 
} from 'lucide-react';
import type { CaseData, Clue, Suspect } from '../types';

interface AiInterrogationRoomProps {
  caseData: CaseData;
  discoveredClueIds: string[];
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'player' | 'suspect' | 'system';
  text: string;
  timestamp: Date;
  stressDelta?: number;
  isLie?: boolean;
}

export const AiInterrogationRoom: React.FC<AiInterrogationRoomProps> = ({
  caseData,
  discoveredClueIds,
  onClose,
}) => {
  const { user } = useAuth();
  const [selectedSuspectIndex, setSelectedSuspectIndex] = useState<number>(0);
  const currentSuspect: Suspect = caseData.suspects[selectedSuspectIndex] || caseData.suspects[0];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [stressLevel, setStressLevel] = useState<number>(20);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [showEvidenceTray, setShowEvidenceTray] = useState<boolean>(false);
  const [polygraphSpike, setPolygraphSpike] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const discoveredClues: Clue[] = caseData.clues.filter((c) => discoveredClueIds.includes(c.id));

  // Determine current emotion state
  const getEmotionState = (stress: number) => {
    if (stress < 30) return { label: 'CALM & COMPOSED', color: 'text-emerald-400', border: 'border-emerald-500/50', bg: 'bg-emerald-950/40' };
    if (stress < 55) return { label: 'UNEASY & DEFENSIVE', color: 'text-yellow-400', border: 'border-yellow-500/50', bg: 'bg-yellow-950/40' };
    if (stress < 80) return { label: 'SWEATING & AGITATED', color: 'text-orange-400', border: 'border-orange-500/50', bg: 'bg-orange-950/40' };
    if (stress < 95) return { label: 'PANICKED / CRACKING', color: 'text-red-400', border: 'border-red-500/70', bg: 'bg-red-950/60' };
    return { label: 'TOTAL BREAKDOWN', color: 'text-red-200', border: 'border-red-500', bg: 'bg-red-900 animate-pulse' };
  };

  const emotion = getEmotionState(stressLevel);

  // Initialize suspect conversation when selected suspect changes
  useEffect(() => {
    const greeting = currentSuspect.initialStatements?.[0] || 
      `I have nothing to hide, Detective. Ask your questions so I can get out of this cell.`;
    
    setStressLevel(25);
    setMessages([
      {
        id: 'init-1',
        sender: 'system',
        text: `INTERROGATION COMMENCED // SUSPECT: ${currentSuspect.name.toUpperCase()} (${currentSuspect.role})`,
        timestamp: new Date(),
      },
      {
        id: 'init-2',
        sender: 'suspect',
        text: greeting,
        timestamp: new Date(),
      }
    ]);

    if (isVoiceEnabled) {
      sound.speak(greeting, 'suspect');
    }
  }, [selectedSuspectIndex, isVoiceEnabled]);

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Animated Polygraph (ECG Line) Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const render = () => {
      ctx.fillStyle = '#060202';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // ECG Wave
      ctx.strokeStyle = polygraphSpike ? '#ef4444' : stressLevel > 60 ? '#f97316' : '#22c55e';
      ctx.lineWidth = polygraphSpike ? 2.5 : 1.8;
      ctx.shadowBlur = polygraphSpike ? 10 : 4;
      ctx.shadowColor = ctx.strokeStyle;

      ctx.beginPath();
      const midY = canvas.height / 2;
      const speed = polygraphSpike ? 4 : 2;
      offset = (offset + speed) % 100;

      for (let x = 0; x < canvas.width; x++) {
        const progress = (x + offset) % 100;
        let y = midY;

        // Peak simulation based on stress level
        const amplitude = (stressLevel / 100) * 18 + (polygraphSpike ? 25 : 4);
        if (progress > 30 && progress < 36) {
          y = midY - amplitude * 0.4;
        } else if (progress >= 36 && progress < 42) {
          y = midY + amplitude * 1.2;
        } else if (progress >= 42 && progress < 48) {
          y = midY - amplitude * 1.5;
        } else if (progress >= 48 && progress < 54) {
          y = midY + amplitude * 0.5;
        } else {
          y = midY + Math.sin(x * 0.08) * 2;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [stressLevel, polygraphSpike]);

  // Intelligent Contextual Response Generator
  const generateSuspectResponse = (userPrompt: string, presentedClue?: Clue): { text: string; stressChange: number; isLie: boolean } => {
    const q = userPrompt.toLowerCase();
    const suspect = currentSuspect;
    let stressChange = 0;
    let isLie = false;
    let reply = '';

    // If a physical clue was presented
    if (presentedClue) {
      sound.playGlitch();
      const clueTitle = presentedClue.title.toLowerCase();
      isLie = true;
      stressChange = 25;

      if (clueTitle.includes('note') || clueTitle.includes('letter') || clueTitle.includes('document')) {
        reply = `(Eyes darting nervously) That letter?! Where did you find that?! It doesn't prove anything! I was just consulting about dosage, nothing more!`;
      } else if (clueTitle.includes('glass') || clueTitle.includes('wine') || clueTitle.includes('poison') || clueTitle.includes('chemical')) {
        reply = `(Voice cracking) The goblet... I never touched his drink! Someone else must have poured it! You can't pin this on me!`;
      } else if (clueTitle.includes('key') || clueTitle.includes('passage') || clueTitle.includes('bookshelf') || clueTitle.includes('door')) {
        reply = `(Sweat forming on brow) You found the hidden mechanism...? Look, the secret corridor has been in this house for decades. That doesn't make me a killer!`;
      } else if (clueTitle.includes('boot') || clueTitle.includes('footprint') || clueTitle.includes('fingerprint') || clueTitle.includes('knife')) {
        reply = `(Breathing heavily) That's... impossible. I wore... I mean, I wasn't anywhere near the balcony! Stop twisting my words!`;
      } else {
        reply = `(Backing against the wall) Why are you showing me ${presentedClue.title}?! I don't know what you're trying to imply, Detective!`;
      }

      return { text: reply, stressChange, isLie };
    }

    // Checking questions by topic
    if (q.includes('alibi') || q.includes('where were you') || q.includes('time') || q.includes('clock') || q.includes('midnight') || q.includes('23:45')) {
      isLie = true;
      stressChange = 12;
      reply = `${suspect.alibi} I've told your officers three times already. Why don't you check the hallway cameras instead of grilling me?!`;
    } else if (q.includes('motive') || q.includes('why') || q.includes('money') || q.includes('debt') || q.includes('will') || q.includes('inheritance') || q.includes('cash')) {
      isLie = true;
      stressChange = 18;
      reply = `${suspect.motive ? `Look: ${suspect.motive}. But that doesn't mean I wanted them dead!` : "I had no reason to harm anyone! Money isn't everything!"}`;
    } else if (q.includes('relationship') || q.includes('victim') || q.includes('lord') || q.includes('arthur') || q.includes('know him') || q.includes('friend')) {
      stressChange = 8;
      reply = `My relationship was strictly ${suspect.relationship || 'professional'}. We had disagreements like anyone else, but I respected him.`;
    } else if (q.includes('weapon') || q.includes('poison') || q.includes('tranquilizer') || q.includes('murder') || q.includes('kill') || q.includes('stab')) {
      isLie = true;
      stressChange = 22;
      reply = `(Slamming desk) Murder?! You have no right to throw around accusations like that without definitive forensic proof!`;
    } else if (q.includes('confess') || q.includes('admit') || q.includes('give up') || q.includes('caught')) {
      if (stressLevel > 75) {
        stressChange = 20;
        reply = `(Head in hands, hyperventilating) Alright! Alright! I was there! But it was an accident, I swear to God! It wasn't supposed to end like this!`;
      } else {
        stressChange = 15;
        reply = `Confess to what?! You're desperate, Detective. You have nothing on me and you know it.`;
      }
    } else if (q.includes('fingerprint') || q.includes('dna') || q.includes('camera') || q.includes('witness') || q.includes('proof') || q.includes('clue')) {
      stressChange = 15;
      isLie = true;
      reply = `If you had real proof, you'd have charged me already. You're fishing in the dark hoping I'll slip up.`;
    } else {
      // Dynamic fallback
      const deflections = [
        `You're wasting valuable time questioning me while the real culprit is getting away.`,
        `Ask whatever you want. My story hasn't changed and it isn't going to.`,
        `I demand to speak to my legal counsel if you continue this badgering.`,
        `Look closely at the others in the manor. I'm not the one with blood on my hands.`,
        `Think what you want, Detective. The physical evidence will clear my name.`
      ];
      reply = deflections[Math.floor(Math.random() * deflections.length)];
      stressChange = 6;
    }

    return { text: reply, stressChange, isLie };
  };

  const handleSendMessage = async (textToSend: string, presentedClue?: Clue) => {
    if (!textToSend.trim() && !presentedClue) return;

    sound.playKeyClick();
    const messageContent = presentedClue 
      ? `[CONFRONT WITH EVIDENCE: ${presentedClue.title}] "${textToSend || 'Explain this forensic evidence!'}"`
      : textToSend;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'player',
        text: messageContent,
        timestamp: new Date(),
      }
    ]);

    setInputText('');
    setShowEvidenceTray(false);
    setIsTyping(true);

    // Call backend API with seamless fallback
    let suspectReply = '';
    let isLie = false;
    let stressIncrease = 10;

    try {
      const savedToken = localStorage.getItem('cib_token');
      const res = await fetch('/api/ai/interrogate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(savedToken ? { 'Authorization': `Bearer ${savedToken}` } : {})
        },
        body: JSON.stringify({
          caseId: caseData.id,
          userMessage: messageContent,
          discoveredClueIds: discoveredClueIds,
          focusedSubject: currentSuspect.name,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.response && !data.response.includes('UNKNOWN SUSPECT')) {
          suspectReply = data.response;
          stressIncrease = data.mood === 'HOSTILE' ? 18 : data.mood === 'CRACKING' ? 25 : 12;
          isLie = data.mood !== 'CALM';
        }
      }
    } catch {
      // Offline fallback
    }

    // If backend did not provide a rich answer, use local intelligence
    if (!suspectReply || suspectReply.length < 10) {
      const local = generateSuspectResponse(textToSend, presentedClue);
      suspectReply = local.text;
      isLie = local.isLie;
      stressIncrease = local.stressChange;
    }

    // Trigger polygraph shock & sound
    if (isLie || presentedClue) {
      setPolygraphSpike(true);
      sound.playHeartbeatOnce(1.3);
      setTimeout(() => setPolygraphSpike(false), 2500);
    }

    // Calculate new stress
    const newStress = Math.min(100, Math.max(10, stressLevel + stressIncrease));
    setStressLevel(newStress);

    // Add suspect message after natural typing delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'suspect',
          text: suspectReply,
          timestamp: new Date(),
          isLie,
          stressDelta: stressIncrease,
        }
      ]);

      if (isVoiceEnabled) {
        sound.speak(suspectReply, 'suspect');
      }
    }, 600);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      
      {/* Outer Enclosure */}
      <div className="w-full max-w-5xl bg-[#060202] border-2 border-red-800/60 rounded-2xl shadow-[0_0_80px_rgba(220,38,38,0.25)] flex flex-col h-[90vh] relative overflow-hidden text-slate-100 font-sans">
        
        {/* CRT Scanline & Blood Vignette */}
        <div className="absolute inset-0 scanlines pointer-events-none opacity-40 z-20" />
        <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(185,28,28,0.2)] pointer-events-none z-20" />

        {/* Top Interrogation Header */}
        <header className="flex flex-wrap items-center justify-between p-4 border-b border-red-900/60 bg-red-950/30 relative z-30">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-900/40 border border-red-500/60 flex items-center justify-center text-red-400 shadow-md">
              <UserMinus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-creepster text-xl text-red-100 tracking-wider">
                  TACTICAL INTERROGATION UNIT
                </span>
                <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 font-mono text-[10px] font-bold border border-red-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  REC ACTIVE
                </span>
              </div>
              <p className="text-[11px] font-mono text-red-400/70">
                CASE: {caseData.caseNumber} // SUBJECT: {currentSuspect.name.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Suspect Selector Tabs & Controls */}
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-red-900/50">
              {caseData.suspects.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    sound.playKeyClick();
                    setSelectedSuspectIndex(idx);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedSuspectIndex === idx
                      ? 'bg-red-700 text-white shadow-md'
                      : 'text-red-400/60 hover:text-red-300 hover:bg-red-950/40'
                  }`}
                >
                  <span>{s.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Voice Readout Toggle */}
            <button
              onClick={() => {
                const next = !isVoiceEnabled;
                setIsVoiceEnabled(next);
                if (!next && window.speechSynthesis) window.speechSynthesis.cancel();
              }}
              title={isVoiceEnabled ? "Mute Suspect Voice Synthesis" : "Enable Suspect Voice Synthesis"}
              className={`p-2 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                isVoiceEnabled
                  ? 'bg-red-900/50 border-red-500 text-red-200'
                  : 'bg-black border-red-900/40 text-red-500/50 hover:text-red-400'
              }`}
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4 text-red-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                sound.playKeyClick();
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-2 rounded-lg bg-black border border-red-900/60 hover:border-red-500 text-red-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </header>

        {/* Main Body Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden relative z-30">
          
          {/* Left Panel: Suspect Biometrics & Polygraph Lie Detector */}
          <div className="md:col-span-4 border-r border-red-900/50 bg-[#0a0202]/80 p-4 flex flex-col justify-between overflow-y-auto">
            
            {/* Suspect ID Card */}
            <div>
              <div className="relative mb-4 rounded-xl overflow-hidden border-2 border-red-900/60 bg-black">
                <img
                  src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`}
                  alt={currentSuspect.name}
                  className="w-full h-36 object-cover opacity-60 mix-blend-luminosity filter contrast-125 sepia hue-rotate-[-50deg] saturate-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                
                <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                  <div>
                    <h3 className="font-creepster text-lg text-white tracking-wide">
                      {currentSuspect.name}
                    </h3>
                    <span className="text-[11px] font-mono text-red-400 font-bold block">
                      {currentSuspect.role} ({currentSuspect.age} yrs)
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${emotion.bg} ${emotion.color} ${emotion.border}`}>
                    {emotion.label}
                  </span>
                </div>
              </div>

              {/* Stress Level Gauge */}
              <div className="bg-black/60 p-3.5 rounded-xl border border-red-900/40 mb-4">
                <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
                  <span className="text-red-400 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-red-500" />
                    PSYCHOLOGICAL STRESS
                  </span>
                  <span className={`text-sm ${emotion.color}`}>{stressLevel}%</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-2.5 bg-red-950/60 rounded-full overflow-hidden border border-red-900/80">
                  <div
                    className={`h-full transition-all duration-500 ${
                      stressLevel > 75 ? 'bg-gradient-to-r from-orange-500 to-red-500 animate-pulse' : stressLevel > 45 ? 'bg-orange-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${stressLevel}%` }}
                  />
                </div>
              </div>

              {/* Animated ECG Lie Detector */}
              <div className="bg-black p-3 rounded-xl border border-red-900/60 mb-4 relative">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-red-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Activity className={`w-3.5 h-3.5 ${polygraphSpike ? 'text-red-500 animate-ping' : 'text-red-400'}`} />
                    POLYGRAPH LIE DETECTION
                  </span>
                  <span className={polygraphSpike ? 'text-red-400 font-bold animate-pulse' : 'text-slate-500'}>
                    {polygraphSpike ? 'SPIKE DETECTED' : 'MONITORING'}
                  </span>
                </div>
                <canvas ref={canvasRef} width={280} height={70} className="w-full h-[70px] rounded" />
              </div>

              {/* Known Dossier Intel */}
              <div className="space-y-2 text-xs font-mono">
                <div className="bg-red-950/20 p-2 rounded-lg border border-red-900/30">
                  <span className="text-red-500/70 text-[10px] block font-bold">KNOWN ALIBI:</span>
                  <span className="text-slate-200 text-[11px]">{currentSuspect.alibi}</span>
                </div>
                <div className="bg-red-950/20 p-2 rounded-lg border border-red-900/30">
                  <span className="text-red-500/70 text-[10px] block font-bold">SUSPECTED MOTIVE:</span>
                  <span className="text-slate-200 text-[11px]">{currentSuspect.motive || 'Under Investigation'}</span>
                </div>
              </div>
            </div>

            {/* Evidence Confrontation Action Button */}
            <button
              onClick={() => {
                sound.playKeyClick();
                setShowEvidenceTray(!showEvidenceTray);
              }}
              className="mt-4 w-full py-2.5 px-3 rounded-xl bg-red-900/60 hover:bg-red-800/80 border border-red-500/60 text-red-100 font-mono text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Folder className="w-4 h-4 text-red-400" />
              <span>{showEvidenceTray ? 'CLOSE EVIDENCE TRAY' : `PRESENT EVIDENCE (${discoveredClues.length})`}</span>
            </button>

          </div>

          {/* Right Panel: Interactive Interrogation Chat Room */}
          <div className="md:col-span-8 flex flex-col justify-between bg-[#040101] relative overflow-hidden">
            
            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
              {messages.map((msg) => {
                if (msg.sender === 'system') {
                  return (
                    <div key={msg.id} className="text-center my-2">
                      <span className="inline-block px-3 py-1 rounded bg-red-950/60 border border-red-900/60 text-red-400 text-[10px] font-mono tracking-widest uppercase">
                        {msg.text}
                      </span>
                    </div>
                  );
                }

                const isPlayer = msg.sender === 'player';

                return (
                  <div key={msg.id} className={`flex ${isPlayer ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl relative ${
                        isPlayer
                          ? 'bg-red-900/40 border border-red-500/50 text-red-100 rounded-tr-none shadow-md'
                          : 'bg-[#0d0303] border border-red-800/60 text-slate-100 rounded-tl-none shadow-[0_0_20px_rgba(185,28,28,0.15)]'
                      }`}
                    >
                      {/* Sender Tag */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[10px] font-mono font-black ${isPlayer ? 'text-red-400' : 'text-red-500'}`}>
                          {isPlayer ? `AGENT ${user?.username?.toUpperCase() || 'INVESTIGATOR'}` : currentSuspect.name.toUpperCase()}
                        </span>
                        {msg.isLie && (
                          <span className="text-[9px] font-mono font-bold text-red-400 bg-red-950 px-1.5 py-0.2 rounded border border-red-700/60 animate-pulse">
                            STRESS SPIKE
                          </span>
                        )}
                      </div>

                      {/* Text */}
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#0d0303] border border-red-800/60 text-red-400 text-xs font-mono p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <span className="animate-pulse">{currentSuspect.name} is formulating a response</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Evidence Drawer Overlay (if toggled) */}
            {showEvidenceTray && (
              <div className="bg-[#0e0303] border-t-2 border-red-700 p-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    SELECT FORENSIC EVIDENCE TO CONFRONT {currentSuspect.name.toUpperCase()}:
                  </span>
                  <button
                    onClick={() => setShowEvidenceTray(false)}
                    className="text-xs font-mono text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                {discoveredClues.length === 0 ? (
                  <p className="text-xs font-mono text-red-500/60 italic p-3 text-center">
                    No physical evidence collected yet. Search the crime scene with your scanner first!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-1">
                    {discoveredClues.map((clue) => (
                      <button
                        key={clue.id}
                        onClick={() => handleSendMessage(`I have the ${clue.title}. How do you explain this?`, clue)}
                        className="text-left p-2.5 rounded-lg bg-black border border-red-900/70 hover:border-red-400 text-xs font-sans transition-all group flex items-start gap-2 cursor-pointer shadow-md hover:bg-red-950/30"
                      >
                        <div className="p-1.5 rounded bg-red-950 text-red-400 shrink-0 group-hover:scale-110 transition-transform">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-100 block font-creepster tracking-wide group-hover:text-red-400">
                            {clue.title}
                          </span>
                          <span className="text-[10px] text-slate-400 line-clamp-1">
                            {clue.forensicAnalysis}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quick Tactical Question Buttons */}
            <div className="px-4 py-2 bg-black/80 border-t border-red-900/40 flex flex-wrap gap-1.5 text-xs font-mono">
              <span className="text-[10px] text-red-500/70 font-bold self-center mr-1">QUICK PRESS:</span>
              <button
                onClick={() => handleSendMessage("Where exactly were you at 23:45 during the power cut?")}
                className="px-2.5 py-1 rounded bg-red-950/40 border border-red-900/50 hover:border-red-400 text-red-300 text-[11px] transition-colors cursor-pointer"
              >
                Press on Alibi
              </button>
              <button
                onClick={() => handleSendMessage("Who stands to gain financially from Lord Blackwood's disappearance?")}
                className="px-2.5 py-1 rounded bg-red-950/40 border border-red-900/50 hover:border-red-400 text-red-300 text-[11px] transition-colors cursor-pointer"
              >
                Inquire about Motive
              </button>
              <button
                onClick={() => handleSendMessage("Our forensic lab found tranquilizer residue in the wine goblet.")}
                className="px-2.5 py-1 rounded bg-red-950/40 border border-red-900/50 hover:border-red-400 text-red-300 text-[11px] transition-colors cursor-pointer"
              >
                Confront with Poison
              </button>
            </div>

            {/* Message Input Form */}
            <div className="p-4 border-t border-red-900/60 bg-[#060202]">
              <form onSubmit={handleFormSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Cross-examine ${currentSuspect.name}...`}
                  className="flex-1 bg-black border border-red-900/70 text-slate-100 placeholder:text-red-950/80 font-mono text-xs sm:text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="bg-red-800 hover:bg-red-700 text-white px-5 sm:px-6 py-3 rounded-xl font-mono text-xs font-bold tracking-wider transition-all disabled:opacity-40 flex items-center gap-2 cursor-pointer shadow-lg shadow-red-950"
                >
                  <span>INTERROGATE</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
