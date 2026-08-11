"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface HeaderProps {
  contactNumber: string;
  email: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  logoUrl?: string;
}

export default function Header({ contactNumber, email, socialLinks, logoUrl }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <>
      {/* Top Bar */}
      <div className="top-bar d-none d-md-flex" role="banner">
          <div className="container">
              <div className="row">
                  <div className="col-md-8">
                      <div className="top-info">
                          <span className="me-3">
                              <i className="fas fa-phone me-2" aria-hidden="true"></i>
                              <a href={`tel:${contactNumber}`} aria-label={`Call us at ${contactNumber}`}>{contactNumber}</a>
                          </span>
                          <span className="me-3">
                              <i className="fas fa-envelope me-2" aria-hidden="true"></i>
                              <a href={`mailto:${email}`} aria-label={`Email us at ${email}`}>{email}</a>
                          </span>
                      </div>
                  </div>
                  <div className="col-md-4">
                      <div className="top-social">
                          {socialLinks.facebook && (
                            <a href={socialLinks.facebook} className="social-link me-2" aria-label="Follow us on Facebook" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-facebook-f" aria-hidden="true"></i>
                            </a>
                          )}
                          {socialLinks.instagram && (
                            <a href={socialLinks.instagram} className="social-link me-2" aria-label="Follow us on Instagram" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-instagram" aria-hidden="true"></i>
                            </a>
                          )}
                          {socialLinks.linkedin && (
                            <a href={socialLinks.linkedin} className="social-link me-2" aria-label="Connect with us on LinkedIn" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-linkedin-in" aria-hidden="true"></i>
                            </a>
                          )}
                          {socialLinks.twitter && (
                            <a href={socialLinks.twitter} className="social-link me-2" aria-label="Follow us on Twitter" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-twitter" aria-hidden="true"></i>
                            </a>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Navigation */}
      <nav className={`navbar navbar-expand-lg navbar-light fixed-top ${isScrolled ? 'scrolled' : ''}`} id="mainNavbar" role="navigation" aria-label="Main navigation">
          <div className="container">
                <Link href="/" className="navbar-brand logo-container" aria-label="Adversity Media Home">
                  <img src={logoUrl || "/assets/images/adversity-media-logo.png"} alt="Adversity Media Logo" className="logo-img header-logo-img" />
                </Link>
              
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" 
                      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation menu">
                  <span className="navbar-toggler-icon"></span>
              </button>
              
              <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav ms-auto" role="menubar">
                      <li className="nav-item" role="none">
                          <Link className="nav-link active" href="/" role="menuitem" aria-current="page">Home</Link>
                      </li>
                      <li className="nav-item" role="none">
                          <Link className="nav-link" href="/#about" role="menuitem">About Us</Link>
                      </li>
                      <li className="nav-item" role="none">
                          <Link className="nav-link" href="/#services" role="menuitem">Our Services</Link>
                      </li>
                      <li className="nav-item" role="none">
                          <Link className="nav-link" href="/#portfolio" role="menuitem">Portfolio</Link>
                      </li>
                      <li className="nav-item" role="none">
                          <Link className="nav-link" href="/clients" role="menuitem">Clients</Link>
                      </li>
                      <li className="nav-item" role="none">
                          <Link className="nav-link" href="/blog" role="menuitem">Blog</Link>
                      </li>
                      <li className="nav-item" role="none">
                          <Link className="nav-link" href="/#contact" role="menuitem">Contact</Link>
                      </li>
                  
                  
                  <div className="navbar-actions ms-3">
                      <Link href="/#contact" className="btn btn-primary" aria-label="Get started with our services" style={{ background: "var(--gradient-hero)", border: "0px" }}>Get Started</Link>
                  </div>
                  </ul>
              </div>
          </div>
      </nav>
    </>
  );
}
