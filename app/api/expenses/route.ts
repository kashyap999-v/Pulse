import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

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

    const expenses = await db.expense.findMany({
      where: { businessId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    console.error("Get expenses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { businessId, category, description, amount, date, isRecurring, frequency, notes } = body;

    if (!businessId || !category || !description || !amount || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    const expense = await db.expense.create({
      data: {
        businessId,
        category: category as any,
        description,
        amount: parseFloat(amount),
        date: new Date(date),
        isRecurring: isRecurring || false,
        frequency: frequency || null,
        notes,
      },
    });

    return NextResponse.json(
      { success: true, data: expense },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create expense error:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
