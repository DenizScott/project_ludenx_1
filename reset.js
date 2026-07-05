const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Veritabanı sıfırlama işlemi başlıyor...");
  await prisma.follow.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.like.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("✅ Veritabanındaki tüm gönderiler, kullanıcılar ve kalıntılar başarıyla temizlendi! Site sıfırdan yapılmış gibi temiz.");
}

main().catch(console.error).finally(() => prisma.$disconnect());

