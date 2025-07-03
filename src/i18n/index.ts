import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { i18nConfig } from './config';

// 导入翻译资源
import zhCommon from './resources/zh/common.json';
import zhNavigation from './resources/zh/navigation.json';
import zhHome from './resources/zh/home.json';
import zhBlog from './resources/zh/blog.json';

import enCommon from './resources/en/common.json';
import enNavigation from './resources/en/navigation.json';
import enHome from './resources/en/home.json';
import enBlog from './resources/en/blog.json';

import jaCommon from './resources/ja/common.json';
import jaNavigation from './resources/ja/navigation.json';
import jaHome from './resources/ja/home.json';
import jaBlog from './resources/ja/blog.json';

// 组装翻译资源
const resources = {
  zh: {
    common: zhCommon,
    navigation: zhNavigation,
    home: zhHome,
    blog: zhBlog,
  },
  en: {
    common: enCommon,
    navigation: enNavigation,
    home: enHome,
    blog: enBlog,
  },
  ja: {
    common: jaCommon,
    navigation: jaNavigation,
    home: jaHome,
    blog: jaBlog,
  },
};

// 初始化 i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ...i18nConfig,
    resources,
  });

export default i18n; 