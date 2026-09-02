import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("session_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    const session = await db.session.findUnique({
      where: { sessionToken: token },
      include: { user: true },
    });

    if (!session || session.expires < new Date()) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    // Get user's business
    const businessUser = await db.businessUser.findFirst({
      where: { userId: session.user.id },
      include: { business: true },
    });

    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      business: businessUser?.business || null,
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
