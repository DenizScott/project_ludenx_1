"use client";
import { useEffect, useState } from 'react';
import styles from '@/app/feed/feed.module.css';
import { Heart, MessageSquare, Repeat2, Send, Trash2, FileBox, BarChart2, Check, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DeletePostButton from './DeletePostButton';

export default function PostCard({ post, currentUser, dict, autoShowComments = false }) {
  const router = useRouter();

  const initialLikes = post.likes?.length || 0;
  const initialIsLiked = currentUser && post.likes?.some(like => like.userId === currentUser.id);

  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked || false);
  const [reposts, setReposts] = useState(0);
  const [isReposted, setIsReposted] = useState(false);
  const [showComments, setShowComments] = useState(autoShowComments);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState(post.comments || []);

  const authorSlug = post.author?.username?.replace('@', '') || post.author?.email?.split('@')[0];

  useEffect(() => {
    setLikes(post.likes?.length || 0);
    setIsLiked(currentUser && post.likes?.some(like => like.userId === currentUser.id) || false);
  }, [post.likes, currentUser]);

  useEffect(() => {
    if (autoShowComments) setShowComments(true);
  }, [autoShowComments]);

  useEffect(() => {
    setLocalComments(post.comments || []);
  }, [post.comments]);

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 24) {
      return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false });
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays)}g`;
    }
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const openAuthor = (e, slug = authorSlug) => {
    e.stopPropagation();
    if (slug) router.push(`/@${slug.replace('@', '')}`);
  };

  const navigateToPost = (e) => {
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('form') || e.target.closest('input')) return;
    router.push(`/post/${post.id}`);
  };

  const handleLike = async () => {
    if (!currentUser) return;

    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST' });
      if (!res.ok) {
        setIsLiked(isLiked);
        setLikes(prev => isLiked ? prev + 1 : prev - 1);
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setIsLiked(isLiked);
      setLikes(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  const handleRepost = () => {
    setIsReposted(!isReposted);
    setReposts(prev => isReposted ? prev - 1 : prev + 1);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setLocalComments([newComment, ...localComments]);
        setCommentText('');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`/api/posts/${post.id}/comments?commentId=${commentId}`, { method: 'DELETE' });
      if (res.ok) {
        setLocalComments(localComments.filter(c => c.id !== commentId));
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <article className={styles.postCard} onClick={navigateToPost}>
      <div className={styles.devlogStripe} />
      <header className={styles.postHeader}>
        <button className={styles.avatarButton} onClick={(e) => openAuthor(e)} aria-label="Profil ac">
          <div className={styles.avatar}>
            {post.author?.image ? (
              <img src={post.author.image} alt="Avatar" />
            ) : (
              post.author?.name ? post.author.name[0].toUpperCase() : 'U'
            )}
          </div>
        </button>

        <div className={styles.authorInfo}>
          <button className={styles.authorName} onClick={(e) => openAuthor(e)}>
            {post.author?.name || 'Kullanici'}
          </button>
          <div className={styles.metaLine}>
            <button className={styles.authorUsername} onClick={(e) => openAuthor(e)}>
              {post.author?.username || `@${post.author?.email?.split('@')[0]}`}
            </button>
            <span>{formatTime(post.createdAt)}</span>
          </div>
        </div>

        {currentUser?.id === post.authorId && (
          <div className={styles.deleteBtnWrapper}>
            <DeletePostButton postId={post.id} />
          </div>
        )}
      </header>

      <div className={styles.postContent}>
        <span className={styles.devlogLabel}>Fikir</span>
        <FormattedPostContent text={post.content} />
        {post.mediaUrl && (
          <div className={styles.mediaContainer}>
            <img src={post.mediaUrl} alt="Post media" className={styles.media} />
          </div>
        )}
      </div>

      <div className={styles.postActions}>
        <button
          className={`${styles.actionBtn} ${isLiked ? styles.actionActive : ''}`}
          onClick={handleLike}
          title={dict?.feed?.like || "Beğen"}
        >
          <Heart size={17} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{likes > 0 ? likes : (dict?.feed?.like || "Beğen")}</span>
        </button>

        <button
          className={`${styles.actionBtn} ${isReposted ? styles.actionActiveGreen : ''}`}
          onClick={handleRepost}
          title={dict?.feed?.share || "Tekrar Paylaş"}
        >
          <Repeat2 size={17} />
          <span>{reposts > 0 ? reposts : (dict?.feed?.share || "Tekrar Paylaş")}</span>
        </button>

        <button
          className={`${styles.actionBtn} ${showComments ? styles.actionActiveBlue : ''}`}
          onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
          title={dict?.feed?.comment || "Yorumla"}
        >
          <MessageSquare size={17} fill={showComments ? 'currentColor' : 'none'} />
          <span>{localComments.length > 0 ? localComments.length : (dict?.feed?.comment || "Yorumla")}</span>
        </button>
      </div>

      {showComments && (
        <div className={styles.commentsPanel}>
          <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
            <input
              type="text"
              placeholder="Fikre yorum ekle..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isSubmitting}
            />
            <button type="submit" disabled={isSubmitting || !commentText.trim()} title="Yorumu gonder">
              <Send size={18} />
            </button>
          </form>

          <div className={styles.commentList}>
            {localComments.map((comment, idx) => {
              const commentSlug = comment.author?.username || `@${comment.author?.email?.split('@')[0]}`;
              return (
                <div key={comment.id || idx} className={styles.commentItem}>
                  <button className={styles.commentAvatar} onClick={(e) => openAuthor(e, commentSlug)}>
                    {comment.author?.image ? <img src={comment.author.image} alt="" /> : (comment.author?.name ? comment.author.name[0].toUpperCase() : 'U')}
                  </button>
                  <div className={styles.commentBody}>
                    <div className={styles.commentMeta}>
                      <button onClick={(e) => openAuthor(e, commentSlug)}>{comment.author?.name}</button>
                      <span>{comment.author?.username || `@${comment.author?.email?.split('@')[0]}`}</span>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                  {currentUser?.id === comment.authorId && (
                    <button
                      className={styles.commentDelete}
                      onClick={(e) => { e.stopPropagation(); handleDeleteComment(comment.id); }}
                      title="Yorumu sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}

function FormattedPostContent({ text }) {
  if (!text) return null;
  let mainText = text;
  let fileAsset = null;
  let pollAsset = null;

  // Parse [FILE_ASSET:{...}]
  const fileMatch = mainText.match(/\[FILE_ASSET:(.*?)\]/);
  if (fileMatch) {
    try {
      fileAsset = JSON.parse(fileMatch[1]);
      mainText = mainText.replace(fileMatch[0], '').trim();
    } catch (e) {}
  }

  // Parse [POLL_ASSET:{...}]
  const pollMatch = mainText.match(/\[POLL_ASSET:(.*?)\]/);
  if (pollMatch) {
    try {
      pollAsset = JSON.parse(pollMatch[1]);
      mainText = mainText.replace(pollMatch[0], '').trim();
    } catch (e) {}
  }

  // Legacy check for string poll format
  const legacyPollIdx = mainText.indexOf("📊 Anket / Görev Listesi:");
  if (!pollAsset && legacyPollIdx !== -1) {
    const pollSection = mainText.substring(legacyPollIdx);
    mainText = mainText.substring(0, legacyPollIdx).trim();
    const lines = pollSection.split('\n').map(l => l.trim()).filter(Boolean);
    const options = [];
    lines.forEach(l => {
      if (l.startsWith('[ ]') || l.startsWith('[x]')) {
        options.push(l.replace(/\[[ x]\]/, '').trim());
      }
    });
    if (options.length > 0) pollAsset = { options };
  }

  // Legacy check for 3D Model file string
  const legacyFileMatch = mainText.match(/📁 \[3D Model \/ Dosya:(.*?)\]/);
  if (!fileAsset && legacyFileMatch) {
    fileAsset = { name: legacyFileMatch[1].trim(), size: "Varlık Paketi", type: "3D MODEL" };
    mainText = mainText.replace(legacyFileMatch[0], '').trim();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      {mainText && <p style={{ whiteSpace: 'pre-line', margin: 0, lineHeight: '1.5' }}>{mainText}</p>}

      {fileAsset && (
        <div style={{ padding: '0.85rem 1.2rem', background: 'var(--panel-raised)', border: '1px solid rgba(105, 228, 255, 0.28)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '0.4rem', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', overflow: 'hidden' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(105, 228, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
              <FileBox size={22} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{fileAsset.name}</div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', background: 'var(--card-dark)', padding: '0.1rem 0.5rem', borderRadius: '4px', color: 'var(--accent)', fontWeight: 'bold' }}>{fileAsset.type || '3D MODEL'}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fileAsset.size || 'Proje Dosyası'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); alert(`${fileAsset.name} varlık dosyası indiriliyor / önizleniyor...`); }}
            style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-amber))', color: '#081018', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0, transition: 'transform 0.2s' }}
          >
            <Download size={15} /> İndir
          </button>
        </div>
      )}

      {pollAsset && pollAsset.options && (
        <div style={{ padding: '1rem', background: 'var(--panel-raised)', border: '1px solid rgba(255, 191, 71, 0.28)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.4rem', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-amber)', fontWeight: 'bold', fontSize: '0.95rem', borderBottom: '1px solid rgba(255, 191, 71, 0.15)', paddingBottom: '0.4rem' }}>
            <BarChart2 size={18} /> Topluluk Anketi & Görev Oylaması
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.2rem' }}>
            {pollAsset.options.map((opt, idx) => (
              <PollOptionRow key={idx} opt={opt} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PollOptionRow({ opt }) {
  const [voted, setVoted] = useState(false);
  const [votesCount, setVotesCount] = useState(Math.floor(Math.random() * 14) + 2);
  return (
    <div
      onClick={(e) => { e.stopPropagation(); setVoted(!voted); setVotesCount(prev => voted ? prev - 1 : prev + 1); }}
      style={{ padding: '0.65rem 0.9rem', background: voted ? 'rgba(255, 191, 71, 0.15)' : 'var(--card-dark)', border: `1px solid ${voted ? 'var(--accent-amber)' : 'var(--border-dark)'}`, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
        <div style={{ width: '20px', height: '20px', borderRadius: '5px', border: `2px solid ${voted ? 'var(--accent-amber)' : 'var(--text-muted)'}`, background: voted ? 'var(--accent-amber)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {voted && <Check size={13} color="#081018" strokeWidth={3} />}
        </div>
        <span style={{ color: voted ? 'white' : 'var(--text-dark)', fontWeight: voted ? 'bold' : 'normal', fontSize: '0.92rem' }}>{opt}</span>
      </div>
      <span style={{ fontSize: '0.8rem', color: voted ? 'var(--accent-amber)' : 'var(--text-muted)', fontWeight: voted ? 'bold' : 'normal' }}>{votesCount} oy</span>
    </div>
  );
}

