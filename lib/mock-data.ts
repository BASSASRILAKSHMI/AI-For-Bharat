export const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: 'instagram' },
  { id: 'tiktok', name: 'TikTok', icon: 'music' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'briefcase' },
  { id: 'twitter', name: 'X (Twitter)', icon: 'twitter' },
  { id: 'youtube', name: 'YouTube', icon: 'play-circle' },
]

export const DASHBOARD_STATS = [
  { label: 'Content Analyzed', value: '12,543', change: '+12.5%', icon: 'bar-chart-3' },
  { label: 'Content Generated', value: '3,847', change: '+8.2%', icon: 'sparkles' },
  { label: 'Avg. Engagement', value: '8.4%', change: '+2.1%', icon: 'trending-up' },
  { label: 'Safety Score', value: '94.2%', change: '+1.3%', icon: 'shield' },
]

export const RECENT_ACTIVITY = [
  {
    id: 1,
    type: 'analysis',
    title: 'Instagram post analyzed',
    description: 'Strong engagement potential detected',
    timestamp: '2 hours ago',
    platform: 'instagram',
  },
  {
    id: 2,
    type: 'generation',
    title: 'Content generated for TikTok',
    description: 'High-performing template applied',
    timestamp: '4 hours ago',
    platform: 'tiktok',
  },
  {
    id: 3,
    type: 'analysis',
    title: 'LinkedIn article analyzed',
    description: 'Professional tone detected',
    timestamp: '6 hours ago',
    platform: 'linkedin',
  },
]

export const TRENDING_TOPICS = [
  { rank: 1, topic: 'AI in Business', mentions: 24567, growth: '+23%', sentiment: 'positive' },
  { rank: 2, topic: 'Sustainable Tech', mentions: 18934, growth: '+18%', sentiment: 'positive' },
  { rank: 3, topic: 'Digital Marketing Trends', mentions: 15672, growth: '+12%', sentiment: 'neutral' },
  { rank: 4, topic: 'Creator Economy', mentions: 14289, growth: '+9%', sentiment: 'positive' },
  { rank: 5, topic: 'Web3 Development', mentions: 12456, growth: '-5%', sentiment: 'mixed' },
]

export const SAFETY_METRICS = [
  { label: 'Plagiarism', value: 8, max: 100, status: 'safe' },
  { label: 'AI-Overuse', value: 15, max: 100, status: 'safe' },
  { label: 'Toxicity', value: 2, max: 100, status: 'safe' },
  { label: 'Copyright', value: 5, max: 100, status: 'safe' },
]

export const AUDIENCE_SEGMENTS = [
  { name: 'Gen Z', percentage: 35, emoji: '🎮', reactions: { positive: 78, neutral: 15, negative: 7 } },
  { name: 'Millennials', percentage: 28, emoji: '💼', reactions: { positive: 72, neutral: 20, negative: 8 } },
  { name: 'Gen X', percentage: 22, emoji: '📚', reactions: { positive: 65, neutral: 25, negative: 10 } },
  { name: 'Boomers', percentage: 15, emoji: '🏡', reactions: { positive: 58, neutral: 30, negative: 12 } },
]

export const CHART_DATA = [
  { month: 'Jan', views: 4000, engagement: 2400, conversions: 240 },
  { month: 'Feb', views: 3000, engagement: 1398, conversions: 221 },
  { month: 'Mar', views: 2000, engagement: 9800, conversions: 229 },
  { month: 'Apr', views: 2780, engagement: 3908, conversions: 200 },
  { month: 'May', views: 1890, engagement: 4800, conversions: 221 },
  { month: 'Jun', views: 2390, engagement: 3800, conversions: 250 },
]

export const CREATIVE_SUGGESTIONS = [
  {
    id: 1,
    title: 'Use Storytelling Format',
    description: 'Narrative-driven content performs 45% better with your audience',
    impact: '+45%',
  },
  {
    id: 2,
    title: 'Add Call-to-Action',
    description: 'Content with clear CTAs sees 32% higher conversion rates',
    impact: '+32%',
  },
  {
    id: 3,
    title: 'Include Visual Elements',
    description: 'Posts with images get 3x more engagement',
    impact: '+3x',
  },
]

export const SUMMARIZATION_SAMPLES = {
  instagram: 'Concise, emoji-rich summaries optimized for visual platform engagement',
  tiktok: 'Catchy, trendy summaries with viral hooks and trending audio references',
  linkedin: 'Professional, industry-focused summaries emphasizing thought leadership',
  twitter: 'Tweet-optimized summaries perfect for thread format',
  youtube: 'Detailed summaries highlighting storytelling and hooks for video descriptions',
}
