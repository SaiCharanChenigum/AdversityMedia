'use client';

import React from 'react';
import { Testimonial } from '@prisma/client';

interface TestimonialsClientProps {
  testimonials: Testimonial[];
}

export default function TestimonialsClient({ testimonials }: TestimonialsClientProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="client-testimonials py-5" style={{ background: 'var(--light-gray)', position: 'relative', zIndex: 1 }}>
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <div className="section-badge">
              <i className="fas fa-quote-left me-2"></i>
              Client Testimonials
            </div>
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-description">
              We believe great relationships create great results. Here's what our clients say about working with Adversity Media.
            </p>
          </div>
        </div>

        {/* Dynamic Grid Layout that flexes perfectly when items are added or removed */}
        <div className="row g-4 justify-content-center">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="col-lg-4 col-md-6">
              <div className="testimonial-card h-100">
                <div className="testimonial-quote">
                  <i className="fas fa-quote-left"></i>
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author mt-auto pt-3">
                  <img src={testimonial.imageUrl} alt={testimonial.author} className="author-image" />
                  <div className="author-info">
                    <h5>{testimonial.author}</h5>
                    {testimonial.company && <span>{testimonial.company}</span>}
                  </div>
                </div>
                <div className="testimonial-rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i key={i} className={i < testimonial.rating ? "fas fa-star" : "far fa-star"}></i>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
