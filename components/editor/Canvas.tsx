// components/editor/Canvas.tsx
"use client"

import { getTemplate } from "@/components/templates"
import { usePresentation } from "@/lib/store/presentation"
import type { SlideImage, SlideTemplate, SlideUpdates } from "@/lib/types"
import { useState } from "react"
import { ImageUploader } from "../ui/ImageUploader"
import { TemplateSelector } from "../ui/TemplateSelector"

export default function Canvas() {
  const { presentation, currentSlideIndex, updateSlide, updateSlideTemplate } =
    usePresentation()
  const [showImageUploader, setShowImageUploader] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)

  if (!presentation) return null

  const currentSlide = presentation.slides[currentSlideIndex]
  const TemplateComponent = getTemplate(currentSlide.template)

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
    <div className="flex-1 bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4 flex justify-end space-x-2">
          <button
            onClick={() => setShowTemplateSelector(true)}
            className="px-4 py-2 bg-white border rounded-md hover:bg-gray-50"
          >
            Change Template
          </button>
        </div>

        <div
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-lg overflow-hidden"
          style={{ aspectRatio: "16/9" }}
        >
          <TemplateComponent
            slide={currentSlide}
            onEdit={handleEdit}
            onImageUpload={() => setShowImageUploader(true)}
            theme={currentSlide.theme}
          />
        </div>
      </div>

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
