export type HighlightClip = {
  start: string
  end: string
  label: string
  score: number
}

export const mockHighlights: HighlightClip[] = [
  { start: "00:12", end: "00:20", label: "Hook moment", score: 92 },
  { start: "00:47", end: "00:55", label: "Funny reaction", score: 88 },
  { start: "01:32", end: "01:45", label: "Important info", score: 85 },
  { start: "02:10", end: "02:22", label: "Shareable insight", score: 90 }
]