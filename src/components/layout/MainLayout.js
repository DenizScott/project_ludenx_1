import SidebarNav from './SidebarNav';
import HeaderSearch from './HeaderSearch';
import styles from './MainLayout.module.css';
import { getDictionary } from '@/lib/i18n';

export default function MainLayout({ children }) {
  const dict = getDictionary();
  return (
    <div className={styles.layout}>
      <SidebarNav />
      <div className={styles.mainContent}>
        <HeaderSearch />
        <main className={styles.feedArea}>
          {children}
        </main>
      </div>
      <div className={styles.rightSidebar}>
        {/* Future placeholder for trends, suggested follows, etc. */}
        <div className={styles.placeholderCard}>
          <h3>{dict.feed.trending}</h3>
          <p className={styles.muted}>{dict.feed.coming_soon}</p>
        </div>
      </div>
    </div>
  );
}
