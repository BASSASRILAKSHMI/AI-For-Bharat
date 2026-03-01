'use client'

import { analyzeVideoEngagement } from '@/lib/videoEngagementAnalyzer'
import { generateAIRecommendations } from '@/lib/aiDecisionEngine'
import { analyzeContentSafety } from "@/lib/safetyEngine"
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, BarChart3, Smile, Zap } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function VideoIntelligencePage() {

  const [analyzed, setAnalyzed] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [trends, setTrends] = useState<string[]>([])
  const [loadingTrends, setLoadingTrends] = useState(false)

  async function handleAnalyze() {

    setAnalyzed(true)

    // ---------- LOCAL AI ANALYSIS ----------
    const result = analyzeVideoEngagement()

    // ---------- REAL WORLD TREND DATA ----------
    let trendTitles:string[] = []

    try {
      setLoadingTrends(true)

      const res = await fetch('/api/trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'instagram viral reels today' })
      })

      const trendData = await res.json()

      if (trendData?.organic) {
        trendTitles = trendData.organic.slice(0,5).map((t:any)=>t.title)
        setTrends(trendTitles)
      }

    } catch (err) {
      console.log("Trend fetch failed", err)
    } finally {
      setLoadingTrends(false)
    }

    // ---------- SAFETY ENGINE ----------
    

    // ---------- AI DECISION ENGINE ----------
    const aiAdvice = generateAIRecommendations({
      sentiment: "neutral",
      engagementScore: result.engagementScore,
      drops: result.drops,
      peaks: result.peaks,
      audience: { genZ: 52 },
      trends: trendTitles
    })

    // ---------- FINAL COMBINED ANALYSIS ----------
    setAnalysis({
      ...result,
      aiAdvice,
    })
  }

  return (
    <div className="space-y-6 pb-12">

      <div>
        <h1 className="text-3xl font-bold text-foreground">Video Intelligence</h1>
        <p className="text-muted-foreground mt-1">
          Analyze viewer emotions and engagement throughout your video
        </p>
      </div>

      {!analyzed ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <Card className="lg:col-span-2 p-8">
            <h2 className="text-lg font-semibold mb-6">Upload Video</h2>

            <div className="border-2 border-dashed rounded-lg p-12 text-center mb-6">
              <Play size={48} className="mx-auto text-muted-foreground mb-3" />
              <p className="font-semibold">Drop your video here or click to upload</p>
              <p className="text-sm text-muted-foreground">Supports MP4, WebM up to 1GB</p>
            </div>

            <Button className="w-full" size="lg" onClick={handleAnalyze}>
              Analyze Video
            </Button>
          </Card>

          <Card className="p-6 bg-accent/5 border-accent/20">
            <h3 className="font-semibold mb-4">What We Analyze</h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2"><Smile size={16}/> Emotional reactions</div>
              <div className="flex gap-2"><BarChart3 size={16}/> Engagement timeline</div>
              <div className="flex gap-2"><Zap size={16}/> Peak moments</div>
            </div>
          </Card>

        </div>
      ) : (

        <div className="space-y-6 animate-in fade-in duration-500">

          {/* VIDEO */}
          <Card className="p-6">
            <div className="bg-secondary rounded-lg h-80 flex items-center justify-center">
              <Play size={64} className="text-muted-foreground/30" />
            </div>
          </Card>

          {/* GRAPH */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Engagement Timeline</h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={analysis?.retention?.map((v:number,i:number)=>({
                  time:`${i*10}s`,
                  engagement:v
                })) || []}
              >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="time"/>
                <YAxis/>
                <Tooltip/>
                <Line type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={3} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* SCORE */}
          <Card className="p-6 text-center">
            <Zap className="mx-auto text-yellow-500 mb-2"/>
            <p className="text-sm text-muted-foreground">Engagement Score</p>
            <p className="text-2xl font-bold">{analysis?.engagementScore ?? 0}%</p>
          </Card>

          

          {/* KEY MOMENTS */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Key Moments</h2>

            <div className="space-y-3">
              {analysis?.peaks?.map((p:any,i:number)=>(
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-green-500/30 bg-green-500/5">
                  <div className="text-2xl">🔥</div>
                  <div className="flex-1">
                    <p className="font-medium">Peak engagement detected</p>
                    <p className="text-sm text-muted-foreground">{p.time}</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-700">Peak</Badge>
                </div>
              ))}

              {analysis?.drops?.map((d:any,i:number)=>(
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5">
                  <div className="text-2xl">⚠️</div>
                  <div className="flex-1">
                    <p className="font-medium">Viewer drop detected</p>
                    <p className="text-sm text-muted-foreground">{d.time}</p>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-700">Drop</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* TRENDS */}
          <Card className="p-6 border-blue-500/30 bg-blue-500/5">
            <h2 className="text-lg font-semibold mb-4">🔥 Trending Reel Ideas</h2>

            {loadingTrends && <p className="text-sm text-muted-foreground">Fetching trends...</p>}

            <div className="space-y-3">
              {trends.map((t,i)=>(
                <div key={i} className="p-3 rounded-lg border hover:border-primary/40">
                  {t}
                </div>
              ))}
            </div>
          </Card>

          {/* AI RECOMMENDATIONS */}
          {analysis?.aiAdvice && (
            <Card className="p-6 bg-blue-500/5 border-blue-500/20">
              <h2 className="text-lg font-semibold mb-4">AI Strategic Suggestions</h2>

              <div className="space-y-3">
                {analysis.aiAdvice.map((tip:string,i:number)=>(
                  <div key={i} className="p-3 rounded-lg bg-background border">
                    {tip}
                  </div>
                ))}
              </div>
            </Card>
          )}

        </div>
      )}
    </div>
  )
}