import React from 'react';
import Link from 'next/link';
import ContactForm from '../components/ContactForm';
import prisma from '@/lib/db';

export default async function Page() {
  const settings = await prisma.siteSettings.findFirst();
  const heroVideoUrl = settings?.heroVideoUrl || "https://res.cloudinary.com/deftcnxf/video/upload/v1785946599/Adversity_media_hero_video_gulfsh.mp4";
  const aboutImageUrl = settings?.aboutImageUrl || "/assets/images/about-team.jpg";
  const ceoImageUrl = settings?.ceoImageUrl || "/assets/images/founder-ceo.jpg";
  
  return (
    <main id="main-content">
      {/* Content Migrated from HTML */}
      
        {/*  Hero Section  */}
        <section className="hero-section" id="home" role="banner" aria-labelledby="hero-title">
            <div className="hero-background" aria-hidden="true">
                {heroVideoUrl ? (
                    <video 
                        src={heroVideoUrl} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="hero-video-bg"
                    />
                ) : (
                    <div className="hero-shapes">
                        <div className="shape shape-1"></div>
                        <div className="shape shape-2"></div>
                        <div className="shape shape-3"></div>
                        <div className="shape shape-4"></div>
                    </div>
                )}
            </div>
            
            <div className="container">
                <div className="row align-items-center min-vh-100">
                    <div className="col-lg-6">
                        <div className="hero-content">
                            <div className="hero-badge animate__animated animate__fadeInUp">
                                <i className="fas fa-award me-2" aria-hidden="true"></i>
                                5+ Years of Excellence
                            </div>
                            
                            <div className="hero-text-wrapper">
                                <h1 id="hero-title" className="hero-title animate__animated animate__fadeInUp animate__delay-1s">
                                    <span className="hero-intro">YOUR</span>
                                    <span className="hero-typed-text" id="typedText" aria-label="Dynamic text animation"></span>
                                </h1>
                            </div>
                            
                            <p className="hero-description animate__animated animate__fadeInUp animate__delay-2s">
                                Complete digital marketing solutions with cutting-edge technology. We transform 
                                businesses through innovative strategies that deliver measurable results and drive 
                                sustainable growth in the digital landscape.
                            </p>
                            
                            <div className="hero-actions animate__animated animate__fadeInUp animate__delay-3s">
                                <a href="#contact" className="btn btn-primary btn-large me-3" aria-label="Start discussing your project">
                                    Let's Discuss
                                    <i className="fas fa-arrow-right ms-2" aria-hidden="true"></i>
                                </a>
                                <a href="#portfolio" className="btn btn-outline btn-large" aria-label="View our portfolio of work">
                                    View Portfolio
                                    <i className="fas fa-play ms-2" aria-hidden="true"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    {/* <div className="col-lg-6">
                        <div className="hero-visual animate__animated animate__fadeInRight animate__delay-2s">
                            <img src="/assets/images/hero-banner(1).png" alt="Digital marketing services illustration showing modern technology and business growth" className="img-fluid" loading="eager" width="670" height="670" />
                        </div>
                    </div> */}
                </div>
            </div>
            
            {/*  Animated Waves  */}
            <div className="hero-waves" aria-hidden="true">
                <svg viewBox="0 24 150 28" preserveAspectRatio="none" role="img" aria-label="Decorative wave animation">
                    <defs>
                        <path id="wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"/>
                    </defs>
                    <g className="wave-animation">
                        <use href="#wave" x="48" y="0" fill="rgba(255,255,255,0.7)"/>
                        <use href="#wave" x="48" y="3" fill="rgba(255,255,255,0.5)"/>
                        <use href="#wave" x="48" y="5" fill="rgba(255,255,255,0.3)"/>
                        <use href="#wave" x="48" y="7" fill="#ffffff"/>
                    </g>
                </svg>
            </div>
        </section>

        {/*  About Section  */}
        <section className="about-section" id="about" aria-labelledby="about-title">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6" data-aos="fade-right">
                        <div className="about-image-wrapper">
                            <img src={aboutImageUrl} alt="Adversity Media team working on digital marketing strategies" className="img-fluid about-main-img" loading="lazy" width="500" height="400" style={{ objectFit: 'cover' }} />
                            <div className="experience-badge glass-morphism">
                                <h2 className="experience-number">5+ <span>Years</span></h2>
                                <p>Of Experience in Software & Digital Marketing Agency</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-6" data-aos="fade-left">
                        <div className="about-content">
                            <span className="section-badge">Get To Know Us</span>
                            <h2 id="about-title" className="section-title">
                                A Full Service Digital <span className="gradient-text">Marketing Agency</span>
                            </h2>
                            <p className="about-description">
                                Adversity Media is the complete digital marketing company with solutions for any 
                                challenges in the digital field. We help improve ROI through the best digital 
                                marketing services, SEO, web development, mobile apps, and content marketing 
                                to deliver visible results in your business growth.
                            </p>
                            <p className="about-description">
                                We build effective strategies to help you reach customers and prospects across 
                                the entire web, ensuring your brand stands out in today's competitive marketplace.
                            </p>
                            
                            <div className="about-features">
                                <div className="feature-item">
                                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                                    <span>Award-Winning Digital Strategies</span>
                                </div>
                                <div className="feature-item">
                                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                                    <span>Expert Team of Professionals</span>
                                </div>
                                <div className="feature-item">
                                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                                    <span>Cutting-Edge Technology</span>
                                </div>
                                <div className="feature-item">
                                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                                    <span>24/7 Support & Maintenance</span>
                                </div>
                            </div>
                            
                            <div className="about-actions">
                                <a href="#contact" className="btn btn-primary-solid" aria-label="Get started with our services today" >Get Started Today</a>
                            </div>
                            
                            {/*  Founder Info  */}
                            <div className="founder-info">
                                <div className="founder-image">
                                    <img src={ceoImageUrl} alt="Sai Kumar Kadagala, Founder and CEO of Adversity Media" loading="lazy" width="60" height="60" style={{ objectFit: 'cover' }} />
                                </div>
                                <div className="founder-details">
                                    <h4>Sai Kumar Kadagala</h4>
                                    <span>Founder & CEO</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/*  Stats Section  */}
        <section className="stats-section" aria-labelledby="stats-title">
            <div className="container">
                <h2 id="stats-title" className="visually-hidden">Our Achievements and Statistics</h2>
                <div className="row">
                    <div className="col-lg-3 col-md-6 mb-4">
                        <div className="stat-item text-center" data-aos="fade-up" data-aos-delay="100">
                            <div className="stat-icon">
                                <img src="/assets/icons/projects.png" alt="Projects completed icon" loading="lazy" width="50" height="40" />
                            </div>
                            <div className="stat-content">
                                <h3 className="stat-number" data-target="450" aria-label="450 projects completed">100+</h3>
                                <p className="stat-label">Projects Completed</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-3 col-md-6 mb-4">
                        <div className="stat-item text-center" data-aos="fade-up" data-aos-delay="200">
                            <div className="stat-icon">
                                <img src="/assets/icons/ongoing.png" alt="Ongoing projects icon" loading="lazy" width="50" height="40" />
                            </div>
                            <div className="stat-content">
                                <h3 className="stat-number" data-target="85" aria-label="85 projects in hand">10+</h3>
                                <p className="stat-label">In Hand<br />Projects</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-3 col-md-6 mb-4">
                        <div className="stat-item text-center" data-aos="fade-up" data-aos-delay="300">
                            <div className="stat-icon">
                                <img src="/assets/icons/clients.png" alt="Happy clients icon" loading="lazy" width="50" height="40" />
                            </div>
                            <div className="stat-content">
                                <h3 className="stat-number" data-target="300" aria-label="300 happy clients">20+</h3>
                                <p className="stat-label">Happy<br />Clients</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-3 col-md-6 mb-4">
                        <div className="stat-item text-center" data-aos="fade-up" data-aos-delay="400">
                            <div className="stat-icon">
                                <img src="/assets/icons/awards.png" alt="Awards won icon" loading="lazy" width="50" height="40" />
                            </div>
                            <div className="stat-content">
                                <h3 className="stat-number" data-target="25" aria-label="25 awards won">10+</h3>
                                <p className="stat-label">Awards Won</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/*  Services Section  */}
        <section className="services-section" id="services" aria-labelledby="services-title">
            <div className="container">
                <div className="section-header text-center">
                    <span className="section-badge">Services We're Offering</span>
                    <h2 id="services-title" className="section-title">
                        Committed to Deliver Top <span className="gradient-text">Quality Services</span>
                    </h2>
                </div>
                
                <div className="row g-4">
                    {/*  Digital Marketing Service  */}
                    <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                        <article className="service-card glass-morphism">
                            <div className="service-icon">
                                <img src="/assets/icons/digital-marketing.png" alt="Digital marketing services icon" loading="lazy" width="80" height="80" />
                            </div>
                            <h3 className="service-title">Digital Marketing</h3>
                            <p className="service-description">
                                Boost Your Business with Our Digital Marketing Expertise!
                            </p>
                            <ul className="service-features">
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> SEO Services</li>
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> Social Media Marketing</li>
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> Content Marketing</li>
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> Page Optimization</li>
                            </ul>
                            <div className="service-action">
                                <a href="#contact" className="service-link" aria-label="Learn more about digital marketing services">
                                    <i className="fas fa-plus" aria-hidden="true"></i>
                                </a>
                            </div>
                        </article>
                    </div>
                    
                    {/*  App Development Service  */}
                    <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                        <article className="service-card glass-morphism">
                            <div className="service-icon">
                                <img src="/assets/icons/app-development.png" alt="Mobile app development services icon" loading="lazy" width="80" height="80" />
                            </div>
                            <h3 className="service-title">App Development</h3>
                            <p className="service-description">
                                Comprehensive app development services from design to deployment for all platforms.
                            </p>
                            <ul className="service-features">
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> Web Based Apps</li>
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> iOS Applications</li>
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> Android Applications</li>
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> Software Development</li>
                            </ul>
                            <div className="service-action">
                                <a href="#contact" className="service-link" aria-label="Learn more about app development services">
                                    <i className="fas fa-plus" aria-hidden="true"></i>
                                </a>
                            </div>
                        </article>
                    </div>
                    
                    {/*  Website Development Service  */}
                    <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                        <article className="service-card glass-morphism">
                            <div className="service-icon">
                                <img src="/assets/icons/web-development.png" alt="Website development services icon" loading="lazy" width="80" height="80" />
                            </div>
                            <h3 className="service-title">Website Development</h3>
                            <p className="service-description">
                                Responsive, mobile-friendly websites with stunning design and seamless user experiences.
                            </p>
                            <ul className="service-features">
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> Website Development</li>
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> Content Writing</li>
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> UI/UX Design</li>
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> Interface Design</li>
                            </ul>
                            <div className="service-action">
                                <a href="#contact" className="service-link" aria-label="Learn more about website development services">
                                    <i className="fas fa-plus" aria-hidden="true"></i>
                                </a>
                            </div>
                        </article>
                    </div>
                    
                    {/*  UI/UX Design Service  */}
                    <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
                        <article className="service-card glass-morphism">
                            <div className="service-icon">
                                <img src="/assets/icons/app-development.png" alt="UI/UX design services icon" loading="lazy" width="80" height="80" />
                            </div>
                            <h3 className="service-title">UI/UX Design</h3>
                            <p className="service-description">
                                Beautiful, intuitive interfaces designed for maximum user engagement and conversion.
                            </p>
                            <ul className="service-features">
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> User Research</li>
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> Wireframing</li>
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> Prototyping</li>
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> Visual Design</li>
                            </ul>
                            <div className="service-action">
                                <a href="#contact" className="service-link" aria-label="Learn more about UI/UX design services">
                                    <i className="fas fa-plus" aria-hidden="true"></i>
                                </a>
                            </div>
                        </article>
                    </div>

                    {/*  SEO Optimization Service  */}
                    <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500">
                        <article className="service-card glass-morphism">
                            <div className="service-icon">
                                <img src="/assets/icons/web-development.png" alt="SEO optimization services icon" loading="lazy" width="80" height="80" />
                            </div>
                            <h3 className="service-title">SEO Optimization</h3>
                            <p className="service-description">
                                Rank higher on search engines and drive organic traffic to your website.
                            </p>
                            <ul className="service-features">
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> Keyword Research</li>
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> On-Page SEO</li>
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> Link Building</li>
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> Performance Audits</li>
                            </ul>
                            <div className="service-action">
                                <a href="#contact" className="service-link" aria-label="Learn more about SEO optimization services">
                                    <i className="fas fa-plus" aria-hidden="true"></i>
                                </a>
                            </div>
                        </article>
                    </div>

                    {/*  Social Media Marketing Service  */}
                    <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
                        <article className="service-card glass-morphism">
                            <div className="service-icon">
                                <img src="/assets/icons/digital-marketing.png" alt="Social media marketing services icon" loading="lazy" width="80" height="80" />
                            </div>
                            <h3 className="service-title">Social Media Marketing</h3>
                            <p className="service-description">
                                Build a loyal audience and increase brand awareness across social platforms.
                            </p>
                            <ul className="service-features">
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> Content Creation</li>
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> Community Management</li>
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> Paid Advertising</li>
                                <li><i className="fas fa-arrow-right" aria-hidden="true"></i> Analytics & Reporting</li>
                            </ul>
                            <div className="service-action">
                                <a href="#contact" className="service-link" aria-label="Learn more about social media marketing services">
                                    <i className="fas fa-plus" aria-hidden="true"></i>
                                </a>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </section>

        {/*  Portfolio Section  */}
        <section className="portfolio-section" id="portfolio" aria-labelledby="portfolio-title">
            <div className="container">
                <div className="section-header text-center">
                    <span className="section-badge">Our Work</span>
                    <h2 id="portfolio-title" className="section-title">
                        Our <span className="gradient-text">Portfolio</span>
                    </h2>
                </div>
                
                <div className="row g-4">
                    {/*  Portfolio Items  */}
                    <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                        <article className="portfolio-item">
                            <div className="portfolio-image">
                                <img src="/assets/images/portfolio/18a5aa58-206d-4c5c-bfd7-1ed6d770c7ed.jpg" alt="Brand identity design project showcasing complete branding solution" className="img-fluid" loading="lazy" width="400" height="300" />
                                <div className="portfolio-overlay">
                                    <div className="portfolio-content">
                                        <h4>Brand Identity</h4>
                                        <p>Complete branding solution</p>
                                        <a href="/portfolio" aria-label="View brand identity design project details">
                                            <i className="fas fa-arrow-right" aria-hidden="true"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                    
                    <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                        <article className="portfolio-item">
                            <div className="portfolio-image">
                                <img src="/assets/images/portfolio/72ff2fa8-f4a0-4a4c-ab4b-31f5b749310c.jpg" alt="E-commerce website project showing modern online store design" className="img-fluid" loading="lazy" width="400" height="300" />
                                <div className="portfolio-overlay">
                                    <div className="portfolio-content">
                                        <h4>E-Commerce Platform</h4>
                                        <p>Modern online store design</p>
                                        <a href="/portfolio" aria-label="View e-commerce website project details">
                                            <i className="fas fa-arrow-right" aria-hidden="true"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                    
                    <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                        <article className="portfolio-item">
                            <div className="portfolio-image">
                                <img src="/assets/images/portfolio/af63635a-3dd6-4268-b568-cb4db3eabc6d.jpg" alt="Mobile application project showcasing cross-platform app development" className="img-fluid" loading="lazy" width="400" height="300" />
                                <div className="portfolio-overlay" >
                                    <div className="portfolio-content" >
                                        <h4>Mobile Application</h4>
                                        <p>Cross-platform app development</p>
                                        <a href="/portfolio" aria-label="View mobile application project details">
                                            <i className="fas fa-arrow-right" aria-hidden="true"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                    
                    {/*  Additional portfolio items  */}
                    <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                        <article className="portfolio-item">
                            <div className="portfolio-image">
                                <img src="/assets/images/portfolio/7ac44cf2-65f0-4493-a789-3c935b8014b3.jpg" alt="Web design project showcase" className="img-fluid" loading="lazy" width="400" height="300" />
                                <div className="portfolio-overlay">
                                    <div className="portfolio-content">
                                        <h4>Web Design</h4>
                                        <p>Responsive corporate website</p>
                                        <a href="/portfolio" aria-label="View web design project showcase">
                                            <i className="fas fa-arrow-right" aria-hidden="true"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                    
                    <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                        <article className="portfolio-item">
                            <div className="portfolio-image">
                                <img src="/assets/images/portfolio/3d9c8177-effb-4753-8479-dd82dd899b61.jpg" alt="Digital marketing campaign results" className="img-fluid" loading="lazy" width="400" height="300" />
                                <div className="portfolio-overlay">
                                    <div className="portfolio-content">
                                        <h4>Digital Campaign</h4>
                                        <p>Social media marketing strategy</p>
                                        <a href="/portfolio" aria-label="View digital marketing campaign results">
                                            <i className="fas fa-arrow-right" aria-hidden="true"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                    
                    <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                        <article className="portfolio-item">
                            <div className="portfolio-image">
                                <img src="/assets/images/portfolio/28af1970-3ec4-4b62-82b6-28b7d6a6a36f.jpg" alt="UI/UX design project example" className="img-fluid" loading="lazy" width="400" height="300" />
                                <div className="portfolio-overlay">
                                    <div className="portfolio-content">
                                        <h4>UI/UX Design</h4>
                                        <p>Intuitive user interface creation</p>
                                        <a href="/portfolio" aria-label="View UI/UX design project example">
                                            <i className="fas fa-arrow-right" aria-hidden="true"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
                <div className="text-center mt-5">
    <a href="/portfolio" className="btn btn-primary-solid" aria-label="View our complete portfolio">
        See More Portfolio
        <i className="fas fa-arrow-right ms-2" aria-hidden="true"></i>
    </a>
