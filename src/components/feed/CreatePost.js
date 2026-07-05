"use client";
import { useRef, useState } from 'react';
import styles from './CreatePost.module.css';
import { useRouter } from 'next/navigation';
import { CalendarClock, FileBox, Image as ImageIcon, ListTodo, MapPin, Smile, X, Check, FileText, BarChart2, Plus, Trash2 } from 'lucide-react';

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

  // Rich visual attachment states
  const [attachedFile, setAttachedFile] = useState(null);
  const [pollOptions, setPollOptions] = useState(null);

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
      setAttachedFile({
        name: file.name,
        size: (file.size / 1024 > 1024) ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(1)} KB`,
        type: file.name.split('.').pop().toUpperCase()
      });
    }
  };

  const handlePollClick = () => {
    if (pollOptions) {
      setPollOptions(null);
    } else {
      setPollOptions(["Oynanış (Gameplay) Mekanikleri", "Görsel Sanat & Tasarım", "Ses & Müzik Atmosferi"]);
    }
  };

  const updatePollOption = (index, value) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
  };

  const addPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, `Seçenek ${pollOptions.length + 1}`]);
    }
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      const updated = pollOptions.filter((_, idx) => idx !== index);
      setPollOptions(updated);
    }
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
    if (!content.trim() && !mediaData && !attachedFile && !pollOptions) return;

    setLoading(true);
    setError('');

    try {
      let finalContent = content;
      if (attachedFile) {
        finalContent += `\n\n[FILE_ASSET:{"name":"${attachedFile.name}","size":"${attachedFile.size}","type":"${attachedFile.type}"}]`;
      }
      if (pollOptions && pollOptions.length >= 2) {
        const cleanOptions = pollOptions.filter(o => o.trim());
        if (cleanOptions.length >= 2) {
          finalContent += `\n\n[POLL_ASSET:{"options":${JSON.stringify(cleanOptions)}}]`;
        }
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: finalContent, mediaUrl: mediaData }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Bir hata oluştu");
      } else {
        setContent('');
        setMediaData(null);
        setAttachedFile(null);
        setPollOptions(null);
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

        {/* Görsel Önizleme (Image Preview) */}
        {mediaData && (
          <div className={styles.previewContainer}>
            <img src={mediaData} alt="Preview" className={styles.imagePreview} />
            <button type="button" className={styles.removeMediaBtn} onClick={() => setMediaData(null)} title="Görseli Kaldır">
              <X size={16} />
            </button>
          </div>
        )}

        {/* 3D Model / Dosya Önizleme Kartı (Visual File Box Preview) */}
        {attachedFile && (
          <div style={{ margin: '0.75rem 0 0 3rem', padding: '0.85rem 1.2rem', background: 'var(--panel-raised)', border: '1px solid rgba(105, 228, 255, 0.28)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 'fit-content', maxWidth: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(105, 228, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                <FileBox size={22} />
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', wordBreak: 'break-all' }}>{attachedFile.name}</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <span style={{ fontSize: '0.75rem', background: 'var(--card-dark)', padding: '0.1rem 0.5rem', borderRadius: '4px', color: 'var(--accent)', fontWeight: 'bold' }}>{attachedFile.type} VARLIK</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{attachedFile.size}</span>
                </div>
              </div>
            </div>
            <button type="button" onClick={() => setAttachedFile(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem', marginLeft: '1rem' }} title="Dosyayı Kaldır">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Anket / Görev Listesi Düzenleme Kartı (Visual Poll Preview) */}
        {pollOptions && (
          <div style={{ margin: '0.75rem 0 0 3rem', padding: '1rem 1.2rem', background: 'var(--panel-raised)', border: '1px solid rgba(255, 191, 71, 0.28)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.6rem', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 191, 71, 0.15)', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-amber)', fontWeight: 'bold', fontSize: '0.95rem' }}>
                <BarChart2 size={18} /> Topluluk Anketi & Görev Oylaması
              </div>
              <button type="button" onClick={() => setPollOptions(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Anketi Kaldır">
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.2rem' }}>
              {pollOptions.map((opt, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', minWidth: '60px' }}>Seçenek {idx + 1}:</span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => updatePollOption(idx, e.target.value)}
                    placeholder={`Seçenek ${idx + 1} yazın...`}
                    style={{ flex: 1, background: 'var(--card-dark)', border: '1px solid var(--border-dark)', color: 'white', padding: '0.4rem 0.7rem', borderRadius: '6px', fontSize: '0.9rem', outline: 'none' }}
                  />
                  {pollOptions.length > 2 && (
                    <button type="button" onClick={() => removePollOption(idx)} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '0.2rem' }} title="Seçeneği Sil">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {pollOptions.length < 5 && (
              <button type="button" onClick={addPollOption} style={{ background: 'transparent', border: '1px dashed var(--accent-amber)', color: 'var(--accent-amber)', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '0.3rem' }}>
                <Plus size={16} /> Seçenek Ekle
              </button>
            )}
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
            <button type="button" className={styles.toolBtn} onClick={() => fileInputRef.current.click()} title="Görsel Ekle" style={{ background: mediaData ? 'rgba(105, 228, 255, 0.15)' : 'transparent' }}>
              <ImageIcon size={20} />
            </button>
            <button type="button" className={styles.toolBtn} onClick={() => fileBoxRef.current.click()} title="3D Model / Dosya Ekle" style={{ background: attachedFile ? 'rgba(105, 228, 255, 0.15)' : 'transparent' }}>
              <FileBox size={20} />
            </button>
            <button type="button" className={styles.toolBtn} onClick={handlePollClick} title="Anket / Görev Listesi Ekle" style={{ background: pollOptions ? 'rgba(255, 191, 71, 0.15)' : 'transparent' }}>
              <ListTodo size={20} color={pollOptions ? 'var(--accent-amber)' : 'inherit'} />
            </button>
            <button type="button" className={styles.toolBtn} onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowLocationPicker(false); setShowSchedulePicker(false); }} title="Emoji Ekle" style={{ background: showEmojiPicker ? 'rgba(105, 228, 255, 0.15)' : 'transparent' }}>
              <Smile size={20} color={showEmojiPicker ? 'var(--accent)' : 'inherit'} />
            </button>
            <button type="button" className={styles.toolBtn} onClick={() => { setShowSchedulePicker(!showSchedulePicker); setShowEmojiPicker(false); setShowLocationPicker(false); }} title="Zamanlanmış Gönderi" style={{ background: showSchedulePicker ? 'rgba(105, 228, 255, 0.15)' : 'transparent' }}>
              <CalendarClock size={20} color={showSchedulePicker ? 'var(--accent)' : 'inherit'} />
            </button>
            <button type="button" className={styles.toolBtn} onClick={() => { setShowLocationPicker(!showLocationPicker); setShowEmojiPicker(false); setShowSchedulePicker(false); }} title="Konum Ekle" style={{ background: showLocationPicker ? 'rgba(105, 228, 255, 0.15)' : 'transparent' }}>
              <MapPin size={20} color={showLocationPicker ? 'var(--accent)' : 'inherit'} />
            </button>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading || (!content.trim() && !mediaData && !attachedFile && !pollOptions)}>
            {loading ? "Yayınlanıyor..." : dict.sidebar.post}
          </button>
        </div>
      </form>
    </div>
  );
}
