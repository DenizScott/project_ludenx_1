"use client";
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Hourglass } from 'lucide-react';

export default function GlobalTransition() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(true);
    const timeout = setTimeout(() => setIsNavigating(false), 500);
    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  // Kullanıcı talebi üzerine sağ alttaki kum saati yükleme ikonu devre dışı bırakıldı (kodlar korundu).
  const DISABLED = true;
  if (DISABLED || !isNavigating) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 9999,
      background: 'var(--card-dark)',
      width: '112px',
      height: '112px',
      borderRadius: '50%',
      boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '3px solid var(--border-dark)'
    }}>
      <div className="hourglass-spin" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Hourglass size={60} color="var(--accent)" strokeWidth={2.5} />
      </div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .hourglass-spin {
          animation: spin 1s linear infinite;
          transform-origin: center center;
        }
      `}</style>
    </div>
  );
}
