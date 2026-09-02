import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth-helper";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const businessId = req.headers.get("X-Business-Id");
    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    // Verify user has access to this business
    const businessUser = await db.businessUser.findFirst({
      where: { businessId, userId: user.id },
    });

    if (!businessUser) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get metrics for the business
    const revenue = await db.order.aggregate({
      where: { businessId },
      _sum: { total: true },
    });

    const orders = await db.order.count({ where: { businessId } });
    const customers = await db.customer.count({ where: { businessId } });
    const expenses = await db.expense.aggregate({
      where: { businessId },
      _sum: { amount: true },
    });

    const profit = (revenue._sum.total || 0) - (expenses._sum.amount || 0);

    return NextResponse.json({
      success: true,
      data: {
        revenue: revenue._sum.total || 0,
        orders,
        customers,
        profit,
      },
    });
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
