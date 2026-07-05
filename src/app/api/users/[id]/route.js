import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from '@prisma/client';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    if (session.user.role !== 'ADMIN') {
      const currentUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
      if (!currentUser || currentUser.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Bu işlemi gerçekleştirmek için yönetici (ADMIN) yetkisine sahip olmalısınız.' }, { status: 403 });
      }
    }

    const { id } = params;

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Kullanıcı silindi' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Hata oluştu' }, { status: 500 });
  }
}
