export function analyzeVideoEngagement() {

  // fake engagement curve (simulated retention graph)
  const retention = [82, 78, 75, 72, 68, 60, 52, 49, 65, 72, 80, 74, 69]

  let peaks: any[] = []
  let drops: any[] = []

  for (let i = 1; i < retention.length - 1; i++) {

    // peak detection
    if (retention[i] > retention[i-1] && retention[i] > retention[i+1]) {
      peaks.push({
        time: `${i * 10}s`,
        type: "peak",
        score: retention[i]
      })
    }

    // drop detection
    if (retention[i] < retention[i-1] - 10) {
      drops.push({
        time: `${i * 10}s`,
        type: "drop",
        score: retention[i]
      })
    }
  }

  return {
    retention,
    peaks,
    drops,
    engagementScore: Math.round(retention.reduce((a,b)=>a+b,0)/retention.length)
  }
}