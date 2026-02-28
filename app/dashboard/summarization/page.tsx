'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Copy, RefreshCw, Sparkles, Loader2 } from 'lucide-react'
import { PLATFORMS } from '@/lib/mock-data'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import type {
  PlatformId,
  SummaryStyle,
  AudienceType,
  SummarizationOptions,
  PlatformSummary,
  SummarizationResult,
} from '@/lib/types/summarization'

type InputMode = 'text' | 'video'

const SUMMARY_STYLES: { value: SummaryStyle; label: string }[] = [
  { value: 'bullet', label: 'Bullet points' },
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'caption', label: 'Short caption' },
]

const AUDIENCES: { value: AudienceType; label: string }[] = [
  { value: 'student', label: 'Student' },
  { value: 'professional', label: 'Professional' },
  { value: 'general', label: 'General' },
]

const PLATFORM_RULES: Record<PlatformId, { maxChars: number; tone: string }> = {
  instagram: { maxChars: 2200, tone: 'Emoji-rich, visual-focused' },
  tiktok: { maxChars: 150, tone: 'Catchy, trendy hooks' },
  linkedin: { maxChars: 3000, tone: 'Professional insights' },
  twitter: { maxChars: 280, tone: 'Concise, impactful' },
  youtube: { maxChars: 5000, tone: 'Detailed descriptions' },
}

const DEFAULT_CONTENT =
  'Just launched our revolutionary AI platform that helps creators and brands manage their content across all social media channels. With advanced analytics, AI-powered suggestions, and safety compliance checks, ContentIQ is the complete solution for content creators. We are excited to bring this to market and help thousands of creators succeed.'

