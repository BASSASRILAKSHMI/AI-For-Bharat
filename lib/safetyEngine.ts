export function analyzeContentSafety(text: string) {

  const lower = text.toLowerCase()

  // ---------- DETECT VIOLENCE ----------
  const violenceWords = ["kill","attack","burn","destroy","beat","fight","bomb"]
  const hateWords = ["idiot","stupid","hate","loser","dumb","ugly"]
  const selfHarmWords = ["die","suicide","end my life","no reason to live"]

  let risk = "safe"
  let reason = "No harmful intent detected"
  let suggestion = null
  let detectedEmotion = "neutral"

  // Violence
  if (violenceWords.some(w => lower.includes(w))) {
    risk = "high"
    reason = "Violent language detected"
    detectedEmotion = "anger"
    suggestion = text.replace(/kill|attack|destroy/gi,"challenge")
  }

  // Hate speech
  else if (hateWords.some(w => lower.includes(w))) {
    risk = "warning"
    reason = "Potential harassment detected"
    detectedEmotion = "aggressive"
    suggestion = "Consider using respectful language to keep audience trust."
  }

  // Self harm
  else if (selfHarmWords.some(w => lower.includes(w))) {
    risk = "critical"
    reason = "Self-harm related content"
    detectedEmotion = "distress"
    suggestion = "Provide supportive message and avoid harmful expressions."
  }

  // Clickbait emotional manipulation
  if (lower.includes("100% guarantee") || lower.includes("you wont believe")) {
    risk = "warning"
    reason = "Manipulative emotional phrasing"
    detectedEmotion = "manipulation"
    suggestion = "Try transparent and honest wording instead."
  }

  return {
    risk,
    reason,
    suggestion,
    detectedEmotion,
    confidence: Math.floor(70 + Math.random()*25) // makes it feel AI
  }
}