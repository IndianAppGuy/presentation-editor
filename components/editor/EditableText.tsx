"use client"

import { Pencil } from "lucide-react"
import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"

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
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editValue, setEditValue] = useState(content)

  const handleSave = () => {
    if (editValue !== content) {
      onEdit(editValue)
    }
    setIsDialogOpen(false)
  }

  const handleOpen = () => {
    setEditValue(content)
    setIsDialogOpen(true)
  }

  return (
    <>
      <div
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          onClick={handleOpen}
          className={`
            cursor-pointer
            rounded
            transition-all
            duration-200
            ${isHovered ? "ring-2 ring-blue-500 ring-opacity-50" : ""}
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
                handleOpen()
              }}
            >
              <Pencil className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit text</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full min-h-[100px] p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your text..."
            />
          </div>
          <DialogFooter className="flex justify-end gap-2 px-4 pb-4">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EditableText
