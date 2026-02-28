import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { text, platform, tone, length, mainType, subType } =
      await req.json();

    // ---------------------------
    // STEP 1: AI INTENT DETECTION
    // ---------------------------
    const intentResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: `
Analyze the following user prompt and extract:

- Tone (Professional, Casual, Humorous, Inspirational)
- Length (Short, Medium, Long)
- Format (Paragraph, Hashtags, Thumbnail, Video Script, Audio Script, Description)

Return ONLY valid JSON like:

{
  "tone": "",
  "length": "",
  "format": ""
}

If not specified, return null.

User Prompt:
${text}
`,
          },
        ],
        temperature: 0,
        max_tokens: 200,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let detected = {
      tone: null,
      length: null,
      format: null,
    };

    try {
      detected = JSON.parse(
        intentResponse.data.choices[0].message.content
      );
    } catch {
      // If parsing fails, fallback silently
    }

    const finalTone = detected.tone || tone;
    const finalLength = detected.length || length;
    const finalSubType = detected.format || subType;

    // ---------------------------
    // STEP 2: EMOJI CONTROL
    // ---------------------------
    const emojiRule =
      finalTone === "Professional"
        ? "Do NOT use emojis."
        : "Use relevant emojis naturally where appropriate.";

    // ---------------------------
    // STEP 3: FORMAT RULES
    // ---------------------------
    let formatRules = "";

    if (finalSubType === "Hashtags") {
      let countRule =
        finalLength === "Short"
          ? "Generate 1 to 3 hashtags."
          : finalLength === "Medium"
          ? "Generate 5 to 6 hashtags."
          : "Generate 10 to 15 hashtags.";

      formatRules = `
Generate ONLY hashtags.

Rules:
- ${countRule}
- EVERY tag MUST start with #.
- Separate using spaces.
- No explanation.
- ${emojiRule}
`;
    } else {
      formatRules = `
Generate ONE high-quality ${finalSubType}.

Length Guidelines:
- Short: 60–100 words
- Medium: 120–180 words
- Long: 250–400 words

Rules:
- Respect selected length.
- No numbering.
- No "Variation".
- ${emojiRule}
`;
    }

    // ---------------------------
    // STEP 4: FINAL GENERATION
    // ---------------------------
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: `
You are a professional content strategist.

Platform: ${platform}
Content Type: ${mainType}
Format: ${finalSubType}
Tone: ${finalTone}
Length: ${finalLength}

User Prompt:
${text}

${formatRules}
`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const output = response.data.choices[0].message.content;

    return NextResponse.json({ output });
  } catch (error: any) {
    console.error("FULL ERROR:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}