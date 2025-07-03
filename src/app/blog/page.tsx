'use client'

import { getAllBlogPosts } from '@/lib/blog';
import { Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const { t } = useTranslation('blog');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('page.title')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('page.subtitle')}
        </p>
        <Divider className="my-6" />
      </div>

      {/* 博客文章列表 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-0">
              <div className="w-full">
                <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                  {post.excerpt}
                </p>
                
                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <Chip 
                      key={tag} 
                      size="sm" 
                      variant="flat" 
                      color="primary"
                      className="text-xs"
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              </div>
            </CardHeader>
            
            <CardBody className="pt-0">
              {/* 文章信息 */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{post.publishDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{t('postCard.readTime', { time: post.readTime })}</span>
                </div>
              </div>

              {/* 阅读按钮 */}
              <Link 
                href={`/blog/${post.id}`}
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                {t('postCard.readMore')}
                <ArrowRight size={16} />
              </Link>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* 如果没有文章 */}
      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('page.noPosts')}</p>
        </div>
      )}
    </div>
  );
} 