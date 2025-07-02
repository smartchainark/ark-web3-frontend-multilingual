import { Button } from '@nextui-org/react';
import { Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">文章不存在</h2>
        <p className="text-gray-600 mb-8">
          抱歉，您要查找的博客文章不存在或已被删除。
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link href="/blog">
            <Button 
              color="primary" 
              variant="flat"
              startContent={<ArrowLeft size={16} />}
            >
              返回博客列表
            </Button>
          </Link>
          <Link href="/">
            <Button 
              color="default" 
              variant="flat"
              startContent={<Home size={16} />}
            >
              回到首页
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 