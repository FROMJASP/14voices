'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './BlogPostsWithTabs.css';

const BlogPostsWithTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'categories'>('posts');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Determine active tab based on current path
    if (pathname?.includes('/categories')) {
      setActiveTab('categories');
    } else if (pathname?.includes('/blog-posts')) {
      setActiveTab('posts');
    }
  }, [pathname]);

  const handleTabChange = (tab: 'posts' | 'categories') => {
    setActiveTab(tab);
    if (tab === 'categories') {
      router.push('/admin/collections/categories');
    } else {
      router.push('/admin/collections/blog-posts');
    }
  };

  return (
    <div className="blog-posts-tabs">
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => handleTabChange('posts')}
          type="button"
        >
          Blog Posts
        </button>
        <button
          className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => handleTabChange('categories')}
          type="button"
        >
          Categorieën
        </button>
      </div>
    </div>
  );
};

export default BlogPostsWithTabs;
