'use client'

import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { LanguageCode } from '@/i18n/types';
import { supportedLanguages } from '@/i18n/config';

/**
 * 增强的 useTranslation Hook
 * 提供类型安全和额外功能
 */
export function useTranslation(namespaces?: string | string[]) {
  const { t, i18n, ready } = useI18nextTranslation(namespaces);
  
  const currentLanguage = supportedLanguages[i18n.language as LanguageCode] || supportedLanguages.zh;
  
  const changeLanguage = async (language: LanguageCode) => {
    try {
      await i18n.changeLanguage(language);
      return true;
    } catch (error) {
      console.error('Language change failed:', error);
      return false;
    }
  };

  const hasTranslation = (key: string): boolean => {
    return i18n.exists(key);
  };

  const getLanguageList = () => {
    return Object.entries(supportedLanguages).map(([languageCode, config]) => ({
      ...config,
      code: languageCode as LanguageCode,
      isCurrent: i18n.language === languageCode,
    }));
  };

  const formatMessage = (key: string, values?: Record<string, any>) => {
    return t(key, values);
  };

  return {
    t,
    i18n,
    ready,
    currentLanguage,
    changeLanguage,
    hasTranslation,
    getLanguageList,
    formatMessage,
    isRTL: currentLanguage.direction === 'rtl',
    languageCode: i18n.language as LanguageCode,
  };
}

export default useTranslation; 