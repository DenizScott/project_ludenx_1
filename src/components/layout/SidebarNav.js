import Link from 'next/link';
import { Gamepad2, Telescope, Radar, MessageSquareDashed, Network, Fingerprint } from 'lucide-react';
import styles from './SidebarNav.module.css';
import { getDictionary } from '@/lib/i18n';

export default function SidebarNav() {
  const dict = getDictionary();
  
  const navItems = [
    { name: dict.sidebar.home, href: '/feed', icon: Gamepad2 },
    { name: dict.sidebar.explore, href: '/explore', icon: Telescope },
    { name: dict.sidebar.notifications, href: '/notifications', icon: Radar },
    { name: dict.sidebar.messages, href: '/messages', icon: MessageSquareDashed },
    { name: dict.sidebar.following, href: '/following', icon: Network },
    { name: dict.sidebar.profile, href: '/profile', icon: Fingerprint },
  ];

  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>
        Ludenx
      </div>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.name} className={styles.navItem}>
            <Link href={item.href} className={styles.navLink}>
              <item.icon className={styles.icon} size={26} />
              <span className={styles.label}>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      <button className={styles.postButton}>{dict.sidebar.post}</button>
    </nav>
  );
}
