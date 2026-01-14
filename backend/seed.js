const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // 1. Admin User
  const password = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password,
    },
  });

  // 2. Default Search Engines
  const engines = [
    { name: '站内', url: 'local', placeholder: '搜索书签...', sortOrder: 1, isDefault: true },
    { name: 'Google', url: 'https://www.google.com/search?q=', placeholder: 'Google 搜索', sortOrder: 2, isDefault: false },
    { name: 'Bing', url: 'https://www.bing.com/search?q=', placeholder: 'Bing 搜索', sortOrder: 3, isDefault: false },
    { name: '百度', url: 'https://www.baidu.com/s?wd=', placeholder: '百度一下', sortOrder: 4, isDefault: false },
  ];

  for (const eng of engines) {
    await prisma.searchEngine.upsert({
      where: { name: eng.name },
      update: {},
      create: eng,
    });
  }

  console.log('Seed data initialized successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
