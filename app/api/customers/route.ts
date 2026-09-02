import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createCustomerSchema } from "@/lib/validators";
import { cookies } from "next/headers";

async function getSessionUser(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await db.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });

  if (!session || new Date() > session.expires) {
    return null;
  }

  return session.user;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters for filtering/pagination
    const searchParams = req.nextUrl.searchParams;
    const businessId = searchParams.get("businessId");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "50");

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
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const customers = await db.customer.findMany({
      where: { businessId },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });

    const total = await db.customer.count({
      where: { businessId },
    });

    return NextResponse.json({
      success: true,
      data: customers,
      meta: {
        total,
        skip,
        take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error("Get customers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
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
    const { businessId, ...customerData } = body;

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
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Validate input
    const validated = createCustomerSchema.parse(customerData);

    const customer = await db.customer.create({
      data: {
        ...validated,
        businessId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: customer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create customer error:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}

