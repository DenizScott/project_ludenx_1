# 🎮 LUDENOS: MASTER PROJE DOKÜMANTASYONU & YAPAY ZEKA (AI) BİLGİ BANKASI

Bu doküman; **LudenOS** platformunun vizyonunu, A'dan Z'ye tüm teknik mimarisini, veritabanı şemasını, bugüne kadar yapılan tüm özel mühendislik geliştirmelerini, yeni marka/terminoloji standartlarını ve çalışma mantığını **tek bir detayı bile kaçırmadan** eksiksiz olarak özetlemek amacıyla hazırlanmıştır. 

Bu dosya, **Gemini** veya başka bir büyük dil modeli (LLM) ile fikir alışverişi yaparken, yeni özellikler için prompt hazırlarken veya projeye yeni bir yapay zeka asistanı entegre ederken platformun tüm DNA'sını saniyeler içinde anlayabilmesi için tasarlanmış **nihai (master) referans kaynağıdır**.

---

## 1. 🌟 PROJE VİZYONU, KONSEPT VE FELSEFİ TEMEL
**LudenOS**, adını oyun bilimi anlamına gelen *"Ludology"* teriminden ve bir işletim sistemi gibi çalışan kapsamlı merkez ("OS") kavramından alan, oyun geliştiricilerine (indie yazılımcılar, oyun tasarımcıları, ses sanatçıları, prodüktörler) ve tutkulu oyunculara özel olarak geliştirilmiş **"Fikir ve Prototip Merkezi (Idea & Prototype Hub)"** odaklı yeni nesil bir sosyal platformdur.

* **Temel Problem ve Çözüm:** Standart sosyal medya platformları (Twitter/X, Instagram, Discord) oyun geliştirme süreçlerinin doğasına (build notları paylaşma, prototip aşamalarını sergileme, topluluktan erken aşama geri bildirim alma, ekip arkadaşı bulma) uygun mekanizmalar sunmaz. LudenOS; geliştiricilerin her gün projelerindeki ilerlemeleri ve oyun fikirlerini (**Fikir**) paylaşabildiği, oyuncuların geliştirme aşamasındaki oyunlara erken reaksiyon verebildiği, fütüristik ve siberpunk estetiğe sahip profesyonel bir ekosistem sunar.

---

## 2. 🛠️ A'DAN Z'YE TEKNİK MİMARİ VE TEKNOLOJİ YIĞITI (TECH STACK)
LudenOS, maksimum performans, ölçeklenebilirlik ve yüksek kullanıcı deneyimi (UX) hedeflenerek modern web teknolojilerinin en güncel standartlarıyla inşa edilmiştir:

1. **Çekirdek Framework: Next.js 14.2.3 (App Router Mimarisi)**
   * Sunucu Taraflı Oluşturma (SSR) ve İstemci Taraflı Etkileşim (Client Components - `"use client"`) tam bir hibrit uyumla çalışır. Sayfa yönlendirmeleri `/src/app` dizini altındaki modern App Router yapısıyla yönetilir.
2. **Veritabanı ve Barındırma: Supabase (PostgreSQL - AWS eu-west-1)**
   * Veritabanı bulutta Supabase üzerinde barındırılmaktadır. Bağlantı yönetiminde yüksek trafik yükünü kaldırabilmek için **PgBouncer (Connection Pooling - Port 6543)** üzerinden `DATABASE_URL`, migrasyonlar ve doğrudan şema işlemleri için ise **Port 5432** üzerinden `DIRECT_URL` kullanılır.
3. **ORM (Object-Relational Mapping): Prisma ORM v5**
   * Veritabanı sorguları, tip güvenliği (type-safety) sağlayan `@prisma/client` ve kimlik doğrulama entegrasyonu için `@next-auth/prisma-adapter` ile yönetilir.
4. **Kimlik Doğrulama & Oturum Yönetimi: NextAuth.js v4**
   * İki farklı giriş mekanizması desteklenir:
     * **Google OAuth Provider:** Tek tıkla güvenli Google hesabı girişi.
     * **Credentials Provider (Yerel E-posta & Şifre):** Kullanıcıların şifreleri veritabanına asla açık metin olarak kaydedilmez; endüstri standardı olan **`bcryptjs`** kütüphanesi ile kriptografik olarak hash'lenerek (`passwordHash`) saklanır.
   * Oturum stratejisi olarak performans ve güvenlik için **JWT (JSON Web Token)** kullanılır.
