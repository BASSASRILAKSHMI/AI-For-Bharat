/**
 * Summarization service: builds prompts and calls Gemini (AI Studio) or returns deterministic mock output.
 * Set GOOGLE_API_KEY for real summarization; otherwise mock is used.
 */

import type {
  AudienceType,
  PlatformId,
  PlatformSummary,
  SummarizationOptions,
  SummarizationResult,
  SummaryStyle,
} from '@/lib/types/summarization'

const PLATFORM_NAMES: Record<PlatformId, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  twitter: 'X (Twitter)',
  youtube: 'YouTube',
}

const PLATFORM_CONSTRAINTS: Record<
  PlatformId,
  { maxChars: number; tone: string }
> = {
  instagram: { maxChars: 2200, tone: 'Visual, emoji-friendly' },
  tiktok: { maxChars: 150, tone: 'Catchy, trendy' },
  linkedin: { maxChars: 3000, tone: 'Professional' },
  twitter: { maxChars: 280, tone: 'Concise, direct' },
  youtube: { maxChars: 5000, tone: 'Detailed, descriptive' },
}

const IMPORTANCE_KEYWORDS = [
  'important',
  'key',
  'critical',
  'launch',
  'launched',
  'result',
  'impact',
  'growth',
  'insight',
  'strategy',
  'solution',
  'benefit',
  'audience',
  'platform',
  'summary',
  'goal',
]

const EMOTION_KEYWORDS = [
  'excited',
  'thrilled',
  'love',
  'amazing',
  'revolutionary',
  'powerful',
  'proud',
  'confident',
  'happy',
  'urgent',
  'concern',
  'risk',
  'fear',
  'challenge',
]

type LocalSentenceInsight = {
  sentence: string
  importanceScore: number
  emotionalScore: number
  index: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function getSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function scoreSentence(sentence: string): {
  importanceScore: number
  emotionalScore: number
} {
  const lower = sentence.toLowerCase()
  const wordCount = sentence.split(/\s+/).filter(Boolean).length

  const keywordHits = IMPORTANCE_KEYWORDS.filter((k) => lower.includes(k)).length
  const hasNumber = /\d/.test(sentence) ? 1 : 0
  const lengthScore = clamp(wordCount / 22, 0, 1)
  const importanceScore = clamp(
    0.2 + lengthScore * 0.35 + keywordHits * 0.12 + hasNumber * 0.08,
    0,
    1
  )

  const emotionHits = EMOTION_KEYWORDS.filter((k) => lower.includes(k)).length
  const punctuationBoost = /[!?]/.test(sentence) ? 0.12 : 0
  const capsBoost = /[A-Z]{2,}/.test(sentence) ? 0.08 : 0
  const emotionalScore = clamp(0.1 + emotionHits * 0.14 + punctuationBoost + capsBoost, 0, 1)

  return { importanceScore, emotionalScore }
}

function analyzeContent(text: string): {
  sentenceInsights: LocalSentenceInsight[]
  emotionalWeight: number
  topSentences: string[]
} {
  const sentences = getSentences(text)
  if (!sentences.length) {
    return { sentenceInsights: [], emotionalWeight: 0, topSentences: [] }
  }

  const sentenceInsights = sentences.map((sentence, index) => {
    const { importanceScore, emotionalScore } = scoreSentence(sentence)
    return { sentence, importanceScore, emotionalScore, index }
  })

  const emotionalWeight =
    sentenceInsights.reduce((sum, s) => sum + s.emotionalScore, 0) / sentenceInsights.length

  const topSentences = [...sentenceInsights]
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, 3)
    .map((s) => s.sentence)

  return { sentenceInsights, emotionalWeight: Number(emotionalWeight.toFixed(2)), topSentences }
}

function sentenceSelectionCount(total: number, importanceWeight: number): number {
  if (total <= 1) return total
  const ratio = 0.8 - (importanceWeight / 100) * 0.6
  return clamp(Math.round(total * ratio), 1, total)
}

function selectWeightedSentences(
  insights: LocalSentenceInsight[],
  importanceWeight: number
): LocalSentenceInsight[] {
  if (!insights.length) return []
  const count = sentenceSelectionCount(insights.length, importanceWeight)
  return [...insights]
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, count)
    .sort((a, b) => a.index - b.index)
}

