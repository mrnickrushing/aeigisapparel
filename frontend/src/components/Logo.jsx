import React from "react";

// AEGIS shield logo (inline SVG so it's crisp at any size & themable)
export default function Logo({ className = "w-8 h-8", color = "#D4AF37" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="AEGIS shield"
    >
      <defs>
        <linearGradient id="aegisShield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a3040" />
          <stop offset="100%" stopColor="#0a0d14" />
        </linearGradient>
      </defs>
      <path
        d="M32 2 L60 12 L60 30 C60 46 48 58 32 62 C16 58 4 46 4 30 L4 12 Z"
        fill="url(#aegisShield)"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* Inner A */}
      <path
        d="M32 16 L44 46 L38 46 L35.5 40 L28.5 40 L26 46 L20 46 Z M30 35 L34 35 L32 28 Z"
        fill={color}
      />
      {/* Helmet hint - cross/visor bar */}
      <rect x="29" y="20" width="6" height="2" fill={color} opacity="0.6" />
    </svg>
  );
}