5. **Görüntü İşleme & Kırpma: `react-easy-crop` & Canvas API**
   * Kullanıcılar profil resmi yüklediğinde, görsel sunucuya gitmeden önce tarayıcı üzerinde (client-side) açılan özel bir modal ile 1:1 kare oranında kırpılır, yakınlaştırılır ve HTML5 Canvas API (`getCroppedImg`) üzerinden optimize edilmiş base64/blob formatına dönüştürülerek sisteme alınır.
6. **Arayüz Tasarımı & Stil Sistemi: Pure Vanilla CSS Modules**
   * **Önemli Mimari Karar:** Projede Tailwind CSS veya ağır UI kütüphaneleri (MUI, Bootstrap vb.) **kullanılmamıştır**. Maksimum render hızı, esneklik ve tam kontrol için her bileşene özel **`.module.css`** dosyaları ve merkezi **`globals.css`** tasarım değişkenleri (CSS Tokens) tercih edilmiştir.
   * **Renk Paleti:** Sitenin tasarımı koyu siberpunk lacivert (`#0a101d` / `#0f172a`), parlak turkuaz (`#38bdf8`) ve altın amber (`#f59e0b`) ışımalarıyla donatılmıştır.
7. **İkonografi ve Markama: Lucide-React & Özel BrandMark**
   * Platformun tüm ikonları modern ve minimal `lucide-react` paketinden sağlanır. Platformun ana logosu ise koda dayalı özel **`BrandMark`** bileşenidir; sol tarafta net **LudenOS** yazısı ve sağ tarafında siber çip çemberli altın/turkuaz devreyi temsil eden SVG ikonu yer alır.
8. **Çoklu Dil Desteği (i18n): JSON Sözlük Altyapısı**
   * Türkçe (`tr.json`) ve İngilizce (`en.json`) dilleri `/src/lib/dictionaries/` altında tutulur; arayüz metinleri dinamik olarak sözlükten beslenir. "Devlog" terimleri tamamen **"Fikir"** (Idea) olarak standardize edilmiştir.

---

## 3. 🗄️ VERİTABANI ŞEMASI VE İLİŞKİSEL MODELLER (PRISMA SCHEMA DETAYLARI)
Platformun veritabanı, ilişkisel bütünlüğü koruyan ve veri kalıntısı bırakmayan (Cascade Deletion) 6 ana modelden oluşur:

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?   // Ad Soyad
  email         String?   @unique
  image         String?   @db.Text // Profil resmi URL veya base64
  username      String?   @unique  // Standart @kullaniciadi
  passwordHash  String?   // Bcrypt şifre hash'i
  bio           String?   // Biyografi metni
  isBanned      Boolean   @default(false) // Admin ban kontrolü
  createdAt     DateTime  @default(now())
  
  // İlişkiler
  posts         Post[]
  comments      Comment[]
  likes         Like[]
  followers     Follow[]  @relation("Following")
  following     Follow[]  @relation("Follower")
  notificationsReceived Notification[] @relation("ReceivedNotifications")
  notificationsSent     Notification[] @relation("SentNotifications")
}

model Post {
  id         String   @id @default(cuid())
  content    String   // Fikir/Gönderi metni
  mediaUrl   String?  @db.Text // Resim/Görsel eklentisi
  mediaType  String?  
  createdAt  DateTime @default(now())
  authorId   String
  author     User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  comments      Comment[]
  notifications Notification[]
  likes         Like[]
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
}

model Like {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([userId, postId]) // Aynı kullanıcı bir fikre sadece 1 kez tepki verebilir
}

model Follow {
  followerId  String
  followingId String
  createdAt   DateTime @default(now())
  follower    User @relation("Follower", fields: [followerId], references: [id])
  following   User @relation("Following", fields: [followingId], references: [id])

  @@id([followerId, followingId]) // Çift yönlü birincil anahtar
}

model Notification {
  id          String   @id @default(cuid())
  type        String   // "LIKE", "COMMENT", "FOLLOW", "REPOST", "MENTION"
  read        Boolean  @default(false)
  createdAt   DateTime @default(now())
  recipientId String
  recipient   User     @relation("ReceivedNotifications", fields: [recipientId], references: [id], onDelete: Cascade)
  senderId    String
  sender      User     @relation("SentNotifications", fields: [senderId], references: [id], onDelete: Cascade)
  postId      String?
  post        Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)
}
```
*(Not: Ayrıca NextAuth için `Account`, `Session` ve `VerificationToken` modelleri entegredir).*

---

## 4. 🗺️ SAYFA SAYFA UYGULAMA HARİTASI VE ÇALIŞMA MANTIĞI

### A. `/login` (Kimlik Doğrulama & Kayıt Portalı)
* **Görsel Yapı:** Koyu siberpunk arayüz üzerinde ortalanmış form kartı ve üstte **BrandMark** logosu ("LudenOS").
* **Giriş / Kayıt Geçişi:** Tek butonla "Giriş Yap" ve "Kayıt Ol" modları arasında anlık geçiş.
* **Akıllı Doğrulamalar:** 
  * Şifre gücü kontrolü: En az 6 karakter, en az 1 büyük harf ve en az 1 özel karakter (`!@#$%^&*` vb.) zorunluluğu.
  * Kullanıcı adı denetimi: Girilen metnin otomatik olarak küçük harfe çevrilmesi, boşlukların silinmesi ve başına zorunlu `@` işaretinin eklenmesi.
