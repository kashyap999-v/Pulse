import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ai } from "@/lib/ai";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const businessId = req.nextUrl.searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID required" },
        { status: 400 }
      );
    }

    // Verify access
    const access = await db.businessUser.findFirst({
      where: { businessId, userId: user.id },
    });

    if (!access) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Gather business data for briefing
    const [business, metrics, orders, newCustomers] = await Promise.all([
      db.business.findUnique({ where: { id: businessId } }),
      db.businessMetric.findFirst({
        where: { businessId },
        orderBy: { date: "desc" },
      }),
      db.order.count({
        where: {
          businessId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      db.customer.count({
        where: {
          businessId,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    const businessData = {
      name: business?.name || "Your Business",
      revenue: metrics?.revenue || 0,
      profit: metrics?.profit || 0,
      orders,
      newCustomers,
    };

    // Generate briefing
    const briefing = await ai.generateBriefing(businessData);

    return NextResponse.json({
      success: true,
      data: briefing,
    });
  } catch (error) {
    console.error("Generate briefing error:", error);
    return NextResponse.json(
      { error: "Failed to generate briefing" },
      { status: 500 }
    );
  }
}
