'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Copy, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react'
import { PLATFORMS } from '@/lib/mock-data'

export default function ContentGeneratorPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>('instagram')
  const [topic, setTopic] = useState('AI and Machine Learning')
  const [generated, setGenerated] = useState(false)
  const [selectedVariation, setSelectedVariation] = useState(0)

  const variations = [
    '🚀 Excited to share insights on AI and Machine Learning! The future of technology is being shaped right now. From predictive analytics to natural language processing, the possibilities are endless. What are your thoughts on the AI revolution? Drop your insights in the comments! 💭 #AI #MachineLearning #Technology #Innovation',
    'The world of Machine Learning is evolving faster than ever! 📈 Discover how AI is transforming industries, from healthcare to finance. Join the conversation about the future of intelligent systems. What aspect of ML interests you the most? Let\'s discuss! #AI #ML #TechTrends',
    'Machine Learning isn\'t just for tech companies anymore. 🤖 Every industry is adopting AI to drive innovation. Whether it\'s automation, prediction, or personalization - AI is changing the game. What\'s your AI superpower? Share your experiences! #ArtificialIntelligence #FutureOfWork #Innovation',
  ]

  const handleGenerate = () => {
    setGenerated(true)
    setSelectedVariation(0)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(variations[selectedVariation])
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Content Generator</h1>
        <p className="text-muted-foreground mt-1">Generate platform-optimized content with AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generation Settings */}
        <Card className="lg:col-span-2 p-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">Generate New Content</h2>

          {/* Platform Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">Select Platform</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`p-3 rounded-lg border-2 transition-all font-medium text-sm ${
                    selectedPlatform === platform.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 text-foreground'
                  }`}
                >
                  {platform.name}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">Topic or Keyword</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What would you like to create content about?"
              className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Tone Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">Tone</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Professional', 'Casual', 'Humorous', 'Inspirational'].map((tone) => (
                <button
                  key={tone}
                  className="p-3 rounded-lg border border-border hover:border-primary/50 text-foreground text-sm font-medium transition-all"
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          {/* Content Length */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">Content Length</label>
            <div className="grid grid-cols-3 gap-2">
              {['Short', 'Medium', 'Long'].map((length) => (
                <button
                  key={length}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    length === 'Medium'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 text-foreground'
                  }`}
                >
                  {length}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleGenerate} className="w-full" size="lg">
            <Sparkles size={18} className="mr-2" />
            Generate Content
          </Button>
        </Card>

        {/* Quick Features */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Features</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm font-medium text-foreground">Multiple Variations</p>
              <p className="text-xs text-muted-foreground mt-1">Get 3 unique versions to choose from</p>
            </div>
            <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
              <p className="text-sm font-medium text-foreground">Platform-Optimized</p>
              <p className="text-xs text-muted-foreground mt-1">Content tailored to each platform</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary border border-border">
              <p className="text-sm font-medium text-foreground">Hashtags Included</p>
              <p className="text-xs text-muted-foreground mt-1">Trending hashtags for reach</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary border border-border">
              <p className="text-sm font-medium text-foreground">Emoji Enhanced</p>
              <p className="text-xs text-muted-foreground mt-1">Strategic emoji placement</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Generated Content */}
      {generated && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Generated Variations</h2>
            <Button variant="outline" onClick={handleGenerate} size="sm" className="gap-2">
              <RefreshCw size={16} />
              Regenerate
            </Button>
          </div>

          {/* Variation Tabs */}
          <div className="flex gap-2 border-b border-border">
            {variations.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedVariation(index)}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-all ${
                  selectedVariation === index
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Variation {index + 1}
              </button>
            ))}
          </div>

          {/* Content Preview */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary border border-border">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{variations[selectedVariation]}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-secondary">
                  <p className="text-xs text-muted-foreground mb-1">Characters</p>
                  <p className="text-lg font-bold text-foreground">{variations[selectedVariation].length}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary">
                  <p className="text-xs text-muted-foreground mb-1">Words</p>
                  <p className="text-lg font-bold text-foreground">{variations[selectedVariation].split(/\s+/).length}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary">
                  <p className="text-xs text-muted-foreground mb-1">Emojis</p>
                  <p className="text-lg font-bold text-foreground">{(variations[selectedVariation].match(/[\p{Emoji}]/gu) || []).length}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 flex-col sm:flex-row">
                <Button onClick={handleCopy} className="flex-1" variant="default" size="lg">
                  <Copy size={18} className="mr-2" />
                  Copy to Clipboard
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Sparkles size={18} className="mr-2" />
                  Edit & Refine
                </Button>
              </div>

              {/* Feedback */}
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <ThumbsUp size={16} />
                  Helpful
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <ThumbsDown size={16} />
                  Not Helpful
                </Button>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-6 bg-accent/5 border-accent/20">
            <h3 className="font-semibold text-foreground mb-3">Tips for Best Results</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Customize the content to match your brand voice</li>
              <li>• Test different hashtags to find what works for your audience</li>
              <li>• Post at optimal times for maximum engagement</li>
              <li>• Mix generated content with authentic personal stories</li>
            </ul>
          </Card>
        </div>
      )}
    </div>
  )
}
