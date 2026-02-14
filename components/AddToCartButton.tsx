'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  label: string;
}

export default function AddToCartButton({ product, label }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={added}
      className={`w-full sm:w-auto px-8 py-4 rounded-md font-semibold transition inline-flex items-center justify-center ${
        added
          ? 'bg-green-500 text-white'
          : 'bg-primary text-white hover:bg-primary/90'
      }`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5 mr-2" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5 mr-2" />
          {label}
        </>
      )}
    </button>
  );
}
