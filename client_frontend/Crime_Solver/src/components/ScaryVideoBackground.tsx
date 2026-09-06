import React from 'react';

export const ScaryVideoBackground: React.FC<{ variant: 'menu' | 'scene' }> = ({ variant }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#030000]">
      
      {/* Deep Red Pulsating Core */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${variant === 'scene' ? 'opacity-40' : 'opacity-20'}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/40 via-black to-black animate-pulse" style={{ animationDuration: '4s' }} />
      </div>
      
      {/* Procedural Fog / Noise Overlay */}
      <div className="absolute inset-0 opacity-30 mix-blend-color-dodge">
         <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
              <feColorMatrix type="matrix" values="1 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 0.4 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
         </svg>
      </div>

      {/* Creepy Drifting Shadows */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-40 mix-blend-multiply animate-fog" />
      
      {/* Vignette border */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,1)]" />
    </div>
  );
};
