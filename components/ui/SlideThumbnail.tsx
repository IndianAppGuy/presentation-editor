// components/ui/SlideThumbnail.tsx
import { getTemplate } from "@/components/templates"
import { Slide } from "@/lib/types"
import { GripVertical } from "lucide-react"
import React from "react"

interface DragHandleProps {
  draggable: boolean
  onDragStart: (event: React.DragEvent) => void
  onDragEnd: (event: React.DragEvent) => void
}

interface SlideThumbnailProps {
  slide: Slide
  index: number
  isActive?: boolean
  onClick?: () => void
  isDragging?: boolean
  dragHandleProps?: DragHandleProps
}

// components/ui/SlideThumbnail.tsx
const SlideThumbnail: React.FC<SlideThumbnailProps> = ({
  slide,
  index,
  isActive = false,
  onClick,
  isDragging = false,
  dragHandleProps
}) => {
  const TemplateComponent = getTemplate(slide.template)

  return (
    <div className={`flex gap-2 group ${isDragging ? "opacity-50" : ""}`}>
      {/* Slide Number and Drag Handle Column */}
      <div className="flex flex-col items-center">
        {/* Slide Number with Indicator - Fixed height for consistency */}
        <div className="flex gap-0.5 h-[28px] py-1">
          {/* Blue Indicator Line - Made taller */}
          {isActive && (
            <div className="w-1 rounded-lg bg-blue-600 h-full"></div>
          )}
          <span className="h-fit w-7 text-center text-sm font-semibold leading-tight text-blue-600">
            {index + 1}
          </span>
        </div>

        {/* Centered Drag Handle */}
        {dragHandleProps && (
          <div
            {...dragHandleProps}
            className="flex items-center justify-center w-full h-6 cursor-grab active:cursor-grabbing 
                     hover:bg-gray-100 rounded transition-all opacity-0 group-hover:opacity-100"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        )}
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
          {/* Presentation Container */}
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
      </div>
    </div>
  )
}
export default SlideThumbnail
