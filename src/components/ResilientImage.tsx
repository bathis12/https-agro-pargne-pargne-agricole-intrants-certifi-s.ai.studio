import React, { useState } from 'react';
import { Sprout } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackTitle: string;
  className?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  fallbackTitle,
  className = 'w-full h-full object-cover'
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-900 text-stone-100 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Sprout className="w-10 h-10 text-amber-300 mb-3 opacity-90" />
        <span className="text-sm font-semibold tracking-tight max-w-[24ch] text-stone-100">
          {fallbackTitle}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
