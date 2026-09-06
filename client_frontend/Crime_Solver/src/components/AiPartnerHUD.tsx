import React, { useState } from 'react';
import type { Clue } from '../types';
import { sound } from '../utils/soundEngine';
import { Bot, Send, Sparkles, X, Activity } from 'lucide-react';

interface AiPartnerHUDProps {
  caseId: string;
  discoveredClues: Clue[];
  activeSceneName: string;
}

interface ChatMessage {
  sender: 'AGENT' | 'SPECTER';
  text: string;
  suggestedPrompt?: string;
}

export const AiPartnerHUD: React.FC<AiPartnerHUDProps> = ({
  caseId,
  discoveredClues,
  activeSceneName,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'SPECTER',
      text: `SPECTER Forensic AI initialized for active zone: [${activeSceneName}]. Ask me to analyze photographs, compare suspect alibis, or evaluate discovered evidence.`,
      suggestedPrompt: 'What should we inspect first?',
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    sound.playKeyClick();
    const userMsg: ChatMessage = { sender: 'AGENT', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          userMessage: textToSend,
          discoveredClueIds: discoveredClues.map((c) => c.id),
          sceneId: activeSceneName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        sound.playAccessGranted();
        setMessages((prev) => [
          ...prev,
          {
            sender: 'SPECTER',
            text: data.response,
            suggestedPrompt: data.suggestedQuestion,
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'SPECTER',
            text: 'SPECTER: Communication frequency disrupted. Check local crime scene telemetry.',
          }
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'SPECTER',
          text: 'SPECTER: Uplink offline. Operating in local diagnostic mode.',
        }
      ]);
    } finally {
      setIsThinking(false);
    }
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
          }}
          className="group relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-950/90 hover:bg-red-900 border border-red-400/60 shadow-2xl hover:shadow-red-500/40 text-white font-creepster text-xs font-bold transition-all cursor-pointer hover:scale-105"
        >
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-300 relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-400" />
          </div>
          <div className="text-left">
            <div className="text-red-300 text-xs">SPECTER AI</div>
            <div className="text-[10px] font-mono text-slate-400">PARTNER COMMS</div>
          </div>
        </button>
      ) : (
        <div className="w-[360px] sm:w-[420px] h-[520px] glass-panel-crimson border border-red-500/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-3.5 bg-slate-950/80 border-b border-red-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-red-950 border border-red-600 flex items-center justify-center text-red-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="font-creepster font-bold text-xs text-white flex items-center gap-1.5">
                  <span>SPECTER // AI INVESTIGATOR</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                </div>
                <div className="text-[10px] font-mono text-red-400/80">CONTEXT: {discoveredClues.length} CLUES LOGGED</div>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playKeyClick();
                setIsOpen(false);
              }}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-red-400 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Audio Waveform Indicator */}
          <div className="px-4 py-1.5 bg-red-950/30 border-b border-red-900/30 flex items-center justify-between text-[10px] font-mono text-red-400">
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-red-400 animate-pulse" />
              <span>QUANTUM NEURAL LINK ACTIVE</span>
            </div>
            <span className="text-slate-400">NO SPOILERS POLICY</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'AGENT' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'AGENT'
                      ? 'bg-red-600 text-slate-950 font-semibold rounded-br-none shadow-md'
                      : 'bg-slate-900/90 border border-red-900/60 text-slate-200 rounded-bl-none shadow-lg'
                  }`}
                >
                  <span className="text-[9px] uppercase tracking-wider block mb-1 opacity-70">
                    {msg.sender === 'AGENT' ? 'OPERATIVE' : 'SPECTER AI'}
                  </span>
                  <p>{msg.text}</p>
                </div>

                {/* Prompt Suggestion Chip */}
                {msg.suggestedPrompt && (
                  <button
                    onClick={() => sendMessage(msg.suggestedPrompt!)}
                    className="mt-1.5 text-[10px] text-red-400 hover:text-red-300 bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 rounded-full px-2.5 py-1 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Ask: "{msg.suggestedPrompt}"</span>
                  </button>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-red-400 text-xs font-mono py-2">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                <span>SPECTER is correlating evidence threads...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleFormSubmit} className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask SPECTER about clues, motives, alibis..."
              className="flex-1 bg-slate-900 border border-slate-700 focus:border-red-400 text-slate-200 font-mono text-xs px-3 py-2 rounded-lg outline-none"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isThinking}
              className="p-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-40 text-slate-950 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
