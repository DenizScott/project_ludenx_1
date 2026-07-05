import styles from '@/app/profile/profile.module.css';
import { getDictionary } from '@/lib/i18n';
import PostCard from '@/components/feed/PostCard';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CalendarDays, ArrowLeft } from 'lucide-react';
import EditProfileModal from '@/components/profile/EditProfileModal';
import FollowButton from '@/components/profile/FollowButton';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileTabs from '@/components/profile/ProfileTabs';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export const dynamic = 'force-dynamic';

export default async function UserProfilePage({ params }) {
  const dict = getDictionary();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div style={{color:'white', padding:'2rem'}}>Lütfen giriş yapın.</div>;
  }

  const rawUsername = decodeURIComponent(params.username);
  
  // Try to find user by username or email prefix
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: rawUsername },
        { username: rawUsername.replace('@', '') },
        { email: { startsWith: rawUsername.replace('@', '') + '@' } }
      ]
    },
    include: {
      followers: { include: { follower: { select: { id: true, name: true, username: true, email: true, image: true } } } },
      following: { include: { following: { select: { id: true, name: true, username: true, email: true, image: true } } } },
      posts: {
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, username: true, email: true, image: true } },
          likes: true,
          comments: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { author: { select: { id: true, name: true, username: true, email: true, image: true } } }
          }
        }
      },
      comments: {
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          post: {
            include: {
              author: { select: { id: true, name: true, username: true, email: true, image: true } },
              likes: true,
              comments: {
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { author: { select: { id: true, name: true, username: true, email: true, image: true } } }
              }
            }
          }
        }
      },
      likes: {
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          post: {
            include: {
              author: { select: { id: true, name: true, username: true, email: true, image: true } },
              likes: true,
              comments: {
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { author: { select: { id: true, name: true, username: true, email: true, image: true } } }
              }
            }
          }
        }
      }
    }
  });

  if (!user) return <div style={{color:'white', padding:'2rem'}}>Kullanıcı bulunamadı.</div>;

  const joinedDate = new Date(user.createdAt).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
  
  const currentUser = user.id === session.user.id ? user : (await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, role: true } }));

  let isFollowing = false;
  if (session?.user?.id && session.user.id !== user.id) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: user.id
        }
      }
    });
    isFollowing = !!follow;
  }

  return (
    <div className={styles.profileContainer}>
      {/* Profil Üst Başlığı (Geri Butonu) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.65rem 1.5rem', position: 'sticky', top: 0, background: 'rgba(14, 17, 23, 0.86)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', transform: 'translateZ(0)', zIndex: 10, borderBottom: '1px solid rgba(105, 228, 255, 0.12)' }}>
        <a href="/feed" style={{ color: 'var(--text-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', textDecoration: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={20} />
        </a>
        <div>
          <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-dark)', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            {user.name}
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.posts.length} fikir</span>
        </div>
      </div>

      <div className={styles.header}>
        <div className={styles.coverPhoto}>
          {user.bannerImage && (
            <img src={user.bannerImage} alt="Kapak Fotoğrafı" className={styles.coverPhotoBanner} />
          )}
        </div>
        <div className={styles.avatarWrapper}>
           {user.image ? (
             <img src={user.image} alt="Profil" className={styles.avatar} />
           ) : (
             <div className={styles.avatarPlaceholder}>{user.name ? user.name[0].toUpperCase() : 'U'}</div>
           )}
        </div>
      </div>
      
      <div className={styles.infoSection}>
        <div className={styles.actionRow} style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', alignItems: 'center' }}>
           {user.id === session.user.id ? (
             <EditProfileModal user={user} />
           ) : (
             <FollowButton targetUserId={user.id} isCurrentlyFollowing={isFollowing} />
           )}
        </div>
        
        <div className={styles.userDetails}>
          <h1 className={styles.name}>{user.name}</h1>
          <p className={styles.username} style={{ display: 'flex', alignItems: 'center' }}>
            {user.username || `@${user.email.split('@')[0]}`}
          </p>
          
          <p className={styles.bio}>{user.bio || 'Henüz bir biyografi eklenmedi.'}</p>
          
          <div className={styles.joinDate}>
            <CalendarDays size={16} />
            <span>{joinedDate} tarihinde katıldı</span>
          </div>
          
          <ProfileStats user={user} currentUserId={session.user.id} />
        </div>
      </div>
      
      <ProfileTabs user={user} currentUser={currentUser} dict={dict} />
    </div>
  );
}
