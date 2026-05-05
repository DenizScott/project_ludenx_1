"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageSquare, Repeat2, UserPlus, Radar, AtSign } from 'lucide-react';

export default function NotificationTabsClient({ notifications }) {
  const [activeTab, setActiveTab] = useState('etkilesim');

  const getIcon = (type) => {
    switch (type) {
      case 'LIKE': return <Heart size={24} color="#f91880" fill="#f91880" />;
      case 'COMMENT': return <MessageSquare size={24} color="#1d9bf0" fill="#1d9bf0" />;
      case 'REPOST': return <Repeat2 size={24} color="#00ba7c" />;
      case 'FOLLOW': return <UserPlus size={24} color="var(--accent)" />;
      case 'MENTION': return <AtSign size={24} color="#1d9bf0" />;
      default: return <Radar size={24} color="var(--text-muted)" />;
    }
  };

  const getMessage = (type, name) => {
    switch (type) {
      case 'LIKE': return <span><b>{name}</b> gönderini beğendi.</span>;
      case 'COMMENT': return <span><b>{name}</b> gönderine yorum yaptı.</span>;
      case 'REPOST': return <span><b>{name}</b> gönderini yeniden paylaştı.</span>;
      case 'FOLLOW': return <span><b>{name}</b> seni takip etmeye başladı.</span>;
      case 'MENTION': return <span><b>{name}</b> bir gönderide senden bahsetti.</span>;
      default: return <span><b>{name}</b> seninle etkileşime geçti.</span>;
    }
  };

  const filteredNotifs = notifications.filter(n => 
    activeTab === 'etkilesim' ? n.type !== 'MENTION' : n.type === 'MENTION'
  );

  return (
    <>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-dark)', backgroundColor: 'rgba(176, 38, 255, 0.05)', backdropFilter: 'blur(12px)', position: 'sticky', top: '60px', zIndex: 9 }}>
        <div 
          onClick={() => setActiveTab('etkilesim')}
          style={{ flex: 1, textAlign: 'center', padding: '1rem', cursor: 'pointer', color: activeTab === 'etkilesim' ? 'white' : 'var(--text-muted)', fontWeight: activeTab === 'etkilesim' ? 'bold' : 'normal', position: 'relative' }}
        >
          Etkileşim
          {activeTab === 'etkilesim' && <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '40px', height: '4px', backgroundColor: 'var(--accent)', borderRadius: '4px 4px 0 0' }}></div>}
        </div>
        <div 
          onClick={() => setActiveTab('bahsetmeler')}
          style={{ flex: 1, textAlign: 'center', padding: '1rem', cursor: 'pointer', color: activeTab === 'bahsetmeler' ? 'white' : 'var(--text-muted)', fontWeight: activeTab === 'bahsetmeler' ? 'bold' : 'normal', position: 'relative' }}
        >
          Bahsetmeler
          {activeTab === 'bahsetmeler' && <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '40px', height: '4px', backgroundColor: 'var(--accent)', borderRadius: '4px 4px 0 0' }}></div>}
        </div>
      </div>

      {filteredNotifs.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
          {activeTab === 'bahsetmeler' ? <AtSign size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} /> : <Radar size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />}
          <p>Henüz bir {activeTab === 'bahsetmeler' ? 'bahsetme' : 'etkileşim'} yok.</p>
        </div>
      ) : (
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredNotifs.map(notif => {
            const linkHref = notif.postId ? `/post/${notif.postId}` : `/@${notif.sender?.username?.replace('@', '') || notif.sender?.email?.split('@')[0]}`;
            return (
              <Link href={linkHref} key={notif.id} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.5rem', 
                  backgroundColor: notif.read ? 'var(--card-dark)' : 'rgba(176, 38, 255, 0.1)', 
                  border: '1px solid var(--border-dark)', borderRadius: '16px',
                  transition: 'transform 0.2s ease', cursor: 'pointer'
                }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-dark)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = notif.read ? 'var(--card-dark)' : 'rgba(176, 38, 255, 0.1)'}>
                  <div>{getIcon(notif.type)}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--border-dark)', overflow: 'hidden' }}>
                      {notif.sender.image ? (
                        <img src={notif.sender.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                          {notif.sender.name ? notif.sender.name[0].toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <div style={{ color: 'white', fontSize: '1.1rem' }}>
                      {getMessage(notif.type, notif.sender.name || 'Bir kullanıcı')}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  );
}
