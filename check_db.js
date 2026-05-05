const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("USERS IN DB:");
  users.forEach(u => {
    console.log(`- ${u.name} (${u.email}) | Image: ${!!u.image}`);
    if (u.image) {
      console.log(`  Image length: ${u.image.length}`);
      console.log(`  Starts with: ${u.image.substring(0, 50)}`);
    }
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
