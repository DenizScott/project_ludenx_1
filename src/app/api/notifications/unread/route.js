import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from '@prisma/client';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ count: 0 }, { status: 401 });

    const userId = session.user.id;

    const count = await prisma.notification.count({
      where: { recipientId: userId, read: false }
    });

    const latest = await prisma.notification.findFirst({
      where: { recipientId: userId, read: false },
      orderBy: { createdAt: 'desc' },
      include: { sender: { select: { name: true } } }
    });

    return NextResponse.json({ count, latest }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
