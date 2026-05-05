import styles from './feed.module.css';
import { getDictionary } from '@/lib/i18n';

// Dummy data
const posts = [
  {
    id: 1,
    author: { name: 'Alex Doe', username: '@alexd', avatar: 'A' },
    content: 'Just finished the new lighting system for our cyberpunk level! What do you guys think?',
    media: 'https://via.placeholder.com/600x300/282A31/B026FF?text=Cyberpunk+Level',
    time: '2h'
  },
  {
    id: 2,
    author: { name: 'Sarah G.', username: '@sarahg_dev', avatar: 'S' },
    content: 'Working on a new low-poly character model. Trying to keep the triangle count under 2000.',
    media: 'https://via.placeholder.com/600x400/282A31/8892B0?text=Low+Poly+Character',
    time: '4h'
  },
  {
    id: 3,
    author: { name: 'Marcus L.', username: '@marcus_studios', avatar: 'M' },
    content: 'Our latest devlog is live! We dive deep into the new AI behavior tree.',
    media: null,
    time: '5h'
  }
];

export default function FeedPage() {
  const dict = getDictionary();

  return (
    <div className={styles.feedContainer}>
      {posts.map(post => (
        <div key={post.id} className={styles.postCard}>
          <div className={styles.postHeader}>
            <div className={styles.avatar}>{post.author.avatar}</div>
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>{post.author.name}</span>
              <span className={styles.authorUsername}>{post.author.username}</span>
              <span className={styles.dot}>·</span>
              <span className={styles.time}>{post.time}</span>
            </div>
          </div>
          <div className={styles.postContent}>
            <p>{post.content}</p>
            {post.media && (
              <div className={styles.mediaContainer}>
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.media} alt="Post media" className={styles.media} />
              </div>
            )}
          </div>
          <div className={styles.postActions}>
            <button className={styles.actionBtn}>{dict.feed.like}</button>
            <button className={styles.actionBtn}>{dict.feed.comment}</button>
            <button className={styles.actionBtn}>{dict.feed.share}</button>
          </div>
        </div>
      ))}
    </div>
  );
}
