import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from '@prisma/client';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekiyor.' }, { status: 401 });
    }

    const { reason, details, postId, reportedUserId } = await request.json();

    if (!reason) {
      return NextResponse.json({ error: 'Şikayet sebebi belirtilmeli.' }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        reason,
        details: details || null,
        status: "PENDING",
        postId: postId || null,
        reportedUserId: reportedUserId || null,
        reporterId: session.user.id
      }
    });

    if (postId) {
      await prisma.post.update({
        where: { id: postId },
        data: { isFlagged: true, flagReason: `Kullanıcı Şikayeti: ${reason}` }
      }).catch(() => {});
    }

    return NextResponse.json({ message: 'Şikayetiniz iletildi.', report }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
