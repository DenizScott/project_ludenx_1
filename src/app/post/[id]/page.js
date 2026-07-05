import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PostCard from '@/components/feed/PostCard';
import { getDictionary } from '@/lib/i18n';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default async function SinglePostPage({ params }) {
  const dict = getDictionary();
  const session = await getServerSession(authOptions);

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { name: true, username: true, email: true, image: true } },
      likes: true,
      comments: {
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true, username: true, email: true, image: true } } }
      }
    }
  });

  if (!post) {
    return <div style={{padding:'2rem', color:'white', textAlign:'center'}}>Gönderi bulunamadı veya silinmiş.</div>;
  }

  let dbUser = null;
  if (session?.user?.id) {
    dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  }

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div style={{ 
        padding: '0.5rem 1.5rem', 
        borderBottom: '1px solid rgba(105, 228, 255, 0.12)', 
        fontSize: '1.2rem', 
        fontWeight: 'bold',
        position: 'sticky', 
        top: 0, 
        background: 'rgba(14, 17, 23, 0.86)', 
        backdropFilter: 'blur(16px)', 
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <Link href="/feed" style={{ color: 'var(--text-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', textDecoration: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={20} />
        </Link>
        Fikir
      </div>
      <PostCard post={post} currentUser={dbUser} dict={dict} autoShowComments={true} />
    </div>
  );
}
