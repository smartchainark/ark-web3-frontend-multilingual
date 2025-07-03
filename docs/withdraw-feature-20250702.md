# 提取功能页面

## 功能概述

基于参考页面 `docs/cankao/withdraw/page.tsx` 创建了一个简化的 Web3 资产提取功能页面，适配当前项目的技术栈和依赖。

## 页面路径

- 访问路径: `/withdraw`
- 文件位置: `src/app/withdraw/page.tsx`

## 主要功能

### 1. 钱包连接
- 使用 RainbowKit 提供钱包连接功能
- 支持多种钱包（MetaMask、WalletConnect 等）
- 显示连接状态和钱包信息

### 2. 资产展示
- **总存入金额**: 显示用户的总投资本金
- **待领取收益**: 显示累计的投资收益
- **收益率计算**: 实时显示收益百分比
- **刷新功能**: 支持手动刷新投资信息

### 3. 提取选项
- **仅提取收益**:
  - 只提取投资产生的收益部分
  - 无手续费
  - 保留本金继续投资
  
- **提取全部资金**:
  - 提取本金和所有收益
  - 收取2%手续费
  - 终止投资计划

### 4. 提取计算
- **智能计算**: 自动计算提取金额、手续费和实际到账金额
- **实时预览**: 选择不同选项时实时更新计算结果
- **费用透明**: 清晰显示手续费计算规则

### 5. 交易流程
- **安全验证**: 检查钱包连接状态和余额
- **交易确认**: 一键确认提取操作
- **状态反馈**: 实时显示交易进度
- **成功通知**: 交易完成后显示成功弹窗

## 技术实现

### 使用的依赖
- **React Hooks**: useState
- **Wagmi**: useAccount, useBalance
- **RainbowKit**: ConnectButton
- **NextUI**: 各种 UI 组件
- **Framer Motion**: 页面动画效果
- **React Hot Toast**: 通知提示
- **Lucide React**: 图标库

### 核心状态管理
```typescript
const [isPending, setIsPending] = useState(false);                    // 交易进行中
const [selectedOption, setSelectedOption] = useState<"earnings" | "all">("earnings"); // 选择的提取选项
const [withdrawnAmount, setWithdrawnAmount] = useState("0");          // 已提取金额
const [investmentInfo, setInvestmentInfo] = useState({               // 投资信息
  investedAmount: 5000,
  totalEarnings: 250,
  totalAvailable: 5250,
  withdrawFee: 0.02
});
```

### 关键功能函数
- `calculateWithdrawAmount()`: 计算提取金额
- `calculateFee()`: 计算手续费
- `calculateReceiveAmount()`: 计算实际到账金额
- `handleWithdraw()`: 处理提取操作
- `refreshInvestmentInfo()`: 刷新投资信息

## 用户界面

### 响应式设计
- 移动端友好的布局
- 自适应卡片和按钮组合
- 流畅的动画过渡效果

### 主要组件
1. **钱包连接卡片**: 未连接时显示
2. **资产信息卡片**: 显示投资金额和收益
3. **提取选项卡片**: 选择提取方式
4. **计算详情卡片**: 显示费用明细
5. **收益链接卡片**: 导航到收益详情
6. **说明文档卡片**: 操作指导和注意事项
7. **成功弹窗**: 交易完成确认

### 交互特性
- **选项切换**: 点击切换提取方式
- **实时计算**: 选项变化时自动更新金额
- **动画反馈**: 悬停和点击动画效果
- **状态指示**: 清晰的加载和成功状态

## 安全特性

- **输入验证**: 检查投资余额和提取条件
- **手续费提醒**: 明确显示手续费影响
- **确认机制**: 操作前的确认步骤
- **错误处理**: 完善的错误提示和恢复

## 与主页集成

在主页 (`src/app/page.tsx`) 添加了提取页面的导航按钮:
```tsx
<Link href="/withdraw">
  <Button color="warning" variant='flat'>资产提取</Button>
</Link>
```

## 模拟功能说明

由于这是演示版本，提取操作使用了模拟实现:
- 提取过程: 3秒延迟模拟
- 成功后更新本地状态
- 显示成功弹窗和通知

## 业务逻辑

### 提取规则
1. **仅提取收益**:
   - 条件: 收益 > 0
   - 手续费: 0%
   - 影响: 保留本金，继续投资

2. **提取全部**:
   - 条件: 投资金额 > 0
   - 手续费: 2%
   - 影响: 终止投资，清空账户

### 计算公式
```typescript
// 提取金额
withdrawAmount = selectedOption === "all" ? totalAvailable : totalEarnings

// 手续费
fee = selectedOption === "all" ? withdrawAmount * 0.02 : 0

// 实际到账
receiveAmount = withdrawAmount - fee
```

## 用户体验优化

- **清晰的选项对比**: 两种提取方式的差异明确显示
- **费用透明化**: 手续费计算和影响清楚说明
- **操作指导**: 详细的使用说明和注意事项
- **即时反馈**: 操作结果的及时通知

## 未来扩展

1. 集成真实的智能合约调用
2. 添加提取历史记录
3. 实现分批提取功能
4. 添加提取时间限制
5. 支持多种代币提取
6. 实现提取预约功能

## 创建时间

2025年7月2日 