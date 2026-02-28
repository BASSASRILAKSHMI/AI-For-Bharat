import { NextResponse } from 'next/server'
import { runStoryGapFiller } from '@/lib/services/story-gap-filler'
import type { StoryGapFillerRequestBody } from '@/lib/types/story-gap-filler'

function validateBody(body: unknown): body is StoryGapFillerRequestBody {
  if (!body || typeof body !== 'object') return false
  const b = body as Record<string, unknown>
  if (typeof b.content !== 'string') return false
  if (!b.options || typeof b.options !== 'object') return false

  const options = b.options as Record<string, unknown>
  if (typeof options.weightageBoost !== 'number') return false
  if (options.weightageBoost < 0 || options.weightageBoost > 100) return false
  if (typeof options.preserveEmotion !== 'boolean') return false

  return true
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!validateBody(body)) {
      return NextResponse.json(
        {
          error:
            'Invalid request: content (string) and options (weightageBoost, preserveEmotion) are required.',
        },
        { status: 400 }
      )
    }

    const result = await runStoryGapFiller(body.content, body.options)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Story gap filler API error:', error)
    return NextResponse.json(
      { error: 'Story gap filling failed. Please try again.' },
      { status: 500 }
    )
  }
}
