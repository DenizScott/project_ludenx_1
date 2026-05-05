"use client";
import { useState, useEffect } from 'react';
import styles from '@/app/feed/feed.module.css';
import { Heart, MessageSquare, Share2, Repeat2, Send, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import DeletePostButton from './DeletePostButton';

export default function PostCard({ post, currentUser, dict, autoShowComments = false }) {
  const router = useRouter();
  
  const initialLikes = post.likes?.length || 0;
  const initialIsLiked = currentUser && post.likes?.some(like => like.userId === currentUser.id);

  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked || false);
  
  useEffect(() => {
    setLikes(post.likes?.length || 0);
    setIsLiked(currentUser && post.likes?.some(like => like.userId === currentUser.id) || false);
  }, [post.likes, currentUser]);
  
  const [reposts, setReposts] = useState(0);
  const [isReposted, setIsReposted] = useState(false);
  
  const isOwner = post.author?.username === '@denizscott' || post.author?.username === 'denizscott' || post.author?.email?.includes('denizscott');
  const isCurrentUserOwner = currentUser?.username === '@denizscott' || currentUser?.username === 'denizscott' || currentUser?.email?.includes('denizscott');

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
    } else {
      return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  };

  const [showComments, setShowComments] = useState(autoShowComments);
  
  useEffect(() => {
    if (autoShowComments) {
      setShowComments(true);
    }
  }, [autoShowComments]);

  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState(post.comments || []);
  
  useEffect(() => {
    setLocalComments(post.comments || []);
  }, [post.comments]);
  
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
    } catch(err) {
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
    } catch(err) {
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
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.postCard} onClick={navigateToPost} style={{ cursor: 'pointer' }}>
      <div className={styles.postHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
          <div className={styles.avatar} onClick={(e) => { e.stopPropagation(); router.push(`/@${post.author?.username?.replace('@', '') || post.author?.email?.split('@')[0]}`); }}>
            {post.author?.image ? (
              <img src={post.author.image} alt="Avatar" style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} />
            ) : (
              post.author?.name ? post.author.name[0].toUpperCase() : 'U'
            )}
          </div>
          <div className={styles.authorInfo} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
            <span className={styles.authorName} onClick={(e) => { e.stopPropagation(); router.push(`/@${post.author?.username?.replace('@', '') || post.author?.email?.split('@')[0]}`); }} style={{ cursor: 'pointer' }}>
              {post.author?.name || 'Kullanıcı'}
            </span>
            <span className={styles.authorUsername} onClick={(e) => { e.stopPropagation(); router.push(`/@${post.author?.username?.replace('@', '') || post.author?.email?.split('@')[0]}`); }} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
              {post.author?.username || `@${post.author?.email?.split('@')[0]}`}
              {isOwner && (
                <span title="Owner of LudenX" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#e0245e', color: 'white', borderRadius: '50%', width: '16px', height: '16px', marginLeft: '4px', cursor: 'default' }}>
                  <Crown size={10} strokeWidth={3} />
                </span>
              )}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>·</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{formatTime(post.createdAt)}</span>
          </div>
          {(currentUser?.id === post.authorId || isCurrentUserOwner) && (
            <div className={styles.deleteBtnWrapper}>
              <DeletePostButton postId={post.id} />
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.postContent}>
        <p>{post.content}</p>
        {post.mediaUrl && (
           <div className={styles.mediaContainer}>
             <img src={post.mediaUrl} alt="Post media" className={styles.media} style={{ width: '100%', borderRadius: '16px', marginTop: '1rem' }} />
           </div>
        )}
      </div>

      <div className={styles.postActions} style={{ justifyContent: 'space-between', paddingLeft: '4rem', paddingRight: '2rem' }}>
        <button 
          className={`${styles.actionBtn} ${styles.likeBtn}`} 
          style={{ color: isLiked ? '#f91880' : undefined }}
          onClick={handleLike}
          title="Beğen"
        >
          <Heart size={18} fill={isLiked ? '#f91880' : 'none'} />
          <span style={{marginLeft: '6px', fontSize: '0.85rem'}}>{likes > 0 ? likes : ''}</span>
        </button>

        <button 
          className={`${styles.actionBtn} ${styles.repostBtn}`} 
          style={{ color: isReposted ? '#00ba7c' : undefined }}
          onClick={handleRepost}
          title="Tekrar Paylaş"
        >
          <Repeat2 size={18} />
          <span style={{marginLeft: '6px', fontSize: '0.85rem'}}>{reposts > 0 ? reposts : ''}</span>
        </button>

        <button 
          className={`${styles.actionBtn} ${styles.commentBtn}`} 
          style={{ color: showComments ? '#1d9bf0' : undefined }}
          onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
          title="Yorum Yap"
        >
          <MessageSquare size={18} fill={showComments ? '#1d9bf0' : 'none'} />
          <span style={{marginLeft: '6px', fontSize: '0.85rem'}}>{localComments.length > 0 ? localComments.length : ''}</span>
        </button>
      </div>

      {showComments && (
        <div style={{ paddingLeft: '4rem', marginTop: '1rem', borderTop: '1px solid var(--border-dark)', paddingTop: '1rem' }}>
          
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              placeholder="Yanıtını gönder..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-dark)', color: 'white', padding: '0.8rem 1rem', borderRadius: '9999px', outline: 'none' }}
              disabled={isSubmitting}
            />
            <button 
              type="submit" 
              disabled={isSubmitting || !commentText.trim()}
              style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: (!commentText.trim() || isSubmitting) ? 0.5 : 1 }}
            >
              <Send size={18} />
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {localComments.map((comment, idx) => (
              <div key={comment.id || idx} style={{ display: 'flex', gap: '0.8rem' }}>
                <div 
                  onClick={(e) => { e.stopPropagation(); router.push(`/${comment.author?.username || '@' + comment.author?.email?.split('@')[0]}`); }}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {comment.author?.image ? <img src={comment.author.image} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : (comment.author?.name ? comment.author.name[0].toUpperCase() : 'U')}
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem' }}>
                    <span 
                      onClick={(e) => { e.stopPropagation(); router.push(`/${comment.author?.username || '@' + comment.author?.email?.split('@')[0]}`); }}
                      style={{ fontWeight: 'bold', color: 'var(--text-dark)', cursor: 'pointer' }}
                    >
                      {comment.author?.name}
                    </span>
                    <span 
                      onClick={(e) => { e.stopPropagation(); router.push(`/${comment.author?.username || '@' + comment.author?.email?.split('@')[0]}`); }}
                      style={{ color: 'var(--text-muted)', marginLeft: '0.5rem', cursor: 'pointer' }}
                    >
                      {comment.author?.username || `@${comment.author?.email?.split('@')[0]}`}
                    </span>
                  </div>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.95rem' }}>{comment.content}</p>
                </div>
                {(currentUser?.id === comment.authorId || isCurrentUserOwner) && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteComment(comment.id); }}
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    title="Yorumu Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
