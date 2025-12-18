/* =====================================================
   AMERICAN BRANDS MALL ABIDJAN - JAVASCRIPT
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    initLoader();
    initNavigation();
    initLazyLoading();
    initVideoLazyLoading();
    initCollectionFilter();
    initVideoShowcase();
    initOpenStatus();
    initScrollAnimations();
    initBackToTop();
    initChristmasPopup();
});

/* =====================================================
   LOADER - Progressive Loading
   ===================================================== */
function initLoader() {
    const loader = document.getElementById('loader');
    const loaderProgress = document.querySelector('.loader-progress');
    const body = document.body;

    body.classList.add('loading');

    // Critical assets to preload
    const criticalAssets = [
        'assets/logo.jpg',
        'assets/hero bg.mp4',
        'assets/about us.mp4'
    ];

    let loadedCount = 0;
    const totalAssets = criticalAssets.length;

    function updateProgress(progress) {
        loaderProgress.style.width = progress + '%';
    }

    function assetLoaded() {
        loadedCount++;
        const progress = (loadedCount / totalAssets) * 100;
        updateProgress(progress);

        if (loadedCount === totalAssets) {
            setTimeout(() => {
                hideLoader();
            }, 500);
        }
    }

    function hideLoader() {
        loader.classList.add('hidden');
        body.classList.remove('loading');

        // Trigger entrance animations
        setTimeout(() => {
            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                if (isInViewport(el)) {
                    el.classList.add('animated');
                }
            });
        }, 300);
    }

    // Preload critical images
    criticalAssets.forEach(src => {
        if (src.endsWith('.mp4')) {
            // For videos, just count them as loaded after a short delay
            // The actual video will load progressively
            const video = document.querySelector(`video source[src="${src}"]`);
            if (video) {
                const videoElement = video.parentElement;
                videoElement.addEventListener('loadeddata', assetLoaded);
                videoElement.addEventListener('error', assetLoaded);
                // Fallback timeout
                setTimeout(assetLoaded, 2000);
            } else {
                setTimeout(assetLoaded, 1000);
            }
        } else {
            const img = new Image();
            img.onload = assetLoaded;
            img.onerror = assetLoaded;
            img.src = src;
        }
    });

    // Fallback: hide loader after max 5 seconds
    setTimeout(() => {
        if (!loader.classList.contains('hidden')) {
            updateProgress(100);
            setTimeout(hideLoader, 300);
        }
    }, 5000);
}

/* =====================================================
   NAVIGATION
   ===================================================== */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        updateActiveNavLink();
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

/* =====================================================
   LAZY LOADING - Images
   ===================================================== */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');

                if (src) {
                    img.src = src;
                    img.onload = () => {
                        img.classList.add('loaded');
                    };
                    img.onerror = () => {
                        img.classList.add('loaded');
                    };
                }

                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });

    // Also handle regular images with data-lazy attribute
    const otherLazyImages = document.querySelectorAll('img[data-lazy]');
    otherLazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

/* =====================================================
   LAZY LOADING - Videos
   ===================================================== */
function initVideoLazyLoading() {
    const lazyVideos = document.querySelectorAll('video[data-lazy-video]');

    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                const source = video.querySelector('source[data-src]');

                if (source) {
                    source.src = source.getAttribute('data-src');
                    video.load();
                    video.play().catch(() => {
                        // Autoplay might be blocked, that's okay
                    });
                }

                observer.unobserve(video);
            }
        });
    }, {
        rootMargin: '100px 0px',
        threshold: 0.01
    });

    lazyVideos.forEach(video => {
        videoObserver.observe(video);
    });
}

/* =====================================================
   COLLECTION FILTER
   ===================================================== */
function initCollectionFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            // Filter products with animation
            productCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s forwards`;
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* =====================================================
   VIDEO SHOWCASE
   ===================================================== */
function initVideoShowcase() {
    const videoCards = document.querySelectorAll('.video-card');

    videoCards.forEach(card => {
        const video = card.querySelector('.showcase-video');
        const playBtn = card.querySelector('.play-btn');

        // Play on hover
        card.addEventListener('mouseenter', () => {
            if (video && video.readyState >= 2) {
                video.play().catch(() => {});
            }
        });

        card.addEventListener('mouseleave', () => {
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });

        // Play button click - toggle play/pause
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (video) {
                    if (video.paused) {
                        video.play().catch(() => {});
                        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    } else {
                        video.pause();
                        playBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                }
            });
        }
    });
}

/* =====================================================
   OPEN STATUS
   ===================================================== */
function initOpenStatus() {
    const statusElement = document.getElementById('open-status');
    if (!statusElement) return;

    function updateStatus() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentTime = hours + minutes / 60;

        // Opening hours: 08:30 - 21:00
        const openTime = 8.5; // 08:30
        const closeTime = 21; // 21:00

        if (currentTime >= openTime && currentTime < closeTime) {
            statusElement.innerHTML = '<span class="open">Ouvert maintenant</span> - Ferme à 21h00';
        } else {
            statusElement.innerHTML = '<span class="closed">Fermé</span> - Ouvre à 08h30';
        }
    }

    updateStatus();
    // Update every minute
    setInterval(updateStatus, 60000);
}

/* =====================================================
   SCROLL ANIMATIONS
   ===================================================== */
function initScrollAnimations() {
    // Add animate class to elements
    const animateElements = document.querySelectorAll(
        '.section-header, .about-video, .about-content, .product-card, ' +
        '.video-card, .schedule-info, .schedule-map, .contact-card, .cta-content'
    );

    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => {
        observer.observe(el);
    });
}

/* =====================================================
   BACK TO TOP
   ===================================================== */
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* =====================================================
   CHRISTMAS POPUP
   ===================================================== */
function initChristmasPopup() {
    const popup = document.getElementById('christmas-popup');
    const closeBtn = document.getElementById('popup-close');

    if (!popup || !closeBtn) return;

    // Check if popup was already shown this session
    const popupShown = sessionStorage.getItem('christmasPopupShown');

    if (!popupShown) {
        // Show popup after 3 seconds
        setTimeout(() => {
            popup.classList.add('active');
            sessionStorage.setItem('christmasPopupShown', 'true');
        }, 3000);
    }

    // Close popup
    closeBtn.addEventListener('click', () => {
        popup.classList.remove('active');
    });

    // Close on overlay click
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('active');
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            popup.classList.remove('active');
        }
    });
}

/* =====================================================
   UTILITY FUNCTIONS
   ===================================================== */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});
