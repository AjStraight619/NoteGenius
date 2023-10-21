import { NextRequest, NextResponse } from "next/server";

const sampleEquations: string[] = [
  "x^2 + y^2 = 1", // Circle equation
  "y = mx + b", // Linear equation
  "ax^2 + bx + c = 0", // Quadratic equation
  "x^3 - 6x^2 + 11x - 6 = 0", // Cubic equation
  "e^x = x^2", // Exponential equation
  "sin(x) = 0.5", // Trigonometric equation
  "x^2 + y^2 - z^2 = 0", // 3D surface equation
  "y'' + p(x)y' + q(x)y = 0", // Second order linear differential equation
  "∫ x dx", // Definite integral
  "∂(∂y/∂x)/∂x + y = 0", // Partial differential equation
  "lim (x -> 0) (sin(x)/x)", // Limit
  "∑ (n=1 to ∞) 1/n^2", // Infinite series
  "x^n + y^n = z^n, n > 2", // Fermat's Last Theorem equation
  "P = IV", // Ohm's Law
  "F = ma", // Newton's Second Law
];

const WOLFRAMALPHAAPIURL = "https://api.wolframalpha.com/v2/query?input=";
const APP_ID = "UYQ8EG-3VEARQGGQ4";

export async function GET(req: NextRequest) {
  try {
    const queryURL = `${WOLFRAMALPHAAPIURL}${encodeURIComponent(
      sampleEquations[3]
    )}&appid=${APP_ID}&output=json`;

    const res = await fetch(queryURL);
    const data = await res.json();

    console.log("Data:", data);
    console.log(
      "Data.queryresult:",
      data.queryresult.pods[0].subpods[0].img.src
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error });
  }
}
