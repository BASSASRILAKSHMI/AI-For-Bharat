export function analyzeContentSafety(text: string) {

  const t = text.toLowerCase().trim()

  // ----------------------------
  // 1. Protected groups
  // ----------------------------
  const protectedGroups = [
    "women","men","girls","boys","religion","muslim","hindu","christian",
    "black","white","asian","immigrant","disabled","poor","rich","gay","lesbian"
  ]

  const hateWords = ["weak","inferior","dirty","useless","should not exist"]

  if (protectedGroups.some(g => t.includes(g)) &&
      hateWords.some(w => t.includes(w))) {
    return {
      risk: "high",
      type: "hate speech",
      detectedEmotion: "hostile",
      reason: "Targets a protected group with harmful statement",
      suggestion: "Avoid targeting groups of people. Focus criticism on behavior instead."
    }
  }

  // ----------------------------
  // 2. Violence detection
  // ----------------------------
  const violentWords = ["kill","attack","beat","hurt","destroy","eliminate"]

  if (violentWords.some(v => t.includes(v))) {
    return {
      risk: "high",
      type: "violent intent",
      detectedEmotion: "anger",
      reason: "Encourages harm or violence",
      suggestion: "Remove violent phrasing and express disagreement constructively."
    }
  }

  // ----------------------------
  // 3. Positive / anti-hate detection
  // ----------------------------
  const positivePatterns = [
    "should not hate",
    "do not hate",
    "don't hate",
    "respect everyone",
    "treat equally",
    "no discrimination",
    "spread love",
    "be kind"
  ]

  if (positivePatterns.some(p => t.includes(p))) {
    return {
      risk: "low",
      type: "safe",
      detectedEmotion: "positive",
      reason: "Promotes respectful behavior",
      suggestion: ""
    }
  }

  // ----------------------------
  // 4. General hostility (important fix)
  // ----------------------------
  const aggressiveWords = ["hate","stupid","idiot","annoying","trash","nonsense"]

  if (aggressiveWords.some(w => t.includes(w))) {
    return {
      risk: "medium",
      type: "toxic language",
      detectedEmotion: "negative",
      reason: "Aggressive wording but not targeting identity",
      suggestion: "Use neutral wording to express disagreement."
    }
  }

  // ----------------------------
  // 5. Safe content
  // ----------------------------
  return {
    risk: "low",
    type: "safe",
    detectedEmotion: "neutral",
    reason: "No harmful patterns detected",
    suggestion: ""
  }
}