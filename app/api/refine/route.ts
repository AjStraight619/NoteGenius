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
        content: `You will receive either a note that needs refinement or a question that requires an answer. The user might also provide additional instructions. Here's what you need to keep in mind:

            1. If given a note, refine it based on the provided instructions. If no specific instructions are given, refine it to the best of your ability.
            2. If presented with a question, provide a comprehensive answer. Use any extra instructions, if provided, to guide your response.

            User's instructions (if any): ${initialInput}
            
            User's input:
            ${prompt}

            Your response:\n`,
      },
    ],
    max_tokens: 4000,
    temperature: 0,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });

  const refinedNotes = response.choices[0].message.content;

  return new NextResponse(JSON.stringify(refinedNotes));
}
