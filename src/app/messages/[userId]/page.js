import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import ChatInterface from '@/components/messages/ChatInterface';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export const dynamic = 'force-dynamic';

export default async function ChatPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return <div style={{color:'white', padding:'2rem', textAlign:'center'}}>Lütfen giriş yapın.</div>;

  const chatPartnerId = params.userId;

  const partner = await prisma.user.findUnique({
    where: { id: chatPartnerId },
    select: { id: true, name: true, username: true, email: true, image: true }
  });

  if (!partner) return <div style={{color:'white', padding:'2rem', textAlign:'center'}}>Kullanıcı bulunamadı.</div>;

  const dbMessages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.user.id, receiverId: chatPartnerId },
        { senderId: chatPartnerId, receiverId: session.user.id }
      ]
    },
    orderBy: { createdAt: 'asc' }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: '2rem' }}>
      <div style={{ 
        padding: '0.5rem 1.5rem', 
        borderBottom: '1px solid var(--border-dark)', 
        position: 'sticky', 
        top: 0, 
        background: 'rgba(176, 38, 255, 0.15)', 
        backdropFilter: 'blur(12px)', 
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <Link href="/messages" style={{ color: 'var(--text-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', textDecoration: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={20} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-dark)', overflow: 'hidden' }}>
            {partner.image ? (
              <img src={partner.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                {partner.name ? partner.name[0].toUpperCase() : 'U'}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'white' }}>{partner.name}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{partner.username || `@${partner.email?.split('@')[0]}`}</span>
          </div>
        </div>
      </div>
      
      <ChatInterface initialMessages={dbMessages} currentUserId={session.user.id} partnerId={chatPartnerId} />
    </div>
  );
}
