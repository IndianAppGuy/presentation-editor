import { getTemplateConfig } from "@/components/templates"
import { create } from "zustand"
import {
  Presentation,
  PresentationStore,
  SlideTemplate,
  SlideUpdates
} from "../types"

export const usePresentation = create<PresentationStore>((set) => ({
  presentation: null,
  currentSlideIndex: 0,

  setPresentation: (presentation: Presentation) => set({ presentation }),

  setCurrentSlide: (index: number) => set({ currentSlideIndex: index }),

  updateSlide: (slideId: string, updates: Partial<SlideUpdates>) =>
    set((state) => {
      if (!state.presentation) return state

      const slides = state.presentation.slides.map((slide) => {
        if (slide.id === slideId) {
          const updatedSlide = { ...slide }

          if (updates.bodyContent) {
            updatedSlide.bodyContent = [...updates.bodyContent]
          }

          if (updates.image) {
            updatedSlide.image = updates.image
          }

          if (updates.theme) {
            updatedSlide.theme = { ...updates.theme }
          }

          return {
            ...updatedSlide,
            ...updates
          }
        }
        return slide
      })

      return {
        presentation: {
          ...state.presentation,
          slides,
          updatedAt: new Date()
        }
      }
    }),

  updateSlideTemplate: (slideId: string, template: SlideTemplate) =>
    set((state) => {
      if (!state.presentation) return state

      const slides = state.presentation.slides.map((slide) => {
        if (slide.id === slideId) {
          const templateConfig = getTemplateConfig(template)
          return {
            ...slide,
            template,
            // Reset image if new template doesn't support it
            image: templateConfig.supports.images ? slide.image : undefined,
            // Reset theme if new template doesn't support it
            theme: templateConfig.supports.theme
              ? slide.theme
              : templateConfig.defaultTheme
          }
        }
        return slide
      })

      return {
        presentation: {
          ...state.presentation,
          slides,
          updatedAt: new Date()
        }
      }
    })
}))
