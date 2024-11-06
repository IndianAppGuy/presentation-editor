"use client"

import { usePresentation } from "@/lib/store/presentation"
import { Slide, SlideImage } from "@/lib/types"
import { Download, Save } from "lucide-react"
import PptxGenJS from "pptxgenjs"
import { useState } from "react"

// Helper function to convert CSS gradient to PPTX color
const convertGradient = (background: string = "") => {
  if (background.includes("from-blue-900 to-blue-800")) {
    return {
      color: "001E96",
      transparency: 0
    }
  } else if (background.includes("from-gray-900 to-gray-800")) {
    return {
      color: "1F2937",
      transparency: 0
    }
  }
  return { color: "1F2937" }
}

// Helper function to calculate image dimensions and position
const calculateImageDimensions = (
  image: SlideImage,
  template: string
): { x: number; y: number; w: number; h: number } => {
  switch (template) {
    case "image-right":
      return { x: 5.5, y: 0.5, w: 4, h: 6.5 }
    case "image-left":
      return { x: 0.5, y: 0.5, w: 4, h: 6.5 }
    case "split-image":
      return { x: 0.5, y: 1.5, w: 4.5, h: 5.5 }
    default:
      return { x: 6, y: 1, w: 3, h: 3 }
  }
}

export default function Toolbar() {
  const { presentation } = usePresentation()
  const [isExporting, setIsExporting] = useState(false)

  const exportToPptx = async () => {
    if (!presentation) return

    try {
      setIsExporting(true)
      const pptx = new PptxGenJS()

      // Set presentation properties
      pptx.author = "Presentation Editor"
      pptx.company = "Your Company"
      pptx.title = presentation.title || "Untitled Presentation"
      pptx.layout = "LAYOUT_16x9"

      // Process each slide
      await Promise.all(
        presentation.slides.map(async (slide: Slide) => {
          const pptxSlide = pptx.addSlide()

          // Set background based on template
          const theme = slide.theme || {}
          pptxSlide.background = convertGradient(theme.background)

          // Add title with proper styling
          if (slide.title) {
            pptxSlide.addText(slide.title, {
              x: 0.5,
              y: 0.5,
              w: slide.template.includes("image") ? "45%" : "90%",
              h: 1,
              fontSize: 36,
              bold: true,
              color: theme.textColor || "FFFFFF",
              align: slide.template === "split-image" ? "center" : "left",
              fontFace: theme.fontFamily || "Arial"
            })
          }

          // Add subtitle if exists
          if (slide.subtitle) {
            pptxSlide.addText(slide.subtitle, {
              x: 0.5,
              y: slide.template === "split-image" ? 1.2 : 1.7,
              w: slide.template.includes("image") ? "45%" : "90%",
              h: 0.5,
              fontSize: 24,
              color: theme.textColor || "FFFFFF",
              align: slide.template === "split-image" ? "center" : "left",
              fontFace: theme.fontFamily || "Arial"
            })
          }

          // Add body content with proper positioning
          if (slide.bodyContent?.length > 0) {
            const contentStartY =
              slide.template === "split-image"
                ? slide.subtitle
                  ? 2.0
                  : 1.5
                : slide.subtitle
                ? 2.5
                : 2.0

            const bulletProps = {
              type: "bullet" as const,
              characterCode: "2022" // Unicode bullet point
            }

            // Create array of text objects with proper typing
            const bodyContent: PptxGenJS.TextProps[] = slide.bodyContent.map(
              (text) => ({
                text: text,
                options: {
                  color: theme.textColor || "FFFFFF",
                  fontSize: 18,
                  fontFace: theme.fontFamily || "Arial",
                  bullet: bulletProps,
                  indentLevel: 0
                }
              })
            )

            pptxSlide.addText(bodyContent, {
              x: slide.template === "image-left" ? 5 : 0.5,
              y: contentStartY,
              w: slide.template.includes("image") ? "45%" : "90%",
              h: 4,
              align: slide.template === "split-image" ? "left" : "left",
              color: theme.textColor || "FFFFFF",
              fontSize: 18,
              fontFace: theme.fontFamily || "Arial",
              bullet: bulletProps
            })
          }

          // Add image with proper positioning
          if (slide.image?.url || slide.imageUrl) {
            const imageUrl = slide.image?.url || slide.imageUrl
            if (imageUrl) {
              try {
                const dimensions = calculateImageDimensions(
                  slide.image || { url: imageUrl },
                  slide.template
                )

                await pptxSlide.addImage({
                  path: imageUrl,
                  ...dimensions,
                  sizing: {
                    type: "contain",
                    w: dimensions.w,
                    h: dimensions.h
                  }
                })
              } catch (error) {
                console.error("Error adding image:", error)
              }
            }
          }
        })
      )

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

  // Toolbar.tsx - update the main container and layout
  return (
    <div className="lg:sticky lg:top-0 z-10 flex min-h-20 shrink-0 justify-center border-b border-gray-200 bg-[#F8F9FC] lg:bg-white px-4 py-5 lg:px-6">
      {/* Content container */}
      <div className="flex w-full flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        {/* Title section */}
        <div className="flex items-center text-gray-600 text-sm">
          <h1 className="font-semibold text-gray-900">
            {presentation?.title || "Untitled Presentation"}
          </h1>
        </div>

        {/* Actions section */}
        <div className="flex items-center gap-3">
          <button
            onClick={saveAsJson}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm 
                   font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isExporting || !presentation}
          >
            <Save className="w-5 h-5" />
            <span>Save</span>
          </button>

          <button
            onClick={exportToPptx}
            className="flex items-center justify-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-3.5 py-2 
                   text-sm font-semibold text-white shadow-sm hover:bg-blue-700 hover:border-blue-700 
                   disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isExporting || !presentation}
          >
            <Download className="w-5 h-5" />
            <span>{isExporting ? "Exporting..." : "Export to PPTX"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
