"use client";
import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, LogOut, UserPlus } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfileMoreMenu({ user, direction = "down", buttonStyle = {} }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  const handleUsername = user?.username?.startsWith('@')
    ? user.username
    : `@${user?.username || user?.email?.split('@')[0] || 'kullanici'}`;

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddAccount = () => {
    setOpen(false);
    router.push('/login');
  };

  const handleLogout = () => {
    setOpen(false);
    signOut({ callbackUrl: '/login' });
  };

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block', ...buttonStyle }}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        style={{
          background: open ? 'rgba(105, 228, 255, 0.15)' : 'transparent',
          border: '1px solid rgba(105, 228, 255, 0.18)',
          color: 'var(--text-dark)',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: open ? '0 0 10px rgba(105, 228, 255, 0.2)' : 'none'
        }}
        title="Daha fazla seçenek"
      >
        <MoreHorizontal size={20} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            [direction === "up" ? "bottom" : "top"]: '100%',
            right: direction === "up" ? 0 : 0,
            marginBottom: direction === "up" ? '8px' : 0,
            marginTop: direction === "down" ? '8px' : 0,
            background: '#0a0e14',
            border: '1px solid rgba(105, 228, 255, 0.22)',
            borderRadius: '16px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.8), 0 0 15px rgba(105, 228, 255, 0.1)',
            minWidth: '270px',
            zIndex: 9999,
            padding: '0.5rem 0',
            overflow: 'hidden'
          }}
        >
          <button
            type="button"
            onClick={handleAddAccount}
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem',
              background: 'transparent',
              border: 'none',
              color: 'white',
              textAlign: 'left',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <UserPlus size={18} color="var(--accent)" />
            Var olan bir hesap ekle
          </button>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem',
              background: 'transparent',
              border: 'none',
              color: 'white',
              textAlign: 'left',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 68, 68, 0.12)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={18} color="#ff4444" />
            <span>{handleUsername} hesabından çıkış yap</span>
          </button>
        </div>
      )}
    </div>
  );
}
