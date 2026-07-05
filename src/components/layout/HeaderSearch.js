import { Search } from 'lucide-react';
import styles from './HeaderSearch.module.css';
import trDict from '@/lib/dictionaries/tr.json';

export default function HeaderSearch({ dict = trDict }) {
  return (
    <header className={styles.header}>
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={20} />
        <input 
          type="text" 
          placeholder={dict?.header?.search_placeholder || 'Fikir, proje veya tasarımcı ara...'} 
          className={styles.searchInput}
        />
      </div>
    </header>
  );
}
