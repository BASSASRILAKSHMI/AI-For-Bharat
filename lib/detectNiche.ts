export function detectNiche(text: string) {
  const t = text.toLowerCase()

  if (t.includes("food") || t.includes("recipe")) return "food reels"
  if (t.includes("gym") || t.includes("fitness") || t.includes("workout")) return "fitness reels"
  if (t.includes("code") || t.includes("programming") || t.includes("ai")) return "tech reels"
  if (t.includes("travel") || t.includes("trip")) return "travel reels"
  if (t.includes("motivation") || t.includes("study")) return "education reels"

  return "instagram reels viral"
}