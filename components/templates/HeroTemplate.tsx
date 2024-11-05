// HeroTemplate.tsx
import { TemplateProps } from "@/lib/types/templates"
import { ImagePlus, Pencil } from "lucide-react"
import React, { useState } from "react"
import EditableText from "../editor/EditableText"
import { ImageUploader } from "../ui/ImageUploader"
import { PreviewText } from "./BaseTemplate"

const HeroTemplate: React.FC<TemplateProps> = ({
  slide,
  onEdit,
  isPreview = false
}) => {
  const [showImageUploader, setShowImageUploader] = useState(false)

  const handleImageUpload = (imageUrl: string) => {
    onEdit("image", { url: imageUrl, position: "right", size: "large" })
    setShowImageUploader(false)
  }

  const curvedPath =
    "M100,0 C30,0 0,30 0,100 L0,100 L0,500 C0,430 30,400 100,400 L500,400 L500,0 L100,0 Z"

  // Common background style with the exact gradient from the image
  const backgroundStyle =
    "bg-gradient-to-br from-black via-purple-900 to-cyan-900"

  // Preview Mode
  if (isPreview) {
    return (
      <div className="w-full h-full flex relative overflow-hidden">
        {/* Background with multi-color gradient */}
        <div className={`absolute inset-0 ${backgroundStyle} opacity-90`}>
          {/* Additional gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>

        {/* Content Section */}
        <div className="relative flex-1 flex flex-col justify-end p-16 pb-20">
          <PreviewText
            content={slide.title}
            className="text-6xl font-bold text-white mb-4 leading-tight"
          />
          {slide.subtitle && (
            <PreviewText
              content={slide.subtitle}
              className="text-2xl text-white/80"
            />
          )}
        </div>

        {/* Image Section with curved border */}
        <div className="w-[45%] relative">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 500 500"
            preserveAspectRatio="none"
            style={{
              filter: "drop-shadow(-4px 0 10px rgba(0,0,0,0.3))"
            }}
          >
            {slide.image ? (
              <defs>
                <pattern
                  id="img1"
                  patternUnits="userSpaceOnUse"
                  width="100%"
                  height="100%"
                >
                  <image
                    href={slide.image.url}
                    width="100%"
                    height="100%"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </pattern>
              </defs>
            ) : null}
            <path
              d={curvedPath}
              fill={slide.image ? "url(#img1)" : "#1f2937"}
            />
          </svg>
        </div>
      </div>
    )
  }

  // Edit Mode
  return (
    <div className="w-full h-full flex relative overflow-hidden">
      {/* Background with multi-color gradient */}
      <div className={`absolute inset-0 ${backgroundStyle} opacity-90`}>
        {/* Additional gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Content Section */}
      <div className="relative flex-1 flex flex-col justify-end p-16 pb-20">
        <EditableText
          content={slide.title}
          onEdit={(newValue) => onEdit("title", newValue)}
          isTitle={true}
          className="text-6xl font-bold text-white mb-4 leading-tight"
        />

        <EditableText
          content={slide.subtitle || "Add a subtitle"}
          onEdit={(newValue) => onEdit("subtitle", newValue)}
          className="text-2xl text-white/80"
        />
      </div>

      {/* Image Section with curved border */}
      <div className="w-[45%] relative group">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 500 500"
          preserveAspectRatio="none"
          style={{
            filter: "drop-shadow(-4px 0 10px rgba(0,0,0,0.3))"
          }}
        >
          {slide.image ? (
            <defs>
              <pattern
                id="img1"
                patternUnits="userSpaceOnUse"
                width="100%"
                height="100%"
              >
                <image
                  href={slide.image.url}
                  width="100%"
                  height="100%"
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>
            </defs>
          ) : null}
          <path d={curvedPath} fill={slide.image ? "url(#img1)" : "#1f2937"} />
        </svg>

        {/* Image Upload/Edit Controls */}
        <div className="absolute inset-0 flex items-center justify-center">
          {!slide.image ? (
            <button
              className="p-4 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
              onClick={() => setShowImageUploader(true)}
            >
              <div className="flex flex-col items-center text-white/60">
                <ImagePlus className="w-12 h-12 mb-2" />
                <span>Add Image</span>
              </div>
            </button>
          ) : (
            <div className="absolute top-4 right-4 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                className="p-2 bg-black/50 rounded-full hover:bg-black/70"
                onClick={() => setShowImageUploader(true)}
              >
                <Pencil className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
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

export default HeroTemplate
