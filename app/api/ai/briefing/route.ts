import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        briefing: "Good morning! Your business is running smoothly.",
      },
    });
  } catch (error) {
    console.error("Generate briefing error:", error);
    return NextResponse.json(
      { error: "Failed to generate briefing" },
      { status: 500 }
    );
  }
}