function truncate(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text
  if (maxChars <= 3) return text.slice(0, maxChars)
  return `${text.slice(0, maxChars - 3).trimEnd()}...`
}

function applyAudienceTone(parts: string[], audience: AudienceType): string[] {
  if (!parts.length) return parts
  if (audience === 'student') {
    return parts.map((p) =>
      p
        .replace(/\butilize\b/gi, 'use')
        .replace(/\bapproximately\b/gi, 'about')
        .replace(/\bimplementation\b/gi, 'setup')
    )
  }
  if (audience === 'professional') {
    return parts.map((p, i) => (i === 0 ? `Key insight: ${p}` : p))
  }
  return parts
}

function toneTag(platformId: PlatformId): string {
  if (platformId === 'instagram') return ' #creator'
  if (platformId === 'tiktok') return ' #fyp'
  return ''
}

function applyStyle(parts: string[], style: SummaryStyle): string {
  if (!parts.length) return ''
  if (style === 'bullet') return parts.map((p) => `- ${p}`).join('\n')
  if (style === 'caption') return parts.slice(0, 2).join(' ')
  return parts.join(' ')
}

function platformSlice(parts: string[], platformId: PlatformId): string[] {
  if (!parts.length) return []
  if (platformId === 'tiktok') return parts.slice(0, 1)
  if (platformId === 'twitter') return parts.slice(0, 2)
  if (platformId === 'instagram') return parts.slice(0, 2)
  if (platformId === 'linkedin') return parts.slice(0, 3)
  return parts.slice(0, 6)
}

function renderSummaryText(
  platformId: PlatformId,
  parts: string[],
  options: SummarizationOptions
): string {
  const { maxChars } = PLATFORM_CONSTRAINTS[platformId]
  const audienceParts = applyAudienceTone(platformSlice(parts, platformId), options.audience)
  let text = applyStyle(audienceParts, options.style)

  if (!options.preserveEmotion) {
    text = text.replace(/[!?]+/g, '.').replace(/\s{2,}/g, ' ').trim()
  } else if (options.style !== 'bullet') {
    text += toneTag(platformId)
  }

  if (options.style === 'caption') {
    text = truncate(text, Math.min(maxChars, platformId === 'tiktok' ? 120 : maxChars))
  }

  return truncate(text, maxChars)
}

