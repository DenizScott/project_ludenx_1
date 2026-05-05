import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from '@prisma/client';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const { content } = await request.json();
    if (!content?.trim()) return NextResponse.json({ error: 'Boş olamaz' }, { status: 400 });

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: params.id,
        authorId: session.user.id
      },
      include: { author: { select: { name: true, username: true, image: true } } }
    });

    // Create notification for post author
    const post = await prisma.post.findUnique({ where: { id: params.id }, select: { authorId: true } });
    if (post && post.authorId !== session.user.id) {
      await prisma.notification.create({
        data: {
          type: 'COMMENT',
          recipientId: post.authorId,
          senderId: session.user.id,
          postId: params.id
        }
      });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Hata' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');
    if (!commentId) return NextResponse.json({ error: 'Yorum ID eksik' }, { status: 400 });

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return NextResponse.json({ error: 'Yorum bulunamadı' }, { status: 404 });

    const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    const isOwner = currentUser?.username === '@denizscott' || currentUser?.username === 'denizscott' || currentUser?.email?.includes('denizscott');

    if (comment.authorId !== session.user.id && !isOwner) {
      return NextResponse.json({ error: 'Yetkisiz işlem' }, { status: 403 });
    }

    await prisma.comment.delete({ where: { id: commentId } });
    return NextResponse.json({ message: 'Silindi' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Hata' }, { status: 500 });
  }
}
