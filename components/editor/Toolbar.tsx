import React from 'react';
import { Download, Save } from 'lucide-react';
import { usePresentation } from '@/lib/store/presentation';

export default function Toolbar() {
  const { presentation } = usePresentation();

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold">{presentation?.title}</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded-md" title="Save">
          <Save className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md" title="Export to PowerPoint">
          <Download className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}