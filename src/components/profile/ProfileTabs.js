"use client";
import { useState } from 'react';
import styles from '@/app/profile/profile.module.css';
import FeedListClient from '@/components/feed/FeedListClient';

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
        return <FeedListClient initialPosts={user.posts || []} currentUser={currentUser} dict={dict} queryKey={['posts', 'profile', user.id, 'posts']} />;
      case 'replies':
        return <FeedListClient initialPosts={uniqueReplies} currentUser={currentUser} dict={dict} queryKey={['posts', 'profile', user.id, 'replies']} />;
      case 'media':
        return <FeedListClient initialPosts={mediaPosts} currentUser={currentUser} dict={dict} queryKey={['posts', 'profile', user.id, 'media']} />;
      case 'likes':
        return <FeedListClient initialPosts={likedPosts} currentUser={currentUser} dict={dict} queryKey={['posts', 'profile', user.id, 'likes']} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className={styles.tabs}>
        <div className={`${styles.tab} ${activeTab === 'posts' ? styles.activeTab : ''}`} onClick={() => setActiveTab('posts')} style={{cursor:'pointer'}}>Fikirler</div>
        <div className={`${styles.tab} ${activeTab === 'replies' ? styles.activeTab : ''}`} onClick={() => setActiveTab('replies')} style={{cursor:'pointer'}}>Yanıtlar</div>
        <div className={`${styles.tab} ${activeTab === 'media' ? styles.activeTab : ''}`} onClick={() => setActiveTab('media')} style={{cursor:'pointer'}}>Medya</div>
        <div className={`${styles.tab} ${activeTab === 'likes' ? styles.activeTab : ''}`} onClick={() => setActiveTab('likes')} style={{cursor:'pointer'}}>Tepkiler</div>
      </div>
      <div className={styles.postsSection}>
        {getTabContent()}
      </div>
    </>
  );
}
