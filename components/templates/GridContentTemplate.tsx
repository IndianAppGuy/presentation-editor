// GridContentTemplate.tsx
import { TemplateProps } from "@/lib/types/templates"
import React from "react"
import EditableText from "../editor/EditableText"
import { PreviewText } from "./BaseTemplate"

interface ContentItem {
  title: string
  description: string
}

const parseContent = (content: string): ContentItem => {
  const parts = content.split(/\.(.+)/)
  return {
    title: parts[0].trim(),
    description: (parts[1] || "").trim()
  }
}

const GridContentTemplate: React.FC<TemplateProps> = ({
  slide,
  onEdit,
  isPreview = false
}) => {
  const contentItems = (slide.bodyContent || []).slice(0, 5)

  const handleContentUpdate = (
    index: number,
    newTitle: string,
    newDescription: string
  ) => {
    const newItem = `${newTitle}${newDescription ? `. ${newDescription}` : ""}`
    onEdit("bodyContent", newItem, index)
  }

  // Common styles
  const containerStyles = "w-full h-full flex flex-col relative overflow-hidden"
  const backgroundStyles =
    "absolute inset-0 bg-gradient-to-br from-black via-purple-900 to-cyan-900 opacity-90"
  const overlayStyles =
    "absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
  const contentContainerStyles =
    "relative w-full h-full flex flex-col px-12 py-10"
  const headerStyles = "text-gray-400/80 text-sm mb-2"
  const titleStyles = "text-4xl font-bold text-white mb-16"
  // Updated grid styles for better coverage
  const gridContainerStyles =
    "grid grid-cols-4 gap-5 flex-1 pb-12 mx-auto w-full"
  const cardStyles =
    "bg-black/20 backdrop-blur-sm rounded-xl p-7 flex flex-col hover:bg-black/30 transition-colors relative min-h-[200px]"
  const cardTitleStyles = "text-xl font-semibold text-white mb-4"
  const cardDescriptionStyles = "text-white/80 text-base leading-relaxed"

  // Preview Mode
  if (isPreview) {
    return (
      <div className={containerStyles}>
        {/* Background Layers */}
        <div className={backgroundStyles}>
          <div className={overlayStyles} />
        </div>

        {/* Main Content */}
        <div className={contentContainerStyles}>
          {/* Header */}
          <div className={headerStyles}>
            <PreviewText
              content={slide.subtitle || ""}
              className="opacity-80"
            />
          </div>

          {/* Title */}
          <div className="max-w-[80%]">
            <PreviewText content={slide.title} className={titleStyles} />
          </div>

          {/* Grid Layout */}
          <div className={gridContainerStyles}>
            {contentItems.map((content, index) => {
              const { title, description } = parseContent(content)
              return (
                <div key={index} className={cardStyles}>
                  <h3 className={cardTitleStyles}>{title}</h3>
                  <div className="flex-1">
                    <p className={cardDescriptionStyles}>{description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Edit Mode
  return (
    <div className={containerStyles}>
      {/* Background Layers */}
      <div className={backgroundStyles}>
        <div className={overlayStyles} />
      </div>

      {/* Main Content */}
      <div className={contentContainerStyles}>
        {/* Header */}
        <div className={headerStyles}>
          <EditableText
            content={slide.subtitle || ""}
            onEdit={(newValue) => onEdit("subtitle", newValue)}
            className="text-sm text-gray-400 opacity-80"
          />
        </div>

        {/* Title */}
        <div className="max-w-[80%]">
          <EditableText
            content={slide.title}
            onEdit={(newValue) => onEdit("title", newValue)}
            isTitle={true}
            className={titleStyles}
          />
        </div>

        {/* Grid Layout */}
        <div className={gridContainerStyles}>
          {contentItems.map((content, index) => {
            const { title, description } = parseContent(content)
            return (
              <div key={index} className={cardStyles}>
                <EditableText
                  content={title}
                  onEdit={(newTitle) =>
                    handleContentUpdate(index, newTitle, description)
                  }
                  className={cardTitleStyles}
                />
                <div className="flex-1">
                  <EditableText
                    content={description}
                    onEdit={(newDescription) =>
                      handleContentUpdate(index, title, newDescription)
                    }
                    className={cardDescriptionStyles}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default GridContentTemplate
