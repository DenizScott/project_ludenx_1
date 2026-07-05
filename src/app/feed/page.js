import styles from './feed.module.css';
import { getDictionary } from '@/lib/i18n';
import CreatePost from '@/components/feed/CreatePost';
import FeedListClient from '@/components/feed/FeedListClient';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export const dynamic = 'force-dynamic';

export default async function FeedPage() {
  const dict = getDictionary();
  const session = await getServerSession(authOptions);
  let dbUser = null;
  if (session?.user?.id) {
    dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  }

  const dbPosts = await prisma.post.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { name: true, username: true, email: true, image: true }
      },
      likes: true,
      comments: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { name: true, username: true, email: true, image: true } }
        }
      }
    }
  });

  return (
    <div className={styles.feedContainer}>
      {session?.user ? (
        <CreatePost dict={dict} currentUser={dbUser} />
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--card-dark)', border: '1px solid rgba(105, 228, 255, 0.16)', borderRadius: '12px', margin: '1.5rem 1.5rem 2rem 1.5rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.5rem' }}>Fikir merkezine katıl!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>LudenOS&apos;teki fikir paylaşımına katılmak için giriş yap veya kayıt ol.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="/login" style={{ padding: '0.8rem 2rem', background: 'var(--accent)', color: '#081018', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>Giriş Yap</a>
            <a href="/login" style={{ padding: '0.8rem 2rem', background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>Kayıt Ol</a>
          </div>
        </div>
      )}

      <FeedListClient initialPosts={dbPosts} currentUser={dbUser} dict={dict} queryKey={['posts', 'feed']} />
    </div>
  );
}
