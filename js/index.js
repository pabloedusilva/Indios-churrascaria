// Elementos do DOM
const loader = document.querySelector('.loader');
const filterBtns = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item');
const galleryItems = document.querySelectorAll('.gallery-item');

// Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1000);
});

// Garantir que o vídeo hero sempre rode automáticamente
function ensureVideoAutoplay() {
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        // Configurar propriedades do vídeo
        heroVideo.muted = true;
        heroVideo.loop = true;
        heroVideo.autoplay = true;
        heroVideo.playsInline = true;
        
        // Tentar reproduzir o vídeo
        heroVideo.play().catch(() => {
            // Se falhar, tentar novamente após interação do usuário
            const playVideoOnInteraction = () => {
                heroVideo.play().catch(() => {
                    console.log('Não foi possível reproduzir o vídeo automaticamente');
                });
                document.removeEventListener('click', playVideoOnInteraction);
                document.removeEventListener('touchstart', playVideoOnInteraction);
            };
            
            document.addEventListener('click', playVideoOnInteraction);
            document.addEventListener('touchstart', playVideoOnInteraction);
        });
        
        // Impedir pausa do vídeo
        heroVideo.addEventListener('pause', () => {
            heroVideo.play();
        });
        
        // Garantir que o vídeo continue rodando se perder o foco
        heroVideo.addEventListener('ended', () => {
            heroVideo.currentTime = 0;
            heroVideo.play();
        });
    }
}

// Executar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', ensureVideoAutoplay);

// Executar também quando a página estiver completamente carregada
window.addEventListener('load', ensureVideoAutoplay);

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Menu filter functionality
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        // Filter menu items
        menuItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filterValue === 'all' || category === filterValue) {
                item.style.display = 'block';
                // Animação de entrada
                item.style.animation = 'none';
                item.offsetHeight; // Trigger reflow
                item.style.animation = 'fadeInUp 0.5s ease-out';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Back to top functionality
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Gallery lightbox effect
function openGalleryLightbox(imageSrc, imageAlt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="lightbox-close">&times;</span>
                    <img src="${imageSrc}" alt="${imageAlt}">
                </div>
            `;

    // CSS para lightbox
    lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;

    const content = lightbox.querySelector('.lightbox-content');
    content.style.cssText = `
                position: relative;
                max-width: 90%;
                max-height: 90%;
            `;

    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.style.cssText = `
                position: absolute;
                top: -40px;
                right: 0;
                color: white;
                font-size: 30px;
                cursor: pointer;
                z-index: 10001;
                transition: color 0.3s ease;
            `;

    const lightboxImg = lightbox.querySelector('img');
    lightboxImg.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 8px;
            `;

    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    // Animação de entrada
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 10);

    // Fechar lightbox
    const closeLightbox = () => {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(lightbox)) {
                document.body.removeChild(lightbox);
                document.body.style.overflow = '';
            }
        }, 300);
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Fechar com ESC
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// Initialize gallery lightbox for existing items
document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                openGalleryLightbox(img.src, img.alt);
            }
        });
    });
});

// Newsletter form handling
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('.newsletter-input');
        const submitBtn = newsletterForm.querySelector('.newsletter-btn');

        if (emailInput.value.trim() !== '') {
            submitBtn.innerHTML = '<i class="fas fa-check"></i>';
            submitBtn.style.backgroundColor = 'var(--success)';

            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
                submitBtn.style.backgroundColor = 'var(--primary)';
                emailInput.value = '';
            }, 2000);
        }
    });
}

// Carousel functionality - Enhanced version
const carouselTrack = document.getElementById('carouselTrack');
const carouselSlides = document.querySelectorAll('.carousel-slide');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const carouselIndicators = document.querySelectorAll('.indicator');
const carouselThumbnails = document.querySelectorAll('.carousel-thumbnail');
const carouselProgress = document.getElementById('carouselProgress');
const currentSlideNumber = document.getElementById('currentSlideNumber');
const totalSlidesNumber = document.getElementById('totalSlidesNumber');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeImageModal = document.getElementById('closeImageModal');

let currentSlide = 0;
let isAnimating = false;
let autoplayInterval;
let autoplayDelay = 3000; // 3 seconds autoplay for faster rotation

