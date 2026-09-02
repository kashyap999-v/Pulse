import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth-helper";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
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

    const products = await db.product.findMany({
      where: { businessId },
      include: { inventory: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { businessId, name, sku, price, cost, category, description } =
      body;

    if (!businessId || !name || !sku || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify access
    const access = await db.businessUser.findFirst({
      where: { businessId, userId: user.id },
    });

    if (!access) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const product = await db.product.create({
      data: {
        businessId,
        name,
        sku,
        price: parseFloat(price),
        cost: parseFloat(cost || 0),
        category,
        description,
        status: "ACTIVE",
      },
      include: { inventory: true },
    });

    // Create inventory record
    await db.inventory.create({
      data: {
        businessId,
        productId: product.id,
        quantity: 0,
      },
    });

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
