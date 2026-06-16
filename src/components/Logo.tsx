import React from 'react';

interface LogoProps {
  className?: string;
  glow?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", glow = false }) => {
  return (
    <div className={`relative inline-block ${className} ${glow ? 'drop-shadow-[0_0_15px_rgba(107,207,254,0.35)]' : ''}`}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transform transition-all hover:scale-105 duration-300"
      >
        <defs>
          {/* Main brand gradient for Meta */}
          <linearGradient id="metaGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D649FB" />
            <stop offset="60%" stopColor="#9B7FFD" />
            <stop offset="100%" stopColor="#6BCFFE" />
          </linearGradient>
          
          {/* Intense neon blue gradient for Impulso surge */}
          <linearGradient id="impulseGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6BCFFE" />
            <stop offset="100%" stopColor="#00F2FE" />
          </linearGradient>

          {/* Subtly transparent gradient for glass backdrop */}
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* 1. Glassy modern backdrop disk */}
        <circle cx="50" cy="50" r="46" fill="url(#bgGrad)" stroke="white" strokeWidth="1" strokeOpacity="0.08" />

        {/* 2. Outer Orbital Tech Rings (Representing "Meta" universe & structure) */}
        <circle 
          cx="50" 
          cy="50" 
          r="40" 
          stroke="url(#metaGrad)" 
          strokeWidth="2.5" 
          strokeDasharray="140 60" 
          transform="rotate(-30 50 50)"
          strokeLinecap="round"
          className="opacity-60"
        />
        <circle 
          cx="50" 
          cy="50" 
          r="40" 
          stroke="url(#metaGrad)" 
          strokeWidth="1.5" 
          strokeDasharray="40 100" 
          transform="rotate(120 50 50)"
          strokeLinecap="round"
          className="opacity-30"
        />

        {/* 3. The Stylized M-Chevron Arrow (Representing "Impulso" & exponential scale) */}
        {/* Left Wing Segment */}
        <path 
          d="M 32 64 L 32 38 C 32 35.5 35 34 37 36 L 50 49" 
          stroke="url(#metaGrad)" 
          strokeWidth="8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Right Wing Segment carrying the momentum */}
        <path 
          d="M 50 49 L 63 36 C 65 34 68 35.5 68 38 L 68 64" 
          stroke="url(#metaGrad)" 
          strokeWidth="8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Central Rising Impulse Chevron / Arrow Indicator */}
        <path 
          d="M 50 68 V 32 M 50 32 L 41 41 M 50 32 L 59 41" 
          stroke="url(#impulseGrad)" 
          strokeWidth="4.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* 4. Elegant digital connection nodes */}
        <circle cx="32" cy="64" r="3" fill="#D649FB" />
        <circle cx="68" cy="64" r="3" fill="#6BCFFE" />
        <circle cx="50" cy="23" r="3" fill="#00F2FE" />
      </svg>
    </div>
  );
};
