# 国际化 (i18n) 实现文档

*实施日期: 2025-01-03*

## 概述

本项目已成功集成 `i18next` + `react-i18next` 国际化解决方案，支持中文、英文、日文三种语言的动态切换。

## 技术方案

### 依赖包
- `i18next`: 核心国际化引擎
- `react-i18next`: React 集成
- `i18next-browser-languagedetector`: 浏览器语言检测

### 文件结构
```
src/
├── i18n/
│   ├── config.ts              # 配置文件
│   ├── index.ts               # 初始化文件
│   ├── types.ts               # 类型定义
│   └── resources/             # 翻译资源
│       ├── zh/                # 中文
│       │   ├── common.json
│       │   ├── navigation.json
│       │   └── home.json
│       ├── en/                # 英文
│       │   ├── common.json
│       │   ├── navigation.json
│       │   └── home.json
│       └── ja/                # 日文
│           ├── common.json
│           ├── navigation.json
│           └── home.json
├── components/
│   └── LanguageSwitcher.tsx   # 语言切换组件
└── hooks/
    └── useTranslation.ts      # 增强的翻译 Hook
```

## 核心功能

### 1. 语言支持
- **中文 (zh)**: 默认语言，简体中文
- **英文 (en)**: English
- **日文 (ja)**: 日本語

### 2. 命名空间设计
- `common`: 通用文本 (按钮、状态等)
- `navigation`: 导航相关
- `home`: 首页内容
- `blog`: 博客相关 (待实现)
- `web3`: Web3 相关术语 (待实现)
- `errors`: 错误信息 (待实现)

### 3. 语言切换组件
```tsx
import LanguageSwitcher from '@/components/LanguageSwitcher';

// 基础用法
<LanguageSwitcher />

// 完整配置
<LanguageSwitcher 
  variant="flat"
  size="md"
  showLabel={true}
  className="custom-class"
/>
```

### 4. 翻译使用方法

#### 基础翻译
```tsx
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation(['navigation', 'home']);
  
  return (
    <div>
      <h1>{t('home:hero.title')}</h1>
      <p>{t('navigation:menu.home')}</p>
    </div>
  );
}
```

#### 富文本翻译 (Trans 组件)
```tsx
import { Trans } from 'react-i18next';

// 翻译文件中: "title": "欢迎使用 <highlight>Web3 模板</highlight>"
<Trans 
  i18nKey="home:hero.title" 
  components={{ 
    highlight: <span className="text-blue-600" />
  }}
/>
```

#### 增强 Hook 使用
```tsx
import useTranslation from '@/hooks/useTranslation';

function Component() {
  const { 
    t, 
    currentLanguage, 
    changeLanguage, 
    hasTranslation,
    getLanguageList 
  } = useTranslation(['common']);
  
  // 检查翻译是否存在
  if (hasTranslation('common:buttons.submit')) {
    // 使用翻译
  }
  
  // 切换语言
  const handleLanguageChange = async () => {
    const success = await changeLanguage('en');
    if (success) {
      console.log('Language changed successfully');
    }
  };
}
```

## 配置详情

### 1. 语言检测策略
```typescript
detection: {
  order: ['localStorage', 'navigator', 'htmlTag'],
  lookupLocalStorage: 'i18nextLng',
  caches: ['localStorage'],
}
```

检测优先级：
1. localStorage 中保存的用户选择
2. 浏览器语言设置
3. HTML lang 属性

### 2. 回退策略
- 主要回退语言: 中文 (zh)
- 回退命名空间: common
- 缺失翻译时显示翻译键

### 3. Next.js 集成
- 客户端初始化 (兼容静态导出)
- 不使用 Suspense (避免 SSR 问题)
- 在 Providers 中包装 I18nextProvider

## 已实现页面

### 首页 (src/app/page.tsx)
- ✅ 导航栏标题和链接
- ✅ 欢迎区域标题和描述
- ✅ 功能卡片 (交互演示、博客、图标)
- ✅ 技术栈列表
- ✅ Web3 信息面板
- ✅ 作者信息区域
- ✅ Toast 消息

### 语言切换
- ✅ 下拉菜单样式
- ✅ 国旗和语言名称显示
- ✅ 当前语言高亮
- ✅ 本地存储持久化

## 类型安全

