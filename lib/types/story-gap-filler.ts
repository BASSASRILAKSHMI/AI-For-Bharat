export interface StoryGapFillerOptions {
  weightageBoost: number
  preserveEmotion: boolean
}

export interface StoryGapFillerRequestBody {
  content: string
  options: StoryGapFillerOptions
}

export interface StoryGapAnalysis {
  abruptTransitions: string[]
  missingContext: string[]
  logicalFlowScore: number
}

export interface StoryGapEnhancements {
  connectingLines: string[]
  introSuggestion: string
  outroSuggestion: string
}

export interface StoryGapFillerResult {
  analysis: StoryGapAnalysis
  enhancements: StoryGapEnhancements
  completedStory: string
}
