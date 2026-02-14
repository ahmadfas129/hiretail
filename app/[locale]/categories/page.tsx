import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import ContentLayout from '@/components/ContentLayout';
import { prisma } from '@/lib/prisma';
import { Package } from 'lucide-react';

export default async function CategoriesPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { filter?: string };
}) {
  const t = await getTranslations('categories');

  const filter = searchParams.filter;

  // Fetch products with optional filter
  const products = await prisma.product.findMany({
    where: filter ? { category: filter } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  // Get all categories
  const categories = await prisma.product.groupBy({
    by: ['category'],
    _count: {
      category: true,
    },
  });

  return (
    <ContentLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/${locale}/categories`}
              className={`px-4 py-2 rounded-md transition ${
                !filter
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-accent hover:bg-gray-200'
              }`}
            >
              {t('all')}
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.category}
                href={`/${locale}/categories?filter=${cat.category}`}
                className={`px-4 py-2 rounded-md transition ${
                  filter === cat.category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-accent hover:bg-gray-200'
                }`}
              >
                {cat.category} ({cat._count.category})
              </Link>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <Link
                key={product.id}
                href={`/${locale}/products/${product.id}`}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition group"
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">
                      ${product.price}
                    </span>
                    <span className="text-sm text-gray-500">{product.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">{t('noProducts')}</p>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
