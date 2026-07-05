import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import SystemHQClient from './SystemHQClient';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export const dynamic = 'force-dynamic';

export default async function SystemHQPage() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('ludenos_master_auth');
  const initialAuth = authCookie?.value === 'verified_master_owner';

  const words = await prisma.wordFilter.findMany({ orderBy: { createdAt: 'desc' } });
  
  const flaggedPosts = await prisma.post.findMany({
    where: { isFlagged: true },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, name: true, username: true, email: true, image: true } }
    }
  });

  const reports = await prisma.report.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: 'desc' },
    include: {
      post: {
        include: {
          author: { select: { id: true, name: true, username: true, email: true } }
        }
      }
    }
  });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, name: true, username: true, email: true, image: true, isBanned: true, role: true
    }
  });

  const posts = await prisma.post.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, name: true, username: true, email: true } }
    }
  });

  return (
    <SystemHQClient
      initialAuth={initialAuth}
      initialWords={words}
      initialFlaggedPosts={flaggedPosts}
      initialReports={reports}
      initialUsers={users}
      initialPosts={posts}
    />
  );
}
