// app/api/gemini/route.ts
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenAI({});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents:message
    });

    return NextResponse.json({ reply: response.text });
  } catch (err: any) {
    console.error("Gemini Error:", err);
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}

