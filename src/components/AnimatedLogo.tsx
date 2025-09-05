
import React, { useState, useEffect } from 'react';

const AnimatedLogo = ({ className = "w-16 h-16" }: { className?: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`relative ${className} cursor-pointer group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo principal */}
      <div className={`
        relative w-full h-full transition-all duration-700 ease-in-out transform
        ${isHovered ? 'scale-110 rotate-6' : 'scale-100 rotate-0'}
        ${animationPhase === 1 ? 'scale-105' : ''}
      `}>
        <img 
          src="/lovable-uploads/4abedd4c-64ac-4b74-a4c4-84b13ada9c5b.png" 
          alt="Logo Groupe FADEM SARL-U"
          className="w-full h-full object-contain drop-shadow-lg"
          style={{
            filter: isHovered 
              ? 'drop-shadow(0 0 20px rgba(220, 38, 38, 0.4)) drop-shadow(0 0 40px rgba(30, 58, 138, 0.3))' 
              : 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))',
            transition: 'filter 0.5s ease'
          }}
        />
      </div>

      {/* Effet de brillance */}
      <div className={`
        absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
        transform -skew-x-12 transition-all duration-1000
        ${animationPhase === 2 ? 'translate-x-full opacity-100' : '-translate-x-full opacity-0'}
      `} />

      {/* Anneaux de pulsation */}
      {isHovered && (
        <>
          <div className="absolute inset-0 rounded-full border-2 border-fadem-gold/30 animate-ping" />
          <div className="absolute inset-0 rounded-full border-2 border-fadem-red/20 animate-ping" style={{ animationDelay: '0.5s' }} />
        </>
      )}

      {/* Particules flottantes */}
      {isHovered && (
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-fadem-gold rounded-full animate-bounce opacity-60"
              style={{
                top: `${20 + Math.sin(i * 45 * Math.PI / 180) * 30}%`,
                left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 30}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${1 + Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Effet de lueur respirante */}
      <div className={`
        absolute inset-0 rounded-full transition-all duration-2000
        ${animationPhase === 0 ? 'shadow-lg shadow-fadem-blue/20' : 
          animationPhase === 1 ? 'shadow-xl shadow-fadem-gold/30' :
          animationPhase === 2 ? 'shadow-lg shadow-fadem-red/20' : 
          'shadow-md shadow-gray-300/20'}
      `} />

      {/* Texte sous le logo (responsive) */}
      <div className={`
        absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap
        transition-all duration-500 ease-in-out text-center
        ${isHovered ? 'scale-105 text-fadem-blue' : 'scale-100 text-gray-700'}
        ${className.includes('w-24') || className.includes('w-32') ? 'block' : 'hidden'}
      `}>
        <div className="text-xs font-bold tracking-wider">
          <span className="text-fadem-red">GROUPE</span>{' '}
          <span className="text-fadem-blue">FADEM</span>
        </div>
        <div className="text-xs font-bold tracking-widest mt-1 text-fadem-blue">
          SARL-U
        </div>
      </div>
    </div>
  );
};

export default AnimatedLogo;
