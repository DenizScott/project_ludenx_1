"use client";
import { useEffect, useState } from 'react';
import styles from '@/app/feed/feed.module.css';
import { Heart, MessageSquare, Repeat2, Send, Trash2 } from 'lucide-react';
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
        <p>{post.content}</p>
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
          title={dict.feed.like}
        >
          <Heart size={17} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{likes > 0 ? likes : dict.feed.like}</span>
        </button>

        <button
          className={`${styles.actionBtn} ${isReposted ? styles.actionActiveGreen : ''}`}
          onClick={handleRepost}
          title="Kayda al"
        >
          <Repeat2 size={17} />
          <span>{reposts > 0 ? reposts : 'Kayit'}</span>
        </button>

        <button
          className={`${styles.actionBtn} ${showComments ? styles.actionActiveBlue : ''}`}
          onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
          title={dict.feed.comment}
        >
          <MessageSquare size={17} fill={showComments ? 'currentColor' : 'none'} />
          <span>{localComments.length > 0 ? localComments.length : dict.feed.comment}</span>
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