</div>

                
        
            </div>
        </section>

        {/*  Contact Section  */}
        <section className="contact-section" id="contact" aria-labelledby="contact-title">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6" data-aos="fade-right">
                        <div className="contact-info">
                            <span className="section-badge">Get In Touch</span>
                            <h2 id="contact-title" className="section-title">
                                Ready to Start Your <span className="gradient-text">Digital Journey?</span>
                            </h2>
                            <p className="contact-description">
                                Let's discuss your project and create something amazing together. 
                                Our team is ready to bring your vision to life.
                            </p>
                            
                            <div className="contact-items">
                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <i className="fas fa-phone" aria-hidden="true"></i>
                                    </div>
                                    <div className="contact-details">
                                        <h4>Call Us</h4>
                                        <p><a href="tel:+917330924511">+91 7330924511</a></p>
                                    </div>
                                </div>
                                
                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <i className="fas fa-envelope" aria-hidden="true"></i>
                                    </div>
                                    <div className="contact-details">
                                        <h4>Email Us</h4>
                                        <p><a href="mailto:adversitymedia.in@gmail.com">adversitymedia.in@gmail.com</a></p>
                                    </div>
                                </div>
                                
                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
                                    </div>
                                    <div className="contact-details">
                                        <h4>Visit Us</h4>
                                        <p>Hyderabad, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-6" data-aos="fade-left">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </section>
    
    </main>
  );
}
