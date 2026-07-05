import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FeedListClient from '@/components/feed/FeedListClient';
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
    take: 20,
    where: { authorId: { in: followingIds } },
    orderBy: { createdAt: 'desc' },
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
    <div style={{ paddingBottom: '4rem' }}>
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(105, 228, 255, 0.12)', fontSize: '1.2rem', fontWeight: 'bold', position: 'sticky', top: 0, background: 'rgba(14, 17, 23, 0.86)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', transform: 'translateZ(0)', zIndex: 10 }}>
        Takip Edilenler
      </div>
      {dbPosts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)', backgroundColor: 'var(--card-dark)', border: '1px solid rgba(105, 228, 255, 0.16)', borderRadius: '12px', margin: '2rem 1.5rem' }}>
          <h3 style={{ color: 'white', marginBottom: '0.75rem', fontSize: '1.4rem' }}>Henüz takip ettiğin kişilerden paylaşım yok!</h3>
          <p style={{ maxWidth: '450px', margin: '0 auto 1.5rem', lineHeight: '1.5' }}>
            {followingIds.length === 0 
              ? "Akışında içerik görebilmek için topluluktaki geliştirici ve tasarımcıları takip etmeye başla."
              : "Takip ettiğin kişiler henüz fikir paylaşmamış. Keşfet'e gidip yeni kişiler bulabilir veya ilk fikrini paylaşabilirsin!"}
          </p>
          <a href="/explore" style={{ display: 'inline-block', padding: '0.8rem 2rem', background: 'var(--accent)', color: '#081018', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>Keşfet&apos;e Göz At</a>
        </div>
      ) : (
        <FeedListClient initialPosts={dbPosts} currentUser={dbUser} dict={dict} queryKey={['posts', 'following']} />
      )}
    </div>
  );
}
