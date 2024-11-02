// BaseTemplate.tsx
import React from "react"

export const PreviewText: React.FC<{
  content: string
  className?: string
}> = ({ content, className = "" }) => (
  <div className={`${className} overflow-hidden text-ellipsis`}>{content}</div>
)

export const PreviewContent: React.FC<{
  content: string[]
  className?: string
}> = ({ content, className = "" }) => (
  <div className="space-y-2">
    {content.slice(0, 2).map((text, index) => (
      <PreviewText
        key={index}
        content={text}
        className={`${className} text-sm leading-snug`}
      />
    ))}
  </div>
)

export const PreviewImage: React.FC<{
  url: string
  className?: string
}> = ({ url, className = "" }) => (
  <div
    className={`${className} bg-cover bg-center bg-no-repeat`}
    style={{ backgroundImage: `url(${url})` }}
  />
)
