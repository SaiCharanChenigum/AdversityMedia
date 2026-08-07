'use client';

import React, { useState } from 'react';
import { Blog } from '@prisma/client';

interface BlogClientProps {
  blogs: Blog[];
}

export default function BlogClient({ blogs }: BlogClientProps) {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  if (!blogs || blogs.length === 0) {
    return null;
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

      {/* Modern Pop-up Modal (like Portfolio/Clients) */}
      {selectedBlog && (
        <div className="modal-overlay" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, justifyContent: 'center', alignItems: 'center' }} onClick={() => setSelectedBlog(null)}>
          <div className="modal-content" style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', maxWidth: '1000px', width: '90%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <span className="close-btn" style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '1.5rem', cursor: 'pointer', color: '#333', zIndex: 10 }} onClick={() => setSelectedBlog(null)}>&times;</span>
            
            <div className="row h-100">
              {/* Left Side: Main Image */}
              <div className="col-lg-6 mb-4 mb-lg-0">
                <img src={selectedBlog.imageUrl} alt={selectedBlog.title} style={{ width: '100%', height: '100%', maxHeight: '600px', objectFit: 'cover', borderRadius: '8px' }} />
              </div>
              
              {/* Right Side: Content & Gallery */}
              <div className="col-lg-6 d-flex flex-column">
                <h2 style={{ marginBottom: '1rem', color: '#1a1a1a', fontWeight: 700 }}>{selectedBlog.title}</h2>
                <div style={{ color: '#555', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '1.1rem', flex: 1 }}>
                  <p style={{ marginBottom: '1rem' }}>{selectedBlog.content}</p>
                  {selectedBlog.hiddenContent && (
                    <p>{selectedBlog.hiddenContent}</p>
                  )}
                </div>
                
                {selectedBlog.galleryImages && selectedBlog.galleryImages.length > 0 && (
                  <div className="mini-gallery mt-auto">
                    <h4 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: '#333' }}>Gallery</h4>
                    <div className="row g-3">
                      {selectedBlog.galleryImages.map((imgUrl, i) => (
                        <div className="col-sm-6" key={i}>
                          <img src={imgUrl} alt="Gallery image" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
