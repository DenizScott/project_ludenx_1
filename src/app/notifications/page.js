import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Heart, MessageSquare, Repeat2, UserPlus, Radar } from 'lucide-react';
import Link from 'next/link';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div style={{color:'white', padding:'2rem', textAlign:'center'}}>Lütfen giriş yapın.</div>;
  }

  const notifications = await prisma.notification.findMany({
    where: { recipientId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      sender: { select: { name: true, username: true, email: true, image: true } },
    }
  });

  // Mark all as read when user visits the page
  await prisma.notification.updateMany({
    where: { recipientId: session.user.id, read: false },
    data: { read: true }
  });

  const getIcon = (type) => {
    switch (type) {
      case 'LIKE': return <Heart size={24} color="#f91880" fill="#f91880" />;
      case 'COMMENT': return <MessageSquare size={24} color="#1d9bf0" fill="#1d9bf0" />;
      case 'REPOST': return <Repeat2 size={24} color="#00ba7c" />;
      case 'FOLLOW': return <UserPlus size={24} color="var(--accent)" />;
      default: return <Radar size={24} color="var(--text-muted)" />;
    }
  };

  const getMessage = (type, name) => {
    switch (type) {
      case 'LIKE': return <span><b>{name}</b> gönderini beğendi.</span>;
      case 'COMMENT': return <span><b>{name}</b> gönderine yorum yaptı.</span>;
      case 'REPOST': return <span><b>{name}</b> gönderini yeniden paylaştı.</span>;
      case 'FOLLOW': return <span><b>{name}</b> seni takip etmeye başladı.</span>;
      default: return <span><b>{name}</b> seninle etkileşime geçti.</span>;
    }
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-dark)', fontSize: '1.2rem', fontWeight: 'bold', position: 'sticky', top: 0, background: 'rgba(176, 38, 255, 0.15)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
        Bildirimler
      </div>
      
      {notifications.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
          <Radar size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <p>Henüz bir bildiriminiz yok.</p>
        </div>
      ) : (
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map(notif => {
            const linkHref = notif.postId ? `/post/${notif.postId}` : `/@${notif.sender?.username?.replace('@', '') || notif.sender?.email?.split('@')[0]}`;
            return (
            <Link href={linkHref} key={notif.id} style={{ textDecoration: 'none' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '1rem', 
                padding: '1.5rem', 
                backgroundColor: notif.read ? 'var(--card-dark)' : 'rgba(176, 38, 255, 0.1)', 
                border: '1px solid var(--border-dark)', 
                borderRadius: '16px',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-dark)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = notif.read ? 'var(--card-dark)' : 'rgba(176, 38, 255, 0.1)'}>
                <div>{getIcon(notif.type)}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--border-dark)', overflow: 'hidden' }}>
                    {notif.sender.image ? (
                      <img src={notif.sender.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                        {notif.sender.name ? notif.sender.name[0].toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                  <div style={{ color: 'white', fontSize: '1.1rem' }}>
                    {getMessage(notif.type, notif.sender.name || 'Bir kullanıcı')}
                  </div>
                </div>
              </div>
            </Link>
          )})}
        </div>
      )}
    </div>
  );
}
