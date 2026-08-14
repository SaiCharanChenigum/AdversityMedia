'use client';

import React from 'react';
import '@/styles/clients.css';

export default function TestimonialMarquee({ testimonials }: { testimonials: any[] }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="testimonial-carousel-section py-5 mt-5" style={{ background: '#f8f9fa' }}>
      <div className="container mb-5 mt-3">
        <div className="text-center">
          <span className="section-badge">Client Stories</span>
          <h2 className="section-title" style={{ fontSize: '2rem' }}>What Our <span className="gradient-text">Clients Say</span></h2>
        </div>
      </div>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12" style={{ maxWidth: '800px' }}>
            <div id="testimonialCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="4000">
              <div className="carousel-inner pb-5 pt-4">
                {testimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                    <div className="testimonial-card mx-auto d-flex flex-column" style={{ maxWidth: '600px', minHeight: '320px' }}>
                      <div className="testimonial-quote">
                        <i className="fas fa-quote-left"></i>
                      </div>
                      <p className="testimonial-text text-center fs-5">"{testimonial.text}"</p>
                      <div className="testimonial-author justify-content-center mt-4">
                        <img src={testimonial.imageUrl} alt={testimonial.author} className="author-image" />
                        <div className="author-info">
                          <h5>{testimonial.author}</h5>
                          {testimonial.company && <span>{testimonial.company}</span>}
                        </div>
                      </div>
                      <div className="testimonial-rating text-center mt-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <i key={i} className={i < testimonial.rating ? "fas fa-star" : "far fa-star"}></i>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev" style={{ width: '50px' }}>
                <i className="fas fa-chevron-left" style={{ fontSize: '2rem', color: '#b0b0b0' }}></i>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next" style={{ width: '50px' }}>
                <i className="fas fa-chevron-right" style={{ fontSize: '2rem', color: '#b0b0b0' }}></i>
                <span className="visually-hidden">Next</span>
              </button>
              <div className="carousel-indicators" style={{ bottom: '0' }}>
                {testimonials.map((_, index) => (
                  <button key={index} type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to={index} className={index === 0 ? "active" : ""} aria-current={index === 0 ? "true" : "false"} aria-label={`Slide ${index + 1}`} style={{ backgroundColor: '#888888', width: '12px', height: '12px', borderRadius: '50%', margin: '0 6px' }}></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
