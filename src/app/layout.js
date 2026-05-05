import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider';

export const metadata = {
  title: 'Ludenx',
  description: 'The modern social platform for game developers and designers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
