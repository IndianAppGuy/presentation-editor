"use client"

import { Pencil } from "lucide-react"
import React, { useState } from "react"

interface Template1Props {
  slide: {
    title: string
    subtitle?: string
    bodyContent: string[]
  }
  onEdit: (field: string, value: string, index?: number) => void
}

const Template1: React.FC<Template1Props> = ({ slide, onEdit }) => {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)

  return (
    <div className="w-full h-full bg-gradient-to-r from-blue-900 to-blue-800 p-8">
      {/* Title Section */}
      <div
        className="relative group"
        onMouseEnter={() => setHoveredElement("title")}
        onMouseLeave={() => setHoveredElement(null)}
      >
        <h1 className="text-4xl font-bold text-white mb-4">{slide.title}</h1>
        {hoveredElement === "title" && (
          <button
            className="absolute -right-10 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full"
            onClick={() => onEdit("title", slide.title)}
          >
            <Pencil className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Subtitle Section */}
      {slide.subtitle && (
        <div
          className="relative group"
          onMouseEnter={() => setHoveredElement("subtitle")}
          onMouseLeave={() => setHoveredElement(null)}
        >
          <h2 className="text-2xl text-white/80 mb-8">{slide.subtitle}</h2>
          {hoveredElement === "subtitle" && (
            <button
              className="absolute -right-10 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full"
              onClick={() => onEdit("subtitle", slide.subtitle || "")}
            >
              <Pencil className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="space-y-4">
        {slide.bodyContent.map((content, index) => (
          <div
            key={index}
            className="relative group"
            onMouseEnter={() => setHoveredElement(`content-${index}`)}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <p className="text-lg text-white/90">• {content}</p>
            {hoveredElement === `content-${index}` && (
              <button
                className="absolute -right-10 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full"
                onClick={() => onEdit("bodyContent", content, index)}
              >
                <Pencil className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Template1
