'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Copy } from 'lucide-react'
import { PLATFORMS } from '@/lib/mock-data'

export default function ContentGeneratorPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>('instagram')
  const [topic, setTopic] = useState('')
  const [generated, setGenerated] = useState(false)
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [tone, setTone] = useState('Professional')
  const [contentLength, setContentLength] = useState('Medium')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [mainType, setMainType] = useState('Text')
  const [subType, setSubType] = useState('Paragraph')

  const subTypeOptions: Record<string, string[]> = {
    Text: ['Paragraph', 'Hashtags', 'Thumbnail', 'Description'],
    Video: ['Video Script', 'Thumbnail', 'Description'],
    Audio: ['Audio Script']
  }

  const buttonStyle = (active: boolean) =>
    `p-3 rounded-lg border-2 transition-all font-medium text-sm ${
      active
        ? 'border-primary bg-primary/10 text-primary'
        : 'border-border hover:border-primary/50 text-foreground'
    }`

  const handleGenerate = async () => {
    try {
      setLoading(true)
      setGenerated(false)
      setErrorMessage(null)

      if (!topic.trim()) throw new Error('Please enter a prompt or topic')

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: topic,
          platform: selectedPlatform,
          tone,
          length: contentLength,
          mainType,
          subType
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Generation failed')

      setOutput(data.output.trim())
      setGenerated(true)

    } catch (error: any) {
      setErrorMessage(error.message || 'Error generating content')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
  }

  return (
    <div className="space-y-6 pb-12">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Content Generator</h1>
        <p className="text-muted-foreground mt-1">
          You can write full instructions or just a topic. AI will understand.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Settings */}
        <Card className="lg:col-span-2 p-8">
          <h2 className="text-lg font-semibold mb-6">Generate New Content</h2>

          {/* Platform */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Select Platform</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={buttonStyle(selectedPlatform === platform.id)}
                >
                  {platform.name}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Prompt or Topic
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={4}
              placeholder="Example:
Write a humorous short Instagram caption about AI.
OR
AI in healthcare."
              className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              If you include tone, format, or length in your prompt, AI will automatically detect it.
            </p>
          </div>

          {/* Main Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Main Type (Optional)</label>
            <div className="grid grid-cols-3 gap-2">
              {['Text', 'Video', 'Audio'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setMainType(type)
                    setSubType(subTypeOptions[type][0])
                  }}
                  className={buttonStyle(mainType === type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Format (Optional)</label>
            <div className="grid grid-cols-2 gap-2">
              {subTypeOptions[mainType].map((type) => (
                <button
                  key={type}
                  onClick={() => setSubType(type)}
                  className={buttonStyle(subType === type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Tone (Optional)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Professional', 'Casual', 'Humorous', 'Inspirational'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={buttonStyle(tone === t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Length */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Content Length (Optional)</label>
            <div className="grid grid-cols-3 gap-2">
              {['Short', 'Medium', 'Long'].map((length) => (
                <button
                  key={length}
                  onClick={() => setContentLength(length)}
                  className={buttonStyle(contentLength === length)}
                >
                  {length}
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
          )}

          <Button onClick={handleGenerate} className="w-full" size="lg" disabled={loading}>
            <Sparkles size={18} className="mr-2" />
            {loading ? 'Generating...' : 'Generate Content'}
          </Button>
        </Card>

        {/* Feature Card */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Smart AI Features</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Detects tone automatically</li>
            <li>• Understands typos</li>
            <li>• Adjusts length intelligently</li>
            <li>• Generates format-aware content</li>
          </ul>
        </Card>
      </div>

      {/* Output */}
      {generated && output && (
        <Card className="p-6 mt-6">
          <div className="whitespace-pre-wrap mb-6 text-foreground">
            {output}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Characters</p>
              <p className="font-bold">{output.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Words</p>
              <p className="font-bold">
                {output.split(/\s+/).filter(Boolean).length}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Emojis</p>
              <p className="font-bold">
                {(output.match(/[\p{Emoji}]/gu) || []).length}
              </p>
            </div>
          </div>

          <Button onClick={handleCopy}>
            <Copy size={16} className="mr-2" />
            Copy to Clipboard
          </Button>
        </Card>
      )}
    </div>
  )
}



