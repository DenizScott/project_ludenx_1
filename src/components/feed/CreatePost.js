"use client";
import { useRef, useState } from 'react';
import styles from './CreatePost.module.css';
import { useRouter } from 'next/navigation';
import { CalendarClock, FileBox, Image as ImageIcon, ListTodo, MapPin, Smile, X, Check } from 'lucide-react';

const POPULAR_EMOJIS = ['🎮', '🚀', '💡', '🔥', '❤️', '⭐', '👾', '🕹️', '🎨', '💻', '📈', '🛠️', '🏆', '✨', '☕', '🧠', '⚡', '🎉', '🌟', '🛡️'];
const POPULAR_LOCATIONS = ['İstanbul Game Lab', 'GDC San Francisco', 'Gamescom Cologne', 'Remote / Ev Ofis', 'Ankara Teknokent', 'İzmir Bilişim Vadisi', 'Tokyo Game Show'];
const SCHEDULE_OPTIONS = ['1 Saat Sonra', 'Yarın Sabah 09:00', 'Bu Cuma 18:00', 'Pazartesi 10:00', 'Önümüzdeki Hafta'];

export default function CreatePost({ dict, currentUser }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const fileBoxRef = useRef(null);
  const [content, setContent] = useState('');
  const [mediaData, setMediaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Interactive popup states
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);

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

  const handleFileBoxSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setContent(prev => prev + (prev ? '\n\n' : '') + `📁 [3D Model / Dosya: ${file.name}]`);
    }
  };

  const handlePollClick = () => {
    const pollTemplate = "\n\n📊 Anket / Görev Listesi:\n[ ] Seçenek 1\n[ ] Seçenek 2\n[ ] Seçenek 3";
    setContent(prev => prev + pollTemplate);
  };

  const handleEmojiSelect = (emoji) => {
    setContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleLocationSelect = (loc) => {
    setContent(prev => prev + (prev ? '\n\n' : '') + `📍 [Konum: ${loc}]`);
    setShowLocationPicker(false);
  };

  const handleScheduleSelect = (time) => {
    setContent(prev => prev + (prev ? '\n\n' : '') + `🕒 [Yayın Zamanı: ${time}]`);
    setShowSchedulePicker(false);
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
        setError(data.error || "Bir hata oluştu");
      } else {
        setContent('');
        setMediaData(null);
        setShowEmojiPicker(false);
        setShowLocationPicker(false);
        setShowSchedulePicker(false);
        router.refresh();
      }
    } catch (err) {
      setError("Bir hata oluştu");
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
            placeholder="Bugün oyunun veya projen hakkında ne düşünüyorsun?"
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

        {/* Emoji Picker Popup */}
        {showEmojiPicker && (
          <div style={{ padding: '0.75rem', background: 'var(--panel-raised)', border: '1px solid rgba(105, 228, 255, 0.22)', borderRadius: '10px', marginBottom: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', zIndex: 20 }}>
            {POPULAR_EMOJIS.map(emoji => (
              <button key={emoji} type="button" onClick={() => handleEmojiSelect(emoji)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', padding: '0.2rem' }}>
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Location Picker Popup */}
        {showLocationPicker && (
          <div style={{ padding: '0.75rem', background: 'var(--panel-raised)', border: '1px solid rgba(105, 228, 255, 0.22)', borderRadius: '10px', marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', zIndex: 20 }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Etkinlik veya Stüdyo Konumu Seç:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {POPULAR_LOCATIONS.map(loc => (
                <button key={loc} type="button" onClick={() => handleLocationSelect(loc)} style={{ background: 'var(--card-dark)', border: '1px solid var(--border-dark)', color: 'white', padding: '0.35rem 0.7rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  📍 {loc}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Schedule Picker Popup */}
        {showSchedulePicker && (
          <div style={{ padding: '0.75rem', background: 'var(--panel-raised)', border: '1px solid rgba(105, 228, 255, 0.22)', borderRadius: '10px', marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', zIndex: 20 }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Gönderi Yayınlanma Zamanı Planla:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {SCHEDULE_OPTIONS.map(time => (
                <button key={time} type="button" onClick={() => handleScheduleSelect(time)} style={{ background: 'var(--card-dark)', border: '1px solid var(--border-dark)', color: 'white', padding: '0.35rem 0.7rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  🕒 {time}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.toolbar}>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleImageSelect}
            />
            <input
              type="file"
              accept=".obj,.fbx,.gltf,.glb,.zip,.pdf,.doc,.docx"
              hidden
              ref={fileBoxRef}
              onChange={handleFileBoxSelect}
            />
            <button type="button" className={styles.toolBtn} onClick={() => fileInputRef.current.click()} title="Görsel Ekle">
              <ImageIcon size={20} />
            </button>
            <button type="button" className={styles.toolBtn} onClick={() => fileBoxRef.current.click()} title="3D Model / Dosya Ekle">
              <FileBox size={20} />
            </button>
            <button type="button" className={styles.toolBtn} onClick={handlePollClick} title="Anket / Görev Listesi Ekle">
              <ListTodo size={20} />
            </button>
            <button type="button" className={styles.toolBtn} onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowLocationPicker(false); setShowSchedulePicker(false); }} title="Emoji Ekle">
              <Smile size={20} color={showEmojiPicker ? 'var(--accent)' : 'inherit'} />
            </button>
            <button type="button" className={styles.toolBtn} onClick={() => { setShowSchedulePicker(!showSchedulePicker); setShowEmojiPicker(false); setShowLocationPicker(false); }} title="Zamanlanmış Gönderi">
              <CalendarClock size={20} color={showSchedulePicker ? 'var(--accent)' : 'inherit'} />
            </button>
            <button type="button" className={styles.toolBtn} onClick={() => { setShowLocationPicker(!showLocationPicker); setShowEmojiPicker(false); setShowSchedulePicker(false); }} title="Konum Ekle">
              <MapPin size={20} color={showLocationPicker ? 'var(--accent)' : 'inherit'} />
            </button>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading || (!content.trim() && !mediaData)}>
            {loading ? "Yayınlanıyor..." : dict.sidebar.post}
          </button>
        </div>
      </form>
    </div>
  );
}
