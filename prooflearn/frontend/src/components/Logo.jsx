import React from 'react';

const Logo = ({ className = "h-8" }) => (
    <div className={`flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-10 h-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
            <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
            </defs>
            <path
                d="M20 50 L50 20 L80 50 L50 80 Z"
                fill="none"
                stroke="url(#logo-grad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M35 50 L50 35 L65 50 L50 65 Z"
                fill="url(#logo-grad)"
                opacity="0.8"
            />
            <circle cx="50" cy="50" r="10" fill="white" className="animate-pulse" />
        </svg>
        <span className="text-2xl font-black tracking-tighter gradient-text uppercase">ProofLearn</span>
    </div>
);

export default Logo;
