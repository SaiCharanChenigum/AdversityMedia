'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Service {
  id: string;
  title: string;
}

interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
}

interface HomeData {
  heroVideoUrl: string;
  aboutImageUrl: string;
  ceoImageUrl: string;
  headerLogo: string;
  footerLogo: string;
  yearsOfExcellence: string;
  projectsCompleted: string;
  inHandProjects: string;
  happyClients: string;
  awardsWon: string;
  contactNumber: string;
  email: string;
  location: string;
  socialLinks: SocialLinks;
  services: Service[];
}

const defaultData: HomeData = {
  heroVideoUrl: '',
  aboutImageUrl: '',
  ceoImageUrl: '',
  headerLogo: '',
  footerLogo: '',
  yearsOfExcellence: '5',
  projectsCompleted: '100',
  inHandProjects: '10',
  happyClients: '20',
  awardsWon: '10',
  contactNumber: '',
  email: '',
  location: '',
  socialLinks: { facebook: '', instagram: '', linkedin: '', twitter: '' },
  services: [],
};


// Styles
const card: React.CSSProperties = {
  background: 'linear-gradient(135deg, #1a1d2e 0%, #16192a 100%)',
  border: '1px solid #2d3748',
  borderRadius: '16px',
  padding: '28px',
  marginBottom: '24px',
};
const sectionTitle: React.CSSProperties = {
  fontSize: '16px', fontWeight: 700, color: '#f7fafc', marginBottom: '20px',
  display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #2d3748',
  paddingBottom: '12px',
};
const label: React.CSSProperties = {
  fontSize: '13px', fontWeight: 600, color: '#a0aec0', marginBottom: '6px', display: 'block',
};
const inputStyle: React.CSSProperties = {
  width: '100%', background: '#0f1117', border: '1px solid #4a5568', borderRadius: '10px',
  padding: '10px 14px', color: '#e2e8f0', fontSize: '14px', outline: 'none',
  transition: 'border-color 0.2s', boxSizing: 'border-box',
};
const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };
const grid3: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' };

