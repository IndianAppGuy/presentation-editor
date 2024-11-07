// components/templates/BaseTemplate.tsx
import React from "react"

export const PreviewText: React.FC<{
  content: string
  className?: string
  isPreview?: boolean
}> = ({ content, className = "", isPreview = false }) => {
  // When in preview mode, we want much larger text to account for the scaling
  const previewStyles = isPreview
    ? "!text-[42px] !font-bold !leading-tight" // Using !important to override any other styles
    : ""

  return (
    <div
      className={`
      ${className}
      ${previewStyles}
      whitespace-normal
    `}
    >
      {content}
    </div>
  )
}

export const PreviewContent: React.FC<{
  content: string[]
  className?: string
  isPreview?: boolean
}> = ({ content, className = "", isPreview = false }) => {
  const previewStyles = isPreview ? "!text-[24px] !leading-tight" : ""

  return (
    <div className="space-y-2">
      {content.map((text, index) => (
        <div
          key={index}
          className={`
            ${className}
            ${previewStyles}
            whitespace-normal
          `}
        >
          {text}
        </div>
      ))}
    </div>
  )
}

export const PreviewImage: React.FC<{
  url: string
  className?: string
  isPreview?: boolean
}> = ({ url, className = "", isPreview = false }) => {
  const imageStyles = isPreview ? "!object-cover !w-full !h-full" : ""

  return (
    <div
      className={`
        ${className}
        ${imageStyles}
        bg-cover bg-center bg-no-repeat
      `}
      style={{ backgroundImage: `url(${url})` }}
    />
  )
}