function compactSentence(sentence: string): string {
  return sentence
    .replace(/\b(very|really|just|quite|simply)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function paraphraseSentence(sentence: string): string {
  const replacements: Array<[RegExp, string]> = [
    [/\blaunch(?:ed)?\b/gi, 'introduced'],
    [/\brevolutionary\b/gi, 'high-impact'],
    [/\bhelps\b/gi, 'enables'],
    [/\bmanage\b/gi, 'coordinate'],
    [/\badvanced\b/gi, 'robust'],
    [/\bcomplete solution\b/gi, 'end-to-end approach'],
    [/\bexcited\b/gi, 'motivated'],
    [/\bcreators?\b/gi, 'content teams'],
    [/\bplatform\b/gi, 'experience'],
  ]

  let out = sentence
  for (const [pattern, replacement] of replacements) {
    out = out.replace(pattern, replacement)
  }

  return out.replace(/\s{2,}/g, ' ').trim()
}

function platformLead(platformId: PlatformId): string {
  if (platformId === 'instagram') return 'Visual snapshot:'
  if (platformId === 'tiktok') return 'Quick hook:'
  if (platformId === 'linkedin') return 'Professional takeaway:'
  if (platformId === 'twitter') return 'Fast update:'
  return 'Video description:'
}

function buildAbstractiveFallbackParts(
  insights: LocalSentenceInsight[],
  options: SummarizationOptions,
  platformId: PlatformId,
  variant = 0
): string[] {
  const selected = selectWeightedSentences(insights, options.importanceWeight)
  const source = selected.length ? selected : insights
  const rotated = source.length
    ? source.map((_, i) => source[(i + (variant % source.length)) % source.length])
    : []
  const chosen = rotated.slice(0, platformId === 'youtube' ? 5 : 3)
  if (!chosen.length) return []

  const parts = chosen.map((item, index) => {
    const base = paraphraseSentence(compactSentence(item.sentence))
    const lead = index === 0 ? platformLead(platformId) : ''
    if (options.audience === 'student') {
      if (index === 0) return `${lead} Main idea: ${base}`
      return `Key point for learners: ${base}`
    }
    if (options.audience === 'professional') {
      if (index === 0) return `${lead} Strategic takeaway: ${base}`
      return `Business impact: ${base}`
    }
    if (index === 0) return `${lead} Core summary: ${base}`
    return `Additional point: ${base}`
  })

  return parts
}

function buildSystemPrompt(options: SummarizationOptions): string {
  const audience =
    options.audience === 'student'
      ? 'student (clear, educational)'
      : options.audience === 'professional'
        ? 'professional (industry terms, insights)'
        : 'general (accessible to all)'

  const style =
    options.style === 'bullet'
      ? 'bullet points'
      : options.style === 'caption'
        ? 'short caption (1-2 sentences)'
        : 'paragraph'

  return `You are an abstractive summarization assistant. Return valid JSON only.
Rules:
- Condense content while preserving the core message.
- Preserve emotional tone when requested.
- Respect platform-specific constraints and tone.
- Use audience-specific language.
- Summaries must be meaningful and rewritten in fresh wording, not copied from source lines.
- Do not copy long spans from the source text. Avoid reuse of sentence structure from input.
- Use style "${style}".
- Return:
{
  "summaries": [{ "platformId": string, "text": string }],
  "analysis": {
    "emotionalWeight": number,
    "topSentences": string[],
    "sentenceInsights": [{ "sentence": string, "importanceScore": number, "emotionalScore": number }]
  }
}
Audience: ${audience}
Preserve emotion: ${options.preserveEmotion ? 'yes' : 'no'}
Importance weight: ${options.importanceWeight}`
}

function buildUserPrompt(content: string, options: SummarizationOptions): string {
  const platforms = options.platforms
    .map(
      (id) =>
        `${id}: max ${PLATFORM_CONSTRAINTS[id].maxChars} chars, tone: ${PLATFORM_CONSTRAINTS[id].tone}`
    )
    .join('; ')

  return `Generate a unique summary per requested platform.
Each platform summary must be clearly different in length, tone, and phrasing.
Write abstractively: understand meaning first, then restate it.
Platform constraints: ${platforms}
Content:
${content}`
}

function normalizePlatformId(value: string): PlatformId | null {
  const normalized = value.trim().toLowerCase()
  if (normalized === 'instagram' || normalized === 'insta') return 'instagram'
  if (normalized === 'tiktok' || normalized === 'tik tok') return 'tiktok'
  if (normalized === 'linkedin' || normalized === 'linkedin') return 'linkedin'
  if (normalized === 'twitter' || normalized === 'x' || normalized === 'x/twitter') return 'twitter'
  if (normalized === 'youtube' || normalized === 'yt') return 'youtube'
  return null
}

function toSentenceTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function lexicalOverlap(source: string, candidate: string): number {
  const sourceTokens = new Set(toSentenceTokens(source))
  const candidateTokens = toSentenceTokens(candidate)
  if (!candidateTokens.length) return 1
  let hits = 0
  for (const token of candidateTokens) {
    if (sourceTokens.has(token)) hits += 1
  }
  return hits / candidateTokens.length
}

function summariesTooSimilar(a: string, b: string): boolean {
  const overlap = lexicalOverlap(a, b)
  const shorter = Math.min(a.length, b.length)
  const longer = Math.max(a.length, b.length)
  const lengthRatio = longer === 0 ? 1 : shorter / longer
  return overlap >= 0.72 && lengthRatio >= 0.8
}

function formatByStyle(text: string, style: SummaryStyle): string {
  const sentences = getSentences(text)
  if (!sentences.length) return text.trim()
  if (style === 'bullet') return sentences.map((s) => `- ${s}`).join('\n')
  if (style === 'caption') return sentences.slice(0, 2).join(' ')
  return sentences.join(' ')
}

function normalizeModelSummary(text: string, platformId: PlatformId, options: SummarizationOptions): string {
  const { maxChars } = PLATFORM_CONSTRAINTS[platformId]
  let normalized = formatByStyle(text.trim(), options.style)
  if (!options.preserveEmotion) {
    normalized = normalized.replace(/[!?]+/g, '.').replace(/\s{2,}/g, ' ').trim()
  }
  return truncate(normalized, maxChars)
}

function enforcePlatformUniqueness(
  summaries: PlatformSummary[],
  content: string,
  options: SummarizationOptions,
  insights: LocalSentenceInsight[]
): PlatformSummary[] {
  const finalized: PlatformSummary[] = []

  for (const current of summaries) {
    let text = current.text
    let attempts = 0

    while (
      finalized.some((prev) => summariesTooSimilar(prev.text, text)) &&
      attempts < 3
    ) {
      if (insights.length) {
        const fallbackParts = buildAbstractiveFallbackParts(
          insights,
          options,
          current.platformId,
          attempts + 1
        )
        text = renderSummaryText(current.platformId, fallbackParts, options)
      } else {
        text = truncate(
          `${platformLead(current.platformId)} ${paraphraseSentence(text)}`,
          PLATFORM_CONSTRAINTS[current.platformId].maxChars
        )
      }
      attempts += 1
    }

    if (content && lexicalOverlap(content, text) >= 0.9 && insights.length) {
      const fallbackParts = buildAbstractiveFallbackParts(insights, options, current.platformId, 2)
      text = renderSummaryText(current.platformId, fallbackParts, options)
    }

    finalized.push({
      ...current,
      text,
      charCount: text.length,
      wordCount: text.split(/\s+/).filter(Boolean).length,
    })
  }

  return finalized
}

function parseModelSummaries(parsed: unknown): Array<{ platformId: PlatformId; text: string }> {
  if (!parsed || typeof parsed !== 'object') return []
  const root = parsed as Record<string, unknown>

  const arrayCandidate = root.summaries
  if (Array.isArray(arrayCandidate)) {
    return arrayCandidate
      .map((item) => {
        if (!item || typeof item !== 'object') return null
        const rec = item as Record<string, unknown>
        const idRaw = typeof rec.platformId === 'string' ? rec.platformId : ''
        const text = typeof rec.text === 'string' ? rec.text.trim() : ''
        const platformId = normalizePlatformId(idRaw)
        if (!platformId || !text) return null
        return { platformId, text }
      })
      .filter((v): v is { platformId: PlatformId; text: string } => Boolean(v))
  }

  // Support alternate shape: { summaries: { instagram: "...", twitter: "..." } }
  if (arrayCandidate && typeof arrayCandidate === 'object') {
    const obj = arrayCandidate as Record<string, unknown>
    return Object.entries(obj)
      .map(([k, v]) => {
        const platformId = normalizePlatformId(k)
        const text = typeof v === 'string' ? v.trim() : ''
        if (!platformId || !text) return null
        return { platformId, text }
      })
      .filter((v): v is { platformId: PlatformId; text: string } => Boolean(v))
  }

  return []
}

function extractJsonObject(raw: string): string | null {
  const trimmed = raw.trim()
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) return trimmed

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenced?.[1]) {
    const candidate = fenced[1].trim()
    if (candidate.startsWith('{') && candidate.endsWith('}')) return candidate
  }

  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1)
  return null
}

