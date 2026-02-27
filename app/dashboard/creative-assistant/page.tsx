'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, ThumbsUp, Copy, RefreshCw, Sparkles, TrendingUp } from 'lucide-react'
import { CREATIVE_SUGGESTIONS } from '@/lib/mock-data'
import { useState } from 'react'

const detailedSuggestions = [
  {
    id: 1,
    title: 'Use Storytelling Format',
    description: 'Narrative-driven content performs 45% better with your audience',
    impact: '+45%',
    category: 'Format',
    examples: [
      'Start with a problem your audience faces',
      'Share how you discovered the solution',
      'Describe the transformation',
      'End with a call to action',
    ],
  },
  {
    id: 2,
    title: 'Add Call-to-Action',
    description: 'Content with clear CTAs sees 32% higher conversion rates',
    impact: '+32%',
    category: 'Engagement',
    examples: [
      'Ask a question in the caption',
      'Request a specific action (follow, share, comment)',
      'Include a link to more info',
      'Create urgency ("Limited time")',
    ],
  },
  {
    id: 3,
    title: 'Include Visual Elements',
    description: 'Posts with images get 3x more engagement',
    impact: '+3x',
    category: 'Visual',
    examples: [
      'Use high-quality images or videos',
      'Add infographics for data',
      'Include brand-consistent colors',
      'Use clear, readable text overlays',
    ],
  },
  {
    id: 4,
    title: 'Leverage Trending Audio',
    description: 'TikTok videos with trending sounds get 2.5x more views',
    impact: '+2.5x',
    category: 'Audio',
    examples: [
      'Use sounds from Top Sounds page',
      'Sync content to audio beat',
      'Create a unique angle on the trend',
      'Post within 24 hours of trend peak',
    ],
  },
  {
    id: 5,
    title: 'Strategic Hashtag Usage',
    description: 'Posts with 5-10 hashtags reach 56% more people',
    impact: '+56%',
    category: 'Discovery',
    examples: [
      'Mix popular and niche hashtags',
      'Research competitor hashtags',
      'Create a branded hashtag',
      'Avoid hashtag stuffing',
    ],
  },
  {
    id: 6,
    title: 'Post Timing Optimization',
    description: 'Posting at peak hours increases visibility by 40%',
    impact: '+40%',
    category: 'Strategy',
    examples: [
      'Post Tuesday-Thursday 9-11 AM',
      'Weekdays see 30% more engagement',
      'Avoid weekends for B2B content',
      'Test different times with your audience',
    ],
  },
]

export default function CreativeAssistantPage() {
  const [selectedSuggestion, setSelectedSuggestion] = useState(0)
  const [implementedSuggestions, setImplementedSuggestions] = useState<number[]>([])

  const handleImplement = (id: number) => {
    setImplementedSuggestions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const suggestion = detailedSuggestions[selectedSuggestion]

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Creative Assistant</h1>
        <p className="text-muted-foreground mt-1">Get AI-powered suggestions to boost your content performance</p>
      </div>

      {/* Suggestion Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CREATIVE_SUGGESTIONS.map((sug, idx) => (
          <Card
            key={idx}
            className="p-4 cursor-pointer transition-all hover:shadow-lg hover:border-primary"
            onClick={() => setSelectedSuggestion(idx)}
          >
            <div className="flex items-start gap-3">
              <Lightbulb size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">{sug.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{sug.description}</p>
                <Badge className="mt-2 bg-green-500/20 text-green-700 border-green-500/30 text-xs">
                  {sug.impact}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Suggestion List */}
        <div className="lg:col-span-1 space-y-2">
          {detailedSuggestions.map((sug, idx) => (
            <Card
              key={idx}
              onClick={() => setSelectedSuggestion(idx)}
              className={`p-4 cursor-pointer transition-all ${
                selectedSuggestion === idx
                  ? 'bg-primary/10 border-primary'
                  : 'hover:border-primary/50 hover:bg-secondary'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">{sug.title}</p>
                  <Badge className="mt-2 text-xs">{sug.category}</Badge>
                </div>
                {implementedSuggestions.includes(sug.id) && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Detailed View */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{suggestion.title}</h2>
                <p className="text-muted-foreground">{suggestion.description}</p>
              </div>
              <Badge className="bg-green-500/20 text-green-700 border-green-500/30 text-lg px-3 py-1">
                {suggestion.impact}
              </Badge>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => handleImplement(suggestion.id)}
                className={implementedSuggestions.includes(suggestion.id) ? 'bg-green-600' : ''}
              >
                {implementedSuggestions.includes(suggestion.id) ? '✓ Implemented' : 'Mark as Implemented'}
              </Button>
              <Button variant="outline">
                <Copy size={18} className="mr-2" />
                Copy Details
              </Button>
            </div>
          </Card>

          {/* How to Implement */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">How to Implement</h3>
            <div className="space-y-3">
              {suggestion.examples.map((example, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-primary">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed pt-0.5">{example}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Impact Analysis */}
          <Card className="p-6 bg-accent/5 border-accent/20">
            <h3 className="text-lg font-semibold text-foreground mb-4">Expected Impact</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                <span className="text-sm text-foreground">Engagement Rate</span>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-500" />
                  <span className="font-semibold text-green-600">{suggestion.impact}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground italic">
                Based on analysis of {Math.floor(Math.random() * 9000) + 1000} posts with this strategy
              </p>
            </div>
          </Card>

          {/* Related Suggestions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Combine with</h3>
            <div className="grid grid-cols-2 gap-2">
              {detailedSuggestions
                .filter((_, idx) => idx !== selectedSuggestion)
                .slice(0, 2)
                .map((sug) => (
                  <button
                    key={sug.id}
                    onClick={() =>
                      setSelectedSuggestion(detailedSuggestions.findIndex((s) => s.id === sug.id))
                    }
                    className="p-3 rounded-lg border border-border hover:border-primary/50 text-left transition-all"
                  >
                    <p className="text-xs font-medium text-foreground">{sug.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{sug.category}</p>
                  </button>
                ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Progress Summary */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">Your Progress</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Implemented Suggestions</span>
            <span className="text-2xl font-bold text-primary">
              {implementedSuggestions.length}/{detailedSuggestions.length}
            </span>
          </div>
          <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${(implementedSuggestions.length / detailedSuggestions.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {implementedSuggestions.length === detailedSuggestions.length
              ? 'You\'ve implemented all suggestions! 🎉'
              : `Implement ${detailedSuggestions.length - implementedSuggestions.length} more to maximize performance`}
          </p>
        </div>
      </Card>
    </div>
  )
}
