/**
 * Summarization feature types.
 * Supports: platform-specific, style, audience, emotion preservation, weightage.
 */

export type SummaryStyle = 'bullet' | 'paragraph' | 'caption'

export type AudienceType = 'student' | 'professional' | 'general'

export type PlatformId = 'instagram' | 'tiktok' | 'linkedin' | 'twitter' | 'youtube'

export interface SummarizationOptions {
  /** Target platforms; summaries respect platform constraints (length, tone). */
  platforms: PlatformId[]
  /** Output format: bullet points, paragraph, or short caption. */
  style: SummaryStyle
  /** Audience affects vocabulary and depth (student vs professional vs general). */
  audience: AudienceType
  /** When true, preserve emotional tone and key emotional phrases. */
  preserveEmotion: boolean
  /** 0-100: boost weight given to important sentences (higher = more selective). */
  importanceWeight: number
}

export interface PlatformSummary {
  platformId: PlatformId
  platformName: string
  text: string
  charCount: number
  wordCount: number
  /** Detected or preserved tone hint. */
  tone?: string
}

export interface SummarizationResult {
  summaries: PlatformSummary[]
  analysis?: {
    emotionalWeight?: number
    topSentences?: string[]
    sentenceInsights?: {
      sentence: string
      importanceScore: number
      emotionalScore: number
    }[]
  }
}

export interface SummarizeRequestBody {
  content: string
  options: SummarizationOptions
}
