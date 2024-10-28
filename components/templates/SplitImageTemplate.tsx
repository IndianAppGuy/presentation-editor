"use client"

import { TemplateProps } from "@/lib/types/templates"
import { ImagePlus, Pencil } from "lucide-react"
import React, { useState } from "react"
import EditableText from "../editor/EditableText"
import { ImageUploader } from "../ui/ImageUploader"

const SplitImageTemplate: React.FC<TemplateProps> = ({ slide, onEdit }) => {
  const [showImageUploader, setShowImageUploader] = useState(false)

  const handleImageUpload = (imageUrl: string) => {
    onEdit("image", { url: imageUrl, position: "left", size: "medium" })
    setShowImageUploader(false)
  }

  return (
    <div className="w-full h-full">
      {/* Title Bar */}
      <div className="w-full bg-gray-900 p-6">
        <EditableText
          content={slide.title}
          onEdit={(newValue) => onEdit("title", newValue)}
          isTitle={true}
          className="text-center"
        />

        {slide.subtitle && (
          <EditableText
            content={slide.subtitle}
            onEdit={(newValue) => onEdit("subtitle", newValue)}
            className="text-xl text-white/80 text-center mt-2"
          />
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
            >
              <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
            </div>
          ) : (
            <button
              className="w-full h-full flex items-center justify-center hover:bg-gray-700/50 transition-colors"
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