// Initialize carousel
function initCarousel() {
    if (carouselSlides.length === 0) return;

    // Set up initial state
    carouselSlides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev', 'next');
        if (index === 0) {
            slide.classList.add('active');
        }
    });

    // Update UI elements
    totalSlidesNumber.textContent = carouselSlides.length;
    updateSlideIndicator();
    updateProgress();
    updateIndicators();
    updateThumbnails();

    // Start autoplay
    startAutoplay();
}

// Update slide with smooth animation
function updateSlide(slideIndex, direction = 'next') {
    if (isAnimating || slideIndex === currentSlide || slideIndex < 0 || slideIndex >= carouselSlides.length) {
        return;
    }

    isAnimating = true;

    // Remove active class from current slide
    carouselSlides[currentSlide].classList.remove('active');

    // Set up animation classes
    if (direction === 'next') {
        carouselSlides[currentSlide].classList.add('prev');
        carouselSlides[slideIndex].classList.remove('next');
        carouselSlides[slideIndex].classList.add('active');
    } else {
        carouselSlides[currentSlide].classList.add('next');
        carouselSlides[slideIndex].classList.remove('prev');
        carouselSlides[slideIndex].classList.add('active');
    }

    // Update current slide
    currentSlide = slideIndex;

    // Clean up animation classes and update UI
    setTimeout(() => {
        carouselSlides.forEach(slide => {
            slide.classList.remove('prev', 'next');
        });

        // Update all UI elements
        updateIndicators();
        updateThumbnails();
        updateSlideIndicator();
        updateProgress();

        isAnimating = false;
    }, 600); // Match CSS transition duration (optimized)
}

// Update indicators
function updateIndicators() {
    carouselIndicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Update thumbnails
function updateThumbnails() {
    carouselThumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentSlide);
    });
}

// Update slide indicator
function updateSlideIndicator() {
    currentSlideNumber.textContent = currentSlide + 1;
}

// Update progress bar
function updateProgress() {
    const progress = ((currentSlide + 1) / carouselSlides.length) * 100;
    carouselProgress.style.width = progress + '%';
}

// Next slide
function nextSlide() {
    const nextIndex = (currentSlide + 1) % carouselSlides.length;
    updateSlide(nextIndex, 'next');
}

// Previous slide
function prevSlide() {
    const prevIndex = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
    updateSlide(prevIndex, 'prev');
}

// Start autoplay
function startAutoplay() {
    stopAutoplay(); // Clear any existing interval
    autoplayInterval = setInterval(() => {
        if (!document.hidden && !isAnimating) {
            nextSlide();
        }
    }, autoplayDelay);
}

// Stop autoplay
function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
}

// Pause autoplay temporarily
function pauseAutoplay() {
    stopAutoplay();
    setTimeout(() => {
        if (!document.hidden) {
            startAutoplay();
        }
    }, 8000); // Resume after 8 seconds
}

// Event listeners for navigation buttons
if (carouselNext) {
    carouselNext.addEventListener('click', () => {
        nextSlide();
        pauseAutoplay();
    });
}

if (carouselPrev) {
    carouselPrev.addEventListener('click', () => {
        prevSlide();
        pauseAutoplay();
    });
}

// Indicator click events
carouselIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        const direction = index > currentSlide ? 'next' : 'prev';
        updateSlide(index, direction);
        pauseAutoplay();
    });
});

// Thumbnail click events
carouselThumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
        const direction = index > currentSlide ? 'next' : 'prev';
        updateSlide(index, direction);
        pauseAutoplay();
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        nextSlide();
        pauseAutoplay();
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
        pauseAutoplay();
    }
});

// Touch/swipe support
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

if (carouselTrack) {
    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    enhancedHandleSwipe();
}

// Modal functionality
function openModal(imageSrc, imageAlt) {
    if (modalImage && imageModal) {
        modalImage.src = imageSrc;
        modalImage.alt = imageAlt;
        imageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        stopAutoplay(); // Stop autoplay when modal is open
    }
}

function closeModal() {
    if (imageModal) {
        imageModal.classList.remove('active');
        document.body.style.overflow = '';
        startAutoplay(); // Resume autoplay when modal is closed
    }
}

// Add click events to carousel slides for modal
carouselSlides.forEach((slide, index) => {
    slide.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            const img = e.target;
            openModal(img.src, img.alt);
        }
    });
});

// Modal close events
if (closeImageModal) {
    closeImageModal.addEventListener('click', closeModal);
}

