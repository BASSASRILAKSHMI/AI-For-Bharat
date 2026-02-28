import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { query } = await req.json()

  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.SERPER_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: query }),
  })

  const data = await res.json()

  return NextResponse.json(data)
}

export async function GET() {
  return Response.json({
    error: "Use POST request"
  }, { status: 405 });
}