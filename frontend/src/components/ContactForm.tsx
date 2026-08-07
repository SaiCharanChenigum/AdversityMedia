"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '@/styles/service-modal.css';

export default function ContactForm() {
    const [selectedService, setSelectedService] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Ensure portal only renders client-side
    useEffect(() => { setMounted(true); }, []);

    const services = [
        { id: 'seo',               label: 'SEO Services',       icon: 'fa-search' },
        { id: 'web-design',        label: 'Web Development',    icon: 'fa-laptop-code' },
        { id: 'digital-marketing', label: 'Digital Marketing',  icon: 'fa-bullhorn' },
        { id: 'branding',          label: 'Branding Services',  icon: 'fa-paint-brush' },
        { id: 'mobile-apps',       label: 'Mobile Apps',        icon: 'fa-mobile-alt' },
        { id: 'other',             label: 'Other',              icon: 'fa-ellipsis-h' },
    ];

    const getLabel = () => {
        const s = services.find(s => s.id === selectedService);
        return s ? s.label : 'Select Service';
    };

    // Escape key closes modal
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsModalOpen(false);
        };
        if (isModalOpen) window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isModalOpen]);

    // Prevent body scroll when modal open
    useEffect(() => {
        document.body.style.overflow = isModalOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isModalOpen]);

    const modal = (
        <div
            className="service-modal-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="service-modal">
                <div className="service-modal-header">
                    <h3 id="modal-title">What do you need help with?</h3>
                    <button
                        type="button"
                        className="close-modal-btn"
                        onClick={() => setIsModalOpen(false)}
                        aria-label="Close"
                    >
                        <i className="fas fa-times" aria-hidden="true"></i>
                    </button>
                </div>

                <ul className="service-options-list">
                    {services.map((service) => (
                        <li key={service.id}>
                            <label className={`service-option-row ${selectedService === service.id ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="modal-service"
                                    value={service.id}
                                    checked={selectedService === service.id}
                                    onChange={(e) => {
                                        setSelectedService(e.target.value);
                                        setTimeout(() => setIsModalOpen(false), 250);
                                    }}
                                    className="visually-hidden"
                                />
                                <span className="service-row-icon">
                                    <i className={`fas ${service.icon}`} aria-hidden="true"></i>
                                </span>
                                <span className="service-row-label">{service.label}</span>
                                {selectedService === service.id && (
                                    <i className="fas fa-check service-row-check" aria-hidden="true"></i>
                                )}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

    return (
        <>
            <form className="contact-form glass-morphism" id="contactForm" aria-labelledby="form-title" noValidate>
                <h3 id="form-title" className="form-title">Send Us a Message</h3>

                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="firstName" className="visually-hidden">First Name</label>
                            <input type="text" id="firstName" name="firstName" placeholder="First Name" required aria-required="true" />
                            <div className="invalid-feedback">Please enter your first name.</div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="lastName" className="visually-hidden">Last Name</label>
                            <input type="text" id="lastName" name="lastName" placeholder="Last Name" required aria-required="true" />
                            <div className="invalid-feedback">Please enter your last name.</div>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="email" className="visually-hidden">Email Address</label>
                    <input type="email" id="email" name="email" placeholder="Email Address" required aria-required="true" />
                    <div className="invalid-feedback">Please enter a valid email address.</div>
                </div>

                <div className="form-group">
                    <label htmlFor="phone" className="visually-hidden">Phone Number</label>
                    <input type="tel" id="phone" name="phone" placeholder="Phone Number" />
                </div>

                {/* Service selector — opens full-screen portal modal */}
                <div className="form-group">
                    <label htmlFor="service" className="visually-hidden">Select Service</label>
                    <input type="hidden" id="service" name="service" value={selectedService} required />
                    <button
                        type="button"
                        className={`service-selector-btn${selectedService ? ' selected' : ''}`}
                        onClick={() => setIsModalOpen(true)}
                        aria-haspopup="dialog"
                        aria-expanded={isModalOpen}
                    >
                        <span>{getLabel()}</span>
                        <i className="fas fa-chevron-down" aria-hidden="true"></i>
                    </button>
                    <div className="invalid-feedback">Please select a service.</div>
                </div>

                <div className="form-group">
                    <label htmlFor="message" className="visually-hidden">Project Message</label>
                    <textarea id="message" name="message" placeholder="Tell us about your project..." rows={5} required aria-required="true"></textarea>
                    <div className="invalid-feedback">Please tell us about your project.</div>
                </div>

                <button type="submit" className="btn btn-primary-send btn-full" aria-describedby="submit-status">
                    <span className="button-text">Send Message</span>
                    <span className="button-loading d-none">
                        <i className="fas fa-spinner fa-spin me-2" aria-hidden="true"></i>
                        Sending...
                    </span>
                    <i className="fas fa-paper-plane ms-2" aria-hidden="true"></i>
                </button>
                <div id="submit-status" className="form-status mt-3" role="status" aria-live="polite"></div>
            </form>

            {/* Portal renders modal at document.body — unaffected by parent transforms */}
            {mounted && isModalOpen && createPortal(modal, document.body)}
        </>
    );
}
