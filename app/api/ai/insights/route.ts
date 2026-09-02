import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ai } from "@/lib/ai";

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

    // Gather business data
    const [business, orders, customers, products, expenses] = await Promise.all([
      db.business.findUnique({ where: { id: businessId } }),
      db.order.findMany({
        where: { businessId },
        take: 10,
        orderBy: { createdAt: "desc" },
      }),
      db.customer.findMany({
        where: { businessId },
        take: 10,
      }),
      db.product.findMany({
        where: { businessId },
        take: 10,
      }),
      db.expense.findMany({
        where: { businessId },
        take: 10,
      }),
    ]);

    const businessData = {
      name: business?.name || "Unknown",
      ordersTotal: orders.length,
      customersTotal: customers.length,
      productsTotal: products.length,
      recentOrders: orders,
      recentCustomers: customers,
      recentExpenses: expenses,
    };

    // Generate insights using AI
    const insights = await ai.generateInsights(businessData);

    // Store insights in database
    for (const insight of insights) {
      await db.aiInsight.create({
        data: {
          businessId,
          type: insight.type as any,
          title: insight.title,
          description: insight.description,
          severity: insight.severity as any,
          supportingData: JSON.stringify(insight),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error("Generate insights error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
