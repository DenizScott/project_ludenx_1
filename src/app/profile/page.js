import styles from './profile.module.css';
import { getDictionary } from '@/lib/i18n';
import PostCard from '@/components/feed/PostCard';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CalendarDays, ArrowLeft, Crown, Ban } from 'lucide-react';
import EditProfileModal from '@/components/profile/EditProfileModal';
import BanUserButton from '@/components/profile/BanUserButton';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const dict = getDictionary();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div style={{color:'white', padding:'2rem'}}>Lütfen giriş yapın.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      posts: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { name: true, username: true, email: true, image: true } },
          comments: {
            orderBy: { createdAt: 'desc' },
            include: { author: { select: { name: true, username: true, email: true, image: true } } }
          }
        }
      }
    }
  });

  if (!user) return <div style={{color:'white', padding:'2rem'}}>Kullanıcı bulunamadı.</div>;

  const joinedDate = new Date(user.createdAt).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
  const isOwner = user.username === '@denizscott' || user.username === 'denizscott' || user.email?.includes('denizscott');
  const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  const isCurrentUserOwner = currentUser?.username === '@denizscott' || currentUser?.username === 'denizscott' || currentUser?.email?.includes('denizscott');

  return (
    <div className={styles.profileContainer}>
      {/* Profil Üst Başlığı (Geri Butonu) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.65rem 1.5rem', position: 'sticky', top: 0, background: 'rgba(14, 17, 23, 0.86)', backdropFilter: 'blur(16px)', zIndex: 10, borderBottom: '1px solid rgba(105, 228, 255, 0.12)' }}>
        <a href="/feed" style={{ color: 'var(--text-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', textDecoration: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={20} />
        </a>
        <div>
          <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-dark)', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            {user.name}
            {isOwner && (
              <span title="Owner of LudenX" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#e0245e', color: 'white', borderRadius: '50%', width: '18px', height: '18px', marginLeft: '6px', cursor: 'default' }}>
                <Crown size={12} strokeWidth={3} />
              </span>
            )}
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.posts.length} devlog</span>
        </div>
      </div>

      <div className={styles.header}>
        <div className={styles.coverPhoto}></div>
        <div className={styles.avatarWrapper}>
           {user.image ? (
             <img src={user.image} alt="Profil" className={styles.avatar} />
           ) : (
             <div className={styles.avatarPlaceholder}>{user.name ? user.name[0].toUpperCase() : 'U'}</div>
           )}
        </div>
      </div>
      
      <div className={styles.infoSection}>
        <div className={styles.actionRow} style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
           {isCurrentUserOwner && user.id !== session.user.id && (
             <BanUserButton targetUserId={user.id} isCurrentlyBanned={user.isBanned} />
           )}
           {user.id === session.user.id ? (
             <EditProfileModal user={user} />
           ) : (
             <button style={{ padding: '0.65rem 1rem', borderRadius: '10px', background: 'var(--accent)', color: '#081018', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Ekibe al</button>
           )}
        </div>
        
        <div className={styles.userDetails}>
          <h1 className={styles.name}>{user.name}</h1>
          <p className={styles.username} style={{ display: 'flex', alignItems: 'center' }}>
            {user.username || `@${user.email.split('@')[0]}`}
            {isOwner && (
              <span title="Owner of LudenX" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#e0245e', color: 'white', borderRadius: '50%', width: '20px', height: '20px', marginLeft: '6px', cursor: 'default' }}>
                <Crown size={12} strokeWidth={3} />
              </span>
            )}
          </p>
          
          <p className={styles.bio}>{user.bio || 'Henüz bir biyografi eklenmedi.'}</p>
          
          <div className={styles.joinDate}>
            <CalendarDays size={16} />
            <span>{joinedDate} tarihinde katıldı</span>
          </div>
          
          <div className={styles.stats}>
             <div className={styles.stat}><span className={styles.statCount}>0</span> Ağ</div>
             <div className={styles.stat}><span className={styles.statCount}>0</span> Takım</div>
          </div>
        </div>
      </div>
      
      <div className={styles.tabs}>
        <div className={`${styles.tab} ${styles.activeTab}`}>Devloglar</div>
        <div className={styles.tab}>Yanitlar</div>
        <div className={styles.tab}>Medya</div>
        <div className={styles.tab}>Tepkiler</div>
      </div>

      <div className={styles.postsSection}>
        {user.posts.length === 0 ? (
          <p style={{ color: '#8892B0', textAlign: 'center', marginTop: '2rem' }}>Henüz bir gönderi yok.</p>
        ) : (
          user.posts.map(post => (
            <PostCard key={post.id} post={post} currentUser={currentUser} dict={dict} />
          ))
        )}
      </div>
    </div>
  );
}
