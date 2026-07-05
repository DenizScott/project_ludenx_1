import styles from './BrandMark.module.css';

export default function BrandMark({ size = 38, className = '' }) {
  return (
    <div className={`${styles.brand} ${className}`} style={{ '--brand-size': `${size}px` }}>
      <img src="/logo.png" alt="LudenOS Logo" style={{ width: `${size}px`, height: `${size}px`, objectFit: 'contain', flexShrink: 0 }} className={styles.logoImg} />
      <span className={styles.word}>LudenOS</span>
    </div>
  );
}
