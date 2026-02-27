'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Type, Palette, Image as ImageIcon, Download, RotateCcw, Save } from 'lucide-react'

export default function CanvasEditorPage() {
  const [selectedTool, setSelectedTool] = useState<'text' | 'color' | 'image' | null>(null)
  const [textColor, setTextColor] = useState('#000000')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Canvas Editor</h1>
        <p className="text-muted-foreground mt-1">Create and design beautiful visual content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Toolbar */}
        <Card className="p-4 h-fit">
          <h3 className="font-semibold text-foreground mb-4">Tools</h3>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedTool('text')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                selectedTool === 'text'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              <Type size={18} />
              Add Text
            </button>
            <button
              onClick={() => setSelectedTool('color')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                selectedTool === 'color'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              <Palette size={18} />
              Colors
            </button>
            <button
              onClick={() => setSelectedTool('image')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                selectedTool === 'image'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              <ImageIcon size={18} />
              Image
            </button>
          </div>

          {/* Tool Options */}
          <div className="mt-6 pt-6 border-t border-border">
            {selectedTool === 'text' && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Text Color</p>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {selectedTool === 'color' && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Background</p>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {selectedTool === 'image' && (
              <div className="space-y-2">
                <button className="w-full px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-sm font-medium transition-all">
                  Upload Image
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* Canvas Area */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-8" style={{ backgroundColor }}>
            <div className="min-h-96 flex flex-col items-center justify-center text-center space-y-4">
              <div className="text-6xl font-bold" style={{ color: textColor }}>
                Your Content
              </div>
              <p className="text-lg" style={{ color: textColor }}>
                Drag elements to customize your design
              </p>
              <div className="w-24 h-24 rounded-full mx-auto mt-8" style={{ backgroundColor: textColor, opacity: 0.1 }} />
            </div>
          </Card>

          {/* Controls */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 gap-2">
              <RotateCcw size={18} />
              Reset
            </Button>
            <Button className="flex-1 gap-2">
              <Save size={18} />
              Save Draft
            </Button>
          </div>
        </div>

        {/* Settings & Export */}
        <Card className="p-4 h-fit space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-3">Settings</h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-foreground font-medium mb-2">Canvas Size</label>
                <select className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option>Instagram Post (1080x1080)</option>
                  <option>Instagram Story (1080x1920)</option>
                  <option>Twitter (1200x675)</option>
                  <option>LinkedIn (1200x627)</option>
                  <option>Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-foreground font-medium mb-2">Font</label>
                <select className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option>Inter</option>
                  <option>Georgia</option>
                  <option>Courier</option>
                  <option>Comic Sans MS</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <Button className="w-full gap-2 mb-2">
              <Download size={18} />
              Export
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Download as PNG, JPG, or PDF
            </p>
          </div>

          <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
            <p className="text-xs text-muted-foreground">
              💡 Tip: Use the preset templates for faster creation
            </p>
          </div>
        </Card>
      </div>

      {/* Templates */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Templates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Minimal', colors: ['bg-white', 'bg-gray-100', 'bg-gray-300'] },
            { name: 'Bold', colors: ['bg-blue-600', 'bg-purple-600', 'bg-pink-600'] },
            { name: 'Sunset', colors: ['bg-yellow-400', 'bg-orange-500', 'bg-red-600'] },
            { name: 'Ocean', colors: ['bg-cyan-400', 'bg-blue-500', 'bg-indigo-600'] },
          ].map((template) => (
            <Card
              key={template.name}
              className="p-4 cursor-pointer hover:shadow-lg transition-all hover:border-primary"
            >
              <div className="flex gap-2 h-24 rounded-lg overflow-hidden mb-3">
                {template.colors.map((color, idx) => (
                  <div key={idx} className={`flex-1 ${color}`} />
                ))}
              </div>
              <p className="font-medium text-foreground text-sm">{template.name}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
