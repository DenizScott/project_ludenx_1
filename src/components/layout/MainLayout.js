import SidebarNav from './SidebarNav';
import TopHeader from './TopHeader';
import HeaderSearch from './HeaderSearch';
import styles from './MainLayout.module.css';
import { getDictionary } from '@/lib/i18n';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from '@prisma/client';
import GlobalTransition from './GlobalTransition';
import NotificationListener from './NotificationListener';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default async function MainLayout({ children }) {
  const dict = getDictionary();
  const session = await getServerSession(authOptions);
  let currentUser = null;
  if (session?.user?.id) {
    currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  }

  return (
    <div className={styles.layout}>
      <SidebarNav currentUser={currentUser} />
      <div className={styles.mainContent}>
        <div className={styles.mobileOnlyHeader}>
          <TopHeader currentUser={currentUser} />
        </div>
        <div className={styles.desktopOnlyHeader}>
          <HeaderSearch />
        </div>
        <main className={styles.feedArea}>
          {children}
        </main>
      </div>
      <div className={styles.rightSidebar}>
        <div className={styles.placeholderCard}>
          <h3>{dict.feed.trending}</h3>
          <p className={styles.muted}>{dict.feed.coming_soon}</p>
        </div>
      </div>
      <GlobalTransition />
      <NotificationListener currentUserId={currentUser?.id} />
    </div>
  );
}
