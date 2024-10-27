"use client"

import { templateConfigs } from "@/components/templates"
import { SlideTemplate, TemplateConfig } from "@/lib/types"
import { X } from "lucide-react"
import Image from "next/image"
import React from "react"

interface TemplateSelectorProps {
  onSelectAction: (template: SlideTemplate) => void
  onCloseAction: () => void
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelectAction,
  onCloseAction
}) => {
  // Group templates by category
  const templatesByCategory = templateConfigs.reduce((acc, template) => {
    const category = template.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(template)
    return acc
  }, {} as Record<string, TemplateConfig[]>)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Choose Template</h2>
          <button
            onClick={onCloseAction}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="space-y-8">
          {Object.entries(templatesByCategory).map(([category, templates]) => (
            <div key={category}>
              <h3 className="text-lg font-medium mb-4 text-gray-700">
                {category}
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="group cursor-pointer"
                    onClick={() => onSelectAction(template.id)}
                  >
                    {/* Template Preview */}
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-2 border-2 border-transparent group-hover:border-blue-500 transition-colors">
                      {template.thumbnail ? (
                        <Image
                          src={template.thumbnail}
                          alt={template.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400">{template.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Template Info */}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {template.description}
                      </p>
                    </div>

                    {/* Features Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.supports.images && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Images
                        </span>
                      )}
                      {template.supports.subtitle && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          Subtitle
                        </span>
                      )}
                      {template.supports.theme && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                          Custom Theme
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