if (imageModal) {
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            closeModal();
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && imageModal && imageModal.classList.contains('active')) {
        closeModal();
    }
});

// Pause/resume autoplay when tab visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoplay();
    } else if (!imageModal || !imageModal.classList.contains('active')) {
        startAutoplay();
    }
});

// Pause autoplay when hovering over carousel
if (carouselTrack) {
    carouselTrack.addEventListener('mouseenter', () => {
        stopAutoplay();
    });

    carouselTrack.addEventListener('mouseleave', () => {
        if (!imageModal || !imageModal.classList.contains('active')) {
            startAutoplay();
        }
    });
}

// Enhanced mobile optimizations
function initMobileOptimizations() {
    // Faster autoplay for mobile devices
    if (window.innerWidth <= 768) {
        autoplayDelay = 2500; // Faster rotation on mobile
    }
    
    // Optimize touch interactions
    const touchElements = document.querySelectorAll('.carousel-nav, .carousel-thumbnail, .indicator, .btn, .filter-btn');
    touchElements.forEach(element => {
        element.style.touchAction = 'manipulation';
        element.style.webkitTapHighlightColor = 'rgba(0, 0, 0, 0)';
    });
    
    // Preload next image for smoother transitions
    preloadNextImage();
    
    // Reduce motion for performance if needed
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        autoplayDelay = 0; // Disable autoplay for reduced motion
    }
}

// Preload next image for better performance
function preloadNextImage() {
    if (carouselSlides.length > 0) {
        const nextIndex = (currentSlide + 1) % carouselSlides.length;
        const nextImage = carouselSlides[nextIndex].querySelector('img');
        if (nextImage && !nextImage.complete) {
            const preloadImg = new Image();
            preloadImg.src = nextImage.src;
        }
    }
}

// Optimize carousel for mobile with better touch handling
function enhancedHandleSwipe() {
    const swipeThreshold = window.innerWidth <= 768 ? 30 : 50; // Lower threshold for mobile
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Only handle horizontal swipes with improved sensitivity
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
        if (diffX > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
        pauseAutoplay();
    }
}

// Mobile-specific event listeners
function initMobileEvents() {
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            initMobileOptimizations();
            // Recalculate carousel dimensions
            if (carouselSlides.length > 0) {
                updateProgress();
            }
        }, 100);
    });
    
    // Handle resize events for responsive behavior
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initMobileOptimizations();
            updateProgress();
        }, 250);
    });
    
    // Optimize scroll performance
    let scrollTimer;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            // Pause autoplay when scrolling
            if (Math.abs(window.scrollY - (window.lastScrollY || 0)) > 100) {
                stopAutoplay();
                setTimeout(() => {
                    if (!document.hidden && !imageModal.classList.contains('active')) {
                        startAutoplay();
                    }
                }, 1000);
            }
            window.lastScrollY = window.scrollY;
        }, 100);
    });
}

// Initialize all mobile optimizations
document.addEventListener('DOMContentLoaded', () => {
    initMobileOptimizations();
    initMobileEvents();
});

// Update the carousel initialization
const originalInitCarousel = initCarousel;
initCarousel = function() {
    originalInitCarousel.call(this);
    initMobileOptimizations();
}

// Enhanced Menu Cards Interactions
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Add advanced hover effects
    menuItems.forEach(item => {
        // Add loading animation on card click
        const addBtn = item.querySelector('.btn');
        if (addBtn) {
            addBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Add loading state
                addBtn.style.transform = 'scale(0.95)';
                addBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adicionando...';
                
                // Simulate API call
                setTimeout(() => {
                    addBtn.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
                    addBtn.style.background = 'linear-gradient(135deg, var(--success), #4caf50)';
                    
                    // Reset after 2 seconds
                    setTimeout(() => {
                        addBtn.innerHTML = 'Adicionar';
                        addBtn.style.transform = '';
                        addBtn.style.background = '';
                    }, 2000);
                }, 800);
            });
        }
        
        // Add subtle animation on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out';
                    entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(item);
    });
    
    // Enhanced filter animations
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuGrid = document.querySelector('.menu-grid');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            btn.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Add stagger animation to visible items
            const visibleItems = menuGrid.querySelectorAll('.menu-item:not([style*="display: none"])');
            visibleItems.forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
                item.style.animation = 'fadeInScale 0.5s ease-out';
            });
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .filter-btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);