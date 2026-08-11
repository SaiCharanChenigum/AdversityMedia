import React from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <title>Admin Panel | Adversity Media</title>
      <meta name="robots" content="noindex, nofollow" />
      <div style={{ margin: 0, fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#0f1117', color: '#e2e8f0', minHeight: '100vh' }}>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar */}
          <aside style={{
            width: '240px',
            background: 'linear-gradient(180deg, #1a1d2e 0%, #0f1117 100%)',
            borderRight: '1px solid #2d3748',
            padding: '0',
            flexShrink: 0,
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            overflowY: 'auto',
            zIndex: 100,
          }}>
            {/* Logo */}
            <div style={{ padding: '24px 20px', borderBottom: '1px solid #2d3748' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                <span style={{ color: '#f97316' }}>A</span>dversity
              </div>
              <div style={{ fontSize: '12px', color: '#718096', marginTop: '2px' }}>Admin Panel</div>
            </div>

            {/* Navigation */}
            <nav style={{ padding: '16px 12px' }}>
              <div style={{ fontSize: '11px', color: '#4a5568', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 8px', marginBottom: '4px' }}>
                Pages
              </div>
              <Link href="/admin/home" style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                borderRadius: '8px', color: '#cbd5e0', textDecoration: 'none',
                fontSize: '14px', transition: 'all 0.2s',
              }}>
                <i className="fas fa-home" style={{ width: '16px', color: '#f97316' }}></i>
                Home Page
              </Link>
              <Link href="/admin/portfolio" style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                borderRadius: '8px', color: '#cbd5e0', textDecoration: 'none',
                fontSize: '14px', transition: 'all 0.2s',
              }}>
                <i className="fas fa-images" style={{ width: '16px', color: '#f97316' }}></i>
                Portfolio
              </Link>

              <div style={{ fontSize: '11px', color: '#4a5568', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 8px', marginTop: '12px', marginBottom: '4px' }}>
                Coming Soon
              </div>
              {['Blog', 'Clients', 'Testimonials'].map(item => (
                <div key={item} style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                  borderRadius: '8px', color: '#4a5568', fontSize: '14px', cursor: 'not-allowed',
                }}>
                  <i className="fas fa-lock" style={{ width: '16px', fontSize: '11px' }}></i>
                  {item}
                </div>
              ))}
            </nav>

            {/* Footer */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px', borderTop: '1px solid #2d3748' }}>
              <Link href="/" style={{ color: '#718096', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-external-link-alt" style={{ fontSize: '11px' }}></i>
                View Website
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main style={{ marginLeft: '240px', flex: 1, padding: '32px', minHeight: '100vh' }}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
