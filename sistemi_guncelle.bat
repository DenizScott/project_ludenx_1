@echo off
echo Lutfen bekleyin, yeni ozellikler icin paketler yukleniyor...
call npm install @next-auth/prisma-adapter bcryptjs

echo.
echo Veritabani semasi guncelleniyor (Giris Sistemi icin)...
call npx prisma db push

echo.
echo İslem TAMAMLANDI! Su an acik olan "npm run dev" terminalinizi CTRL+C ile kapatip tekrar baslatabilirsiniz.
pause
