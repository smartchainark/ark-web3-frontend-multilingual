// i18n 类型定义
import { supportedLanguages, namespaces, TextDirection } from './config';

// 语言代码联合类型
export type LanguageCode = keyof typeof supportedLanguages;

// 命名空间联合类型
export type Namespace = typeof namespaces[number];

// 导出文本方向类型
export type { TextDirection };

// 语言配置类型
export interface Language {
  name: string;
  flag: string;
  direction: TextDirection;
  code: LanguageCode;
}

// 翻译键路径类型 (可以根据需要扩展)
export type TranslationKey = 
  | `common:${string}`
  | `navigation:${string}`
  | `home:${string}`
  | `blog:${string}`
  | `web3:${string}`
  | `errors:${string}`;

// i18n Hook 返回类型增强
export interface UseTranslationResult {
  t: (key: string, options?: any) => string;
  i18n: {
    language: LanguageCode;
    changeLanguage: (lng: LanguageCode) => Promise<any>;
    isInitialized: boolean;
    dir: () => TextDirection;
  };
  ready: boolean;
}

// 语言切换器属性类型
export interface LanguageSwitcherProps {
  variant?: 'flat' | 'solid' | 'bordered' | 'light' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showFlag?: boolean;
  className?: string;
  disabled?: boolean;
  onLanguageChange?: (language: LanguageCode) => void;
} 