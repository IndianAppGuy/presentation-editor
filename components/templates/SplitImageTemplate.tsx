"use client"

import { TemplateProps } from "@/lib/types/templates"
import { ImagePlus, Pencil } from "lucide-react"
import React, { useState } from "react"
import { ImageUploader } from "../ui/ImageUploader"

const SplitImageTemplate: React.FC<TemplateProps> = ({ slide, onEdit }) => {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)
  const [showImageUploader, setShowImageUploader] = useState(false)

  const handleImageUpload = (imageUrl: string) => {
    onEdit("image", { url: imageUrl, position: "left", size: "medium" })
    setShowImageUploader(false)
  }

  return (
    <div className="w-full h-full">
      {/* Title Bar */}
      <div className="w-full bg-gray-900 p-6">
        <div
          className="relative group"
          onMouseEnter={() => setHoveredElement("title")}
          onMouseLeave={() => setHoveredElement(null)}
        >
          <h1 className="text-4xl font-bold text-white text-center">
            {slide.title}
          </h1>
          {hoveredElement === "title" && (
            <button
              className="absolute -right-10 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full"
              onClick={() => onEdit("title", slide.title)}
            >
              <Pencil className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        {slide.subtitle && (
          <div
            className="relative group mt-2"
            onMouseEnter={() => setHoveredElement("subtitle")}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <h2 className="text-xl text-white/80 text-center">
              {slide.subtitle}
            </h2>
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
      </div>

      {/* Split Content */}
      <div className="flex h-[calc(100%-6rem)]">
        {/* Left Side (Image) */}
        <div className="w-1/2 bg-gray-800 relative group">
          {slide.image ? (
            <div
              className="w-full h-full bg-cover bg-center relative group"
              style={{ backgroundImage: `url(${slide.image.url})` }}
              onMouseEnter={() => setHoveredElement("image")}
              onMouseLeave={() => setHoveredElement(null)}
            >
              {hoveredElement === "image" && (
                <div className="absolute top-2 right-2 space-x-2">
                  <button
                    className="p-2 bg-black/50 rounded-full hover:bg-black/70"
                    onClick={() => setShowImageUploader(true)}
                  >
                    <Pencil className="w-4 h-4 text-white" />
                  </button>
                  <button
                    className="p-2 bg-black/50 rounded-full hover:bg-black/70"
                    onClick={() => onEdit("image", { url: "" })}
                  >
                    <ImagePlus className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="w-full h-full flex items-center justify-center"
              onClick={() => setShowImageUploader(true)}
            >
              <div className="flex flex-col items-center text-white/60">
                <ImagePlus className="w-12 h-12 mb-2" />
                <span>Add Image</span>
              </div>
            </button>
          )}
        </div>

        {/* Right Side (Content) */}
        <div className="w-1/2 bg-gradient-to-r from-gray-900 to-gray-800 p-8">
          <div className="space-y-4">
            {slide.bodyContent.map((content: string, index: number) => (
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
      </div>

      {/* Image Uploader Modal */}
      {showImageUploader && (
        <ImageUploader
          onUploadAction={handleImageUpload}
          onCloseAction={() => setShowImageUploader(false)}
        />
      )}
    </div>
  )
}

export default SplitImageTemplate
