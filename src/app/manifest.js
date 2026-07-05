export default function manifest() {
  return {
    name: 'LudenOS Social & Idea Hub',
    short_name: 'LudenOS',
    description: 'Oyun geliştiricileri ve tasarımcıları için modern fikir paylaşım platformu.',
    start_url: '/feed',
    display: 'standalone',
    background_color: '#081018',
    theme_color: '#0e1117',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  };
}
