# 🎮 LudenX Proje Dokümantasyonu & Teknik Manifestosu

Bu döküman, LudenX platformunun vizyonunu, teknik altyapısını ve tüm çalışma mantığını detaylandırmak amacıyla hazırlanmıştır.

---

## 1. Proje Vizyonu ve Konsept
**LudenX**, ismini oyun bilimi anlamına gelen "Ludology"den alır. Platformun temel amacı; oyun geliştiricilerinin (indie geliştiriciler, tasarımcılar, yazılımcılar) ve tutkulu oyuncuların bir araya gelerek projelerini paylaştığı, geribildirim aldığı ve etkileşime girdiği "geliştirici odaklı" bir sosyal ağ olmaktır.

---

## 2. Teknik Mimari (Tech Stack)
Platform, modern web teknolojilerinin en güncel sürümleriyle inşa edilmiştir:
- **Framework:** Next.js 14 (App Router) - Server ve Client bileşenlerinin hibrit kullanımı.
- **Veritabanı Yönetimi (ORM):** Prisma ORM.
- **Veritabanı:** Supabase üzerinden barındırılan PostgreSQL.
- **Kimlik Doğrulama:** NextAuth.js (Google OAuth ve Yerel E-posta/Şifre desteği).
- **Stil Yönetimi:** Vanilla CSS ve CSS Modules (Performans ve özelleştirme için).
- **İkon Seti:** Lucide-React.

---

## 3. Veritabanı Modeli (Prisma Schema)
Veritabanı, sosyal etkileşimlerin sürekliliğini sağlamak için ilişkisel bir yapıda kurulmuştur:

- **User:** Kullanıcı profili, biyografi, takipçi sayıları ve admin yetkileri (kurucu: @denizscott).
- **Post:** Metin ve medya (resim) içeren gönderiler.
- **Comment:** Gönderilere yapılan hiyerarşik yorumlar.
- **Like:** Gönderi ve Kullanıcı arasındaki kalıcı ilişki (Beğeni sistemi).
- **Follow:** Kullanıcılar arası takip etme/takip edilme ilişkisi.
- **Notification:** Beğeni, yorum ve takip etkinliklerinde tetiklenen bildirim kayıtları.

---

## 4. Temel Özellikler ve Mantıksal Akış

### A. Profil ve Kullanıcı Adı Sistemi
- Tüm profillere **`/@kullaniciadi`** formatıyla erişilir. 
- Profil sayfalarında "Gönderiler", "Yanıtlar", "Medya" ve "Beğeniler" sekmeleri bulunur.
- **Beğeniler Sekmesi:** Kullanıcının geçmişte beğendiği tüm gönderiler veritabanından çekilerek burada listelenir.

### B. Akıllı Bildirim Sistemi
- **Gerçek Zamanlılık:** `NotificationListener` bileşeni her 15 saniyede bir yeni bildirimleri kontrol eder.
- **Görsel/İşitsel Uyarı:** Yeni bir bildirim geldiğinde sağ altta bir "Popup" belirir ve LudenX'e özgü, Web Audio API ile üretilmiş soft bir bip sesi duyulur.
- **Bildirim Rozeti:** Sol menüdeki zil ikonunda okunmamış sayıları (`1-9` veya `+9`) gösteren kırmızı bir daire yer alır.

### C. Admin ve Güvenlik Kontrolleri
- Kurucu kullanıcı (@denizscott), diğer profillerde "Yönetici Seçenekleri" menüsünü görür.
- Buradan kullanıcıları kalıcı olarak silme veya yasaklama (Ban) yetkisine sahiptir.

### D. Mobil Uyumluluk ve Dinamik Header
- Mobil görünümde Header (üst çubuk) akıllıdır:
  - Anasayfada ise "Sana Özel / Takip Edilenler" sekmelerini gösterir.
  - Arama sayfasında ise bu sekmeler gizlenir ve yerine geniş bir arama kutusu gelir.

---

## 5. Tasarım Dili
- **Renk Paleti:** Koyu gri ve mor (`var(--accent)`) tonları, siberpunk ve profesyonel bir yazılım ortamı hissi verir.
- **Logo (Code-X):** Twitter'ın X logosuna benzememesi için kod yazımında kullanılan `<` ve `>` (büyüktür-küçüktür) işaretlerinin iç içe geçmesiyle oluşturulmuş özgün bir "X" tasarımıdır. Altında bir terminal imleci barındırır.

---

## 6. Mevcut Durum ve Notlar
Proje şu an tüm temel sosyal ağ fonksiyonlarını (paylaşma, beğenme, takip etme, bildirim alma) stabil bir şekilde yerine getirmektedir. Performans optimizasyonları için Vercel (Production) ortamı tercih edilmiştir.

---
*Hazırlayan: Antigravity AI Coding Assistant*
