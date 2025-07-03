# 🚀 ARK Web3 Frontend Template

一个基于现代技术栈构建的 Web3 前端模板，专为区块链应用开发而设计。集成了最新的区块链开发工具和美观的 UI 组件，让您快速开始 Web3 项目开发。

![Next.js](https://img.shields.io/badge/Next.js-15.2.3-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ 特性

- 🎨 **现代化 UI 设计** - 基于 HeroUI 和 Tailwind CSS 的美观界面
- 🔗 **Web3 集成** - 使用 RainbowKit、Wagmi 和 Viem 进行区块链交互
- 📱 **响应式设计** - 完美支持桌面端和移动端
- ⚡ **高性能** - 基于 Next.js 15 App Router 的现代架构
- 🛠️ **开发友好** - TypeScript 支持，完整的类型安全
- 🎉 **交互体验** - 丰富的动画效果和用户反馈
- 📚 **博客系统** - 内置技术博客功能

## 🛠️ 技术栈

### 前端框架
- **Next.js 15** - React 全栈框架
- **React 18** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript

### 样式和 UI
- **Tailwind CSS** - 实用优先的 CSS 框架
- **HeroUI** - 现代化 React UI 组件库
- **Lucide React** - 精美的图标库
- **Framer Motion** - 流畅的动画库

### Web3 集成
- **RainbowKit** - 钱包连接和管理
- **Wagmi** - React Hooks for Ethereum
- **Viem** - TypeScript 以太坊库

### 开发工具
- **React Hot Toast** - 优雅的通知组件
- **Clsx** - 条件类名工具

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm (推荐) 或 npm

### 安装

1. **克隆仓库**
   ```bash
   git clone https://github.com/smartchainark/ark-web3-frontend.git
   cd ark-web3-frontend
   ```

2. **安装依赖**
   ```bash
   pnpm install
   # 或
   npm install
   ```

3. **启动开发服务器**
   ```bash
   pnpm dev
   # 或
   npm run dev
   ```

4. **打开浏览器**
   
   访问 [http://localhost:4002](http://localhost:4002) 查看应用

### 构建和部署

```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 📁 项目结构

```
ark-web3-frontend/
├── src/
│   ├── app/                 # Next.js App Router 页面
│   │   ├── blog/           # 博客页面
│   │   ├── layout.tsx      # 根布局
│   │   ├── page.tsx        # 首页
│   │   └── providers.tsx   # 全局提供者
│   ├── components/         # 可复用组件
│   ├── lib/               # 工具函数和配置
│   ├── styles/            # 全局样式
│   └── wagmi.ts           # Web3 配置
├── docs/                  # 项目文档
├── public/               # 静态资源
└── package.json          # 项目配置
```

## 🎯 核心功能

### Web3 连接
- 支持多种钱包连接（MetaMask、WalletConnect 等）
- 实时显示网络信息和账户余额
- 链 ID 和区块高度监控

### 用户界面
- 现代化的卡片式布局
- 平滑的动画过渡效果
- 响应式设计适配各种设备
- 优雅的通知和反馈系统

### 技术博客
- 内置博客系统
- Markdown 文件支持
- 文章分类和标签

## 🔧 自定义配置

### Web3 配置

编辑 `src/wagmi.ts` 文件来配置支持的网络和钱包：

```typescript
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'ARK Web3 Frontend',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum],
  // 其他配置...
});
```

### 样式定制

项目使用 Tailwind CSS，您可以在 `tailwind.config.js` 中自定义主题：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // 自定义颜色
      },
      // 其他定制...
    },
  },
};
```

## 📝 使用指南

### 添加新页面

1. 在 `src/app/` 目录下创建新的文件夹
2. 添加 `page.tsx` 文件
3. 导出 React 组件

### 集成 Web3 功能

```typescript
import { useAccount, useBalance } from 'wagmi';

function MyComponent() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  
  // 您的组件逻辑...
}
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👨‍💻 作者

**[@smartchainark](https://github.com/smartchainark)**

- 致力于构建现代化的 Web3 开发工具和模板
- 为区块链生态系统贡献开源项目

## 🔗 相关链接

- [Next.js 官方文档](https://nextjs.org/docs)
- [HeroUI 组件库](https://heroui.com/)
- [RainbowKit 文档](https://www.rainbowkit.com/)
- [Wagmi 文档](https://wagmi.sh/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

## 📊 项目状态

- ✅ 基础架构搭建完成
- ✅ Web3 集成完成
- ✅ UI 组件库集成
- ✅ 响应式设计
- 🚧 更多功能开发中...

---

如果这个项目对您有帮助，请给它一个 ⭐️！