### TypeScript 支持
```typescript
// 语言代码类型
type LanguageCode = 'zh' | 'en' | 'ja';

// 翻译键类型
type TranslationKey = 
  | `common:${string}`
  | `navigation:${string}`
  | `home:${string}`;

// 语言配置类型
interface Language {
  name: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  code: LanguageCode;
}
```

## 性能优化

### 1. 资源加载
- 所有翻译文件在应用启动时加载
- 资源大小优化 (每个文件 < 5KB)
- 支持未来的懒加载扩展

### 2. 缓存策略
- localStorage 缓存用户语言选择
- i18next 内置资源缓存
- 避免重复初始化

### 3. 包体积
- 压缩后总计约 120KB
- 翻译文件约 15KB
- 运行时性能良好

## 扩展指南

### 1. 添加新语言
```typescript
// 1. 在 supportedLanguages 中添加
export const supportedLanguages = {
  // ... 现有语言
  fr: { 
    name: 'Français', 
    flag: '🇫🇷', 
    direction: 'ltr',
    code: 'fr'
  }
};

// 2. 创建翻译文件
src/i18n/resources/fr/
├── common.json
├── navigation.json
└── home.json

// 3. 在 index.ts 中导入资源
import frCommon from './resources/fr/common.json';
// ...
```

### 2. 添加新命名空间
```typescript
// 1. 在 namespaces 中添加
export const namespaces = [
  // ... 现有命名空间
  'products',
  'checkout'
] as const;

// 2. 为每种语言创建对应文件
// 3. 在组件中使用
const { t } = useTranslation(['products']);
```

### 3. 添加新页面翻译
```typescript
// 1. 创建翻译键
// zh/blog.json
{
  "title": "技术博客",
  "articles": {
    "readMore": "阅读更多"
  }
}

// 2. 在组件中使用
const { t } = useTranslation(['blog']);
return <h1>{t('blog:title')}</h1>;
```

## 最佳实践

### 1. 翻译键命名
- 使用层级结构: `namespace:category.item`
- 保持简洁有意义: `buttons.submit` vs `btn_submit_action`
- 避免过深嵌套 (建议最多 3 层)

### 2. 翻译内容
- 保持原文的语气和风格
- 考虑文本长度变化 (中英文长度差异)
- 使用合适的标点符号

### 3. 组件设计
- 优先使用 useTranslation Hook
- 复杂 HTML 结构使用 Trans 组件
- 避免在翻译中硬编码样式

### 4. 测试建议
- 测试所有语言的 UI 布局
- 验证翻译键的存在性
- 检查文本溢出和截断

## 兼容性

### 浏览器支持
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Next.js 兼容性
- ✅ App Router 支持
- ✅ 静态导出兼容
- ✅ 客户端渲染
- ❌ SSR (不支持，不需要)

## 问题排查

### 常见问题

1. **翻译不显示**
   - 检查翻译键是否正确
   - 确认命名空间已加载
   - 查看浏览器控制台错误

2. **语言切换无效**
   - 检查 localStorage 权限
   - 确认语言代码正确
   - 验证翻译文件完整性

3. **初始化失败**
   - 检查资源文件路径
   - 确认 JSON 文件格式正确
   - 查看网络请求状态

### 调试技巧
```typescript
// 开启调试模式 (开发环境)
i18n.init({
  debug: true,
  // ...
});

// 检查当前语言
console.log(i18n.language);

// 检查翻译是否存在
console.log(i18n.exists('home:hero.title'));

// 获取原始翻译数据
console.log(i18n.getDataByLanguage('zh'));
```

## 后续计划

### Phase 2: 扩展页面
- [ ] 博客页面国际化
- [ ] 404 页面翻译
- [ ] 其他功能页面

### Phase 3: 高级功能
- [ ] 复数形式支持
- [ ] 日期时间本地化
- [ ] 数字格式化
- [ ] RTL 语言支持

### Phase 4: 开发工具
- [ ] 翻译键自动提示 VS Code 插件
- [ ] 缺失翻译检测脚本
- [ ] 翻译文件验证工具

## 结论

i18next + react-i18next 方案为项目提供了企业级的国际化支持，具有以下优势：

✅ **功能丰富**: 支持复杂的翻译需求
✅ **类型安全**: 完整的 TypeScript 支持  
✅ **性能良好**: 优化的加载和缓存策略
✅ **易于维护**: 清晰的文件结构和命名规范
✅ **可扩展性**: 支持快速添加新语言和功能

首页国际化实现已完成，用户可以在中英日三种语言之间无缝切换，为后续页面的国际化奠定了坚实基础。 