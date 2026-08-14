import React from 'react';
import Link from 'next/link';
import '@/styles/clients.css';
import ClientsClient from './ClientsClient';
import TestimonialsClient from './TestimonialsClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const clients = await prisma.client.findMany({
    orderBy: { id: 'asc' }
  });
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { id: 'asc' }
  });

  const statsData = await prisma.websiteData.findUnique({
    where: { key: 'clients_stats' }
  });
  
  const industriesData = await prisma.websiteData.findUnique({
    where: { key: 'clients_industries' }
  });

  const stats = statsData ? JSON.parse(statsData.value) : {
    happyClients: '50',
    industriesServed: '15',
    satisfaction: '98',
    repeatClients: '85'
  };

  const industries = industriesData ? JSON.parse(industriesData.value) : [
    { id: 'hospitality', label: 'Hospitality' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'education', label: 'Education' },
    { id: 'retail', label: 'Retail & E-commerce' },
    { id: 'technology', label: 'Technology' },
    { id: 'fashion', label: 'Fashion & Lifestyle' }
  ];

  return (
    <>
      {/* Content Migrated from HTML */}
      {/*  Clients Header  */}
    <section className="clients-header">
        <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
        </div>

        <div className="container">
            <div className="row justify-content-center text-center">
                <div className="col-lg-8">
                    <div className="section-badge animate__animated animate__fadeInUp">
                        <i className="fas fa-handshake me-2"></i>
                        Our Trusted Partners
                    </div>
                    <h1 className="hero-title animate__animated animate__fadeInUp animate__delay-1s">
                        <span className="our-color">Our</span> <span className="valued-text">Valued Clients</span>
                    </h1>
                    <p className="clients-description animate__animated animate__fadeInUp animate__delay-2s">
                        We're proud to partner with leading brands across diverse industries. From startups to
                        established enterprises, we've helped businesses achieve their digital marketing goals and drive
                        sustainable growth.
                    </p>

                    {/*  Breadcrumb  */}
                    <nav className="breadcrumb-nav animate__animated animate__fadeInUp animate__delay-3s">
                        <a href="/" className="breadcrumb-link">Home</a>
                        <span className="breadcrumb-separator"><i className="fas fa-chevron-right"></i></span>
                        <span className="breadcrumb-current">Our Clients</span>
                    </nav>
                </div>
            </div>
        </div>
    </section>

    {/*  Client Stats  */}
    <section className="client-stats py-5">
        <div className="container">
            <div className="row g-4">
                <div className="col-lg-3 col-md-6">
                    <div className="stat-card animate__animated animate__fadeInUp animate__delay-1s">
                        <div className="stat-icon">
                            <i className="fas fa-users"></i>
                        </div>
                        <div className="stat-number">{stats.happyClients}+</div>
                        <div className="stat-label">Happy Clients</div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="stat-card animate__animated animate__fadeInUp animate__delay-2s">
                        <div className="stat-icon">
                            <i className="fas fa-industry"></i>
                        </div>
                        <div className="stat-number">{stats.industriesServed}+</div>
                        <div className="stat-label">Industries Served</div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="stat-card animate__animated animate__fadeInUp animate__delay-3s">
                        <div className="stat-icon">
                            <i className="fas fa-star"></i>
                        </div>
                        <div className="stat-number">{stats.satisfaction}%</div>
                        <div className="stat-label">Client Satisfaction</div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="stat-card animate__animated animate__fadeInUp animate__delay-4s">
                        <div className="stat-icon">
                            <i className="fas fa-redo-alt"></i>
                        </div>
                        <div className="stat-number">{stats.repeatClients}%</div>
                        <div className="stat-label">Repeat Clients</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <ClientsClient initialClients={clients} industries={industries} />
    
    <TestimonialsClient testimonials={testimonials} />

    {/*  CTA Section  */}
    <section className="client-cta py-5">
        <div className="container">
            <div className="row justify-content-center text-center">
                <div className="col-lg-8">
                    <h2 className="cta-title">Ready to Join Our Success Stories?</h2>
                    <p className="cta-description">
                        Let's work together to create a digital marketing strategy that drives real results for your
                        business.
                    </p>
                    <div className="cta-actions">
                        <a href="index.html#contact" className="btn btn-outline-portfolio btn-large me-3">Start Your
                            Project</a>
                        <a href="portfolio.html" className="btn btn-outline-portfolio btn-large">View Our Work</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/*  Footer - EXACT SAME AS CLIENTS.HTML  */}
    </>
  );
}
