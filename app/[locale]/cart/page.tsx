'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ContentLayout from '@/components/ContentLayout';
import { useCart } from '@/lib/cartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const locale = useLocale();
  const t = useTranslations('cart');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutCanceled, setCheckoutCanceled] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setCheckoutSuccess(true);
      clearCart();
      setTimeout(() => setCheckoutSuccess(false), 5000);
    }
    if (searchParams.get('canceled') === 'true') {
      setCheckoutCanceled(true);
      setTimeout(() => setCheckoutCanceled(false), 5000);
    }
  }, [searchParams, clearCart]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cart-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          locale,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session');
        setLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to proceed to checkout');
      setLoading(false);
    }
  };

  if (items.length === 0 && !checkoutSuccess) {
    return (
      <ContentLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to get started!</p>
            <Link
              href={`/${locale}/categories`}
              className="inline-block px-8 py-4 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 transition"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </ContentLayout>
    );
  }

  if (items.length === 0 && checkoutSuccess) {
    return (
      <ContentLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Alert */}
          <div className="mb-6 p-6 bg-green-100 border border-green-400 text-green-700 rounded-md text-center">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-2xl font-bold mb-2">Payment Successful!</p>
            <p className="text-lg">Thank you for your purchase. Your order has been confirmed.</p>
          </div>

          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Your cart is now empty</h2>
            <p className="text-gray-600 mb-8">Continue shopping to add more items!</p>
            <div className="flex gap-4 justify-center">
              <Link
                href={`/${locale}/categories`}
                className="inline-block px-8 py-4 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 transition"
              >
                Browse Products
              </Link>
              <Link
                href={`/${locale}/dashboard`}
                className="inline-block px-8 py-4 border-2 border-primary text-primary rounded-md font-semibold hover:bg-primary/10 transition"
              >
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Alert */}
        {checkoutSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            <p className="font-semibold">✓ Payment Successful!</p>
            <p>Thank you for your purchase. Your order has been confirmed.</p>
          </div>
        )}

        {/* Canceled Alert */}
        {checkoutCanceled && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
            <p className="font-semibold">Checkout Canceled</p>
            <p>Your payment was not processed. Your cart items are still here.</p>
          </div>
        )}

        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-lg p-4 flex gap-4"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="text-primary font-bold mb-3">${item.price.toFixed(2)}</p>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 border-x">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="w-full py-3 border-2 border-red-500 text-red-500 rounded-md font-semibold hover:bg-red-50 transition"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${(totalPrice * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${(totalPrice * 1.1).toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={loading}
                className={`w-full py-4 rounded-md font-semibold transition mb-3 ${
                  loading 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              <Link
                href={`/${locale}/categories`}
                className="block w-full py-3 border-2 border-gray-300 text-center text-accent rounded-md font-semibold hover:bg-gray-100 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
