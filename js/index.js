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

// ==========================================
// MODERN CAROUSEL FUNCTIONALITY
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Carousel state and configuration
    const carousel = {
        currentSlide: 0,
        totalSlides: 6,
        isAnimating: false,
        autoplayInterval: null,
        autoplayDelay: 5000,
        touchStartX: 0,
        touchEndX: 0,
        touchStartY: 0,
        touchEndY: 0,
        swipeThreshold: 50
    };

    // DOM elements
    const elements = {
        carousel: document.getElementById('modernCarousel'),
        loading: document.getElementById('carouselLoading'),
        slides: document.querySelectorAll('.slide'),
        slidesContainer: document.getElementById('carouselSlides'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        progressBar: document.getElementById('progressBar'),
        currentSlideDisplay: document.getElementById('currentSlide'),
        totalSlidesDisplay: document.getElementById('totalSlides'),
        dots: document.querySelectorAll('.dot'),
        thumbnails: document.querySelectorAll('.thumbnail'),
        modal: document.getElementById('imageModal'),
        modalImage: document.getElementById('modalImage'),
        modalTitle: document.getElementById('modalTitle'),
        modalDescription: document.getElementById('modalDescription'),
        modalClose: document.getElementById('modalClose')
    };

    // Slide data
    const slideData = [
        {
            title: 'Espetinhos na Brasa',
            description: 'Nossos espetinhos grelhados no ponto perfeito, com tempero especial da casa que desperta todos os sentidos',
            image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=90'
        },
        {
            title: 'Ambiente Acolhedor',
            description: 'Um espaço perfeito para desfrutar de uma refeição em família ou com amigos, com toda comodidade',
            image: 'https://images.unsplash.com/photo-1606755456206-b25206bfa233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=90'
        },
        {
            title: 'Porções Generosas',
            description: 'Acompanhamentos deliciosos e porções que satisfazem toda a família, com qualidade incomparável',
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=90'
        },
        {
            title: 'Eventos Especiais',
            description: 'Preparamos seu evento com todo carinho e dedicação, tornando cada momento inesquecível',
            image: 'https://images.unsplash.com/photo-1606755962773-dff5c40bddf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=90'
        },
        {
            title: 'Equipe Especializada',
            description: 'Chefs experientes garantem a qualidade e sabor em cada espetinho, sempre com muito carinho',
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=90'
        },
        {
            title: 'Satisfação Garantida',
            description: 'A felicidade dos nossos clientes é nossa maior recompensa e motivação diária',
            image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=90'
        }
    ];

    // Initialize carousel
    function initCarousel() {
        if (!elements.carousel) {
            console.warn('Carousel container not found');
            return;
        }

        console.log('Initializing modern carousel...');

        // Set up initial state
        carousel.totalSlides = elements.slides.length;
        
        if (elements.totalSlidesDisplay) {
            elements.totalSlidesDisplay.textContent = carousel.totalSlides;
        }

        // Initialize slides
        elements.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'next', 'prev');
            if (index === 0) {
                slide.classList.add('active');
            }
        });

        // Update UI
        updateUI();
        
        // Add event listeners
        addEventListeners();
        
        // Preload images
        preloadImages();
        
        // Start autoplay
        startAutoplay();
        
        // Hide loading
        setTimeout(() => {
            if (elements.loading) {
                elements.loading.classList.add('hidden');
            }
        }, 1000);

        console.log('Carousel initialized successfully');
    }

    // Update UI elements
    function updateUI() {
        // Update progress bar
        if (elements.progressBar) {
            const progress = ((carousel.currentSlide + 1) / carousel.totalSlides) * 100;
            elements.progressBar.style.width = `${progress}%`;
        }

        // Update slide counter
        if (elements.currentSlideDisplay) {
            elements.currentSlideDisplay.textContent = carousel.currentSlide + 1;
        }

        // Update dots
        elements.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === carousel.currentSlide);
        });

        // Update thumbnails
        elements.thumbnails.forEach((thumbnail, index) => {
            thumbnail.classList.toggle('active', index === carousel.currentSlide);
        });
    }

    // Navigate to specific slide
    function goToSlide(slideIndex, direction = 'next') {
        if (carousel.isAnimating || slideIndex === carousel.currentSlide) {
            return;
        }

        if (slideIndex < 0 || slideIndex >= carousel.totalSlides) {
            return;
        }

        carousel.isAnimating = true;
        stopAutoplay();

        const currentSlideEl = elements.slides[carousel.currentSlide];
        const nextSlideEl = elements.slides[slideIndex];

        // Remove current active state
        currentSlideEl.classList.remove('active');
        
        // Set transition classes
        if (direction === 'next') {
            currentSlideEl.classList.add('prev');
            nextSlideEl.classList.add('active');
        } else {
            currentSlideEl.classList.add('next');
            nextSlideEl.classList.add('active');
        }

        // Update current slide
        carousel.currentSlide = slideIndex;

        // Clean up after transition
        setTimeout(() => {
            elements.slides.forEach(slide => {
                slide.classList.remove('prev', 'next');
            });
            
            updateUI();
            carousel.isAnimating = false;
            
            // Restart autoplay
            setTimeout(() => {
                startAutoplay();
            }, 1000);
        }, 1000);
    }

    // Navigation functions
    function nextSlide() {
        const nextIndex = (carousel.currentSlide + 1) % carousel.totalSlides;
        goToSlide(nextIndex, 'next');
    }

    function prevSlide() {
        const prevIndex = (carousel.currentSlide - 1 + carousel.totalSlides) % carousel.totalSlides;
        goToSlide(prevIndex, 'prev');
    }

    // Autoplay functions
    function startAutoplay() {
        stopAutoplay();
        if (!document.hidden && !elements.modal?.classList.contains('active')) {
            carousel.autoplayInterval = setInterval(nextSlide, carousel.autoplayDelay);
        }
    }

    function stopAutoplay() {
        if (carousel.autoplayInterval) {
            clearInterval(carousel.autoplayInterval);
            carousel.autoplayInterval = null;
        }
    }

    function pauseAutoplay() {
        stopAutoplay();
        setTimeout(() => {
            if (!document.hidden && !elements.modal?.classList.contains('active')) {
                startAutoplay();
            }
        }, 3000);
    }

    // Touch/Swipe handling
    function handleTouchStart(e) {
        carousel.touchStartX = e.touches[0].clientX;
        carousel.touchStartY = e.touches[0].clientY;
        pauseAutoplay();
    }

    function handleTouchMove(e) {
        e.preventDefault();
    }

    function handleTouchEnd(e) {
        carousel.touchEndX = e.changedTouches[0].clientX;
        carousel.touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
    }

    function handleSwipe() {
        const deltaX = carousel.touchStartX - carousel.touchEndX;
        const deltaY = carousel.touchStartY - carousel.touchEndY;

        // Check if it's a horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > carousel.swipeThreshold) {
            if (deltaX > 0) {
                nextSlide(); // Swipe left = next
            } else {
                prevSlide(); // Swipe right = previous
            }
        }
    }

    // Modal functions
    function openModal(slideIndex) {
        if (!elements.modal || slideIndex < 0 || slideIndex >= slideData.length) return;

        const slide = slideData[slideIndex];
        
        if (elements.modalImage) {
            elements.modalImage.src = slide.image;
            elements.modalImage.alt = slide.title;
        }
        
        if (elements.modalTitle) {
            elements.modalTitle.textContent = slide.title;
        }
        
        if (elements.modalDescription) {
            elements.modalDescription.textContent = slide.description;
        }

        elements.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        stopAutoplay();
    }

    function closeModal() {
        if (!elements.modal) return;
        
        elements.modal.classList.remove('active');
        document.body.style.overflow = '';
        startAutoplay();
    }

    // Preload images for better performance
    function preloadImages() {
        slideData.forEach(slide => {
            const img = new Image();
            img.src = slide.image;
        });
    }

    // Add all event listeners
    function addEventListeners() {
        // Navigation buttons
        if (elements.nextBtn) {
            elements.nextBtn.addEventListener('click', () => {
                nextSlide();
                pauseAutoplay();
            });
        }

        if (elements.prevBtn) {
            elements.prevBtn.addEventListener('click', () => {
                prevSlide();
                pauseAutoplay();
            });
        }

        // Dots navigation
        elements.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const direction = index > carousel.currentSlide ? 'next' : 'prev';
                goToSlide(index, direction);
                pauseAutoplay();
            });
        });

        // Thumbnails navigation
        elements.thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                const direction = index > carousel.currentSlide ? 'next' : 'prev';
                goToSlide(index, direction);
                pauseAutoplay();
            });
        });

        // Touch events
        if (elements.slidesContainer) {
            elements.slidesContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
            elements.slidesContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
            elements.slidesContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
                pauseAutoplay();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
                pauseAutoplay();
            } else if (e.key === 'Escape' && elements.modal?.classList.contains('active')) {
                closeModal();
            }
        });

        // Modal events
        if (elements.modalClose) {
            elements.modalClose.addEventListener('click', closeModal);
        }

        if (elements.modal) {
            elements.modal.addEventListener('click', (e) => {
                if (e.target === elements.modal) {
                    closeModal();
                }
            });
        }

        // Image click for modal
        elements.slides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            if (img) {
                img.addEventListener('click', () => {
                    openModal(index);
                });
                img.style.cursor = 'pointer';
            }
        });

        elements.thumbnails.forEach((thumbnail, index) => {
            const img = thumbnail.querySelector('img');
            if (img) {
                img.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openModal(index);
                });
                img.style.cursor = 'pointer';
            }
        });

        // Visibility change handling
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoplay();
            } else if (!elements.modal?.classList.contains('active')) {
                startAutoplay();
            }
        });

        // Hover pause for desktop
        if (elements.carousel) {
            elements.carousel.addEventListener('mouseenter', pauseAutoplay);
            elements.carousel.addEventListener('mouseleave', startAutoplay);
        }

        // Resize handling
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateUI();
            }, 250);
        });
    }

    // Initialize when DOM is ready
    initCarousel();

    // Make functions available globally for debugging
    window.modernCarousel = {
        goToSlide,
        nextSlide,
        prevSlide,
        startAutoplay,
        stopAutoplay,
        openModal,
        closeModal,
        getCurrentSlide: () => carousel.currentSlide,
        getTotalSlides: () => carousel.totalSlides,
        isAnimating: () => carousel.isAnimating
    };
});

