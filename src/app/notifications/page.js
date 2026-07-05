import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
    take: 30,
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
      <div style={{ padding: '1rem 1.5rem', fontSize: '1.2rem', fontWeight: 'bold', position: 'sticky', top: 0, background: 'rgba(14, 17, 23, 0.86)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', transform: 'translateZ(0)', zIndex: 10, borderBottom: '1px solid rgba(105, 228, 255, 0.12)' }}>
        Kontrol Odası
      </div>
      <NotificationTabsClient notifications={notifications} />
    </div>
  );
}
