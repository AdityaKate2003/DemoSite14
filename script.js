document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initScrollAnimations();
    initStickyNavbar();
    initSmoothScroll();
    initGalleryLightbox();
    initShowMore();
    initBookingForm();
    setMinDate();
    updateActiveNav();
});

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            const spans = hamburger.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-up');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

function initStickyNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

function updateActiveNav() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.remove('active');
        
        if (href === currentPage || (currentPage === '' && href === 'index.html') || (currentPage === '/' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (galleryItems.length > 0 && lightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', function() {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

function initShowMore() {
    const showMoreBtn = document.getElementById('showMoreBtn');
    const hiddenItems = document.querySelectorAll('.gallery-item.hidden');

    if (showMoreBtn && hiddenItems.length > 0) {
        showMoreBtn.addEventListener('click', function() {
            hiddenItems.forEach(item => {
                item.classList.remove('hidden');
                item.classList.add('fade-up');
                
                setTimeout(() => {
                    item.classList.add('visible');
                }, 100);
            });

            showMoreBtn.style.display = 'none';
        });
    } else if (showMoreBtn && hiddenItems.length === 0) {
        showMoreBtn.style.display = 'none';
    }
}

function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            clearErrors();

            if (validateForm()) {
                showSuccessModal();
                bookingForm.reset();
            }
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            hideSuccessModal();
        });
    }

    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                hideSuccessModal();
            }
        });
    }
}

function validateForm() {
    let isValid = true;

    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const service = document.getElementById('service');
    const date = document.getElementById('date');
    const time = document.getElementById('time');

    if (name.value.trim() === '') {
        showError('nameError', 'Please enter your full name');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showError('nameError', 'Name must be at least 2 characters');
        isValid = false;
    }

    const phonePattern = /^[\d\s\-\+\(\)]+$/;
    if (phone.value.trim() === '') {
        showError('phoneError', 'Please enter your phone number');
        isValid = false;
    } else if (!phonePattern.test(phone.value) || phone.value.replace(/\D/g, '').length < 10) {
        showError('phoneError', 'Please enter a valid phone number');
        isValid = false;
    }

    if (email.value.trim() !== '') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
            showError('emailError', 'Please enter a valid email address');
            isValid = false;
        }
    }

    if (service.value === '') {
        showError('serviceError', 'Please select a service');
        isValid = false;
    }

    if (date.value === '') {
        showError('dateError', 'Please select a date');
        isValid = false;
    } else {
        const selectedDate = new Date(date.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showError('dateError', 'Please select a future date');
            isValid = false;
        }
    }

    if (time.value === '') {
        showError('timeError', 'Please select a time');
        isValid = false;
    }

    return isValid;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.opacity = '1';
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.opacity = '0';
    });
}

function showSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function setMinDate() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        
        dateInput.min = `${year}-${month}-${day}`;
    }
}

