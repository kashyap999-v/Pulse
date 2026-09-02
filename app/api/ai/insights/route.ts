import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        insights: [
          { title: "Revenue trending up", severity: "high" },
          { title: "New customer acquisition strong", severity: "medium" },
        ],
      },
    });
  } catch (error) {
    console.error("Generate insights error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