export default function SummarizationPage() {
  const [inputMode, setInputMode] = useState<InputMode>('text')
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoContext, setVideoContext] = useState('')
  const [platforms, setPlatforms] = useState<PlatformId[]>([
    'instagram',
    'tiktok',
    'linkedin',
    'twitter',
    'youtube',
  ])
  const [style, setStyle] = useState<SummaryStyle>('paragraph')
  const [audience, setAudience] = useState<AudienceType>('general')
  const [preserveEmotion, setPreserveEmotion] = useState(true)
  const [importanceWeight, setImportanceWeight] = useState(50)
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | null>(null)
  const [summaries, setSummaries] = useState<PlatformSummary[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const togglePlatform = (id: PlatformId) => {
    setPlatforms((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const options: SummarizationOptions = {
    platforms,
    style,
    audience,
    preserveEmotion,
    importanceWeight,
  }

  const handleSummarize = async () => {
    if (platforms.length === 0) {
      setError('Select at least one platform.')
      return
    }
    if (inputMode === 'text' && !content.trim()) {
      setError('Please enter some content to summarize.')
      return
    }
    if (inputMode === 'video' && !videoFile) {
      setError('Please upload a video to summarize.')
      return
    }
    if (inputMode === 'video' && videoFile && videoFile.size > 20 * 1024 * 1024) {
      setError('Video is too large. Upload a file up to 20MB.')
      return
    }

    setError(null)
    setLoading(true)
    setSummaries(null)

    try {
      const res =
        inputMode === 'text'
          ? await fetch('/api/summarize', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content: content.trim(), options }),
            })
          : await (async () => {
              const form = new FormData()
              form.append('video', videoFile as Blob)
              form.append('options', JSON.stringify(options))
              form.append('context', videoContext.trim())
              return fetch('/api/summarize-video', {
                method: 'POST',
                body: form,
              })
            })()
      const data = (await res.json()) as SummarizationResult & { error?: string }
      if (!res.ok) {
        setError(data.error || 'Summarization failed.')
        return
      }
      setSummaries(data.summaries ?? [])
      if (data.summaries?.length) setSelectedPlatform(data.summaries[0].platformId)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleReset = () => {
    setSummaries(null)
    setSelectedPlatform(null)
    setVideoFile(null)
    setVideoContext('')
    setError(null)
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Summarization</h1>
        <p className="text-muted-foreground mt-1">
          Condense content while preserving core message and emotion. Platform-specific,
          audience-aware summaries with bullet, paragraph, or caption styles.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Dynamic Summarization Requirements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-border p-3 bg-secondary/40">
            What it does: condenses content while preserving core message and emotion.
          </div>
          <div className="rounded-lg border border-border p-3 bg-secondary/40">
            Senses and analyzes sentence importance plus emotional weight.
          </div>
          <div className="rounded-lg border border-border p-3 bg-secondary/40">
            Applies platform constraints for length and tone automatically.
          </div>
          <div className="rounded-lg border border-border p-3 bg-secondary/40">
            Supports bullet, paragraph, and caption output styles.
          </div>
          <div className="rounded-lg border border-border p-3 bg-secondary/40">
            Includes an importance weightage booster.
          </div>
          <div className="rounded-lg border border-border p-3 bg-secondary/40">
            Generates audience-specific summaries: student, professional, and general.
          </div>
          <div className="rounded-lg border border-border p-3 bg-secondary/40">
            Supports text input and video input with optional context notes.
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Input Source</h2>
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              variant={inputMode === 'text' ? 'default' : 'outline'}
              onClick={() => setInputMode('text')}
            >
              Text
            </Button>
            <Button
              type="button"
              variant={inputMode === 'video' ? 'default' : 'outline'}
              onClick={() => setInputMode('video')}
            >
              Video
            </Button>
          </div>

          {inputMode === 'text' ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your original content here..."
              className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-4"
              rows={8}
            />
          ) : (
            <div className="space-y-3 mb-4">
              <div>
                <Label className="text-sm font-medium text-foreground">Upload video (max 20MB)</Label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                  className="mt-1 block w-full text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-primary-foreground"
                />
                {videoFile && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Selected: {videoFile.name} ({Math.round(videoFile.size / 1024 / 1024)}MB)
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground">
                  Optional context (what is happening in the video)
                </Label>
                <textarea
                  value={videoContext}
                  onChange={(e) => setVideoContext(e.target.value)}
                  placeholder="Example: product demo, tutorial, interview, highlights..."
                  className="mt-1 w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}

          <div className="space-y-4 mb-4">
            <div>
              <Label className="text-sm font-medium text-foreground">Summary style</Label>
              <Select value={style} onValueChange={(v) => setStyle(v as SummaryStyle)}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUMMARY_STYLES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Audience</Label>
              <Select value={audience} onValueChange={(v) => setAudience(v as AudienceType)}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">Preserve emotion</Label>
              <Switch checked={preserveEmotion} onCheckedChange={setPreserveEmotion} />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">
                Importance weightage booster ({importanceWeight}) - prioritize key sentences
              </Label>
              <Slider
                value={[importanceWeight]}
                onValueChange={([v]) => setImportanceWeight(v ?? 50)}
                min={0}
                max={100}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground mb-2 block">Platforms</Label>
              <div className="flex flex-wrap gap-4">
                {PLATFORMS.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={platforms.includes(p.id as PlatformId)}
                      onCheckedChange={() => togglePlatform(p.id as PlatformId)}
                    />
                    <span className="text-sm text-foreground">{p.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-destructive mb-4">{error}</p>}

          <div className="flex gap-2">
            <Button
              onClick={handleSummarize}
              className="flex-1"
              size="lg"
              disabled={loading || platforms.length === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Generating {inputMode === 'video' ? 'video' : 'text'} summaries...
                </>
              ) : (
                <>
                  <Sparkles size={18} className="mr-2" />
                  Generate {inputMode === 'video' ? 'Video' : 'Text'} Summaries
                </>
              )}
            </Button>
            {summaries && (
              <Button onClick={handleReset} variant="outline" size="lg">
                <RefreshCw size={18} className="mr-2" />
                Reset
              </Button>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-accent/5 border-accent/20">
          <h3 className="font-semibold text-foreground mb-4">Platform Guide</h3>
          <div className="space-y-3">
            {PLATFORMS.map((p) => {
              const platformId = p.id as PlatformId
              const rule = PLATFORM_RULES[platformId]
              return (
                <div key={p.id} className="p-3 rounded-lg bg-card border border-border">
                  <p className="text-xs font-medium text-foreground mb-1">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {rule.tone} ({rule.maxChars} chars max)
                  </p>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {summaries && summaries.length > 0 && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold text-foreground">Platform-Specific Summaries</h2>
          {summaries.map((s) => (
            <Card
              key={s.platformId}
              className="p-6 cursor-pointer transition-all hover:border-primary/50"
              onClick={() => setSelectedPlatform(s.platformId)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground">{s.platformName}</h3>
                {selectedPlatform === s.platformId && <Badge className="bg-primary">Selected</Badge>}
              </div>
              <div className="p-4 rounded-lg bg-secondary border border-border mb-4">
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">{s.text || '-'}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{s.charCount} characters</span>
                  <span>{s.wordCount} words</span>
                  {s.tone && <span>{s.tone}</span>}
                </div>
                {selectedPlatform === s.platformId && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopy(s.text)
                    }}
                    className="gap-2"
                  >
                    <Copy size={14} />
                    Copy
                  </Button>
                )}
              </div>
            </Card>
          ))}

          <Card className="p-6 bg-accent/5 border-accent/20">
            <h3 className="text-lg font-semibold text-foreground mb-4">Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-muted-foreground font-medium">
                      Platform
                    </th>
                    <th className="text-center py-2 px-2 text-muted-foreground font-medium">
                      Length
                    </th>
                    <th className="text-center py-2 px-2 text-muted-foreground font-medium">Tone</th>
                  </tr>
                </thead>
                <tbody>
                  {summaries.map((s) => (
                    <tr key={s.platformId} className="border-b border-border/50 last:border-0">
                      <td className="py-3 px-2 text-foreground">{s.platformName}</td>
                      <td className="py-3 px-2 text-center text-muted-foreground">
                        {s.charCount <= 150
                          ? 'Very Short'
                          : s.charCount <= 500
                            ? 'Short'
                            : s.charCount <= 1500
                              ? 'Medium'
                              : 'Long'}
                      </td>
                      <td className="py-3 px-2 text-center text-muted-foreground">
                        {s.tone ?? '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
