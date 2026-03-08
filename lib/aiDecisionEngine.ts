// AI Decision Engine
// Combines emotion, engagement, audience & trends

type AnalysisInput = {
  sentiment?: string
  engagementScore?: number
  drops?: { time: string }[]
  peaks?: { time: string }[]
  audience?: {
    genZ?: number
    millennials?: number
  }
  trends?: string[]
}

export function generateAIRecommendations(data: AnalysisInput) {
  const recommendations: string[] = []

  // ---------- Emotion Drop Detection ----------
  if (data.drops && data.drops.length > 0) {
    recommendations.push(
      `Viewer interest drops around ${data.drops[0].time}. Add a curiosity hook, question, or fast transition at this point to retain attention.`
    )
  }

  // ---------- Weak Emotional Tone ----------
  if (data.sentiment === "neutral" || data.sentiment === "informative") {
    recommendations.push(
      "Content feels emotionally flat. Try adding excitement, surprise, or storytelling elements to increase engagement."
    )
  }

  // ---------- High Peak Moment ----------
  if (data.peaks && data.peaks.length > 0) {
    recommendations.push(
      `Strong engagement spike detected at ${data.peaks[0].time}. Convert this segment into a short-form reel or thumbnail highlight.`
    )
  }

  // ---------- Low Engagement ----------
  if ((data.engagementScore ?? 0) < 60) {
    recommendations.push(
      "Overall engagement is low. Reduce intro length and place the main message within the first 5 seconds."
    )
  }

  // ---------- Audience Reaction ----------
  if (data.audience?.genZ && data.audience.genZ < 60) {
    recommendations.push(
      "Predicted Gen-Z engagement is low. Use faster pacing, captions, and dynamic visuals."
    )
  }

  // ---------- Trend Alignment ----------
  if (data.trends && data.trends.length > 0) {
    recommendations.push(
      `Align content with trending topic: "${data.trends[0]}". This increases discoverability probability.`
    )
  }

  // ---------- Default fallback ----------
  if (recommendations.length === 0) {
    recommendations.push("Content structure looks strong. Only minor visual polish recommended.")
  }

  return recommendations
}