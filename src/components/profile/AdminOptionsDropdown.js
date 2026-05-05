"use client";
import { useState, useRef, useEffect } from 'react';
import { ShieldAlert, Ban, Trash2, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminOptionsDropdown({ targetUserId, isCurrentlyBanned }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBanned, setIsBanned] = useState(isCurrentlyBanned);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        setIsOpen(false);
        router.refresh();
      } else {
        alert("Yetkiniz yok veya sunucu ile bağlantı kurulamadı. Sunucuyu yeniden başlatmayı deneyin.");
      }
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!confirm(`DİKKAT: Bu kullanıcıyı ve tüm gönderilerini/yorumlarını kalıcı olarak SİLMEK istediğine emin misin? Bu işlem geri alınamaz!`)) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${targetUserId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        alert("Kullanıcı başarıyla silindi.");
        router.push('/feed');
        router.refresh();
      } else {
        alert("Yetkiniz yok veya sunucu ile bağlantı kurulamadı. Sunucuyu yeniden başlatmayı deneyin.");
      }
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        disabled={isLoading}
        style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', 
          padding: '0.6rem 1.2rem', borderRadius: '9999px', 
          background: 'var(--card-dark)', 
          color: 'white', fontWeight: 'bold', border: '1px solid var(--border-dark)', 
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.7 : 1,
          transition: 'all 0.2s'
        }}
      >
        <ShieldAlert size={18} color="#e0245e" />
        Yönetici Seçenekleri
        <ChevronDown size={16} style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '110%',
          right: 0,
          background: 'var(--bg-dark)',
          border: '1px solid var(--border-dark)',
          borderRadius: '12px',
          padding: '0.5rem',
          minWidth: '200px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.2rem',
          zIndex: 50
        }}>
          <button 
            onClick={handleBanToggle}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.8rem',
              padding: '0.8rem 1rem', width: '100%',
              background: 'transparent', border: 'none', color: isBanned ? '#00ba7c' : 'white',
              cursor: 'pointer', textAlign: 'left', borderRadius: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Ban size={18} />
            {isBanned ? "Yasağı Kaldır" : "Kullanıcıyı Yasakla"}
          </button>
          
          <div style={{ height: '1px', background: 'var(--border-dark)', margin: '0.2rem 0' }}></div>

          <button 
            onClick={handleDeleteUser}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.8rem',
              padding: '0.8rem 1rem', width: '100%',
              background: 'transparent', border: 'none', color: '#e0245e',
              cursor: 'pointer', textAlign: 'left', borderRadius: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(224,36,94,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Trash2 size={18} />
            Kullanıcıyı Sil
          </button>
        </div>
      )}
    </div>
  );
}
