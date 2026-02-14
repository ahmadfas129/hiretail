import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import ContentLayout from '@/components/ContentLayout';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Users, CreditCard, Package, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';

export default async function AdminDashboardPage({ params: { locale } }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect(`/${locale}/`);
  }

  const t = await getTranslations('admin');

  // Fetch statistics
  const [
    totalUsers,
    totalProducts,
    totalSubscriptions,
    activeSubscriptions,
    users,
    subscriptions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.subscription.count(),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.subscription.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  // Calculate total revenue (mock calculation)
  const totalRevenue = subscriptions.reduce((acc: number, sub: any) => {
    const prices: { [key: string]: number } = {
      basic: 19,
      pro: 49,
      enterprise: 99,
    };
    return acc + (prices[sub.plan] || 0);
  }, 0);

  return (
    <ContentLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Users */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-500" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="font-semibold text-gray-600">{t('totalUsers')}</h3>
            <p className="text-3xl font-bold mt-2">{totalUsers}</p>
          </div>

          {/* Total Products */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <Package className="w-8 h-8 text-purple-500" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="font-semibold text-gray-600">{t('totalProducts')}</h3>
            <p className="text-3xl font-bold mt-2">{totalProducts}</p>
          </div>

          {/* Active Subscriptions */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="w-8 h-8 text-green-500" />
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="font-semibold text-gray-600">{t('activeSubscriptions')}</h3>
            <p className="text-3xl font-bold mt-2">{activeSubscriptions}</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-primary" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="font-semibold text-gray-600">{t('totalRevenue')}</h3>
            <p className="text-3xl font-bold mt-2">${totalRevenue}</p>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">{t('recentUsers')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">{t('name')}</th>
                  <th className="text-left py-3 px-4 font-semibold">{t('email')}</th>
                  <th className="text-left py-3 px-4 font-semibold">{t('role')}</th>
                  <th className="text-left py-3 px-4 font-semibold">{t('joinedDate')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          user.role === 'ADMIN'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Subscriptions */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-6">{t('recentSubscriptions')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">{t('user')}</th>
                  <th className="text-left py-3 px-4 font-semibold">{t('plan')}</th>
                  <th className="text-left py-3 px-4 font-semibold">{t('status')}</th>
                  <th className="text-left py-3 px-4 font-semibold">{t('date')}</th>
                  <th className="text-left py-3 px-4 font-semibold">{t('sessionId')}</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription: any) => (
                  <tr key={subscription.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{subscription.user.name}</td>
                    <td className="py-3 px-4 capitalize font-semibold">
                      {subscription.plan}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          subscription.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : subscription.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {subscription.status === 'ACTIVE' && (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        )}
                        {subscription.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(subscription.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {subscription.stripeSessionId ? (
                        <code className="bg-gray-100 px-2 py-1 rounded">
                          {subscription.stripeSessionId.substring(0, 20)}...
                        </code>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
