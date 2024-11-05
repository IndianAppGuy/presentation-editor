// TableOfContentsTemplate.tsx
import { TemplateProps } from "@/lib/types/templates"
import React from "react"
import EditableText from "../editor/EditableText"
import { PreviewText } from "./BaseTemplate"

const TableOfContentsTemplate: React.FC<TemplateProps> = ({
  slide,
  onEdit,
  isPreview = false
}) => {
  const tocItems = slide.bodyContent || []
  const backgroundStyle =
    "bg-gradient-to-br from-black via-purple-900 to-cyan-900"

  // Preview Mode
  if (isPreview) {
    return (
      <div className="w-full h-full flex relative overflow-hidden">
        {/* Background with multi-color gradient */}
        <div className={`absolute inset-0 ${backgroundStyle} opacity-90`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          {/* Decorative star shape */}
          <div className="absolute bottom-12 left-12 w-40 h-40 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white">
              <path d="M50 0 L65 35 L100 50 L65 65 L50 100 L35 65 L0 50 L35 35 Z" />
            </svg>
          </div>
        </div>

        {/* Content Container */}
        <div className="relative w-full h-full p-14">
          {/* Title Section */}
          <div className="mb-12">
            <PreviewText
              content={slide.title || "TABLE OF CONTENTS"}
              className="text-5xl font-bold text-white tracking-tight"
            />
          </div>

          {/* TOC Items */}
          <div className="flex flex-col space-y-3">
            {tocItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between group"
              >
                <PreviewText
                  content={item}
                  className="text-2xl text-white/90 font-normal"
                />
                <span className="text-2xl text-white/80 font-light tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Edit Mode
  return (
    <div className="w-full h-full flex relative overflow-hidden">
      {/* Background with multi-color gradient */}
      <div className={`absolute inset-0 ${backgroundStyle} opacity-90`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        {/* Decorative star shape */}
        <div className="absolute bottom-12 left-12 w-40 h-40 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
            <path d="M50 0 L65 35 L100 50 L65 65 L50 100 L35 65 L0 50 L35 35 Z" />
          </svg>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative w-full h-full p-14">
        {/* Title Section */}
        <div className="mb-12">
          <EditableText
            content={slide.title || "TABLE OF CONTENTS"}
            onEdit={(newValue) => onEdit("title", newValue)}
            isTitle={true}
            className="text-5xl font-bold text-white tracking-tight"
          />
        </div>

        {/* TOC Items */}
        <div className="flex flex-col space-y-3">
          {tocItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between group"
            >
              <EditableText
                content={item}
                onEdit={(newValue) => onEdit("bodyContent", newValue, index)}
                className="text-2xl text-white/90 font-normal"
              />
              <span className="text-2xl text-white/80 font-light tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TableOfContentsTemplate
