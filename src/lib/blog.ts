// 博客文章类型定义
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  tags: string[];
  readTime: number; // 阅读时间（分钟）
}

// 模拟博客数据
export const mockBlogPosts: BlogPost[] = [
  {
    id: "web3-introduction",
    title: "Web3 入门指南：从区块链到去中心化应用",
    excerpt: "本文将带你了解 Web3 的核心概念，包括区块链技术、智能合约、以及如何构建去中心化应用（DApp）。",
    content: `
# Web3 入门指南：从区块链到去中心化应用

Web3 代表了互联网的下一个演进阶段，它基于区块链技术，旨在创建一个去中心化的网络。

## 什么是 Web3？

Web3 是基于区块链技术的新一代互联网，它具有以下特点：

- **去中心化**: 没有单一的控制点
- **无需许可**: 任何人都可以参与
- **原生数字资产**: 内置加密货币和 NFT 支持
- **用户拥有数据**: 用户真正拥有自己的数据和数字资产

## 核心技术

### 区块链
区块链是一个分布式账本，记录了所有交易的历史。

### 智能合约
智能合约是运行在区块链上的自动化程序，无需第三方执行。

### 加密钱包
用户通过加密钱包与 Web3 应用交互，管理数字资产。

## 开发工具

- **Ethereum**: 最流行的智能合约平台
- **Solidity**: 智能合约编程语言
- **Web3.js / Ethers.js**: JavaScript 库
- **MetaMask**: 浏览器钱包插件

开始你的 Web3 之旅吧！
    `,
    author: "张三",
    publishDate: "2024-01-15",
    tags: ["Web3", "区块链", "教程"],
    readTime: 8
  },
  {
    id: "react-hooks-guide",
    title: "React Hooks 完全指南：让组件更优雅",
    excerpt: "深入了解 React Hooks 的使用方法，包括 useState、useEffect、自定义 Hooks 等，提升你的 React 开发技能。",
    content: `
# React Hooks 完全指南：让组件更优雅

React Hooks 革命性地改变了我们编写 React 组件的方式，让函数组件也能使用状态和生命周期方法。

## 什么是 Hooks？

Hooks 是 React 16.8 引入的新特性，它允许你在函数组件中使用状态和其他 React 特性。

## 基础 Hooks

### useState
用于在函数组件中添加状态：

\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

### useEffect
用于处理副作用：

\`\`\`javascript
useEffect(() => {
  document.title = \`点击了 \${count} 次\`;
}, [count]);
\`\`\`

### useContext
用于消费 Context：

\`\`\`javascript
const theme = useContext(ThemeContext);
\`\`\`

## 自定义 Hooks

自定义 Hooks 让你可以在组件间共享状态逻辑：

\`\`\`javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  
  return { count, increment, decrement };
}
\`\`\`

## 最佳实践

1. 只在顶层调用 Hooks
2. 只在 React 函数中调用 Hooks
3. 使用 ESLint 插件确保 Hooks 规则

Hooks 让 React 开发更加简洁和强大！
    `,
    author: "李四",
    publishDate: "2024-01-10",
    tags: ["React", "Hooks", "前端开发"],
    readTime: 6
  },
  {
    id: "nextjs-performance",
    title: "Next.js 性能优化实战：让你的应用飞起来",
    excerpt: "学习如何优化 Next.js 应用的性能，包括图片优化、代码分割、静态生成等技术。",
    content: `
# Next.js 性能优化实战：让你的应用飞起来

性能是现代 Web 应用的关键指标。Next.js 提供了许多内置的优化功能，让你的应用更快、更高效。

## 图片优化

Next.js 的 Image 组件提供了自动优化：

\`\`\`javascript
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="英雄图片"
  width={800}
  height={600}
  priority
/>
\`\`\`

## 代码分割

Next.js 自动进行代码分割，你也可以使用动态导入：

\`\`\`javascript
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('../components/Heavy'), {
  loading: () => <p>加载中...</p>,
});
\`\`\`

## 静态生成 (SSG)

对于不经常变化的页面，使用静态生成：

\`\`\`javascript
export async function getStaticProps() {
  const data = await fetchData();
  
  return {
    props: { data },
    revalidate: 3600, // 1小时后重新生成
  };
}
\`\`\`

## 服务器端渲染 (SSR)

对于需要实时数据的页面：

\`\`\`javascript
export async function getServerSideProps() {
  const data = await fetchRealTimeData();
  
  return {
    props: { data },
  };
}
\`\`\`

## 性能监控

使用 Next.js 内置的性能分析：

\`\`\`bash
npm run dev -- --profile
\`\`\`

通过这些优化技术，你的 Next.js 应用将获得显著的性能提升！
    `,
    author: "王五",
    publishDate: "2024-01-05",
    tags: ["Next.js", "性能优化", "前端开发"],
    readTime: 10
  }
];

// 根据 ID 获取博客文章
export function getBlogPost(id: string): BlogPost | undefined {
  return mockBlogPosts.find(post => post.id === id);
}

// 获取所有博客文章
export function getAllBlogPosts(): BlogPost[] {
  return mockBlogPosts.sort((a, b) => 
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

// 根据标签过滤博客文章
export function getBlogPostsByTag(tag: string): BlogPost[] {
  return mockBlogPosts.filter(post => 
    post.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
} 