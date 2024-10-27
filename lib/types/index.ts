export interface Slide {
  id: string
  template: "default" | "split"
  title: string
  subtitle?: string
  bodyContent: string[]
  imageUrl?: string
}

export interface SlideUpdates {
  title?: string
  subtitle?: string
  bodyContent?: string[]
  imageUrl?: string
}

export interface Presentation {
  id: string
  title: string
  slides: Slide[]
  createdAt: Date
  updatedAt: Date
}

export interface PresentationStore {
  presentation: Presentation | null
  currentSlideIndex: number
  setPresentation: (presentation: Presentation) => void
  setCurrentSlide: (index: number) => void
  updateSlide: (slideId: string, updates: Partial<SlideUpdates>) => void
}
