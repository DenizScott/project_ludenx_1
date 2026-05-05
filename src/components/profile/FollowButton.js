"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FollowButton({ targetUserId, isCurrentlyFollowing }) {
  const [isFollowing, setIsFollowing] = useState(isCurrentlyFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFollowToggle = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${targetUserId}/follow`, {
        method: 'POST',
      });
      
      if (res.ok) {
        setIsFollowing(!isFollowing);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleFollowToggle} 
      disabled={isLoading}
      style={{ 
        padding: '0.6rem 1.2rem', 
        borderRadius: '9999px', 
        background: isFollowing ? 'transparent' : 'white', 
        color: isFollowing ? 'white' : 'black', 
        fontWeight: 'bold', 
        border: isFollowing ? '1px solid var(--border-dark)' : 'none', 
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.7 : 1,
        transition: 'all 0.2s'
      }}
    >
      {isFollowing ? "Takip Ediliyor" : "Takip Et"}
    </button>
  );
}
