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
    <div className="hidden max-h-full w-full max-w-[200px] overflow-y-auto overflow-x-hidden px-1 sm:block transition-opacity delay-150 opacity-100 bg-[#F8F9FC]">
      {/* Header Section */}
      <div className="flex flex-col gap-3 px-2">
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={handleAddSlide}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold text-sm 
                     hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slide</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 text-gray-600 rounded-lg border border-gray-200
                     hover:bg-gray-50 transition-colors text-sm"
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
        className="flex flex-col gap-2 mt-4 px-2"
        onDragOver={handleDragOver}
      >
        {presentation.slides.map((slide, index) => (
          <div
            key={slide.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="mb-2"
          >
            <SlideThumbnail
              slide={slide}
              index={index}
              isActive={currentSlideIndex === index}
              onClick={() => setCurrentSlide(index)}
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
