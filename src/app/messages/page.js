import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from 'next/link';
import { MessageSquareDashed } from 'lucide-react';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div style={{color:'white', padding:'2rem', textAlign:'center'}}>Lütfen giriş yapın.</div>;
  }

  // Find all users except current user to start a chat with
  const users = await prisma.user.findMany({
    where: { id: { not: session.user.id } },
    select: { id: true, name: true, username: true, email: true, image: true },
    take: 50 // Limit to 50 for now
  });

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-dark)', fontSize: '1.2rem', fontWeight: 'bold', position: 'sticky', top: 0, background: 'rgba(176, 38, 255, 0.15)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
        Mesajlar
      </div>
      
      <div style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>
        <p style={{ marginBottom: '1.5rem' }}>Mesajlaşmak istediğin kullanıcıyı seç:</p>
        
        {users.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <MessageSquareDashed size={48} style={{ opacity: 0.5, marginBottom: '1rem', margin: '0 auto' }} />
            <p>Platformda başka kullanıcı bulunamadı.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {users.map(user => (
              <Link key={user.id} href={`/messages/${user.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '1rem 1.5rem', 
                  backgroundColor: 'var(--card-dark)', 
                  border: '1px solid var(--border-dark)', 
                  borderRadius: '16px',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer'
                }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-dark)', overflow: 'hidden', flexShrink: 0 }}>
                    {user.image ? (
                      <img src={user.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                        {user.name ? user.name[0].toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: 'white' }}>{user.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.username || `@${user.email?.split('@')[0]}`}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
