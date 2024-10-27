"use client"

import { usePresentation } from "@/lib/store/presentation"
import {
  ImportedPresentation,
  Slide,
  validateImportedPresentation
} from "@/lib/types"
import { Plus, Upload } from "lucide-react"
import React, { useRef } from "react"

export default function Sidebar() {
  const { presentation, currentSlideIndex, setCurrentSlide, setPresentation } =
    usePresentation()
  const fileInputRef = useRef<HTMLInputElement>(null)

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
  }

  const handleFileImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const jsonData = JSON.parse(text) as ImportedPresentation
      const validatedData = validateImportedPresentation(jsonData)
      setPresentation(validatedData)
    } catch (error) {
      console.error("Error importing JSON:", error)
      alert("Invalid JSON format. Please check your file.")
    }
  }

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 space-y-2">
        <button
          onClick={handleAddSlide}
          className="w-full flex items-center justify-center space-x-2 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <Plus className="w-4 h-4" />
          <span>Add Slide</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center space-x-2 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          <Upload className="w-4 h-4" />
          <span>Import JSON</span>
        </button>
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

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {presentation.slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`
              p-3 rounded-lg cursor-pointer
              ${
                currentSlideIndex === index
                  ? "bg-blue-100 border-2 border-blue-500"
                  : "hover:bg-gray-100 border-2 border-transparent"
              }
            `}
            onClick={() => setCurrentSlide(index)}
          >
            <div className="text-sm font-medium truncate">{slide.title}</div>
            <div className="text-xs text-gray-500">Slide {index + 1}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
