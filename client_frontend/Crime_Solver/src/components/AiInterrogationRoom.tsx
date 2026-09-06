import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, X, UserMinus } from 'lucide-react';
import type { CaseData } from '../types';

interface AiInterrogationRoomProps {
  caseData: CaseData;
  discoveredClueIds: string[];
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'player' | 'suspect';
  text: string;
  timestamp: Date;
}

export const AiInterrogationRoom: React.FC<AiInterrogationRoomProps> = ({
  caseData,
  discoveredClueIds,
  onClose,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSuspect, setSelectedSuspect] = useState(caseData.suspects[0]?.name || 'Unknown Suspect');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Initial suspect message
    setMessages([
      {
        id: '1',
        sender: 'suspect',
        text: `Yeah? What do you want? Make it quick, I don't have all day.`,
        timestamp: new Date(),
      }
    ]);
  }, [selectedSuspect]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = inputText;
    setInputText('');
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'player',
      text: userMessage,
      timestamp: new Date(),
    }]);

    setIsTyping(true);

    try {
      const savedToken = localStorage.getItem('cib_token');
      const res = await fetch('/api/ai/interrogate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${savedToken}`
        },
        body: JSON.stringify({
          caseId: caseData.id,
          userMessage: userMessage,
          discoveredClueIds: discoveredClueIds,
          focusedSubject: selectedSuspect
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'suspect',
          text: data.response,
          timestamp: new Date(),
        }]);
      } else {
        throw new Error('Failed to reach AI Core');
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'suspect',
        text: "[CONNECTION SEVERED] ... Suspect refused to answer.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#0a0000] border-2 border-red-900/50 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.15)] flex flex-col h-[80vh] relative overflow-hidden">
        
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 scanlines pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-red-900/50 bg-red-950/20 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-950 border border-red-500 flex items-center justify-center text-red-400">
              <UserMinus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-creepster text-xl text-red-100 tracking-wider">INTERROGATION ROOM 4B</h2>
              <div className="flex items-center gap-2 text-xs font-mono text-red-500/70">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                RECORDING ACTIVE
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <select 
              value={selectedSuspect}
              onChange={(e) => setSelectedSuspect(e.target.value)}
              className="bg-black border border-red-900 text-red-400 text-xs font-mono p-1 rounded"
            >
              {caseData.suspects.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
            <button onClick={onClose} className="text-red-500 hover:text-red-300 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10 font-sans">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'player' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-xl ${
                msg.sender === 'player' 
                  ? 'bg-red-900/40 border border-red-500/30 text-red-100 rounded-tr-none' 
                  : 'bg-black border border-red-900/50 text-slate-300 rounded-tl-none shadow-[0_0_15px_rgba(220,38,38,0.1)]'
              }`}>
                <div className={`text-[10px] font-mono font-bold mb-1 ${msg.sender === 'player' ? 'text-red-400 text-right' : 'text-red-600'}`}>
                  {msg.sender === 'player' ? `AGENT ${user?.username?.toUpperCase() || 'UNKNOWN'}` : selectedSuspect.toUpperCase()}
                </div>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-black border border-red-900/50 text-red-500/50 text-xs font-mono p-3 rounded-xl rounded-tl-none flex items-center gap-2">
                <span>Suspect is typing</span>
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

        {/* Input Area */}
        <div className="p-4 border-t border-red-900/50 bg-black/60 relative z-10">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your question to the suspect..."
              className="flex-1 bg-red-950/20 border border-red-900/50 text-red-100 placeholder-red-900 font-mono text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="bg-red-900 hover:bg-red-800 text-red-100 px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <span>INTERROGATE</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
};
