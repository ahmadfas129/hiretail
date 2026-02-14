'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, Menu, X, LogOut } from 'lucide-react';
import CartIcon from './CartIcon';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'pt', name: 'Português' },
  { code: 'it', name: 'Italiano' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'ar', name: 'العربية' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'ru', name: 'Русский' },
  { code: 'sv', name: 'Svenska' },
  { code: 'pl', name: 'Polski' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'th', name: 'ไทย' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'ur', name: 'اردو' },
];

export default function Navbar() {
  const { data: session } = useSession();
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const switchLanguage = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${pathWithoutLocale}`);
    setIsLangOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === locale);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: `/${locale}/` });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${locale}/`} className="text-2xl font-bold text-primary">
            Hiretail
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href={`/${locale}/`} className="text-accent hover:text-primary transition">
              {t('home')}
            </Link>
            <Link href={`/${locale}/categories`} className="text-accent hover:text-primary transition">
              {t('categories')}
            </Link>
            <Link href={`/${locale}/pricing`} className="text-accent hover:text-primary transition">
              {t('pricing')}
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Icon */}
            <CartIcon locale={locale} />
            
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-accent hover:bg-gray-100 transition"
              >
                <span>{currentLanguage?.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg max-h-96 overflow-y-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLanguage(lang.code)}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        locale === lang.code ? 'bg-primary/10 text-primary' : 'text-accent'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {session ? (
              <>
                <Link
                  href={`/${locale}/dashboard`}
                  className="px-4 py-2 text-accent hover:text-primary transition"
                >
                  {t('dashboard')}
                </Link>
                {session.user.role === 'ADMIN' && (
                  <Link
                    href={`/${locale}/admin`}
                    className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition"
                  >
                    {t('admin')}
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 text-accent hover:text-primary transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('logout')}</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href={`/${locale}/login`}
                  className="px-4 py-2 text-accent hover:text-primary transition"
                >
                  {t('login')}
                </Link>
                <Link
                  href={`/${locale}/signup`}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                >
                  {t('signup')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-accent"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                href={`/${locale}/cart`}
                className="text-accent hover:text-primary transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('cart')}
              </Link>
              <Link
                href={`/${locale}/`}
                className="text-accent hover:text-primary transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('home')}
              </Link>
              <Link
                href={`/${locale}/categories`}
                className="text-accent hover:text-primary transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('categories')}
              </Link>
              <Link
                href={`/${locale}/pricing`}
                className="text-accent hover:text-primary transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('pricing')}
              </Link>

              {session ? (
                <>
                  <Link
                    href={`/${locale}/dashboard`}
                    className="text-accent hover:text-primary transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('dashboard')}
                  </Link>
                  {session.user.role === 'ADMIN' && (
                    <Link
                      href={`/${locale}/admin`}
                      className="text-accent hover:text-primary transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('admin')}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-accent hover:text-primary transition"
                  >
                    {t('logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/${locale}/login`}
                    className="text-accent hover:text-primary transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href={`/${locale}/signup`}
                    className="text-accent hover:text-primary transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('signup')}
                  </Link>
                </>
              )}

              {/* Language selector for mobile */}
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Language:</p>
                <select
                  value={locale}
                  onChange={(e) => switchLanguage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-accent"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
