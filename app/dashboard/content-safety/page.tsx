'use client'

import { useState } from 'react'
import { analyzeContentSafety } from '@/lib/safetyEngine'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react'

export default function ContentSafetyPage() {

  const [text, setText] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  function handleAnalyze() {
    if (!text.trim()) return alert("Enter some content")

    setLoading(true)

    // local AI safety engine
    const safety = analyzeContentSafety(text)

    setResult(safety)
    setLoading(false)
  }

  const riskColor =
    result?.risk === "high" ? "bg-red-500/10 border-red-500/30" :
    result?.risk === "medium" ? "bg-yellow-500/10 border-yellow-500/30" :
    "bg-green-500/10 border-green-500/30"

  const RiskIcon =
    result?.risk === "high" ? AlertTriangle :
    result?.risk === "medium" ? Shield :
    CheckCircle

  return (
    <div className="space-y-6 pb-12">

      <div>
        <h1 className="text-3xl font-bold">Content Safety</h1>
        <p className="text-muted-foreground">
          AI moderation & compliance analysis
        </p>
      </div>

      {/* INPUT */}
      <Card className="p-6 space-y-4">
        <textarea
          value={text}
          onChange={(e)=>setText(e.target.value)}
          placeholder="Paste caption, script, or post content..."
          className="w-full h-40 rounded-lg border bg-background p-4 text-sm"
        />

        <Button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Safety"}
        </Button>
      </Card>

      {/* RESULT */}
      {result && (
        <Card className={`p-6 border ${riskColor}`}>

          <div className="flex items-center gap-3 mb-4">
            <RiskIcon className="text-xl"/>
            <h2 className="text-lg font-semibold capitalize">
              {result.risk} Risk Content
            </h2>
          </div>

          <div className="space-y-3 text-sm">

            <div>
              <span className="font-medium">Detected Emotion: </span>
              <Badge variant="secondary">{result.detectedEmotion}</Badge>
            </div>

            <div>
              <span className="font-medium">Reason: </span>
              {result.reason}
            </div>

            {result.suggestion && (
              <div className="p-3 rounded-lg border bg-background mt-4">
                <span className="font-medium">Safer Rewrite:</span>
                <p className="mt-1">{result.suggestion}</p>
              </div>
            )}

          </div>

        </Card>
      )}

    </div>
  )
}