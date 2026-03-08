'use client'
import { useState } from "react"
import { analyzeContentSafety } from "@/lib/safetyEngine"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ContentSafetyPage() {

  const [text, setText] = useState("")
  const [result, setResult] = useState<any>(null)

  function runSafetyCheck() {
    const analysis = analyzeContentSafety(text)
    setResult(analysis)
  }

  return (
    <div className="space-y-6 pb-12">

      <div>
        <h1 className="text-3xl font-bold">Content Safety</h1>
        <p className="text-muted-foreground">AI moderation & compliance analysis</p>
      </div>

      <Card className="p-6 space-y-4">
        <textarea
          className="w-full border rounded-lg p-3 h-40"
          placeholder="Paste caption, script, or post content..."
          value={text}
          onChange={(e)=>setText(e.target.value)}
        />

        <Button className="w-full" onClick={runSafetyCheck}>
          Analyze Safety
        </Button>
      </Card>

      {result && (
        <Card className="p-6 space-y-3">

          <div><b>Risk Level:</b> {result.risk}</div>
          <div><b>Detected Emotion:</b> {result.detectedEmotion}</div>
          <div><b>Reason:</b> {result.reason}</div>
          <div><b>Confidence:</b> {result.confidence}%</div>

          {result.suggestion && (
            <div className="p-3 rounded-lg border bg-muted">
              <b>Suggested Rewrite:</b> {result.suggestion}
            </div>
          )}

        </Card>
      )}

    </div>
  )
}