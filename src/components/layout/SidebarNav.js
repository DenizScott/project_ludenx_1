import Link from 'next/link';
import { Fingerprint, Gamepad2, Network, Radar, Search, Telescope } from 'lucide-react';
import styles from './SidebarNav.module.css';
import trDict from '@/lib/dictionaries/tr.json';
import BrandMark from './BrandMark';
import ProfileMoreMenu from '@/components/profile/ProfileMoreMenu';

export default function SidebarNav({ currentUser, dict = trDict }) {
  const navItems = [
    { id: 'home', name: dict?.sidebar?.home || 'Akış', href: '/feed', icon: Gamepad2 },
    { id: 'search', name: 'Ara', href: '/explore', icon: Search, desktopHide: true },
    { id: 'explore', name: dict?.sidebar?.explore || 'Keşfet', href: '/explore', icon: Telescope, mobileHide: true },
    { id: 'notifications', name: dict?.sidebar?.notifications || 'Bildirimler', href: '/notifications', icon: Radar },
    { id: 'following', name: dict?.sidebar?.following || 'Takip Edilenler', href: '/following', icon: Network, mobileHide: true },
  ];

  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>
        <BrandMark size={34} />
      </div>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.id} className={`${styles.navItem} ${item.mobileHide ? styles.mobileHide : ''} ${item.desktopHide ? styles.desktopHide : ''}`}>
            <Link href={item.href} prefetch={true} className={styles.navLink}>
              <item.icon className={styles.icon} size={24} />
              <span className={styles.label}>{item.name}</span>
            </Link>
          </li>
        ))}
        <li className={`${styles.navItem} ${styles.mobileHide}`}>
          <Link href={currentUser ? `/@${currentUser.username?.replace('@', '') || currentUser.email?.split('@')[0]}` : '/profile'} prefetch={true} className={styles.navLink}>
            {currentUser?.image ? (
              <img src={currentUser.image} alt="Profile" style={{ width: 28, height: 28, borderRadius: '10px', objectFit: 'cover' }} className={styles.icon} />
            ) : (
              <Fingerprint className={styles.icon} size={24} />
            )}
            <span className={styles.label}>{dict?.sidebar?.profile || 'Profil'}</span>
          </Link>
        </li>
      </ul>
      {currentUser && <button className={styles.postButton}>{dict?.sidebar?.post || 'Fikir Yayınla'}</button>}

      {currentUser && (
        <div className={styles.mobileHide} style={{ marginTop: 'auto', padding: '0.65rem 0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(105, 228, 255, 0.12)', transition: 'background 0.2s' }}>
          <Link href={`/@${currentUser.username?.replace('@', '') || currentUser.email?.split('@')[0]}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', overflow: 'hidden', flex: 1 }}>
            {currentUser.image ? (
              <img src={currentUser.image} alt="Avatar" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(105, 228, 255, 0.3)' }} />
            ) : (
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--panel-raised)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: '1.1rem', border: '1px solid rgba(105, 228, 255, 0.3)' }}>
                {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
              </div>
            )}
            <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', lineHeight: '1.2' }}>{currentUser.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {currentUser.username?.startsWith('@') ? currentUser.username : `@${currentUser.username || currentUser.email?.split('@')[0]}`}
              </span>
            </div>
          </Link>
          <div style={{ marginLeft: '0.4rem', flexShrink: 0 }}>
            <ProfileMoreMenu user={currentUser} direction="up" />
          </div>
        </div>
      )}
    </nav>
  );
}

