'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, Shield, Activity } from 'lucide-react'
import { SAFETY_METRICS, VIRALITY_REASONS, VIRALITY_INTENT, VIRALITY_CONFIDENCE } from '@/lib/mock-data'
export default function SafetyIntegrityPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Safety & Integrity</h1>
        <p className="text-muted-foreground mt-1">Ensure your content meets all safety and compliance standards</p>
      </div>

      {/* Overall Status */}
      <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Safety Status: Excellent</h2>
            <p className="text-muted-foreground">Your content passes all safety checks</p>
          </div>
          <CheckCircle size={48} className="text-green-500 flex-shrink-0" />
        </div>
      </Card>

       {/* Engagement Authenticity Analysis */}
<Card className="p-6 border-yellow-500/30 bg-yellow-500/5">
  <h2 className="text-lg font-semibold text-foreground mb-4">
    Engagement Authenticity Analysis
  </h2>

  <div className="flex items-start gap-4">
    <AlertCircle size={26} className="text-yellow-600 flex-shrink-0 mt-1" />

    <div className="space-y-2">
      <p className="font-medium text-foreground">
        Suspicious Engagement Detected ({VIRALITY_INTENT})
      </p>

      <p className="text-sm text-muted-foreground">
        Confidence Score: <span className="font-semibold">{VIRALITY_CONFIDENCE}%</span>
      </p>

      <div className="mt-3">
        <p className="text-sm font-medium mb-1">Reasons:</p>
        <ul className="text-sm text-muted-foreground list-disc ml-5 space-y-1">
          {VIRALITY_REASONS.map((reason, i) => (
            <li key={i}>{reason}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
</Card>

      

      {/* Safety Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {SAFETY_METRICS.map((metric) => (
          <Card key={metric.label} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
              <Badge
                className={`${
                  metric.status === 'safe'
                    ? 'bg-green-500/20 text-green-700 border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'
                }`}
              >
                {metric.status}
              </Badge>
            </div>

            <div className="mb-4">
              <p className="text-2xl font-bold text-foreground">{metric.value}%</p>
              <p className="text-xs text-muted-foreground">Score out of {metric.max}</p>
            </div>

            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  metric.value > 50 ? 'bg-green-500' : metric.value > 20 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(metric.value, 100)}%` }}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detailed Analysis */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Detailed Analysis</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Plagiarism Check</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Content is 100% original. No plagiarism detected across web sources.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Toxicity Detection</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    No toxic language or hate speech detected. Safe for all audiences.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Copyright Compliance</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    No copyright violations detected. All references are properly attributed.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">AI-Generated Content</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    15% of content appears to be AI-assisted. Consider adding more personal touch.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Platform Terms of Service</p>
                  {/* Fake Virality Detection */}

                  <p className="text-sm text-muted-foreground mt-1">
                    Compliant with all major social media platform guidelines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Fixes */}
        <Card className="p-6 bg-accent/5 border-accent/20">
          <h3 className="font-semibold text-foreground mb-4">Recommendations</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer">
              <p className="text-sm font-medium text-foreground">Add more personal context</p>
              <p className="text-xs text-muted-foreground mt-1">Make content feel more authentic</p>
            </div>
            <div className="p-3 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer">
              <p className="text-sm font-medium text-foreground">Review sources</p>
              <p className="text-xs text-muted-foreground mt-1">Verify all external references</p>
            </div>
            <div className="p-3 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer">
              <p className="text-sm font-medium text-foreground">Update disclaimers</p>
              <p className="text-xs text-muted-foreground mt-1">Add necessary disclosures</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Compliance Checklist */}
     
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Compliance Checklist</h2>
        <div className="space-y-2">
          {[
            { item: 'No spam or fake engagement', status: 'pass' },
            { item: 'Appropriate for target audience', status: 'pass' },
            { item: 'No misleading claims', status: 'pass' },
            { item: 'Privacy policy compliant', status: 'pass' },
            { item: 'Accessibility standards met', status: 'warning' },
            { item: 'No prohibited content', status: 'pass' },
          ].map((check, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors">
              <p className="text-sm text-foreground">{check.item}</p>
              {check.status === 'pass' ? (
                <CheckCircle size={18} className="text-green-500" />
              ) : (
                <AlertCircle size={18} className="text-yellow-500" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Real-time Monitoring */}
      <Card className="p-6 border-primary/20 bg-primary/5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Real-time Monitoring</h3>
            <p className="text-sm text-muted-foreground">
              We continuously monitor your published content for safety issues
            </p>
          </div>
          <Activity size={32} className="text-primary flex-shrink-0" />
        </div>
        <div className="mt-4 p-3 rounded-lg bg-card border border-primary/20">
          <p className="text-xs text-muted-foreground">
            Last checked: 2 minutes ago • Next check: In 5 minutes
          </p>
        </div>
      </Card>
    </div>
  )
}
