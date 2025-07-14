// ==========================================
// MINIMAL CAROUSEL FUNCTIONALITY
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Carousel Elements
    const carousel = document.querySelector('.modern-carousel');
    const slidesContainer = document.querySelector('.carousel-slides');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    const loading = document.querySelector('.carousel-loading');
    const slideCounter = document.getElementById('slideCounter');
    const progressBar = document.getElementById('progressBar');
    const currentSlideSpan = slideCounter?.querySelector('.current-slide');
    const totalSlidesSpan = slideCounter?.querySelector('.total-slides');

    // Carousel State
    let currentSlide = 0;
    let totalSlides = slides.length;
    let isTransitioning = false;
    let autoplayInterval;
    let progressInterval;
    let progressStartTime = 0;
    const autoplayDuration = 5000; // 5 segundos por slide
    const progressUpdateInterval = 50; // Atualizar a cada 50ms para suavidade

    // Initialize carousel
    function initCarousel() {
        if (!carousel || totalSlides === 0) return;

        // Hide loading
        if (loading) {
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        }

        // Initialize counter
        if (currentSlideSpan && totalSlidesSpan) {
            totalSlidesSpan.textContent = totalSlides;
            updateSlideCounter();
        }

        // Set initial state
        updateSlidePosition();
        updateDots();
        updateActiveSlide();
        startAutoplay();

        // Add event listeners
        if (prevBtn) prevBtn.addEventListener('click', () => {
            stopAutoplay();
            previousSlide();
            setTimeout(startAutoplay, 500); // Pequeno delay antes de reiniciar
        });
        if (nextBtn) nextBtn.addEventListener('click', () => {
            stopAutoplay();
            nextSlide();
            setTimeout(startAutoplay, 500); // Pequeno delay antes de reiniciar
        });

        // Dots navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoplay();
                goToSlide(index);
                setTimeout(startAutoplay, 500); // Pequeno delay antes de reiniciar
            });
        });

        // Progress bar click navigation
        if (progressBar && progressBar.parentElement) {
            progressBar.parentElement.addEventListener('click', (e) => {
                const rect = progressBar.parentElement.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickPercent = (clickX / rect.width) * 100;
                const targetSlide = Math.floor((clickPercent / 100) * totalSlides);
                
                if (targetSlide >= 0 && targetSlide < totalSlides && targetSlide !== currentSlide) {
                    stopAutoplay();
                    goToSlide(targetSlide);
                    setTimeout(startAutoplay, 500);
                }
            });
        }

        // Touch support
        addTouchSupport();

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);

        // Pause autoplay on hover
        carousel.addEventListener('mouseenter', () => {
            stopAutoplay();
            if (progressBar && progressBar.parentElement) {
                progressBar.parentElement.classList.add('paused');
            }
        });
        carousel.addEventListener('mouseleave', () => {
            if (progressBar && progressBar.parentElement) {
                progressBar.parentElement.classList.remove('paused');
            }
            startAutoplay();
        });
    }

    // Go to specific slide
    function goToSlide(slideIndex) {
        if (isTransitioning || slideIndex === currentSlide) return;

        isTransitioning = true;
        currentSlide = slideIndex;

        updateSlidePosition();
        updateDots();
        updateActiveSlide();
        updateSlideCounter();
        resetProgressToCurrentSlide();

        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    }

    // Update slide counter
    function updateSlideCounter() {
        if (currentSlideSpan) {
            currentSlideSpan.textContent = currentSlide + 1;
        }
    }

    // Update progress bar com animação em tempo real
    function updateProgressBar() {
        if (!progressBar || !isAutoplayActive()) return;
        
        const elapsed = Date.now() - progressStartTime;
        const progress = Math.min((elapsed / autoplayDuration) * 100, 100);
        
        progressBar.style.transition = 'none';
        progressBar.style.width = `${progress}%`;
        
        // Se chegou a 100%, o slide mudará automaticamente
        if (progress >= 100) {
            stopProgressAnimation();
        }
    }

    // Iniciar animação da barra de progresso
    function startProgressAnimation() {
        if (!progressBar) return;
        
        progressStartTime = Date.now();
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        
        // Atualizar a barra em tempo real
        progressInterval = setInterval(updateProgressBar, progressUpdateInterval);
    }

    // Parar animação da barra de progresso
    function stopProgressAnimation() {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }

    // Reset progress bar para o slide atual
    function resetProgressToCurrentSlide() {
        if (!progressBar) return;
        
        stopProgressAnimation();
        progressBar.style.transition = 'width 0.3s ease';
        progressBar.style.width = '0%';
        
        // Iniciar nova animação após um pequeno delay
        setTimeout(() => {
            if (isAutoplayActive()) {
                startProgressAnimation();
            }
        }, 100);
    }

    // Next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % totalSlides;
        goToSlide(nextIndex);
    }

    // Previous slide
    function previousSlide() {
        const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prevIndex);
    }

    // Update slide position
    function updateSlidePosition() {
        if (!slidesContainer) return;
        const translateX = -currentSlide * (100 / totalSlides);
        slidesContainer.style.transform = `translateX(${translateX}%)`;
    }

    // Update active slide class
    function updateActiveSlide() {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
    }

    // Update dots
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Touch support
    function addTouchSupport() {
        let startX = 0;
        let endX = 0;
        let startY = 0;
        let endY = 0;
        let startTime = 0;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
            stopAutoplay();
        }, { passive: true });

        carousel.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
            endY = e.touches[0].clientY;
        }, { passive: true });

        carousel.addEventListener('touchend', () => {
            const deltaX = startX - endX;
            const deltaY = startY - endY;
            const deltaTime = Date.now() - startTime;

            // Verificar se é um swipe válido (não muito lento, horizontal)
            if (Math.abs(deltaX) > Math.abs(deltaY) && 
                Math.abs(deltaX) > 30 && 
                deltaTime < 500) {
                
                if (deltaX > 0) {
                    nextSlide();
                } else {
                    previousSlide();
                }
            }

            // Restart autoplay após um delay
            const restartDelay = window.innerWidth <= 768 ? 1500 : 1000;
            setTimeout(startAutoplay, restartDelay);
        }, { passive: true });

        // Prevenir zoom não intencional
        carousel.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // Keyboard navigation
    function handleKeyboard(e) {
        if (!carousel.matches(':hover')) return;

        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                stopAutoplay();
                previousSlide();
                setTimeout(startAutoplay, 500);
                break;
            case 'ArrowRight':
                e.preventDefault();
                stopAutoplay();
                nextSlide();
                setTimeout(startAutoplay, 500);
                break;
            case ' ':
                e.preventDefault();
                if (isAutoplayActive()) {
                    stopAutoplay();
                } else {
                    startAutoplay();
                }
                break;
        }
    }

    // Autoplay functions
    function startAutoplay() {
        if (autoplayInterval) return;
        
        // Start the autoplay interval
        autoplayInterval = setInterval(() => {
            nextSlide();
        }, autoplayDuration);
        
        // Start progress bar animation
        startProgressAnimation();
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
        
        // Stop progress bar animation
        stopProgressAnimation();
        
        // Manter a barra no estado atual
        if (progressBar) {
            progressBar.style.transition = 'width 0.3s ease';
        }
    }

    function isAutoplayActive() {
        return autoplayInterval !== null;
    }

    // Initialize
    initCarousel();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        stopAutoplay();
        stopProgressAnimation();
        document.removeEventListener('keydown', handleKeyboard);
    });

    // Responsive handling
    function handleResize() {
        updateSlidePosition();
        
        // Ajustar autoplay baseado no tamanho da tela
        const isMobile = window.innerWidth <= 768;
        const newDuration = isMobile ? 6000 : 5000; // Mais tempo em mobile
        
        if (isAutoplayActive() && autoplayDuration !== newDuration) {
            stopAutoplay();
            setTimeout(() => {
                startAutoplay();
            }, 200);
        }
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 150);
    });

    // Detectar orientação em dispositivos móveis
    window.addEventListener('orientationchange', () => {
        setTimeout(handleResize, 200);
    });

    // Melhorar performance em dispositivos móveis
    function optimizeForMobile() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Reduzir animações em mobile
            slides.forEach(slide => {
                const img = slide.querySelector('img');
                if (img) {
                    img.style.transition = 'none';
                }
            });
        }
    }

    // Executar otimização inicial
    optimizeForMobile();

    // Public API
    window.MinimalCarousel = {
        next: nextSlide,
        prev: previousSlide,
        goTo: goToSlide,
        play: startAutoplay,
        pause: stopAutoplay,
        getCurrentSlide: () => currentSlide,
        getTotalSlides: () => totalSlides
    };
});
