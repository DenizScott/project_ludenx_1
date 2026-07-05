"use client";
import { useState } from 'react';
import Link from 'next/link';
import { AtSign, Heart, MessageSquare, Radar, Repeat2, UserPlus } from 'lucide-react';
import styles from './NotificationTabsClient.module.css';

export default function NotificationTabsClient({ notifications }) {
  const [activeTab, setActiveTab] = useState('etkilesim');

  const getIcon = (type) => {
    switch (type) {
      case 'LIKE': return <Heart size={23} color="var(--accent-rose)" fill="var(--accent-rose)" />;
      case 'COMMENT': return <MessageSquare size={23} color="var(--accent-cyan)" fill="var(--accent-cyan)" />;
      case 'REPOST': return <Repeat2 size={23} color="var(--accent-green)" />;
      case 'FOLLOW': return <UserPlus size={23} color="var(--accent-amber)" />;
      case 'MENTION': return <AtSign size={23} color="var(--accent-cyan)" />;
      default: return <Radar size={23} color="var(--text-muted)" />;
    }
  };

  const getMessage = (type, name) => {
    switch (type) {
      case 'LIKE': return <span><b>{name}</b> devlog'una tepki verdi.</span>;
      case 'COMMENT': return <span><b>{name}</b> devlog'una not bıraktı.</span>;
      case 'REPOST': return <span><b>{name}</b> devlog'unu kayda aldı.</span>;
      case 'FOLLOW': return <span><b>{name}</b> seni ekibine aldı.</span>;
      case 'MENTION': return <span><b>{name}</b> bir build notunda senden bahsetti.</span>;
      default: return <span><b>{name}</b> seninle etkileşime geçti.</span>;
    }
  };

  const filteredNotifs = notifications.filter(n =>
    activeTab === 'etkilesim' ? n.type !== 'MENTION' : n.type === 'MENTION'
  );

  return (
    <>
      <div className={styles.switcher}>
        <button
          type="button"
          onClick={() => setActiveTab('etkilesim')}
          className={`${styles.switchButton} ${activeTab === 'etkilesim' ? styles.active : ''}`}
        >
          Etkileşimler
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('bahsetmeler')}
          className={`${styles.switchButton} ${activeTab === 'bahsetmeler' ? styles.active : ''}`}
        >
          Bahsetmeler
        </button>
      </div>

      {filteredNotifs.length === 0 ? (
        <div className={styles.empty}>
          {activeTab === 'bahsetmeler' ? <AtSign size={48} /> : <Radar size={48} />}
          <p>Henüz bir {activeTab === 'bahsetmeler' ? 'bahsetme' : 'etkileşim'} yok.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {filteredNotifs.map(notif => {
            const linkHref = notif.postId ? `/post/${notif.postId}` : `/@${notif.sender?.username?.replace('@', '') || notif.sender?.email?.split('@')[0]}`;
            return (
              <Link href={linkHref} key={notif.id}>
                <div className={`${styles.card} ${notif.read ? '' : styles.unread}`}>
                  <div>{getIcon(notif.type)}</div>
                  <div className={styles.content}>
                    <div className={styles.sender}>
                      {notif.sender.image ? (
                        <img src={notif.sender.image} alt="" />
                      ) : (
                        notif.sender.name ? notif.sender.name[0].toUpperCase() : 'U'
                      )}
                    </div>
                    <div className={styles.message}>
                      {getMessage(notif.type, notif.sender.name || 'Bir kullanici')}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
