"use client"

import { Pencil } from "lucide-react"
import React, { useCallback, useEffect, useRef, useState } from "react"

export interface EditableTextProps {
  content: string
  onEdit: (newValue: string) => void
  className?: string
  isTitle?: boolean
}

const EditableText: React.FC<EditableTextProps> = ({
  content,
  onEdit,
  className = "",
  isTitle = false
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(content)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setEditValue(content)
  }, [content])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = useCallback(() => {
    if (editValue !== content) {
      onEdit(editValue)
    }
    setIsEditing(false)
  }, [editValue, content, onEdit])

  // Handle click outside to save
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleSave()
      }
    }

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isEditing, handleSave])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
    if (e.key === "Escape") {
      setIsEditing(false)
      setEditValue(content)
    }
  }

  return (
    <div
      ref={containerRef}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        // Edit mode
        isTitle ? (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-white/10 text-4xl font-bold text-white rounded p-2 
                     outline-none border border-blue-400 focus:border-blue-500"
          />
        ) : (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="w-full bg-white/10 text-xl text-white/90 rounded p-2 
                     outline-none border border-blue-400 focus:border-blue-500 
                     resize-none overflow-hidden"
            style={{ minHeight: "2.5rem" }}
          />
        )
      ) : (
        // Display mode
        <div
          onClick={() => setIsEditing(true)}
          className={`
            cursor-text
            ${isHovered ? "bg-white/10" : ""}
            rounded p-2 transition-colors
            ${className}
          `}
        >
          {isTitle ? (
            <h1 className="text-4xl font-bold text-white">{content}</h1>
          ) : (
            <p className="text-xl text-white/90">{content}</p>
          )}

          {/* Edit button */}
          <div
            className={`
              absolute -right-12 top-1/2 transform -translate-y-1/2
              transition-opacity duration-200
              ${isHovered ? "opacity-100" : "opacity-0"}
            `}
          >
            <button
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(true)
              }}
            >
              <Pencil className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditableText
