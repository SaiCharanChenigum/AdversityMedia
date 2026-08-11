"use client";
import React, { useState } from 'react';

export default function HomePortfolioSection({ homePortfolios }: { homePortfolios: any[] }) {
    const [selectedProject, setSelectedProject] = useState<any>(null);

    return (
        <section className="portfolio-section" id="portfolio" aria-labelledby="portfolio-title">
            <div className="container">
                <div className="section-header text-center">
                    <span className="section-badge">Our Work</span>
                    <h2 id="portfolio-title" className="section-title">
                        Our <span className="gradient-text">Portfolio</span>
                    </h2>
                </div>
                
                <div className="row g-4">
                    {/* Dynamic Portfolio Items */}
                    {homePortfolios.map((item: any, index: number) => (
                        <div key={item.id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={`${(index % 3 + 1) * 100}`}>
                            <article className="portfolio-item cursor-pointer" onClick={() => setSelectedProject(item.portfolio)} style={{ cursor: 'pointer' }}>
                                <div className="portfolio-image">
                                    <img src={item.portfolio.image} alt={`${item.portfolio.title} project showcase`} className="img-fluid" loading="lazy" style={{ objectFit: 'cover', height: '100%', width: '100%' }} />
                                    <div className="portfolio-overlay">
                                        <div className="portfolio-content">
                                            <h4>{item.portfolio.title}</h4>
                                            <p>{item.portfolio.category}</p>
                                            <button 
                                                onClick={() => setSelectedProject(item.portfolio)}
                                                className="btn btn-link p-0 text-white" 
                                                aria-label={`View ${item.portfolio.title} project details`}
                                                style={{ fontSize: '1.5rem', border: 'none', background: 'transparent' }}
                                            >
                                                <i className="fas fa-arrow-right" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-5">
                    <a href="/portfolio" className="btn btn-primary-solid" aria-label="View our complete portfolio">
                        View All Projects <i className="fas fa-arrow-right ms-2" aria-hidden="true"></i>
                    </a>
                </div>
            </div>

            {/* React Custom Modal */}
            {selectedProject && (
                <div className="custom-modal-overlay" onClick={() => setSelectedProject(null)}>
                    <div className="custom-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="custom-modal-close" onClick={() => setSelectedProject(null)}>
                            <i className="fas fa-times"></i>
                        </button>
                        <div className="custom-modal-layout">
                            <div className="custom-modal-image">
                                <img src={selectedProject.image} alt={selectedProject.title} />
                            </div>
                            <div className="custom-modal-details">
                                <h4>{selectedProject.title}</h4>
                                <div className="portfolio-category">{selectedProject.category}</div>
                                {selectedProject.description && (
                                    <p>{selectedProject.description}</p>
                                )}
                                <div className="portfolio-tech" id="modalTechnologies">
                                    {selectedProject.technologies?.map((tech: string) => (
                                        <span className="tech-tag" key={tech}>{tech}</span>
                                    ))}
                                </div>
                                {selectedProject.liveUrl && selectedProject.liveUrl !== '#' && (
                                    <div className="mt-4">
                                        <a href={selectedProject.liveUrl} target="_blank" rel="noreferrer" className="btn btn-portfolio">
                                            View Live Project <i className="fas fa-external-link-alt"></i>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
