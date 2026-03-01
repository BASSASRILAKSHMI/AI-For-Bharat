export function compareWithTrends(video:any, trends:string[]) {

  const text = trends.join(" ").toLowerCase()
  const suggestions:string[] = []

  if(text.includes("hook") && video.first3secWeak)
    suggestions.push("Add a strong hook in the first 3 seconds")

  if(text.includes("fast") && video.longScenes)
    suggestions.push("Use faster cuts — current reels are high pacing")

  if(text.includes("caption") && !video.hasCaptions)
    suggestions.push("Add on-screen captions — trending reels use subtitles")

  if(text.includes("story") && !video.hasStory)
    suggestions.push("Convert video into storytelling format")

  if(text.includes("music") && video.noBeatSync)
    suggestions.push("Sync cuts with music beats")

  return suggestions
}