import Link from 'next/link';
import { Fingerprint, Gamepad2, Network, Radar, Search, Telescope } from 'lucide-react';
import styles from './SidebarNav.module.css';
import trDict from '@/lib/dictionaries/tr.json';
import BrandMark from './BrandMark';

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
    </nav>
  );
}
