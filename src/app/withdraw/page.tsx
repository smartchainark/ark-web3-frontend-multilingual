'use client'

import { useState } from "react";
import { Info, DollarSign, BarChart3, TrendingUp, ChevronRight, AlertCircle, Check, Wallet, RefreshCw, Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader,
  Chip,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@nextui-org/react";
import { useAccount, useBalance } from "wagmi";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function WithdrawPage() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  const [isPending, setIsPending] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"earnings" | "all">("earnings");
  const [withdrawnAmount, setWithdrawnAmount] = useState("0");
  
  // 模拟投资信息
  const [investmentInfo, setInvestmentInfo] = useState({
    investedAmount: 5000, // 已投资金额
    totalEarnings: 250,   // 总收益
    totalAvailable: 5250, // 总可用金额
    withdrawFee: 0.02     // 2% 手续费
  });
  
  /**
   * 刷新投资信息 (模拟)
   */
  const refreshInvestmentInfo = async () => {
    toast.success('投资信息已刷新');
  };
  
  /**
   * 计算提取金额
   */
  const calculateWithdrawAmount = (): number => {
    if (selectedOption === "all") {
      return investmentInfo.totalAvailable;
    } else if (selectedOption === "earnings") {
      return investmentInfo.totalEarnings;
    }
    return 0;
  };
  
  /**
   * 计算手续费
   */
  const calculateFee = (): number => {
    const withdrawAmount = calculateWithdrawAmount();
    // 仅提取收益无需手续费
    if (selectedOption === "earnings") {
      return 0;
    }
    return withdrawAmount * investmentInfo.withdrawFee;
  };
  
  /**
   * 计算实际到账金额
   */
  const calculateReceiveAmount = (): number => {
    const withdrawAmount = calculateWithdrawAmount();
    return withdrawAmount - calculateFee();
  };
  
  /**
   * 处理提现
   */
  const handleWithdraw = async () => {
    if (isPending || !isConnected) {
      if (!isConnected) {
        toast.error('请先连接钱包');
      }
      return;
    }
    
    try {
      setIsPending(true);
      
      const amountToWithdraw = calculateReceiveAmount();
      
      // 显示等待通知
      toast.loading(
        selectedOption === "earnings" ? '提取收益中...' : '提取全部资金中...', 
        { duration: 3000 }
      );
      
      // 模拟提现过程
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 模拟成功
      setWithdrawnAmount(amountToWithdraw.toFixed(2));
      
      // 更新投资信息
      if (selectedOption === "earnings") {
        setInvestmentInfo(prev => ({
          ...prev,
          totalEarnings: 0,
          totalAvailable: prev.investedAmount
        }));
      } else {
        setInvestmentInfo(prev => ({
          ...prev,
          investedAmount: 0,
          totalEarnings: 0,
          totalAvailable: 0
        }));
      }
      
      toast.success(`成功提取 ${amountToWithdraw.toFixed(2)} ${balance?.symbol || 'ETH'}！`);
      onOpen(); // 打开成功弹窗
      
    } catch (error) {
      console.error("提现失败:", error);
      toast.error('提现失败，请重试');
    } finally {
      setIsPending(false);
    }
  };
  
  /**
   * 格式化地址
   */
  const formatAddress = (address: string): string => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
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
          资产提取
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Chip 
            color="success" 
            variant="flat"
            startContent={<Shield className="w-4 h-4" />}
          >
            安全提取
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
              <p className="text-default-500 mb-4">请连接您的钱包以查看投资信息和进行提取操作</p>
              <ConnectButton />
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* 我的资产卡片 */}
      {isConnected && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6"
        >
          <Card className="bg-content1">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-lg font-medium">我的资产</h2>
                <Button 
                  isIconOnly
                  size="sm"
                  variant="flat"
                  onPress={refreshInvestmentInfo}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-4">
                {/* 总存入金额 */}
                <div className="flex items-center justify-between border-b border-divider pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-default-500">总存入金额</p>
                      <p className="text-xl font-bold">{investmentInfo.investedAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                {/* 待领取收益 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-default-500">待领取收益</p>
                      <p className="text-xl font-bold text-success">{investmentInfo.totalEarnings.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <Chip color="success" variant="flat">
                    +{((investmentInfo.totalEarnings / investmentInfo.investedAmount) * 100).toFixed(2)}%
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}
        
      {/* 提现选项 */}
      {isConnected && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-6"
        >
          <Card className="bg-content1">
            <CardHeader className="pb-2">
              <h2 className="text-lg font-medium">提现选项</h2>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-3 mb-6">
                {/* 仅提取收益 */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`rounded-xl p-4 cursor-pointer border-2 transition-all ${
                    selectedOption === "earnings" 
                      ? "border-success bg-success/10" 
                      : "border-default-200 hover:border-success/50"
                  }`}
                  onClick={() => setSelectedOption("earnings")}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                      selectedOption === "earnings" 
                        ? "bg-success text-white" 
                        : "border-2 border-default-300"
                    }`}>
                      {selectedOption === "earnings" && <Check className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">仅提取收益</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-default-500">提取投资产生的收益部分</p>
                        <p className="text-sm font-medium text-success">
                          {investmentInfo.totalEarnings.toLocaleString()} {balance?.symbol || 'ETH'}
                        </p>
                      </div>
                      <div className="mt-2">
                        <Chip size="sm" color="success" variant="flat">
                          无手续费
                        </Chip>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* 提取全部 */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`rounded-xl p-4 cursor-pointer border-2 transition-all ${
                    selectedOption === "all" 
                      ? "border-primary bg-primary/10" 
                      : "border-default-200 hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedOption("all")}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                      selectedOption === "all" 
                        ? "bg-primary text-white" 
                        : "border-2 border-default-300"
                    }`}>
                      {selectedOption === "all" && <Check className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">提取全部资金</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-default-500">提取本金和所有收益</p>
                        <p className="text-sm font-medium text-primary">
                          {investmentInfo.totalAvailable.toLocaleString()} {balance?.symbol || 'ETH'}
                        </p>
                      </div>
                      <div className="mt-2">
                        <Chip size="sm" color="warning" variant="flat">
                          2% 手续费
                        </Chip>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* 提现详情 */}
              <Card className="bg-default-50" radius="sm">
                <CardBody className="py-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-default-600">提取金额</p>
                      <p className="font-semibold">
                        {calculateWithdrawAmount().toLocaleString()} {balance?.symbol || 'ETH'}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-default-600">
                        手续费 {selectedOption === "all" ? "(2%)" : "(0%)"}
                      </p>
                      <p className="font-semibold text-danger">
                        - {calculateFee().toFixed(2)} {balance?.symbol || 'ETH'}
                      </p>
                    </div>
                    {selectedOption === "all" && (
                      <div className="rounded-lg bg-warning/20 border border-warning/30 p-3 text-sm text-warning-600 flex items-start">
                        <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                        <span>提取全部资金将收取2%手续费，且会终止您的投资计划</span>
                      </div>
                    )}
                    <Divider />
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">实际到账金额</p>
                      <motion.p 
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                        className="text-xl font-bold text-primary"
                      >
                        {calculateReceiveAmount().toFixed(2)} {balance?.symbol || 'ETH'}
                      </motion.p>
                    </div>
                  </div>
                </CardBody>
              </Card>
              
              {/* 提现按钮 */}
              <div className="mt-6">
                <Button
                  onPress={handleWithdraw}
                  isDisabled={
                    (selectedOption === "earnings" && investmentInfo.totalEarnings <= 0) || 
                    (selectedOption === "all" && investmentInfo.investedAmount <= 0) || 
                    isPending || 
                    !isConnected
                  }
                  isLoading={isPending}
                  color={selectedOption === "earnings" ? "success" : "primary"}
                  className="w-full"
                  size="lg"
                >
                  {isPending ? '处理中...' : '确认提现'}
                </Button>
              </div>
              
              {!isConnected && (
                <div className="mt-3 p-3 bg-warning/20 border border-warning/30 text-center text-warning-600 text-sm rounded-lg">
                  请先连接钱包
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>
      )}
        
      {/* 收益数据链接 */}
      {isConnected && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-6"
        >
          <Card 
            className="bg-gradient-to-r from-success/20 to-success/10 border border-success/20 cursor-pointer hover:scale-[1.02] transition-transform"
            isPressable
          >
            <CardBody className="py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-medium">查看收益详情</h3>
                    <p className="text-sm text-default-500">查看详细的收益统计和历史记录</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-success" />
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}
        
      {/* 提现说明 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mb-6"
      >
        <Card className="bg-content1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-warning" />
              <h2 className="text-lg font-medium">提现说明</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3 text-sm text-default-600">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <p>仅提取收益：无手续费，保留本金继续投资</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <p>提取全部：收取2%手续费，终止投资计划</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <p>提现通常在1-3个工作日内到账</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <p>请确保钱包地址正确，提现后无法撤销</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
      
      {/* 交易成功弹窗 */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span>提现成功</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="text-center py-4">
                  <p className="text-lg mb-2">
                    成功提现 <span className="font-bold text-success">{withdrawnAmount} {balance?.symbol || 'ETH'}</span>
                  </p>
                  <p className="text-default-500 text-sm">
                    资金将在1-3个工作日内到达您的钱包
                  </p>
                  
                  {address && (
                    <div className="mt-4 p-3 bg-default-100 rounded-lg">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-default-600">钱包地址</span>
                        <span className="font-mono">{formatAddress(address)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-2">
                        <span className="text-default-600">状态</span>
                        <div className="flex items-center text-success">
                          <span>已确认</span>
                          <Check className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="success" onPress={onClose} className="w-full">
                  完成
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
} 