// ==========================================
// ENHANCED MENU CARDS INTERACTIONS
// ==========================================
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

// ==========================================
// SPECIAL EFFECTS ENHANCEMENT
// ==========================================

function addSpecialEffects() {
    // Magic transition effect on slide change
    function triggerMagicTransition() {
        const carousel = document.querySelector('.modern-carousel');
        if (!carousel) return;
        
        const magicElement = document.createElement('div');
        magicElement.className = 'slide-transition-magic active';
        carousel.appendChild(magicElement);
        
        setTimeout(() => {
            if (magicElement.parentNode) {
                magicElement.parentNode.removeChild(magicElement);
            }
        }, 1000);
    }

    // Enhanced dot interactions
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => {
        dot.addEventListener('mouseenter', () => {
            dot.style.transform = 'scale(1.3)';
            dot.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            dot.style.boxShadow = '0 0 15px rgba(211, 47, 47, 0.8)';
        });

        dot.addEventListener('mouseleave', () => {
            dot.style.transform = 'scale(1)';
            dot.style.boxShadow = '';
        });

        const originalClick = dot.onclick;
        dot.addEventListener('click', (e) => {
            triggerMagicTransition();
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                margin-left: -10px;
                margin-top: -10px;
            `;
            dot.style.position = 'relative';
            dot.style.overflow = 'hidden';
            dot.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });

    // Enhanced button interactions
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            triggerMagicTransition();
            btn.style.animation = 'buttonPress 0.2s ease-out';
            setTimeout(() => {
                btn.style.animation = '';
            }, 200);
        });

        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-50%) scale(1.1)';
            btn.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.4)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(-50%) scale(1)';
            btn.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        });
    });

    // Thumbnail hover effects
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('mouseenter', () => {
            thumbnail.style.transform = 'scale(1.15) rotate(3deg)';
            thumbnail.style.filter = 'brightness(1.3) saturate(1.4) contrast(1.1)';
            thumbnail.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            thumbnail.style.zIndex = '10';
            thumbnail.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.4)';
        });

        thumbnail.addEventListener('mouseleave', () => {
            thumbnail.style.transform = 'scale(1) rotate(0deg)';
            thumbnail.style.filter = 'brightness(1) saturate(1) contrast(1)';
            thumbnail.style.zIndex = '';
            thumbnail.style.boxShadow = '';
        });

        thumbnail.addEventListener('click', () => {
            triggerMagicTransition();
        });
    });

    // Dynamic progress bar enhancement
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const observer = new MutationObserver(() => {
            if (progressBar.style.width === '100%') {
                progressBar.style.boxShadow = '0 0 25px var(--primary), 0 0 50px var(--primary)';
                setTimeout(() => {
                    progressBar.style.boxShadow = '0 0 10px rgba(211, 47, 47, 0.5)';
                }, 200);
            }
        });
        observer.observe(progressBar, { attributes: true, attributeFilter: ['style'] });
    }

    // Slide content animation enhancement
    function enhanceSlideAnimation() {
        const activeSlide = document.querySelector('.slide.active');
        if (activeSlide) {
            const content = activeSlide.querySelector('.slide-content');
            const image = activeSlide.querySelector('.slide-image img');
            
            if (content) {
                content.style.animation = 'none';
                setTimeout(() => {
                    content.style.animation = 'slideContentEntrance 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
                }, 100);
            }

            if (image) {
                image.style.animation = 'none';
                setTimeout(() => {
                    image.style.animation = 'imageZoomIn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
                }, 50);
            }
        }
    }

    // CTA Button floating effect
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.animation = 'ctaFloat 0.6s ease-in-out forwards';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.animation = 'none';
        });
    });

    // Auto-enhance on slide changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (mutation.target.classList.contains('active') && 
                    mutation.target.classList.contains('slide')) {
                    setTimeout(enhanceSlideAnimation, 100);
                }
            }
        });
    });

    // Observe all slides for class changes
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
    });

    // Add dynamic CSS for special effects
    const specialEffectsCSS = document.createElement('style');
    specialEffectsCSS.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes imageZoomIn {
            from {
                transform: scale(1.2);
                opacity: 0.7;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        @keyframes ctaFloat {
            0% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-10px);
            }
            100% {
                transform: translateY(-5px);
            }
        }
    `;
    document.head.appendChild(specialEffectsCSS);

    // Initialize slide enhancement for current active slide
    setTimeout(enhanceSlideAnimation, 500);
}

// Initialize special effects when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addSpecialEffects);
} else {
    addSpecialEffects();
}