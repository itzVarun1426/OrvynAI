import React, { useState } from 'react';

/**
 * Reusable OrvynAI Logo Component
 * - If an image exists at /logo.png, /logo.svg, or /favicon.png, it displays the image.
 * - Otherwise, it falls back to a sleek gradient mark with the letter "O".
 */
const Logo = ({ size = 'md', className = '' }) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-7 h-7 text-sm rounded-lg',
    md: 'w-9 h-9 text-lg rounded-xl',
    lg: 'w-11 h-11 text-xl rounded-2xl',
  };

  const dim = sizeClasses[size] || sizeClasses.md;

  if (!imgError) {
    return (
      <img
        src="/logo.png"
        onError={() => setImgError(true)}
        alt="OrvynAI Logo"
        className={`${dim} object-contain shrink-0 shadow-md shadow-emerald-500/20 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${dim} bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 flex items-center justify-center text-slate-950 font-black font-space-grotesk shrink-0 shadow-md shadow-emerald-500/25 ${className}`}
    >
      O
    </div>
  );
};

export default Logo;
