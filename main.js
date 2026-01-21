// Header Scroll Logic
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const topBar = document.querySelector('.top-bar');
    if (window.scrollY > 30) {
        header.classList.add('scrolled');
        if (topBar) topBar.style.transform = 'translateY(-100%)';
    } else {
        header.classList.remove('scrolled');
        if (topBar) topBar.style.transform = 'translateY(0)';
    }
});

// Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden-preloader');
    }
});

// Mobile Menu Toggle
const menuBtn = document.querySelector('.mobile-menu-btn');
const mobileNav = document.querySelector('.mobile-nav');
menuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    const icon = menuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Close mobile nav on link click
document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        const icon = menuBtn.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

// Stats Counter Animation
const counters = document.querySelectorAll('.count');
const speed = 200;

const runCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};

// Intersection Observer for Animations and Counters
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('counter-section')) {
                runCounters();
            }
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add animation classes to elements
const animElements = document.querySelectorAll('.hero-text, .hero-image, .about-images, .about-content, .service-card, .doctor-card, .appointment-form-box, .counter-section');
animElements.forEach(el => {
    el.classList.add('animate-up');
    observer.observe(el);
});

// Refined WhatsApp Form Handling (Removed pro-schedule-form as it is deleted)

// Hero Complete Appointment Form
// Hero Complete Appointment Form Logic
// Hero Complete Appointment Form Logic
document.addEventListener('DOMContentLoaded', () => {
    const heroForm = document.getElementById('hero-appointment-form');
    const dateInput = document.getElementById('hero-date');
    const timeSelect = document.getElementById('hero-time');

    // 1. Set Min Date to Today (Local Time)
    if (dateInput) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;
        dateInput.setAttribute('min', today);

        // 2. Dynamic Time Slots based on Day
        dateInput.addEventListener('change', function () {
            const selectedDate = new Date(this.value);
            const day = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

            // Working Hours Config
            let startHour = 10; // 10 AM
            let endHour = 21;   // 9 PM (Mon-Sat)

            if (day === 0) { // Sunday
                endHour = 14; // 2 PM
            }

            // Clear existing options
            timeSelect.innerHTML = '<option value="" disabled selected>Select Time Slot</option>';

            // Generate 30-min intervals
            for (let h = startHour; h < endHour; h++) {
                for (let m = 0; m < 60; m += 30) {
                    const timeStr = formatTime(h, m);
                    const option = document.createElement('option');
                    option.value = timeStr;
                    option.textContent = timeStr;
                    timeSelect.appendChild(option);
                }
            }
        });
    }

    if (heroForm) {
        heroForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('hero-name').value;
            const phone = document.getElementById('hero-phone').value;

            // Strict 10-digit Indian Mobile Validation
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(phone)) {
                alert("Please enter a valid 10-digit Indian mobile number (starts with 6-9).");
                return;
            }
            const service = document.getElementById('hero-service').value;
            const consultation = document.getElementById('hero-consultation').value;
            const date = document.getElementById('hero-date').value;
            const time = document.getElementById('hero-time').value; // Now gets value from SELECT
            const additional = document.getElementById('hero-message').value || "None";

            const whatsappNumber = "919063735560";
            // Manual URL encoding for clean format
            const text = `New Appointment Request - VR Dental Care%0A%0A` +
                `Patient Name: ${name}%0A` +
                `Phone: ${phone}%0A` +
                `Service Required: ${service}%0A` +
                `Consultation Mode: ${consultation}%0A` +
                `Preferred Date: ${date}%0A` +
                `Preferred Time: ${time}%0A` +
                `Additional Details: ${additional}`;

            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;

            const btn = heroForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = "Booking Visit...";
            btn.disabled = true;

            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                btn.innerHTML = originalText;
                btn.disabled = false;
                heroForm.reset();
                // Reset Time Select
                if (timeSelect) timeSelect.innerHTML = '<option value="" disabled selected>Select Date First</option>';
            }, 800);
        });
    }

    function formatTime(hour, minute) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const h = hour % 12 || 12; // Convert 0/12 to 12
        const m = minute < 10 ? '0' + minute : minute;
        return `${h}:${m} ${period}`;
    }
});

