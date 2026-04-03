import React from 'react';

interface ImageDisplayProps {
  src: string;
  alt: string;
}

export function ImageDisplay({ src, alt }: ImageDisplayProps) {
  return (
    <div className="w-full h-[320px] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
}
