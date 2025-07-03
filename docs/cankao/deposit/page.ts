"use client";

import { useState, useEffect, Suspense } from "react";
import { ArrowRight, Info, CheckCircle, Lock, DollarSign, Shield, Plus, Minus, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader,
  Input,
  Chip,
  Spinner,
  ButtonGroup,
  Skeleton,
  Progress
} from "@heroui/react";
import { useWeb3 } from "../contexts/web3/Web3Context";
import useInvestment from "../contexts/web3/hooks/useInvestment";
import { INVESTMENT_LIMITS, TOKEN_ADDRESSES } from "../contexts/web3/utils/constants";
import { parseUnits, formatUnits } from "ethers";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { showTransactionToast } from "../components/ui/TransactionToast";
import { v4 as uuidv4 } from 'uuid';
import { useI18n } from "@/app/i18n/provider";

// 包含useSearchParams的组件
function DepositPageContent() {
  const { account, connected, getTokenBalance } = useWeb3();
  const { 
    checkAllowance, 
    approveUSDC, 
    invest, 
    loading, 
    error,
    getInvestmentInfo
  } = useInvestment();
  
  // 获取国际化函数
  const { t } = useI18n();
  
  // 获取URL查询参数
  const searchParams = useSearchParams();
  
  const [amount, setAmount] = useState("");
  const [isAmountValid, setIsAmountValid] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [referrer, setReferrer] = useState("0x0000000000000000000000000000000000000000"); // 默认推荐人地址
  const [usdcBalance, setUsdcBalance] = useState<bigint>(BigInt(0));
  const [investmentData, setInvestmentData] = useState<{
    principal: bigint; 
    pendingYield: bigint;
    stats?: {
      totalBaseYield: bigint;
      totalBoostYield: bigint;
      totalWithdrawals: bigint;
      userTotalInvestment: bigint;
    }
  } | null>(null);
  
  // 投资限制
  const minAmount = Number(formatUnits(INVESTMENT_LIMITS.MIN, 18));
  const maxAmount = Number(formatUnits(INVESTMENT_LIMITS.MAX, 18));
  
  // 预设金额选项
  const presetAmounts = [
    { value: 100, label: "100", type: "min" as const },
    { value: 1000, label: "1000", type: "recommended" as const },
    { value: 5000, label: "5000", type: "premium" as const },
  ];

  // 从URL获取ref参数并设置推荐人
  useEffect(() => {
    const refParam = searchParams?.get("ref");
    if (refParam && /^0x[a-fA-F0-9]{40}$/.test(refParam)) {
      // 验证是有效的以太坊地址格式
      setReferrer(refParam);
      console.log("推荐人地址设置为:", refParam);
    }
  }, [searchParams]);

  /**
   * 获取USDC余额和投资信息
   */
  const fetchUserData = async () => {
    if (!connected) return;
    try {
      // 获取USDC余额
      const balance = await getTokenBalance('USDC');
      setUsdcBalance(BigInt(balance));
      
      // 获取用户投资信息
      const investInfo = await getInvestmentInfo();
      if (investInfo) {
        setInvestmentData({
          principal: investInfo.principal,
          pendingYield: investInfo.pendingYield,
          stats: investInfo.stats
        });
      }
    } catch (err) {
      console.error("获取用户数据失败:", err);
    }
  };

  /**
   * 检查USDC授权
   */
  const checkUsdcAllowance = async () => {
    if (!connected || !amount) return;
    
    try {
      const amountInWei = parseUnits(amount, 18);
      const allowance = await checkAllowance(amountInWei);
      setIsApproved(allowance >= amountInWei);
    } catch (err) {
      console.error("检查授权失败:", err);
    }
  };

  // 初始加载时获取余额和投资信息
  useEffect(() => {
    if (connected) {
      fetchUserData();
    }
  }, [connected]);

  // 金额变化时检查授权状态
  useEffect(() => {
    if (amount) {
      checkUsdcAllowance();
    }
  }, [amount]);

  // 验证金额是否有效
  useEffect(() => {
    const numAmount = parseFloat(amount);
    const balanceInUsdc = Number(formatUnits(usdcBalance, 18));
    
    setIsAmountValid(
      !isNaN(numAmount) && 
      numAmount > 0 && 
      numAmount <= balanceInUsdc &&
      numAmount >= minAmount &&
      numAmount <= maxAmount
    );
  }, [amount, usdcBalance]);

  /**
   * 计算每日收益 (0.1% ~ 0.8%)
   * @param {number} value - 投资金额
   * @returns {string} 收益范围
   */
  const calculateDailyReturn = (value: number) => {
    const minReturn = (value * 0.001).toFixed(2);
    const maxReturn = (value * 0.008).toFixed(2);
    return `${minReturn} ~ ${maxReturn}`;
  };
  
  /**
   * 处理USDC授权
   */
  const handleApprove = async () => {
    if (!isAmountValid || isPending || !connected) {
      if (!connected) {
        showTransactionToast({
          type: 'error',
          title: t('deposit.errors.walletNotConnected'),
          description: t('deposit.errors.connectWallet'),
          walletAddress: account || undefined
        });
      }
      return;
    }
    
    try {
      setIsPending(true);
      const amountInWei = parseUnits(amount, 18);
      
      // 创建一个唯一的操作ID
      const operationId = uuidv4();
      
      // 显示等待批准通知
      showTransactionToast({
        type: 'pending',
        title: t('deposit.pending.approval'),
        description: t('deposit.pending.approvalDesc'),
        walletAddress: account || undefined,
        chainId: connected ? undefined : undefined,
        operationId
      });
      
      const success = await approveUSDC(amountInWei);
      
      if (success) {
        setIsApproved(true);
        
        // 显示成功通知
        showTransactionToast({
          type: 'success',
          title: t('deposit.success.approval'),
          description: t('deposit.success.approvalDesc'),
          walletAddress: account || undefined,
          operationId
        });
      } else {
        // 显示错误通知
        showTransactionToast({
          type: 'error',
          title: t('deposit.errors.approvalFailed'),
          description: t('deposit.errors.transactionRejected'),
          walletAddress: account || undefined,
          operationId
        });
      }
    } catch (error) {
      console.error("授权失败:", error);
      showTransactionToast({
        type: 'error',
        title: t('deposit.errors.approvalFailed'),
        description: error instanceof Error ? error.message : t('deposit.errors.transactionRejected'),
        walletAddress: account || undefined
      });
    } finally {
      setIsPending(false);
    }
  };
  
  /**
   * 处理投资
   */
  const handleDeposit = async () => {
    if (!isAmountValid || !isApproved || isPending || !connected) {
      if (!connected) {
        showTransactionToast({
          type: 'error',
          title: t('deposit.errors.walletNotConnected'),
          description: t('deposit.errors.connectWallet'),
          walletAddress: account || undefined
        });
      }
      return;
    }
    
    try {
      // 检查用户类型（新用户或老用户）
      const isExistingUser = investmentData?.stats?.userTotalInvestment && investmentData.stats.userTotalInvestment > BigInt(0);
      
      // 如果是新用户，检查是否有推荐人
      if (!isExistingUser && referrer === "0x0000000000000000000000000000000000000000") {
        showTransactionToast({
          type: 'error',
          title: t('deposit.errors.noReferrer'),
          description: t('deposit.errors.noReferrerDesc'),
          walletAddress: account || undefined
        });
        return;
      }
      
      setIsPending(true);
      const amountInWei = parseUnits(amount, 18);
      
      // 创建一个唯一的操作ID
      const operationId = uuidv4();
      
      // 显示等待中通知
      showTransactionToast({
        type: 'pending',
        title: t('deposit.pending.deposit'),
        description: t('deposit.pending.depositDesc'),
        walletAddress: account || undefined,
        operationId
      });
      
      // 使用当前设置的推荐人地址
      console.log(`准备投资: 金额=${amount} USDC, 推荐人=${referrer}, 是否老用户=${isExistingUser}`);
      const success = await invest(amountInWei, referrer);
      
      if (success) {
        // 重置表单
        setAmount("");
        setIsApproved(false);
        // 刷新余额和投资信息
        fetchUserData();
        
        // 显示成功通知
        showTransactionToast({
          type: 'success',
          title: t('deposit.success.deposit'),
          description: t('deposit.success.depositDesc'),
          walletAddress: account || undefined,
          operationId
        });
      } else {
        // 显示错误通知
        showTransactionToast({
          type: 'error',
          title: t('deposit.errors.depositFailed'),
          description: t('deposit.errors.transactionRejected'),
          walletAddress: account || undefined,
          operationId
        });
      }
    } catch (error) {
      console.error("存款失败:", error);
      showTransactionToast({
        type: 'error',
        title: t('deposit.errors.depositFailed'),
        description: error instanceof Error ? error.message : t('deposit.errors.transactionRejected'),
        walletAddress: account || undefined
      });
    } finally {
      setIsPending(false);
    }
  };

  /**
   * 设置最大金额
   */
  const handleMaxAmount = () => {
    const balanceInUsdc = formatUnits(usdcBalance, 18);
    
    // 截取小数点后最多4位，不进行四舍五入
    const parts = balanceInUsdc.split('.');
    if (parts.length === 2 && parts[1].length > 4) {
      // 小数点后截取4位
      const truncatedAmount = `${parts[0]}.${parts[1].substring(0, 4)}`;
      setAmount(truncatedAmount);
    } else {
      setAmount(balanceInUsdc);
    }
  };

  /**
   * 设置预设金额
   * @param {number} value - 预设金额
   */
  const handlePresetAmount = (value: number) => {
    setAmount(value.toString());
  };
  
  /**
   * 增加/减少金额
   * @param {number} delta - 金额变化值
   */
  const adjustAmount = (delta: number) => {
    const currentAmount = parseFloat(amount) || 0;
    const newAmount = Math.max(0, currentAmount + delta);
    setAmount(newAmount.toString());
  };
  
  /**
   * 格式化数字，保留小数点后最多4位，不四舍五入
   * @param value BigInt值
   * @returns 格式化后的字符串
   */
  const formatNumberTruncated = (value: bigint): string => {
    const valueStr = formatUnits(value, 18);
    const parts = valueStr.split('.');
    
    // 整数部分添加千位分隔符
    const integerPart = parseInt(parts[0]).toLocaleString();
    
    // 处理小数部分
    if (parts.length === 2) {
      // 截取小数点后最多4位
      const decimalPart = parts[1].length > 4 
        ? parts[1].substring(0, 4) 
        : parts[1];
      
      return `${integerPart}.${decimalPart}`;
    }
    
    // 没有小数部分
    return integerPart;
  };

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto relative overflow-x-hidden">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex justify-between items-center"
      >
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl font-bold"
        >
          {t('deposit.title')}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Chip 
            color="primary" 
            variant="flat"
            startContent={<Shield className="w-4 h-4" />}
          >
            {t('deposit.realtimeYield')}
          </Chip>
        </motion.div>
      </motion.div>

      {/* 资产卡片 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-6"
      >
        <Card className="bg-content1">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-medium">{t('deposit.assets')}</h2>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="space-y-4">
              {/* USDC余额 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-default-500">{t('deposit.balance')}</p>
                    <p className="text-xl font-bold">{formatNumberTruncated(usdcBalance)}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="flat" 
                  color="primary"
                  onPress={handleMaxAmount}
                >
                  {t('deposit.max')}
                </Button>
              </div>
              
              {/* 我的存入 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-default-500">{t('deposit.stats.yourDeposit')}</p>
                    <p className="text-xl font-bold">
                      {investmentData 
                        ? formatNumberTruncated(investmentData.principal)
                        : "0.00"}
                    </p>
                  </div>
                </div>
                
                {/* 收益徽标 */}
                <Chip
                  color={investmentData && investmentData.pendingYield > BigInt(0) ? "success" : "default"}
                  variant="flat"
                >
                  +{formatNumberTruncated(investmentData ? investmentData.pendingYield : BigInt(0))}
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
        
      {/* 存款表单 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-6"
      >
        <Card className="bg-content1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center w-full">
              <div>
                <h2 className="text-lg font-medium">{t('deposit.deposit')}</h2>
                <p className="text-sm text-default-500">{t('deposit.depositDesc')}</p>
              </div>
              <Chip 
                color="primary" 
                variant="flat"
                startContent={<Lock className="w-4 h-4" />}
                size="sm"
              >
                {t('deposit.security')}
              </Chip>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            {/* 预设金额选项 */}
            <div className="mb-6">
              <ButtonGroup className="w-full mb-4" size="sm">
                {presetAmounts.map((preset) => (
                  <Button
                    key={preset.value}
                    variant={parseFloat(amount) === preset.value ? "solid" : "bordered"}
                    color={parseFloat(amount) === preset.value ? "primary" : "default"}
                    onPress={() => handlePresetAmount(preset.value)}
                    className="flex-1"
                  >
                    ${preset.label}
                    {preset.type === 'recommended' && (
                      <CheckCircle className="w-3 h-3 ml-1" />
                    )}
                  </Button>
                ))}
                <Button
                  variant={amount === formatUnits(usdcBalance, 18) ? "solid" : "bordered"}
                  color={amount === formatUnits(usdcBalance, 18) ? "primary" : "default"}
                  onPress={handleMaxAmount}
                  className="flex-1"
                >
                  {t('deposit.max')}
                </Button>
              </ButtonGroup>
              
              {/* 输入框 */}
              <Input
                type="text"
                inputMode="decimal"
                value={amount}
                onValueChange={(value) => {
                  if (value === '' || /^[0-9]*\.?[0-9]{0,4}$/.test(value)) {
                    setAmount(value);
                  }
                }}
                placeholder="0.00"
                size="lg"
                variant="bordered"
                endContent={
                  <div className="flex items-center gap-2">
                    <span className="text-default-400 text-sm">USDC</span>
                    <div className="flex gap-1">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onPress={() => adjustAmount(-100)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onPress={() => adjustAmount(100)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                }
                classNames={{
                  input: "text-center text-xl font-bold",
                  inputWrapper: "h-14"
                }}
              />
              
              {/* 提示信息 */}
              <div className="flex justify-between text-xs text-default-500 mt-2">
                <span>{t('deposit.minDeposit')}: {minAmount} USDC</span>
                {isAmountValid && (
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-success"></div>
                    <span className="text-success">
                      {t('deposit.daily')}: {calculateDailyReturn(parseFloat(amount))} USDC
                    </span>
                  </div>
                )}
              </div>
              
              {/* 错误提示 */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3"
                >
                  <Chip color="danger" variant="flat" className="w-full">
                    {error}
                  </Chip>
                </motion.div>
              )}
            </div>
            
            {/* 推荐人信息 */}
            {referrer !== "0x0000000000000000000000000000000000000000" && 
             (!investmentData || investmentData.principal <= BigInt(0)) && (
              <Card className="mb-4" radius="sm">
                <CardBody className="py-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{t('deposit.referrer')}</p>
                      <p className="text-xs text-default-500 truncate">{referrer}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
            
            {/* 操作按钮 */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  onPress={handleApprove}
                  isDisabled={!isAmountValid || isApproved || loading || !connected}
                  isLoading={loading && !isApproved}
                  color={isApproved ? "success" : "primary"}
                  variant={isApproved ? "bordered" : "solid"}
                  startContent={isApproved ? <CheckCircle className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  className="w-full"
                >
                  {isApproved ? t('deposit.approved') : t('deposit.approve')}
                </Button>
                
                <Button
                  onPress={handleDeposit}
                  isDisabled={!isAmountValid || !isApproved || loading || !connected}
                  isLoading={loading && isApproved}
                  color="secondary"
                  className="w-full"
                >
                  {t('deposit.deposit')}
                </Button>
              </div>
              
              {/* 连接钱包提示 */}
              {!connected && (
                <Card radius="sm">
                  <CardBody className="py-3">
                    <div className="text-center text-warning text-sm">
                      {t('deposit.connectWallet')}
                    </div>
                  </CardBody>
                </Card>
              )}
              
              {/* 安全提示 */}
              <Card radius="sm">
                <CardBody className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm font-medium">{t('deposit.securityDesc')}</p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </CardBody>
        </Card>
      </motion.div>
        
      {/* 存款流程 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mb-6"
      >
        <Card className="bg-content1">
          <CardHeader>
            <h2 className="text-lg font-medium">{t('deposit.process.title')}</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: t('deposit.process.step1'),
                  desc: t('deposit.process.step1Desc')
                },
                {
                  step: "2", 
                  title: t('deposit.process.step2'),
                  desc: t('deposit.process.step2Desc')
                },
                {
                  step: "3",
                  title: t('deposit.process.step3'),
                  desc: t('deposit.process.step3Desc')
                },
                {
                  step: "4",
                  title: t('deposit.process.step4'),
                  desc: t('deposit.process.step4Desc')
                }
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-sm font-bold">{item.step}</span>
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-default-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}

// 导出包装在Suspense中的组件
export default function DepositPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <Skeleton className="h-8 w-3/4 mx-auto rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    }>
      <DepositPageContent />
    </Suspense>
  );
}