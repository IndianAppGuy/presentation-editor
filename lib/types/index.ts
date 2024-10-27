// lib/types/index.ts

export type SlideTemplate = "default" | "split"

export interface Slide {
  id: string
  template: SlideTemplate
  title: string
  subtitle?: string
  bodyContent: string[]
  imageUrl?: string
}

export interface SlideData {
  template?: SlideTemplate
  title?: string
  subtitle?: string
  bodyContent?: string[]
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

// Type for imported JSON data
export interface ImportedPresentation {
  id?: string
  title?: string
  slides?: ImportedSlide[]
  createdAt?: string | number | Date
  updatedAt?: string | number | Date
}

export interface ImportedSlide {
  id?: string
  template?: string
  title?: string
  subtitle?: string
  bodyContent?: string[]
  imageUrl?: string
}

export const validateImportedSlide = (slide: ImportedSlide): Slide => ({
  id:
    slide.id ||
    `slide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  template: (slide.template as SlideTemplate) || "default",
  title: slide.title || "Untitled Slide",
  bodyContent: Array.isArray(slide.bodyContent)
    ? slide.bodyContent
    : ["Add content here"],
  ...(slide.subtitle && { subtitle: slide.subtitle }),
  ...(slide.imageUrl && { imageUrl: slide.imageUrl })
})

export const validateImportedPresentation = (
  jsonData: ImportedPresentation
): Presentation => ({
  id: jsonData.id || `pres_${Date.now()}`,
  title: jsonData.title || "Untitled Presentation",
  slides: Array.isArray(jsonData.slides)
    ? jsonData.slides.map(validateImportedSlide)
    : [],
  createdAt: new Date(jsonData.createdAt || Date.now()),
  updatedAt: new Date(jsonData.updatedAt || Date.now())
})
