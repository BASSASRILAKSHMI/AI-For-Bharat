import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { text, platform, tone, length, mainType, subType } =
      await req.json();

    // ==============================
    // SERPER SEARCH INTEGRATION
    // ==============================
    let searchContext = "";

    if (text && text.length > 3) {
      try {
        const serperResponse = await axios.post(
          "https://google.serper.dev/search",
          {
            q: text,
            num: 5,
          },
          {
            headers: {
              "X-API-KEY": process.env.SERPER_API_KEY!,
              "Content-Type": "application/json",
            },
          }
        );

        const results = serperResponse.data.organic || [];

        searchContext = results
          .slice(0, 5)
          .map(
            (item: any, index: number) =>
              `Result ${index + 1}:
Title: ${item.title}
Snippet: ${item.snippet}`
          )
          .join("\n\n");
      } catch {
        console.log("Serper failed — continuing without search.");
      }
    }

    // ==============================
    // INTENT DETECTION
    // ==============================
    const intentResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: `
Extract:
Tone (Professional, Casual, Humorous, Inspirational)
Length (Short, Medium, Long)
Format (Paragraph, Hashtags, Thumbnail, Video Script, Audio Script, Description)

Return ONLY JSON.

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
        },
      }
    );

    let detected = { tone: null, length: null, format: null };

    try {
      detected = JSON.parse(
        intentResponse.data.choices[0].message.content
      );
    } catch {}

    const finalTone = detected.tone || tone;
    const finalLength = detected.length || length;

    // Only override format if default Paragraph
    const finalSubType =
      subType === "Paragraph" ? detected.format || subType : subType;

    const emojiRule =
      finalTone === "Professional"
        ? "Do NOT use emojis."
        : "Use relevant emojis naturally where appropriate.";

    // ==============================
    // STRICT FORMAT RULES
    // ==============================
    let formatRules = "";
    let minWords = 0;
    let maxWords = 0;
    let minTags = 0;
    let maxTags = 0;

    if (finalSubType === "Hashtags") {
      if (finalLength === "Short") {
        minTags = 1;
        maxTags = 3;
      } else if (finalLength === "Medium") {
        minTags = 4;
        maxTags = 7;
      } else {
        minTags = 9;
        maxTags = 11;
      }

      formatRules = `
Generate ONLY hashtags.

STRICT RULES:
- Generate between ${minTags} and ${maxTags} hashtags.
- EVERY tag MUST start with #.
- Separate using spaces.
- No sentences.
- No explanations.
- ${emojiRule}
`;
    } else {
      if (finalLength === "Short") {
        minWords = 60;
        maxWords = 90;
      } else if (finalLength === "Medium") {
        minWords = 120;
        maxWords = 160;
      } else {
        minWords = 250;
        maxWords = 350;
      }

      formatRules = `
Generate ONE high-quality ${finalSubType}.

STRICT LENGTH:
- Between ${minWords} and ${maxWords} words.

Rules:
- Follow word range strictly.
- No numbering.
- No variations.
- Do NOT mention word count.
- ${emojiRule}
`;
    }

    // ==============================
    // GENERATION
    // ==============================
    async function generateContent() {
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
Format: ${finalSubType}
Tone: ${finalTone}

User Prompt:
${text}

Live Search Context:
${searchContext || "None"}

Use search context only if relevant.

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
          },
        }
      );

      return response.data.choices[0].message.content.trim();
    }

    let output = await generateContent();

    // ==============================
    // VALIDATION CHECK (1 RETRY)
    // ==============================

    if (finalSubType === "Hashtags") {
      const tagCount = output.split("#").length - 1;
      if (tagCount < minTags || tagCount > maxTags) {
        output = await generateContent();
      }
    } else {
      const wordCount = output.split(/\s+/).filter(Boolean).length;
      if (wordCount < minWords || wordCount > maxWords) {
        output = await generateContent();
      }
    }

    return NextResponse.json({ output });

  } catch (error: any) {
    console.error("ERROR:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}