import { create } from "zustand"
import { Presentation, PresentationStore, SlideUpdates } from "../types"

export const usePresentation = create<PresentationStore>((set) => ({
  presentation: null,
  currentSlideIndex: 0,

  setPresentation: (presentation: Presentation) => set({ presentation }),

  setCurrentSlide: (index: number) => set({ currentSlideIndex: index }),

  updateSlide: (slideId: string, updates: Partial<SlideUpdates>) =>
    set((state) => {
      if (!state.presentation) return state

      // Create new slides array with the update
      const slides = state.presentation.slides.map((slide) => {
        if (slide.id === slideId) {
          // For bodyContent, ensure we're creating a new array
          const updatedSlide = { ...slide }

          if (updates.bodyContent) {
            updatedSlide.bodyContent = [...updates.bodyContent]
          }

          return {
            ...updatedSlide,
            ...updates
          }
        }
        return slide
      })

      // Create new presentation object
      return {
        presentation: {
          ...state.presentation,
          slides,
          updatedAt: new Date()
        }
      }
    })
}))
