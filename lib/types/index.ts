// Types for our presentation data structure
export interface Slide {
    id: string;
    template: string;
    title: string;
    subtitle?: string;
    bodyContent: string[];
    imageUrl?: string;
  }
  
  export interface Presentation {
    id: string;
    title: string;
    slides: Slide[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Store types
  export interface PresentationStore {
    presentation: Presentation | null;
    currentSlideIndex: number;
    setPresentation: (presentation: Presentation) => void;
    setCurrentSlide: (index: number) => void;
    updateSlide: (slideId: string, updates: Partial<Slide>) => void;
  }