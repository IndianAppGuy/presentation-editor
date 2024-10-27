import {
  Slide,
  SlideImage,
  SlideTemplate,
  SlideTheme,
  TemplateCategory
} from "./index"

export interface TemplateConfig {
  id: SlideTemplate
  name: string
  category: TemplateCategory
  description: string
  thumbnail?: string
  supports: {
    images: boolean
    subtitle: boolean
    theme: boolean
    backgroundImage: boolean
  }
  defaultTheme?: SlideTheme
}

export interface TemplateProps {
  slide: Slide
  onEdit: (field: string, value: string | SlideImage, index?: number) => void
  theme?: SlideTheme
}

// Template utility functions
export const isTemplateCompatible = (
  template: TemplateConfig,
  slide: Slide
): boolean => {
  const { supports } = template
  return !(
    (!supports.images && slide.image) ||
    (!supports.subtitle && slide.subtitle) ||
    (!supports.theme && slide.theme)
  )
}
