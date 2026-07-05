"use client";
import { useState, useTransition, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

// React 18/19 uyumlu useOptimistic API polifili (Tier-1 Sıfır Gecikme - Zero Latency)
function useOptimistic(initialState, updateFn) {
  const [state, setState] = useState(initialState);
  const [, startTransition] = useTransition();

  const setOptimistic = useCallback((action) => {
    startTransition(() => {
      setState((prevState) => updateFn(prevState, action));
    });
  }, [updateFn]);

  return [state, setOptimistic];
}

export default function LikeButton({ postId, initialLikes, initialIsLiked, currentUser, dict, styles }) {
  const router = useRouter();

  // Optimistic UI durumu: [anlıkDurum, iyimserGuncelle]
  const [optimisticState, setOptimisticState] = useOptimistic(
    { likes: initialLikes, isLiked: initialIsLiked },
    (state, action) => {
      if (action.type === 'TOGGLE_LIKE') {
        const nextIsLiked = !state.isLiked;
        return {
          ...state,
          isLiked: nextIsLiked,
          likes: nextIsLiked ? state.likes + 1 : Math.max(0, state.likes - 1)
        };
      }
      if (action.type === 'SYNC') {
        return { likes: action.payload.likes, isLiked: action.payload.isLiked };
      }
      return state;
    }
  );

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    // 1. Sıfır gecikme (Zero Latency): Anında UI güncellemesi (Optimistic UI)
    setOptimisticState({ type: 'TOGGLE_LIKE' });

    // 2. Arka planda sessiz sunucu isteği
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      if (!res.ok) {
        // Sunucu hatası durumunda anında geri al (Rollback)
        setOptimisticState({ type: 'SYNC', payload: { likes: initialLikes, isLiked: initialIsLiked } });
        router.refresh();
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error("Like error:", err);
      // Ağ hatasında geri al (Rollback)
      setOptimisticState({ type: 'SYNC', payload: { likes: initialLikes, isLiked: initialIsLiked } });
    }
  };

  return (
    <button
      className={`${styles.actionBtn} ${optimisticState.isLiked ? styles.actionActive : ''}`}
      onClick={handleLike}
      title={dict.feed.like}
      style={{ willChange: 'transform' }} /* Donanım Hızlandırmalı CSS Geçiş İpucu */
    >
      <Heart size={17} fill={optimisticState.isLiked ? 'currentColor' : 'none'} />
      <span>{optimisticState.likes > 0 ? optimisticState.likes : dict.feed.like}</span>
    </button>
  );
}
