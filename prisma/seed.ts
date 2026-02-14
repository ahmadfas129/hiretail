import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash admin password
  const hashedPassword = await bcrypt.hash('@Abc123456', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hiretail.com' },
    update: {},
    create: {
      email: 'admin@hiretail.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create sample products with real images
  const products = [
    {
      name: 'Power Drill Set',
      description: 'Professional 20V cordless drill with battery and charger',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&q=80',
      category: 'Tools',
    },
    {
      name: 'Paint Roller Kit',
      description: 'Complete painting kit with roller, tray, and extension pole',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80',
      category: 'Paint',
    },
    {
      name: 'LED Work Light',
      description: 'Portable 5000 lumen LED work light with stand',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&q=80',
      category: 'Lighting',
    },
    {
      name: 'Safety Glasses Pack',
      description: 'Pack of 3 ANSI certified safety glasses',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1609840114035-3c981407e31f?w=500&q=80',
      category: 'Safety',
    },
    {
      name: 'Ladder 6ft',
      description: 'Aluminum step ladder with 300lb weight capacity',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=500&q=80',
      category: 'Ladders',
    },
    {
      name: 'Circular Saw',
      description: '15-amp corded circular saw with laser guide',
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&q=80',
      category: 'Tools',
    },
    {
      name: 'Work Gloves',
      description: 'Heavy-duty leather work gloves - Large',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1603022505613-c47a397e7a90?w=500&q=80',
      category: 'Safety',
    },
    {
      name: 'Tool Storage Box',
      description: '20-inch portable tool box with metal latches',
      price: 44.99,
      image: 'https://images.unsplash.com/photo-1586864387634-51445b84bfff?w=500&q=80',
      category: 'Storage',
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('✅ Created sample products');
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
