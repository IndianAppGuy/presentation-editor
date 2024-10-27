import React from 'react';
import { usePresentation } from '@/lib/store/presentation';

export default function Canvas() {
  const { presentation, currentSlideIndex } = usePresentation();
  
  if (!presentation) return null;
  
  const currentSlide = presentation.slides[currentSlideIndex];

  return (
    <div className="flex-1 bg-gray-100 p-8 overflow-auto">
      <div className="max-w-5xl mx-auto">
        {/* 16:9 aspect ratio container */}
        <div className="relative bg-white shadow-lg rounded-lg" style={{ aspectRatio: '16/9' }}>
          <div className="absolute inset-0 p-8">
            <h1 className="text-4xl font-bold mb-4">{currentSlide.title}</h1>
            {currentSlide.subtitle && (
              <h2 className="text-2xl text-gray-600 mb-6">{currentSlide.subtitle}</h2>
            )}
            <div className="space-y-4">
              {currentSlide.bodyContent.map((content, index) => (
                <p key={index} className="text-lg">
                  {content}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}