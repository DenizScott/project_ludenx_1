import styles from '@/app/feed/feed.module.css';

export default function PostCardSkeleton() {
  return (
    <article className={styles.postCard} style={{ pointerEvents: 'none' }}>
      <div className={styles.devlogStripe} />
      <header className={styles.postHeader}>
        <div className={`${styles.avatar} ${styles.skeletonBox}`} />
        <div className={styles.authorInfo} style={{ width: '100%' }}>
          <div className={styles.skeletonBox} style={{ width: '140px', height: '16px', marginBottom: '8px' }} />
          <div className={styles.skeletonBox} style={{ width: '90px', height: '12px' }} />
        </div>
      </header>

      <div className={styles.postContent}>
        <div className={styles.skeletonBox} style={{ width: '50px', height: '14px', marginBottom: '12px' }} />
        <div className={styles.skeletonBox} style={{ width: '92%', height: '16px', marginBottom: '8px' }} />
        <div className={styles.skeletonBox} style={{ width: '75%', height: '16px', marginBottom: '16px' }} />
      </div>

      <div className={styles.postActions}>
        <div className={`${styles.actionBtn} ${styles.skeletonBox}`} style={{ width: '70px', height: '32px', border: 'none' }} />
        <div className={`${styles.actionBtn} ${styles.skeletonBox}`} style={{ width: '70px', height: '32px', border: 'none' }} />
        <div className={`${styles.actionBtn} ${styles.skeletonBox}`} style={{ width: '70px', height: '32px', border: 'none' }} />
      </div>
    </article>
  );
}
