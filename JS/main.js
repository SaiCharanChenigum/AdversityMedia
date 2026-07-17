document.addEventListener('DOMContentLoaded', function() {
    
    // Remove preloader after page loads
    const preloader = document.getElementById('preloader');
    
    // Hide preloader after 2 seconds or when page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(function() {
            if (preloader) {
                preloader.classList.add('hidden');
                // Remove preloader from DOM after transition
                setTimeout(function() {
                    preloader.style.display = 'none';
                }, 500);
            }
        }, 1000); // Show preloader for 1 second minimum
    });
    
    // Fallback: Hide preloader after 3 seconds regardless
    setTimeout(function() {
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 3000);

    // ... rest of the JavaScript functionality
});

/* ==========================================
   MOBILE OPTIMIZATIONS JAVASCRIPT
   ========================================== */

// Mobile-specific enhancements
document.addEventListener('DOMContentLoaded', function() {
    
    // Detect if device is mobile
    const isMobile = window.innerWidth < 992;
    
    if (isMobile) {
        console.log('Mobile optimizations loading...');
        
        // Mobile menu auto-close on link click
        const navLinks = document.querySelectorAll('.nav-link');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });
        
        // Mobile menu auto-close on scroll
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            }
            lastScrollTop = scrollTop;
        });
        
        // Touch-friendly interactions
        const cards = document.querySelectorAll('.service-card, .portfolio-item, .stat-item');
        cards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });
        
        // Mobile form improvements
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                setTimeout(() => {
                    this.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center',
                        inline: 'nearest'
                    });
                }, 300);
            });
        });
        
        // Prevent iOS zoom on form inputs
        inputs.forEach(input => {
            input.addEventListener('touchstart', function() {
                this.style.fontSize = '16px';
            });
        });
        
        // Mobile bottom navigation visibility
        const mobileBottomNav = document.querySelector('.mobile-bottom-nav');
        if (mobileBottomNav) {
            let isScrolling;
            window.addEventListener('scroll', function() {
                mobileBottomNav.style.transform = 'translateY(100%)';
                
                clearTimeout(isScrolling);
                isScrolling = setTimeout(function() {
                    mobileBottomNav.style.transform = 'translateY(0)';
                }, 150);
            });
        }
        
        console.log('Mobile optimizations loaded successfully');
    }
    
    // Smooth scroll for all devices
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - (isMobile ? 80 : 100);
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Improved back to top functionality
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'flex';
                backToTopBtn.style.opacity = '1';
            } else {
                backToTopBtn.style.opacity = '0';
                setTimeout(() => {
                    if (window.scrollY <= 300) {
                        backToTopBtn.style.display = 'none';
                    }
                }, 300);
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // EMAILJS FORM SUBMISSION - FULLY CONFIGURED
    // ==========================================
    
    // Initialize EmailJS with YOUR credentials
    (function() {
        emailjs.init("3HYykZwTF_sYOv9qp"); // Your Public Key
    })();
    
    // EmailJS Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const buttonText = submitBtn.querySelector('.button-text');
            const buttonLoading = submitBtn.querySelector('.button-loading');
            const submitStatus = document.getElementById('submit-status');
            
            // Get form data
            const formData = {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                service: document.getElementById('service').value,
                message: document.getElementById('message').value.trim()
            };
            
            // Validate required fields
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
                showStatus('error', 'Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showStatus('error', 'Please enter a valid email address.');
                return;
            }
            
            // PHASE 1: Show "Sending..." state
            submitBtn.disabled = true;
            if (buttonText) {
                buttonText.textContent = '';
            }
            if (buttonLoading) {
                buttonLoading.classList.remove('d-none');
            }
            
            showStatus('info', '📤 Sending your message...');
            
            // Prepare template parameters for YOUR template
            const templateParams = {
                from_name: `${formData.firstName} ${formData.lastName}`,
                from_email: formData.email,
                phone: formData.phone || 'Not provided',
                service: formData.service,
                message: formData.message
            };
            
            // Send email using EmailJS with YOUR credentials
            emailjs.send('service_hl5oq24', 'template_nctt71j', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // PHASE 2: Show "Sent!" state
                    if (buttonText) {
                        buttonText.textContent = 'Sent!';
                    }
                    if (buttonLoading) {
                        buttonLoading.classList.add('d-none');
                    }
                    
                    showStatus('success', '✅ Thank you! Your message has been sent successfully. We will contact you within 24 hours.');
                    
                    // Reset form after 3 seconds
                    setTimeout(() => {
                        contactForm.reset();
                        resetButton();
                        if (submitStatus) {
                            submitStatus.innerHTML = '';
                        }
                    }, 3000);
                    
                }, function(error) {
                    console.log('FAILED...', error);
                    showStatus('error', '❌ Failed to send message. Please try again or contact us directly.');
                    resetButton();
                });
            
            // Helper functions
            function showStatus(type, message) {
                if (submitStatus) {
                    let alertClass, icon;
                    switch(type) {
                        case 'success': alertClass = 'alert-success'; icon = 'fa-check-circle'; break;
                        case 'error': alertClass = 'alert-danger'; icon = 'fa-exclamation-circle'; break;
                        case 'info': alertClass = 'alert-info'; icon = 'fa-info-circle'; break;
                    }
                    
                    submitStatus.innerHTML = `
                        <div class="alert ${alertClass} mt-3" role="alert">
                            <i class="fas ${icon} me-2"></i>
                            ${message}
                        </div>
                    `;
                }
            }
            
            function resetButton() {
                submitBtn.disabled = false;
                if (buttonText) buttonText.textContent = 'Send Message';
                if (buttonLoading) buttonLoading.classList.add('d-none');
            }
        });
    }
});

// Handle screen orientation change
window.addEventListener('orientationchange', function() {
    setTimeout(function() {
        window.scrollTo(0, window.scrollY);
    }, 500);
});

// Maintain consistent animations across all devices
// Previously had code here that reduced animation duration on mobile to 0.3s
