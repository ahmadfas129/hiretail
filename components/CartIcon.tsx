'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

export default function CartIcon({ locale }: { locale: string }) {
  const { totalItems } = useCart();

  return (
    <Link
      href={`/${locale}/cart`}
      className="relative p-2 text-accent hover:text-primary transition"
    >
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
