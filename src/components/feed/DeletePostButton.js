"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeletePostButton({ postId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Bu gönderiyi silmek istediğinize emin misiniz?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Silinirken bir hata oluştu.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading}
      style={{
        background: 'none', border: 'none', color: '#ff4444', 
        cursor: 'pointer', padding: '8px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: loading ? 0.5 : 1, transition: 'background-color 0.2s'
      }}
      title="Gönderiyi Sil"
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 68, 68, 0.1)'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <Trash2 size={18} />
    </button>
  );
}
