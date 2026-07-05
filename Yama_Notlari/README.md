# 📋 LUDENOS YAMA NOTLARI (PATCH NOTES) TAKİP ve KURALLAR SİSTEMİ

Bu klasör, **LudenOS** projesinde Master Dokümantasyon (`LudenOS_Proje_Dokumantasyonu.md`) oluşturulduktan sonra gerçekleştirilen tüm yeni geliştirmeleri, mimari güncellemeleri, hata düzeltmelerini ve yepyeni özellikleri **Gemini (veya diğer LLM'ler)** ile paylaşmak üzere tasarlanmış periyodik **"Yama Notları" (Patch Notes)** arşivini barındırır.

---

## ⚙️ ÇALIŞMA PRENSİBİ VE YAPAY ZEKA (AI) KURALI

Kullanıcı, yapay zeka asistanına **"gelişmeleri gemini ile paylaşacağım"** (veya benzeri bir bildirim) dediğinde, yapay zeka asistanı aşağıdaki adımları **zorunlu olarak** uygular:

1. **Zaman Tespiti:** Bir önceki yama notundan (veya ilk defa isteniyorsa Master Dokümantasyondan) bu yana yapılan tüm kod değişikliklerini (`git diff`, yeni eklenen bileşenler, güncellenen CSS veya Prisma şema değişiklikleri) tarar.
2. **Yama Notu İçeriği Hazırlama:** Yapılan değişiklikleri sadece "şu dosya değişti" şeklinde değil, **Gemini'nin teknik mimariyi ve bağlamı anlayabileceği şekilde**:
   * Yeni eklenen özelliklerin mantığı ve kullanım amacı,
   * Eğer varsa veritabanına (Prisma) eklenen yeni modeller veya alanlar,
   * Arayüzde (CSS Modules) ve rotalamada yapılan UX yenilikleri,
   * Alınan önemli mühendislik kararları
   detaylıca özetlenir.
3. **Sıralı İsimlendirme ve Kaydetme:**
   * Klasördeki mevcut yama notları kontrol edilir.
   * Henüz hiç yama notu yoksa **`Yama_Notlari_1.md`** adıyla kaydedilir.
   * Bir sonraki talepte **`Yama_Notlari_2.md`**, **`Yama_Notlari_3.md`** şeklinde ardışık numara verilerek hem bu klasöre (`Yama_Notlari/`) kaydedilir hem de kullanıcıya **AI Artifact** olarak sunulur.

---

### 📂 YAMA NOTLARI ARŞİVİ:
* *(Henüz yeni bir geliştirme yapılmadığı için ilk yama notu bekleniyor. İlk geliştirme döngüsünden sonra `Yama_Notlari_1.md` buraya eklenecektir.)*
