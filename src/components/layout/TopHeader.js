"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './TopHeader.module.css';
import { Fingerprint, Search } from 'lucide-react';
import BrandMark from './BrandMark';

export default function TopHeader({ currentUser }) {
  const pathname = usePathname();
  const isFeed = pathname === '/feed' || pathname === '/following';
  const isExplore = pathname === '/explore';

  return (
    <header className={styles.header}>
      <div className={styles.mobileTopRow}>
        <Link href={currentUser ? `/@${currentUser.username?.replace('@', '') || currentUser.email?.split('@')[0]}` : '/profile'} prefetch={true} className={styles.profileLink}>
          {currentUser?.image ? (
            <img src={currentUser.image} alt="Profile" className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}><Fingerprint size={18} /></div>
          )}
        </Link>
        <BrandMark size={26} className={styles.logo} />
        <div className={styles.headerSpacer} />
      </div>

      {isExplore && (
        <div className={styles.mobileSearchWrap}>
          <div className={styles.mobileSearch}>
            <Search size={18} />
            <input type="text" placeholder="Ara" />
          </div>
        </div>
      )}

      {isFeed && (
        <div className={styles.tabsRow}>
          <Link href="/feed" prefetch={true} className={`${styles.tab} ${pathname === '/feed' ? styles.activeTab : ''}`}>
            Akış
          </Link>
          <Link href="/following" prefetch={true} className={`${styles.tab} ${pathname === '/following' ? styles.activeTab : ''}`}>
            Takip Edilenler
          </Link>
        </div>
      )}
    </header>
  );
}
