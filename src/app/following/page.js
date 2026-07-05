import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PostCard from '@/components/feed/PostCard';
import { getDictionary } from '@/lib/i18n';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export const dynamic = 'force-dynamic';

export default async function FollowingPage() {
  const dict = getDictionary();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div style={{color:'white', padding:'2rem', textAlign:'center'}}>Lütfen giriş yapın.</div>;
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { following: true }
  });

  const followingIds = dbUser?.following.map(f => f.followingId) || [];

  const dbPosts = await prisma.post.findMany({
    where: { authorId: { in: followingIds } },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true, username: true, email: true, image: true } },
      likes: true,
      comments: {
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true, username: true, email: true, image: true } } }
      }
    }
  });

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(105, 228, 255, 0.12)', fontSize: '1.2rem', fontWeight: 'bold', position: 'sticky', top: 0, background: 'rgba(14, 17, 23, 0.86)', backdropFilter: 'blur(16px)', zIndex: 10 }}>
        Takımım
      </div>
      {dbPosts.length === 0 ? (
        <p style={{ color: '#8892B0', textAlign: 'center', marginTop: '2rem' }}>Ekibindeki kişilerin henüz bir devlog'u yok veya kimseyi ekibe almadın.</p>
      ) : (
        dbPosts.map(post => (
          <PostCard key={post.id} post={post} currentUser={dbUser} dict={dict} />
        ))
      )}
    </div>
  );
}
