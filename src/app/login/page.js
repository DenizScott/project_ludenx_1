import { getDictionary } from '@/lib/i18n';
import LoginClient from './LoginClient';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect('/feed');
  }
  const dict = getDictionary();
  return <LoginClient dict={dict} />;
}
