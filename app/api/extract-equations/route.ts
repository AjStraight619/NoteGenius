import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { prompt, initialInput } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k-0613",
    messages: [
      {
        role: "system",
        content: `You are tasked with extracting all the mathematical equations present in the text provided by the user. Please ensure to list down each equation clearly.
  
          User's input:
          ${prompt}
  
          Your response:\n`,
      },
    ],
    max_tokens: 300,
    temperature: 0,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });

  const extractedEquations = response.choices[0].message.content;

  return new NextResponse(JSON.stringify(extractedEquations));
}
