export function generateVerdict(
  analysis: any,
  trends: string[],   // <-- change from string → string[]
  niche: string
) {

  const score = analysis.engagementScore

  let performance =
    score > 80 ? "high performing" :
    score > 60 ? "average performing" :
    "low performing"

  const dropReasons = analysis.drops?.map((d:any)=>d.reason).join(", ") || "no major drops detected"

  const trendMatch =
    trends.length > 0
      ? `Currently trending in ${niche}: ${trends.slice(0,2).join(", ")}`
      : `No live trends detected for ${niche}`

  return `
Your video is ${performance} with an engagement score of ${score}%.

Viewer behavior indicates ${dropReasons}.

${trendMatch}.

Improvement Tip:
${
  score < 60
    ? "Start with a stronger hook within first 2 seconds."
    : score < 80
    ? "Increase pacing and pattern interruptions."
    : "Optimize caption storytelling for retention."
}
`.trim()
}