async function summarizeWithGemini(
  content: string,
  options: SummarizationOptions
): Promise<SummarizationResult | null> {
  const apiKey = process.env.GOOGLE_API_KEY?.trim()
  if (!apiKey?.trim()) return null

  try {
    const configuredModel = process.env.GOOGLE_SUMMARIZATION_MODEL?.trim()
    const modelCandidates = [
      configuredModel,
      'gemini-2.0-flash',
      'gemini-2.5-flash',
      'gemini-1.5-flash-latest',
    ].filter((m): m is string => Boolean(m))

    let raw = ''
    let lastError: { status: number; body: string; model: string } | null = null

    for (const model of modelCandidates) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: buildSystemPrompt(options) }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: buildUserPrompt(content, options) }],
            },
          ],
          generationConfig: {
            temperature: 0.75,
            responseMimeType: 'application/json',
          },
        }),
      })

      if (!res.ok) {
        const err = await res.text()
        lastError = { status: res.status, body: err, model }
        if (res.status === 404) {
          // Try the next supported model if this one is unavailable.
          continue
        }
        console.error('Gemini summarization error:', res.status, err)
        return null
      }

      const data = (await res.json()) as {
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>
          }
        }>
      }
      raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
      if (raw.trim()) {
        break
      }
    }

    if (!raw.trim()) {
      if (lastError) {
        console.error(
          'Gemini summarization error:',
          lastError.status,
          `model=${lastError.model}`,
          lastError.body
        )
      }
      return null
    }

    const jsonRaw = extractJsonObject(raw)
    if (!jsonRaw) return null

    const parsed = JSON.parse(jsonRaw) as Record<string, unknown>
    const modelSummaries = parseModelSummaries(parsed)
    const analysisFromModel =
      parsed.analysis && typeof parsed.analysis === 'object'
        ? (parsed.analysis as {
            emotionalWeight?: number
            topSentences?: string[]
            sentenceInsights?: {
              sentence: string
              importanceScore: number
              emotionalScore: number
            }[]
          })
        : undefined

    const localAnalysis = analyzeContent(content)
    const summaries: PlatformSummary[] = options.platforms.map((platformId) => {
      const modelText = modelSummaries.find((s) => s.platformId === platformId)?.text ?? ''
      let text = ''

      if (modelText) {
        const overlap = lexicalOverlap(content, modelText)
        if (overlap < 0.85) {
          text = normalizeModelSummary(modelText, platformId, options)
        }
      }

      if (!text) {
        text = getMockSummary(content, platformId, options, localAnalysis.sentenceInsights)
      }

      return {
        platformId,
        platformName: PLATFORM_NAMES[platformId],
        text,
        charCount: text.length,
        wordCount: text.split(/\s+/).filter(Boolean).length,
        tone: PLATFORM_CONSTRAINTS[platformId].tone,
      }
    })

    return {
      summaries: enforcePlatformUniqueness(summaries, content, options, localAnalysis.sentenceInsights),
      analysis: {
        emotionalWeight:
          typeof analysisFromModel?.emotionalWeight === 'number'
            ? clamp(analysisFromModel.emotionalWeight, 0, 1)
            : localAnalysis.emotionalWeight,
        topSentences:
          analysisFromModel?.topSentences?.filter(Boolean).slice(0, 3) ?? localAnalysis.topSentences,
        sentenceInsights:
          analysisFromModel?.sentenceInsights
            ?.filter((s) => s?.sentence)
            .slice(0, 8)
            .map((s) => ({
              sentence: s.sentence,
              importanceScore: clamp(s.importanceScore ?? 0, 0, 1),
              emotionalScore: clamp(s.emotionalScore ?? 0, 0, 1),
            })) ??
          localAnalysis.sentenceInsights.slice(0, 8).map((s) => ({
            sentence: s.sentence,
            importanceScore: s.importanceScore,
            emotionalScore: s.emotionalScore,
          })),
      },
    }
  } catch (e) {
    console.error('Gemini summarization fetch error:', e)
    return null
  }
}

