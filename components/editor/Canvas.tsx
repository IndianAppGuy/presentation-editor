"use client"

import { usePresentation } from "@/lib/store/presentation"
import type { Slide, SlideUpdates } from "@/lib/types"
import React from "react"
import EditableText from "./EditableText"

const SlideContent: React.FC<{
  slide: Slide
  onEdit: (field: keyof SlideUpdates, value: string, index?: number) => void
}> = ({ slide, onEdit }) => {
  return (
    <div className="flex flex-col items-start justify-start h-full p-16">
      {/* Title */}
      <EditableText
        content={slide.title}
        onEdit={(newValue) => onEdit("title", newValue)}
        isTitle
      />

      {/* Subtitle if exists */}
      {slide.subtitle && (
        <EditableText
          content={slide.subtitle}
          onEdit={(newValue) => onEdit("subtitle", newValue)}
          className="mt-4"
        />
      )}

      {/* Body Content */}
      <div className="mt-8 space-y-4 w-full">
        {slide.bodyContent.map((content, index) => (
          <EditableText
            key={index}
            content={content}
            onEdit={(newValue) => onEdit("bodyContent", newValue, index)}
          />
        ))}
      </div>
    </div>
  )
}

export default function Canvas() {
  const { presentation, currentSlideIndex, updateSlide } = usePresentation()

  if (!presentation) return null

  const currentSlide = presentation.slides[currentSlideIndex]

  const handleEdit = (
    field: keyof SlideUpdates,
    value: string,
    index?: number
  ) => {
    const updates: SlideUpdates = {}

    if (field === "bodyContent" && typeof index === "number") {
      // Create a new array with the updated content
      const newContent = [...currentSlide.bodyContent]
      newContent[index] = value
      updates.bodyContent = newContent
    } else if (field === "title" || field === "subtitle") {
      updates[field] = value
    }

    // Pass the slide ID to ensure we're updating the correct slide
    updateSlide(currentSlide.id, updates)
  }

  return (
    <div className="flex-1 bg-gray-100 p-8 overflow-auto">
      <div className="max-w-5xl mx-auto">
        <div
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-lg"
          style={{ aspectRatio: "16/9" }}
        >
          <SlideContent slide={currentSlide} onEdit={handleEdit} />
        </div>
      </div>
    </div>
  )
}
