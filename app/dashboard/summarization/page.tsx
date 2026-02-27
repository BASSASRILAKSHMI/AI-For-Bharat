'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, RefreshCw, Sparkles } from 'lucide-react'
import { PLATFORMS, SUMMARIZATION_SAMPLES } from '@/lib/mock-data'

export default function SummarizationPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram')
  const [content, setContent] = useState(
    'Just launched our revolutionary AI platform that helps creators and brands manage their content across all social media channels. With advanced analytics, AI-powered suggestions, and safety compliance checks, ContentIQ is the complete solution for content creators. We are excited to bring this to market and help thousands of creators succeed.'
  )
  const [summarized, setSummarized] = useState(false)

  const summaries = {
    instagram: '🚀 Say hello to ContentIQ! The all-in-one platform for creators. 📊 AI analytics + safety checks + creative suggestions. Manage all your socials in one place. Learn more in bio! #ContentCreator #AI #SocialMedia',
    tiktok: 'ContentIQ is here! 🎬✨ One app. All your platforms. AI-powered success. Let\'s goooo 🚀 #CreatorEconomy #ContentCreator #FYP',
    linkedin: 'Excited to introduce ContentIQ - the comprehensive platform transforming content management for creators and brands. Leveraging advanced AI analytics, real-time insights, and integrated safety compliance, ContentIQ empowers content creators to maximize their impact across social platforms. #Innovation #CreatorEconomy #Technology',
    twitter: 'Introducing ContentIQ - your all-in-one content management platform. AI analytics • Creative suggestions • Safety compliance • Multi-platform support. Built for creators, by creators.',
    youtube: "We're thrilled to announce ContentIQ, the game-changing platform for content creators. Whether you're managing multiple social channels, optimizing content performance, or ensuring brand safety, ContentIQ provides comprehensive analytics, AI-powered recommendations, and compliance tools all in one intuitive interface. Join the creator revolution today.",
  }

  const handleSummarize = () => {
    setSummarized(true)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(summaries[selectedPlatform as keyof typeof summaries])
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Summarization</h1>
        <p className="text-muted-foreground mt-1">Adapt your content for different platforms with AI-optimized summaries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Original Content</h2>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your original content here..."
            className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-4"
            rows={8}
          />

          <Button onClick={handleSummarize} className="w-full" size="lg">
            <Sparkles size={18} className="mr-2" />
            Generate Summaries
          </Button>
        </Card>

        {/* Platform Guide */}
        <Card className="p-6 bg-accent/5 border-accent/20">
          <h3 className="font-semibold text-foreground mb-4">Platform Guide</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-card border border-border">
              <p className="text-xs font-medium text-foreground mb-1">Instagram</p>
              <p className="text-xs text-muted-foreground">Emoji-rich, visual-focused</p>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <p className="text-xs font-medium text-foreground mb-1">TikTok</p>
              <p className="text-xs text-muted-foreground">Catchy, trendy hooks</p>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <p className="text-xs font-medium text-foreground mb-1">LinkedIn</p>
              <p className="text-xs text-muted-foreground">Professional insights</p>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <p className="text-xs font-medium text-foreground mb-1">X (Twitter)</p>
              <p className="text-xs text-muted-foreground">Concise, impactful</p>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <p className="text-xs font-medium text-foreground mb-1">YouTube</p>
              <p className="text-xs text-muted-foreground">Detailed descriptions</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Summaries */}
      {summarized && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold text-foreground">Platform-Specific Summaries</h2>

          {PLATFORMS.map((platform) => (
            <Card
              key={platform.id}
              className="p-6 cursor-pointer transition-all hover:border-primary/50"
              onClick={() => setSelectedPlatform(platform.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground">{platform.name}</h3>
                {selectedPlatform === platform.id && <Badge className="bg-primary">Selected</Badge>}
              </div>

              <div className="p-4 rounded-lg bg-secondary border border-border mb-4">
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {summaries[platform.id as keyof typeof summaries]}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{summaries[platform.id as keyof typeof summaries].length} characters</span>
                  <span>{summaries[platform.id as keyof typeof summaries].split(/\s+/).length} words</span>
                </div>
                {selectedPlatform === platform.id && (
                  <Button size="sm" variant="outline" onClick={handleCopy} className="gap-2">
                    <Copy size={14} />
                    Copy
                  </Button>
                )}
              </div>
            </Card>
          ))}

          {/* Comparison */}
          <Card className="p-6 bg-accent/5 border-accent/20">
            <h3 className="text-lg font-semibold text-foreground mb-4">Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-muted-foreground font-medium">Platform</th>
                    <th className="text-center py-2 px-2 text-muted-foreground font-medium">Length</th>
                    <th className="text-center py-2 px-2 text-muted-foreground font-medium">Tone</th>
                    <th className="text-center py-2 px-2 text-muted-foreground font-medium">Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-2 text-foreground">Instagram</td>
                    <td className="py-3 px-2 text-center text-muted-foreground">Short</td>
                    <td className="py-3 px-2 text-center text-muted-foreground">Visual</td>
                    <td className="py-3 px-2 text-center">
                      <Badge className="bg-green-500/20 text-green-700 border-green-500/30">High</Badge>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-2 text-foreground">TikTok</td>
                    <td className="py-3 px-2 text-center text-muted-foreground">Very Short</td>
                    <td className="py-3 px-2 text-center text-muted-foreground">Trendy</td>
                    <td className="py-3 px-2 text-center">
                      <Badge className="bg-green-500/20 text-green-700 border-green-500/30">Very High</Badge>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-2 text-foreground">LinkedIn</td>
                    <td className="py-3 px-2 text-center text-muted-foreground">Medium</td>
                    <td className="py-3 px-2 text-center text-muted-foreground">Professional</td>
                    <td className="py-3 px-2 text-center">
                      <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30">Medium</Badge>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-2 text-foreground">Twitter</td>
                    <td className="py-3 px-2 text-center text-muted-foreground">Very Short</td>
                    <td className="py-3 px-2 text-center text-muted-foreground">Direct</td>
                    <td className="py-3 px-2 text-center">
                      <Badge className="bg-green-500/20 text-green-700 border-green-500/30">High</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2 text-foreground">YouTube</td>
                    <td className="py-3 px-2 text-center text-muted-foreground">Long</td>
                    <td className="py-3 px-2 text-center text-muted-foreground">Detailed</td>
                    <td className="py-3 px-2 text-center">
                      <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30">Medium</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
