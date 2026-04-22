document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    updateCopyrightYear();
    
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Initialize quote slider if present on page
    if (document.querySelector('.quote-slider')) {
        initQuoteSlider();
    }
    
    // Initialize contact form validation if present on page
    if (document.getElementById('contact-form')) {
        initContactForm();
    }
    
    // Initialize project filters if present on page
    if (document.querySelector('.filter-buttons')) {
        initProjectFilters();
    }
});

/**
 * Updates the copyright year in the footer
 */
function updateCopyrightYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/**
 * Initializes mobile navigation menu
 */
function initMobileNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            // Toggle active class on menu button
            this.classList.toggle('active');
            // Toggle nav menu visibility
            navLinks.classList.toggle('active');
            // Update aria-expanded attribute for accessibility
            const expanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', expanded);
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !menuToggle.contains(event.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close menu when window is resized to desktop size
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

/**
 * Initializes smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const menuToggle = document.querySelector('.menu-toggle');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
                
                // Calculate header height for offset
                const headerHeight = document.querySelector('header').offsetHeight;
                
                // Scroll to the target with offset for fixed header
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * Initializes the quote slider
 */
function initQuoteSlider() {
    const quoteItems = document.querySelectorAll('.quote-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    
    if (quoteItems.length > 0 && prevBtn && nextBtn) {
        // Initial setup - hide all but first quote
        for (let i = 1; i < quoteItems.length; i++) {
            quoteItems[i].style.display = 'none';
        }
        
        // Show specified slide
        function showSlide(index) {
            // Hide all slides
            quoteItems.forEach(item => {
                item.style.display = 'none';
                item.setAttribute('aria-hidden', 'true');
            });
            
            // Show the selected slide
            quoteItems[index].style.display = 'block';
            quoteItems[index].setAttribute('aria-hidden', 'false');
            
            // Update current slide index
            currentSlide = index;
        }
        
        // Go to previous slide
        prevBtn.addEventListener('click', function() {
            let newIndex = currentSlide - 1;
            if (newIndex < 0) {
                newIndex = quoteItems.length - 1;
            }
            showSlide(newIndex);
        });
        
        // Go to next slide
        nextBtn.addEventListener('click', function() {
            let newIndex = currentSlide + 1;
            if (newIndex >= quoteItems.length) {
                newIndex = 0;
            }
            showSlide(newIndex);
        });
        
        // Auto-rotate slides every 6 seconds
        let slideInterval = setInterval(() => {
            let newIndex = currentSlide + 1;
            if (newIndex >= quoteItems.length) {
                newIndex = 0;
            }
            showSlide(newIndex);
        }, 6000);
        
        // Pause rotation when hovering over the slider
        const sliderContainer = document.querySelector('.quote-slider');
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        // Resume rotation when leaving the slider
        sliderContainer.addEventListener('mouseleave', () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => {
                let newIndex = currentSlide + 1;
                if (newIndex >= quoteItems.length) {
                    newIndex = 0;
                }
                showSlide(newIndex);
            }, 6000);
        });
        
        // Keyboard accessibility
        sliderContainer.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                let newIndex = currentSlide - 1;
                if (newIndex < 0) {
                    newIndex = quoteItems.length - 1;
                }
                showSlide(newIndex);
            } else if (e.key === 'ArrowRight') {
                let newIndex = currentSlide + 1;
                if (newIndex >= quoteItems.length) {
                    newIndex = 0;
                }
                showSlide(newIndex);
            }
        });
    }
}

/**
 * Initializes contact form validation and submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            let isValid = true;
            
            // Reset previous error messages
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            
            // Validate name
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Please enter your name');
                isValid = false;
            }
            
            // Validate email
            if (!validateEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate message
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Please enter your message');
                isValid = false;
            }
            
            if (isValid) {
                // Disable submit button to prevent multiple submissions
                const submitBtn = contactForm.querySelector('.submit-btn');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                
                // Simulate form submission
                setTimeout(() => {
                    // Show success message
                    formStatus.innerHTML = '<div class="success-message">Thank you! Your message has been sent successfully.</div>';
                    formStatus.classList.add('success');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                    
                    // Clear success message after 5 seconds
                    setTimeout(() => {
                        formStatus.innerHTML = '';
                        formStatus.classList.remove('success');
                    }, 5000);
                }, 1500);
            }
        });
        
        function showError(input, message) {
            // Create error message element
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            
            // Insert error message after the input
            input.parentNode.insertBefore(errorDiv, input.nextSibling);
            
            // Add error class to input
            input.classList.add('input-error');
            
            // Remove error class when input is focused
            input.addEventListener('focus', function() {
                this.classList.remove('input-error');
                if (this.nextSibling && this.nextSibling.classList && this.nextSibling.classList.contains('error-message')) {
                    this.parentNode.removeChild(this.nextSibling);
                }
            });
        }
        
        function validateEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
    }
}

/**
 * Initializes project filtering functionality
 */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');
    
    if (filterButtons.length > 0 && projects.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filter = this.getAttribute('data-filter');
                
                // Filter projects
                projects.forEach(project => {
                    if (filter === 'all') {
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.classList.remove('hidden');
                        }, 10);
                    } 
                    else {
                        const categories = project.getAttribute('data-categories').split(' ');
                        if (categories.includes(filter)) {
                            project.style.display = 'block';
                            setTimeout(() => {
                                project.classList.remove('hidden');
                            }, 10);
                        } 
                        else {
                            project.classList.add('hidden');
                            setTimeout(() => {
                                project.style.display = 'none';
                            }, 300); // Match CSS transition duration
                        }
                    }
                });
            });
        });
    }
}

// Add event listener for page load to fade in content
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});