import { getTemplate } from "@/components/templates"
import { Skeleton } from "@/components/ui/skeleton"
import { Slide } from "@/lib/types"
import { GripVertical, Trash2 } from "lucide-react"
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
      flex gap-2
      ${isDragging ? "opacity-50" : ""}
    `}
    >
      {/* Slide Number Container with Conditional Blue Indicator */}
      <div className="flex gap-0.5 py-1">
        {/* Blue Indicator Line - only show when active */}
        {isActive && <div className="w-1 rounded-lg bg-blue-600"></div>}
        <span className="h-fit w-7 text-center text-sm font-semibold leading-tight text-blue-600">
          {index + 1}
        </span>
      </div>

      {/* Thumbnail Container */}
      <div
        className={`
          overflow-hidden rounded-sm border border-gray-200
          ${
            isActive
              ? "ring-2 ring-blue-600 brightness-95"
              : "hover:ring-1 hover:ring-gray-200"
          }
        `}
        style={{ width: "120px" }}
        onClick={onClick}
      >
        <div className="relative" style={{ width: "120px", height: "69.5px" }}>
          {/* Loading Skeleton */}
          {isLoading && (
            <Skeleton className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

          {/* Actual Content */}
          <div className="absolute inset-0 bg-white">
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

          {/* Actions */}
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

          {/* Drag Handle */}
          <div
            {...dragHandleProps}
            className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 
                     cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SlideThumbnail
