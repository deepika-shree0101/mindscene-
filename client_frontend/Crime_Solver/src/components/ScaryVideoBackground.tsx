import React from 'react';

export const ScaryVideoBackground: React.FC<{ variant: 'menu' | 'scene' }> = ({ variant }) => {
  // Using public domain / royalty-free spooky looping video URLs
  const videoUrl = variant === 'menu' 
    ? "https://cdn.pixabay.com/video/2021/08/25/86266-592657373_tiny.mp4" // Creepy foggy night/moon
    : "https://cdn.pixabay.com/video/2020/10/26/53410-476722839_tiny.mp4"; // Spooky shadows / dark room

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
      {/* Video layer */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen"
        src={videoUrl}
      />
      
      {/* Fog Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-30 animate-fog mix-blend-overlay" />
      
      {/* Red Ambient Tint */}
      <div className="absolute inset-0 bg-red-900/10 mix-blend-multiply" />
    </div>
  );
};
