'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Search } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { useState } from 'react'
import { TRENDING_TOPICS } from '@/lib/mock-data'

const trendData = [
  { week: 'Wk 1', value: 5000 },
  { week: 'Wk 2', value: 8500 },
  { week: 'Wk 3', value: 12000 },
  { week: 'Wk 4', value: 18500 },
  { week: 'Wk 5', value: 24500 },
  { week: 'Wk 6', value: 28000 },
]

export default function TrendInsightsPage() {
  const [selectedTopic, setSelectedTopic] = useState<number | null>(0)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Trend Insights</h1>
        <p className="text-muted-foreground mt-1">Discover trending topics and opportunities for your content</p>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search trends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend List */}
        <div className="lg:col-span-1 space-y-2">
          {TRENDING_TOPICS.map((topic, idx) => (
            <Card
              key={idx}
              onClick={() => setSelectedTopic(idx)}
              className={`p-4 cursor-pointer transition-all ${
                selectedTopic === idx
                  ? 'bg-primary/10 border-primary'
                  : 'hover:border-primary/50 hover:bg-secondary'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-primary">#{topic.rank}</span>
                    <p className="font-semibold text-foreground truncate">{topic.topic}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{topic.mentions.toLocaleString()} mentions</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {topic.growth.startsWith('+') ? (
                    <TrendingUp size={16} className="text-green-500" />
                  ) : (
                    <TrendingDown size={16} className="text-red-500" />
                  )}
                  <span
                    className={`text-xs font-bold ${
                      topic.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {topic.growth}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Detail View */}
        {selectedTopic !== null && (
          <div className="lg:col-span-2 space-y-6">
            {/* Topic Overview */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{TRENDING_TOPICS[selectedTopic].topic}</h2>
                  <p className="text-muted-foreground mt-1">Currently trending</p>
                </div>
                <Badge
                  className={`whitespace-nowrap ${
                    TRENDING_TOPICS[selectedTopic].sentiment === 'positive'
                      ? 'bg-green-500/20 text-green-700 border-green-500/30'
                      : TRENDING_TOPICS[selectedTopic].sentiment === 'neutral'
                        ? 'bg-blue-500/20 text-blue-700 border-blue-500/30'
                        : 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'
                  }`}
                >
                  {TRENDING_TOPICS[selectedTopic].sentiment}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mentions</p>
                  <p className="text-2xl font-bold text-foreground">
                    {TRENDING_TOPICS[selectedTopic].mentions.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Growth</p>
                  <p className="text-2xl font-bold text-foreground">
                    {TRENDING_TOPICS[selectedTopic].growth}
                  </p>
                </div>
              </div>
            </Card>

            {/* Trend Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">6-Week Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--primary)"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Related Topics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Related Topics</h3>
              <div className="space-y-2">
                {['Digital Transformation', 'Business Innovation', 'Tech Leadership'].map((related, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary transition-all cursor-pointer"
                  >
                    <p className="text-sm font-medium text-foreground">{related}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Content Opportunities */}
            <Card className="p-6 bg-accent/5 border-accent/20">
              <h3 className="text-lg font-semibold text-foreground mb-4">Content Opportunities</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-card border border-border">
                  <p className="text-sm font-medium text-foreground mb-1">Create comparison content</p>
                  <p className="text-xs text-muted-foreground">
                    "Why {'{topic}'} is better than {'{alternative}'}" performs well
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border">
                  <p className="text-sm font-medium text-foreground mb-1">Share case studies</p>
                  <p className="text-xs text-muted-foreground">
                    Case studies about this topic get 3x more engagement
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border">
                  <p className="text-sm font-medium text-foreground mb-1">Host live discussions</p>
                  <p className="text-xs text-muted-foreground">
                    Live content about trending topics performs 5x better
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
