import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export async function getSessionUser(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get('session_token')?.value;
    if (!sessionToken) {
      return null;
    }

    const session = await db.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    return session?.user || null;
  } catch (error) {
    console.error('Get session user error:', error);
    return null;
  }
}
