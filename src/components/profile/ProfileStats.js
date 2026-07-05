"use client";
import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import styles from '@/app/profile/profile.module.css';

export default function ProfileStats({ user, currentUserId }) {
  const [showModal, setShowModal] = useState(null); // 'followers' or 'following'

  const followingCount = user.following?.length || 0;
  const followersCount = user.followers?.length || 0;

  return (
    <>
      <div className={styles.stats}>
        <div 
          className={styles.stat} 
          onClick={() => followingCount > 0 && setShowModal('following')}
          style={{ cursor: followingCount > 0 ? 'pointer' : 'default' }}
        >
          <span className={styles.statCount}>{followingCount}</span> Ağ
        </div>
        <div 
          className={styles.stat} 
          onClick={() => followersCount > 0 && setShowModal('followers')}
          style={{ cursor: followersCount > 0 ? 'pointer' : 'default' }}
        >
          <span className={styles.statCount}>{followersCount}</span> Takım
        </div>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }} onClick={() => setShowModal(null)}>
          <div style={{
            backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-dark)',
            borderRadius: '16px', width: '90%', maxWidth: '400px', maxHeight: '80vh',
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ 
              padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-dark)', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
            }}>
              <h3 style={{ margin: 0, color: 'white' }}>{showModal === 'followers' ? 'Takım' : 'Ağ'}</h3>
              <button onClick={() => setShowModal(null)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ overflowY: 'auto', padding: '1rem' }}>
              {(showModal === 'followers' ? user.followers : user.following).map((rel) => {
                const person = showModal === 'followers' ? rel.follower : rel.following;
                return (
                  <Link key={person.id} href={`/@${person.username?.replace('@', '') || person.email?.split('@')[0]}`} style={{ textDecoration: 'none' }}>
                    <div style={{ 
                      display: 'flex', alignItems: 'center', gap: '1rem', 
                      padding: '0.8rem', borderRadius: '12px', transition: 'background-color 0.2s' 
                    }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--card-dark)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--border-dark)', overflow: 'hidden' }}>
                        {person.image ? (
                          <img src={person.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                            {person.name ? person.name[0].toUpperCase() : 'U'}
                          </div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: 'white' }}>{person.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{person.username || `@${person.email?.split('@')[0]}`}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
