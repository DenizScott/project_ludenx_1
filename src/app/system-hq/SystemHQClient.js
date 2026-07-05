"use client";
import { useState } from 'react';
import styles from './system-hq.module.css';
import { Shield, Lock, Trash2, CheckCircle, Ban, Search, AlertTriangle, Key, Plus, X, Users, MessageSquare, ArrowLeft, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SystemHQClient({ initialAuth, initialWords, initialFlaggedPosts, initialReports, initialUsers, initialPosts }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('moderation'); // 'moderation' or 'profiles'
  const [words, setWords] = useState(initialWords || []);
  const [newWord, setNewWord] = useState('');
  
  const [flaggedPosts, setFlaggedPosts] = useState(initialFlaggedPosts || []);
  const [reports, setReports] = useState(initialReports || []);
  const [users, setUsers] = useState(initialUsers || []);
  const [posts, setPosts] = useState(initialPosts || []);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (!pin) return;
    setLoading(true);
    try {
      const res = await fetch('/api/master/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Yanlış Şifre!");
      }
    } catch (err) {
      alert("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/master/verify', { method: 'DELETE' });
    setIsAuthenticated(false);
    router.refresh();
  };

  const handleAddWord = async (e) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    try {
      const res = await fetch('/api/master/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_word', payload: { keyword: newWord } }),
      });
      if (res.ok) {
        const data = await res.json();
        setWords([...words.filter(w => w.keyword !== data.word.keyword), data.word]);
        setNewWord('');
      } else {
        alert("Kelime eklenemedi.");
      }
    } catch (err) {
      alert("Hata oluştu.");
    }
  };

  const handleDeleteWord = async (id) => {
    try {
      const res = await fetch('/api/master/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_word', payload: { id } }),
      });
      if (res.ok) {
        setWords(words.filter(w => w.id !== id));
      }
    } catch (err) {}
  };

  const handleResolveReport = async (reportId) => {
    try {
      const res = await fetch('/api/master/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resolve_report', payload: { reportId } }),
      });
      if (res.ok) {
        setReports(reports.filter(r => r.id !== reportId));
      }
    } catch (err) {}
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Fikri kalıcı olarak silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch('/api/master/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_post_master', payload: { postId } }),
      });
      if (res.ok) {
        setFlaggedPosts(flaggedPosts.filter(p => p.id !== postId));
        setPosts(posts.filter(p => p.id !== postId));
      }
    } catch (err) {}
  };

  const handleBanUser = async (userId, currentStatus) => {
    if (!confirm(currentStatus ? "Yasağı kaldırmak istiyor musunuz?" : "Kullanıcıyı yasaklamak istiyor musunuz?")) return;
    try {
      const res = await fetch('/api/master/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ban_user_master', payload: { userId, banStatus: !currentStatus } }),
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, isBanned: !currentStatus } : u));
      }
    } catch (err) {}
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Kullanıcıyı kalıcı olarak silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch('/api/master/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_user_master', payload: { userId } }),
      });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId));
      }
    } catch (err) {}
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.pinContainer}>
        <div className={styles.pinBox}>
          <div className={styles.pinTitle}>
            <Lock size={28} color="#ff0055" /> Master Control HQ
          </div>
          <p className={styles.pinSubtitle}>
            Standart hesaplardan bağımsız, sadece site sahibine (Owner) özel şifreli giriş.
          </p>
          <form onSubmit={handlePinSubmit}>
            <input
              type="password"
              placeholder="MASTER PIN / ŞİFRE"
              className={styles.pinInput}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
            />
            <button type="submit" className={styles.pinBtn} disabled={loading}>
              {loading ? "Doğrulanıyor..." : "Ağ Geçidini Aç"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return (u.name && u.name.toLowerCase().includes(q)) ||
           (u.username && u.username.toLowerCase().includes(q)) ||
           (u.email && u.email.toLowerCase().includes(q));
  });

  const filteredPosts = posts.filter(p => {
    const q = searchQuery.toLowerCase();
    return (p.content && p.content.toLowerCase().includes(q)) ||
           (p.author?.name && p.author.name.toLowerCase().includes(q)) ||
           (p.author?.username && p.author.username.toLowerCase().includes(q));
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleBox}>
          <h1>
            <Shield size={32} color="#ff0055" />
            LudenOS Master Control HQ
            <span className={styles.badge}>SAHİBİNE ÖZEL</span>
          </h1>
          <p className={styles.subtitle}>Bağımsız güvenlik ağ geçidi, kelime süzgeci ve global platform yönetimi</p>
        </div>
        <div className={styles.headerActions}>
          <a href="/feed" className={styles.backBtn}>
            <ArrowLeft size={18} /> Akışa Dön
          </a>
          <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={18} /> Master Oturumu Kapat
          </button>
        </div>
      </header>

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'moderation' ? styles.active : ''}`}
          onClick={() => setActiveTab('moderation')}
        >
          <AlertTriangle size={18} /> 🛡️ Süzgeç & Şikayetler ({flaggedPosts.length + reports.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'profiles' ? styles.active : ''}`}
          onClick={() => setActiveTab('profiles')}
        >
          <Users size={18} /> ⚙️ Profiller & Sistem Yönetimi ({users.length})
        </button>
      </div>

      {activeTab === 'moderation' ? (
        <div className={styles.section}>
          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                <Key size={20} color="#00f2fe" /> Süzgeç Kelime Filtresi
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
                Buraya eklediğiniz kelimeler bir fikir paylaşıldığı an otomatik taranır, fikir filtrelenir ve önünüze düşer.
              </p>
              <form onSubmit={handleAddWord} className={styles.wordForm}>
                <input
                  type="text"
                  placeholder="Yasaklı kelime ekle..."
                  className={styles.wordInput}
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                />
                <button type="submit" className={styles.addBtn}><Plus size={18} /></button>
              </form>
              <div className={styles.wordList}>
                {words.map(w => (
                  <span key={w.id} className={styles.wordTag}>
                    {w.keyword}
                    <button type="button" onClick={() => handleDeleteWord(w.id)} className={styles.deleteWordBtn}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                <AlertTriangle size={20} color="#ff0055" /> Süzgece Takılanlar & Şikayet Edilenler
              </h3>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Yazar</th>
                      <th>İçerik / Sebep</th>
                      <th>Durum</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flaggedPosts.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className={styles.userInfo}>
                            <div className={styles.avatarFallback}>
                              {p.author?.name ? p.author.name[0].toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className={styles.nameText}>{p.author?.name || 'İsimsiz'}</p>
                              <p className={styles.userHandle}>{p.author?.username}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>{p.content}</div>
                          <span className={styles.flagBadge}>
                            <AlertTriangle size={14} /> {p.flagReason || 'Süzgeç Tespiti'}
                          </span>
                        </td>
                        <td><span style={{ color: '#ff0055', fontWeight: 'bold' }}>Süzgeçte</span></td>
                        <td>
                          <div className={styles.actionGroup}>
                            <button type="button" onClick={() => handleDeletePost(p.id)} className={styles.btnDelete}>
                              <Trash2 size={14} /> Fikri Sil
                            </button>
                            <button type="button" onClick={() => handleBanUser(p.author?.id, false)} className={styles.btnBan}>
                              <Ban size={14} /> Yazarı Yasakla
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {reports.map(r => (
                      <tr key={r.id}>
                        <td>
                          <span style={{ color: '#94a3b8' }}>Şikayet No: {r.id.slice(-6)}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 'bold', color: '#00f2fe' }}>Sebep: {r.reason}</div>
                          <div style={{ fontSize: '0.85rem' }}>{r.details || (r.post ? r.post.content : 'Prospektif şikayet')}</div>
                        </td>
                        <td><span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{r.status}</span></td>
                        <td>
                          <div className={styles.actionGroup}>
                            <button type="button" onClick={() => handleResolveReport(r.id)} className={styles.btnApprove}>
                              <CheckCircle size={14} /> Çözüldü Yap
                            </button>
                            {r.postId && (
                              <button type="button" onClick={() => handleDeletePost(r.postId)} className={styles.btnDelete}>
                                <Trash2 size={14} /> Sil
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {flaggedPosts.length === 0 && reports.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                          Süzgece takılan veya şikayet edilen herhangi bir içerik bulunmuyor. Temiz!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.section}>
          <div className={styles.searchBar}>
            <Search size={18} color="#00f2fe" />
            <input
              type="text"
              placeholder="İsim, kullanıcı adı veya fikir içeriği ara..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                <Users size={20} color="#00f2fe" /> Profiller Yönetimi ({filteredUsers.length})
              </h3>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Kullanıcı</th>
                      <th>E-Posta</th>
                      <th>Durum</th>
                      <th>Aksiyon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div className={styles.userInfo}>
                            <div className={styles.avatarFallback}>
                              {u.name ? u.name[0].toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className={styles.nameText}>{u.name || 'İsimsiz'}</p>
                              <p className={styles.userHandle}>{u.username || u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          {u.isBanned ? (
                            <span style={{ color: '#ff0055', fontWeight: 'bold' }}>Yasaklı</span>
                          ) : (
                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>Aktif</span>
                          )}
                        </td>
                        <td>
                          <div className={styles.actionGroup}>
                            <button type="button" onClick={() => handleBanUser(u.id, u.isBanned)} className={u.isBanned ? styles.btnApprove : styles.btnBan}>
                              <Ban size={14} /> {u.isBanned ? "Aç" : "Yasakla"}
                            </button>
                            <button type="button" onClick={() => handleDeleteUser(u.id)} className={styles.btnDelete}>
                              <Trash2 size={14} /> Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                <MessageSquare size={20} color="#ff0055" /> Fikirler Yönetimi ({filteredPosts.length})
              </h3>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Yazar</th>
                      <th>İçerik</th>
                      <th>Aksiyon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map(p => (
                      <tr key={p.id}>
                        <td>
                          <span className={styles.nameText}>{p.author?.name || 'İsimsiz'}</span>
                          <div className={styles.userHandle}>{p.author?.username}</div>
                        </td>
                        <td>{p.content}</td>
                        <td>
                          <button type="button" onClick={() => handleDeletePost(p.id)} className={styles.btnDelete}>
                            <Trash2 size={14} /> Sil
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