* **Resim Kırpma (Avatar Upload):** Kayıt ekranında profil resmi seçildiğinde açılan, yakınlaştırma (zoom) ve kaydırma yapılabilen `Cropper` arayüzü.
* **Google OAuth Button:** `/api/auth/signin` üzerinden Google ile anında giriş tetikleyicisi.

### B. `/feed` & `/following` (Akış & Takımım Ana Ekranı)
* **Sekmeli Akış (Tabs):**
  * **Akış (`/feed`):** Platformdaki tüm geliştiricilerin paylaştığı en son fikirler ve projeler.
  * **Takımım (`/following`):** Sadece kullanıcının takip ettiği (ekibine aldığı) kişilerin içerikleri.
* **Gönderi Paylaşım Alanı (`CreatePost`):** * "Bugün aklında ne var?" * sorusuyla geliştiriciyi karşılayan, sadeleştirilmiş paylaşım kutusu. Metin yazımı ve görsel eklentisi desteği.
* **Etkileşimli Gönderi Kartı (`PostCard`):**
  * Yazarın profil resmi, adı, `@kullaniciadi` (tıklandığında profife gider) ve paylaşım zamanı.
  * Anlık reaksiyon verebilen **Tepki (Beğeni)** butonu (beğenildiğinde kırmızı/mor parlama animasyonu ve sayı artışı).
  * Açılıp kapanabilen **Not (Yorum)** alanı ("Fikre yorum ekle...") ve anlık yorum gönderme formu.
  * Yazar veya Admin için sağ üstte **Silme** butonu.

### C. `/explore` (Vitrin & Gelişmiş Arama)
* **Geliştirici Keşfi:** Oyun dünyasındaki öne çıkan geliştiricileri ve projeleri listeleme.
* **Sade Arama Alanı:** Placeholder metni sadece **"Ara"** olarak sadeştirilmiş arama kutusu ile `@username` veya ad-soyad üzerinden geliştiricileri ve fikirleri anlık filtreleme.

### D. `/notifications` (Akıllı Bildirim Merkezi)
* **İki Sekmeli Ayrışma:**
  * **Etkileşimler (Interactions):** Beğeni (`LIKE`), yorum (`COMMENT`) ve takip (`FOLLOW`) bildirimleri ("X fikrine tepki verdi", "X fikrine not bıraktı").
  * **Bahsetmeler (Mentions):** Kullanıcının adının geçtiği özel etkileşimler ("X bir fikirde senden bahsetti").
* **Gezinilebilirlik (Direct Navigation):** Bildirim kartlarının üzerine tıklandığında, kullanıcının doğrudan ilgili fikrin (`/post/[id]`) veya kişilerin (`/@username`) sayfasına yönlendirilmesi.

### E. `/[username]` (Dinamik Stüdyo & Profil Sayfası)
* **Rota Standardizasyonu:** Tüm profiller istisnasız **`/@kullaniciadi`** (örn: `/@denizscott`) formatıyla açılır.
* **Profil Künyesi:** Avatar, ad soyad, biyografi, katılma tarihi, takipçi ve takip edilen sayıları.
* **Dört Alt Sekme:**
  * **Fikirler:** Kullanıcının paylaştığı tüm fikir gönderileri.
  * **Yanıtlar:** Kullanıcının başkalarına yazdığı yorumlar.
  * **Medya:** Sadece resim ve görsel içeren gönderiler.
  * **Tepkiler (Liked Posts):** Kullanıcının platformda bugüne kadar reaksiyon gösterdiği tüm fikirlerin veritabanından çekilerek listelendiği özel arşiv sekmesi.
* **Admin Kontrol Paneli:** Eğer girişi yapan kişi kurucu admin ise (`@denizscott`), profil sayfasında **"Yönetici Seçenekleri"** butonu belirir. Buradan hesabı kalıcı olarak banlama (`isBanned: true`) veya silme yetkisi çalışır.

