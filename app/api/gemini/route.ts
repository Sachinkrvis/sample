// app/api/gemini/route.ts
import { GoogleGenAI, createPartFromBase64, createUserContent } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenAI({});

export async function POST(req: NextRequest) {
  try {
    const { base64Image, message, imageMimeType} = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // console.log("Image size (base64)", base64Image?.length);
    // console.log("Message", message);
    // console.log("Mime Type", imageMimeType);

    const contents = base64Image
      ? [createUserContent([message, createPartFromBase64(base64Image, imageMimeType)])]
      : [createUserContent([message])];

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    return NextResponse.json({ reply: response.text });
  } catch (err: any) {
    console.error("Gemini Error:", err);
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}

