import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDictionary } from '@/lib/i18n';
import ExploreClient from './ExploreClient';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export const dynamic = 'force-dynamic';

export default async function ExplorePage() {
  const dict = getDictionary();
  const session = await getServerSession(authOptions);
  let dbUser = null;
  if (session?.user?.id) {
    dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  }

  // Fetch posts from the last 30 days to populate daily, weekly, and monthly tabs
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dbPosts = await prisma.post.findMany({
    take: 50,
    where: {
      createdAt: { gte: thirtyDaysAgo }
    },
    include: {
      author: { select: { name: true, username: true, email: true, image: true } },
      likes: true,
      comments: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true, username: true, email: true, image: true } } }
      }
    }
  });

  return (
    <div>
      <ExploreClient initialPosts={dbPosts} currentUser={dbUser} dict={dict} />
    </div>
  );
}
