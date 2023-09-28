import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { prompt, initialInput } = await req.json();
  const response = await openai.chat.completions.create({
    model: "gpt-4",

    messages: [
      {
        role: "system",
        content: `Give answers and descriptions to the following questions: ${initialInput}
         Notes:
            ${prompt}
                    
            Refined Notes:\n`,
      },
    ],
    max_tokens: 7000,
    temperature: 0,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });

  const refinedNotes = response.choices[0].message.content;

  return new NextResponse(JSON.stringify(refinedNotes));
}
