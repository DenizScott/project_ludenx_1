import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { pin } = await request.json();
    const masterPin = process.env.MASTER_PIN || "1q2w3e4R5T6Y!Cemre2007!Deniz121222005!CoskunKarciHulyaKarciBedreddinFatmaSehribanİbrahimSerife@";

    if (pin === masterPin || pin === "1q2w3e4R5T6Y!Cemre2007!Deniz121222005!CoskunKarciHulyaKarciBedreddinFatmaSehribanİbrahimSerife@") {
      cookies().set('ludenos_master_auth', 'verified_master_owner', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      return NextResponse.json({ success: true, message: 'Master kontrol paneline erişim onaylandı.' });
    }

    return NextResponse.json({ error: 'Geçersiz Master Şifre!' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}

export async function DELETE() {
  cookies().delete('ludenos_master_auth');
  return NextResponse.json({ success: true, message: 'Oturum kapatıldı.' });
}
