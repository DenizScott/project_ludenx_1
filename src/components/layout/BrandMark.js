import styles from './BrandMark.module.css';

export default function BrandMark({ size = 34, className = '' }) {
  return (
    <div className={`${styles.brand} ${className}`} style={{ '--brand-size': `${size}px` }}>
      <span className={styles.word}>LudenX</span>
      <span className={styles.badge} aria-hidden="true">
        <span className={styles.pixel} />
      </span>
    </div>
  );
}
