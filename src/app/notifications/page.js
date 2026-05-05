import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { Heart, MessageSquare, Repeat2, UserPlus, Radar } from 'lucide-react';
import NotificationTabsClient from './NotificationTabsClient';

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

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div style={{ padding: '1rem 1.5rem', fontSize: '1.2rem', fontWeight: 'bold', position: 'sticky', top: 0, background: 'rgba(176, 38, 255, 0.15)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
        Bildirimler
      </div>
      <NotificationTabsClient notifications={notifications} />
    </div>
  );
}
