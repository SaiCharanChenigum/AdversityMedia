import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <footer className="footer bg-dark" role="contentinfo" aria-labelledby="footer-title">
          <div className="container">
              <h2 id="footer-title" className="visually-hidden">Footer Information</h2>
              <div className="row">
                  <div className="col-lg-4 col-md-6 mb-4">
                      <div className="footer-about">
                          <img src="/assets/images/adversity-media-logo-white.png" alt="Adversity Media Logo" className="footer-logo mb-3" loading="lazy" style={{ height: '50px', width: 'auto' }} />
                          <p className="footer-description">
                              Adversity Media is the complete digital marketing company with solutions for 
                              any challenges in the digital field. Your dream designs come to life.
                          </p>
                          <div className="footer-social">
                              <a href="https://facebook.com/adversitymedia" className="social-link me-2" aria-label="Follow us on Facebook" target="_blank" rel="noopener noreferrer">
                                  <i className="fab fa-facebook-f" aria-hidden="true"></i>
                              </a>
                              <a href="#" className="social-link me-2" aria-label="Follow us on Instagram" target="_blank" rel="noopener noreferrer">
                                  <i className="fab fa-instagram" aria-hidden="true"></i>
                              </a>
                              <a href="#" className="social-link me-2" aria-label="Connect with us on LinkedIn" target="_blank" rel="noopener noreferrer">
                                  <i className="fab fa-linkedin-in" aria-hidden="true"></i>
                              </a>
                              <a href="#" className="social-link me-2" aria-label="Follow us on Twitter" target="_blank" rel="noopener noreferrer">
                                  <i className="fab fa-twitter" aria-hidden="true"></i>
                              </a>
                          </div>
                      </div>
                  </div>
                  
                  <div className="col-lg-2 col-md-6 mb-4">
                      <div className="footer-links">
                          <h4 className="footer-title">Quick Links</h4>
                          <ul>
                              <li><Link href="/#about">About Us</Link></li>
                              <li><Link href="/#contact">Contact Us</Link></li>
                              <li><Link href="/#portfolio">Portfolio</Link></li>
                              <li><Link href="/blog">Blog</Link></li>
                              <li><Link href="/careers">Careers</Link></li>
                          </ul>
                      </div>
                  </div>
                  
                  <div className="col-lg-3 col-md-6 mb-4">
                      <div className="footer-links">
                          <h4 className="footer-title">Our Services</h4>
                          <ul>
                              <li><Link href="/#services">Digital Marketing</Link></li>
                              <li><Link href="/#services">Web Development</Link></li>
                              <li><Link href="/#services">Mobile Apps</Link></li>
                              <li><Link href="/#services">Branding Services</Link></li>
                              <li><Link href="/#services">UI/UX Design</Link></li>
                          </ul>
                      </div>
                  </div>
                  
                  <div className="col-lg-3 col-md-6 mb-4">
                      <div className="footer-contact">
                          <h4 className="footer-title">Contact Us</h4>
                          <div className="contact-item mb-2">
                              <i className="fas fa-map-marker-alt me-2" aria-hidden="true"></i>
                              <span>Hyderabad, India</span>
                          </div>
                          <div className="contact-item mb-2">
                              <i className="fas fa-phone me-2" aria-hidden="true"></i>
                              <a href="tel:+917330924511">+91 7330924511</a>
                          </div>
                          <div className="contact-item">
                              <i className="fas fa-envelope me-2" aria-hidden="true"></i>
                              <a href="mailto:adversitymedia.in@gmail.com">adversitymedia.in@gmail.com</a>
                          </div>
                      </div>
                  </div>
              </div>
              
              <div className="row">
                  <div className="col-md-12">
                      <div className="footer-bottom text-center">
                          <p>&copy; 2025 Adversity Media. All Rights Reserved. </p>
                      </div>
                  </div>
              </div>
          </div>
      </footer>

      {/* WhatsApp Float Button */}
      <a href="https://api.whatsapp.com/send?phone=917330924511&text=Hi%2C%20I%27m%20interested%20in%20your%20digital%20marketing%20services" 
         className="whatsapp-float" target="_blank" rel="noopener noreferrer" 
         aria-label="Contact us on WhatsApp for quick support">
          <i className="fab fa-whatsapp" aria-hidden="true"></i>
      </a>

      {/* Back to Top Button */}
      <button className="back-to-top" id="backToTop" aria-label="Back to top of page">
          <i className="fas fa-chevron-up" aria-hidden="true"></i>
      </button>
    </>
  );
}
