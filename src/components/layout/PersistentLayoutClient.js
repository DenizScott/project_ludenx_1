"use client";
import React, { memo } from 'react';
import { useSelectedLayoutSegments, usePathname } from 'next/navigation';
import SidebarNav from './SidebarNav';
import TopHeader from './TopHeader';
import HeaderSearch from './HeaderSearch';
import styles from './MainLayout.module.css';
import GlobalTransition from './GlobalTransition';
import NotificationListener from './NotificationListener';

const MemoizedSidebarNav = memo(SidebarNav);
const MemoizedTopHeader = memo(TopHeader);
const MemoizedHeaderSearch = memo(HeaderSearch);

export default function PersistentLayoutClient({ children, currentUser, dict }) {
  const segments = useSelectedLayoutSegments();
  const pathname = usePathname();

  // /login veya auth sayfalarında sol/üst menüleri render etmeyelim
  const isAuthPage = pathname?.startsWith('/login') || segments.includes('login');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className={styles.layout}>
      <MemoizedSidebarNav currentUser={currentUser} />
      <div className={styles.mainContent}>
        <div className={styles.mobileOnlyHeader}>
          <MemoizedTopHeader currentUser={currentUser} />
        </div>
        <div className={styles.desktopOnlyHeader}>
          <MemoizedHeaderSearch />
        </div>
        <main className={styles.feedArea}>
          {children}
        </main>
      </div>
      <div className={styles.rightSidebar}>
        <div className={styles.placeholderCard}>
          <h3>{dict?.feed?.trending || 'Öne Çıkan Fikirler'}</h3>
          <p className={styles.muted}>{dict?.feed?.coming_soon || 'Toplulukta en çok ilgi gören fikirler, projeler ve ekip duyuruları yakında burada listelenecek.'}</p>
        </div>
      </div>
      <GlobalTransition />
      <NotificationListener currentUserId={currentUser?.id} />
    </div>
  );
}
