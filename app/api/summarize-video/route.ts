import { NextResponse } from 'next/server'
import { runVideoSummarization } from '@/lib/services/summarize'
import type { SummarizationOptions } from '@/lib/types/summarization'

export const runtime = 'nodejs'

const PLATFORM_IDS = ['instagram', 'tiktok', 'linkedin', 'twitter', 'youtube'] as const
const MAX_VIDEO_BYTES = 20 * 1024 * 1024

function validateOptions(options: unknown): options is SummarizationOptions {
  if (!options || typeof options !== 'object') return false
  const opt = options as Record<string, unknown>

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
  ) {
    return false
  }

  if (typeof opt.preserveEmotion !== 'boolean') return false
  const w = opt.importanceWeight
  return typeof w === 'number' && w >= 0 && w <= 100
}

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const file = form.get('video')
    const rawOptions = form.get('options')
    const context = form.get('context')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Video file is required.' }, { status: 400 })
    }
    if (!file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'Please upload a valid video file.' }, { status: 400 })
    }
    if (file.size > MAX_VIDEO_BYTES) {
      return NextResponse.json(
        { error: 'Video is too large. Upload a file up to 20MB.' },
        { status: 400 }
      )
    }
    if (typeof rawOptions !== 'string') {
      return NextResponse.json({ error: 'Options are required.' }, { status: 400 })
    }

    let optionsParsed: unknown
    try {
      optionsParsed = JSON.parse(rawOptions)
    } catch {
      return NextResponse.json({ error: 'Invalid options JSON.' }, { status: 400 })
    }
    if (!validateOptions(optionsParsed)) {
      return NextResponse.json(
        {
          error:
            'Invalid options: platforms, style, audience, preserveEmotion, importanceWeight required.',
        },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const videoBase64 = Buffer.from(bytes).toString('base64')
    const result = await runVideoSummarization(
      videoBase64,
      file.type,
      optionsParsed,
      typeof context === 'string' ? context : undefined
    )

    if (!result) {
      return NextResponse.json(
        {
          error:
            'Video summarization failed. Check GOOGLE_API_KEY, Gemini quota, and model availability.',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Summarize video API error:', error)
    return NextResponse.json(
      { error: 'Video summarization failed. Please try again.' },
      { status: 500 }
    )
  }
}
