import React, { useState, useEffect } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface FullscreenButtonProps {
  className?: string;
  showLabel?: boolean;
}

export const FullscreenButton: React.FC<FullscreenButtonProps> = ({ className = '', showLabel = false }) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    sound.playKeyClick();
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Enter Fullscreen Immersion (F11)'}
      className={`px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-amber-300 transition-all flex items-center gap-1.5 font-mono text-xs cursor-pointer shadow-md ${className}`}
    >
      {isFullscreen ? (
        <Minimize className="w-4 h-4 text-amber-400" />
      ) : (
        <Maximize className="w-4 h-4 text-amber-400" />
      )}
      {showLabel && (
        <span>{isFullscreen ? 'EXIT FULLSCREEN' : 'FULLSCREEN'}</span>
      )}
    </button>
  );
};
