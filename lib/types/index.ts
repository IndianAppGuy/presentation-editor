// Core types that are used throughout the application
export type SlideTemplate =
  | "default"
  | "image-right"
  | "image-left"
  | "full-image"
  | "split-image"
  | "gallery"

export type ImagePosition = "left" | "right" | "center" | "background"
export type ImageSize = "small" | "medium" | "large" | "full"
export type TemplateCategory = "Basic" | "Image" | "Content" | "Special"

export interface SlideImage {
  url: string
  alt?: string
  position?: ImagePosition
  size?: ImageSize
  backgroundOverlay?: boolean
}

export interface SlideTheme {
  background?: string
  textColor?: string
  accentColor?: string
  fontFamily?: string
}

export interface Slide {
  id: string
  template: SlideTemplate
  title: string
  subtitle?: string
  bodyContent: string[]
  image?: SlideImage
  imageUrl?: string // For backward compatibility
  theme?: SlideTheme
}

export interface SlideUpdates {
  title?: string
  subtitle?: string
  bodyContent?: string[]
  image?: SlideImage
  imageUrl?: string // For backward compatibility
  theme?: SlideTheme
}

export interface Presentation {
  id: string
  title: string
  slides: Slide[]
  createdAt: Date
  updatedAt: Date
}

// Store related types
export interface PresentationStore {
  presentation: Presentation | null
  currentSlideIndex: number
  setPresentation: (presentation: Presentation) => void
  setCurrentSlide: (index: number) => void
  updateSlide: (slideId: string, updates: Partial<SlideUpdates>) => void
  updateSlideTemplate: (slideId: string, template: SlideTemplate) => void
}

// Import/Export related types
export interface ImportedSlide {
  id?: string
  template?: string
  title?: string
  subtitle?: string
  bodyContent?: string[]
  imageUrl?: string
  image?: SlideImage
  theme?: SlideTheme
}

export interface ImportedPresentation {
  id?: string
  title?: string
  slides?: ImportedSlide[]
  createdAt?: string | number | Date
  updatedAt?: string | number | Date
}

// Validation functions
export const validateImportedSlide = (slide: ImportedSlide): Slide => {
  const validatedSlide: Slide = {
    id:
      slide.id ||
      `slide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    template: (slide.template as SlideTemplate) || "default",
    title: slide.title || "Untitled Slide",
    bodyContent: Array.isArray(slide.bodyContent)
      ? slide.bodyContent
      : ["Add content here"]
  }

  if (slide.image) {
    validatedSlide.image = slide.image
  } else if (slide.imageUrl) {
    validatedSlide.image = {
      url: slide.imageUrl,
      position: "center",
      size: "medium"
    }
    validatedSlide.imageUrl = slide.imageUrl
  }

  if (slide.subtitle) validatedSlide.subtitle = slide.subtitle
  if (slide.theme) validatedSlide.theme = slide.theme

  return validatedSlide
}

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
