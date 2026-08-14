'use client';

import React, { useState } from 'react';
import { Blog } from '@prisma/client';

export default function BlogAdminClient({ initialBlogs }: { initialBlogs: Blog[] }) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const [newBlog, setNewBlog] = useState<Partial<Blog>>({
    title: '',
    content: '',
    imageUrl: '',
    hiddenContent: '',
    author: 'Adversity Media'
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.secure_url) {
        setNewBlog(prev => ({ ...prev, imageUrl: data.secure_url }));
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      console.error("Upload error", err);
      alert("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/admin/blog');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title?.trim() || !newBlog.content?.trim() || !newBlog.imageUrl?.trim()) {
      alert("Please fill in all required fields (Title, Image, and Main Content).");
      return;
    }

    setIsSaving(true);
    try {
      const method = newBlog.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/blog', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlog)
      });
      if (res.ok) {
        await fetchBlogs();
        setIsModalOpen(false);
        setNewBlog({ title: '', content: '', imageUrl: '', hiddenContent: '', author: 'Adversity Media' });
      } else {
        alert("Failed to save blog");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving blog");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchBlogs();
      } else {
        alert("Failed to delete blog");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (blog: Blog) => {
    setNewBlog(blog);
    setIsModalOpen(true);
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', background: '#0f1117', border: '1px solid #4a5568',
    borderRadius: '8px', color: '#fff', fontSize: '14px', marginBottom: '16px', outline: 'none'
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', margin: 0 }}>Blog Management</h1>
          <p style={{ color: '#718096', fontSize: '14px', marginTop: '6px' }}>Manage all blog posts on your website.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => {
            setNewBlog({ title: '', content: '', imageUrl: '', hiddenContent: '', author: 'Adversity Media' });
            setIsModalOpen(true);
          }} style={{
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <i className="fas fa-plus"></i> Add New Blog
          </button>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1a1d2e 0%, #16192a 100%)', border: '1px solid #2d3748', borderRadius: '16px', padding: '24px' }}>
        {blogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#718096' }}>No blogs right now. Create one to get started!</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {blogs.map(blog => (
              <div key={blog.id} style={{ background: '#0f1117', border: '1px solid #2d3748', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '160px', overflow: 'hidden', backgroundColor: '#1a1d2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={blog.imageUrl} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '16px', margin: '0 0 8px 0', color: '#e2e8f0', flex: 1 }}>{blog.title}</h3>
                  <p style={{ fontSize: '12px', color: '#718096', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{blog.content}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => openEditModal(blog)} style={{ flex: 1, background: '#4a5568', border: 'none', color: '#fff', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(blog.id)} disabled={deletingId === blog.id} style={{ flex: 1, background: '#dc2626', border: 'none', color: '#fff', padding: '8px', borderRadius: '6px', cursor: deletingId === blog.id ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600, opacity: deletingId === blog.id ? 0.7 : 1 }}>
                      {deletingId === blog.id ? <i className="fas fa-spinner fa-spin"></i> : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#1a1d2e', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #2d3748' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', color: '#fff', margin: 0 }}>{newBlog.id ? 'Edit Blog' : 'Add New Blog'}</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#a0aec0', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
            </div>

            <form onSubmit={handleSave}>
              <div>
                <label style={{ display: 'block', color: '#a0aec0', fontSize: '13px', marginBottom: '8px' }}>Title</label>
                <input required style={inputStyle} value={newBlog.title || ''} onChange={e => setNewBlog({ ...newBlog, title: e.target.value })} placeholder="Enter blog title" />
              </div>

              <div>
                <label style={{ display: 'block', color: '#a0aec0', fontSize: '13px', marginBottom: '8px' }}>Upload Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <label style={{
                    background: uploading ? '#4a5568' : '#f97316', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: uploading ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600
                  }}>
                    <i className={`fas fa-${uploading ? 'spinner fa-spin' : 'upload'} me-2`}></i>
                    {uploading ? 'Uploading...' : 'Choose File'}
                    <input type="file" style={{ display: 'none' }} accept="image/*" disabled={uploading} onChange={handleFileUpload} />
                  </label>
                  <span style={{ fontSize: '12px', color: '#718096', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {newBlog.imageUrl || 'No file selected'}
                  </span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: '#a0aec0', fontSize: '13px', marginBottom: '8px' }}>Short Description / Main Content</label>
                <textarea required style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} value={newBlog.content || ''} onChange={e => setNewBlog({ ...newBlog, content: e.target.value })} placeholder="Main visible text..." />
              </div>

              <div>
                <label style={{ display: 'block', color: '#a0aec0', fontSize: '13px', marginBottom: '8px' }}>Full Content (Hidden until clicked)</label>
                <textarea style={{ ...inputStyle, minHeight: '150px', resize: 'vertical' }} value={newBlog.hiddenContent || ''} onChange={e => setNewBlog({ ...newBlog, hiddenContent: e.target.value })} placeholder="Detailed blog post text..." />
              </div>
              
              <div>
                <label style={{ display: 'block', color: '#a0aec0', fontSize: '13px', marginBottom: '8px' }}>Author</label>
                <input style={inputStyle} value={newBlog.author || ''} onChange={e => setNewBlog({ ...newBlog, author: e.target.value })} placeholder="Adversity Media" />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'transparent', border: '1px solid #4a5568', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" disabled={isSaving} style={{ flex: 1, background: '#f97316', border: 'none', color: '#fff', padding: '10px', borderRadius: '8px', cursor: isSaving ? 'not-allowed' : 'pointer', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  {isSaving ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : 'Save Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
