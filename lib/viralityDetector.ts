type PostData = {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  retention: number;        // %
  avgWatchTime?: number;    // seconds
  duration?: number;        // seconds
  commentTexts: string[];
  timeline: number[];       // engagement over time
  title?: string;
  description?: string;
};

type Result = {
  authenticityScore: number;
  verdict: "Organic" | "Artificial";
  intent: "Genuine Value" | "Clickbait";
  confidence: number;
  reasons: string[];
};

type CheckResult = {
  score: number;
  reason: string | null;
};

type IntentResult = {
  intent: "Clickbait" | "Genuine Value";
  penalty: number;
  reason: string | null;
};

/* ---------------- SPIKE ANALYSIS ---------------- */
function detectEngagementSpike(timeline: number[]): CheckResult {
  const avg = timeline.reduce((a, b) => a + b, 0) / timeline.length;
  const max = Math.max(...timeline);

  if (max > avg * 4) return { score: 25, reason: "Sudden engagement spike" };
  if (max > avg * 2) return { score: 10, reason: "Minor engagement burst" };
  return { score: 0, reason: null };
}

/* ---------------- COMMENT BEHAVIOUR ---------------- */
function detectBotComments(comments: string[]): CheckResult {
  const unique = new Set(comments.map(c => c.toLowerCase()));
  const repetitionRatio = 1 - unique.size / comments.length;

  if (repetitionRatio > 0.6)
    return { score: 25, reason: "Highly repetitive bot comments" };

  if (repetitionRatio > 0.3)
    return { score: 15, reason: "Suspicious comment repetition" };

  return { score: 0, reason: null };
}

/* ---------------- GENERIC COMMENT QUALITY ---------------- */
function detectLowQualityComments(comments: string[]): CheckResult {
  const generic = ["nice", "wow", "cool", "great", "amazing", "bro", "🔥", "❤️"];

  const count = comments.filter(c =>
    generic.some(g => c.toLowerCase().includes(g))
  ).length;

  const ratio = count / comments.length;

  if (ratio > 0.7) return { score: 20, reason: "Low-effort generic engagement" };
  if (ratio > 0.4) return { score: 10, reason: "Mostly generic reactions" };
  return { score: 0, reason: null };
}

/* ---------------- RETENTION VS VIEWS ---------------- */
function detectRetentionMismatch(data: PostData): CheckResult {
  if (data.retention < 15 && data.views > 5000)
    return { score: 20, reason: "High views but very low retention" };

  if (data.avgWatchTime && data.duration) {
    if (data.avgWatchTime < data.duration * 0.2)
      return { score: 15, reason: "Audience drops early" };
  }

  return { score: 0, reason: null };
}

/* ---------------- LIKE SHARE RATIO ---------------- */
function detectPaidPromotion(data: PostData): CheckResult {
  if (data.likes > data.shares * 25)
    return { score: 15, reason: "Like-share imbalance (possible boosting)" };

  return { score: 0, reason: null };
}

/* ---------------- CLICKBAIT INTENT ---------------- */
function detectClickbait(data: PostData): IntentResult {

  const clickbaitWords = [
    "you won't believe",
    "shocking",
    "must watch",
    "secret revealed",
    "gone wrong",
    "viral trick",
    "number 1 reason"
  ];

  const text = ((data.title ?? "") + " " + (data.description ?? "")).toLowerCase();

  const found = clickbaitWords.some(w => text.includes(w));

  if (found && data.retention < 25)
    return {
      intent: "Clickbait",
      penalty: 20,
      reason: "Clickbait wording with low retention"
    };

  return { intent: "Genuine Value", penalty: 0, reason: null };
}

/* ---------------- MAIN ENGINE ---------------- */
export function detectFakeVirality(data: PostData): Result {

  let penalty = 0;
  const reasons: string[] = [];

  const checks: CheckResult[] = [
    detectEngagementSpike(data.timeline),
    detectBotComments(data.commentTexts),
    detectLowQualityComments(data.commentTexts),
    detectRetentionMismatch(data),
    detectPaidPromotion(data)
  ];

  checks.forEach(c => {
    penalty += c.score;
    if (c.reason) reasons.push(c.reason);
  });

  const intentCheck = detectClickbait(data);
  penalty += intentCheck.penalty;
  if (intentCheck.reason) reasons.push(intentCheck.reason);

  const authenticityScore = Math.max(100 - penalty, 0);

  const verdict: "Organic" | "Artificial" =
    authenticityScore > 60 ? "Organic" : "Artificial";

  const confidence = Math.min(95, 50 + reasons.length * 10);

  return {
    authenticityScore,
    verdict,
    intent: intentCheck.intent,
    confidence,
    reasons
  };
}