'use client';

import React, { useState } from 'react';
import { Client } from '@prisma/client';

export default function ClientsAdminClient({ initialClients, initialStats, initialIndustries }: { initialClients: Client[], initialStats: any, initialIndustries: any[] }) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [stats, setStats] = useState(initialStats);
  const [industries, setIndustries] = useState(initialIndustries);
  
  const [isStatsSaving, setIsStatsSaving] = useState(false);
  const [isIndustryAdding, setIsIndustryAdding] = useState(false);
  const [deletingIndustryId, setDeletingIndustryId] = useState<string | null>(null);
  
  const [newIndustryLabel, setNewIndustryLabel] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavingClient, setIsSavingClient] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingClientId, setDeletingClientId] = useState<number | null>(null);
  
  const [editingClient, setEditingClient] = useState<Partial<Client>>({
    name: '',
    industry: 'all',
    logoUrl: '',
    description: '',
    services: [],
    websiteUrl: ''
  });

  const fetchClients = async () => {
    const res = await fetch('/api/admin/clients');
    if (res.ok) setClients(await res.json());
  };

  const handleStatsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStatsSaving(true);
    try {
      const res = await fetch('/api/admin/clients/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats)
      });
      if (!res.ok) alert("Failed to save stats");
    } catch (err) {
      alert("Error saving stats");
    } finally {
      setIsStatsSaving(false);
    }
  };

  const handleAddIndustry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIndustryLabel.trim()) return;
    
    setIsIndustryAdding(true);
    const newId = newIndustryLabel.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newIndustries = [...industries, { id: newId, label: newIndustryLabel.trim() }];
    
    try {
      const res = await fetch('/api/admin/clients/industries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIndustries)
      });
      if (res.ok) {
        setIndustries(newIndustries);
        setNewIndustryLabel('');
      } else {
        alert("Failed to add industry");
      }
    } catch (err) {
      alert("Error adding industry");
    } finally {
      setIsIndustryAdding(false);
    }
  };

  const handleDeleteIndustry = async (id: string) => {
    if (!confirm("WARNING: Deleting this industry will also delete ALL clients associated with it. Are you completely sure?")) return;
    
    setDeletingIndustryId(id);
    try {
      const res = await fetch(`/api/admin/clients/industries?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setIndustries(industries.filter((ind: any) => ind.id !== id));
        await fetchClients(); // refresh clients list since some might be deleted
      } else {
        alert("Failed to delete industry");
      }
    } catch (err) {
      alert("Error deleting industry");
    } finally {
      setDeletingIndustryId(null);
    }
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
        setEditingClient(prev => ({ ...prev, logoUrl: data.secure_url }));
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      alert("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const handleClientSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient.name?.trim() || !editingClient.logoUrl?.trim()) {
      alert("Name and Logo are required");
      return;
    }

    setIsSavingClient(true);
    try {
      const method = editingClient.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/clients', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingClient)
      });
      if (res.ok) {
        await fetchClients();
        setIsModalOpen(false);
      } else {
        alert("Failed to save client");
      }
    } catch (err) {
      alert("Error saving client");
    } finally {
      setIsSavingClient(false);
    }
  };

  const handleClientDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this client?")) return;
    setDeletingClientId(id);
    try {
      const res = await fetch(`/api/admin/clients?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchClients();
      } else {
        alert("Failed to delete client");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingClientId(null);
    }
  };

  const openClientModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
    } else {
      setEditingClient({ name: '', industry: industries.length > 0 ? industries[0].id : 'all', logoUrl: '', description: '', services: [], websiteUrl: '' });
    }
    setIsModalOpen(true);
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', background: '#0f1117', border: '1px solid #4a5568',
    borderRadius: '8px', color: '#fff', fontSize: '14px', marginBottom: '16px', outline: 'none'
  };

  const cardStyle = {
    background: 'linear-gradient(135deg, #1a1d2e 0%, #16192a 100%)', 
    border: '1px solid #2d3748', 
    borderRadius: '16px', 
    padding: '24px',
    marginBottom: '24px'
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', margin: 0 }}>Clients Management</h1>
        <p style={{ color: '#718096', fontSize: '14px', marginTop: '6px' }}>Manage client stats, industries, and portfolio cards.</p>
      </div>

      {/* Stats Section */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '18px', color: '#fff', margin: '0 0 20px 0' }}><i className="fas fa-chart-bar me-2"></i> Client Stats</h2>
        <form onSubmit={handleStatsSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#a0aec0', fontSize: '13px', marginBottom: '8px' }}>Happy Clients</label>
            <input style={inputStyle} value={stats.happyClients} onChange={e => setStats({...stats, happyClients: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#a0aec0', fontSize: '13px', marginBottom: '8px' }}>Industries Served</label>
            <input style={inputStyle} value={stats.industriesServed} onChange={e => setStats({...stats, industriesServed: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#a0aec0', fontSize: '13px', marginBottom: '8px' }}>Client Satisfaction</label>
            <input style={inputStyle} value={stats.satisfaction} onChange={e => setStats({...stats, satisfaction: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#a0aec0', fontSize: '13px', marginBottom: '8px' }}>Repeat Clients</label>
            <input style={inputStyle} value={stats.repeatClients} onChange={e => setStats({...stats, repeatClients: e.target.value})} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={isStatsSaving} style={{ background: '#f97316', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: isStatsSaving ? 'not-allowed' : 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isStatsSaving ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : 'Save Stats'}
            </button>
          </div>
        </form>
      </div>

      {/* Industries Section */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '18px', color: '#fff', margin: '0 0 20px 0' }}><i className="fas fa-industry me-2"></i> Industry Categories</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          {industries.map((ind: any) => (
            <div key={ind.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0f1117', border: '1px solid #2d3748', padding: '8px 12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '14px', color: '#cbd5e0' }}>{ind.label}</span>
              <span style={{ fontSize: '12px', color: '#718096', background: '#1a1d2e', padding: '2px 6px', borderRadius: '4px' }}>
                {clients.filter(c => c.industry === ind.id).length}
              </span>
              <button onClick={() => handleDeleteIndustry(ind.id)} disabled={deletingIndustryId === ind.id} style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0 4px', opacity: deletingIndustryId === ind.id ? 0.5 : 1 }}>
                <i className={`fas fa-${deletingIndustryId === ind.id ? 'spinner fa-spin' : 'times'}`}></i>
              </button>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddIndustry} style={{ display: 'flex', gap: '12px' }}>
          <input required style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={newIndustryLabel} onChange={e => setNewIndustryLabel(e.target.value)} placeholder="New Industry Name (e.g. Finance)" />
          <button type="submit" disabled={isIndustryAdding} style={{ background: newIndustryLabel.trim() ? '#f97316' : '#4a5568', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: isIndustryAdding ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
            {isIndustryAdding ? <i className="fas fa-spinner fa-spin"></i> : 'Add Industry'}
          </button>
        </form>
      </div>

      {/* Clients Section */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', color: '#fff', margin: 0 }}><i className="fas fa-users me-2"></i> Client List</h2>
          <button onClick={() => openClientModal()} style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            <i className="fas fa-plus me-2"></i> Add Client
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {clients.map(client => (
            <div key={client.id} style={{ background: '#0f1117', border: '1px solid #2d3748', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '140px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <img src={client.logoUrl} alt={client.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16px', margin: '0 0 4px 0', color: '#e2e8f0' }}>{client.name}</h3>
                <p style={{ fontSize: '12px', color: '#f97316', marginBottom: '16px' }}>
                  {industries.find((i:any) => i.id === client.industry)?.label || client.industry}
                </p>
                
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <button onClick={() => openClientModal(client)} style={{ flex: 1, background: '#4a5568', border: 'none', color: '#fff', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                    Edit
                  </button>
                  <button onClick={() => handleClientDelete(client.id)} disabled={deletingClientId === client.id} style={{ flex: 1, background: '#dc2626', border: 'none', color: '#fff', padding: '8px', borderRadius: '6px', cursor: deletingClientId === client.id ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600, opacity: deletingClientId === client.id ? 0.7 : 1 }}>
                    {deletingClientId === client.id ? <i className="fas fa-spinner fa-spin"></i> : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#1a1d2e', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #2d3748' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', color: '#fff', margin: 0 }}>{editingClient.id ? 'Edit Client' : 'Add New Client'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#a0aec0', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
            </div>

            <form onSubmit={handleClientSave}>
              <label style={{ display: 'block', color: '#a0aec0', fontSize: '13px', marginBottom: '8px' }}>Client Name</label>
              <input required style={inputStyle} value={editingClient.name || ''} onChange={e => setEditingClient({ ...editingClient, name: e.target.value })} />

              <label style={{ display: 'block', color: '#a0aec0', fontSize: '13px', marginBottom: '8px' }}>Industry</label>
              <select style={inputStyle} value={editingClient.industry || ''} onChange={e => setEditingClient({ ...editingClient, industry: e.target.value })}>
                {industries.map((ind: any) => (
                  <option key={ind.id} value={ind.id}>{ind.label}</option>
                ))}
              </select>

              <label style={{ display: 'block', color: '#a0aec0', fontSize: '13px', marginBottom: '8px' }}>Upload Logo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <label style={{ background: uploading ? '#4a5568' : '#f97316', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: uploading ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  <i className={`fas fa-${uploading ? 'spinner fa-spin' : 'upload'} me-2`}></i>
                  {uploading ? 'Uploading...' : 'Choose File'}
                  <input type="file" style={{ display: 'none' }} accept="image/*" disabled={uploading} onChange={handleFileUpload} />
                </label>
                <span style={{ fontSize: '12px', color: '#718096', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  {editingClient.logoUrl || 'No logo selected'}
                </span>
              </div>

              <label style={{ display: 'block', color: '#a0aec0', fontSize: '13px', marginBottom: '8px' }}>Services Provided (Comma separated)</label>
              <input style={inputStyle} value={(editingClient.services || []).join(', ')} onChange={e => {
                const services = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                setEditingClient({ ...editingClient, services });
              }} placeholder="SEO, Web Design, Marketing..." />

              <label style={{ display: 'block', color: '#a0aec0', fontSize: '13px', marginBottom: '8px' }}>Website URL (Optional)</label>
              <input style={inputStyle} value={editingClient.websiteUrl || ''} onChange={e => setEditingClient({ ...editingClient, websiteUrl: e.target.value })} placeholder="https://..." />
              
              <label style={{ display: 'block', color: '#a0aec0', fontSize: '13px', marginBottom: '8px' }}>Description (Optional)</label>
              <textarea style={{ ...inputStyle, minHeight: '80px' }} value={editingClient.description || ''} onChange={e => setEditingClient({ ...editingClient, description: e.target.value })} />

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'transparent', border: '1px solid #4a5568', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" disabled={isSavingClient} style={{ flex: 1, background: '#f97316', border: 'none', color: '#fff', padding: '10px', borderRadius: '8px', cursor: isSavingClient ? 'not-allowed' : 'pointer', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  {isSavingClient ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
