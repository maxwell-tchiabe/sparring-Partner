import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const LogoA = ({
  className = '',
  width = 120,
  height = 120,
}: LogoProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 200 200"
    className={`inline-block ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4776E6" />
        <stop offset="100%" stopColor="#8E54E9" />
      </linearGradient>
    </defs>

    <path
      d="M60,60 L140,60 L140,120 L100,120 L80,140 L80,120 L60,120 Z"
      fill="url(#gradient)"
    />

    <circle cx="100" cy="90" r="20" fill="#fff" opacity="0.2" />
    <path
      d="M85,90 A15,15 0 0,1 115,90 M100,75 A15,15 0 0,0 100,105"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
    />
    <text
      x="100"
      y="95"
      fontFamily="Arial"
      fontSize="12"
      textAnchor="middle"
      fill="#fff"
    >
      A
    </text>
  </svg>
);
