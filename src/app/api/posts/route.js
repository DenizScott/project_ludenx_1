import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from '@prisma/client';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekiyor.' }, { status: 401 });
    }

    const { content, mediaUrl } = await request.json();

    if ((!content || content.trim().length === 0) && !mediaUrl) {
      return NextResponse.json({ error: 'Gönderi içeriği boş olamaz.' }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        content: content || "",
        mediaUrl: mediaUrl || null,
        authorId: session.user.id
      }
    });

    return NextResponse.json({ message: 'Başarıyla paylaşıldı!', post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
