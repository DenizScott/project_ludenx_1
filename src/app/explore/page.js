import { Telescope } from 'lucide-react';

export default function ExplorePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', color: 'var(--text-muted)' }}>
      <Telescope size={64} style={{ marginBottom: '1.5rem', color: 'var(--accent)', opacity: 0.8 }} />
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>Vitrin</h2>
      <p style={{ fontSize: '1.1rem' }}>Stüdyo, prototip ve oyun vitrinleri yakında burada.</p>
    </div>
  );
}
