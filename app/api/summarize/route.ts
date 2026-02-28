import { NextResponse } from 'next/server'
import { runSummarization } from '@/lib/services/summarize'
import type { SummarizeRequestBody } from '@/lib/types/summarization'

const PLATFORM_IDS = ['instagram', 'tiktok', 'linkedin', 'twitter', 'youtube'] as const

function validateBody(body: unknown): body is SummarizeRequestBody {
  if (!body || typeof body !== 'object') return false
  const b = body as Record<string, unknown>
  if (typeof b.content !== 'string') return false
  if (!b.options || typeof b.options !== 'object') return false
  const opt = b.options as Record<string, unknown>
  if (!Array.isArray(opt.platforms)) return false
  if (!opt.platforms.every((p) => PLATFORM_IDS.includes(p as (typeof PLATFORM_IDS)[number])))
    return false
  const styles = ['bullet', 'paragraph', 'caption']
  const audiences = ['student', 'professional', 'general']
  if (
    typeof opt.style !== 'string' ||
    !styles.includes(opt.style) ||
    typeof opt.audience !== 'string' ||
    !audiences.includes(opt.audience)
  )
    return false
  if (typeof opt.preserveEmotion !== 'boolean') return false
  const w = opt.importanceWeight
  if (typeof w !== 'number' || w < 0 || w > 100) return false
  return true
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!validateBody(body)) {
      return NextResponse.json(
        { error: 'Invalid request: content (string) and options (platforms, style, audience, preserveEmotion, importanceWeight) required.' },
        { status: 400 }
      )
    }

    const result = await runSummarization(body.content, body.options)
    return NextResponse.json(result)
  } catch (e) {
    console.error('Summarize API error:', e)
    return NextResponse.json(
      { error: 'Summarization failed. Please try again.' },
      { status: 500 }
    )
  }
}
