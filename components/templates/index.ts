import { SlideTemplate, TemplateCategory } from "@/lib/types"
import { TemplateConfig, TemplateProps } from "@/lib/types/templates"
import GridContentTemplate from "./GridContentTemplate"
import HeroTemplate from "./HeroTemplate"
import ImageLeftTemplate from "./ImageLeftTemplate"
import ImageRightTemplate from "./ImageRightTemplate"
import SplitImageTemplate from "./SplitImageTemplate"
import TableOfContentsTemplate from "./TableOfContentsTemplate"
import Template1 from "./Template1"

// Type-safe template registry
export const templates: Record<
  SlideTemplate,
  React.ComponentType<TemplateProps>
> = {
  default: Template1,
  hero: HeroTemplate,
  "table-of-contents": TableOfContentsTemplate,
  "image-right": ImageRightTemplate,
  "grid-content": GridContentTemplate,
  "image-left": ImageLeftTemplate,
  "split-image": SplitImageTemplate,
  "full-image": ImageRightTemplate,
  gallery: Template1
} as const

// Template configurations
export const templateConfigs: TemplateConfig[] = [
  {
    id: "hero",
    name: "Hero Layout",
    category: "Special" as TemplateCategory,
    description:
      "Dramatic opening slide with curved image and gradient background",
    supports: {
      images: true,
      subtitle: true,
      theme: true,
      backgroundImage: false
    },
    defaultTheme: {
      background:
        "bg-gradient-to-br from-gray-900 via-purple-900/40 to-teal-800/30",
      textColor: "text-white"
    }
  },
  {
    id: "default",
    name: "Basic Template",
    category: "Basic" as TemplateCategory,
    description: "Clean template with title and bullet points",
    supports: {
      images: false,
      subtitle: true,
      theme: true,
      backgroundImage: false
    },
    defaultTheme: {
      background: "bg-gradient-to-r from-blue-900 to-blue-800",
      textColor: "text-white"
    }
  },
  {
    id: "table-of-contents",
    name: "Table of Contents",
    category: "Special" as TemplateCategory,
    description: "Display a structured table of contents with numbers",
    supports: {
      images: false,
      subtitle: false,
      theme: true,
      backgroundImage: false
    },
    defaultTheme: {
      background: "bg-gradient-to-br from-black via-purple-900 to-cyan-900",
      textColor: "text-white"
    }
  },
  {
    id: "grid-content",
    name: "Grid Content",
    category: "Content" as TemplateCategory,
    description: "Display content in a 5-column grid layout with cards",
    supports: {
      images: false,
      subtitle: true,
      theme: true,
      backgroundImage: false
    },
    defaultTheme: {
      background: "bg-gradient-to-br from-black via-purple-900 to-cyan-900",
      textColor: "text-white"
    }
  },
  {
    id: "image-left",
    name: "Image Left",
    category: "Image" as TemplateCategory,
    description: "Image on the left with content on the right",
    supports: {
      images: true,
      subtitle: true,
      theme: true,
      backgroundImage: false
    },
    defaultTheme: {
      background: "bg-gradient-to-r from-gray-900 to-gray-800",
      textColor: "text-white"
    }
  },
  {
    id: "image-right",
    name: "Image Right",
    category: "Image" as TemplateCategory,
    description: "Content on the left with image on the right",
    supports: {
      images: true,
      subtitle: true,
      theme: true,
      backgroundImage: false
    },
    defaultTheme: {
      background: "bg-gradient-to-r from-gray-900 to-gray-800",
      textColor: "text-white"
    }
  },
  {
    id: "split-image",
    name: "Split Layout",
    category: "Special" as TemplateCategory,
    description: "50/50 split with image and content",
    supports: {
      images: true,
      subtitle: true,
      theme: true,
      backgroundImage: true
    },
    defaultTheme: {
      background: "bg-gray-900",
      textColor: "text-white"
    }
  }
] as const

// Helper functions
export const getTemplate = (
  type: SlideTemplate
): React.ComponentType<TemplateProps> => templates[type] || templates.default

export const getTemplateConfig = (type: SlideTemplate): TemplateConfig =>
  templateConfigs.find((t) => t.id === type) || templateConfigs[0]
