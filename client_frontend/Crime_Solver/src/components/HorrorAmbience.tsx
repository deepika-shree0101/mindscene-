import React, { useEffect, useState } from 'react';
import { sound } from '../utils/soundEngine';
import { Volume2, VolumeX, Zap } from 'lucide-react';

export const HorrorAmbience: React.FC = () => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [isLightning, setIsLightning] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);

  // Start suspense drone on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!audioStarted) {
        sound.initContext();
        sound.startSuspenseDrone();
        setAudioStarted(true);
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [audioStarted]);

  // Periodic Random Lightning and Thunder
  useEffect(() => {
    const interval = setInterval(() => {
      // 30% chance every 25 seconds
      if (Math.random() < 0.35) {
        triggerLightning();
      }
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const triggerLightning = () => {
    setIsLightning(true);
    sound.playThunder();
    setTimeout(() => setIsLightning(false), 120);
    setTimeout(() => {
      setIsLightning(true);
      setTimeout(() => setIsLightning(false), 80);
    }, 200);
  };

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playAccessGranted();
    }
  };

  return (
    <>
      {/* Lightning Flash Overlay */}
      {isLightning && (
        <div className="fixed inset-0 z-50 pointer-events-none bg-white/25 mix-blend-screen transition-opacity duration-75" />
      )}

      {/* Floating Audio & Horror Atmosphere Controls (Bottom-Left so it never blocks top navigation) */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
        <button
          onClick={handleToggleSound}
          title={isMuted ? "Unmute Horror Ambience & Voices" : "Mute Sound"}
          className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer shadow-lg ${
            isMuted
              ? 'bg-black/80 border-red-900/50 text-red-500/60 hover:text-red-400'
              : 'bg-red-950/80 border-red-500/60 text-red-300 hover:border-red-400 shadow-red-950/50'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-red-400 animate-pulse" />}
          <span className="hidden sm:inline">{isMuted ? 'AUDIO OFF' : 'HORROR AUDIO LIVE'}</span>
        </button>

        {!isMuted && (
          <button
            onClick={triggerLightning}
            title="Trigger Atmospheric Lightning & Thunder"
            className="p-1.5 rounded-lg bg-black/80 border border-red-900/50 text-red-400/80 hover:text-red-300 hover:border-red-500 transition-all cursor-pointer backdrop-blur-md"
          >
            <Zap className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </>
  );
};
