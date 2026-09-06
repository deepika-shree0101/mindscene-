import React, { useState, useEffect, useRef } from 'react';
import type { Clue } from '../types';
import { sound } from '../utils/soundEngine';
import { 
  Bot, Send, X, Activity, Volume2, VolumeX, 
  ShieldCheck, ChevronRight 
} from 'lucide-react';

interface AiPartnerHUDProps {
  caseId: string;
  discoveredClues: Clue[];
  activeSceneName: string;
}

interface ChatMessage {
  id: string;
  sender: 'AGENT' | 'SPECTER';
  text: string;
  suggestedPrompt?: string;
  timestamp: Date;
}

export const AiPartnerHUD: React.FC<AiPartnerHUDProps> = ({
  caseId,
  discoveredClues,
  activeSceneName,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'specter-init',
      sender: 'SPECTER',
      text: `SPECTER Forensic Matrix Online. Active telemetry locked onto [${activeSceneName}]. I am cross-referencing your ${discoveredClues.length} discovered evidence markers against suspect alibis in real time.`,
      suggestedPrompt: 'Analyze our collected forensic evidence',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Intelligent Context-Aware Forensic Dialogue Engine
  const generateForensicAnalysis = (userQuery: string): { reply: string; nextPrompt: string } => {
    const q = userQuery.toLowerCase();
    const clueCount = discoveredClues.length;
    const clueTitles = discoveredClues.map(c => c.title).join(', ');

    if (q.includes('evidence') || q.includes('clue') || q.includes('analyze') || q.includes('found')) {
      if (clueCount === 0) {
        return {
          reply: `SPECTER: Zero physical evidence markers cataloged so far in [${activeSceneName}]. Sweep your forensic spotlight over the mahogany desk and bookshelves to detect latent chemical or document traces.`,
          nextPrompt: 'Where are the most suspicious hotspots located?'
        };
      } else {
        const latest = discoveredClues[discoveredClues.length - 1];
        return {
          reply: `SPECTER: Forensic scan summary: We have logged [${clueTitles}]. The ${latest.title} is critical: ${latest.forensicAnalysis}. Compare this against the suspect who had access to this sector.`,
          nextPrompt: 'How does this contradict the primary suspect alibi?'
        };
      }
    }

    if (q.includes('who') || q.includes('killer') || q.includes('culprit') || q.includes('suspect') || q.includes('poison')) {
      return {
        reply: `SPECTER: Calculating probabilistic vector... The timeline at 23:45 shows the security alarm triggered within 90 seconds. To break the suspect's defense, interrogate them in Room 4B and present your collected physical clues directly to their face.`,
        nextPrompt: 'What questions should I press in the interrogation?'
      };
    }

    if (q.includes('safe') || q.includes('door') || q.includes('secret') || q.includes('passage') || q.includes('escape')) {
      return {
        reply: `SPECTER: Environmental analysis shows structural scratch marks near the study library. The mechanism leads downwards towards the coastal dock, indicating an orchestrated exit rather than a sudden abduction.`,
        nextPrompt: 'Did the suspect possess specialized footwear?'
      };
    }

    if (q.includes('help') || q.includes('stuck') || q.includes('next') || q.includes('where')) {
      return {
        reply: `SPECTER: Recommended tactical protocol: 1) Switch rooms using the top navigation switcher. 2) Shine the spotlight on hidden corners. 3) Launch the Interrogation Unit to trigger a psychological stress spike on the suspects.`,
        nextPrompt: 'Examine the suspect financial records'
      };
    }

    // Default dynamic intelligent lead
    return {
      reply: `SPECTER: Signal received: "${userQuery}". Correlating with telemetry from [${activeSceneName}]. The physical trajectory indicates premeditation. Verify all medical dosages and hidden mechanisms before making your final deduction.`,
      nextPrompt: 'Summarize all verified case contradictions'
    };
  };

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    sound.playKeyClick();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'AGENT',
      text: textToSend,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);

    let replyText = '';
    let suggestedPrompt = '';

    try {
      const savedToken = localStorage.getItem('cib_token');
      const res = await fetch('/api/ai/consult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(savedToken ? { 'Authorization': `Bearer ${savedToken}` } : {})
        },
        body: JSON.stringify({
          caseId,
          userMessage: textToSend,
          discoveredClueIds: discoveredClues.map((c) => c.id),
          sceneId: activeSceneName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.response && !data.response.includes('Communication frequency')) {
          replyText = data.response;
          suggestedPrompt = data.suggestedQuestion || 'What is our next forensic target?';
        }
      }
    } catch {
      // Offline fallback
    }

    if (!replyText || replyText.length < 10) {
      const analysis = generateForensicAnalysis(textToSend);
      replyText = analysis.reply;
      suggestedPrompt = analysis.nextPrompt;
    }

    setTimeout(() => {
      setIsThinking(false);
      sound.playAccessGranted();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'SPECTER',
          text: replyText,
          suggestedPrompt,
          timestamp: new Date(),
        }
      ]);

      if (isVoiceEnabled) {
        sound.speak(replyText, 'specter');
      }
    }, 500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen ? (
        <button
          onClick={() => {
            sound.playKeyClick();
            setIsOpen(true);
            if (isVoiceEnabled) {
              sound.speak("SPECTER Forensic Matrix Online. How can I assist your investigation, Agent?", 'specter');
            }
          }}
          className="group relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0a0000] border-2 border-red-600/70 text-red-100 shadow-[0_0_35px_rgba(220,38,38,0.35)] hover:border-red-400 hover:scale-105 transition-all cursor-pointer font-mono"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-red-950 border border-red-500 flex items-center justify-center text-red-400 shadow-md">
              <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-creepster tracking-wider text-red-100 block">
              SPECTER AI CO-PILOT
            </span>
            <span className="text-[10px] text-red-400 font-bold block">
              FORENSIC TELEMETRY LIVE
            </span>
          </div>
        </button>
      ) : (
        <div className="w-[92vw] sm:w-96 bg-[#080202] border-2 border-red-700/80 rounded-2xl shadow-[0_0_60px_rgba(220,38,38,0.3)] flex flex-col h-[520px] overflow-hidden text-slate-100 font-sans relative">
          
          {/* Header */}
          <div className="p-3.5 bg-red-950/40 border-b border-red-900/60 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-900/50 border border-red-500 flex items-center justify-center text-red-300">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <span className="font-creepster text-sm text-red-100 tracking-wider block">
                  SPECTER FORENSIC AI
                </span>
                <span className="text-[10px] font-mono text-red-400/80 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-red-400 animate-pulse" />
                  ZONE: {activeSceneName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Voice Toggle */}
              <button
                onClick={() => {
                  const next = !isVoiceEnabled;
                  setIsVoiceEnabled(next);
                  if (!next && window.speechSynthesis) window.speechSynthesis.cancel();
                }}
                title={isVoiceEnabled ? "Mute SPECTER Voice" : "Enable SPECTER Voice"}
                className={`p-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                  isVoiceEnabled ? 'bg-red-900/60 border-red-500 text-red-200' : 'bg-black border-red-900/40 text-red-500/50'
                }`}
              >
                {isVoiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-red-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => {
                  sound.playKeyClick();
                  if (window.speechSynthesis) window.speechSynthesis.cancel();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg bg-black border border-red-900/60 hover:border-red-500 text-red-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="px-3 py-1.5 bg-black border-b border-red-900/30 flex items-center justify-between text-[10px] font-mono text-red-400">
            <span>CLUES LOGGED: {discoveredClues.length}</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3" /> NEURAL LINK 99.8%
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 font-sans">
            {messages.map((msg) => {
              const isSpecter = msg.sender === 'SPECTER';
              return (
                <div key={msg.id} className={`flex ${isSpecter ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                      isSpecter
                        ? 'bg-[#120404] border border-red-900/70 text-slate-200 rounded-tl-none shadow-md'
                        : 'bg-red-900/50 border border-red-500/50 text-red-100 rounded-tr-none'
                    }`}
                  >
                    <span className={`text-[9px] font-mono font-bold block mb-1 ${isSpecter ? 'text-red-400' : 'text-red-300 text-right'}`}>
                      {msg.sender}
                    </span>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    
                    {msg.suggestedPrompt && (
                      <button
                        onClick={() => sendMessage(msg.suggestedPrompt!)}
                        className="mt-2.5 w-full text-left p-1.5 rounded bg-black/60 hover:bg-red-950 border border-red-900/50 hover:border-red-500 text-[10px] font-mono text-red-300 transition-colors flex items-center justify-between gap-1 cursor-pointer"
                      >
                        <span className="truncate">⚡ {msg.suggestedPrompt}</span>
                        <ChevronRight className="w-3 h-3 shrink-0" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-[#120404] border border-red-900/70 text-red-400 text-xs font-mono p-2.5 rounded-xl rounded-tl-none flex items-center gap-2">
                  <span className="animate-pulse">Synthesizing forensic matrix</span>
                  <span className="flex gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="p-3 border-t border-red-900/60 bg-[#060202]">
            <form onSubmit={handleFormSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Consult SPECTER AI..."
                className="flex-1 bg-black border border-red-900/70 text-slate-100 placeholder:text-red-950/80 font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isThinking}
                className="bg-red-800 hover:bg-red-700 text-white px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all disabled:opacity-40 cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};
