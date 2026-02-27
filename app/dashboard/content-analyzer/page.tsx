'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Upload, AlertCircle, CheckCircle, BarChart3, Heart, MessageCircle, Share2 } from 'lucide-react'
import { PLATFORMS } from '@/lib/mock-data'

export default function ContentAnalyzerPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [analyzed, setAnalyzed] = useState(false)

  const handleAnalyze = () => {
    setAnalyzed(true)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Content Analyzer</h1>
        <p className="text-muted-foreground mt-1">Analyze your content performance and get AI-powered insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <Card className="lg:col-span-2 p-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">Upload Content</h2>

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

          {/* File Upload */}
          <div className="mb-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload size={32} className="mx-auto text-muted-foreground mb-3" />
              <p className="font-semibold text-foreground mb-1">Drop your content here or click to upload</p>
              <p className="text-sm text-muted-foreground">Supports text, images, and URLs</p>
            </div>
          </div>

          {/* Sample Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">Or paste content</label>
            <textarea
              placeholder="Paste your content here for analysis..."
              className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              rows={6}
              defaultValue="Just launched our new AI-powered tool! Excited to share what we've been working on. Check out the link in bio 🚀 #AI #Technology #Innovation"
            />
          </div>

          <Button onClick={handleAnalyze} className="w-full" disabled={!selectedPlatform}>
            Analyze Content
          </Button>
        </Card>

        {/* Quick Tips */}
        <Card className="p-6 bg-accent/5 border-accent/20">
          <h3 className="font-semibold text-foreground mb-4">Analysis Tips</h3>
          <div className="space-y-3 text-sm">
            <div className="flex gap-2">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">Analyze multiple formats at once</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">Get platform-specific insights</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">Compare performance metrics</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Analysis Results */}
      {analyzed && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Heart size={20} className="text-destructive" />
                <span className="text-sm text-muted-foreground">Sentiment</span>
              </div>
              <p className="text-2xl font-bold text-foreground">Positive</p>
              <Badge className="mt-2 bg-green-500/20 text-green-700 border-green-500/30">+85%</Badge>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 size={20} className="text-primary" />
                <span className="text-sm text-muted-foreground">Engagement</span>
              </div>
              <p className="text-2xl font-bold text-foreground">High</p>
              <Badge className="mt-2 bg-blue-500/20 text-blue-700 border-blue-500/30">+12.4%</Badge>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle size={20} className="text-accent" />
                <span className="text-sm text-muted-foreground">Readability</span>
              </div>
              <p className="text-2xl font-bold text-foreground">Excellent</p>
              <Badge className="mt-2 bg-accent/20 text-accent border-accent/30">A+</Badge>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Share2 size={20} className="text-primary" />
                <span className="text-sm text-muted-foreground">Shareability</span>
              </div>
              <p className="text-2xl font-bold text-foreground">Very High</p>
              <Badge className="mt-2 bg-green-500/20 text-green-700 border-green-500/30">+34%</Badge>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Detailed Insights</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Strong Call-to-Action</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your CTA is clear and compelling. Posts with explicit calls-to-action see 45% higher engagement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Optimal Length</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your content length is perfect for the selected platform. This length typically performs best.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Add Visual Elements</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Consider adding an image or emoji. Visual content gets 3x more engagement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recommendations</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-primary">
                  1
                </div>
                <div>
                  <p className="font-medium text-foreground">Add hashtags for discoverability</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Adding 3-5 relevant hashtags can increase reach by up to 56%
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-primary">
                  2
                </div>
                <div>
                  <p className="font-medium text-foreground">Publish at peak hours</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Best performance: Weekdays 9-11 AM and 6-9 PM for your audience
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-primary">
                  3
                </div>
                <div>
                  <p className="font-medium text-foreground">Engage with similar content</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Engage with 5-10 similar posts daily to build community
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
