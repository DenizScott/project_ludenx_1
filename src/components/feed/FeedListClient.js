"use client";
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PostCard from '@/components/feed/PostCard';

export default function FeedListClient({ initialPosts = [], currentUser, dict, queryKey = ['posts', 'feed'] }) {
  const queryClient = useQueryClient();

  const { data: posts } = useQuery({
    queryKey,
    queryFn: async () => initialPosts,
    initialData: initialPosts,
    staleTime: 1000 * 60 * 5, // 5 dakika boyunca önbellekten anında saniyesinde getir
  });

  useEffect(() => {
    if (initialPosts) {
      queryClient.setQueryData(queryKey, initialPosts);
    }
  }, [initialPosts, queryKey, queryClient]);

  if (!posts || posts.length === 0) {
    return <p style={{ color: '#8892B0', textAlign: 'center', marginTop: '2rem' }}>Henüz paylaşılan bir fikir yok. İlk fikrini sen yayınla!</p>;
  }

  return (
    <>
      {posts.map(post => (
        <PostCard key={post.id} post={post} currentUser={currentUser} dict={dict} />
      ))}
    </>
  );
}
