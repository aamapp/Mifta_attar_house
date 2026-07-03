/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600&auto=format&fit=crop';

export default function SafeImage({ src, fallbackSrc = DEFAULT_FALLBACK, alt, className, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

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

  // Check if image is already loaded/cached on mount or src change
  useEffect(() => {
    if (!src) return;
    
    let active = true;
    const img = new Image();
    img.src = src;
    
    if (img.complete) {
      setIsLoading(false);
    } else {
      img.onload = () => {
        if (active) setIsLoading(false);
      };
      img.onerror = () => {
        if (active) setIsLoading(false);
      };
    }
    
    return () => {
      active = false;
    };
  }, [src]);

  return (
    <>
      {/* Skeleton Loading Watermark overlay inside parent container */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-50 animate-pulse p-4 select-none z-10">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Elegant Brand Icon Symbol / Initials */}
            <div className="w-8 h-8 rounded-full border border-stone-200 bg-white shadow-sm flex items-center justify-center mb-1.5">
              <span className="font-serif font-extrabold text-[11px] text-stone-400 tracking-wider">M</span>
            </div>
            
            {/* Display brand name in English and Bengali */}
            <span className="font-sans font-black text-[9px] tracking-widest text-stone-450 uppercase leading-none">
              MIFTA
            </span>
            <span className="font-sans font-bold text-[7px] tracking-widest text-stone-400 mt-1 uppercase">
              ATTAR HOUSE
            </span>
          </div>
        </div>
      )}

      {/* The actual product image */}
      <img
        ref={imgRef}
        src={imgSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`${className} transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${hasError ? 'opacity-80 grayscale-[0.5]' : ''}`}
        referrerPolicy="no-referrer"
        {...props}
      />
    </>
  );
}
