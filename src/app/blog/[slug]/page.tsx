'use client'

import { getBlogPost } from '@/lib/blog';
import { Card, CardBody, Chip, Divider, Button } from '@nextui-org/react';
import { Calendar, Clock, User, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = getBlogPost(params.slug);

  // 如果文章不存在，显示404页面
  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 返回按钮 */}
      <div className="mb-6 flex gap-2">
        <Link href="/blog">
          <Button 
            variant="flat" 
            color="default" 
            startContent={<ArrowLeft size={16} />}
            className="mb-4"
          >
            返回博客列表
          </Button>
        </Link>
        <Link href="/">
          <Button 
            variant="flat" 
            color="default" 
            startContent={<Home size={16} />}
            className="mb-4"
          >
            回到首页
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg">
        <CardBody className="p-8">
          {/* 文章标题 */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* 文章摘要 */}
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            {post.excerpt}
          </p>

          {/* 文章元信息 */}
          <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{post.publishDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>约 {post.readTime} 分钟阅读</span>
            </div>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Chip 
                key={tag} 
                variant="flat" 
                color="primary" 
                size="sm"
              >
                {tag}
              </Chip>
            ))}
          </div>

          <Divider className="mb-8" />

          {/* 文章内容 */}
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-700">
              {post.content}
            </div>
          </div>

          <Divider className="my-8" />

          {/* 底部导航 */}
          <div className="flex justify-between items-center">
            <Link href="/blog">
              <Button 
                variant="flat" 
                color="primary" 
                startContent={<ArrowLeft size={16} />}
              >
                查看更多文章
              </Button>
            </Link>
            
            <div className="text-sm text-gray-500">
              感谢阅读！
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
} 