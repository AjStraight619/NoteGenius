import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k-0613",
    messages: [
      {
        role: "system",
        content: `Extract only the equations from the following text, and prefix each equation with a number and a colon. For example 1: (equation) ..., n: (equation). Also make sure there are no unnecessary characters in the equations.
  
          User's input:
          ${prompt}
  
          Your response:\n`,
      },
    ],
    max_tokens: 200,
    temperature: 0,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });

  const extractedEquations = response.choices[0].message.content;

  return new NextResponse(JSON.stringify(extractedEquations));
}
