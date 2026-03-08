 
import { NextResponse } from "next/server";
import axios from "axios";
import {
  BedrockRuntimeClient,
  StartAsyncInvokeCommand,
  GetAsyncInvokeCommand,
  AsyncInvokeStatus,
} from "@aws-sdk/client-bedrock-runtime";
import {
  S3Client,
  GetObjectCommand,
} from "@aws-sdk/client-s3"; 

const bedrock = new BedrockRuntimeClient({ region: "us-east-1" });
const s3 = new S3Client({ region: "us-east-1" });
 

export async function POST(req: Request) {
  try {
    const { text, platform, tone, length, mainType, subType, fileData } =
      await req.json();
      

    // =====================================================
    // 🧠 SMART IMAGE SYSTEM (REAL SEARCH + AI FALLBACK)
    // =====================================================
    if (subType === "Image") {
      try {
        // 1️⃣ Search real images using Serper
        const searchResponse = await axios.post(
          "https://google.serper.dev/images",
          { q: text, num: 5 },
          {
            headers: {
              "X-API-KEY": process.env.SERPER_API_KEY!,
            },
          }
        );

        // 🔥 Filter only valid direct image URLs
        const imageResults = (searchResponse.data.images || []).filter(
          (img: any) =>
            img.imageUrl &&
            (img.imageUrl.endsWith(".jpg") ||
              img.imageUrl.endsWith(".jpeg") ||
              img.imageUrl.endsWith(".png") ||
              img.imageUrl.includes("cdn")) &&
            !img.imageUrl.includes("instagram.com") &&
            !img.imageUrl.includes("facebook.com")
        );

        if (imageResults.length > 0) {
          const realImage = await axios.get(imageResults[0].imageUrl, {
            responseType: "arraybuffer",
          });

          const contentType = realImage.headers["content-type"];

          // 🚨 Skip if not actual image
          if (!contentType || !contentType.startsWith("image")) {
            throw new Error("Invalid image type");
          }

          const base64Real = Buffer.from(realImage.data).toString("base64");

          return NextResponse.json({
            image: `data:${contentType};base64,${base64Real}`,
            source: "web",
          });
        }
      } catch (err) {
        console.log("Real image search failed, using AI fallback...");
      }

      // 2️⃣ Fallback → Stability AI
      try {
        const imageResponse = await axios.post(
          "https://api.stability.ai/v2beta/stable-image/generate/core",
          {
            prompt: text,
            output_format: "png",
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const base64Image = imageResponse.data.image;

        return NextResponse.json({
          image: `data:image/png;base64,${base64Image}`,
          source: "ai",
        });
      } catch (err: any) {
        console.error("Stability AI Error:", err.response?.data || err.message);
        return NextResponse.json(
          { error: "Image generation failed" },
          { status: 500 }
        );
      }
    }

    // =====================================================
// 🎬 AWS NOVA REEL VIDEO GENERATION (FINAL WORKING)
// =====================================================
 // =====================================================
if (
  mainType === "Text" &&
  (subType === "Reel Generation" || subType === "Video Generation")
) {
  const startResponse = await bedrock.send(
    new StartAsyncInvokeCommand({
      modelId: "amazon.nova-reel-v1:0",

      modelInput: {
        taskType: "TEXT_TO_VIDEO",

        textToVideoParams: {
          text: text, // 🔥 USE USER PROMPT (not "your prompt")
        },

        videoGenerationConfig: {
          durationSeconds: 5,
          fps: 24,
          dimension: "1280x720",
        },
      },

      outputDataConfig: {
        s3OutputDataConfig: {
          s3Uri: "s3://nova-reel-video-output-srilakshmi/videos/",
        },
      },
    })
  );

  const invocationArn = startResponse.invocationArn;
  if (!invocationArn) {
    throw new Error("Nova Reel job did not start");
  }

  let status: AsyncInvokeStatus = "InProgress";
  let s3Uri: string | undefined;

  while (status === "InProgress") {
    await new Promise((r) => setTimeout(r, 4000));

    const poll = await bedrock.send(
      new GetAsyncInvokeCommand({ invocationArn })
    );

    if (!poll.status) {
      throw new Error("Nova Reel status missing");
    }

    status = poll.status;

    if (status === "Completed") {
      s3Uri = poll.outputDataConfig?.s3OutputDataConfig?.s3Uri;
      break;
    }

    if (status === "Failed") {
      throw new Error("Nova Reel generation failed");
    }
  }

  if (!s3Uri) {
    throw new Error("No S3 output from Nova Reel");
  }

  const [, , bucket, ...keyParts] = s3Uri.split("/");
  const key = keyParts.join("/");

  const s3Object = await s3.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  const stream = s3Object.Body as any;
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  const videoBuffer = Buffer.concat(chunks);
  const base64Video = videoBuffer.toString("base64");

  return NextResponse.json({
    video: `data:video/mp4;base64,${base64Video}`,
    source: "aws-nova",
  });
}
    // =====================================================
    // 🚀 ORIGINAL LOGIC BELOW (UNCHANGED)
    // =====================================================

    // VIDEO INPUT HANDLING (NEW ADDITION)
//     // =====================================================
    let videoContext = "";

    if (mainType === "Video") {
      // Case 1: User uploaded video file
      if (fileData) {
        const base64Data = fileData.split(",")[1];

        const geminiResponse = await axios.post(
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "video/mp4",
              data: base64Data,
            },
          },
          {
            text: `
Analyze this video carefully.

1. What is the main topic?
2. What is the intent?
3. Who is the target audience?
4. What key message is being delivered?

Give a structured summary.
`,
          },
        ],
      },
    ],
  }
);

        videoContext =
          geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "";
      }

      // Case 2: User pasted video URL
      else if (text && text.startsWith("http")) {
        try {
          const serperResponse = await axios.post(
            "https://google.serper.dev/search",
            {
              q: text,
              num: 3,
            },
            {
              headers: {
                "X-API-KEY": process.env.SERPER_API_KEY!,
              },
            }
          );

          const results = serperResponse.data.organic || [];

          videoContext = results
            .map((r: any) => `${r.title} - ${r.snippet}`)
            .join("\n");

        } catch {
          console.log("Serper failed for video URL.");
        }
      }
    }

    // =====================================================
    // SERPER SEARCH (FOR NORMAL TEXT INPUT)
    // =====================================================
    let searchContext = "";

    if (mainType === "Text" && text && text.length > 3) {
      try {
        const serperResponse = await axios.post(
          "https://google.serper.dev/search",
          { q: text, num: 5 },
          {
            headers: {
              "X-API-KEY": process.env.SERPER_API_KEY!,
            },
          }
        );

        const results = serperResponse.data.organic || [];

        searchContext = results
          .slice(0, 5)
          .map((item: any) => `${item.title}: ${item.snippet}`)
          .join("\n");

      } catch {
        console.log("Serper failed.");
      }
    }

    // =====================================================
    // INTENT DETECTION (UNCHANGED)
    // =====================================================
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
    const finalSubType =
      subType === "Paragraph" ? detected.format || subType : subType;

    const emojiRule =
      finalTone === "Professional"
        ? "Do NOT use emojis."
        : "Use relevant emojis naturally where appropriate.";

    // =====================================================
    // STRICT LENGTH RULES (UNCHANGED)
    // =====================================================
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
Between ${minTags} and ${maxTags}.
Every tag must start with #.
Separate by spaces.
No sentences.
${emojiRule}
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
Generate ONE ${finalSubType}.
Between ${minWords} and ${maxWords} words.
No numbering.
No variations.
${emojiRule}
`;
    }

    // =====================================================
    // GENERATION (GROQ – SAME ENGINE)
    // =====================================================
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
Tone: ${finalTone}
Format: ${finalSubType}

Video Context:
${videoContext || "None"}

Text Context:
${searchContext || text}

Use video context if available.

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

    return NextResponse.json({ output });

  } catch (error: any) {
    console.error("ERROR:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}









