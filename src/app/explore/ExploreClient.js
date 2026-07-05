"use client";
import { useState, useMemo } from 'react';
import styles from '@/app/profile/profile.module.css';
import FeedListClient from '@/components/feed/FeedListClient';
import { Flame, Calendar, Clock } from 'lucide-react';

export default function ExploreClient({ initialPosts, currentUser, dict }) {
  const [activeTab, setActiveTab] = useState('daily'); // daily, weekly, monthly

  const filteredPosts = useMemo(() => {
    const now = new Date();
    let cutoffDate = new Date();

    if (activeTab === 'daily') {
      cutoffDate.setDate(now.getDate() - 1);
    } else if (activeTab === 'weekly') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (activeTab === 'monthly') {
      cutoffDate.setDate(now.getDate() - 30);
    }

    // Filter posts by date and sort descending by number of likes
    const filtered = (initialPosts || []).filter(post => {
      const postDate = new Date(post.createdAt);
      return postDate >= cutoffDate;
    });

    return filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
  }, [initialPosts, activeTab]);

  return (
    <>
      <div style={{ padding: '1rem 1.5rem', background: 'rgba(14, 17, 23, 0.86)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', transform: 'translateZ(0)', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid rgba(105, 228, 255, 0.12)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <Flame size={22} color="var(--accent-amber)" />
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Keşfet - En Çok Beğenilenler</span>
      </div>

      <div className={styles.tabs} style={{ margin: '1rem 1.5rem', borderBottom: '1px solid rgba(105, 228, 255, 0.16)' }}>
        <div 
          className={`${styles.tab} ${activeTab === 'daily' ? styles.activeTab : ''}`} 
          onClick={() => setActiveTab('daily')} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Clock size={16} /> Günlük
        </div>
        <div 
          className={`${styles.tab} ${activeTab === 'weekly' ? styles.activeTab : ''}`} 
          onClick={() => setActiveTab('weekly')} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Calendar size={16} /> Haftalık
        </div>
        <div 
          className={`${styles.tab} ${activeTab === 'monthly' ? styles.activeTab : ''}`} 
          onClick={() => setActiveTab('monthly')} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Flame size={16} /> Aylık
        </div>
      </div>

      <div className={styles.postsSection} style={{ paddingBottom: '4rem' }}>
        {filteredPosts.length > 0 ? (
          <FeedListClient 
            initialPosts={filteredPosts} 
            currentUser={currentUser} 
            dict={dict} 
            queryKey={['posts', 'explore', activeTab]} 
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
            <Flame size={48} style={{ margin: '0 auto 1rem', opacity: 0.3, color: 'var(--accent-amber)' }} />
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Bu zaman aralığında öne çıkan içerik yok</h3>
            <p style={{ maxWidth: '400px', margin: '0 auto' }}>
              {activeTab === 'daily' && "Son 24 saat içinde paylaşılan fikir bulunmuyor. İlk fikrini paylaşarak bugünün lideri sen ol!"}
              {activeTab === 'weekly' && "Son 7 gün içinde paylaşılan fikir bulunmuyor. İlk fikrini yayınla!"}
              {activeTab === 'monthly' && "Son 30 gün içinde paylaşılan fikir bulunmuyor."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