function UploadField({ label: lbl, value, onChange, accept = 'image/*', fieldKey }: {
  label: string; value: string; onChange: (url: string) => void; accept?: string; fieldKey: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.secure_url) {
        onChange(data.secure_url);
      } else {
        setError('Upload failed. Check Cloudinary preset.');
      }
    } catch {
      setError('Upload error occurred.');
    } finally {
      setUploading(false);
    }
  };

  const isVideo = accept.includes('video');
  const previewStyle: React.CSSProperties = {
    width: '100%', height: isVideo ? '120px' : '100px', objectFit: 'cover',
    borderRadius: '8px', marginBottom: '8px', border: '1px solid #2d3748',
  };

  return (
    <div>
      <span style={label}>{lbl}</span>
      {value && (
        isVideo
          ? <video src={value} style={previewStyle} muted playsInline />
          : <img src={value} alt={lbl} style={previewStyle} />
      )}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <label htmlFor={`upload-${fieldKey}`} style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: uploading ? '#4a5568' : '#f97316', color: '#fff', padding: '8px 14px',
          borderRadius: '8px', cursor: uploading ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600,
        }}>
          <i className={`fas fa-${uploading ? 'spinner fa-spin' : 'upload'}`}></i>
          {uploading ? 'Uploading...' : 'Upload File'}
          <input id={`upload-${fieldKey}`} type="file" accept={accept} style={{ display: 'none' }} onChange={handleFile} disabled={uploading} />
        </label>
        <span style={{ fontSize: '12px', color: '#718096', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value ? value.split('/').pop() : 'No file uploaded'}
        </span>
      </div>
      {error && <p style={{ color: '#fc8181', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
    </div>
  );
}

function InputField({ label: lbl, value, onChange, type = 'text', placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <span style={label}>{lbl}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={e => (e.target.style.borderColor = '#f97316')}
        onBlur={e => (e.target.style.borderColor = '#4a5568')}
      />
    </div>
  );
}

export default function HomeAdminClient() {
  const [data, setData] = useState<HomeData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetch('/api/admin/home')
      .then(r => r.json())
      .then(d => {
        let socialLinks = { facebook: '', instagram: '', linkedin: '', twitter: '' };
        let services: Service[] = [];
        try { socialLinks = JSON.parse(d.socialLinks || '{}'); } catch { }
        try { services = JSON.parse(d.services || '[]'); } catch { }
        setData({ ...d, socialLinks, services });
        setLoading(false);
      })
      .catch(() => { setLoading(false); showToast('Failed to load data', 'error'); });
  }, []);

  const set = useCallback((key: keyof HomeData, value: unknown) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);

  const setSocial = (key: keyof SocialLinks, value: string) => {
    setData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));
  };

  const addService = () => {
    const newService: Service = { id: Date.now().toString(), title: '' };
    setData(prev => ({ ...prev, services: [...prev.services, newService] }));
  };

  const updateService = (id: string, field: keyof Service, value: string) => {
    setData(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, [field]: value } : s),
    }));
  };

  const removeService = (id: string) => {
    setData(prev => ({ ...prev, services: prev.services.filter(s => s.id !== id) }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          socialLinks: JSON.stringify(data.socialLinks),
          services: JSON.stringify(data.services),
        }),
      });
      if (res.ok) {
        showToast('✅ Changes saved successfully!', 'success');
      } else {
        showToast('❌ Failed to save changes', 'error');
      }
    } catch {
      showToast('❌ Network error', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '16px' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #2d3748', borderTop: '3px solid #f97316', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
      <span style={{ color: '#718096', fontSize: '14px' }}>Loading settings...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          background: toast.type === 'success' ? '#276749' : '#742a2a',
          color: '#fff', padding: '14px 20px', borderRadius: '12px', fontSize: '14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)', fontWeight: 600,
          border: `1px solid ${toast.type === 'success' ? '#48bb78' : '#fc8181'}`,
        }}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', margin: 0 }}>Home Page Settings</h1>
        <p style={{ color: '#718096', fontSize: '14px', marginTop: '6px' }}>Manage all dynamic content shown on the home page</p>
      </div>

      {/* 1. Logos */}
      <div style={card}>
        <div style={sectionTitle}><i className="fas fa-image" style={{ color: '#f97316' }}></i> Logos</div>
        <div style={grid2}>
          <UploadField label="Header Logo" value={data.headerLogo} onChange={v => set('headerLogo', v)} accept="image/*" fieldKey="headerLogo" />
          <UploadField label="Footer Logo" value={data.footerLogo} onChange={v => set('footerLogo', v)} accept="image/*" fieldKey="footerLogo" />
        </div>
      </div>

      {/* 2. Hero & Media */}
      <div style={card}>
        <div style={sectionTitle}><i className="fas fa-video" style={{ color: '#f97316' }}></i> Media</div>
        <div style={{ marginBottom: '20px' }}>
          <UploadField label="Hero Video" value={data.heroVideoUrl} onChange={v => set('heroVideoUrl', v)} accept="video/*" fieldKey="heroVideo" />
        </div>
        <div style={grid2}>
          <UploadField label="About Team Image" value={data.aboutImageUrl} onChange={v => set('aboutImageUrl', v)} accept="image/*" fieldKey="aboutImage" />
          <UploadField label="Founder / CEO Image" value={data.ceoImageUrl} onChange={v => set('ceoImageUrl', v)} accept="image/*" fieldKey="ceoImage" />
        </div>
      </div>

      {/* 3. Statistics */}
      <div style={card}>
        <div style={sectionTitle}><i className="fas fa-chart-bar" style={{ color: '#f97316' }}></i> Statistics</div>
        <div style={grid3}>
          <InputField label="Years of Excellence" value={data.yearsOfExcellence} onChange={v => set('yearsOfExcellence', v)} placeholder="5" />
          <InputField label="Projects Completed" value={data.projectsCompleted} onChange={v => set('projectsCompleted', v)} placeholder="100" />
          <InputField label="In-Hand Projects" value={data.inHandProjects} onChange={v => set('inHandProjects', v)} placeholder="10" />
          <InputField label="Happy Clients" value={data.happyClients} onChange={v => set('happyClients', v)} placeholder="20" />
          <InputField label="Awards Won" value={data.awardsWon} onChange={v => set('awardsWon', v)} placeholder="10" />
        </div>
      </div>

      {/* 4. Contact Info */}
      <div style={card}>
        <div style={sectionTitle}><i className="fas fa-address-card" style={{ color: '#f97316' }}></i> Contact Information</div>
        <div style={grid3}>
          <InputField label="Phone Number" value={data.contactNumber} onChange={v => set('contactNumber', v)} placeholder="+91 7330924511" />
          <InputField label="Email Address" value={data.email} onChange={v => set('email', v)} type="email" placeholder="info@adversitymedia.in" />
          <InputField label="Location" value={data.location} onChange={v => set('location', v)} placeholder="Hyderabad, India" />
        </div>
      </div>

      {/* 5. Social Links */}
      <div style={card}>
        <div style={sectionTitle}><i className="fas fa-share-alt" style={{ color: '#f97316' }}></i> Social Links</div>
        <div style={grid2}>
          {([
            ['facebook', 'Facebook URL', 'fab fa-facebook'],
            ['instagram', 'Instagram URL', 'fab fa-instagram'],
            ['linkedin', 'LinkedIn URL', 'fab fa-linkedin'],
            ['twitter', 'Twitter / X URL', 'fab fa-twitter'],
          ] as const).map(([key, lbl]) => (
            <InputField key={key} label={lbl} value={data.socialLinks[key] || ''} onChange={v => setSocial(key, v)} placeholder={`https://${key}.com/adversitymedia`} />
          ))}
        </div>
      </div>

      {/* 6. Services */}
      <div style={card}>
        <div style={{ ...sectionTitle, justifyContent: 'space-between' }}>
          <span><i className="fas fa-cogs" style={{ color: '#f97316' }}></i> Services List</span>
          <button onClick={addService} style={{
            background: '#f97316', color: '#fff', border: 'none', borderRadius: '8px',
            padding: '7px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <i className="fas fa-plus"></i> Add Service
          </button>
        </div>
        {data.services.length === 0 && (
          <p style={{ color: '#4a5568', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>No services added yet. Click &quot;Add Service&quot; to begin.</p>
        )}
        {data.services.map((svc, idx) => (
          <div key={svc.id} style={{ background: '#0f1117', border: '1px solid #2d3748', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: '#718096', fontSize: '13px', fontWeight: 600 }}>Service {idx + 1}</span>
              <button onClick={() => removeService(svc.id)} style={{ background: '#742a2a', color: '#fc8181', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>
                <i className="fas fa-trash"></i> Remove
              </button>
            </div>
            <div>
                <span style={label}>Service Title</span>
                <input value={svc.title} onChange={e => updateService(svc.id, 'title', e.target.value)} placeholder="e.g. SEO Services" style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#f97316')} onBlur={e => (e.target.style.borderColor = '#4a5568')} />
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div style={{ position: 'sticky', bottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleSave} disabled={saving} style={{
          background: saving ? '#4a5568' : 'linear-gradient(135deg, #f97316, #ea580c)',
          color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 32px',
          fontSize: '15px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
          boxShadow: '0 8px 24px rgba(249,115,22,0.35)', display: 'flex', alignItems: 'center', gap: '10px',
          transition: 'all 0.2s',
        }}>
          <i className={`fas fa-${saving ? 'spinner fa-spin' : 'save'}`}></i>
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}
