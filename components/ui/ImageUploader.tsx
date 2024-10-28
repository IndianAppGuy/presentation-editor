"use client"

import { Link, Upload, X } from "lucide-react"
import React, { useRef, useState } from "react"

interface ImageUploaderProps {
  onUploadAction: (imageUrl: string) => void
  onCloseAction: () => void
  maxSize?: number // in MB
  allowedTypes?: string[]
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadAction,
  onCloseAction,
  maxSize = 10, // Default 10MB
  allowedTypes = ["image/jpeg", "image/png", "image/gif"]
}) => {
  const [imageUrl, setImageUrl] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleUrlSubmit = () => {
    setError("")

    if (!imageUrl) {
      setError("Please enter an image URL")
      return
    }

    if (!validateUrl(imageUrl)) {
      setError("Please enter a valid URL")
      return
    }

    const imgElement = document.createElement("img")
    imgElement.onload = () => {
      onUploadAction(imageUrl)
    }
    imgElement.onerror = () => {
      setError("Unable to load image from URL")
    }
    imgElement.src = imageUrl
  }

  const processFile = (file: File) => {
    setError("")

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setError(`Please upload a valid image file (${allowedTypes.join(", ")})`)
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    setIsLoading(true)

    try {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          // Convert the file to a data URL
          const dataUrl = event.target.result as string
          onUploadAction(dataUrl)
        }
      }
      reader.onerror = () => {
        setError("Error reading file")
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError("Error uploading image")
      console.error("Upload error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Image</h2>
          <button
            onClick={onCloseAction}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* URL Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleUrlSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              <Link className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-500">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div
            className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to {maxSize}MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={allowedTypes.join(",")}
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
            Uploading...
          </div>
        )}
      </div>
    </div>
  )
}