---

## 5. 🚀 BUGÜNE KADAR YAPILAN MÜHENDİSLİK DEVRİMLERİ & ÖZEL GELİŞTİRMELER

Proje geliştirme sürecinde standart kalıpların dışına çıkılarak hayata geçirilen en kritik teknik kararlar şunlardır:

### 1. LudenOS Marka ve Terminoloji Dönüşümü (Brand Rebirth)
Platform, "LudenX" isminden **"LudenOS"** ismine başarıyla taşınmıştır. Standart sosyal ağ jargonundan tamamen uzaklaşılarak:
* "Devlog" terimi A'dan Z'ye **"Fikir" (Idea)** kavramıyla değiştirildi.
* Akış paylaşım alanı placeholder metni *"Bugün aklında ne var?"* olarak yalınlaştırıldı.
* Arama kutusu etiketleri sadece *"Ara"* olarak netleştirildi.
* Sağ tarafta bulunan geliştirici panosu metinleri *"Öne Çıkan Fikirler"* (Featured Ideas) başlığı altında daha sade, net ve anlaşılır hale getirildi.

### 2. Siberpunk Çip İkonlu BrandMark ve Palet
Platformun yeni logosu, `BrandMark.js` içinde özel bir SVG olarak inşa edildi: Sol tarafta kalın ve net beyaz sans-serif **LudenOS** yazısı, sağ tarafta ise siberpunk turkuaz (`#38bdf8`) ve altın amber (`#f59e0b`) yıldız patlaması devre hatları saçan yuvarlak kare siber çip ikonu entegre edildi. Arka plan gradyanları bu cybernetic parlamalarla uyumlu hale getirildi.

### 3. Harici Dosyasız, Gerçek Zamanlı ve İşitsel Bildirim Motoru (`NotificationListener.js`)
* **Arka Plan Yoklaması (Polling):** Bileşen, kullanıcının oturumu açık olduğu sürece her 15 saniyede bir `/api/notifications/unread` uç noktasını sessizce yoklar.
* **Web Audio API Ses Sentezleyicisi (Bip Sesi):** Projede `.mp3` veya `.wav` gibi harici ses dosyaları kullanmak yerine, tarayıcının donanımsal **Web Audio API** motoru kullanılmıştır. Yeni bir bildirim algılandığında bir osilatör (OscillatorNode) devreye girer; frekansı 600Hz'den 1200Hz'e eksponansiyel olarak tırmanır ve GainNode ile yumuşak bir ses sönümlemesi yapılarak fütüristik, rahatsız etmeyen bir "bip" uyarısı sentezlenir.
* **Dinamik Canlı Rozet (Badge Count):** Okunmamış bildirim olduğunda sol menüdeki zil ikonuna DOM manipülasyonu ile anlık kırmızı/amber bir rozet iliştirilir. Sayı 9'dan büyükse **`+9`**, değilse tam sayı gösterilir; bildirimler okunduğunda rozet anında kaybolur.

### 4. Dinamik ve Akıllı Mobil Üst Başlık (`TopHeader.js`)
Mobil cihazların dar ekranlarında alanı maksimize etmek için üst bar dinamik hale getirilmiştir:
* Kullanıcı **Akış (`/feed`)** veya **Takımım (`/following`)** sayfasındaysa, üst barda logo ve hemen altında akış sekmeleri belirir.
* Kullanıcı alt menüden **Keşfet/Arama (`/explore`)** butonuna bastığında ise bu sekmeler animasyonla kaybolur ve üst bar doğrudan net bir **"Ara"** kutusuna dönüşür.

### 5. URL ve Rota Standardizasyonu (`/@username`)
Uygulamanın tüm yönlendirmeleri istisnasız **`/@username`** formatına standardize edilmiştir. `SidebarNav`, `TopHeader`, `PostCard`, `Comment` ve `Notification` bileşenlerinin tamamı bu rotalamaya sadık çalışır.

### 6. Veri Temizliği ve HTTP Header Hatası Koruması
Platformun felsefesini bulandırmamak adına eski özel mesajlaşma (chat) modülü tamamen temizlendi. Ayrıca geliştirme aşamasında oluşan çerez yükü kaynaklı `HTTP 431 Request Header Fields Too Large` hatası, `package.json` dev scriptine `node --max-http-header-size=65536` bayrağı eklenerek kalıcı olarak engellendi.

