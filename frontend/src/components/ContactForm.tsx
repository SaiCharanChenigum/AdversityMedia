"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import emailjs from '@emailjs/browser';
import '@/styles/service-modal.css';

interface ContactFormProps {
    services?: Array<{ id: string; title: string }>;
}

export default function ContactForm({ services = [] }: ContactFormProps) {
    const [selectedService, setSelectedService] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [validated, setValidated] = useState(false);

    // Ensure portal only renders client-side
    useEffect(() => { setMounted(true); }, []);

    // Fallback if none provided
    const displayServices = services.length > 0 ? services : [
        { id: 'seo',               title: 'SEO Services' },
        { id: 'web-design',        title: 'Web Development' },
        { id: 'digital-marketing', title: 'Digital Marketing' },
        { id: 'branding',          title: 'Branding Services' },
        { id: 'mobile-apps',       title: 'Mobile Apps' },
        { id: 'other',             title: 'Other' },
    ];

    const getLabel = () => {
        const s = displayServices.find(s => s.id === selectedService);
        return s ? s.title : 'Select Service';
    };

    // Escape key closes modal
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsModalOpen(false);
        };
        if (isModalOpen) window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isModalOpen]);

    // Prevent body scroll when modal open and fix layout shift
    useEffect(() => {
        if (isModalOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
            }
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
        return () => { 
            document.body.style.overflow = ''; 
            document.body.style.paddingRight = '';
        };
    }, [isModalOpen]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        
        if (!form.checkValidity() || !selectedService) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        setValidated(true);
        setIsSubmitting(true);
        setSubmitStatus(null);

        // Send via EmailJS
        try {
            const templateParams = {
                from_name: `${form.firstName.value} ${form.lastName.value}`,
                from_email: form.email.value,
                phone: form.phone.value || 'Not provided',
                service: selectedService,
                message: form.message.value,
            };

            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
                templateParams,
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
            );

            setSubmitStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully. We will contact you within 24 hours.' });
            form.reset();
            setValidated(false);
            setSelectedService('');
        } catch (error) {
            setSubmitStatus({ type: 'error', message: 'Something went wrong. Please try again later.' });
        } finally {
            setIsSubmitting(false);
        }
    };

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
                </div>

                <ul className="service-options-list">
                    {displayServices.map((service) => (
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
                                <span className="service-row-label">{service.title}</span>
                                {selectedService === service.id && (
                                    <i className="fas fa-check service-row-check" aria-hidden="true"></i>
                                )}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* External close button */}
            <button
                type="button"
                className="close-modal-btn-outside"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
            >
                <i className="fas fa-times" aria-hidden="true"></i>
            </button>
        </div>
    );

    return (
        <>
            <form 
                className={`contact-form glass-morphism ${validated ? 'was-validated' : ''}`} 
                id="contactForm" 
                aria-labelledby="form-title" 
                noValidate
                onSubmit={handleSubmit}
            >
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
                        className={`service-selector-btn ${validated && !selectedService ? 'is-invalid' : ''} ${selectedService ? 'selected' : ''}`}
                        onClick={() => setIsModalOpen(true)}
                        aria-haspopup="dialog"
                        aria-expanded={isModalOpen}
                    >
                        <span>{getLabel()}</span>
                        <i className="fas fa-chevron-down" aria-hidden="true"></i>
                    </button>
                    {validated && !selectedService && (
                        <div className="invalid-feedback d-block">Please select a service.</div>
                    )}
                </div>

                {selectedService === 'other' && (
                    <div className="form-group custom-service-input">
                        <label htmlFor="customService" className="visually-hidden">Custom Service</label>
                        <input type="text" id="customService" name="customService" placeholder="Please specify your desired service" required aria-required="true" />
                        <div className="invalid-feedback">Please specify the service you need.</div>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="message" className="visually-hidden">Project Message</label>
                    <textarea id="message" name="message" placeholder="Tell us about your project..." rows={5} required aria-required="true"></textarea>
                    <div className="invalid-feedback">Please tell us about your project.</div>
                </div>

                <button type="submit" className="btn btn-primary-send btn-full" disabled={isSubmitting} aria-describedby="submit-status">
                    {isSubmitting ? (
                        <>
                            <i className="fas fa-spinner fa-spin me-2" aria-hidden="true"></i>
                            Sending...
                        </>
                    ) : (
                        <>
                            <span className="button-text">Send Message</span>
                            <i className="fas fa-paper-plane ms-2" aria-hidden="true"></i>
                        </>
                    )}
                </button>
                
                {submitStatus && (
                    <div id="submit-status" className={`alert alert-${submitStatus.type === 'success' ? 'success' : 'danger'} mt-3 mb-0`} role="alert" aria-live="polite">
                        {submitStatus.message}
                    </div>
                )}
            </form>

            {/* Portal renders modal at document.body — unaffected by parent transforms */}
            {mounted && isModalOpen && createPortal(modal, document.body)}
        </>
    );
}
