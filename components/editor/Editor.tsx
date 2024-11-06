// Editor.tsx
"use client"

import { usePresentation } from "@/lib/store/presentation"
import dynamic from "next/dynamic"

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

  // Editor.tsx
  return (
    <div className="h-screen flex flex-col bg-[#F8F9FC]">
      {" "}
      {/* Using exact color value */}
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="relative flex h-full w-max grow justify-center overflow-y-auto overflow-x-hidden transition-opacity delay-150 sm:overflow-hidden opacity-100 bg-[#F8F9FC]">
          <Canvas />
        </div>
      </div>
    </div>
  )
}

export default Editor
