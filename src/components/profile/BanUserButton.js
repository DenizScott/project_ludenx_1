"use client";
import { useState } from 'react';
import { Ban } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BanUserButton({ targetUserId, isCurrentlyBanned }) {
  const [isBanned, setIsBanned] = useState(isCurrentlyBanned);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleBanToggle = async () => {
    if (!confirm(`Bu kullanıcıyı ${isBanned ? 'yasaklanmasını kaldırmak' : 'yasaklamak'} istediğine emin misin?`)) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${targetUserId}/ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banStatus: !isBanned }),
      });
      
      if (res.ok) {
        setIsBanned(!isBanned);
        router.refresh();
      } else {
        alert("Yetkiniz yok veya bir hata oluştu.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleBanToggle} 
      disabled={isLoading}
      style={{ 
        display: 'flex', alignItems: 'center', gap: '0.5rem', 
        padding: '0.6rem 1.2rem', borderRadius: '9999px', 
        background: isBanned ? 'rgba(255,255,255,0.1)' : '#e0245e', 
        color: 'white', fontWeight: 'bold', border: 'none', 
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.7 : 1
      }}
      title={isBanned ? "Yasağı Kaldır" : "Kullanıcıyı Yasakla"}
    >
      <Ban size={18} />
      {isBanned ? "Yasaklı" : "Yasakla"}
    </button>
  );
}
