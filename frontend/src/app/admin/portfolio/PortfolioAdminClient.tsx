'use client';

import React, { useState, useEffect } from 'react';

// Interfaces matching Prisma
interface Portfolio {
  id?: number;
  title: string;
  category: string;
  subcategory?: string | null;
  image: string;
  description?: string | null;
  technologies: string[];
  liveUrl?: string | null;
}

interface VideoPortfolio {
  id?: number;
  title: string;
  category: string; // 'videos' or 'ai-videos'
  videoUrl: string;
  thumbnailUrl?: string | null;
  description?: string | null;
  technologies: string[];
}

function ProjectCard({ item, type, openEditModal, deleteItem, homeSlot, onAssignSlot, homePortfolioLimit = 6 }: { item: any, type: string, openEditModal: (i: any) => void, deleteItem: (i: number, t: any) => void, homeSlot?: number | null, onAssignSlot?: (itemId: number, slot: number) => void, homePortfolioLimit?: number }) {
  const [imgError, setImgError] = useState(false);
  const isVideo = type !== 'images';
  const imgUrl = isVideo ? item.videoUrl.replace('.mp4', '.jpg') : item.image;

  return (
    <div style={{ background: '#0f1117', border: '1px solid #2d3748', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {type === 'images' && onAssignSlot && (
        <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10 }}>
          <select
            value={homeSlot || ''}
            onChange={(e) => onAssignSlot(item.id, parseInt(e.target.value))}
            style={{ 
              background: homeSlot ? '#f97316' : 'rgba(0,0,0,0.6)', 
              color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', 
              fontSize: '12px', cursor: 'pointer', outline: 'none',
              fontWeight: homeSlot ? 700 : 400
            }}
          >
            <option value="">{homeSlot ? 'Remove from Home' : 'Add to Home'}</option>
            {Array(homePortfolioLimit).fill(0).map((_, i) => (
              <option key={i} value={i + 1}>Slot {i + 1}</option>
            ))}
          </select>
        </div>
      )}
      <div style={{ height: '160px', overflow: 'hidden', backgroundColor: '#1a1d2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {imgError || !imgUrl ? (
          <div style={{ color: '#4a5568', textAlign: 'center', padding: '20px' }}>
            <i className={`fas ${isVideo ? 'fa-video' : 'fa-image'} fa-2x mb-2`}></i>
            <div style={{ fontSize: '12px' }}>Preview Not Available</div>
          </div>
        ) : (
          <img
            src={imgUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isVideo ? 0.7 : 1 }}
            alt={item.title}
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ color: '#f97316', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
          {item.category.replace('-', ' ')} {item.subcategory ? `> ${item.subcategory.replace('-', ' ')}` : ''}
        </div>
        <h3 style={{ fontSize: '16px', margin: '0 0 12px 0', color: '#e2e8f0', flex: 1 }}>{item.title}</h3>
        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
          <button onClick={() => openEditModal(item)} style={{ flex: 1, background: '#2d3748', border: 'none', color: '#fff', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
          <button onClick={() => deleteItem(item.id!, type as any)} style={{ flex: 1, background: '#742a2a', border: 'none', color: '#fc8181', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioAdminClient() {
  const [activeTab, setActiveTab] = useState<'images' | 'videos' | 'ai-videos'>('images');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeSubFilter, setActiveSubFilter] = useState<string>('all');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isCategoryManagerLoading, setIsCategoryManagerLoading] = useState(false);
  const [statsConfig, setStatsConfig] = useState<string[]>(['all', 'social-media', 'digital-marketing', 'branding']);
  const [isSavingStats, setIsSavingStats] = useState(false);
  const [homePortfolios, setHomePortfolios] = useState<any[]>(Array(6).fill(null));
  const [homePortfolioLimit, setHomePortfolioLimit] = useState<number>(6);
  const [isSavingHome, setIsSavingHome] = useState(false);

  const [images, setImages] = useState<Portfolio[]>([]);
  const [videos, setVideos] = useState<VideoPortfolio[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingImage, setEditingImage] = useState<Portfolio | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoPortfolio | null>(null);

  // File Upload State
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [imgRes, vidRes, catRes, statRes, homeRes] = await Promise.all([
        fetch('/api/admin/portfolio'),
        fetch('/api/admin/portfolio/video'),
        fetch('/api/admin/portfolio/categories'),
        fetch('/api/admin/portfolio/stats'),
        fetch('/api/admin/portfolio/home')
      ]);
      const imgData = await imgRes.json();
      const vidData = await vidRes.json();
      const catData = await catRes.json();
      const statData = await statRes.json();
      const homeData = await homeRes.json();
      
      setImages(imgData);
      setVideos(vidData);
      setCategories(catData);
      setStatsConfig(statData);
      
      if (homeData && !homeData.error) {
        setHomePortfolioLimit(homeData.limit);
        const newHomeArray = Array(6).fill(null);
        homeData.homePortfolios.forEach((item: any) => {
          if (item.order >= 1 && item.order <= 6) {
            newHomeArray[item.order - 1] = item.portfolio;
          }
        });
        setHomePortfolios(newHomeArray);
      }
    } catch (err) {
      console.error("Failed to load data", err);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'image' | 'videoUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.secure_url) {
        if (activeTab === 'images' && editingImage) {
          setEditingImage({ ...editingImage, [fieldName]: data.secure_url });
        } else if (activeTab !== 'images' && editingVideo) {
          setEditingVideo({ ...editingVideo, [fieldName]: data.secure_url });
        }
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      console.error("Upload error", err);
      alert("Error uploading file.");
    }
    setUploading(false);
  };

  const saveItem = async () => {
    if (activeTab === 'images' && editingImage) {
      if (!editingImage.title?.trim()) {
        alert("Please enter a project title.");
        return;
      }
      if (!editingImage.category?.trim()) {
        alert("Please select a category.");
        return;
      }
      if (!editingImage.image?.trim()) {
        alert("Please upload an image or provide an image URL.");
        return;
      }
    } else if (activeTab !== 'images' && editingVideo) {
      if (!editingVideo.title?.trim()) {
        alert("Please enter a video title.");
        return;
      }
      if (!editingVideo.videoUrl?.trim()) {
        alert("Please upload a video or provide a video URL.");
        return;
      }
    }

    setIsSaving(true);
    try {
      if (activeTab === 'images' && editingImage) {
        const method = editingImage.id ? 'PUT' : 'POST';
        const res = await fetch('/api/admin/portfolio', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingImage)
        });
        if (res.ok) {
          fetchData();
          setIsModalOpen(false);
        } else {
          alert("Error saving item");
        }
      } else if (activeTab !== 'images' && editingVideo) {
        const method = editingVideo.id ? 'PUT' : 'POST';
        const res = await fetch('/api/admin/portfolio/video', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingVideo)
        });
        if (res.ok) {
          fetchData();
          setIsModalOpen(false);
        } else {
          alert("Error saving video");
        }
      }
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setIsSaving(false);
    }
  };

  const saveCategories = async (newCategories: any[]) => {
    try {
      const res = await fetch('/api/admin/portfolio/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategories)
      });
      if (res.ok) {
        setCategories(newCategories);
      } else {
        alert("Failed to save categories");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save categories");
    }
  };

  const saveHomePortfolios = async (newLimit: number, newPortfolios: any[]) => {
    // Validate that there are no empty slots up to the limit
    for (let i = 0; i < newLimit; i++) {
      if (!newPortfolios[i]) {
        alert(`Cannot save: Slot ${i + 1} is empty. Please assign a project to all active slots.`);
        return;
      }
    }

    setIsSavingHome(true);
    try {
      const res = await fetch('/api/admin/portfolio/home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: newLimit, portfolios: newPortfolios.map(p => p ? p.id : null) })
      });
      if (res.ok) {
        setHomePortfolioLimit(newLimit);
        setHomePortfolios(newPortfolios);
      } else {
        alert("Failed to save home portfolios.");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving home portfolios.");
    } finally {
      setIsSavingHome(false);
    }
  };

  const deleteCategory = async (categoryId: string, subcategoryId?: string) => {
    let affectedCount = 0;
    if (subcategoryId) {
      affectedCount = images.filter(img => img.category === categoryId && img.subcategory === subcategoryId).length
        + videos.filter(v => v.category === categoryId && v.description?.includes(subcategoryId)).length;
    } else {
      affectedCount = images.filter(img => img.category === categoryId).length
        + videos.filter(v => v.category === categoryId).length;
    }

    if (affectedCount > 0) {
      if (!confirm(`WARNING: This category contains ${affectedCount} projects. Deleting it will PERMANENTLY DELETE all those projects! Are you sure?`)) return;
    } else {
      if (!confirm("Are you sure you want to delete this category?")) return;
    }

    try {
      const url = `/api/admin/portfolio/categories?categoryId=${categoryId}${subcategoryId ? `&subcategoryId=${subcategoryId}` : ''}`;
      const res = await fetch(url, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete category");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteItem = async (id: number, type: 'images' | 'videos' | 'ai-videos') => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const endpoint = type === 'images' ? '/api/admin/portfolio' : '/api/admin/portfolio/video';
      const res = await fetch(`${endpoint}?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openNewModal = () => {
    if (activeTab === 'images') {
      setEditingImage({ title: '', category: 'websites', image: '', technologies: [] });
      setEditingVideo(null);
    } else {
      setEditingVideo({ title: '', category: activeTab, videoUrl: '', technologies: [] });
      setEditingImage(null);
    }
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    if (activeTab === 'images') {
      setEditingImage({ ...item });
      setEditingVideo(null);
    } else {
      setEditingVideo({ ...item });
      setEditingImage(null);
    }
    setIsModalOpen(true);
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const newArr = [...homePortfolios];
    const temp = newArr[index];
    newArr[index] = newArr[draggedIndex];
    newArr[draggedIndex] = temp;
    setHomePortfolios(newArr);
    setDraggedIndex(null);
  };

  const handleAssignSlot = (portfolioId: number, slot: number) => {
    let newArr = [...homePortfolios];
    
    if (slot && !isNaN(slot)) {
      const slotIndex = slot - 1;
      const portfolioObj = images.find(img => img.id === portfolioId);
      
      // Remove from any existing slot
      newArr = newArr.map(p => p && p.id === portfolioId ? null : p);
      
      // Assign to new slot
      newArr[slotIndex] = portfolioObj || null;
    } else {
      // Remove
      newArr = newArr.map(p => p && p.id === portfolioId ? null : p);
    }
    
    setHomePortfolios(newArr);
  };

  // Styles
  const cardStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #1a1d2e 0%, #16192a 100%)',
    border: '1px solid #2d3748',
    borderRadius: '16px',
    padding: '28px',
    marginBottom: '24px',
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#0f1117', border: '1px solid #4a5568', borderRadius: '10px',
    padding: '10px 14px', color: '#e2e8f0', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', marginBottom: '12px'
  };
  const labelStyle: React.CSSProperties = {
    fontSize: '13px', fontWeight: 600, color: '#a0aec0', marginBottom: '6px', display: 'block',
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', margin: 0 }}>Portfolio Management</h1>
          <p style={{ color: '#718096', fontSize: '14px', marginTop: '6px' }}>Manage image projects, video productions, and AI videos.</p>
        </div>
      </div>

      {/* Category Management Section */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCategoryManagerOpen ? '24px' : '0' }}>
          <h2 style={{ color: '#fff', fontSize: '18px', margin: 0 }}><i className="fas fa-tags me-2"></i> Category Management</h2>
          <button 
            onClick={() => {
              if (!isCategoryManagerOpen) {
                setIsCategoryManagerLoading(true);
                setTimeout(() => {
                  setIsCategoryManagerLoading(false);
                  setIsCategoryManagerOpen(true);
                }, 400);
              } else {
                setIsCategoryManagerOpen(false);
              }
            }} 
            disabled={isCategoryManagerLoading}
            style={{
              background: 'transparent', color: '#cbd5e0', border: '1px solid #4a5568', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
            }}>
            {isCategoryManagerLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: '12px', height: '12px' }}></span>}
            {isCategoryManagerOpen ? 'Close' : 'Manage Categories'}
          </button>
        </div>

        {isCategoryManagerOpen && (
          <div>
            {categories.map(cat => (
              <div key={cat.id} style={{ background: '#0f1117', border: '1px solid #2d3748', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ color: '#e2e8f0', fontSize: '16px', margin: 0 }}>{cat.label} ({cat.id})</h3>
                  <button onClick={() => deleteCategory(cat.id)} style={{ background: '#742a2a', color: '#fc8181', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Delete Category</button>
                </div>

                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {cat.subcategories.map((sub: any) => (
                      <div key={sub.id} style={{ background: '#2d3748', color: '#e2e8f0', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {sub.label}
                        <i className="fas fa-times" style={{ cursor: 'pointer', color: '#fc8181' }} onClick={() => deleteCategory(cat.id, sub.id)}></i>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => {
                    const name = prompt("Enter new subcategory name:");
                    if (!name) return;
                    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    const newCats = categories.map(c => c.id === cat.id ? { ...c, subcategories: [...(c.subcategories || []), { id, label: name }] } : c);
                    saveCategories(newCats);
                  }} style={{ background: '#2d3748', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                    + Add Subcategory
                  </button>
                </div>
              </div>
            ))}

            <button onClick={() => {
              const name = prompt("Enter new main category name:");
              if (!name) return;
              const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              saveCategories([...categories, { id, label: name, subcategories: [] }]);
            }} style={{ background: '#f97316', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              + Add Main Category
            </button>
          </div>
        )}
      </div>

      {/* Stats Configuration Section */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ color: '#fff', fontSize: '18px', margin: 0 }}><i className="fas fa-chart-pie me-2"></i> Statistics Configuration</h2>
        </div>
        <p style={{ color: '#a0aec0', fontSize: '13px', marginBottom: '16px' }}>Select what categories to display in the statistics section on the portfolio page.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          {[0, 1, 2, 3].map(index => (
            <select
              key={index}
              value={statsConfig[index] || ''}
              onChange={(e) => {
                const newStats = [...statsConfig];
                newStats[index] = e.target.value;
                setStatsConfig(newStats);
              }}
              style={inputStyle}
            >
              <option value="all">Total Projects (All)</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          ))}
        </div>
        <button onClick={async () => {
          setIsSavingStats(true);
          try {
            const res = await fetch('/api/admin/portfolio/stats', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(statsConfig)
            });
            if (res.ok) alert("Stats configuration saved successfully!");
            else alert("Failed to save stats configuration.");
          } catch (e) {
            console.error(e);
          } finally {
            setIsSavingStats(false);
          }
        }} disabled={isSavingStats} style={{ 
          background: isSavingStats ? '#ed8936' : '#f97316', 
          color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', 
          cursor: isSavingStats ? 'not-allowed' : 'pointer', 
          fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' 
        }}>
          {isSavingStats ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : 'Save Statistics'}
        </button>
      </div>

      {/* Home Portfolio Preview Section */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ color: '#fff', fontSize: '18px', margin: 0 }}><i className="fas fa-home me-2"></i> Home Page Portfolio Cards</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#a0aec0', fontSize: '14px' }}>Display Limit:</span>
            <select 
              value={homePortfolioLimit} 
              onChange={(e) => setHomePortfolioLimit(parseInt(e.target.value))}
              style={{ ...inputStyle, marginBottom: 0, width: 'auto' }}
              disabled={isSavingHome}
            >
              <option value={3}>3 Cards</option>
              <option value={6}>6 Cards</option>
            </select>
            <button 
              onClick={() => saveHomePortfolios(homePortfolioLimit, homePortfolios)} 
              disabled={isSavingHome} 
              style={{ 
                background: isSavingHome ? '#ed8936' : '#f97316', 
                color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', 
                cursor: isSavingHome ? 'not-allowed' : 'pointer', 
                fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' 
              }}
            >
              {isSavingHome ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : 'Save Configuration'}
            </button>
          </div>
        </div>
        <p style={{ color: '#a0aec0', fontSize: '13px', marginBottom: '16px' }}>
          These are the fixed slots for the Home page. Drag and drop to shuffle them. To change a card, click the slot number tag on a project in the main list below.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {Array(6).fill(null).map((_, index) => (
            <div 
              key={index}
              draggable
              onDragStart={(e) => setDraggedIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(index)}
              style={{
                height: '120px',
                background: index < homePortfolioLimit ? '#0f1117' : '#1a1d2e',
                border: index < homePortfolioLimit ? '2px dashed #4a5568' : '2px dashed #2d3748',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#718096',
                cursor: 'grab',
                position: 'relative',
                overflow: 'hidden',
                opacity: index < homePortfolioLimit ? 1 : 0.4
              }}
            >
              <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', zIndex: 2 }}>
                Slot {index + 1}
              </div>
              {homePortfolios[index] ? (
                <>
                  <img src={homePortfolios[index].image} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                  <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 10px', color: '#fff', fontWeight: 600, fontSize: '13px' }}>
                    {homePortfolios[index].title}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: '12px' }}>{index < homePortfolioLimit ? 'Empty Slot' : 'Hidden'}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs and Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['images', 'videos', 'ai-videos'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} style={{
              background: activeTab === tab ? '#2d3748' : '#1a1d2e',
              color: activeTab === tab ? '#fff' : '#a0aec0',
              border: '1px solid #2d3748', borderRadius: '8px', padding: '8px 16px',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize'
            }}>
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
        <button onClick={openNewModal} style={{
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px',
          fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <i className="fas fa-plus"></i> Add New Project
        </button>
      </div>

      {/* List Area */}
      <div style={cardStyle}>

        {/* Category Filters Toggle */}
        {activeTab === 'images' && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button onClick={() => setIsFiltersOpen(!isFiltersOpen)} style={{
                background: 'transparent',
                color: '#cbd5e0',
                border: '1px solid #4a5568',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="fas fa-filter"></i> Filters {activeFilter !== 'all' ? '(Active)' : ''}
                <i className={`fas fa-chevron-${isFiltersOpen ? 'up' : 'down'}`} style={{ fontSize: '10px' }}></i>
              </button>
            </div>

            {isFiltersOpen && (
              <div style={{
                background: '#0f1117',
                border: '1px solid #2d3748',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#a0aec0', marginBottom: '12px' }}>Categories</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[{ id: 'all', label: 'All Projects' }, ...categories].map(filter => {
                    const count = filter.id === 'all' ? images.length : images.filter(img => img.category.toLowerCase() === filter.id.toLowerCase()).length;
                    return (
                      <button key={filter.id} onClick={() => { setActiveFilter(filter.id); setActiveSubFilter('all'); }} style={{
                        background: activeFilter === filter.id ? '#f97316' : 'transparent',
                        color: activeFilter === filter.id ? '#fff' : '#cbd5e0',
                        border: `1px solid ${activeFilter === filter.id ? '#f97316' : '#4a5568'}`,
                        borderRadius: '20px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer',
                      }}>
                        {filter.label} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Subcategory Filters */}
                {activeFilter !== 'all' && categories.find(c => c.id === activeFilter)?.subcategories?.length > 0 && (
                  <>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#a0aec0', marginTop: '20px', marginBottom: '12px', borderTop: '1px solid #2d3748', paddingTop: '16px' }}>{categories.find(c => c.id === activeFilter)?.label} Subcategories</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {[{ id: 'all', label: `All ${categories.find(c => c.id === activeFilter)?.label}` }, ...(categories.find(c => c.id === activeFilter)?.subcategories || [])].map(sub => {
                        const count = sub.id === 'all'
                          ? images.filter(img => img.category.toLowerCase() === activeFilter.toLowerCase()).length
                          : images.filter(img => img.category.toLowerCase() === activeFilter.toLowerCase() && (img.subcategory?.toLowerCase() || 'uncategorized') === sub.id.toLowerCase()).length;
                        return (
                          <button key={sub.id} onClick={() => setActiveSubFilter(sub.id)} style={{
                            background: activeSubFilter === sub.id ? '#4a5568' : 'transparent',
                            color: activeSubFilter === sub.id ? '#fff' : '#a0aec0',
                            border: `1px solid ${activeSubFilter === sub.id ? '#4a5568' : '#2d3748'}`,
                            borderRadius: '20px', padding: '4px 12px', fontSize: '12px', cursor: 'pointer',
                          }}>
                            {sub.label} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#718096' }}>Loading projects...</div>
        ) : (
          <div>
            {activeTab === 'images' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {images.filter(img => {
                  if (activeFilter !== 'all' && img.category.toLowerCase() !== activeFilter.toLowerCase()) return false;
                  if (activeFilter === 'branding' && activeSubFilter !== 'all' && (img.subcategory?.toLowerCase() || 'uncategorized') !== activeSubFilter.toLowerCase()) return false;
                  return true;
                }).map(img => {
                  const homeSlotIndex = homePortfolios.findIndex(p => p && p.id === img.id);
                  const homeSlot = homeSlotIndex !== -1 ? homeSlotIndex + 1 : null;
                  return (
                    <ProjectCard 
                      key={img.id} 
                      item={img} 
                      type="images" 
                      openEditModal={openEditModal} 
                      deleteItem={deleteItem} 
                      homeSlot={homeSlot}
                      onAssignSlot={handleAssignSlot}
                      homePortfolioLimit={homePortfolioLimit}
                    />
                  );
                })}
              </div>
            )}

            {activeTab !== 'images' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {videos.filter(v => v.category === activeTab).map(vid => (
                  <ProjectCard key={vid.id} item={vid} type={activeTab} openEditModal={openEditModal} deleteItem={deleteItem} />
                ))}
              </div>
            )}

            {((activeTab === 'images' && images.filter(img => {
              if (activeFilter !== 'all' && img.category.toLowerCase() !== activeFilter.toLowerCase()) return false;
              if (activeFilter === 'branding' && activeSubFilter !== 'all' && (img.subcategory?.toLowerCase() || 'uncategorized') !== activeSubFilter.toLowerCase()) return false;
              return true;
            }).length === 0) || (activeTab !== 'images' && videos.filter(v => v.category === activeTab).length === 0)) && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#718096' }}>No projects found for this filter.</div>
              )}

          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#1a1d2e', border: '1px solid #2d3748', borderRadius: '16px', width: '90%', maxWidth: '600px',
            maxHeight: '90vh', overflowY: 'auto', padding: '32px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#fff' }}>
                {editingImage?.id || editingVideo?.id ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#a0aec0', cursor: 'pointer', fontSize: '18px' }}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* FORM */}
            <label style={labelStyle}>Project Title</label>
            <input
              style={inputStyle}
              value={editingImage ? editingImage.title : editingVideo?.title || ''}
              onChange={e => {
                if (editingImage) setEditingImage({ ...editingImage, title: e.target.value });
                if (editingVideo) setEditingVideo({ ...editingVideo, title: e.target.value });
              }}
            />

            {/* Category */}
            <label style={labelStyle}>Category</label>
            {activeTab === 'images' ? (
              <select style={inputStyle} value={editingImage?.category} onChange={e => setEditingImage({ ...editingImage!, category: e.target.value })}>
                <option value="branding">Branding & Design</option>
                <option value="digital-marketing">Digital Marketing</option>
                <option value="social-media">Social Media</option>
                <option value="websites">Website Development</option>
                <option value="mobile">Mobile Applications</option>
              </select>
            ) : (
              <input style={inputStyle} value={activeTab} disabled />
            )}

            {/* Subcategory (Only for images & branding) */}
            {activeTab === 'images' && editingImage?.category === 'branding' && (
              <>
                <label style={labelStyle}>Branding Subcategory</label>
                <select style={inputStyle} value={editingImage?.subcategory || ''} onChange={e => setEditingImage({ ...editingImage!, subcategory: e.target.value })}>
                  <option value="">None</option>
                  <option value="education">Education</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="spa-wellness">Spa & Wellness</option>
                  <option value="food-beverage">Food & Beverage</option>
                </select>
              </>
            )}

            {/* Media Upload */}
            <label style={labelStyle}>{activeTab === 'images' ? 'Upload Image' : 'Upload Video (.mp4)'}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <label style={{
                background: uploading ? '#4a5568' : '#f97316', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: uploading ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600
              }}>
                <i className={`fas fa-${uploading ? 'spinner fa-spin' : 'upload'} me-2`}></i>
                {uploading ? 'Uploading...' : 'Choose File'}
                <input type="file" style={{ display: 'none' }} accept={activeTab === 'images' ? 'image/*' : 'video/*'} disabled={uploading} onChange={e => handleFileUpload(e, activeTab === 'images' ? 'image' : 'videoUrl')} />
              </label>
              <span style={{ fontSize: '12px', color: '#718096', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                {(activeTab === 'images' ? editingImage?.image : editingVideo?.videoUrl) || 'No file selected'}
              </span>
            </div>

            <label style={labelStyle}>Description (Optional)</label>
            <textarea
              style={{ ...inputStyle, minHeight: '80px' }}
              value={(activeTab === 'images' ? editingImage?.description : editingVideo?.description) || ''}
              onChange={e => {
                if (editingImage) setEditingImage({ ...editingImage, description: e.target.value });
                if (editingVideo) setEditingVideo({ ...editingVideo, description: e.target.value });
              }}
            />

            <label style={labelStyle}>Technologies (Comma separated)</label>
            <input
              style={inputStyle}
              value={(activeTab === 'images' ? editingImage?.technologies : editingVideo?.technologies)?.join(', ') || ''}
              onChange={e => {
                const techs = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                if (editingImage) setEditingImage({ ...editingImage, technologies: techs });
                if (editingVideo) setEditingVideo({ ...editingVideo, technologies: techs });
              }}
              placeholder="React, Next.js, Tailwind..."
            />

            {activeTab === 'images' && (
              <>
                <label style={labelStyle}>Live URL (Optional)</label>
                <input
                  style={inputStyle}
                  value={editingImage?.liveUrl || ''}
                  onChange={e => setEditingImage({ ...editingImage!, liveUrl: e.target.value })}
                  placeholder="https://..."
                />
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setIsModalOpen(false)} style={{
                background: 'transparent', border: '1px solid #4a5568', color: '#e2e8f0', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: 600
              }} disabled={isSaving}>Cancel</button>
              <button onClick={saveItem} disabled={isSaving} style={{
                background: isSaving ? '#dd6b20' : '#f97316', border: 'none', color: '#fff', borderRadius: '8px', padding: '10px 24px', cursor: isSaving ? 'not-allowed' : 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                {isSaving && <i className="fas fa-spinner fa-spin"></i>}
                {isSaving ? 'Saving...' : 'Save Project'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
