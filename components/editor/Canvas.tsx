// components/editor/Canvas.tsx
"use client"

import { getTemplate } from "@/components/templates"
import { usePresentation } from "@/lib/store/presentation"
import type { SlideImage, SlideTemplate, SlideUpdates } from "@/lib/types"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { ImageUploader } from "../ui/ImageUploader"
import { TemplateSelector } from "../ui/TemplateSelector"

export default function Canvas() {
  const {
    presentation,
    currentSlideIndex,
    updateSlide,
    updateSlideTemplate,
    setPresentation,
    setCurrentSlide
  } = usePresentation()
  const [showImageUploader, setShowImageUploader] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)

  if (!presentation) return null

  const currentSlide = presentation.slides[currentSlideIndex]
  const TemplateComponent = getTemplate(currentSlide.template)

  const handleDeleteSlide = () => {
    if (!presentation || presentation.slides.length <= 1) return

    const newSlides = [...presentation.slides]
    newSlides.splice(currentSlideIndex, 1)

    setPresentation({
      ...presentation,
      slides: newSlides,
      updatedAt: new Date()
    })

    // Adjust current slide index if needed
    setCurrentSlide(Math.max(0, currentSlideIndex - 1))
  }

  const handleEdit = (
    field: keyof SlideUpdates,
    value: string | SlideImage,
    index?: number
  ) => {
    const updates: Partial<SlideUpdates> = {}

    if (
      field === "bodyContent" &&
      typeof index === "number" &&
      typeof value === "string"
    ) {
      const newContent = [...currentSlide.bodyContent]
      newContent[index] = value
      updates.bodyContent = newContent
    } else if (field === "image" && typeof value === "object") {
      updates.image = value as SlideImage
    } else if (field === "title" || field === "subtitle") {
      updates[field] = value as string
    }

    updateSlide(currentSlide.id, updates)
  }

  const handleTemplateSelect = (template: SlideTemplate) => {
    updateSlideTemplate(currentSlide.id, template)
    setShowTemplateSelector(false)
  }

  return (
    <div className="flex-1 bg-[#F8F9FC] p-8 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-7xl mx-auto flex flex-col">
        {/* Action Buttons */}
        <div className="mb-4 flex justify-end gap-2">
          {/* Template Change Button */}
          <button
            onClick={() => setShowTemplateSelector(true)}
            aria-haspopup="dialog"
            aria-expanded={showTemplateSelector}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M1.68 10a8.333 8.333 0 008.333 8.333 2.5 2.5 0 002.5-2.5v-.416c0-.387 0-.58.021-.743a2.5 2.5 0 012.153-2.153c.162-.021.356-.021.743-.021h.416a2.5 2.5 0 002.5-2.5A8.333 8.333 0 001.68 10z"
              />
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M5.846 10.833a.833.833 0 100-1.666.833.833 0 000 1.666zM13.346 7.5a.833.833 0 100-1.667.833.833 0 000 1.667zM8.346 6.667a.833.833 0 100-1.667.833.833 0 000 1.667z"
              />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDeleteSlide}
            disabled={presentation.slides.length <= 1}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md hover:bg-gray-100 transition-colors 
                     disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Delete slide"
          >
            <Trash2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Canvas Content */}
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <div className="absolute inset-0">
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-lg overflow-hidden">
              <TemplateComponent
                slide={currentSlide}
                onEdit={handleEdit}
                onImageUpload={() => setShowImageUploader(true)}
                theme={currentSlide.theme}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTemplateSelector && (
        <TemplateSelector
          onSelectAction={handleTemplateSelect}
          onCloseAction={() => setShowTemplateSelector(false)}
        />
      )}
      {showImageUploader && (
        <ImageUploader
          onUploadAction={(imageUrl) => {
            handleEdit("image", {
              url: imageUrl,
              position: "center",
              size: "medium"
            })
            setShowImageUploader(false)
          }}
          onCloseAction={() => setShowImageUploader(false)}
        />
      )}
    </div>
  )
}
