'use client'

import { useState, useEffect } from "react";
import { ArrowRight, Info, CheckCircle, Lock, DollarSign, Shield, Plus, Minus, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader,
  Input,
  Chip,
  ButtonGroup,
  Progress,
  Divider
} from "@nextui-org/react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function DepositPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  
  const [amount, setAmount] = useState("");
  const [isAmountValid, setIsAmountValid] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  // 投资限制（示例值）
  const minAmount = 100;
  const maxAmount = 50000;
  
  // 预设金额选项
  const presetAmounts = [
    { value: 100, label: "100", type: "min" as const },
    { value: 1000, label: "1000", type: "recommended" as const },
    { value: 5000, label: "5000", type: "premium" as const },
  ];

  // 验证金额是否有效
  useEffect(() => {
    const numAmount = parseFloat(amount);
    const balanceValue = balance ? parseFloat(balance.formatted) : 0;
    
    setIsAmountValid(
      !isNaN(numAmount) && 
      numAmount > 0 && 
      numAmount <= balanceValue &&
      numAmount >= minAmount &&
      numAmount <= maxAmount
    );
  }, [amount, balance]);

  /**
   * 计算每日收益 (0.1% ~ 0.8%)
   */
  const calculateDailyReturn = (value: number) => {
    const minReturn = (value * 0.001).toFixed(2);
    const maxReturn = (value * 0.008).toFixed(2);
    return `${minReturn} ~ ${maxReturn}`;
  };
  
  /**
   * 处理授权
   */
  const handleApprove = async () => {
    if (!isAmountValid || isPending || !isConnected) {
      if (!isConnected) {
        toast.error('请先连接钱包');
      }
      return;
    }
    
    try {
      setIsPending(true);
      
      // 显示等待通知
      toast.loading('等待授权确认...', { duration: 2000 });
      
      // 模拟授权过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsApproved(true);
      toast.success('授权成功！');
      
    } catch (error) {
      console.error("授权失败:", error);
      toast.error('授权失败，请重试');
    } finally {
      setIsPending(false);
    }
  };
  
  /**
   * 处理存款
   */
  const handleDeposit = async () => {
    if (!isAmountValid || !isApproved || isPending || !isConnected) {
      if (!isConnected) {
        toast.error('请先连接钱包');
      }
      return;
    }
    
    try {
      setIsPending(true);
      
      // 显示等待通知
      toast.loading('处理存款中...', { duration: 3000 });
      
      // 模拟存款过程
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 重置表单
      setAmount("");
      setIsApproved(false);
      
      toast.success(`成功存入 ${amount} ${balance?.symbol || 'ETH'}！`);
      
    } catch (error) {
      console.error("存款失败:", error);
      toast.error('存款失败，请重试');
    } finally {
      setIsPending(false);
    }
  };

  /**
   * 设置最大金额
   */
  const handleMaxAmount = () => {
    if (balance) {
      // 保留4位小数
      const maxValue = Math.floor(parseFloat(balance.formatted) * 10000) / 10000;
      setAmount(maxValue.toString());
    }
  };

  /**
   * 设置预设金额
   */
  const handlePresetAmount = (value: number) => {
    setAmount(value.toString());
  };
  
  /**
   * 增加/减少金额
   */
  const adjustAmount = (delta: number) => {
    const currentAmount = parseFloat(amount) || 0;
    const newAmount = Math.max(0, currentAmount + delta);
    setAmount(newAmount.toString());
  };

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto relative overflow-x-hidden">
      {/* 返回按钮 */}
      <div className="mb-6">
        <Link href="/">
          <Button 
            variant="flat" 
            color="default" 
            startContent={<ArrowRight className="rotate-180" size={16} />}
          >
            返回首页
          </Button>
        </Link>
      </div>

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
          资产存款
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
            实时收益
          </Chip>
        </motion.div>
      </motion.div>

      {/* 钱包连接 */}
      {!isConnected && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6"
        >
          <Card className="bg-content1">
            <CardBody className="text-center py-8">
              <Wallet className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-medium mb-2">连接钱包开始使用</h3>
              <p className="text-default-500 mb-4">请连接您的钱包以查看余额和进行存款操作</p>
              <ConnectButton />
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* 资产卡片 */}
      {isConnected && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6"
        >
          <Card className="bg-content1">
            <CardHeader className="pb-2">
              <h2 className="text-lg font-medium">我的资产</h2>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-4">
                {/* 余额显示 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-default-500">钱包余额</p>
                      <p className="text-xl font-bold">
                        {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.00 ETH'}
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="flat" 
                    color="primary"
                    onPress={handleMaxAmount}
                  >
                    最大
                  </Button>
                </div>
                
                {/* 网络信息 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-default-500">当前网络</p>
                      <p className="text-lg font-medium">Chain ID: {chainId}</p>
                    </div>
                  </div>
                  
                  <Chip color="success" variant="flat">
                    已连接
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}
        
      {/* 存款表单 */}
      {isConnected && (
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
                  <h2 className="text-lg font-medium">存款操作</h2>
                  <p className="text-sm text-default-500">选择存款金额，开始获得收益</p>
                </div>
                <Chip 
                  color="primary" 
                  variant="flat"
                  startContent={<Lock className="w-4 h-4" />}
                  size="sm"
                >
                  安全保障
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
                      {preset.label}
                      {preset.type === 'recommended' && (
                        <CheckCircle className="w-3 h-3 ml-1" />
                      )}
                    </Button>
                  ))}
                  <Button
                    variant="bordered"
                    color="default"
                    onPress={handleMaxAmount}
                    className="flex-1"
                  >
                    最大
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
                      <span className="text-default-400 text-sm">{balance?.symbol || 'ETH'}</span>
                      <div className="flex gap-1">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onPress={() => adjustAmount(-0.1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onPress={() => adjustAmount(0.1)}
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
                  <span>最小存款: {minAmount} {balance?.symbol || 'ETH'}</span>
                  {isAmountValid && (
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-success"></div>
                      <span className="text-success">
                        预计日收益: {calculateDailyReturn(parseFloat(amount))} {balance?.symbol || 'ETH'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    onPress={handleApprove}
                    isDisabled={!isAmountValid || isApproved || isPending || !isConnected}
                    isLoading={isPending && !isApproved}
                    color={isApproved ? "success" : "primary"}
                    variant={isApproved ? "bordered" : "solid"}
                    startContent={isApproved ? <CheckCircle className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    className="w-full"
                  >
                    {isApproved ? '已授权' : '授权代币'}
                  </Button>
                  
                  <Button
                    onPress={handleDeposit}
                    isDisabled={!isAmountValid || !isApproved || isPending || !isConnected}
                    isLoading={isPending && isApproved}
                    color="secondary"
                    className="w-full"
                  >
                    确认存款
                  </Button>
                </div>
                
                {/* 安全提示 */}
                <Card radius="sm">
                  <CardBody className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-sm font-medium">您的资产受到智能合约保护，享受去中心化安全保障</p>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}
        
      {/* 存款流程说明 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mb-6"
      >
        <Card className="bg-content1">
          <CardHeader>
            <h2 className="text-lg font-medium">存款流程</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "连接钱包",
                  desc: "使用 MetaMask 或其他支持的钱包连接"
                },
                {
                  step: "2", 
                  title: "输入金额",
                  desc: "选择您要存入的代币数量"
                },
                {
                  step: "3",
                  title: "授权代币",
                  desc: "授权智能合约使用您的代币"
                },
                {
                  step: "4",
                  title: "确认存款",
                  desc: "完成存款并开始获得收益"
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