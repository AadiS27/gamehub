import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }
    
    // Access the Gemini Pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ 
      text,
      model: "gemini-pro",
      usage: {
        promptTokens: prompt.length, // This is an approximation
        completionTokens: text.length, // This is an approximation
      }
    });
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Failed to generate content";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: "ok",
    model: "gemini-pro",
    version: "1.0.0"
  });
}