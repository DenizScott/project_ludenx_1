import styles from './feed.module.css';
import PostCardSkeleton from '@/components/feed/PostCardSkeleton';

export default function FeedLoading() {
  return (
    <div className={styles.feedContainer}>
      {/* Üst Paylaşım Alanı İskeleti (CreatePost Skeleton) */}
      <div style={{
        background: 'var(--card-dark)',
        border: '1px solid var(--border-dark)',
        borderRadius: '12px',
        padding: '1.25rem',
        margin: '0 1.5rem 1.5rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
      }}>
        <div className={styles.skeletonBox} style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0 }} />
        <div className={styles.skeletonBox} style={{ width: '100%', height: '44px', borderRadius: '10px' }} />
      </div>

      {/* Akış Kartları İskeleti (3 Adet PostCardSkeleton) */}
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
    </div>
  );
}
