import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export const dynamic = 'force-dynamic';

function checkMasterAuth() {
  const cookieStore = cookies();
  const auth = cookieStore.get('ludenos_master_auth');
  return auth?.value === 'verified_master_owner';
}

export async function POST(request) {
  try {
    if (!checkMasterAuth()) {
      return NextResponse.json({ error: 'Master yetkisi reddedildi.' }, { status: 403 });
    }

    const { action, payload } = await request.json();

    if (action === 'add_word') {
      const { keyword, severity } = payload;
      if (!keyword) return NextResponse.json({ error: 'Kelime girilmedi.' }, { status: 400 });
      const word = await prisma.wordFilter.upsert({
        where: { keyword: keyword.trim().toLowerCase() },
        update: { severity: severity || 'HIGH' },
        create: { keyword: keyword.trim().toLowerCase(), severity: severity || 'HIGH' }
      });
      return NextResponse.json({ success: true, word });
    }

    if (action === 'delete_word') {
      const { id } = payload;
      await prisma.wordFilter.delete({ where: { id } }).catch(() => {});
      return NextResponse.json({ success: true });
    }

    if (action === 'resolve_report') {
      const { reportId, status } = payload;
      await prisma.report.update({
        where: { id: reportId },
        data: { status: status || 'RESOLVED' }
      }).catch(() => {});
      return NextResponse.json({ success: true });
    }

    if (action === 'delete_post_master') {
      const { postId } = payload;
      await prisma.post.delete({ where: { id: postId } }).catch(() => {});
      return NextResponse.json({ success: true });
    }

    if (action === 'ban_user_master') {
      const { userId, banStatus } = payload;
      await prisma.user.update({
        where: { id: userId },
        data: { isBanned: banStatus }
      }).catch(() => {});
      return NextResponse.json({ success: true });
    }

    if (action === 'delete_user_master') {
      const { userId } = payload;
      await prisma.user.delete({ where: { id: userId } }).catch(() => {});
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Bilinmeyen işlem.' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
