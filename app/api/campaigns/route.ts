import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("session_token")?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await db.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user;

    const businessId = req.nextUrl.searchParams.get("businessId");
    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID required" },
        { status: 400 }
      );
    }

    const access = await db.businessUser.findFirst({
      where: { businessId, userId: user.id },
    });

    if (!access) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const campaigns = await db.campaign.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, data: campaigns });
  } catch (error) {
    console.error("Get campaigns error:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("session_token")?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await db.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user;

    const body = await req.json();
    const { businessId, name, description, type, budget, startDate, endDate } = body;

    if (!businessId || !name || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const access = await db.businessUser.findFirst({
      where: { businessId, userId: user.id },
    });

    if (!access) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const campaign = await db.campaign.create({
      data: {
        businessId,
        name,
        description,
        type,
        budget: budget ? parseFloat(budget) : 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: "DRAFT",
      },
    });

    return NextResponse.json(
      { success: true, data: campaign },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create campaign error:", error);
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