### 7. Yama Notları (Patch Notes) ve AI Senkronizasyon Sistemi
Projede yapılan her büyük geliştirme sonrası AI asistanları ile paylaşımları kolaylaştırmak amacıyla `Yama_Notlari/` dizini oluşturulmuştur. Kullanıcı *"gelişmeleri gemini ile paylaşacağım"* dediğinde otomatik olarak ardışık isimlendirilen (`Yama_Notlari_1.md`, `Yama_Notlari_2.md` vb.) özet raporlar üretilerek hem dosyaya kaydedilir hem de artifact olarak sunulur.

---

## 6. 🤖 GEMINI & AI ASİSTANLARI İÇİN PROMPT YAZIM VE GELİŞTİRME REHBERİ

Gemini veya başka bir yapay zeka modeliyle bu proje üzerine konuşurken, yeni bir özellik istemeden önce veya prompt yazarken modelin aşağıdaki **5 Altın Kurala** uymasını sağlayın:

1. **CSS ve Stil Kuralı (No Tailwind!):**
   > *"LudenOS projesinde Tailwind CSS veya inline stil asla kullanılmamaktadır. Lütfen yazdığın her bileşen için Vanilla CSS Modules (`BilesenAdı.module.css`) kullan ve renkler için `globals.css` içerisindeki siberpunk değişkenleri (`--accent-cyan`, `--bg-dark`, `--accent-amber`) tercih et."*
2. **Profil Rotalama Kuralı (`/@username`):**
   > *"Herhangi bir kullanıcı profiline link (`<Link>`) oluştururken asla `/profile/[id]` yapısını kullanma. Her zaman `/@${user.username?.replace('@', '') || user.email?.split('@')[0]}` standart formatını kullan."*
3. **Terminoloji ve İkonografi Kuralı (Fikir & Lucide-React):**
   > *"Uygulamada ikon kullanırken yalnızca `lucide-react` kütüphanesinden import et. Platform logosu için `<BrandMark />` bileşenini kullan. Platformdaki paylaşımları 'devlog' olarak değil daima 'Fikir' (Idea) olarak adlandır."*
4. **Çift Yönlü Responsive UI Kuralı (Masaüstü & Mobil):**
   > *"LudenOS'in navigasyonu masaüstünde sol menü (`SidebarNav.js`), mobilde ise alt menü ve dinamik üst başlık (`TopHeader.js`) olarak ikiye ayrılır. Ekleyeceğin yeni bir sayfa veya sekmeyi mutlaka bu iki bileşene de uyumlu şekilde entegre et."*
5. **Veritabanı İlişki ve ORM Kuralı (Prisma):**
   > *"Veritabanında yeni bir sorgu yazarken veya şema güncellerken Prisma ORM standartlarını kullan. Supabase üzerindeki PostgreSQL ilişkisel bütünlüğünü (Cascade onDelete vb.) korumaya dikkat et."*

---

### 💡 GEMINI İLE FİKİR ALIŞVERİŞİ İÇİN ÖRNEK PROMPT ŞABLONU:

Aşağıdaki şablonu kopyalayıp Gemini'ye yapıştırarak projeye anında hakim olmasını sağlayabilir ve yeni fikirler üretebilirsiniz:

> **"Merhaba Gemini! Ben 'LudenOS' adında oyun geliştiricilerine ve tasarımcılarına özel bir Fikir ve Prototip Merkezi sosyal platformu geliştiriyorum. Projenin mimarisi Next.js 14 (App Router), Supabase PostgreSQL, Prisma ORM, NextAuth ve Pure Vanilla CSS Modules üzerine kurulu. Projede Web Audio API ile canlı sesli bildirimler, `/@username` rotalaması, sekmeli akışlar, resim kırpma ve koyu lacivert/cyan/amber siberpunk bir tasarım dili mevcut. Sana projemin Master Dokümantasyonunu veriyorum [Bu dökümanın içeriğini buraya yapıştırın veya referans gösterin]. Şimdi seninle LudenOS'e ekleyebileceğimiz [Örn: Geliştiricilerin oyun prototiplerini doğrudan tarayıcıda test edebileceği bir WebGL vitrin sekmesi / Oyun Game Jam'leri düzenleme modülü / Prototip oylama sistemi] özelliği üzerine fikir alışverişi yapmak ve mimariyi tasarlamak istiyorum. Bu yeni özelliği mevcut Prisma şemama ve Vanilla CSS tasarım dilime en uygun şekilde nasıl entegre edebiliriz?"**

---
*Bu doküman LudenOS platformunun en güncel sürümü ve yeni marka estetiği esas alınarak Antigravity AI tarafından oluşturulmuştur.*
