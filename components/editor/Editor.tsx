"use client"

import { usePresentation } from "@/lib/store/presentation"
import dynamic from "next/dynamic"

// Import components
const Sidebar = dynamic(() => import("./Sidebar"), { ssr: false })
const Canvas = dynamic(() => import("./Canvas"), { ssr: false })
const Toolbar = dynamic(() => import("./Toolbar"), { ssr: false })

const Editor = () => {
  const { presentation } = usePresentation()

  if (!presentation) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">No presentation loaded</p>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <Toolbar />
      <div className="flex-1 flex">
        <Sidebar />
        <Canvas />
      </div>
    </div>
  )
}

export default Editor
