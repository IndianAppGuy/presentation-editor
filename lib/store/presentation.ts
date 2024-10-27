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
