'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Upload, Play, BarChart3, Smile, Frown, Zap } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const emotionalData = [
  { timestamp: '0s', joy: 45, sadness: 10, surprise: 25, anger: 5, neutral: 15 },
  { timestamp: '30s', joy: 65, sadness: 8, surprise: 15, anger: 3, neutral: 9 },
  { timestamp: '60s', joy: 72, sadness: 5, surprise: 12, anger: 2, neutral: 9 },
  { timestamp: '90s', joy: 68, sadness: 12, surprise: 8, anger: 4, neutral: 8 },
  { timestamp: '120s', joy: 75, sadness: 3, surprise: 10, anger: 2, neutral: 10 },
]

const keyClips = [
  { time: '0:15', duration: '5s', emotion: 'joy', description: 'Peak engagement moment', thumbnail: '😊' },
  { time: '0:42', duration: '3s', emotion: 'surprise', description: 'Unexpected twist detected', thumbnail: '😲' },
  { time: '1:28', duration: '6s', emotion: 'joy', description: 'Strong positive response', thumbnail: '😊' },
]

export default function VideoIntelligencePage() {
  const [analyzed, setAnalyzed] = useState(false)

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Video Intelligence</h1>
        <p className="text-muted-foreground mt-1">Analyze viewer emotions and engagement throughout your video</p>
      </div>

      {!analyzed ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <Card className="lg:col-span-2 p-8">
            <h2 className="text-lg font-semibold text-foreground mb-6">Upload Video</h2>

            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer mb-6">
              <Play size={48} className="mx-auto text-muted-foreground mb-3" />
              <p className="font-semibold text-foreground mb-1">Drop your video here or click to upload</p>
              <p className="text-sm text-muted-foreground">Supports MP4, WebM, and other formats up to 1GB</p>
            </div>

            <Button className="w-full" onClick={() => setAnalyzed(true)} size="lg">
              Analyze Video
            </Button>
          </Card>

          {/* Info */}
          <Card className="p-6 bg-accent/5 border-accent/20">
            <h3 className="font-semibold text-foreground mb-4">What We Analyze</h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <Smile size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Emotional reactions</span>
              </div>
              <div className="flex gap-2">
                <BarChart3 size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Engagement timeline</span>
              </div>
              <div className="flex gap-2">
                <Zap size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Peak moments</span>
              </div>
              <div className="flex gap-2">
                <Play size={16} className="text-purple-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Drop-off points</span>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Video Preview */}
          <Card className="p-6">
            <div className="bg-secondary rounded-lg h-80 flex items-center justify-center">
              <div className="text-center">
                <Play size={64} className="text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Video Preview - Sample Video Title.mp4</p>
              </div>
            </div>
          </Card>

          {/* Emotional Timeline */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Emotional Timeline</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={emotionalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="timestamp" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                <Line type="monotone" dataKey="joy" stroke="#10b981" strokeWidth={2} dot={false} name="Joy" />
                <Line type="monotone" dataKey="surprise" stroke="#f59e0b" strokeWidth={2} dot={false} name="Surprise" />
                <Line type="monotone" dataKey="sadness" stroke="#3b82f6" strokeWidth={2} dot={false} name="Sadness" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Emotion Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="p-6 text-center">
              <Smile size={32} className="mx-auto text-green-500 mb-3" />
              <p className="text-muted-foreground text-sm mb-2">Joy</p>
              <p className="text-2xl font-bold text-foreground">68%</p>
            </Card>
            <Card className="p-6 text-center">
              <Badge className="mx-auto mb-3 w-fit">😲</Badge>
              <p className="text-muted-foreground text-sm mb-2">Surprise</p>
              <p className="text-2xl font-bold text-foreground">15%</p>
            </Card>
            <Card className="p-6 text-center">
              <Frown size={32} className="mx-auto text-blue-500 mb-3" />
              <p className="text-muted-foreground text-sm mb-2">Sadness</p>
              <p className="text-2xl font-bold text-foreground">8%</p>
            </Card>
            <Card className="p-6 text-center">
              <Badge className="mx-auto mb-3 w-fit">😠</Badge>
              <p className="text-muted-foreground text-sm mb-2">Anger</p>
              <p className="text-2xl font-bold text-foreground">3%</p>
            </Card>
            <Card className="p-6 text-center">
              <Badge className="mx-auto mb-3 w-fit">😐</Badge>
              <p className="text-muted-foreground text-sm mb-2">Neutral</p>
              <p className="text-2xl font-bold text-foreground">6%</p>
            </Card>
          </div>

          {/* Key Moments */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Key Moments</h2>
            <div className="space-y-3">
              {keyClips.map((clip, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center text-2xl">
                    {clip.thumbnail}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{clip.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {clip.time} ({clip.duration})
                    </p>
                  </div>
                  <Badge
                    className={`whitespace-nowrap ${
                      clip.emotion === 'joy'
                        ? 'bg-green-500/20 text-green-700 border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'
                    }`}
                  >
                    {clip.emotion}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6 bg-primary/5 border-primary/20">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recommendations</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  ✓
                </div>
                <div>
                  <p className="font-medium text-foreground">Highlight the peak moments</p>
                  <p className="text-sm text-muted-foreground">
                    Create clips from 0:15-0:20 and 1:28-1:34 for maximum engagement
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  !
                </div>
                <div>
                  <p className="font-medium text-foreground">Reduce the middle section</p>
                  <p className="text-sm text-muted-foreground">
                    The engagement dips at 1:10. Consider cutting or restructuring this part
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
