import React from 'react';
import BlogAdminClient from './BlogAdminClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <BlogAdminClient initialBlogs={blogs} />;
}
