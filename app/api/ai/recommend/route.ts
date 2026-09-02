import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId } = await req.json();

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

    // Gather business data for recommendations
    const [orders, customers, inventory] = await Promise.all([
      db.order.findMany({
        where: { businessId },
        take: 20,
        orderBy: { createdAt: "desc" },
      }),
      db.customer.findMany({
        where: { businessId },
        take: 20,
      }),
      db.inventory.findMany({
        where: { businessId },
        include: { product: true },
      }),
    ]);

    const businessData = {
      orders: orders.length,
      customers: customers.length,
      lowStockProducts: inventory.filter((inv) => inv.quantity < inv.reorderLevel)
        .length,
    };

    // Generate recommendations using AI
    const recommendations = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/ai/recommend`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessData }),
      }
    );

    if (!recommendations.ok) {
      return NextResponse.json(
        { success: true, data: [] },
        { status: 200 }
      );
    }

    const result = await recommendations.json();

    return NextResponse.json({
      success: true,
      data: result.data || [],
    });
  } catch (error) {
    console.error("Get recommendations error:", error);
    return NextResponse.json(
      { success: true, data: [] },
      { status: 200 }
    );
  }
}
