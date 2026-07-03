/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';

export default function ProductSkeleton() {
  const { language } = useApp();

  return (
    <div className="relative flex flex-col h-full rounded bg-white border border-gray-100 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] animate-pulse">
      {/* Image Preview Container Skeleton */}
      <div className="relative pt-[100%] overflow-hidden bg-stone-100 flex items-center justify-center">
        {/* Centered Watermark Brand Logo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center select-none">
          <span className="font-sans font-black text-xs sm:text-sm tracking-widest text-stone-300 uppercase">
            MIFTA
          </span>
          <span className="font-sans font-bold text-[10px] sm:text-xs tracking-wider text-stone-300 mt-1">
            {language === 'en' ? 'Attar House' : 'আতর হাউজ'}
          </span>
        </div>
      </div>

      {/* Product Information Skeleton */}
      <div className="flex-1 p-4 flex flex-col justify-between space-y-3 bg-white border-t border-gray-50">
        <div className="space-y-2">
          {/* Title Lines */}
          <div className="h-3.5 bg-stone-100 rounded w-5/6"></div>
          <div className="h-3.5 bg-stone-100 rounded w-2/3"></div>

          {/* Pricing Row */}
          <div className="flex items-center gap-2 pt-2">
            <div className="h-4 bg-stone-200 rounded w-16"></div>
            <div className="h-3.5 bg-stone-100 rounded w-12"></div>
          </div>
          
          {/* Save Tag */}
          <div className="h-4 bg-green-50 rounded w-20 mt-1"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * A beautiful grid of skeleton cards to represent loading state.
 */
export function ProductSkeletonGrid({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}
