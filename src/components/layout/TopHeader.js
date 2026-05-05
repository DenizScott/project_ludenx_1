"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './TopHeader.module.css';
import { Fingerprint, Search } from 'lucide-react';

export default function TopHeader({ currentUser }) {
  const pathname = usePathname();
  const isFeed = pathname === '/feed' || pathname === '/following';
  const isExplore = pathname === '/explore';

  return (
    <header className={styles.header}>
      {/* Sadece mobilde gözüken üst logo ve profil barı */}
      <div className={styles.mobileTopRow}>
        <Link href={currentUser ? `/@${currentUser.username?.replace('@', '') || currentUser.email?.split('@')[0]}` : '/profile'} className={styles.profileLink}>
          {currentUser?.image ? (
            <img src={currentUser.image} alt="Profile" className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}><Fingerprint size={20} /></div>
          )}
        </Link>
        <div className={styles.logo} style={{ display: 'flex', alignItems: 'center' }}>
          Luden
          <svg width="24" height="24" viewBox="0 0 100 100" style={{ marginLeft: '4px', transform: 'translateY(2px)' }}>
            <defs>
              <linearGradient id="codeXGradMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent)" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
            </defs>
            <path d="M 15 15 L 60 50 L 15 85" stroke="url(#codeXGradMobile)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 85 15 L 40 50 L 85 85" stroke="url(#codeXGradMobile)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.85" />
            <rect x="40" y="90" width="20" height="8" rx="4" fill="var(--accent)" />
          </svg>
        </div>
        <div style={{ width: 32 }}></div> {/* Sağ tarafı dengelemek için boşluk */}
      </div>

      {/* Arama sayfasıysa arama çubuğu göster */}
      {isExplore && (
        <div style={{ padding: '0 1rem 1rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--card-dark)', borderRadius: '20px', padding: '0.5rem 1rem', border: '1px solid var(--border-dark)' }}>
            <Search size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
            <input type="text" placeholder="LudenX'te Ara..." style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }} />
          </div>
        </div>
      )}

      {/* Sadece Feed ve Following sayfalarında sekmeleri göster */}
      {isFeed && (
        <div className={styles.tabsRow}>
          <Link href="/feed" className={`${styles.tab} ${pathname === '/feed' ? styles.activeTab : ''}`} style={{ textDecoration: 'none' }}>
            <span style={{ color: pathname === '/feed' ? 'white' : 'var(--text-muted)' }}>Sana Özel</span>
            {pathname === '/feed' && <div className={styles.activeIndicator}></div>}
          </Link>
          <Link href="/following" className={`${styles.tab} ${pathname === '/following' ? styles.activeTab : ''}`} style={{ textDecoration: 'none' }}>
            <span style={{ color: pathname === '/following' ? 'white' : 'var(--text-muted)' }}>Takip Edilenler</span>
            {pathname === '/following' && <div className={styles.activeIndicator}></div>}
          </Link>
        </div>
      )}
    </header>
  );
}
