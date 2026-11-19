import React from 'react';

export interface AppIconProps {
  className?: string;
  size?: number;
  interactive?: boolean;
  onClick?: () => void;
  title?: string;
}

export function AppIcon({
  className = "w-6 h-6",
  size = 24,
  interactive = false,
  onClick,
  title,
}: AppIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${interactive ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <rect width="32" height="32" rx="8" fill="#12130E" stroke="#F59E0B" strokeWidth="2" />
      <path d="M8 10H24M8 16H24M8 22H18" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="22" cy="22" r="4" fill="#EF4444" stroke="#12130E" strokeWidth="1.5" />
    </svg>
  );
}
