"use client"

import { usePresentation } from "@/lib/store/presentation"
import { Slide } from "@/lib/types"
import { Download, Save } from "lucide-react"
import PptxGenJS from "pptxgenjs"
import { useState } from "react"

export default function Toolbar() {
  const { presentation } = usePresentation()
  const [isExporting, setIsExporting] = useState(false)

  const exportToPptx = async () => {
    if (!presentation) return

    try {
      setIsExporting(true)
      const pptx = new PptxGenJS()

      // Set presentation properties
      pptx.author = "Your App Name"
      pptx.title = presentation.title || "Untitled Presentation"

      // Process each slide
      presentation.slides.forEach((slide: Slide) => {
        const pptxSlide = pptx.addSlide()

        // Add a gradient background
        pptxSlide.background = {
          color: "1a1a1a",
          fill: "solid"
        }

        // Add title
        if (slide.title) {
          pptxSlide.addText(slide.title, {
            x: 0.5,
            y: 0.5,
            w: "90%",
            h: 1,
            fontSize: 36,
            bold: true,
            color: "FFFFFF",
            align: "left"
          })
        }

        // Add subtitle if exists
        if (slide.subtitle) {
          pptxSlide.addText(slide.subtitle, {
            x: 0.5,
            y: 1.7,
            w: "90%",
            h: 0.5,
            fontSize: 24,
            color: "FFFFFF",
            align: "left"
          })
        }

        // Add body content
        if (slide.bodyContent?.length > 0) {
          const bodyContent = slide.bodyContent.map((text) => ({
            text: `• ${text}`,
            options: { bullet: true }
          }))

          pptxSlide.addText(bodyContent, {
            x: 0.5,
            y: slide.subtitle ? 2.5 : 2.0,
            w: "90%",
            h: 4,
            fontSize: 18,
            color: "FFFFFF",
            align: "left",
            bullet: { type: "bullet" }
          })
        }

        // Add image if exists
        if (slide.image?.url || slide.imageUrl) {
          try {
            pptxSlide.addImage({
              path: slide.image?.url || (slide.imageUrl as string),
              x: 6,
              y: 1,
              w: 3,
              h: 3
            })
          } catch (error) {
            console.error("Error adding image:", error)
          }
        }
      })

      // Generate safe filename
      const safeTitle = (presentation.title || "Untitled")
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()
      const dateStr = new Date().toISOString().split("T")[0]
      const fileName = `${safeTitle}_${dateStr}`

      // Save the presentation
      await pptx.writeFile({ fileName: `${fileName}.pptx` })
    } catch (error) {
      console.error("Error exporting presentation:", error)
      alert("Failed to export presentation. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const saveAsJson = () => {
    if (!presentation) return

    try {
      const json = JSON.stringify(presentation, null, 2)
      const blob = new Blob([json], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const safeTitle = (presentation.title || "untitled")
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()

      const a = document.createElement("a")
      a.href = url
      a.download = `${safeTitle}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error saving presentation:", error)
      alert("Failed to save presentation. Please try again.")
    }
  }

  // If no presentation is loaded, disable the buttons
  if (!presentation) {
    return (
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="text-lg font-semibold text-gray-400">
          No presentation loaded
        </div>
      </div>
    )
  }

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold">
          {presentation.title || "Untitled Presentation"}
        </h1>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={saveAsJson}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md 
                   disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isExporting}
        >
          <Save className="w-5 h-5" />
          <span>Save</span>
        </button>
        <button
          onClick={exportToPptx}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md 
                   hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isExporting}
        >
          <Download className="w-5 h-5" />
          <span>{isExporting ? "Exporting..." : "Export to PPTX"}</span>
        </button>
      </div>
    </div>
  )
}
