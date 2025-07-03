'use client'

import { Button } from '@heroui/react';
import { Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function NotFound() {
  const { t } = useTranslation('blog');

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">{t('notFound.title')}</h2>
        <p className="text-gray-600 mb-8">
          {t('notFound.message')}
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link href="/blog">
            <Button 
              color="primary" 
              variant="flat"
              startContent={<ArrowLeft size={16} />}
            >
              {t('notFound.backToBlog')}
            </Button>
          </Link>
          <Link href="/">
            <Button 
              color="default" 
              variant="flat"
              startContent={<Home size={16} />}
            >
              {t('notFound.backToHome')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 