import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import ContentLayout from '@/components/ContentLayout';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { User, Package, CreditCard, Settings, CheckCircle, XCircle } from 'lucide-react';

export default async function DashboardPage({ 
  params: { locale },
  searchParams 
}: { 
  params: { locale: string };
  searchParams: { success?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations('dashboard');

  // Fetch user's subscriptions
  const subscriptions = await prisma.subscription.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  const activeSubscription = subscriptions.find((sub: any) => sub.status === 'ACTIVE');

  return (
    <ContentLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        {searchParams.success && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {t('subscriptionSuccess')}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t('welcome')}, {session.user.name}!</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <User className="w-8 h-8 text-primary" />
              <span className="text-sm font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full">
                {session.user.role}
              </span>
            </div>
            <h3 className="font-semibold text-gray-600">{t('profile')}</h3>
            <p className="text-2xl font-bold mt-2">{session.user.name}</p>
          </div>

          {/* Subscription Status Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="w-8 h-8 text-primary" />
              {activeSubscription ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <h3 className="font-semibold text-gray-600">{t('subscription')}</h3>
            <p className="text-2xl font-bold mt-2 capitalize">
              {activeSubscription ? activeSubscription.plan : t('none')}
            </p>
          </div>

          {/* Products Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-gray-600">{t('products')}</h3>
            <p className="text-2xl font-bold mt-2">0</p>
          </div>

          {/* Settings Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <Settings className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-gray-600">{t('settings')}</h3>
            <p className="text-sm text-gray-500 mt-2">{t('manage')}</p>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-6">{t('subscriptionDetails')}</h2>
          
          {activeSubscription ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">{t('plan')}</span>
                <span className="font-semibold capitalize">{activeSubscription.plan}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">{t('status')}</span>
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {activeSubscription.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">{t('startDate')}</span>
                <span className="font-semibold">
                  {new Date(activeSubscription.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-4">{t('noSubscription')}</p>
              <a
                href={`/${locale}/pricing`}
                className="inline-block px-6 py-3 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 transition"
              >
                {t('viewPlans')}
              </a>
            </div>
          )}
        </div>

        {/* Seller Tools (if subscribed) */}
        {activeSubscription && (
          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold mb-6">{t('sellerTools')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary transition text-left">
                <Package className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">{t('addProduct')}</h3>
                <p className="text-sm text-gray-600">{t('addProductDesc')}</p>
              </button>
              <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary transition text-left">
                <Settings className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">{t('manageProducts')}</h3>
                <p className="text-sm text-gray-600">{t('manageProductsDesc')}</p>
              </button>
              <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary transition text-left">
                <User className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">{t('analytics')}</h3>
                <p className="text-sm text-gray-600">{t('analyticsDesc')}</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
