import React from 'react';
import Link from 'next/link';
import '@/styles/blog.css';
import BlogClient from './BlogClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const blogs = await prisma.blog.findMany({
    orderBy: { id: 'asc' }
  });

  return (
    <>
      <header className="blog-hero">
        <div className="hero-content text-center">
          <h1>Our Creative Insights & Stories</h1>
          <p style={{ marginBottom: '1.5rem' }}>Exploring creativity, design strategy, and digital growth through our experiences at Adversity Media.</p>
          
          {/* Breadcrumb moved below the text as requested */}
          <div className="breadcrumb-container" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '1.2rem', fontWeight: 500, letterSpacing: '0.5px' }}>
            <Link href="/" style={{ color: '#fff', textDecoration: 'none', opacity: 0.8 }}>Home</Link>
            <i className="fas fa-chevron-right" style={{ fontSize: '0.9rem', opacity: 0.6 }}></i>
            <span style={{ color: '#ff9800', fontWeight: 600 }}>Our Blog</span>
          </div>
        </div>
        
        {/* Floating transparent bubbles */}
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </header>

      <BlogClient blogs={blogs} />
      
      {/* Footer is already present in layout.tsx assuming we migrated that? Wait, the HTML has it at the bottom. We will keep consistency with the clients page if layout doesn't have it. Clients page doesn't have footer explicitly rendered in page.tsx except in comments. Actually, I didn't see the footer in clients page. Wait, page.tsx had {/* Footer - EXACT SAME AS CLIENTS.HTML */}
      {/* For now, we will leave the main content. */}
    </>
  );
}
