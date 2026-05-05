@echo off
echo Lutfen bekleyin, onceki hatalar temizleniyor ve dosyalar hazirlaniyor...
rmdir /s /q .git
git init
git add .
git commit -m "Ludenx v1 Temiz Yukleme"
git branch -M main
git remote add origin https://github.com/DenizScott/project_ludenx_1.git
git push -u -f origin main
echo.
echo Islem TAMAMLANDI! Artik Vercel'e gidip sitenizi yayinlayabilirsiniz.
pause
