import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider';
import ClientProviders from '@/components/providers/ClientProviders';
import PersistentLayoutClient from '@/components/layout/PersistentLayoutClient';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from '@prisma/client';
import { getDictionary } from '@/lib/i18n';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export const metadata = {
  title: 'LudenOS',
  description: 'The modern social platform and idea hub for game developers and designers.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport = {
  themeColor: '#0e1117',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({ children }) {
  const dict = getDictionary();
  const session = await getServerSession(authOptions);
  let currentUser = null;
  if (session?.user?.id) {
    currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  }

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ClientProviders>
            <PersistentLayoutClient currentUser={currentUser} dict={dict}>
              {children}
            </PersistentLayoutClient>
          </ClientProviders>
        </AuthProvider>
      </body>
    </html>
  );
}
