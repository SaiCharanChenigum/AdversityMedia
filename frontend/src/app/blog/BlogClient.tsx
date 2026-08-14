'use client';

import React, { useState } from 'react';
import { Blog } from '@prisma/client';

interface BlogClientProps {
  blogs: Blog[];
}

export default function BlogClient({ blogs }: BlogClientProps) {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  if (!blogs || blogs.length === 0) {
    return (
      <main className="blogs-wrapper" style={{ padding: '8rem 0', background: '#f8f9fa', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', color: '#1a1a1a', fontWeight: 700, marginBottom: '1rem' }}>No blogs right now</h2>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Check back later for new insights and stories!</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="blogs-wrapper" style={{ padding: '4rem 0', background: '#f8f9fa' }}>
        <div className="container">
          <div className="row g-4 justify-content-center">
            {blogs.map((blog) => (
              <div key={blog.id} className="col-12 col-md-6 col-lg-4 d-flex align-items-stretch">
                <article className="blog-card" style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: 0, margin: 0, overflow: 'hidden', borderRadius: '15px', backgroundColor: '#fff', border: 'none', gap: 0 }}>
                  <div className="blog-img" style={{ width: '100%', height: '250px', margin: 0, padding: 0, display: 'block', borderRadius: 0, overflow: 'hidden' }}>
                    <img src={blog.imageUrl} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', margin: 0, borderRadius: 0 }} />
                  </div>
                  <div className="blog-info" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>{blog.title}</h2>
                    <p style={{ flex: 1, color: '#666', fontSize: '0.95rem' }}>{blog.content}</p>
                    <button 
                      className="readmore-btn" 
                      onClick={() => setSelectedBlog(blog)}
                      style={{ marginTop: 'auto', alignSelf: 'flex-start' }}
                    >
                      Read More
                    </button>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modern Pop-up Modal (like Portfolio) */}
      {selectedBlog && (
        <div className="custom-modal-overlay" onClick={() => setSelectedBlog(null)}>
          <div className="custom-modal-content" onClick={e => e.stopPropagation()}>
            <button className="custom-modal-close" onClick={() => setSelectedBlog(null)}>
              <i className="fas fa-times"></i>
            </button>
            <div className="custom-modal-layout">
              <div className="custom-modal-image">
                <img src={selectedBlog.imageUrl} alt={selectedBlog.title} />
              </div>
              <div className="custom-modal-details">
                <h4>{selectedBlog.title}</h4>
                <div className="portfolio-category">{selectedBlog.author || 'Adversity Media'}</div>
                <p>{selectedBlog.content}</p>
                {selectedBlog.hiddenContent && (
                  <p style={{ marginTop: '1rem' }}>{selectedBlog.hiddenContent}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
