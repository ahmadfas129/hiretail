'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="bg-accent text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">Hiretail</h3>
            <p className="text-gray-300">
              {t('description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/`} className="text-gray-300 hover:text-primary transition">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/categories`} className="text-gray-300 hover:text-primary transition">
                  {t('categories')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/pricing`} className="text-gray-300 hover:text-primary transition">
                  {t('pricing')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('support')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-primary transition">
                  {t('helpCenter')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-primary transition">
                  {t('contactUs')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-primary transition">
                  {t('faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('legal')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-primary transition">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-primary transition">
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-primary transition">
                  {t('cookies')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Hiretail. {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