function getMockSummary(
  content: string,
  platformId: PlatformId,
  options: SummarizationOptions,
  insights?: LocalSentenceInsight[]
): string {
  const sourceInsights = insights ?? analyzeContent(content).sentenceInsights
  const parts = buildAbstractiveFallbackParts(sourceInsights, options, platformId)
  return renderSummaryText(platformId, parts, options)
}

export async function runSummarization(
  content: string,
  options: SummarizationOptions
): Promise<SummarizationResult> {
  const trimmed = content?.trim() ?? ''

  if (!trimmed) {
    return {
      summaries: options.platforms.map((id) => ({
        platformId: id,
        platformName: PLATFORM_NAMES[id],
        text: '',
        charCount: 0,
        wordCount: 0,
        tone: PLATFORM_CONSTRAINTS[id].tone,
      })),
      analysis: { emotionalWeight: 0, topSentences: [], sentenceInsights: [] },
    }
  }

  const llmResult = await summarizeWithGemini(trimmed, options)
  if (llmResult) return llmResult

  const localAnalysis = analyzeContent(trimmed)

  const summaries: PlatformSummary[] = options.platforms.map((platformId) => {
    const text = getMockSummary(trimmed, platformId, options, localAnalysis.sentenceInsights)
    return {
      platformId,
      platformName: PLATFORM_NAMES[platformId],
      text,
      charCount: text.length,
      wordCount: text.split(/\s+/).filter(Boolean).length,
      tone: PLATFORM_CONSTRAINTS[platformId].tone,
    }
  })

  return {
    summaries: enforcePlatformUniqueness(summaries, trimmed, options, localAnalysis.sentenceInsights),
    analysis: {
      emotionalWeight: localAnalysis.emotionalWeight,
      topSentences: localAnalysis.topSentences,
      sentenceInsights: localAnalysis.sentenceInsights.slice(0, 8).map((s) => ({
        sentence: s.sentence,
        importanceScore: s.importanceScore,
        emotionalScore: s.emotionalScore,
      })),
    },
  }
}

