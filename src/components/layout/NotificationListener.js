"use client";
import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import styles from './NotificationListener.module.css';

export default function NotificationListener({ currentUserId }) {
  const [latestNotifId, setLatestNotifId] = useState(null);
  const [toast, setToast] = useState(null);
  const pathname = usePathname();

  const playNotificationSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch(e) {
      console.error('Audio play failed', e);
    }
  }, []);

  const { data } = useQuery({
    queryKey: ['notifications', 'unread', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return { count: 0, latest: null };
      const res = await fetch('/api/notifications/unread');
      if (!res.ok) throw new Error('Failed to fetch unread');
      return res.json();
    },
    enabled: !!currentUserId,
    refetchInterval: 15000,
    staleTime: 10000,
  });

  const unreadCount = data?.count || 0;
  const latest = data?.latest || null;

  useEffect(() => {
    if (latest && latest.id !== latestNotifId && pathname !== '/notifications') {
      setLatestNotifId(latest.id);
      playNotificationSound();
      
      let text = "Yeni bir bildiriminiz var!";
      if (latest.type === 'LIKE') text = `${latest.sender.name} gönderinizi beğendi!`;
      if (latest.type === 'COMMENT') text = `${latest.sender.name} gönderinize yorum yaptı!`;
      if (latest.type === 'REPOST') text = `${latest.sender.name} gönderinizi kayda aldı!`;
      if (latest.type === 'FOLLOW') text = `${latest.sender.name} sizi takip etmeye başladı!`;
      
      setToast({ message: text, link: '/notifications' });
      setTimeout(() => setToast(null), 5000);
    } else if (latest) {
      setLatestNotifId(latest.id);
    }
  }, [latest, latestNotifId, pathname, playNotificationSound]);

  useEffect(() => {
    if (unreadCount > 0) {
      const badgeText = unreadCount > 9 ? '+9' : unreadCount.toString();
      const notifLink = document.querySelector('a[href="/notifications"]');
      if (notifLink) {
        let badge = notifLink.querySelector('.notif-badge');
        if (!badge) {
          badge = document.createElement('div');
          badge.className = 'notif-badge';
          badge.style.position = 'absolute';
          badge.style.top = '6px';
          badge.style.left = '32px';
          badge.style.backgroundColor = 'var(--accent-amber)';
          badge.style.color = '#081018';
          badge.style.fontSize = '0.7rem';
          badge.style.fontWeight = 'bold';
          badge.style.padding = '2px 6px';
          badge.style.borderRadius = '6px';
          badge.style.zIndex = '10';
          notifLink.style.position = 'relative';
          notifLink.appendChild(badge);
        }
        badge.innerText = badgeText;
      }
    } else {
      const badge = document.querySelector('a[href="/notifications"] .notif-badge');
      if (badge) badge.remove();
    }
  }, [unreadCount]);

  return (
    <>
      {toast && (
        <div className={styles.toast} onClick={() => window.location.href = toast.link}>
          {toast.message}
        </div>
      )}
    </>
  );
}
