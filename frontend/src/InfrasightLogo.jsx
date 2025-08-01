import React from "react";

const InfrasightLogo = ({ size = 160, style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Infrasight AI Logo"
  >
    {/* Glassy eye shape */}
    <ellipse
      cx="100"
      cy="100"
      rx="90"
      ry="48"
      fill="url(#glass)"
      opacity="0.85"
      filter="url(#eyeBlur)"
    />
    {/* Eye outline */}
    <ellipse
      cx="100"
      cy="100"
      rx="90"
      ry="48"
      fill="none"
      stroke="#1A237E"
      strokeWidth="4"
      opacity="0.92"
    />
    {/* Glow ring */}
    <ellipse
      cx="100"
      cy="100"
      rx="60"
      ry="32"
      fill="none"
      stroke="url(#glow)"
      strokeWidth="6"
      opacity="0.7"
      filter="url(#glowBlur)"
    />
    {/* Iris with data rings */}
    <circle
      cx="100"
      cy="100"
      r="32"
      fill="url(#irisGradient)"
      stroke="#00E5FF"
      strokeWidth="4"
      filter="url(#irisGlow)"
    />
    <circle
      cx="100"
      cy="100"
      r="22"
      fill="none"
      stroke="#00E5FF"
      strokeWidth="1.5"
      opacity="0.4"
    />
    <circle
      cx="100"
      cy="100"
      r="13"
      fill="none"
      stroke="#00E5FF"
      strokeWidth="1"
      opacity="0.2"
    />
    {/* Cityscape as negative space */}
    <g>
      <rect x="72" y="120" width="8" height="18" rx="2" fill="#e3f6fd" opacity="0.7" />
      <rect x="83" y="112" width="7" height="26" rx="2" fill="#00E5FF" opacity="0.8" />
      <rect x="92" y="125" width="6" height="13" rx="2" fill="#1A237E" opacity="0.8" />
      <rect x="100" y="117" width="8" height="21" rx="2" fill="#00E5FF" opacity="0.8" />
      <rect x="111" y="122" width="6" height="16" rx="2" fill="#1A237E" opacity="0.8" />
      <rect x="119" y="115" width="7" height="23" rx="2" fill="#00E5FF" opacity="0.8" />
      <rect x="128" y="127" width="6" height="11" rx="2" fill="#e3f6fd" opacity="0.7" />
    </g>
    {/* Circuit lines */}
    <g stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" opacity="0.8">
      <line x1="100" y1="68" x2="100" y2="38" />
      <circle cx="100" cy="38" r="3" fill="#00E5FF" />
      <line x1="132" y1="100" x2="162" y2="100" />
      <circle cx="162" cy="100" r="3" fill="#00E5FF" />
      <line x1="100" y1="132" x2="100" y2="162" />
      <circle cx="100" cy="162" r="3" fill="#00E5FF" />
      <line x1="68" y1="100" x2="38" y2="100" />
      <circle cx="38" cy="100" r="3" fill="#00E5FF" />
    </g>
    {/* SVG defs */}
    <defs>
      <radialGradient id="irisGradient" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#1A237E" stopOpacity="0.95" />
      </radialGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
        <stop stopColor="#e3f6fd" stopOpacity="0.7" />
        <stop offset="1" stopColor="#1A237E" stopOpacity="0.18" />
      </linearGradient>
      <linearGradient id="glow" x1="40" y1="60" x2="160" y2="140" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00E5FF" stopOpacity="0.7" />
        <stop offset="1" stopColor="#00E5FF" stopOpacity="0" />
      </linearGradient>
      <filter id="eyeBlur" x="0" y="0" width="200" height="200">
        <feGaussianBlur stdDeviation="2" />
      </filter>
      <filter id="glowBlur" x="0" y="0" width="200" height="200">
        <feGaussianBlur stdDeviation="6" />
      </filter>
      <filter id="irisGlow" x="68" y="68" width="64" height="64">
        <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#00E5FF" floodOpacity="0.5" />
      </filter>
    </defs>
  </svg>
);

export default InfrasightLogo;