export async function runVideoSummarization(
  videoBase64: string,
  mimeType: string,
  options: SummarizationOptions,
  contextText?: string
): Promise<SummarizationResult | null> {
  const apiKey = process.env.GOOGLE_API_KEY?.trim()
  if (!apiKey?.trim()) return null
  if (!videoBase64.trim()) return null

  try {
    const configuredModel = process.env.GOOGLE_SUMMARIZATION_MODEL?.trim()
    const modelCandidates = [
      configuredModel,
      'gemini-2.0-flash',
      'gemini-2.5-flash',
      'gemini-1.5-flash-latest',
    ].filter((m): m is string => Boolean(m))

    const prompt = `Analyze this video and produce meaningful platform-specific summaries.
Rules:
- Understand the whole video content first, then summarize.
- Do not output copied transcript fragments.
- Each platform summary must be distinct in tone and phrasing.
- Audience: ${options.audience}
- Style: ${options.style}
- Preserve emotion: ${options.preserveEmotion ? 'yes' : 'no'}
- Importance weight: ${options.importanceWeight}
- Platforms: ${options.platforms.join(', ')}
- Return JSON only with shape:
{
  "summaries": [{ "platformId": string, "text": string }],
  "analysis": {
    "emotionalWeight": number,
    "topSentences": string[],
    "sentenceInsights": [{ "sentence": string, "importanceScore": number, "emotionalScore": number }]
  }
}
${contextText?.trim() ? `Extra context from user: ${contextText.trim()}` : ''}`

    let raw = ''
    let lastError: { status: number; body: string; model: string } | null = null

    for (const model of modelCandidates) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: videoBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.75,
            responseMimeType: 'application/json',
          },
        }),
      })

      if (!res.ok) {
        const err = await res.text()
        lastError = { status: res.status, body: err, model }
        if (res.status === 404) continue
        console.error('Gemini video summarization error:', res.status, err)
        return null
      }

      const data = (await res.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> }
        }>
      }
      raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
      if (raw.trim()) break
    }

    if (!raw.trim()) {
      if (lastError) {
        console.error(
          'Gemini video summarization error:',
          lastError.status,
          `model=${lastError.model}`,
          lastError.body
        )
      }
      return null
    }

    const jsonRaw = extractJsonObject(raw)
    if (!jsonRaw) return null

    const parsed = JSON.parse(jsonRaw) as Record<string, unknown>
    const modelSummaries = parseModelSummaries(parsed)
    const summaries: PlatformSummary[] = options.platforms.map((platformId) => {
      const modelText = modelSummaries.find((s) => s.platformId === platformId)?.text ?? ''
      const text = modelText
        ? normalizeModelSummary(modelText, platformId, options)
        : truncate('Summary unavailable for this platform.', PLATFORM_CONSTRAINTS[platformId].maxChars)

      return {
        platformId,
        platformName: PLATFORM_NAMES[platformId],
        text,
        charCount: text.length,
        wordCount: text.split(/\s+/).filter(Boolean).length,
        tone: PLATFORM_CONSTRAINTS[platformId].tone,
      }
    })

    return {
      summaries: enforcePlatformUniqueness(summaries, contextText ?? '', options, []),
      analysis:
        parsed.analysis && typeof parsed.analysis === 'object'
          ? (parsed.analysis as SummarizationResult['analysis'])
          : undefined,
    }
  } catch (e) {
    console.error('Gemini video summarization fetch error:', e)
    return null
  }
}
