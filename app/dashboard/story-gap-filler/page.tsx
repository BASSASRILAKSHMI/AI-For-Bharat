'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { GitBranch, ListChecks, Loader2, Sparkles, TextCursorInput } from 'lucide-react'
import type { StoryGapFillerResult } from '@/lib/types/story-gap-filler'

const DEFAULT_CONTENT =
  'I started building a creator tool last month. Adoption has been strong. We shipped new features this week. Now we are planning expansion.'

export default function ContentAnalyzerPage() {
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [weightage, setWeightage] = useState(65)
  const [emotionConsistent, setEmotionConsistent] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<StoryGapFillerResult | null>(null)

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError('Please add story content first.')
      return
    }

    setError(null)
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/story-gap-filler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          options: {
            weightageBoost: weightage,
            preserveEmotion: emotionConsistent,
          },
        }),
      })

      const data = (await res.json()) as StoryGapFillerResult & { error?: string }
      if (!res.ok) {
        setError(data.error || 'Story gap filling failed.')
        return
      }

      setResult(data)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Story Gap Filler</h1>
        <p className="text-muted-foreground mt-1">
          Detects missing narrative flow and returns one complete coherent story.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">What It Does</h2>
        <p className="text-sm text-muted-foreground">
          Finds abrupt transitions, missing context (why, how, result), and weak logic flow; then
          fills those gaps to produce one improved complete story.
        </p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Story Input</h2>
          <Label className="text-sm font-medium text-foreground">Paste content</Label>
          <textarea
            className="w-full mt-2 px-4 py-3 rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            rows={9}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste draft story/caption/script here..."
          />
        </Card>

        <Card className="p-6 bg-accent/5 border-accent/20">
          <h3 className="font-semibold text-foreground mb-4">Senses / Analyses</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <GitBranch size={16} className="mt-0.5 text-primary" />
              <span className="text-muted-foreground">Abrupt transitions</span>
            </div>
            <div className="flex items-start gap-3">
              <TextCursorInput size={16} className="mt-0.5 text-primary" />
              <span className="text-muted-foreground">Missing context (why, how, result)</span>
            </div>
            <div className="flex items-start gap-3">
              <ListChecks size={16} className="mt-0.5 text-primary" />
              <span className="text-muted-foreground">Logical flow of ideas</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Weightage Booster</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-foreground">
              Gap fill strength ({weightage})
            </Label>
            <Slider
              className="mt-2"
              min={0}
              max={100}
              value={[weightage]}
              onValueChange={([v]) => setWeightage(v ?? 65)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium text-foreground">Emotion-consistent gap filling</p>
              <p className="text-xs text-muted-foreground">
                Keeps original emotional tone while filling narrative gaps.
              </p>
            </div>
            <Switch checked={emotionConsistent} onCheckedChange={setEmotionConsistent} />
          </div>
        </div>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button className="gap-2" onClick={handleGenerate} disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Complete Story
            </>
          )}
        </Button>
        {result && (
          <Button variant="outline" onClick={handleReset}>
            Reset Result
          </Button>
        )}
      </div>

      {result && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-4">
              <div className="rounded-lg border border-border p-4 bg-secondary/40">
                <p className="text-muted-foreground mb-1">Abrupt transitions</p>
                <p className="text-2xl font-semibold text-foreground">
                  {result.analysis.abruptTransitions.length}
                </p>
              </div>
              <div className="rounded-lg border border-border p-4 bg-secondary/40">
                <p className="text-muted-foreground mb-1">Missing context flags</p>
                <p className="text-2xl font-semibold text-foreground">
                  {result.analysis.missingContext.length}
                </p>
              </div>
              <div className="rounded-lg border border-border p-4 bg-secondary/40">
                <p className="text-muted-foreground mb-1">Logical flow score</p>
                <p className="text-2xl font-semibold text-foreground">
                  {result.analysis.logicalFlowScore}%
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {result.analysis.abruptTransitions.map((item, idx) => (
                <p key={`${item}-${idx}`} className="text-sm text-muted-foreground">
                  {idx + 1}. {item}
                </p>
              ))}
              {result.analysis.missingContext.map((item, idx) => (
                <p key={`${item}-${idx}`} className="text-sm text-muted-foreground">
                  {idx + 1 + result.analysis.abruptTransitions.length}. {item}
                </p>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Generated Gap Fills</h3>
            <div className="space-y-3 text-sm">
              <div className="rounded-lg border border-border p-3 bg-card">
                <p className="text-xs text-muted-foreground mb-1">Intro suggestion</p>
                <p className="text-foreground">{result.enhancements.introSuggestion || '-'}</p>
              </div>
              <div className="rounded-lg border border-border p-3 bg-card">
                <p className="text-xs text-muted-foreground mb-1">Outro suggestion</p>
                <p className="text-foreground">{result.enhancements.outroSuggestion || '-'}</p>
              </div>
              <div className="rounded-lg border border-border p-3 bg-card">
                <p className="text-xs text-muted-foreground mb-2">Connecting lines</p>
                <div className="space-y-2">
                  {result.enhancements.connectingLines.length ? (
                    result.enhancements.connectingLines.map((line, idx) => (
                      <p key={`${line}-${idx}`} className="text-foreground">
                        {idx + 1}. {line}
                      </p>
                    ))
                  ) : (
                    <p className="text-foreground">No extra bridges needed.</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Completed Story</h3>
            <div className="rounded-lg border border-border p-4 bg-card">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {result.completedStory || '-'}
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
