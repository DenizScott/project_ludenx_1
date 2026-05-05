import styles from './feed.module.css';
import { getDictionary } from '@/lib/i18n';
import CreatePost from '@/components/feed/CreatePost';
import PostCard from '@/components/feed/PostCard';
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
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { name: true, username: true, email: true, image: true }
      },
      likes: true,
      comments: {
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
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--card-dark)', border: '1px solid var(--border-dark)', borderRadius: '16px', margin: '1.5rem 1.5rem 2rem 1.5rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.5rem' }}>Sohbete katıl!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Ludenx'teki tartışmalara katılmak için giriş yap veya kayıt ol.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="/login" style={{ padding: '0.8rem 2rem', background: 'var(--accent)', color: 'white', borderRadius: '9999px', textDecoration: 'none', fontWeight: 'bold' }}>Giriş Yap</a>
            <a href="/login" style={{ padding: '0.8rem 2rem', background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: '9999px', textDecoration: 'none', fontWeight: 'bold' }}>Kayıt Ol</a>
          </div>
        </div>
      )}

      {dbPosts.length === 0 ? (
        <p style={{ color: '#8892B0', textAlign: 'center', marginTop: '2rem' }}>Henüz bir gönderi yok. İlk paylaşan sen ol!</p>
      ) : (
        dbPosts.map(post => (
          <PostCard key={post.id} post={post} currentUser={dbUser} dict={dict} />
        ))
      )}
    </div>
  );
}
