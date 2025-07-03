// i18n 配置文件
import { InitOptions } from 'i18next';

// 文本方向类型
export type TextDirection = 'ltr' | 'rtl';

// 支持的语言配置
export const supportedLanguages = {
  zh: { 
    name: '中文', 
    flag: '🇨🇳', 
    direction: 'ltr' as TextDirection,
    code: 'zh'
  },
  en: { 
    name: 'English', 
    flag: '🇺🇸', 
    direction: 'ltr' as TextDirection,
    code: 'en'
  },
  ja: { 
    name: '日本語', 
    flag: '🇯🇵', 
    direction: 'ltr' as TextDirection,
    code: 'ja'
  }
} as const;

// 语言代码类型
export type LanguageCode = keyof typeof supportedLanguages;

// 默认语言
export const defaultLanguage: LanguageCode = 'zh';

// 命名空间配置
export const namespaces = [
  'common',      // 通用文本
  'navigation',  // 导航相关
  'home',        // 首页内容
  'blog',        // 博客相关
  'web3',        // Web3 相关术语
  'errors'       // 错误信息
] as const;

export type Namespace = typeof namespaces[number];

// i18next 配置
export const i18nConfig: InitOptions = {
  debug: process.env.NODE_ENV === 'development',
  
  // 语言配置
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  supportedLngs: Object.keys(supportedLanguages),
  
  // 命名空间配置
  ns: namespaces,
  defaultNS: 'common',
  fallbackNS: 'common',
  
  // 插值配置
  interpolation: {
    escapeValue: false, // React 已经转义了
  },
  
  // 检测器配置
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    lookupLocalStorage: 'i18nextLng',
    caches: ['localStorage'],
    excludeCacheFor: ['cimode'],
  },
  
  // React 集成配置
  react: {
    useSuspense: false, // 与 Next.js 兼容
    bindI18n: 'languageChanged loaded',
    bindI18nStore: 'added removed',
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span'],
  },
  
  // 资源配置
  resources: {}, // 将在运行时加载
}; 