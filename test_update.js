const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'coskundenizkarci@gmail.com';
  // A tiny 1x1 blue pixel base64 image
  const fakeBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

  const user = await prisma.user.update({
    where: { email },
    data: { image: fakeBase64 }
  });

  console.log("Updated user image successfully! Length:", user.image?.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
