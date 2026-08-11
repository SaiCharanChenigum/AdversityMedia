"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function PortfolioClient({ initialData, videoData = [], categories = [], statsConfig = ['all', 'social-media', 'digital-marketing', 'branding'] }: { initialData: any[], videoData?: any[], categories?: any[], statsConfig?: string[] }) {
    const [visibleCount, setVisibleCount] = useState(12);
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeSubFilter, setActiveSubFilter] = useState('all');
    const [activeView, setActiveView] = useState('images');
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [selectedVideo, setSelectedVideo] = useState<any>(null);

    const loadMore = () => {
        setVisibleCount(prev => prev + 12);
    };

    const filteredData = activeFilter === 'all' 
        ? initialData 
        : initialData.filter(item => {
            const categoryMatch = activeFilter === 'websites' 
                ? (item.category === 'websites' || item.category === 'web-design') 
                : item.category === activeFilter;
                
            if (!categoryMatch) return false;
            
            if (activeFilter === 'branding' && activeSubFilter !== 'all') {
                return item.subcategory === activeSubFilter;
            }
            
            return true;
        });

  return (
    <>
      {/* Content Migrated from HTML */}
      {/*  Portfolio Header  */}
    <section className="portfolio-header">
        <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
        </div>
        
        <div className="container">
            <div className="text-center">
                <span className="section-badge">Our Work</span>
                <h1 className="complete-portfolio" >Complete Portfolio</h1>
                <p className="hero-description">
                    Explore our comprehensive collection of 100+ successful projects across digital marketing, 
                    web development, mobile applications, and creative branding solutions.
                </p>
                <div className="breadcrumb-nav mt-4">
                    <a href="/" className="breadcrumb-link">Home</a>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">Portfolio</span>
                </div>
            </div>
        </div>
    </section>

    {/*  Portfolio Filters & Grid  */}
    <section className="portfolio-section">
        <div className="container">
           {/*  Filter Buttons  */}
{activeView === 'images' && (
    <>
<div className="portfolio-filters" data-aos="fade-up">
    {/*  Main Filter Row  */}
    <div className="filter-row-main">
        <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => {setActiveFilter('all'); setActiveSubFilter('all'); setVisibleCount(12);}}>All Projects</button>
        {categories.map(cat => (
            <button key={cat.id} className={`filter-btn ${activeFilter === cat.id ? 'active' : ''}`} onClick={() => {setActiveFilter(cat.id); setActiveSubFilter('all'); setVisibleCount(12);}}>{cat.label}</button>
        ))}
    </div>
    
    {/*  Subcategory Filter Row (Hidden by default, shown when a category with subcategories is active)  */}
    {activeFilter !== 'all' && categories.find(c => c.id === activeFilter)?.subcategories?.length > 0 && (
        <div className="filter-row-sub" id="subcategoryFilters">
            {categories.find(c => c.id === activeFilter)?.subcategories.map((sub: any) => (
                <button key={sub.id} className={`filter-btn filter-btn-sub ${activeSubFilter === sub.id ? 'active' : ''}`} onClick={() => setActiveSubFilter(sub.id)}>
                    {sub.label}
                </button>
            ))}
        </div>
    )}
</div>

            
            {/*  Portfolio Stats  */}
            <div className="portfolio-stats mb-5" data-aos="fade-up" data-aos-delay="200">
                <div className="row text-center">
                    {statsConfig.map((statId, index) => {
                        const count = statId === 'all' 
                            ? initialData.length 
                            : initialData.filter(i => i.category.toLowerCase() === statId.toLowerCase()).length;
                        const label = statId === 'all' 
                            ? 'Total Projects' 
                            : (categories.find(c => c.id === statId)?.label || statId.replace('-', ' '));
                        return (
                            <div key={index} className="col-lg-3 col-md-6 mb-3">
                                <div className="stat-badge">
                                    <h3>{count}</h3>
                                    <p>{label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
    </>
)}
{/*  Toggle Switch Bar: Images / Videos / AI Videos  */}
<div className="portfolio-view-toggle text-center mb-5" data-aos="fade-up">
    <div className="toggle-container">
        <button className={`toggle-btn ${activeView === 'images' ? 'active' : ''}`} onClick={() => setActiveView('images')}>
            {activeView === 'images' && <i className="fas fa-check"></i>}
            Images
        </button>
        <button className={`toggle-btn ${activeView === 'videos' ? 'active' : ''}`} onClick={() => setActiveView('videos')}>
            {activeView === 'videos' && <i className="fas fa-check"></i>}
            Videos
        </button>
        <button className={`toggle-btn ${activeView === 'ai-videos' ? 'active' : ''}`} onClick={() => setActiveView('ai-videos')}>
            {activeView === 'ai-videos' && <i className="fas fa-check"></i>}
            AI Videos
        </button>
    </div>
</div>

{/*  Video Portfolio Section  */}
{activeView === 'videos' && (
    <div className="video-portfolio-section" id="videoSection" >
        <div className="section-title text-center mb-5" data-aos="fade-up">
            <h2 className="display-5 fw-bold" >
                <i className="fas fa-video me-3"></i>Video Portfolio
            </h2>
            <p className="lead text-muted">Watch our creative video productions</p>
        </div>

        <div className="masonry-grid" id="videoContainer">
            {videoData.filter((v: any) => v.category === 'videos').map((video: any) => (
                <div className="masonry-item" key={video.id}>
                    <div className="portfolio-card">
                        <div className="portfolio-image" style={{ backgroundColor: '#000' }}>
                            {/* Cloudinary can generate a thumbnail by changing extension to .jpg */}
                            <img src={video.videoUrl.replace('.mp4', '.jpg')} alt={video.title} className="img-fluid opacity-75" loading="lazy" />
                            <div className="portfolio-overlay">
                                <div className="portfolio-actions">
                                    <button className="portfolio-action" onClick={() => setSelectedVideo(video)}>
                                        <i className="fas fa-play"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="portfolio-content">
                            <h3 className="portfolio-title text-center mb-1">{video.title}</h3>
                            {video.description && (
                                <p className="portfolio-description text-center">{video.description}</p>
                            )}
                            <div className="portfolio-tech justify-content-center">
                                {video.technologies && video.technologies.map((tech: string) => (
                                    <span className="tech-tag" key={tech}>{tech}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
)}

{/*  AI Video Portfolio Section  */}
{activeView === 'ai-videos' && (
    <div className="video-portfolio-section" id="aiVideoSection" >
        <div className="section-title text-center mb-5" data-aos="fade-up">
            <h2 className="display-5 fw-bold" >
                <i className="fas fa-robot me-3"></i>AI Videos
            </h2>
            <p className="lead text-muted">Explore our AI generated content</p>
        </div>

        <div className="masonry-grid" id="aiVideoContainer">
            {videoData.filter((v: any) => v.category === 'ai-videos').map((video: any) => (
                <div className="masonry-item" key={video.id}>
                    <div className="portfolio-card">
                        <div className="portfolio-image" style={{ backgroundColor: '#000' }}>
                            <img src={video.videoUrl.replace('.mp4', '.jpg')} alt={video.title} className="img-fluid opacity-75" loading="lazy" />
                            <div className="portfolio-overlay">
                                <div className="portfolio-actions">
                                    <button className="portfolio-action" onClick={() => setSelectedVideo(video)}>
                                        <i className="fas fa-play"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="portfolio-content">
                            <h3 className="portfolio-title text-center mb-1">{video.title}</h3>
                            {video.description && (
                                <p className="portfolio-description text-center">{video.description}</p>
                            )}
                            <div className="portfolio-tech justify-content-center">
                                {video.technologies && video.technologies.map((tech: string) => (
                                    <span className="tech-tag" key={tech}>{tech}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
)}

{/*  Portfolio Grid  */}
{activeView === 'images' && (
<div className="portfolio-grid" id="portfolioGrid">
    <div className="masonry-grid" id="portfolioContainer">
        {filteredData.slice(0, visibleCount).map((item: any) => (
            <div className="masonry-item" key={item.id}>
                <div className="portfolio-card">
                    <div className="portfolio-image">
                        <img src={item.image} alt={item.title} className="img-fluid" loading="lazy" />
                        <div className="portfolio-overlay">
                            <div className="portfolio-actions">
                                <button className="portfolio-action" onClick={() => setSelectedProject(item)}>
                                    <i className="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="portfolio-content">
                        <div className="portfolio-category text-center">{item.category}</div>
                        <h3 className="portfolio-title text-center mb-1">{item.title}</h3>
                        {item.description && (
                            <p className="portfolio-description text-center">{item.description}</p>
                        )}
                        <div className="portfolio-tech justify-content-center">
                            {item.technologies && item.technologies.map((tech: string) => (
                                <span className="tech-tag" key={tech}>{tech}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
</div>
)}

{activeView === 'images' && visibleCount < filteredData.length && (
    <div className="load-more-container text-center mt-5" id="loadMoreContainer">
        <button className="btn btn-portfolio" onClick={loadMore}>
            Load More Projects
            <i className="fas fa-arrow-down ms-2"></i>
        </button>
        <p className="mt-3 text-muted">
            Showing <span>{visibleCount}</span> of <span>{filteredData.length}</span> projects
        </p>
    </div>
)}
        </div>
    </section>

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

    {/* React Custom Video Modal */}
    {selectedVideo && (
        <div className="custom-modal-overlay" onClick={() => setSelectedVideo(null)}>
            <div className="custom-modal-content" onClick={e => e.stopPropagation()} style={{ backgroundColor: '#000', maxWidth: '1000px' }}>
                <button className="custom-modal-close" style={{ color: '#fff', backgroundColor: 'rgba(255,255,255,0.2)' }} onClick={() => setSelectedVideo(null)}>
                    <i className="fas fa-times"></i>
                </button>
                <div className="custom-modal-layout" style={{ flexDirection: 'column' }}>
                    <div className="custom-modal-video" style={{ width: '100%' }}>
                        <video 
                            src={selectedVideo.videoUrl} 
                            controls 
                            autoPlay 
                            style={{ width: '100%', maxHeight: '75vh', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', outline: 'none' }}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div className="custom-modal-details" style={{ backgroundColor: '#fff', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', padding: '20px 30px' }}>
                        <h4 style={{ marginBottom: '10px' }}>{selectedVideo.title}</h4>
                        {selectedVideo.description && (
                            <p style={{ marginBottom: '15px' }}>{selectedVideo.description}</p>
                        )}
                        <div className="portfolio-tech" style={{ marginTop: '0', marginBottom: '0' }}>
                            {selectedVideo.technologies?.map((tech: string) => (
                                <span className="tech-tag" key={tech}>{tech}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )}

   {/*  Footer - EXACT SAME AS CLIENTS.HTML  */}
    </>
  );
}
