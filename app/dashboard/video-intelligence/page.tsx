'use client'

import { analyzeVideoEngagement } from '@/lib/videoEngagementAnalyzer'
import { generateVerdict } from '@/lib/generateVerdict'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Upload, Zap } from 'lucide-react'
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

const [file, setFile] = useState<File | null>(null)
const [videoURL, setVideoURL] = useState<string>("")
const [analysis, setAnalysis] = useState<any>(null)
const [loading, setLoading] = useState(false)
const [trends, setTrends] = useState<string[]>([])
const [verdict, setVerdict] = useState("")
const [niche, setNiche] = useState("general")

async function handleAnalyze() {
if (!file) return alert("Upload a video first")

setLoading(true)

try {

// ---------- AI ANALYSIS ----------
const result = await analyzeVideoEngagement(file)

// prevent crash if lib returns partial data
const safeResult = {
engagementScore: result?.engagementScore ?? 0,
retention: result?.retention ?? [],
drops: result?.drops ?? [],
suggestions: result?.suggestions ?? []
}

setAnalysis(safeResult)
setVideoURL(URL.createObjectURL(file))

// ---------- NICHE DETECTION ----------
const name = file.name.toLowerCase()
const detectedNiche =
name.includes("food") ? "food" :
name.includes("travel") ? "travel" :
name.includes("gym") ? "fitness" :
"content creation"

setNiche(detectedNiche)

// ---------- FETCH TRENDS ----------
let trendTexts: string[] = []

try {
const res = await fetch('/api/trends', {
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
query:`latest ${detectedNiche} instagram reels trends hooks editing style`
})
})


const data = await res.json()
trendTexts = data?.organic?.slice(0,5).map((r:any)=>r.snippet) || []
setTrends(trendTexts)


} catch {
trendTexts = ["Trending hook based openings", "Fast paced cuts", "Subtitle storytelling"]
setTrends(trendTexts)
}

// ---------- FINAL VERDICT ----------
const verdictText = generateVerdict(safeResult, trendTexts, detectedNiche)
setVerdict(verdictText)

} catch (err) {
alert("AI failed to analyze video")
console.log(err)
}

setLoading(false)
}

return (

<div className="space-y-6 pb-12">

  <div>
    <h1 className="text-3xl font-bold">Video Intelligence</h1>
    <p className="text-muted-foreground">
      AI explains WHY your reel performs well or poorly
    </p>
  </div>

{!analysis ? ( <Card className="p-8 text-center space-y-6">


  <label className="border-2 border-dashed rounded-lg p-12 block cursor-pointer">
    <Upload className="mx-auto mb-3 text-muted-foreground"/>
    <p className="font-semibold">Click to upload video</p>
    <input
      type="file"
      accept="video/*"
      className="hidden"
      onChange={(e)=>setFile(e.target.files?.[0] || null)}
    />
  </label>

  <Button onClick={handleAnalyze} disabled={!file || loading}>
    {loading ? "Analyzing..." : "Analyze Video"}
  </Button>

</Card>


) : (

<div className="space-y-6">

  {videoURL && (
  <Card className="p-6">
    <video src={videoURL} controls className="rounded-lg w-full max-h-[400px]" />
  </Card>
  )}

  <Card className="p-6 text-center">
    <Zap className="mx-auto text-yellow-500 mb-2"/>
    <p className="text-sm text-muted-foreground">Engagement Score</p>
    <p className="text-3xl font-bold">{analysis.engagementScore}%</p>
  </Card>

  <Card className="p-6">
    <h2 className="font-semibold mb-4">Viewer Retention</h2>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={(analysis.retention || []).map((v:number,i:number)=>({t:i*5,v}))}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="t"/>
        <YAxis/>
        <Tooltip/>
        <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={3} dot={false}/>
      </LineChart>
    </ResponsiveContainer>
  </Card>

  <Card className="p-6">
    <h2 className="font-semibold mb-4">Detected Issues</h2>
    <div className="space-y-3">
      {(analysis.drops || []).map((d:any,i:number)=>(
        <div key={i} className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5">
          <p className="font-medium">{d.reason}</p>
          <p className="text-sm text-muted-foreground">{d.impact}</p>
          <Badge className="mt-2">at {d.time}</Badge>
        </div>
      ))}
    </div>
  </Card>

  <Card className="p-6">
    <h2 className="font-semibold mb-4">AI Fix Suggestions</h2>
    <div className="space-y-3">
      {(analysis.suggestions || []).map((s:string,i:number)=>(
        <div key={i} className="p-3 rounded-lg border bg-background">
          {s}
        </div>
      ))}
    </div>
  </Card>

  <Card className="p-6 border-blue-500/30 bg-blue-500/5">
    <h2 className="font-semibold mb-4">Current {niche} Trends</h2>
    <div className="space-y-3">
      {trends.map((t,i)=>(
        <div key={i} className="p-3 rounded-lg border">
          {t}
        </div>
      ))}
    </div>
  </Card>

  <Card className="p-6 border-green-500/30 bg-green-500/5">
    <h2 className="font-semibold mb-3">Final AI Verdict</h2>
    <p className="text-lg leading-relaxed font-medium">
      {verdict}
    </p>
  </Card>

</div>


)}

</div>
)
}
