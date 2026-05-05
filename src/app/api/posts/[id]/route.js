import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from '@prisma/client';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const { id } = params;
    
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: 'Gönderi bulunamadı.' }, { status: 404 });
    
    const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    const isOwner = currentUser?.username === '@denizscott' || currentUser?.username === 'denizscott' || currentUser?.email?.includes('denizscott');

    if (post.authorId !== session.user.id && !isOwner) return NextResponse.json({ error: 'Bu gönderiyi silemezsiniz.' }, { status: 403 });

    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ message: 'Gönderi silindi.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
