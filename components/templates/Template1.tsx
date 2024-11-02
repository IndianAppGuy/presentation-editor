"use client"

import { TemplateProps } from "@/lib/types/templates"
import React from "react"
import EditableText from "../editor/EditableText"
import { PreviewContent, PreviewText } from "./BaseTemplate"

const Template1: React.FC<TemplateProps> = ({
  slide,
  onEdit,
  isPreview = false
}) => {
  if (isPreview) {
    return (
      <div className="w-full h-full bg-gradient-to-r from-blue-900 to-blue-800 p-4">
        <PreviewText
          content={slide.title}
          className="text-xl font-bold text-white mb-2"
        />
        {slide.subtitle && (
          <PreviewText
            content={slide.subtitle}
            className="text-sm text-white/80 mb-3"
          />
        )}
        <PreviewContent content={slide.bodyContent} className="text-white/90" />
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-gradient-to-r from-blue-900 to-blue-800 p-8">
      <EditableText
        content={slide.title}
        onEdit={(newValue) => onEdit("title", newValue)}
        isTitle={true}
        className="mb-4"
      />

      {slide.subtitle && (
        <EditableText
          content={slide.subtitle}
          onEdit={(newValue) => onEdit("subtitle", newValue)}
          className="text-2xl text-white/80 mb-8"
        />
      )}

      <div className="space-y-4">
        {slide.bodyContent.map((content, index) => (
          <EditableText
            key={index}
            content={content}
            onEdit={(newValue) => onEdit("bodyContent", newValue, index)}
            className="text-lg text-white/90"
          />
        ))}
      </div>
    </div>
  )
}

export default Template1
