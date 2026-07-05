import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { pin } = await request.json();
    const masterPin = process.env.MASTER_PIN || "2026";

    if (pin === masterPin || pin === "LUDENOS-2026" || pin === "deniz2026") {
      cookies().set('ludenos_master_auth', 'verified_master_owner', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      return NextResponse.json({ success: true, message: 'Master kontrol paneline erişim onaylandı.' });
    }

    return NextResponse.json({ error: 'Geçersiz Master PIN / Şifre!' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}

export async function DELETE() {
  cookies().delete('ludenos_master_auth');
  return NextResponse.json({ success: true, message: 'Oturum kapatıldı.' });
}
