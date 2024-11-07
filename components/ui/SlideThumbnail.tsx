// components/ui/SlideThumbnail.tsx
import { getTemplate } from "@/components/templates"
import { Slide } from "@/lib/types"
import { GripVertical, Trash2 } from "lucide-react"
import React from "react"

interface SlideThumbnailProps {
  slide: Slide
  index: number
  isActive?: boolean
  onClick?: () => void
  onDelete?: () => void
  isDragging?: boolean
  dragHandleProps?: any
}

const SlideThumbnail: React.FC<SlideThumbnailProps> = ({
  slide,
  index,
  isActive = false,
  onClick,
  onDelete,
  isDragging = false,
  dragHandleProps
}) => {
  const TemplateComponent = getTemplate(slide.template)

  return (
    <div className={`flex gap-2 ${isDragging ? "opacity-50" : ""}`}>
      {/* Slide Number */}
      <div className="flex gap-0.5 py-1">
        {isActive && <div className="w-1 rounded-lg bg-blue-600" />}
        <span className="h-fit w-7 text-center text-sm font-semibold leading-tight text-blue-600">
          {index + 1}
        </span>
      </div>

      {/* Main Container */}
      <div
        onClick={onClick}
        className={`
          overflow-hidden rounded-sm border border-gray-200
          ${
            isActive
              ? "ring-2 ring-blue-600"
              : "hover:ring-1 hover:ring-gray-200"
          }
        `}
        style={{ width: "120px" }}
      >
        {/* Viewport Container */}
        <div
          className="overflow-hidden"
          style={{ width: "120px", height: "67.5px" }}
        >
          {/* Presentation Container - exact match to Slidespeak */}
          <div
            role="presentation"
            className="relative bg-white"
            style={{
              width: "1280px",
              height: "720px",
              transform: "scale(0.09375)",
              transformOrigin: "left top"
            }}
          >
            <div className="w-full h-full">
              <TemplateComponent
                slide={slide}
                onEdit={() => {}}
                theme={slide.theme}
                isPreview={true}
              />
            </div>
          </div>
        </div>

        {/* Actions - same as before */}
        <div className="absolute right-1 top-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="p-1 rounded bg-white/90 text-gray-600 hover:text-red-600 shadow-sm"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Drag Handle - same as before */}
        <div
          {...dragHandleProps}
          className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 
                   cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  )
}

export default SlideThumbnail
