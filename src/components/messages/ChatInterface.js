"use client";
import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ChatInterface({ initialMessages, currentUserId, partnerId }) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const tempId = Date.now().toString();
    const optimisticMessage = { id: tempId, content: newMessage, senderId: currentUserId, receiverId: partnerId, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: optimisticMessage.content, receiverId: partnerId })
      });
      if (res.ok) {
        const savedMessage = await res.json();
        setMessages(prev => prev.map(m => m.id === tempId ? savedMessage : m));
        router.refresh();
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>Mesajlaşmaya başlayın!</div>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                backgroundColor: isMe ? 'var(--accent)' : 'var(--card-dark)',
                color: 'white',
                padding: '0.8rem 1.2rem',
                borderRadius: isMe ? '16px 16px 0 16px' : '16px 16px 16px 0',
                maxWidth: '75%',
                wordBreak: 'break-word',
                border: isMe ? 'none' : '1px solid var(--border-dark)'
              }}>
                {msg.content}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-dark)', backgroundColor: 'var(--bg-dark)' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Bir mesaj yaz..."
            style={{
              flex: 1,
              backgroundColor: 'var(--card-dark)',
              border: '1px solid var(--border-dark)',
              borderRadius: '9999px',
              padding: '0.8rem 1.5rem',
              color: 'white',
              outline: 'none'
            }}
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim() || isSending}
            style={{ 
              width: '44px', height: '44px', 
              borderRadius: '50%', 
              backgroundColor: newMessage.trim() ? 'var(--accent)' : 'var(--border-dark)', 
              color: 'white', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              border: 'none', cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s'
            }}
          >
            <Send size={18} style={{ marginLeft: '-2px' }} />
          </button>
        </form>
      </div>
    </>
  );
}
