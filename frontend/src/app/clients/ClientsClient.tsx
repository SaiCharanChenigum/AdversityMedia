'use client';

import React, { useState, useEffect } from 'react';

export default function ClientsClient({ initialClients }: { initialClients: any[] }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const filteredClients = activeFilter === 'all' 
        ? initialClients 
        : initialClients.filter(c => c.industry?.toLowerCase() === activeFilter.toLowerCase());

    const closeModal = () => setSelectedClient(null);

    if (!isMounted) return null;

    return (
        <>
            {/*  Industry Filter  */}
            <section className="industry-filter py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="filter-tabs">
                                <button className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>All Industries</button>
                                <button className={`filter-tab ${activeFilter === 'hospitality' ? 'active' : ''}`} onClick={() => setActiveFilter('hospitality')}>Hospitality</button>
                                <button className={`filter-tab ${activeFilter === 'healthcare' ? 'active' : ''}`} onClick={() => setActiveFilter('healthcare')}>Healthcare</button>
                                <button className={`filter-tab ${activeFilter === 'education' ? 'active' : ''}`} onClick={() => setActiveFilter('education')}>Education</button>
                                <button className={`filter-tab ${activeFilter === 'retail' ? 'active' : ''}`} onClick={() => setActiveFilter('retail')}>Retail & E-commerce</button>
                                <button className={`filter-tab ${activeFilter === 'technology' ? 'active' : ''}`} onClick={() => setActiveFilter('technology')}>Technology</button>
                                <button className={`filter-tab ${activeFilter === 'fashion' ? 'active' : ''}`} onClick={() => setActiveFilter('fashion')}>Fashion & Lifestyle</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/*  Clients Grid  */}
            <section className="clients-section py-5">
                <div className="container">
                    <div className="row g-4 clients-grid" id="clientsGrid">
                        {filteredClients.map((client, index) => (
                            <div key={client.id || index} className="col-lg-4 col-md-6 client-item animate__animated animate__fadeInUp" style={{ animationDelay: `${(index % 3) * 0.1}s` }}>
                                <div className="client-card">
                                    <div className="client-logo-container">
                                        <img src={client.logoUrl} alt={`${client.name} Logo`} className="client-logo" />
                                        <div className="client-overlay">
                                            <div className="client-actions">
                                                <button 
                                                    className="client-action" 
                                                    onClick={() => setSelectedClient(client)}
                                                    style={{ border: 'none', cursor: 'pointer' }}
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="client-info">
                                        <h4 className="client-name">{client.name}</h4>
                                        <p className="client-category">{client.category || client.industry}</p>
                                        <div className="client-services">
                                            {client.services && client.services.map((service: string, sIndex: number) => (
                                                <span key={sIndex} className="service-tag">{service}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* React Custom Modal */}
            {selectedClient && (
                <div className="custom-modal-overlay" onClick={closeModal}>
                    <div className="custom-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="custom-modal-close" onClick={closeModal}>
                            <i className="fas fa-times"></i>
                        </button>
                        <div className="custom-modal-layout">
                            <div className="custom-modal-image">
                                <img src={selectedClient.logoUrl} alt={selectedClient.name} style={{ objectFit: 'contain', backgroundColor: '#fff', padding: '20px' }} />
                            </div>
                            <div className="custom-modal-details">
                                <h4>{selectedClient.name}</h4>
                                <div className="portfolio-category">{selectedClient.category || selectedClient.industry}</div>
                                {selectedClient.description && (
                                    <p>{selectedClient.description}</p>
                                )}
                                <div className="portfolio-tech" id="modalTechnologies">
                                    {selectedClient.services?.map((tech: string) => (
                                        <span className="tech-tag" key={tech}>{tech}</span>
                                    ))}
                                </div>
                                {selectedClient.websiteUrl && (
                                    <div className="mt-4">
                                        <a href={selectedClient.websiteUrl} target="_blank" rel="noreferrer" className="btn btn-portfolio">
                                            Visit Website <i className="fas fa-external-link-alt"></i>
                                        </a>
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
