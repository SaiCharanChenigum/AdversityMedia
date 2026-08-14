'use client';

import React, { useState } from 'react';
import { Testimonial } from '@prisma/client';

export default function TestimonialsAdminClient({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial>>({
    author: '',
    text: '',
    company: '',
    imageUrl: '',
    rating: 5
  });

  const fetchTestimonials = async () => {
    const res = await fetch('/api/admin/testimonials');
    if (res.ok) setTestimonials(await res.json());
  };

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
        setEditingTestimonial(prev => ({ ...prev, imageUrl: data.secure_url }));
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      alert("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial.author?.trim() || !editingTestimonial.text?.trim() || !editingTestimonial.imageUrl?.trim()) {
      alert("Author Name, Review Text, and Author Image are required.");
      return;
    }

    setIsSaving(true);
    try {
      const method = editingTestimonial.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTestimonial)
      });
      if (res.ok) {
        await fetchTestimonials();
        setIsModalOpen(false);
      } else {
        alert("Failed to save testimonial");
      }
    } catch (err) {
      alert("Error saving testimonial");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchTestimonials();
      } else {
        alert("Failed to delete testimonial");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const openModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
    } else {
      setEditingTestimonial({ author: '', text: '', company: '', imageUrl: '', rating: 5 });
    }
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
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', margin: 0 }}>Testimonials Management</h1>
          <p style={{ color: '#718096', fontSize: '14px', marginTop: '6px' }}>Manage client reviews on the website.</p>
        </div>
        <button onClick={() => openModal()} style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-plus"></i> Add Testimonial
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {testimonials.map(testimonial => (
          <div key={testimonial.id} style={{ background: 'linear-gradient(135deg, #1a1d2e 0%, #16192a 100%)', border: '1px solid #2d3748', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: '#f97316', fontSize: '24px', marginBottom: '16px', opacity: 0.8 }}>
              <i className="fas fa-quote-left"></i>
            </div>
            <p style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: 1.6, flex: 1, fontStyle: 'italic', marginBottom: '20px' }}>
              "{testimonial.text}"
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', borderTop: '1px solid #2d3748', paddingTop: '16px' }}>
              <img src={testimonial.imageUrl} alt={testimonial.author} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h4 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '15px' }}>{testimonial.author}</h4>
                <div style={{ color: '#a0aec0', fontSize: '12px' }}>{testimonial.company}</div>
              </div>
            </div>

            <div style={{ color: '#f97316', marginBottom: '20px', fontSize: '12px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <i key={i} className={i < testimonial.rating ? "fas fa-star" : "far fa-star"}></i>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => openModal(testimonial)} style={{ flex: 1, background: '#4a5568', border: 'none', color: '#fff', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                Edit
              </button>
              <button onClick={() => handleDelete(testimonial.id)} disabled={deletingId === testimonial.id} style={{ flex: 1, background: '#dc2626', border: 'none', color: '#fff', padding: '8px', borderRadius: '6px', cursor: deletingId === testimonial.id ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600, opacity: deletingId === testimonial.id ? 0.7 : 1 }}>
                {deletingId === testimonial.id ? <i className="fas fa-spinner fa-spin"></i> : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#1a1d2e', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #2d3748' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', color: '#fff', margin: 0 }}>{editingTestimonial.id ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#a0aec0', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
            </div>

            <form onSubmit={handleSave}>
              <label style={{ display: 'block', color: '#a0aec0', fontSize: '13px', marginBottom: '8px' }}>Author Name</label>
              <input required style={inputStyle} value={editingTestimonial.author || ''} onChange={e => setEditingTestimonial({ ...editingTestimonial, author: e.target.value })} />

              <label style={{ display: 'block', color: '#a0aec0', fontSize: '13px', marginBottom: '8px' }}>Company (Optional)</label>
              <input style={inputStyle} value={editingTestimonial.company || ''} onChange={e => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })} />

              <label style={{ display: 'block', color: '#a0aec0', fontSize: '13px', marginBottom: '8px' }}>Upload Author Image</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <label style={{ background: uploading ? '#4a5568' : '#f97316', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: uploading ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  <i className={`fas fa-${uploading ? 'spinner fa-spin' : 'upload'} me-2`}></i>
                  {uploading ? 'Uploading...' : 'Choose File'}
                  <input type="file" style={{ display: 'none' }} accept="image/*" disabled={uploading} onChange={handleFileUpload} />
                </label>
                <span style={{ fontSize: '12px', color: '#718096', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  {editingTestimonial.imageUrl || 'No image selected'}
                </span>
                {editingTestimonial.imageUrl && (
                  <img src={editingTestimonial.imageUrl} alt="Preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                )}
              </div>

              <label style={{ display: 'block', color: '#a0aec0', fontSize: '13px', marginBottom: '8px' }}>Rating (1-5)</label>
              <select style={inputStyle} value={editingTestimonial.rating || 5} onChange={e => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) })}>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                ))}
              </select>

              <label style={{ display: 'block', color: '#a0aec0', fontSize: '13px', marginBottom: '8px' }}>Review Text</label>
              <textarea required style={{ ...inputStyle, minHeight: '120px' }} value={editingTestimonial.text || ''} onChange={e => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })} />

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'transparent', border: '1px solid #4a5568', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" disabled={isSaving} style={{ flex: 1, background: '#f97316', border: 'none', color: '#fff', padding: '10px', borderRadius: '8px', cursor: isSaving ? 'not-allowed' : 'pointer', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  {isSaving ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
