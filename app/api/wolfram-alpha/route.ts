import { NextRequest, NextResponse } from "next/server";

const WOLFRAMALPHAAPIURL = "https://api.wolframalpha.com/v2/query?input=";
const APP_ID = "UYQ8EG-3VEARQGGQ4";

export async function GET(req: NextRequest) {
  try {
    // Extract equation query parameters (expecting multiple equations)
    const equations = req.nextUrl.searchParams.getAll("equation");
    console.log("Equations:", equations);

    if (equations.length > 0) {
      // Handle multiple equations (e.g., combining them or making multiple requests)
      // For simplicity, let's use the first equation for now
      const queryURL = `${WOLFRAMALPHAAPIURL}${encodeURIComponent(
        equations[0]
      )}&appid=${APP_ID}&output=json`;

      const res = await fetch(queryURL);
      const data = await res.json();

      console.log("Data:", data);
      return NextResponse.json(data);
    } else {
      throw new Error("Equation parameter is missing");
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error || "An error occurred" });
  }
}
