"use client";
import { useState } from 'react';
import styles from '@/app/profile/profile.module.css';
import PostCard from '@/components/feed/PostCard';

export default function ProfileTabs({ user, currentUser, dict }) {
  const [activeTab, setActiveTab] = useState('posts'); // posts, replies, media, likes

  // Extract posts that the user commented on
  const replies = user.comments?.map(c => c.post).filter(Boolean) || [];
  // Deduplicate posts
  const uniqueReplies = [...new Map(replies.map(item => [item.id, item])).values()];

  // Extract posts with media
  const mediaPosts = user.posts?.filter(p => p.mediaUrl) || [];

  // Extract liked posts
  const likedPosts = user.likes?.map(l => l.post).filter(Boolean) || [];
  
  const getTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return user.posts?.length === 0 ? <p style={{ color: '#8892B0', textAlign: 'center', marginTop: '2rem' }}>Henüz bir gönderi yok.</p> : user.posts?.map(post => <PostCard key={post.id} post={post} currentUser={currentUser} dict={dict} />);
      case 'replies':
        return uniqueReplies.length === 0 ? <p style={{ color: '#8892B0', textAlign: 'center', marginTop: '2rem' }}>Henüz bir yanıt yok.</p> : uniqueReplies.map(post => <PostCard key={post.id} post={post} currentUser={currentUser} dict={dict} />);
      case 'media':
        return mediaPosts.length === 0 ? <p style={{ color: '#8892B0', textAlign: 'center', marginTop: '2rem' }}>Henüz bir medya yok.</p> : mediaPosts.map(post => <PostCard key={post.id} post={post} currentUser={currentUser} dict={dict} />);
      case 'likes':
        return likedPosts.length === 0 ? <p style={{ color: '#8892B0', textAlign: 'center', marginTop: '2rem' }}>Henüz bir beğeni yok.</p> : likedPosts.map(post => <PostCard key={post.id} post={post} currentUser={currentUser} dict={dict} />);
      default:
        return null;
    }
  };

  return (
    <>
      <div className={styles.tabs}>
        <div className={`${styles.tab} ${activeTab === 'posts' ? styles.activeTab : ''}`} onClick={() => setActiveTab('posts')} style={{cursor:'pointer'}}>Gönderiler</div>
        <div className={`${styles.tab} ${activeTab === 'replies' ? styles.activeTab : ''}`} onClick={() => setActiveTab('replies')} style={{cursor:'pointer'}}>Yanıtlar</div>
        <div className={`${styles.tab} ${activeTab === 'media' ? styles.activeTab : ''}`} onClick={() => setActiveTab('media')} style={{cursor:'pointer'}}>Medya</div>
        <div className={`${styles.tab} ${activeTab === 'likes' ? styles.activeTab : ''}`} onClick={() => setActiveTab('likes')} style={{cursor:'pointer'}}>Beğeniler</div>
      </div>
      <div className={styles.postsSection}>
        {getTabContent()}
      </div>
    </>
  );
}
