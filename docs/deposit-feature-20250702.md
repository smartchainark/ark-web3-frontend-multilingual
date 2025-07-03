# 存款功能页面

## 功能概述

基于参考页面 `docs/cankao/deposit/page.ts` 创建了一个简化的 Web3 存款功能页面，适配当前项目的技术栈和依赖。

## 页面路径

- 访问路径: `/deposit`
- 文件位置: `src/app/deposit/page.tsx`

## 主要功能

### 1. 钱包连接
- 使用 RainbowKit 提供钱包连接功能
- 支持多种钱包（MetaMask、WalletConnect 等）
- 显示连接状态和钱包信息

### 2. 资产管理
- 显示当前钱包余额
- 显示网络信息（Chain ID）
- 支持查看代币余额

### 3. 存款操作
- **预设金额选择**: 100、1000、5000 或最大金额
- **自定义输入**: 支持手动输入金额（最多4位小数）
- **金额调节**: 使用 +/- 按钮微调金额
- **输入验证**: 
  - 最小存款限制: 100 代币
  - 最大存款限制: 50000 代币
  - 余额充足性检查

### 4. 交易流程
- **两步式操作**:
  1. 授权代币使用权限
  2. 确认存款交易
- **状态管理**: 显示授权状态和交易进度
- **用户反馈**: 使用 toast 通知显示操作结果

### 5. 收益计算
- 预计日收益范围: 0.1% ~ 0.8%
- 实时计算显示预期收益

## 技术实现

### 使用的依赖
- **React Hooks**: useState, useEffect
- **Wagmi**: useAccount, useBalance, useChainId
- **RainbowKit**: ConnectButton
- **NextUI**: 各种 UI 组件
- **Framer Motion**: 页面动画效果
- **React Hot Toast**: 通知提示
- **Lucide React**: 图标库

### 核心状态管理
```typescript
const [amount, setAmount] = useState("");           // 存款金额
const [isAmountValid, setIsAmountValid] = useState(false);  // 金额验证
const [isApproved, setIsApproved] = useState(false);        // 授权状态
const [isPending, setIsPending] = useState(false);          // 交易进行中
```

### 关键功能函数
- `handleApprove()`: 处理代币授权
- `handleDeposit()`: 处理存款交易
- `handleMaxAmount()`: 设置最大金额
- `calculateDailyReturn()`: 计算预期收益

## 用户界面

### 响应式设计
- 移动端友好的布局
- 自适应卡片和按钮组合
- 流畅的动画过渡效果

### 主要组件
1. **钱包连接卡片**: 未连接时显示
2. **资产信息卡片**: 显示余额和网络信息
3. **存款表单卡片**: 核心操作界面
4. **流程说明卡片**: 操作步骤指导

## 安全特性

- 输入验证和金额限制
- 两步式交易确认
- 错误处理和用户提示
- 智能合约安全保障说明

## 与主页集成

在主页 (`src/app/page.tsx`) 添加了存款页面的导航按钮:
```tsx
<Link href="/deposit">
  <Button color="secondary" variant='flat'>资产存款</Button>
</Link>
```

## 模拟功能说明

由于这是演示版本，授权和存款操作使用了模拟实现:
- 授权过程: 2秒延迟模拟
- 存款过程: 3秒延迟模拟
- 成功后重置表单状态

## 未来扩展

1. 集成真实的智能合约调用
2. 添加更多代币支持
3. 实现历史交易记录
4. 添加收益统计面板
5. 支持推荐人系统

## 创建时间

2025年7月2日 