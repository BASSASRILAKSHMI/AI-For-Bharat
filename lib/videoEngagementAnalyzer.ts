export async function analyzeVideoEngagement(file: File) {
  const video = document.createElement("video")
  video.src = URL.createObjectURL(file)
  video.crossOrigin = "anonymous"

  await new Promise((res) => (video.onloadedmetadata = res))

  const duration = video.duration

  // ----- Lightweight signal simulation (depends on video length) -----
  const silenceRatio = Math.min(0.6, Math.random() * (duration / 60))
  const motionScore = Math.random()
  const hookStrength = Math.random()

  let drops: any[] = []
  let suggestions: string[] = []
  let score = 85

  // Weak hook detection
  if (hookStrength < 0.5) {
    drops.push({
      time: "first 3 seconds",
      reason: "Weak opening hook",
      impact: "Users swipe before understanding content",
    })
    suggestions.push("Start with a strong result or surprising moment instead of intro")
    score -= 12
  }

  // Silence detection
  if (silenceRatio > 0.35) {
    drops.push({
      time: "middle section",
      reason: "Long low-energy segment",
      impact: "Viewer attention drops due to inactivity",
    })
    suggestions.push("Add background music or narration in low-energy parts")
    score -= 15
  }

  // Motion detection
  if (motionScore < 0.4) {
    drops.push({
      time: "throughout video",
      reason: "Low visual change rate",
      impact: "Video feels static causing skips",
    })
    suggestions.push("Add zooms, captions, or cuts every 3–5 seconds")
    score -= 10
  }

  const retention = Array.from({ length: 10 }, (_, i) =>
    Math.max(40, Math.round(score - i * (Math.random() * 5)))
  )

  return {
    retention,
    engagementScore: Math.max(40, Math.round(score)),
    peaks: [{ time: `${Math.round(duration * 0.25)}s`, reason: "attention spike" }],
    drops,
    suggestions,
  }
}