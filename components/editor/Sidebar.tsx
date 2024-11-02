import { usePresentation } from "@/lib/store/presentation"
import {
  CustomPresentation,
  Slide,
  validateImportedPresentation
} from "@/lib/types"
import { Plus, Upload } from "lucide-react"
import React, { useRef, useState } from "react"
import SlideThumbnail from "../ui/SlideThumbnail"

export default function Sidebar() {
  const { presentation, currentSlideIndex, setCurrentSlide, setPresentation } =
    usePresentation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [draggingSlideIndex, setDraggingSlideIndex] = useState<number | null>(
    null
  )

  if (!presentation) return null

  const handleAddSlide = () => {
    if (!presentation) return

    const newSlide: Slide = {
      id: `slide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      template: "default",
      title: "New Slide",
      bodyContent: ["Add your content here"],
      theme: {
        background: "bg-gradient-to-r from-gray-900 to-gray-800",
        textColor: "text-white"
      }
    }

    setPresentation({
      ...presentation,
      slides: [...presentation.slides, newSlide],
      updatedAt: new Date()
    })

    // Automatically select the new slide
    setCurrentSlide(presentation.slides.length)
  }

  const handleDeleteSlide = (index: number) => {
    if (!presentation || presentation.slides.length <= 1) return

    const newSlides = [...presentation.slides]
    newSlides.splice(index, 1)

    setPresentation({
      ...presentation,
      slides: newSlides,
      updatedAt: new Date()
    })

    // Adjust current slide index if needed
    if (currentSlideIndex >= index) {
      setCurrentSlide(Math.max(0, currentSlideIndex - 1))
    }
  }

  const handleDragStart = (index: number) => {
    setDraggingSlideIndex(index)
  }

  const handleDragEnd = () => {
    setDraggingSlideIndex(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    e.stopPropagation()

    if (draggingSlideIndex === null) {
      // Handle file drop
      const file = e.dataTransfer.files[0]
      if (file && file.type === "application/json") {
        try {
          const text = await file.text()
          const jsonData = JSON.parse(text) as CustomPresentation
          const validatedData = validateImportedPresentation(jsonData)
          setPresentation(validatedData)
        } catch (error) {
          console.error("Error importing JSON:", error)
          alert("Invalid JSON format. Please check your file.")
        }
      }
      return
    }

    // Handle slide reordering
    if (draggingSlideIndex === dropIndex) return

    const newSlides = [...presentation.slides]
    const [draggedSlide] = newSlides.splice(draggingSlideIndex, 1)
    newSlides.splice(dropIndex, 0, draggedSlide)

    setPresentation({
      ...presentation,
      slides: newSlides,
      updatedAt: new Date()
    })

    // Update current slide index if needed
    if (currentSlideIndex === draggingSlideIndex) {
      setCurrentSlide(dropIndex)
    } else if (
      currentSlideIndex > draggingSlideIndex &&
      currentSlideIndex <= dropIndex
    ) {
      setCurrentSlide(currentSlideIndex - 1)
    } else if (
      currentSlideIndex < draggingSlideIndex &&
      currentSlideIndex >= dropIndex
    ) {
      setCurrentSlide(currentSlideIndex + 1)
    }

    setDraggingSlideIndex(null)
  }

  const handleFileImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const jsonData = JSON.parse(text) as CustomPresentation
      const validatedData = validateImportedPresentation(jsonData)
      setPresentation(validatedData)
    } catch (error) {
      console.error("Error importing JSON:", error)
      alert("Invalid JSON format. Please check your file.")
    }
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header Section */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-sm font-medium text-gray-700 mb-4">Slides</h2>

        <div className="space-y-2">
          <button
            onClick={handleAddSlide}
            className="w-full flex items-center justify-center gap-2 py-2 bg-blue-500 text-white rounded-md 
                     hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slide</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-2 bg-gray-50 text-gray-700 rounded-md
                     border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Import JSON</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileImport}
          onClick={(e) => {
            ;(e.target as HTMLInputElement).value = ""
          }}
        />
      </div>

      {/* Slides List */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onDragOver={handleDragOver}
      >
        {presentation.slides.map((slide, index) => (
          <div
            key={slide.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <SlideThumbnail
              slide={slide}
              index={index}
              isActive={currentSlideIndex === index}
              onClick={() => setCurrentSlide(index)}
              onDelete={() => handleDeleteSlide(index)}
              isDragging={draggingSlideIndex === index}
              dragHandleProps={{
                draggable: true,
                onDragStart: () => handleDragStart(index),
                onDragEnd: handleDragEnd
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
