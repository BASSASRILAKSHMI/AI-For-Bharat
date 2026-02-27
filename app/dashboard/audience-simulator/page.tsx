'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { AUDIENCE_SEGMENTS } from '@/lib/mock-data'

export default function AudienceSimulatorPage() {
  const chartData = AUDIENCE_SEGMENTS.map((segment) => ({
    name: segment.name,
    positive: segment.reactions.positive,
    neutral: segment.reactions.neutral,
    negative: segment.reactions.negative,
  }))

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Audience Simulator</h1>
        <p className="text-muted-foreground mt-1">Predict how different audience segments will react to your content</p>
      </div>

      {/* Audience Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {AUDIENCE_SEGMENTS.map((segment) => (
          <Card key={segment.name} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{segment.emoji}</span>
              <p className="text-sm font-medium text-muted-foreground">{segment.percentage}%</p>
            </div>
            <h3 className="font-semibold text-foreground">{segment.name}</h3>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-green-600">Positive</span>
                <span className="text-foreground font-medium">{segment.reactions.positive}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Neutral</span>
                <span className="text-foreground font-medium">{segment.reactions.neutral}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">Negative</span>
                <span className="text-foreground font-medium">{segment.reactions.negative}%</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Reaction Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Predicted Reactions by Segment</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
            <Legend />
            <Bar dataKey="positive" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="neutral" fill="#6b7280" radius={[8, 8, 0, 0]} />
            <Bar dataKey="negative" fill="#ef4444" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Segment Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {AUDIENCE_SEGMENTS.map((segment) => (
          <Card key={segment.name} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{segment.emoji}</span>
              <h3 className="text-lg font-semibold text-foreground">{segment.name}</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-green-600">Positive Reaction</p>
                  <span className="text-sm font-bold text-green-600">{segment.reactions.positive}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${segment.reactions.positive}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-600">Neutral Reaction</p>
                  <span className="text-sm font-bold text-gray-600">{segment.reactions.neutral}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gray-500" style={{ width: `${segment.reactions.neutral}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-red-600">Negative Reaction</p>
                  <span className="text-sm font-bold text-red-600">{segment.reactions.negative}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: `${segment.reactions.negative}%` }} />
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-2">Key Insights</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {segment.name}s prefer {segment.name === 'Gen Z' ? 'authentic' : segment.name === 'Millennials' ? 'relatable' : 'informative'} content with
                clear value. {segment.reactions.positive > 75 ? '✓ Your content resonates' : '⚠ Consider adjusting tone'}.
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Content Recommendations */}
      <Card className="p-6 bg-accent/5 border-accent/20">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recommendations</h2>
        <div className="space-y-3">
          <div className="flex gap-3 p-3 rounded-lg bg-card border border-border">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-medium text-foreground">Optimize for Gen Z</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add more emojis and casual language to boost engagement with younger audiences
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 rounded-lg bg-card border border-border">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-medium text-foreground">Professional tone for Millennials</p>
              <p className="text-sm text-muted-foreground mt-1">
                Balance professional insights with personal experiences and relatable stories
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 rounded-lg bg-card border border-border">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-medium text-foreground">Educational value for Gen X & Boomers</p>
              <p className="text-sm text-muted-foreground mt-1">
                Focus on detailed explanations and practical applications of concepts
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Testing Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Test Different Versions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-border">
            <p className="text-sm font-medium text-foreground mb-2">Version A (Current)</p>
            <p className="text-xs text-muted-foreground">
              Predicted positive reactions: 72% across all segments
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border cursor-pointer hover:border-primary/50 transition-all">
            <p className="text-sm font-medium text-foreground mb-2">Version B (More casual)</p>
            <p className="text-xs text-muted-foreground">
              Predicted positive reactions: 78% across all segments
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
