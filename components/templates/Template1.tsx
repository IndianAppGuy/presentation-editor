"use client"

import { TemplateProps } from "@/lib/types/templates"
import React from "react"
import EditableText from "../editor/EditableText"

const Template1: React.FC<TemplateProps> = ({ slide, onEdit }) => {
  return (
    <div className="w-full h-full bg-gradient-to-r from-blue-900 to-blue-800 p-8">
      {/* Title Section */}
      <EditableText
        content={slide.title}
        onEdit={(newValue) => onEdit("title", newValue)}
        isTitle={true}
        className="mb-4"
      />

      {/* Subtitle Section */}
      {slide.subtitle && (
        <EditableText
          content={slide.subtitle}
          onEdit={(newValue) => onEdit("subtitle", newValue)}
          className="text-2xl text-white/80 mb-8"
        />
      )}

      {/* Content Section */}
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
