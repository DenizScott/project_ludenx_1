import { Search } from 'lucide-react';
import styles from './HeaderSearch.module.css';
import { getDictionary } from '@/lib/i18n';

export default function HeaderSearch() {
  const dict = getDictionary();
  return (
    <header className={styles.header}>
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={20} />
        <input 
          type="text" 
          placeholder={dict.header.search_placeholder} 
          className={styles.searchInput}
        />
      </div>
    </header>
  );
}
