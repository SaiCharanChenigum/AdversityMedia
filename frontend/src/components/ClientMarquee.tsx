'use client';

import React from 'react';

export default function ClientMarquee({ clients }: { clients: any[] }) {
  if (!clients || clients.length === 0) return null;

  return (
    <section className="client-marquee-section py-5 mt-5" style={{ background: '#f8f9fa', overflow: 'hidden', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container mb-5 mt-3">
        <div className="text-center">
          <span className="section-badge">Trusted By</span>
          <h2 className="section-title" style={{ fontSize: '2rem' }}>Our <span className="gradient-text">Valued Clients</span></h2>
        </div>
      </div>
      
      <div className="marquee-container">
        <div className="marquee-track">
          {clients.map((client, index) => (
            <div key={`first-${client.id}-${index}`} className="marquee-item">
              <div className="client-logo-card">
                <img src={client.logoUrl} alt={client.name} className="client-logo-img" />
              </div>
            </div>
          ))}
        </div>
        <div className="marquee-track" aria-hidden="true">
          {clients.map((client, index) => (
            <div key={`second-${client.id}-${index}`} className="marquee-item">
              <div className="client-logo-card">
                <img src={client.logoUrl} alt={client.name} className="client-logo-img" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
