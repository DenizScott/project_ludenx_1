import Link from 'next/link';
import { Gamepad2, Telescope, Radar, Network, Fingerprint, Search } from 'lucide-react';
import styles from './SidebarNav.module.css';
import { getDictionary } from '@/lib/i18n';

export default function SidebarNav({ currentUser }) {
  const dict = getDictionary();
  
  const navItems = [
    { id: 'home', name: dict.sidebar.home, href: '/feed', icon: Gamepad2 },
    { id: 'search', name: 'Arama', href: '/explore', icon: Search, desktopHide: true },
    { id: 'explore', name: dict.sidebar.explore, href: '/explore', icon: Telescope, mobileHide: true },
    { id: 'notifications', name: dict.sidebar.notifications, href: '/notifications', icon: Radar },

    { id: 'following', name: dict.sidebar.following, href: '/following', icon: Network, mobileHide: true },
  ];

  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>
        Luden
        <svg width="32" height="32" viewBox="0 0 100 100" style={{ marginLeft: '6px', transform: 'translateY(4px)' }}>
          <defs>
            <linearGradient id="codeXGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
          </defs>
          <g filter="drop-shadow(0px 0px 8px rgba(176,38,255,0.6))">
            {/* Sol Kod Ayracı (>) */}
            <path d="M 15 15 L 60 50 L 15 85" stroke="url(#codeXGrad)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Sağ Kod Ayracı (<) */}
            <path d="M 85 15 L 40 50 L 85 85" stroke="url(#codeXGrad)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.85" />
            {/* Alt Terminal İmleci */}
            <rect x="40" y="90" width="20" height="8" rx="4" fill="var(--accent)" />
          </g>
        </svg>
      </div>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.id} className={`${styles.navItem} ${item.mobileHide ? styles.mobileHide : ''} ${item.desktopHide ? styles.desktopHide : ''}`}>
            <Link href={item.href} className={styles.navLink}>
              <item.icon className={styles.icon} size={26} />
              <span className={styles.label}>{item.name}</span>
            </Link>
          </li>
        ))}
        {/* Profile Link with Avatar */}
        <li className={`${styles.navItem} ${styles.mobileHide}`}>
          <Link href={currentUser ? `/@${currentUser.username?.replace('@', '') || currentUser.email?.split('@')[0]}` : '/profile'} className={styles.navLink}>
            {currentUser?.image ? (
              <img src={currentUser.image} alt="Profile" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} className={styles.icon} />
            ) : (
              <Fingerprint className={styles.icon} size={28} />
            )}
            <span className={styles.label}>{dict.sidebar.profile}</span>
          </Link>
        </li>
      </ul>
      {currentUser && <button className={styles.postButton}>{dict.sidebar.post}</button>}
    </nav>
  );
}
