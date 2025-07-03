'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { LayoutTemplate, Github, ExternalLink } from 'lucide-react';
import { Button, Divider, Code, Card, CardBody, CardHeader, Link as HeroUILink } from '@heroui/react';
import { Bitcoin, BadgeDollarSign, Gem, Sparkles, Globe, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAccount, useBalance, useBlockNumber, useChainId } from 'wagmi';
import { useEffect, useCallback } from 'react';
import Link from 'next/link';

function Page() {
  const chainId = useChainId()
  const { data: blockNumber} = useBlockNumber()
  const { address } = useAccount()
  const { data: balance} = useBalance({ address })

  useEffect(() => {
    console.log('chainId', chainId)
    console.log('blockNumber', blockNumber)
    console.log('address', address)
    console.log('balance', balance)
  }, [chainId, blockNumber, address, balance])

  // 使用 useCallback 解决 onClick 过期问题
  const handleToastClick = useCallback(() => {
    toast.success('🎉 Toast from react-hot-toast!', {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#10b981',
        color: '#ffffff',
        borderRadius: '10px',
        padding: '16px',
        fontWeight: '500',
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 导航栏 */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 h-20 px-6 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="text-2xl font-bold text-gray-800 flex items-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl mr-3">
            <LayoutTemplate className='text-white' size={32}/>
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Web3 Frontend Template
          </span>
        </div>
        <div className="flex items-center gap-4">
          <HeroUILink 
            href="https://github.com/smartchainark" 
            isExternal 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Github size={20} />
            <span className="hidden sm:inline">@smartchainark</span>
          </HeroUILink>
          <ConnectButton />
        </div>
      </div>

      {/* 主要内容 */}
      <div className='max-w-7xl mx-auto px-6 py-8'>
        {/* 欢迎区域 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            欢迎使用 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Web3 模板</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            基于现代技术栈构建的 Web3 前端模板，集成了最新的区块链开发工具和美观的 UI 组件
          </p>
        </div>

        {/* 功能演示区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Sparkles className="text-green-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">交互演示</h3>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <p className="text-gray-600 mb-4">体验现代化的交互效果</p>
              <Button 
                color="success" 
                variant='flat' 
                onClick={handleToastClick}
                className="w-full font-medium"
                startContent={<Zap size={16} />}
              >
                显示通知
              </Button>
            </CardBody>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Globe className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">技术博客</h3>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <p className="text-gray-600 mb-4">查看最新的技术文章和教程</p>
              <Link href="/blog" className="w-full">
                <Button 
                  color="primary" 
                  variant='flat' 
                  className="w-full font-medium"
                  endContent={<ExternalLink size={16} />}
                >
                  浏览博客
                </Button>
              </Link>
            </CardBody>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Bitcoin className="text-orange-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Web3 图标</h3>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <p className="text-gray-600 mb-4">精美的区块链相关图标</p>
              <div className='flex justify-center gap-4 text-orange-500'>
                <Bitcoin size={32} className='hover:scale-110 transition-transform cursor-pointer'/>
                <BadgeDollarSign size={32} className='hover:scale-110 transition-transform cursor-pointer'/>
                <Gem size={32} className='hover:scale-110 transition-transform cursor-pointer'/>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 技术栈信息 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-800">🛠️ 技术栈</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>基于 <Code color="primary" size="sm">React</Code> 和 <Code color="primary" size="sm">Next.js</Code></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>使用 <Code color="success" size="sm">Tailwindcss</Code> 进行样式设计</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>使用 <Code color="secondary" size="sm">HeroUI</Code> 提供 UI 组件</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>使用 <Code color="warning" size="sm">Lucide</Code> 图标库</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>使用 <Code color="danger" size="sm">react-hot-toast</Code> 消息提示</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>使用 <Code color="primary" size="sm">Rainbowkit</Code> 连接 Web3</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>使用 <Code color="primary" size="sm">viem</Code> 和 <Code color="primary" size="sm">wagmi</Code> 进行区块链交互</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-800">🌐 Web3 信息</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">链 ID:</span>
                  <Code color="primary" size="sm">{chainId || '未连接'}</Code>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">区块高度:</span>
                  <Code color="success" size="sm">{blockNumber ? Number(blockNumber).toLocaleString() : '未连接'}</Code>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">钱包地址:</span>
                  <Code color="secondary" size="sm" className="max-w-32 truncate">
                    {address || '未连接'}
                  </Code>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">余额:</span>
                  <Code color="warning" size="sm">
                    {balance ? `${(Number(balance.value) / 10 ** balance?.decimals).toFixed(6)} ${balance.symbol}` : '未连接'}
                  </Code>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 作者信息 */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg mt-8">
          <CardBody className="text-center py-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Github size={24} className="text-gray-600" />
              <span className="text-lg font-medium text-gray-800">项目作者</span>
            </div>
            <HeroUILink 
              href="https://github.com/smartchainark" 
              isExternal 
              className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              @smartchainark
            </HeroUILink>
            <p className="text-gray-600 mt-2">
              致力于构建现代化的 Web3 开发工具和模板
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Page;
