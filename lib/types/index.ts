// Core types that are used throughout the application
export type SlideTemplate =
  | "default"
  | "hero"
  | "table-of-contents"
  | "grid-content"
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

export interface CustomSlide {
  title: string
  subtitle?: string
  bodyContent: string[]
  imageSearch?: string
  template?: SlideTemplate
}

export interface CustomPresentation {
  presentationTitle?: string
  title?: string
  slides?: CustomSlide[]
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

// Type guard functions
const isCustomSlide = (
  slide: ImportedSlide | CustomSlide
): slide is CustomSlide => {
  return "imageSearch" in slide
}

const isImportedSlide = (
  slide: ImportedSlide | CustomSlide
): slide is ImportedSlide => {
  return "imageUrl" in slide || "image" in slide
}

// Validation functions
export const validateImportedSlide = (
  slide: ImportedSlide | CustomSlide
): Slide => {
  // Determine template based on content
  let template: SlideTemplate = "default"

  // Determine if the slide has an image based on slide type
  let hasImage = false

  if (isCustomSlide(slide)) {
    hasImage = !!slide.imageSearch
  } else if (isImportedSlide(slide)) {
    hasImage = !!(slide.image?.url || slide.imageUrl)
  }

  if (hasImage) {
    template = "image-right"
  }

  const validatedSlide: Slide = {
    id:
      ("id" in slide && slide.id) ||
      `slide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    template: (slide.template as SlideTemplate) || template,
    title: slide.title || "Untitled Slide",
    bodyContent: Array.isArray(slide.bodyContent)
      ? slide.bodyContent
      : ["Add content here"]
  }

  // Handle image data based on slide type
  if (isCustomSlide(slide) && slide.imageSearch) {
    validatedSlide.image = {
      url: slide.imageSearch,
      position: "right",
      size: "medium"
    }
  } else if (isImportedSlide(slide)) {
    if (slide.image) {
      validatedSlide.image = {
        url: slide.image.url,
        position: slide.image.position || "right",
        size: slide.image.size || "medium",
        alt: slide.image.alt,
        backgroundOverlay: slide.image.backgroundOverlay
      }
    } else if (slide.imageUrl) {
      validatedSlide.image = {
        url: slide.imageUrl,
        position: "right",
        size: "medium"
      }
    }
  }

  if (slide.subtitle) {
    validatedSlide.subtitle = slide.subtitle
  }

  // Set appropriate theme based on template
  validatedSlide.theme =
    "theme" in slide && slide.theme
      ? slide.theme
      : {
          background: "bg-gradient-to-r from-gray-900 to-gray-800",
          textColor: "text-white"
        }

  return validatedSlide
}

export const validateImportedPresentation = (
  jsonData: ImportedPresentation | CustomPresentation
): Presentation => {
  // Handle both standard and custom presentation formats
  const title =
    "presentationTitle" in jsonData
      ? jsonData.presentationTitle || jsonData.title || "Untitled Presentation"
      : jsonData.title || "Untitled Presentation"

  const validatedSlides = Array.isArray(jsonData.slides)
    ? jsonData.slides.map(validateImportedSlide)
    : []

  return {
    id: ("id" in jsonData && jsonData.id) || `pres_${Date.now()}`,
    title,
    slides: validatedSlides,
    createdAt: new Date(
      ("createdAt" in jsonData && jsonData.createdAt) || Date.now()
    ),
    updatedAt: new Date(
      ("updatedAt" in jsonData && jsonData.updatedAt) || Date.now()
    )
  }
}