// Service Card Expansion Logic (Option A)
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        const readMoreBtn = card.querySelector('.read-more-btn');
        if (!readMoreBtn) return;

        readMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Close other cards for a cleaner experience
            const isActive = card.classList.contains('active');
            serviceCards.forEach(c => {
                c.classList.remove('active');
                const btn = c.querySelector('.read-more-btn');
                if (btn) btn.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
            });

            // Toggle current card
            if (!isActive) {
                card.classList.add('active');
                readMoreBtn.innerHTML = 'Show Less <i class="fas fa-chevron-up"></i>';

                // Smooth scroll into view if card is large
                setTimeout(() => {
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 400);
            }
        });
    });

    // Gallery Slider Logic (Refined for Text Sync)
    const galleryContainer = document.querySelector('.gallery-wrapper');
    if (galleryContainer) {
        const slides = galleryContainer.querySelectorAll('.gallery-slide');
        const dotsContainer = galleryContainer.querySelector('.gallery-dots');
        const prevBtn = galleryContainer.querySelector('.gallery-prev');
        const nextBtn = galleryContainer.querySelector('.gallery-next');
        const titleEl = document.getElementById('gallery-title');
        const descEl = document.getElementById('gallery-desc');
        const infoContent = document.querySelector('.info-content');

        let currentSlide = 0;
        let autoSlideInterval;

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = galleryContainer.querySelectorAll('.dot');

        function updateText(index) {
            if (!titleEl || !descEl) return;

            // Trigger animation
            infoContent.style.animation = 'none';
            infoContent.offsetHeight; /* trigger reflow */
            infoContent.style.animation = 'fadeInUp 0.5s forwards';

            const slide = slides[index];
            titleEl.textContent = slide.getAttribute('data-title');
            descEl.textContent = slide.getAttribute('data-desc');
        }

        function updateDots() {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            updateDots();
            updateText(currentSlide);
            resetAutoSlide();
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        startAutoSlide();
    }

    // Hero Background Slider (7s interval)
    function initHeroBackgroundSlider() {
        const heroSlides = document.querySelectorAll('.hero-slide-bg');
        if (heroSlides.length < 2) return;

        let currentHeroSlide = 0;

        function nextHeroSlide() {
            heroSlides[currentHeroSlide].classList.remove('active');
            currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
            heroSlides[currentHeroSlide].classList.add('active');
        }

        setInterval(nextHeroSlide, 7000); // 7 seconds interval
    }

    initHeroBackgroundSlider();
});

// Active Menu Highlighting
const sections = document.querySelectorAll('section[id], #doctors, #gallery-section');
const navLinks = document.querySelectorAll('.nav-links li a, .mobile-nav li a');

window.addEventListener('scroll', () => {
    let current = '';

    // Choose the section closest to the top
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        // Revised Offset Logic: Highlight if section's top is within viewport range
        if (window.scrollY >= (sectionTop - 300)) {
            current = section.getAttribute('id');
        }
    });

    // Handle alias IDs
    // if (current === 'gallery-heading') current = 'gallery-section';

    navLinks.forEach(link => {
        // Skip CTA buttons
        if (link.classList.contains('btn')) return;

        link.classList.remove('active');
        // Check if href contains the current section ID
        if (current && link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Mobile Accordion Logic
function toggleAccordion(header) {
    const body = header.nextElementSibling;
    const icon = header.querySelector('.accordion-icon');

    // Close other open items
    const allBodies = document.querySelectorAll('.accordion-body');
    const allHeaders = document.querySelectorAll('.accordion-header');

    allBodies.forEach(item => {
        if (item !== body) {
            item.classList.remove('open');
        }
    });

    allHeaders.forEach(item => {
        if (item !== header) {
            item.classList.remove('active');
        }
    });

    // Toggle current
    body.classList.toggle('open');
    header.classList.toggle('active');
}


