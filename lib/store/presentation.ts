import { create } from "zustand"
import { PresentationStore } from "../types"

export const usePresentation = create<PresentationStore>((set) => ({
  presentation: null,
  currentSlideIndex: 0,

  setPresentation: (presentation) => set({ presentation }),

  setCurrentSlide: (index) => set({ currentSlideIndex: index }),

  updateSlide: (slideId, updates) =>
    set((state) => {
      if (!state.presentation) return state

      const slides = state.presentation.slides.map((slide) =>
        slide.id === slideId ? { ...slide, ...updates } : slide
      )

      return {
        presentation: {
          ...state.presentation,
          slides,
          updatedAt: new Date()
        }
      }
    })
}))
