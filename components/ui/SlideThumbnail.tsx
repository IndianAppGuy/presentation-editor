import { getTemplate } from "@/components/templates"
import { Skeleton } from "@/components/ui/skeleton"
import { Slide } from "@/lib/types"
import { GripVertical, Pencil, Trash2 } from "lucide-react"
import React, { useState } from "react"

interface DragHandleProps {
  draggable?: boolean
  onDragStart?: (event: React.DragEvent) => void
  onDragEnd?: (event: React.DragEvent) => void
  style?: React.CSSProperties
}

interface SlideThumbnailProps {
  slide: Slide
  index: number
  isActive?: boolean
  onClick?: () => void
  onDelete?: () => void
  onEdit?: () => void
  isDragging?: boolean
  dragHandleProps?: DragHandleProps
}

const SlideThumbnail: React.FC<SlideThumbnailProps> = ({
  slide,
  index,
  isActive = false,
  onClick,
  onDelete,
  onEdit,
  isDragging = false,
  dragHandleProps
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const TemplateComponent = getTemplate(slide.template)

  const handleContentLoad = () => {
    setIsLoading(false)
  }

  return (
    <div
      className={`
        group relative p-3 rounded-lg transition-all duration-200
        ${isDragging ? "rotate-2 scale-105" : ""}
        ${
          isActive
            ? "bg-white shadow-md ring-2 ring-blue-500"
            : "hover:bg-white/90 hover:ring-1 hover:ring-gray-200"
        }
      `}
    >
      {/* Drag Handle */}
      <div
        {...dragHandleProps}
        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing z-10"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Actions */}
      <div className="absolute right-2 top-2 flex gap-1 transition-opacity z-10">
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          >
            <Pencil className="w-3 h-3" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1 rounded-md text-red-600 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Thumbnail Container */}
      <div
        className="relative w-full bg-gray-900 rounded-lg overflow-hidden shadow-sm mb-3 cursor-pointer"
        style={{ aspectRatio: "16/9" }}
        onClick={onClick}
      >
        {/* Loading Skeleton */}
        {isLoading && (
          <Skeleton className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {/* Actual Content - Fixed scaling */}
        <div className="absolute inset-0">
          <div className="w-full h-full" onLoad={handleContentLoad}>
            <TemplateComponent
              slide={{
                ...slide,
                bodyContent: slide.bodyContent.map((content) =>
                  content.length > 50
                    ? content.substring(0, 50) + "..."
                    : content
                )
              }}
              onEdit={() => {}}
              theme={slide.theme}
              isPreview={true}
            />
          </div>
        </div>

        {/* Hover/Active Overlay */}
        <div
          className={`
            absolute inset-0 transition-all duration-200
            group-hover:bg-black/5
            ${isActive ? "bg-blue-500/5" : ""}
          `}
        />
      </div>

      {/* Slide Info */}
      <div className="space-y-1.5 pl-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">
            Slide {index + 1}
          </span>
          {slide.template !== "default" && (
            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
              {slide.template}
            </span>
          )}
        </div>
        <h3
          className="text-sm font-medium text-gray-700 truncate"
          title={slide.title}
        >
          {slide.title}
        </h3>
      </div>
    </div>
  )
}

export default SlideThumbnail
