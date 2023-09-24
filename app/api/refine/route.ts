import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const response = await openai.chat.completions.create({
    model: "gpt-4",

    messages: [
      {
        role: "system",
        content: `The text provided below consists of notes that need refining. Please improve the clarity, structure, and coherence of these notes while retaining the main ideas. 
          
            Notes:
            ${prompt}
                    
            Refined Notes:\n`,
      },
    ],
    max_tokens: 1000,
    temperature: 0,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });

  const refinedNotes = response.choices[0].message.content;

  return new NextResponse(JSON.stringify(refinedNotes));
}
