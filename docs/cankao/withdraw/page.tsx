"use client";

import { useState, useEffect } from "react";
import { Info, DollarSign, BarChart3, Flame, TrendingUp, ChevronRight, AlertCircle, Check, Wallet, ExternalLink, RefreshCw, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomButton from "../components/CustomButton";
import StatCard from "../components/StatCard";
import { useWeb3 } from "../contexts/web3/Web3Context";
import useInvestment from "../contexts/web3/hooks/useInvestment";
import { formatUnits, formatEther } from "ethers";
import { TOKEN_ADDRESSES } from "../contexts/web3/utils/constants";
import Link from "next/link";
import { showTransactionToast } from "../components/ui/TransactionToast";
import { v4 as uuidv4 } from 'uuid';
import { useI18n } from "@/app/i18n/provider";

export default function WithdrawPage() {
  const { account, connected } = useWeb3();
  const { 
    withdrawYield, 
    withdrawFull, 
    getInvestmentInfo, 
    loading, 
    error 
  } = useInvestment();
  const { t } = useI18n();
  
  const [isPending, setIsPending] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"earnings" | "all">("earnings");
  const [transactionStatus, setTransactionStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [networkName, setNetworkName] = useState("BSC");
  const [withdrawnAmount, setWithdrawnAmount] = useState<bigint>(BigInt(0));
  
  // 投资信息
  const [investmentInfo, setInvestmentInfo] = useState({
    investedAmount: BigInt(0),
    totalEarnings: BigInt(0),
    totalAvailable: BigInt(0),
    withdrawFee: 0.02 // 2%
  });
  
  /**
   * 获取用户投资信息
   */
  const fetchInvestmentInfo = async () => {
    if (!connected) return;
    
    try {
      const info = await getInvestmentInfo();
      
      if (info) {
        setInvestmentInfo({
          investedAmount: info.principal,
          totalEarnings: info.pendingYield,
          totalAvailable: info.principal + info.pendingYield,
          withdrawFee: 0.02 // 固定2%手续费
        });
      }
    } catch (err) {
      console.error("获取投资信息失败:", err);
    }
  };
  
  // 初始加载时获取投资信息
  useEffect(() => {
    if (connected) {
      fetchInvestmentInfo();
    }
  }, [connected]);
  
  // 选项变化时验证
  useEffect(() => {
    // 两种选项都是有效的，只要有投资
    const hasInvestment = investmentInfo.investedAmount > BigInt(0);
    const hasEarnings = investmentInfo.totalEarnings > BigInt(0);
    
    // 如果选择仅提取收益，但没有收益，则禁用按钮
    if (selectedOption === "earnings" && !hasEarnings) {
      return;
    }
    
    // 如果选择全部提取，但没有投资，则禁用按钮
    if (selectedOption === "all" && !hasInvestment) {
      return;
    }
  }, [selectedOption, investmentInfo]);
  
  /**
   * 计算提取金额
   * @returns {bigint} 提取金额
   */
  const calculateWithdrawAmount = (): bigint => {
    if (selectedOption === "all") {
      return investmentInfo.totalAvailable;
    } else if (selectedOption === "earnings") {
      return investmentInfo.totalEarnings;
    }
    return BigInt(0);
  };
  
  /**
   * 计算手续费
   * @returns {bigint} 手续费金额
   */
  const calculateFee = (): bigint => {
    const withdrawAmount = calculateWithdrawAmount();
    // 仅提取收益无需手续费
    if (selectedOption === "earnings") {
      return BigInt(0);
    }
    return BigInt(Number(withdrawAmount) * investmentInfo.withdrawFee);
  };
  
  /**
   * 计算实际到账金额
   * @returns {bigint} 实际到账金额
   */
  const calculateReceiveAmount = (): bigint => {
    const withdrawAmount = calculateWithdrawAmount();
    return withdrawAmount - calculateFee();
  };
  
  /**
   * 处理提现
   */
  const handleWithdraw = async () => {
    if (isPending || !connected) {
      if (!connected) {
        showTransactionToast({
          type: 'error',
          title: t('errors.investment.walletNotConnected'),
          description: t('withdraw.actions.connectWallet'),
          walletAddress: account || undefined
        });
      }
      return;
    }
    
    try {
      setIsPending(true);
      setTransactionStatus("pending");
      
      // 在调用提现函数前，保存要提取的金额
      const amountToWithdraw = calculateReceiveAmount();
      
      // 创建一个唯一的操作ID
      const operationId = uuidv4();
      
      // 显示等待确认通知
      showTransactionToast({
        type: 'pending',
        title: selectedOption === "earnings" ? t('withdraw.withdrawOptions.earnings.title') : t('withdraw.withdrawOptions.all.title'),
        description: `${t('loading')}... ${formatNumberTruncated(amountToWithdraw)} USDC`,
        walletAddress: account || undefined,
        operationId
      });
      
      let success = false;
      
      if (selectedOption === "earnings") {
        // 提取收益
        success = await withdrawYield(); // 这里返回的是布尔值
      } else if (selectedOption === "all") {
        // 提取全部
        success = await withdrawFull(); // 这里返回的是布尔值
      }
      
      if (success) {
        // 保存成功提取的金额
        setWithdrawnAmount(amountToWithdraw);
        setTransactionStatus("success");
        setShowSuccessModal(true);
        
        // 显示成功通知
        showTransactionToast({
          type: 'success',
          title: t('withdraw.success.title'),
          description: `${t('withdraw.success.description')} ${formatNumberTruncated(amountToWithdraw)} USDC`,
          walletAddress: account || undefined,
          operationId
        });
        
        // 刷新投资信息
        await fetchInvestmentInfo();
      } else {
        setTransactionStatus("error");
        
        // 显示错误通知
        showTransactionToast({
          type: 'error',
          title: t('errors.investment.withdrawYieldFailed'),
          description: t('errors.web3.user_rejected'),
          walletAddress: account || undefined,
          operationId
        });
      }
    } catch (err) {
      console.error("提现失败:", err);
      setTransactionStatus("error");
      
      // 显示错误通知
      showTransactionToast({
        type: 'error',
        title: t('errors.investment.withdrawYieldFailed'),
        description: err instanceof Error ? err.message : t('errors.web3.unknown'),
        walletAddress: account || undefined,
        operationId: uuidv4() // 错误情况下使用新的操作ID
      });
    } finally {
      setIsPending(false);
    }
  };
  
  /**
   * 格式化地址
   * @param {string} address - 钱包地址
   * @returns {string} 格式化后的地址
   */
  const formatAddress = (address: string): string => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  /**
   * 关闭成功弹窗
   */
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setTransactionStatus("idle");
  };
  
  /**
   * 刷新投资信息
   */
  const refreshInvestmentInfo = async () => {
    await fetchInvestmentInfo();
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
      {/* 背景装饰效果 - 使用相对定位代替负margin */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full filter blur-3xl opacity-30 animate-pulse-slow max-w-[50%]"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full filter blur-3xl opacity-30 animate-pulse-slow max-w-[50%]"></div>
      <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-blue-700/5 rounded-full filter blur-3xl opacity-20"></div>
      
      {/* 网格背景 */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-3 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        {/* 页面标题和说明 */}
        <div className="mb-8 flex justify-between items-center relative">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
          >
            {t('withdraw.title')}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex items-center space-x-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1.5 shadow-sm"
          >
            <Shield className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-300">{t('withdraw.subtitle')}</span>
          </motion.div>
        </div>
        
        {/* 我的资产卡片 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="mb-6 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 p-5 shadow-sm relative overflow-hidden"
        >
          {/* 卡片装饰 - 使用transform代替负margin */}
          <div className="absolute top-0 right-0 h-40 w-40 bg-purple-500/5 rounded-full filter blur-xl opacity-30 transform translate-x-1/4 -translate-y-1/4"></div>
          
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h2 className="text-lg font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{t('withdraw.assets.title')}</h2>
            <motion.button 
              onClick={refreshInvestmentInfo}
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="p-2 rounded-full bg-gray-800/80 border border-gray-700/50 hover:bg-gray-700/50 hover:border-gray-600/50 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
          
          <div className="space-y-5 relative z-10">
            {/* 总存入金额 */}
            <div className="flex items-center justify-between border-b border-gray-700/50 pb-4">
              <div className="flex items-center">
                <div className="w-11 h-11 bg-blue-900/30 border border-blue-500/30 rounded-full flex items-center justify-center mr-3 shadow-inner">
                  <span className="text-blue-400 font-bold text-lg">$</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">{t('withdraw.assets.totalDeposit')}</p>
                  <p className="text-xl font-bold text-white">{formatNumberTruncated(investmentInfo.investedAmount)}</p>
                </div>
              </div>
            </div>
            
            {/* 待领取收益 */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <div className="w-11 h-11 bg-green-900/30 border border-green-500/30 rounded-full flex items-center justify-center mr-3 shadow-inner">
                  <span className="text-green-400 font-bold text-lg">$</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">{t('withdraw.assets.pendingWithdraw')}</p>
                  <p className="text-xl font-bold text-white">{formatNumberTruncated(investmentInfo.totalEarnings)}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* 提现选项 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-6 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 p-5 shadow-sm relative overflow-hidden"
        >
          {/* 卡片装饰 - 使用transform代替负margin */}
          <div className="absolute bottom-0 left-0 h-40 w-40 bg-blue-500/5 rounded-full filter blur-xl opacity-30 transform -translate-x-1/4 translate-y-1/4"></div>
          
          <h2 className="text-lg font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4 flex items-center">
            {t('withdraw.withdrawOptions.title')}
          </h2>
          
          <div className="space-y-3 mb-6">
            <motion.div
              whileHover={{ scale: 1.01, boxShadow: "0 4px 20px -5px rgba(34, 197, 94, 0.2)" }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2 }}
              className={`rounded-xl p-5 cursor-pointer flex items-center backdrop-blur-sm ${
                selectedOption === "earnings" 
                  ? "bg-green-900/20 border border-green-500/40" 
                  : "bg-gray-900/50 border border-gray-700/50 hover:border-green-500/30 hover:bg-green-900/10"
              }`}
              onClick={() => setSelectedOption("earnings")}
            >
              <div className={`w-7 h-7 rounded-full mr-3 flex items-center justify-center ${
                selectedOption === "earnings" 
                  ? "bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30" 
                  : "border border-gray-600"
              }`}>
                {selectedOption === "earnings" ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <div className="w-3 h-3 rounded-full border-2 border-gray-600"></div>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-medium text-white">{t('withdraw.withdrawOptions.earnings.title')}</p>
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-400 truncate">{t('withdraw.withdrawOptions.earnings.description')}</p>
                  <p className="text-sm font-medium text-green-400">
                    {formatNumberTruncated(investmentInfo.totalEarnings)} USDC
                  </p>
                </div>
                <div className="mt-2 px-3 py-1.5 bg-green-900/30 border border-green-500/30 text-green-400 text-xs inline-block rounded-lg">
                  {t('withdraw.withdrawOptions.earnings.noFee')}
                </div>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.01, boxShadow: "0 4px 20px -5px rgba(99, 102, 241, 0.2)" }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2 }}
              className={`rounded-xl p-5 cursor-pointer flex items-center backdrop-blur-sm ${
                selectedOption === "all" 
                  ? "bg-primary/20 border border-primary/40" 
                  : "bg-gray-900/50 border border-gray-700/50 hover:border-primary/30 hover:bg-primary/10"
              }`}
              onClick={() => setSelectedOption("all")}
            >
              <div className={`w-7 h-7 rounded-full mr-3 flex items-center justify-center ${
                selectedOption === "all" 
                  ? "bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-lg shadow-indigo-500/30" 
                  : "border border-gray-600"
              }`}>
                {selectedOption === "all" ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <div className="w-3 h-3 rounded-full border-2 border-gray-600"></div>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-medium text-white">{t('withdraw.withdrawOptions.all.title')}</p>
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-400 truncate">{t('withdraw.withdrawOptions.all.description')}</p>
                  <p className="text-sm font-medium text-indigo-400">
                    {formatNumberTruncated(investmentInfo.totalAvailable)} USDC
                  </p>
                </div>
                <div className="mt-2 px-3 py-1.5 bg-yellow-900/30 border border-yellow-500/30 text-yellow-400 text-xs inline-block rounded-lg">
                  {t('withdraw.withdrawOptions.all.fee')}
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-5 mb-6 border border-gray-700/50 shadow-inner">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <p className="text-sm text-gray-400">{t('withdraw.withdrawDetails.amount')}</p>
              <p className="font-semibold text-white">
                {formatNumberTruncated(calculateWithdrawAmount())} USDC
              </p>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <p className="text-sm text-gray-400">{t('withdraw.withdrawDetails.fee')} {selectedOption === "all" ? "(2%)" : "(0%)"}</p>
              <p className="font-semibold text-red-400">
                - {formatNumberTruncated(calculateFee())} USDC
              </p>
            </div>
            {selectedOption === "all" && (
              <div className="rounded-lg bg-yellow-900/20 border border-yellow-500/30 p-3 mb-4 text-xs text-yellow-400 flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                <span>{t('withdraw.withdrawOptions.all.warning')}</span>
              </div>
            )}
            <div className="border-t border-gray-700/50 my-3 pt-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <p className="text-sm font-medium text-gray-300">{t('withdraw.withdrawDetails.receiveAmount')}</p>
                <motion.p 
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                  className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-indigo-500 bg-clip-text text-transparent"
                >
                  {formatNumberTruncated(calculateReceiveAmount())} USDC
                </motion.p>
              </div>
            </div>
          </div>
          
          <motion.div whileHover={{ y: -2 }} whileTap={{ y: 2 }}>
            <CustomButton
              onClick={handleWithdraw}
              disabled={
                (selectedOption === "earnings" && investmentInfo.totalEarnings <= BigInt(0)) || 
                (selectedOption === "all" && investmentInfo.investedAmount <= BigInt(0)) || 
                loading || 
                !connected
              }
              fullWidth
              variant="primary"
              loading={loading}
              loadingText={t('withdraw.actions.processing')}
              className={`py-3 rounded-xl ${
                loading ? "bg-gray-800" : 
                selectedOption === "earnings" ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg" :
                "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg"
              }`}
              icon={transactionStatus === "success" ? <Check className="h-5 w-5" /> : undefined}
            >
              {t('withdraw.actions.confirm')}
            </CustomButton>
          </motion.div>
          
          {!connected && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-yellow-900/20 border border-yellow-500/30 text-center text-yellow-400 text-sm rounded-lg"
            >
              {t('withdraw.actions.connectWallet')}
            </motion.div>
          )}
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-red-900/20 border border-red-500/30 text-red-400 text-sm rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </motion.div>
        
        {/* 收益数据链接卡片 */}
        <Link href="/earnings">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.3)" }}
            className="mb-6 bg-gradient-to-br from-green-900/20 to-green-700/10 backdrop-blur-sm rounded-xl border border-green-500/20 p-5 shadow-sm relative overflow-hidden cursor-pointer"
          >
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-4 shadow-lg shadow-green-800/30">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-white">{t('withdraw.viewEarnings.title')}</h2>
                  <p className="text-sm text-green-300">{t('withdraw.viewEarnings.description')}</p>
                </div>
              </div>
              <div className="w-8 h-8 bg-green-800/30 rounded-full flex items-center justify-center border border-green-500/30">
                <ChevronRight className="h-5 w-5 text-green-400" />
              </div>
            </div>
            
            {/* 卡片装饰 - 使用transform代替负margin */}
            <div className="absolute top-0 right-0 h-24 w-24 bg-green-500/10 rounded-full filter blur-xl opacity-30 transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 h-16 w-16 bg-green-600/10 rounded-full filter blur-xl opacity-30 transform -translate-x-1/3 translate-y-1/3"></div>
          </motion.div>
        </Link>
        
        {/* 提现说明 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-6 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 p-5 shadow-sm relative overflow-hidden"
        >
          <h2 className="text-lg font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4 flex items-center">
            <Info className="h-5 w-5 mr-2 text-yellow-400" />
            {t('withdraw.withdrawInstructions.title')}
          </h2>
          <div className="p-4 rounded-lg bg-yellow-900/20 backdrop-blur-sm text-yellow-300 border border-yellow-500/30">
            <ul className="text-sm list-disc pl-4 space-y-3">
              <li>{t('withdraw.withdrawInstructions.items.0')}</li>
              <li>{t('withdraw.withdrawInstructions.items.1')}</li>
              <li>{t('withdraw.withdrawInstructions.items.2')}</li>
              <li>{t('withdraw.withdrawInstructions.items.3')}</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
      
      {/* 交易成功弹窗 */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-x-hidden"
            onClick={closeSuccessModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900/90 backdrop-blur-xl p-8 rounded-2xl max-w-md w-full border-2 border-green-500/20 shadow-xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 弹窗装饰 - 使用transform代替绝对定位和负值 */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-500/10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
              
              <div className="flex flex-col items-center text-center relative z-10">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/30"
                >
                  <Check className="h-10 w-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2 text-white">{t('withdraw.success.title')}</h3>
                <p className="text-gray-300 mb-6">
                  {t('withdraw.success.description')} <span className="text-green-400 font-bold">{formatNumberTruncated(withdrawnAmount)} USDC</span>
                </p>
                
                {txHash && (
                  <div className="w-full bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl border border-gray-600/50 mb-6 shadow-inner">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-400">{t('withdraw.success.txHash')}</span>
                      <div className="flex items-center">
                        <span className="text-xs font-mono truncate max-w-[150px] text-white">{formatAddress(txHash)}</span>
                        <ExternalLink className="h-4 w-4 ml-1 text-green-400 cursor-pointer" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">{t('withdraw.success.status')}</span>
                      <div className="flex items-center text-green-400">
                        <span className="text-xs font-medium">{t('withdraw.success.confirmed')}</span>
                        <Check className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </div>
                )}
                
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 2 }}
                  className="w-full"
                >
                  <CustomButton
                    onClick={closeSuccessModal}
                    fullWidth
                    variant="primary"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 py-3 rounded-xl shadow-lg"
                  >
                    {t('withdraw.success.done')}
                  </CustomButton>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}