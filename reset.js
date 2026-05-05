const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("Veritabanindaki tum kullanicilar ve gonderiler temizlendi.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
