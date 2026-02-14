'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import ContentLayout from '@/components/ContentLayout';
import { Check, Loader2, XCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

const plans = [
  {
    id: 'basic',
    name: 'Basic Seller',
    price: 19,
    priceId: 'price_basic',
    features: [
      'Up to 50 products',
      'Basic analytics',
      'Email support',
      'Standard seller tools',
      '5% transaction fee',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Seller',
    price: 49,
    priceId: 'price_pro',
    featured: true,
    features: [
      'Up to 500 products',
      'Advanced analytics',
      'Priority support',
      'Advanced seller tools',
      '3% transaction fee',
      'Featured listings',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Seller',
    price: 99,
    priceId: 'price_enterprise',
    features: [
      'Unlimited products',
      'Custom analytics',
      '24/7 dedicated support',
      'Enterprise seller tools',
      '1% transaction fee',
      'Premium featured listings',
      'API access',
      'Custom integrations',
    ],
  },
];

export default function PricingPage() {
  const t = useTranslations('pricing');
  const locale = useLocale();
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  const [showCanceledAlert, setShowCanceledAlert] = useState(false);

  useEffect(() => {
    if (searchParams.get('canceled')) {
      setShowCanceledAlert(true);
      // Remove the query parameter
      const timer = setTimeout(() => {
        setShowCanceledAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleSubscribe = async (planId: string, price: number) => {
    if (!session) {
      router.push(`/${locale}/login?callbackUrl=/${locale}/pricing`);
      return;
    }

    setLoading(planId);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planId,
          price: price,
          locale: locale,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
      setLoading(null);
    }
  };

  return (
    <ContentLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Canceled Message */}
        {showCanceledAlert && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md flex items-center">
            <XCircle className="w-5 h-5 mr-2" />
            Checkout was canceled. You can try again anytime.
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg border-2 p-8 ${
                plan.featured
                  ? 'border-primary shadow-xl scale-105'
                  : 'border-gray-200 hover:border-primary/50'
              } transition`}
            >
              {plan.featured && (
                <div className="inline-block px-3 py-1 bg-primary text-white rounded-full text-sm font-semibold mb-4">
                  {t('popular')}
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-600">/{t('month')}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id, plan.price)}
                disabled={loading === plan.id}
                className={`w-full py-3 rounded-md font-semibold transition flex items-center justify-center ${
                  plan.featured
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-accent text-white hover:bg-accent/90'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t('processing')}
                  </>
                ) : (
                  t('subscribe')
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 pt-16 border-t">
          <h2 className="text-3xl font-bold text-center mb-12">{t('faq.title')}</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('faq.q1')}</h3>
              <p className="text-gray-600">{t('faq.a1')}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('faq.q2')}</h3>
              <p className="text-gray-600">{t('faq.a2')}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('faq.q3')}</h3>
              <p className="text-gray-600">{t('faq.a3')}</p>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
