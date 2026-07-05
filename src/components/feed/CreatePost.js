"use client";
import { useRef, useState } from 'react';
import styles from './CreatePost.module.css';
import { useRouter } from 'next/navigation';
import { CalendarClock, FileBox, Image as ImageIcon, ListTodo, MapPin, Smile, X } from 'lucide-react';

export default function CreatePost({ dict, currentUser }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [content, setContent] = useState('');
  const [mediaData, setMediaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setMediaData(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !mediaData) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, mediaUrl: mediaData }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Bir hata olustu");
      } else {
        setContent('');
        setMediaData(null);
        router.refresh();
      }
    } catch (err) {
      setError("Bir hata olustu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputArea}>
          <div className={styles.avatar}>
            {currentUser?.image ? (
              <img src={currentUser.image} className={styles.avatarImg} alt="Profile" />
            ) : (
              currentUser?.name ? currentUser.name[0].toUpperCase() : 'U'
            )}
          </div>
          <textarea
            className={styles.textarea}
            placeholder="Bugün aklında ne var?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            rows={3}
          />
        </div>

        {mediaData && (
          <div className={styles.previewContainer}>
            <img src={mediaData} alt="Preview" className={styles.imagePreview} />
            <button type="button" className={styles.removeMediaBtn} onClick={() => setMediaData(null)}>
              <X size={16} />
            </button>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.footer}>
          <div className={styles.toolbar}>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleImageSelect}
            />
            <button type="button" className={styles.toolBtn} onClick={() => fileInputRef.current.click()} title="Gorsel">
              <ImageIcon size={20} />
            </button>
            <button type="button" className={styles.toolBtn} title="GIF"><FileBox size={20} /></button>
            <button type="button" className={styles.toolBtn} title="Milestone"><ListTodo size={20} /></button>
            <button type="button" className={styles.toolBtn} title="Emoji"><Smile size={20} /></button>
            <button type="button" className={styles.toolBtn} title="Planla"><CalendarClock size={20} /></button>
            <button type="button" className={styles.toolBtn} title="Konum"><MapPin size={20} /></button>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading || (!content.trim() && !mediaData)}>
            {loading ? "Yayinlaniyor..." : dict.sidebar.post}
          </button>
        </div>
      </form>
    </div>
  );
}
