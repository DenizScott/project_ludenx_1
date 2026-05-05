import styles from './login.module.css';
import { getDictionary } from '@/lib/i18n';

export default function LoginPage() {
  const dict = getDictionary();
  
  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>{dict.login.title}</h1>
        <p className={styles.subtitle}>{dict.login.subtitle}</p>
        
        <div className={styles.oauthButtons}>
          <button className={styles.oauthButton}>
            <span>{dict.login.continue_google}</span>
          </button>
        </div>
        
        <div className={styles.divider}>
          <span>{dict.login.or}</span>
        </div>
        
        <form className={styles.form}>
          <input type="email" placeholder={dict.login.email} className={styles.input} />
          <input type="password" placeholder={dict.login.password} className={styles.input} />
          <button type="submit" className={styles.submitButton}>{dict.login.sign_in}</button>
        </form>
        
        <p className={styles.footerText}>
          {dict.login.no_account} <a href="#" className={styles.link}>{dict.login.sign_up}</a>
        </p>
      </div>
    </div>
  );
}
