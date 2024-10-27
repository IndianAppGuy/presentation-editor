import React from 'react';
import { usePresentation } from '@/lib/store/presentation';
import { Plus } from 'lucide-react';

export default function Sidebar() {
  const { presentation, currentSlideIndex, setCurrentSlide } = usePresentation();
  
  if (!presentation) return null;

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <button className="w-full flex items-center justify-center space-x-2 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          <Plus className="w-4 h-4" />
          <span>Add Slide</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {presentation.slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`
              p-3 rounded-lg cursor-pointer
              ${currentSlideIndex === index 
                ? 'bg-blue-100 border-2 border-blue-500' 
                : 'hover:bg-gray-100 border-2 border-transparent'
              }
            `}
            onClick={() => setCurrentSlide(index)}
          >
            <div className="text-sm font-medium truncate">{slide.title}</div>
            <div className="text-xs text-gray-500">Slide {index + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
}