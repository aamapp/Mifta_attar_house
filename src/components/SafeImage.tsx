/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600&auto=format&fit=crop';

export default function SafeImage({ src, fallbackSrc = DEFAULT_FALLBACK, alt, className, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // If the src prop changes externally, reset the internal state
  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-stone-50/50 flex items-center justify-center min-h-[inherit]">
      {/* Skeleton Loading Watermark Component (Daraz-like but with Mifta Attar House branding) */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100 animate-pulse p-4 select-none z-10">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Elegant Brand Icon Symbol / Initials */}
            <div className="w-10 h-10 rounded-full border border-stone-200 bg-white shadow-sm flex items-center justify-center mb-2.5">
              <span className="font-serif font-extrabold text-sm text-stone-400 tracking-wider">M</span>
            </div>
            
            {/* Display brand name in English and Bengali */}
            <span className="font-sans font-black text-xs sm:text-sm tracking-[0.2em] text-stone-450 uppercase leading-none">
              MIFTA
            </span>
            <span className="font-sans font-bold text-[9px] sm:text-[10px] tracking-widest text-stone-400 mt-1.5 uppercase">
              ATTAR HOUSE
            </span>
            <span className="text-[10px] text-stone-300 mt-1 font-medium">
              আতর হাউজ
            </span>
          </div>
          
          {/* Subtle loading line details at the bottom of card area to match Daraz style */}
          <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
            <div className="h-2 bg-stone-200/60 rounded-full w-3/4"></div>
            <div className="h-1.5 bg-stone-200/40 rounded-full w-1/2"></div>
          </div>
        </div>
      )}

      {/* The actual product image */}
      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`${className} transition-opacity duration-300 ${
          isLoading ? 'opacity-0 absolute' : 'opacity-100'
        } ${hasError ? 'opacity-80 grayscale-[0.5]' : ''}`}
        referrerPolicy="no-referrer"
        {...props}
      />
    </div>
  );
}
