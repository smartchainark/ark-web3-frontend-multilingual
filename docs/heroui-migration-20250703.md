# NextUI 到 HeroUI 迁移指南

*迁移日期: 2025-07-03*

## 迁移概述

由于 `@nextui-org/react` 已被弃用，我们将项目从 NextUI 迁移到了 HeroUI。HeroUI 是 NextUI 的新身份，提供相同的组件和功能，但使用新的包名。

## 迁移步骤

### 1. 更新 package.json
```diff
- "@nextui-org/react": "^2.4.6",
+ "@heroui/react": "^2.7.0",
```

### 2. 更新 tailwind.config.js
```diff
- import {nextui} from "@nextui-org/react";
+ import {heroui} from "@heroui/react";

- "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
+ "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"

- nextui(),
+ heroui(),
```

### 3. 更新 .npmrc (pnpm 用户)
```diff
- public-hoist-pattern[]=*@nextui-org/*
+ public-hoist-pattern[]=*@heroui/*
```

### 4. 更新 Provider 组件 (src/app/providers.tsx)
```diff
- import {NextUIProvider} from '@nextui-org/react'
+ import {HeroUIProvider} from '@heroui/react'

- <NextUIProvider>{children}</NextUIProvider>
+ <HeroUIProvider>{children}</HeroUIProvider>
```

### 5. 更新所有组件导入

#### 主页 (src/app/page.tsx)
```diff
- import { Button, Divider, Code } from '@nextui-org/react';
+ import { Button, Divider, Code } from '@heroui/react';
```

#### 博客页面 (src/app/blog/page.tsx)
```diff
- import { Card, CardBody, CardHeader, Chip, Divider } from '@nextui-org/react';
+ import { Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react';
```

#### 博客详情页 (src/app/blog/[slug]/page.tsx)
```diff
- import { Card, CardBody, Chip, Divider, Button } from '@nextui-org/react';
+ import { Card, CardBody, Chip, Divider, Button } from '@heroui/react';
```

#### 404 页面 (src/app/blog/[slug]/not-found.tsx)
```diff
- import { Button } from '@nextui-org/react';
+ import { Button } from '@heroui/react';
```

#### 存款页面 (src/app/deposit/page.tsx)
```diff
- } from "@nextui-org/react";
+ } from "@heroui/react";
```

#### 提取页面 (src/app/withdraw/page.tsx)
```diff
- } from "@nextui-org/react";
+ } from "@heroui/react";
```

## 重新安装依赖

```bash
# 删除旧的依赖和锁文件
rm -rf node_modules pnpm-lock.yaml

# 重新安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 验证迁移

### ✅ 成功指标
- [x] 开发服务器正常启动 (http://localhost:4002)
- [x] 所有页面正常渲染
- [x] 组件样式保持一致
- [x] 功能正常工作
- [x] 无 TypeScript 错误

### 📦 新版本信息
- **HeroUI React**: `2.7.11`
- **迁移前版本**: `@nextui-org/react@2.4.6`
- **迁移后版本**: `@heroui/react@2.7.11`

## 主要变化

### 包名变更
| 旧包名 | 新包名 |
|--------|--------|
| `@nextui-org/react` | `@heroui/react` |
| `@nextui-org/theme` | `@heroui/theme` |

### 组件变更
| 旧组件名 | 新组件名 |
|----------|----------|
| `NextUIProvider` | `HeroUIProvider` |
| `nextui()` | `heroui()` |

### API 兼容性
- ✅ 所有组件 API 保持不变
- ✅ 样式和主题配置保持兼容
- ✅ TypeScript 类型定义兼容

## 注意事项

1. **功能保持一致**: HeroUI 提供与 NextUI 完全相同的组件和功能
2. **无破坏性变更**: 迁移过程中没有引入任何破坏性变更
3. **版本提升**: 从 v2.4.6 升级到 v2.7.11，获得了最新的功能和修复
4. **长期支持**: `@nextui-org` 包已停止维护，建议尽快迁移

## 相关链接

- [HeroUI 官方网站](https://www.heroui.com/)
- [HeroUI 迁移指南](https://www.heroui.com/docs/guide/nextui-to-heroui)
- [HeroUI GitHub](https://github.com/heroui-inc/heroui)

## 迁移总结

✅ **迁移成功完成**

- 所有文件已更新到使用 HeroUI
- 依赖已正确安装
- 开发服务器正常运行
- 所有功能保持正常工作

项目现在使用 HeroUI v2.7.11，享受更好的性能和最新的功能。 