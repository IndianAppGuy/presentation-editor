// app/page.tsx
"use client"

import Editor from "@/components/editor/Editor"
import { usePresentation } from "@/lib/store/presentation"
import { Presentation, SlideTemplate } from "@/lib/types"
import { useEffect } from "react"

// Sample data for testing
const SAMPLE_PRESENTATION: Presentation = {
  id: "1",
  title: "Sample Presentation",
  slides: [
    {
      id: "1",
      template: "default" as SlideTemplate,
      title: "Welcome to the Presentation",
      subtitle: "A Sample Slide Deck",
      bodyContent: [
        "This is a sample presentation",
        "You can edit the content",
        "Add new slides",
        "And export to PowerPoint"
      ]
    },
    {
      id: "2",
      template: "default" as SlideTemplate,
      title: "Second Slide",
      bodyContent: ["Point 1", "Point 2", "Point 3"]
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
}

export default function Home() {
  const { setPresentation } = usePresentation()

  useEffect(() => {
    // Load sample presentation
    setPresentation(SAMPLE_PRESENTATION)
  }, [setPresentation])

  return (
    <main>
      <Editor />
    </main>
  )
}
