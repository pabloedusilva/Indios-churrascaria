// Churrasquinho da Hora - Sistema de Pedidos
// Desenvolvido com HTML, CSS e JavaScript

// Estado da aplicação
let cart = [];
let totalPrice = 0;

// Elementos do DOM
const cartIcon = document.getElementById('cartIcon');
const cartCount = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const closeCart = document.getElementById('closeCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const modalOverlay = document.getElementById('modalOverlay');
const checkoutModal = document.getElementById('checkoutModal');
const closeModal = document.getElementById('closeModal');
const cancelOrder = document.getElementById('cancelOrder');
const confirmOrder = document.getElementById('confirmOrder');
const toastContainer = document.getElementById('toastContainer');

// Loader
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }
    }, 1000);
});

// Smooth scrolling para links internos
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

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
    
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    
    // Prevent body scroll when menu is open
    if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// Close mobile menu when clicking on a link
navLinks?.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = 'auto';
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks?.contains(e.target) && !mobileMenuBtn?.contains(e.target)) {
        navLinks?.classList.remove('active');
        mobileMenuBtn?.classList.remove('active');
        mobileMenuBtn?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = 'auto';
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks?.classList.remove('active');
        mobileMenuBtn?.classList.remove('active');
        mobileMenuBtn?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = 'auto';
    }
});

// Menu filters
const filterBtns = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        menuItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                item.classList.add('animate-in');
            } else {
                item.style.display = 'none';
                item.classList.remove('animate-in');
            }
        });
    });
});

// Back to top button
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn?.classList.add('show');
    } else {
        backToTopBtn?.classList.remove('show');
    }
});

backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Newsletter form removido

// Cart functionality
function updateCartDisplay() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    cartTotal.textContent = totalPrice.toFixed(2);
    
    // Update cart items display
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        return;
    }
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>R$ ${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });
}

function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price: parseFloat(price),
            image,
            quantity: 1
        });
    }
    
    totalPrice += parseFloat(price);
    updateCartDisplay();
    
    // Animation for cart icon
    cartIcon.classList.add('bounce');
    setTimeout(() => cartIcon.classList.remove('bounce'), 500);
    
    showToast(`${name} adicionado ao carrinho!`, 'success');
}

function updateQuantity(index, change) {
    const item = cart[index];
    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
        removeFromCart(index);
        return;
    }
    
    totalPrice += item.price * change;
    item.quantity = newQuantity;
    updateCartDisplay();
}

function removeFromCart(index) {
    const item = cart[index];
    totalPrice -= item.price * item.quantity;
    cart.splice(index, 1);
    updateCartDisplay();
    
    showToast(`${item.name} removido do carrinho!`, 'info');
}

function clearCart() {
    cart = [];
    totalPrice = 0;
    updateCartDisplay();
}

// Cart sidebar toggle
cartIcon?.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeCart?.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
});

cartOverlay?.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Checkout modal
checkoutBtn?.addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Seu carrinho está vazio!', 'warning');
        return;
    }
    
    // Close cart sidebar
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    
    // Open checkout modal
    modalOverlay.classList.add('active');
    checkoutModal.classList.add('active');
    
    // Update order summary
    updateOrderSummary();
});

closeModal?.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    checkoutModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

cancelOrder?.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    checkoutModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        checkoutModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

function updateOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    const orderTotal = document.getElementById('orderTotal');
    
    orderSummary.innerHTML = '';
    
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <span>${item.quantity}x ${item.name}</span>
            <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
        `;
        orderSummary.appendChild(orderItem);
    });
    
    orderTotal.textContent = totalPrice.toFixed(2);
}

// Order confirmation
confirmOrder?.addEventListener('click', (e) => {
    e.preventDefault();
    
    const customerName = document.getElementById('customerName').value;
    const tableNumber = document.getElementById('tableNumber').value;
    const observations = document.getElementById('observations').value;
    
    if (!customerName || !tableNumber) {
        showToast('Por favor, preencha todos os campos obrigatórios!', 'warning');
        return;
    }
    
    // Create order object
    const order = {
        id: Date.now(),
        customer: customerName,
        table: tableNumber,
        observations: observations,
        items: [...cart],
        total: totalPrice,
        timestamp: new Date().toLocaleString('pt-BR')
    };
    
    // Show order confirmation for waiter
    showOrderConfirmation(order);
    
    // Clear cart and close modal
    clearCart();
    modalOverlay.classList.remove('active');
    checkoutModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('checkoutForm').reset();
    
    showToast('Pedido confirmado! O garçom foi notificado.', 'success');
});

function showOrderConfirmation(order) {
    // Create order confirmation modal for waiter
    const orderModal = document.createElement('div');
    orderModal.className = 'order-confirmation-modal';
    orderModal.innerHTML = `
        <div class="order-confirmation-content">
            <div class="order-header">
                <h2><i class="fas fa-utensils"></i> NOVO PEDIDO</h2>
                <p class="order-id">Pedido #${order.id}</p>
            </div>
            <div class="order-details">
                <div class="customer-info">
                    <h3><i class="fas fa-clipboard-list"></i> Informações do Cliente</h3>
                    <p><strong>Nome:</strong> ${order.customer}</p>
                    <p><strong>Mesa:</strong> ${order.table}</p>
                    <p><strong>Horário:</strong> ${order.timestamp}</p>
                    ${order.observations ? `<p><strong>Observações:</strong> ${order.observations}</p>` : ''}
                </div>
                <div class="order-items">
                    <h3><i class="fas fa-hamburger"></i> Itens do Pedido</h3>
                    <div class="items-list">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <span class="item-quantity">${item.quantity}x</span>
                                <span class="item-name">${item.name}</span>
                                <span class="item-price">R$ ${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-total">
                        <strong><i class="fas fa-dollar-sign"></i> Total: R$ ${order.total.toFixed(2)}</strong>
                    </div>
                </div>
            </div>
            <div class="order-actions">
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-check"></i> Pedido Anotado
                </button>
                <button class="btn btn-secondary" onclick="window.print()">
                    <i class="fas fa-print"></i> Imprimir
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(orderModal);
    
    // Auto-remove after 30 seconds
    setTimeout(() => {
        if (orderModal.parentNode) {
            orderModal.remove();
        }
    }, 30000);
}

// Add to cart event listeners
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        const menuItem = e.target.closest('.menu-item');
        const name = menuItem.querySelector('h3').textContent;
        const priceText = menuItem.querySelector('.menu-item-price').textContent;
        const price = priceText.replace('R$ ', '').replace(',', '.');
        const image = menuItem.querySelector('img').src;
        
        addToCart(name, price, image);
    }
});

// Toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = {
        success: '<i class="fas fa-check-circle"></i>',
        error: '<i class="fas fa-times-circle"></i>',
        warning: '<i class="fas fa-exclamation-triangle"></i>',
        info: '<i class="fas fa-info-circle"></i>'
    }[type];
    
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Particles animation
function createParticles() {
    const particlesContainer = document.getElementById('particles-js');
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Initialize particles
createParticles();

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe menu items for animations
document.querySelectorAll('.menu-item').forEach(item => {
    observer.observe(item);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open modals or sidebars
        cartSidebar?.classList.remove('active');
        cartOverlay?.classList.remove('active');
        modalOverlay?.classList.remove('active');
        checkoutModal?.classList.remove('active');
        navLinks?.classList.remove('active');
        mobileMenuBtn?.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
    
    // Listen for service worker messages
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
            showToast('Nova versão disponível! Recarregue a página.', 'info');
        }
    });
}

// Install prompt for PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button
    showInstallPrompt();
});

function showInstallPrompt() {
    const installButton = document.createElement('button');
    installButton.textContent = 'Instalar App';
    installButton.className = 'btn btn-primary install-btn';
    installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    installButton.addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
        installButton.remove();
    });
    
    document.body.appendChild(installButton);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (installButton.parentNode) {
            installButton.remove();
        }
    }, 10000);
}

// Handle app install
window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    showToast('App instalado! Agora você pode usar offline.', 'success');
});

// Performance optimization
window.addEventListener('load', () => {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    showToast('Ops! Algo deu errado. Tente novamente.', 'error');
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    
    // Add focus trap for modal
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    const modal = document.querySelector('.modal');
    const firstFocusableElement = modal?.querySelectorAll(focusableElements)[0];
    const focusableContent = modal?.querySelectorAll(focusableElements);
    const lastFocusableElement = focusableContent?.[focusableContent.length - 1];
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && modalOverlay.classList.contains('active')) {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement?.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement?.focus();
                    e.preventDefault();
                }
            }
        }
    });
});

// Enhanced mobile menu handling
function handleMobileMenu() {
    // Add touch gestures for mobile menu
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Swipe from left to right to open menu
        if (deltaX > 50 && Math.abs(deltaY) < 50 && touchStartX < 50) {
            navLinks?.classList.add('active');
            mobileMenuBtn?.classList.add('active');
        }
        
        // Swipe from right to left to close menu
        if (deltaX < -50 && Math.abs(deltaY) < 50 && navLinks?.classList.contains('active')) {
            navLinks?.classList.remove('active');
            mobileMenuBtn?.classList.remove('active');
        }
    }, { passive: true });
}

// Initialize mobile menu handling
handleMobileMenu();

// Enhanced cart functionality for mobile
function optimizeForMobile() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Add swipe gestures for cart
        let cartStartX = 0;
        
        cartSidebar?.addEventListener('touchstart', (e) => {
            cartStartX = e.touches[0].clientX;
        }, { passive: true });
        
        cartSidebar?.addEventListener('touchend', (e) => {
            const cartEndX = e.changedTouches[0].clientX;
            const deltaX = cartEndX - cartStartX;
            
            // Swipe right to close cart
            if (deltaX > 100) {
                cartSidebar.classList.remove('active');
                cartOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }, { passive: true });
        
        // Optimize button sizes for touch
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.style.minHeight = '44px';
            btn.style.minWidth = '44px';
        });
    }
}

// Run mobile optimizations
optimizeForMobile();

// Re-run optimizations on window resize
window.addEventListener('resize', () => {
    optimizeForMobile();
});

// Enhanced scroll behavior for mobile
let lastScrollY = 0;
let ticking = false;

function updateScrollBehavior() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        document.getElementById('header')?.classList.add('hide-header');
    } else {
        // Scrolling up
        document.getElementById('header')?.classList.remove('hide-header');
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollBehavior);
        ticking = true;
    }
}, { passive: true });

// Enhanced form validation for mobile - removido

// Enhanced accessibility for mobile
function enhanceAccessibility() {
    // Add ARIA labels for screen readers
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(btn => {
        if (btn.textContent.trim()) {
            btn.setAttribute('aria-label', btn.textContent.trim());
        }
    });
    
    // Add skip links
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Pular para o conteúdo principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        z-index: 1000;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Initialize accessibility enhancements
enhanceAccessibility();

// Performance optimization for mobile
function optimizePerformance() {
    // Prefetch important resources
    const links = [
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    links.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
    });
    
    // Optimize images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
        img.decoding = 'async';
    });
}

// Initialize performance optimizations
optimizePerformance();

// Enhanced error handling for mobile
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    
    // Show user-friendly error message
    showToast('Ops! Algo deu errado. Tente novamente.', 'error');
    
    // Log error for debugging
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': e.error.message,
            'fatal': false
        });
    }
});

// Add offline support detection
window.addEventListener('online', () => {
    showToast('Conexão restabelecida!', 'success');
});

window.addEventListener('offline', () => {
    showToast('Você está offline. Algumas funcionalidades podem não funcionar.', 'warning');
});

// Enhanced cart for mobile with better UX
function enhanceCartForMobile() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Add haptic feedback for supported devices
        const addHapticFeedback = () => {
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        };
        
        // Add haptic feedback to cart actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart, .quantity-btn, .remove-item')) {
                addHapticFeedback();
            }
        });
        
        // Optimize cart layout for mobile
        cartSidebar?.style.setProperty('width', '100%');
        cartSidebar?.style.setProperty('max-width', '100%');
    }
}

// Initialize enhanced cart for mobile
enhanceCartForMobile();

// =================
// GALLERY CAROUSEL FUNCTIONALITY
// =================

// Carousel state
let currentSlide = 0;
let totalSlides = 0;
let isAutoPlaying = true;
let autoPlayInterval;

// Carousel elements
const carouselTrack = document.getElementById('carouselTrack');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const carouselIndicators = document.getElementById('carouselIndicators');
const carouselThumbnails = document.getElementById('carouselThumbnails');
const carouselProgress = document.getElementById('carouselProgress');
const currentSlideNumber = document.getElementById('currentSlideNumber');
const totalSlidesNumber = document.getElementById('totalSlidesNumber');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeImageModal = document.getElementById('closeImageModal');

// Initialize carousel
function initCarousel() {
    if (!carouselTrack) return;
    
    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    totalSlides = slides.length;
    
    if (totalSlidesNumber) {
        totalSlidesNumber.textContent = totalSlides;
    }
    
    // Initialize indicators
    if (carouselIndicators) {
        const indicators = carouselIndicators.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToSlide(index));
        });
    }
    
    // Initialize thumbnails
    if (carouselThumbnails) {
        const thumbnails = carouselThumbnails.querySelectorAll('.carousel-thumbnail');
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => goToSlide(index));
        });
    }
    
    // Navigation buttons
    if (carouselPrev) {
        carouselPrev.addEventListener('click', prevSlide);
    }
    
    if (carouselNext) {
        carouselNext.addEventListener('click', nextSlide);
    }
    
    // Image modal functionality
    slides.forEach((slide, index) => {
        const img = slide.querySelector('img');
        if (img) {
            img.addEventListener('click', () => openImageModal(img.src, img.alt));
        }
    });
    
    // Close modal
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
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Touch/swipe support
    initTouchSupport();
    
    // Auto-play
    startAutoPlay();
    
    // Update display
    updateCarouselDisplay();
}

// Navigation functions
function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    
    currentSlide = index;
    updateCarouselDisplay();
    resetAutoPlay();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarouselDisplay();
    resetAutoPlay();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarouselDisplay();
    resetAutoPlay();
}

// Update carousel display
function updateCarouselDisplay() {
    if (!carouselTrack) return;
    
    // Move track
    const translateX = -currentSlide * 100;
    carouselTrack.style.transform = `translateX(${translateX}%)`;
    
    // Update indicators
    if (carouselIndicators) {
        const indicators = carouselIndicators.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Update thumbnails
    if (carouselThumbnails) {
        const thumbnails = carouselThumbnails.querySelectorAll('.carousel-thumbnail');
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Update slide number
    if (currentSlideNumber) {
        currentSlideNumber.textContent = currentSlide + 1;
    }
    
    // Update progress bar
    if (carouselProgress) {
        const progress = ((currentSlide + 1) / totalSlides) * 100;
        carouselProgress.style.width = `${progress}%`;
    }
    
    // Update slide states
    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
}

// Auto-play functionality
function startAutoPlay() {
    if (!isAutoPlaying) return;
    
    autoPlayInterval = setInterval(() => {
        nextSlide();
    }, 5000); // Change slide every 5 seconds
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

function resetAutoPlay() {
    stopAutoPlay();
    if (isAutoPlaying) {
        startAutoPlay();
    }
}

// Touch/swipe support
function initTouchSupport() {
    if (!carouselTrack) return;
    
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    
    carouselTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        stopAutoPlay();
    }, { passive: true });
    
    carouselTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
        
        // Prevent default scrolling if horizontal swipe
        const deltaX = Math.abs(currentX - startX);
        const deltaY = Math.abs(currentY - startY);
        
        if (deltaX > deltaY) {
            e.preventDefault();
        }
    }, { passive: false });
    
    carouselTrack.addEventListener('touchend', () => {
        if (!isDragging) return;
        
        const deltaX = currentX - startX;
        
        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
        
        isDragging = false;
        carouselTrack.style.cursor = 'grab';
        if (isAutoPlaying) {
            startAutoPlay();
        }
    });
    
    carouselTrack.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            carouselTrack.style.cursor = 'grab';
            if (isAutoPlaying) {
                startAutoPlay();
            }
        }
    });
}

// Keyboard navigation
function handleKeyboardNavigation(e) {
    if (!carouselTrack) return;
    
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            prevSlide();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextSlide();
            break;
        case 'Escape':
            closeModal();
            break;
    }
}

// Image modal functionality
function openImageModal(src, alt) {
    if (!imageModal || !modalImage) return;
    
    modalImage.src = src;
    modalImage.alt = alt;
    imageModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Stop auto-play when modal is open
    stopAutoPlay();
}

function closeModal() {
    if (!imageModal) return;
    
    imageModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Resume auto-play when modal is closed
    if (isAutoPlaying) {
        startAutoPlay();
    }
}

// Pause auto-play when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoPlay();
    } else if (isAutoPlaying) {
        startAutoPlay();
    }
});

// Pause auto-play on hover
if (carouselTrack) {
    carouselTrack.addEventListener('mouseenter', stopAutoPlay);
    carouselTrack.addEventListener('mouseleave', () => {
        if (isAutoPlaying) {
            startAutoPlay();
        }
    });
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', initCarousel);

// =================
// ENHANCED CAROUSEL FUNCTIONALITY
// =================

// Enhanced carousel state
let carouselState = {
    currentSlide: 0,
    totalSlides: 0,
    isAutoPlaying: true,
    autoPlayInterval: null,
    autoPlayDuration: 5000,
    isPaused: false,
    isTransitioning: false,
    touchStartX: 0,
    touchStartY: 0,
    touchEndX: 0,
    touchEndY: 0,
    swipeThreshold: 50,
    isZoomed: false,
    zoomLevel: 1,
    maxZoomLevel: 3,
    preloadedImages: new Set(),
    viewHistory: [],
    favorites: new Set(),
    playbackSpeed: 1
};

// Enhanced carousel initialization
function initEnhancedCarousel() {
    if (!carouselTrack) return;
    
    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    carouselState.totalSlides = slides.length;
    
    // Initialize all carousel features
    setupCarouselNavigation();
    setupAutoPlayFeatures();
    setupGestureControls();
    setupKeyboardShortcuts();
    setupImagePreloading();
    setupCarouselAnalytics();
    setupFullscreenSupport();
    setupCarouselSync();
    setupAccessibilityFeatures();
    
    // Initial update
    updateEnhancedCarouselDisplay();
    
    console.log('Enhanced carousel initialized with', carouselState.totalSlides, 'slides');
}

// Enhanced navigation with smooth transitions
function setupCarouselNavigation() {
    // Enhanced previous/next functions
    window.goToSlideEnhanced = function(index, options = {}) {
        if (carouselState.isTransitioning) return;
        if (index < 0 || index >= carouselState.totalSlides) return;
        
        const { animate = true, addToHistory = true, trigger = 'manual' } = options;
        
        // Add to view history
        if (addToHistory) {
            carouselState.viewHistory.push({
                slide: carouselState.currentSlide,
                timestamp: Date.now(),
                trigger: trigger
            });
        }
        
        carouselState.isTransitioning = true;
        carouselState.currentSlide = index;
        
        if (animate) {
            // Smooth transition with easing
            const duration = 600;
            const startTime = performance.now();
            
            const animateSlide = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Custom easing function (ease-out-cubic)
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                updateEnhancedCarouselDisplay(easeProgress);
                
                if (progress < 1) {
                    requestAnimationFrame(animateSlide);
                } else {
                    carouselState.isTransitioning = false;
                    onSlideChangeComplete();
                }
            };
            
            requestAnimationFrame(animateSlide);
        } else {
            updateEnhancedCarouselDisplay();
            carouselState.isTransitioning = false;
            onSlideChangeComplete();
        }
        
        resetEnhancedAutoPlay();
    };
    
    // Enhanced next/previous with loop options
    window.nextSlideEnhanced = function(options = {}) {
        const { loop = true } = options;
        let nextIndex = carouselState.currentSlide + 1;
        
        if (nextIndex >= carouselState.totalSlides) {
            nextIndex = loop ? 0 : carouselState.totalSlides - 1;
        }
        
        goToSlideEnhanced(nextIndex, { ...options, trigger: 'next' });
    };
    
    window.prevSlideEnhanced = function(options = {}) {
        const { loop = true } = options;
        let prevIndex = carouselState.currentSlide - 1;
        
        if (prevIndex < 0) {
            prevIndex = loop ? carouselState.totalSlides - 1 : 0;
        }
        
        goToSlideEnhanced(prevIndex, { ...options, trigger: 'prev' });
    };
}

// Enhanced auto-play with intelligent pausing
function setupAutoPlayFeatures() {
    // Smart auto-play that pauses on user interaction
    window.startEnhancedAutoPlay = function() {
        if (!carouselState.isAutoPlaying || carouselState.isPaused) return;
        
        carouselState.autoPlayInterval = setInterval(() => {
            if (!carouselState.isPaused && !carouselState.isTransitioning) {
                nextSlideEnhanced({ trigger: 'autoplay' });
            }
        }, carouselState.autoPlayDuration);
    };
    
    window.stopEnhancedAutoPlay = function() {
        if (carouselState.autoPlayInterval) {
            clearInterval(carouselState.autoPlayInterval);
            carouselState.autoPlayInterval = null;
        }
    };
    
    window.resetEnhancedAutoPlay = function() {
        stopEnhancedAutoPlay();
        if (carouselState.isAutoPlaying) {
            startEnhancedAutoPlay();
        }
    };
    
    // Pause on hover
    carouselTrack?.addEventListener('mouseenter', () => {
        carouselState.isPaused = true;
        stopEnhancedAutoPlay();
    });
    
    carouselTrack?.addEventListener('mouseleave', () => {
        carouselState.isPaused = false;
        startEnhancedAutoPlay();
    });
    
    // Pause when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            carouselState.isPaused = true;
            stopEnhancedAutoPlay();
        } else {
            carouselState.isPaused = false;
            startEnhancedAutoPlay();
        }
    });
    
    // Variable speed control
    window.setAutoPlaySpeed = function(speed) {
        carouselState.playbackSpeed = speed;
        carouselState.autoPlayDuration = 5000 / speed;
        resetEnhancedAutoPlay();
    };
    
    startEnhancedAutoPlay();
}

// Enhanced gesture controls with multi-touch support
function setupGestureControls() {
    let gestureState = {
        isGesturing: false,
        startDistance: 0,
        currentDistance: 0,
        lastGestureTime: 0,
        gestureVelocity: 0
    };
    
    // Touch events for swipe and pinch
    carouselTrack?.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        carouselState.touchStartX = touch.clientX;
        carouselState.touchStartY = touch.clientY;
        gestureState.isGesturing = true;
        gestureState.lastGestureTime = Date.now();
        
        // Multi-touch for zoom
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            gestureState.startDistance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) + 
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );
        }
        
        carouselState.isPaused = true;
    }, { passive: false });
    
    carouselTrack?.addEventListener('touchmove', (e) => {
        if (!gestureState.isGesturing) return;
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - carouselState.touchStartX;
        const deltaY = touch.clientY - carouselState.touchStartY;
        
        // Calculate gesture velocity
        const currentTime = Date.now();
        const timeDelta = currentTime - gestureState.lastGestureTime;
        gestureState.gestureVelocity = Math.abs(deltaX) / timeDelta;
        
        // Pinch to zoom
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            gestureState.currentDistance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) + 
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );
            
            const scale = gestureState.currentDistance / gestureState.startDistance;
            handlePinchZoom(scale);
            e.preventDefault();
        }
        
        // Prevent vertical scrolling during horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            e.preventDefault();
        }
        
        gestureState.lastGestureTime = currentTime;
    }, { passive: false });
    
    carouselTrack?.addEventListener('touchend', (e) => {
        if (!gestureState.isGesturing) return;
        
        const touch = e.changedTouches[0];
        carouselState.touchEndX = touch.clientX;
        carouselState.touchEndY = touch.clientY;
        
        handleSwipeGesture();
        
        gestureState.isGesturing = false;
        carouselState.isPaused = false;
        startEnhancedAutoPlay();
    }, { passive: true });
    
    // Handle swipe with velocity consideration
    function handleSwipeGesture() {
        const deltaX = carouselState.touchEndX - carouselState.touchStartX;
        const deltaY = carouselState.touchEndY - carouselState.touchStartY;
        
        // Check if it's a horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > carouselState.swipeThreshold) {
            // Consider velocity for more responsive swiping
            const velocityMultiplier = Math.min(gestureState.gestureVelocity * 0.1, 2);
            
            if (deltaX > 0) {
                prevSlideEnhanced({ trigger: 'swipe', velocity: velocityMultiplier });
            } else {
                nextSlideEnhanced({ trigger: 'swipe', velocity: velocityMultiplier });
            }
        }
    }
    
    // Pinch to zoom functionality
    function handlePinchZoom(scale) {
        if (scale > 1.1 && !carouselState.isZoomed) {
            zoomInCurrentSlide();
        } else if (scale < 0.9 && carouselState.isZoomed) {
            zoomOutCurrentSlide();
        }
    }
}

// Enhanced keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Don't interfere with form inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                prevSlideEnhanced({ trigger: 'keyboard' });
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextSlideEnhanced({ trigger: 'keyboard' });
                break;
            case 'Home':
                e.preventDefault();
                goToSlideEnhanced(0, { trigger: 'keyboard' });
                break;
            case 'End':
                e.preventDefault();
                goToSlideEnhanced(carouselState.totalSlides - 1, { trigger: 'keyboard' });
                break;
            case ' ':
                e.preventDefault();
                toggleAutoPlay();
                break;
            case 'f':
                e.preventDefault();
                toggleFullscreen();
                break;
            case 'r':
                e.preventDefault();
                randomSlide();
                break;
            case '+':
                e.preventDefault();
                zoomInCurrentSlide();
                break;
            case '-':
                e.preventDefault();
                zoomOutCurrentSlide();
                break;
            case 'Escape':
                e.preventDefault();
                exitFullscreen();
                if (carouselState.isZoomed) {
                    zoomOutCurrentSlide();
                }
                break;
            case 'h':
                e.preventDefault();
                addToFavorites();
                break;
            case 'i':
                e.preventDefault();
                showSlideInfo();
                break;
        }
    });
}

// Image preloading for better performance
function setupImagePreloading() {
    const slides = carouselTrack.querySelectorAll('.carousel-slide img');
    
    // Preload next and previous images
    function preloadAdjacentImages() {
        const nextIndex = (carouselState.currentSlide + 1) % carouselState.totalSlides;
        const prevIndex = (carouselState.currentSlide - 1 + carouselState.totalSlides) % carouselState.totalSlides;
        
        [nextIndex, prevIndex].forEach(index => {
            if (!carouselState.preloadedImages.has(index)) {
                const img = slides[index];
                if (img && img.dataset.src) {
                    img.src = img.dataset.src;
                    carouselState.preloadedImages.add(index);
                }
            }
        });
    }
    
    // Preload current slide
    const currentImg = slides[carouselState.currentSlide];
    if (currentImg && !carouselState.preloadedImages.has(carouselState.currentSlide)) {
        carouselState.preloadedImages.add(carouselState.currentSlide);
        preloadAdjacentImages();
    }
    
    // Preload on slide change
    window.addEventListener('slideChanged', preloadAdjacentImages);
}

// Analytics and tracking
function setupCarouselAnalytics() {
    let analytics = {
        totalViews: 0,
        slideViews: new Array(carouselState.totalSlides).fill(0),
        avgTimePerSlide: 0,
        interactionCount: 0,
        lastViewTime: Date.now()
    };
    
    function trackSlideView(slideIndex, trigger) {
        analytics.totalViews++;
        analytics.slideViews[slideIndex]++;
        
        // Track time spent on previous slide
        const currentTime = Date.now();
        const timeSpent = currentTime - analytics.lastViewTime;
        analytics.avgTimePerSlide = (analytics.avgTimePerSlide + timeSpent) / 2;
        analytics.lastViewTime = currentTime;
        
        // Track interaction type
        if (trigger !== 'autoplay') {
            analytics.interactionCount++;
        }
        
        // Dispatch custom event for external tracking
        window.dispatchEvent(new CustomEvent('carouselAnalytics', {
            detail: {
                slideIndex,
                trigger,
                timeSpent,
                analytics: { ...analytics }
            }
        }));
    }
    
    window.addEventListener('slideChanged', (e) => {
        trackSlideView(e.detail.slideIndex, e.detail.trigger);
    });
    
    // Expose analytics
    window.getCarouselAnalytics = () => ({ ...analytics });
}

// Fullscreen support
function setupFullscreenSupport() {
    window.toggleFullscreen = function() {
        if (!document.fullscreenElement) {
            carouselTrack.requestFullscreen?.() ||
            carouselTrack.webkitRequestFullscreen?.() ||
            carouselTrack.msRequestFullscreen?.();
        } else {
            exitFullscreen();
        }
    };
    
    window.exitFullscreen = function() {
        document.exitFullscreen?.() ||
        document.webkitExitFullscreen?.() ||
        document.msExitFullscreen?.();
    };
    
    document.addEventListener('fullscreenchange', () => {
        carouselTrack?.classList.toggle('fullscreen', !!document.fullscreenElement);
    });
}

// Zoom functionality
function zoomInCurrentSlide() {
    if (carouselState.zoomLevel >= carouselState.maxZoomLevel) return;
    
    carouselState.zoomLevel = Math.min(carouselState.zoomLevel * 1.5, carouselState.maxZoomLevel);
    carouselState.isZoomed = carouselState.zoomLevel > 1;
    
    const currentSlide = carouselTrack.querySelector('.carousel-slide.active img');
    if (currentSlide) {
        currentSlide.style.transform = `scale(${carouselState.zoomLevel})`;
        currentSlide.style.cursor = carouselState.isZoomed ? 'zoom-out' : 'zoom-in';
    }
}

function zoomOutCurrentSlide() {
    carouselState.zoomLevel = Math.max(carouselState.zoomLevel / 1.5, 1);
    carouselState.isZoomed = carouselState.zoomLevel > 1;
    
    const currentSlide = carouselTrack.querySelector('.carousel-slide.active img');
    if (currentSlide) {
        currentSlide.style.transform = carouselState.zoomLevel > 1 ? `scale(${carouselState.zoomLevel})` : '';
        currentSlide.style.cursor = carouselState.isZoomed ? 'zoom-out' : 'zoom-in';
    }
}

// Additional utility functions
function toggleAutoPlay() {
    carouselState.isAutoPlaying = !carouselState.isAutoPlaying;
    
    if (carouselState.isAutoPlaying) {
        startEnhancedAutoPlay();
    } else {
        stopEnhancedAutoPlay();
    }
    
    // Visual feedback
    showToast(carouselState.isAutoPlaying ? 'Auto-play ativado' : 'Auto-play pausado', 'info');
}

function randomSlide() {
    const randomIndex = Math.floor(Math.random() * carouselState.totalSlides);
    goToSlideEnhanced(randomIndex, { trigger: 'random' });
}

function addToFavorites() {
    const currentSlide = carouselState.currentSlide;
    
    if (carouselState.favorites.has(currentSlide)) {
        carouselState.favorites.delete(currentSlide);
        showToast('Removido dos favoritos', 'info');
    } else {
        carouselState.favorites.add(currentSlide);
        showToast('Adicionado aos favoritos', 'success');
    }
    
    // Update UI if needed
    updateFavoritesDisplay();
}

function showSlideInfo() {
    const currentSlide = carouselTrack.querySelector('.carousel-slide.active');
    const slideInfo = currentSlide?.querySelector('.slide-info');
    
    if (slideInfo) {
        // Toggle slide info visibility
        slideInfo.style.opacity = slideInfo.style.opacity === '1' ? '0' : '1';
        slideInfo.style.transform = slideInfo.style.opacity === '1' ? 'translateY(0)' : 'translateY(20px)';
    }
}

function updateFavoritesDisplay() {
    const thumbnails = carouselThumbnails?.querySelectorAll('.carousel-thumbnail');
    thumbnails?.forEach((thumb, index) => {
        thumb.classList.toggle('favorite', carouselState.favorites.has(index));
    });
}

// Enhanced carousel display update
function updateEnhancedCarouselDisplay(progress = 1) {
    if (!carouselTrack) return;
    
    // Smooth transform with progress
    const translateX = -carouselState.currentSlide * 100;
    carouselTrack.style.transform = `translateX(${translateX}%)`;
    
    // Update all UI elements
    updateIndicators();
    updateThumbnails();
    updateSlideCounter();
    updateProgressBar();
    updateSlideStates();
    
    // Dispatch slide change event
    if (progress >= 1) {
        window.dispatchEvent(new CustomEvent('slideChanged', {
            detail: {
                slideIndex: carouselState.currentSlide,
                trigger: 'display-update'
            }
        }));
    }
}

function updateIndicators() {
    const indicators = carouselIndicators?.querySelectorAll('.indicator');
    indicators?.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === carouselState.currentSlide);
    });
}

function updateThumbnails() {
    const thumbnails = carouselThumbnails?.querySelectorAll('.carousel-thumbnail');
    thumbnails?.forEach((thumbnail, index) => {
        thumbnail.classList.toggle('active', index === carouselState.currentSlide);
    });
}

function updateSlideCounter() {
    if (currentSlideNumber) {
        currentSlideNumber.textContent = carouselState.currentSlide + 1;
    }
}

function updateProgressBar() {
    if (carouselProgress) {
        const progress = ((carouselState.currentSlide + 1) / carouselState.totalSlides) * 100;
        carouselProgress.style.width = `${progress}%`;
    }
}

function updateSlideStates() {
    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === carouselState.currentSlide);
    });
}

function onSlideChangeComplete() {
    // Reset zoom when changing slides
    if (carouselState.isZoomed) {
        carouselState.zoomLevel = 1;
        carouselState.isZoomed = false;
        const currentSlide = carouselTrack.querySelector('.carousel-slide.active img');
        if (currentSlide) {
            currentSlide.style.transform = '';
            currentSlide.style.cursor = 'zoom-in';
        }
    }
    
    // Update favorites display
    updateFavoritesDisplay();
    
    // Trigger any callback functions
    if (window.onCarouselSlideChange) {
        window.onCarouselSlideChange(carouselState.currentSlide);
    }
}

// Carousel synchronization (for multiple carousels)
function setupCarouselSync() {
    window.syncCarousels = function(carousels) {
        carousels.forEach(carousel => {
            carousel.addEventListener('slideChanged', (e) => {
                carousels.forEach(otherCarousel => {
                    if (otherCarousel !== carousel) {
                        otherCarousel.goToSlide(e.detail.slideIndex);
                    }
                });
            });
        });
    };
}

// Enhanced accessibility
function setupAccessibilityFeatures() {
    // ARIA live region for screen readers
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
    
    // Announce slide changes
    window.addEventListener('slideChanged', (e) => {
        const slideIndex = e.detail.slideIndex;
        const currentSlide = carouselTrack.querySelector('.carousel-slide.active');
        const slideInfo = currentSlide?.querySelector('.slide-info h3')?.textContent || `Slide ${slideIndex + 1}`;
        
        liveRegion.textContent = `Visualizando ${slideInfo}, slide ${slideIndex + 1} de ${carouselState.totalSlides}`;
    });
    
    // Enhanced focus management
    carouselTrack.setAttribute('tabindex', '0');
    carouselTrack.setAttribute('role', 'region');
    carouselTrack.setAttribute('aria-label', 'Galeria de imagens');
    
    // Focus indicators
    const indicators = carouselIndicators?.querySelectorAll('.indicator');
    indicators?.forEach((indicator, index) => {
        indicator.setAttribute('tabindex', '0');
        indicator.setAttribute('role', 'button');
        indicator.setAttribute('aria-label', `Ir para slide ${index + 1}`);
    });
}

// =================
// VISUAL CONTROL PANEL
// =================

// Create control panel for carousel
function createCarouselControlPanel() {
    const controlPanel = document.createElement('div');
    controlPanel.className = 'carousel-control-panel';
    controlPanel.innerHTML = `
        <div class="control-panel-header">
            <h4><i class="fas fa-cog"></i> Controles</h4>
            <button class="control-panel-toggle" id="toggleControlPanel">
                <i class="fas fa-chevron-up"></i>
            </button>
        </div>
        <div class="control-panel-content">
            <div class="control-group">
                <label>Reprodução</label>
                <div class="control-buttons">
                    <button class="control-btn" id="playPauseBtn" title="Reproduzir/Pausar">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="control-btn" id="shuffleBtn" title="Modo Aleatório">
                        <i class="fas fa-random"></i>
                    </button>
                    <button class="control-btn" id="voiceBtn" title="Controle por Voz">
                        <i class="fas fa-microphone"></i>
                    </button>
                </div>
            </div>
            
            <div class="control-group">
                <label>Velocidade: <span id="speedValue">1x</span></label>
                <input type="range" id="speedControl" min="0.5" max="3" step="0.1" value="1">
            </div>
            
            <div class="control-group">
                <label>Navegação</label>
                <div class="control-buttons">
                    <button class="control-btn" id="firstSlideBtn" title="Primeiro Slide">
                        <i class="fas fa-fast-backward"></i>
                    </button>
                    <button class="control-btn" id="randomSlideBtn" title="Slide Aleatório">
                        <i class="fas fa-dice"></i>
                    </button>
                    <button class="control-btn" id="lastSlideBtn" title="Último Slide">
                        <i class="fas fa-fast-forward"></i>
                    </button>
                </div>
            </div>
            
            <div class="control-group">
                <label>Efeitos</label>
                <div class="control-buttons">
                    <button class="control-btn" id="filterBtn" title="Filtros">
                        <i class="fas fa-palette"></i>
                    </button>
                    <button class="control-btn" id="fullscreenBtn" title="Tela Cheia">
                        <i class="fas fa-expand"></i>
                    </button>
                    <button class="control-btn" id="favoriteBtn" title="Favoritar">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
            
            <div class="control-group">
                <label>Transições</label>
                <select id="transitionSelect">
                    <option value="slide">Deslizar</option>
                    <option value="fade">Fade</option>
                    <option value="zoom">Zoom</option>
                    <option value="cube">Cubo</option>
                </select>
            </div>
            
            <div class="control-group">
                <label>Estatísticas</label>
                <div class="stats-display" id="statsDisplay">
                    <div class="stat-item">
                        <span>FPS: <span id="fpsValue">60</span></span>
                    </div>
                    <div class="stat-item">
                        <span>Slides vistos: <span id="slidesViewedValue">0</span></span>
                    </div>
                    <div class="stat-item">
                        <span>Favoritos: <span id="favoritesCountValue">0</span></span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add styles for control panel
    const style = document.createElement('style');
    style.textContent = `
        .carousel-control-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            border-radius: 12px;
            padding: 0;
            z-index: 1000;
            min-width: 280px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }
        
        .carousel-control-panel.collapsed .control-panel-content {
            display: none;
        }
        
        .control-panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .control-panel-header h4 {
            margin: 0;
            font-size: 1rem;
            color: white;
        }
        
        .control-panel-toggle {
            background: none;
            border: none;
            color: white;
            font-size: 1rem;
            cursor: pointer;
            padding: 5px;
            transition: transform 0.3s ease;
        }
        
        .carousel-control-panel.collapsed .control-panel-toggle i {
            transform: rotate(180deg);
        }
        
        .control-panel-content {
            padding: 15px;
        }
        
        .control-group {
            margin-bottom: 15px;
        }
        
        .control-group label {
            display: block;
            margin-bottom: 8px;
            font-size: 0.9rem;
            color: #ccc;
        }
        
        .control-buttons {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        
        .control-btn {
            background: var(--primary);
            border: none;
            color: white;
            padding: 10px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .control-btn:hover {
            background: var(--primary-dark);
            transform: translateY(-2px);
        }
        
        .control-btn.active {
            background: var(--secondary);
        }
        
        #speedControl {
            width: 100%;
            margin-top: 5px;
        }
        
        #transitionSelect {
            width: 100%;
            padding: 8px;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.1);
            color: white;
        }
        
        .stats-display {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .stat-item {
            font-size: 0.85rem;
            color: #ccc;
        }
        
        @media (max-width: 768px) {
            .carousel-control-panel {
                right: 10px;
                bottom: 10px;
                min-width: 250px;
            }
            
            .control-buttons {
                justify-content: center;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(controlPanel);
    
    // Setup control panel events
    setupControlPanelEvents();
    
    return controlPanel;
}

// Setup control panel event handlers
function setupControlPanelEvents() {
    // Toggle panel
    document.getElementById('toggleControlPanel')?.addEventListener('click', () => {
        const panel = document.querySelector('.carousel-control-panel');
        panel.classList.toggle('collapsed');
    });
    
    // Play/Pause
    document.getElementById('playPauseBtn')?.addEventListener('click', () => {
        toggleAutoPlay();
        updatePlayPauseButton();
    });
    
    // Shuffle
    document.getElementById('shuffleBtn')?.addEventListener('click', () => {
        const btn = document.getElementById('shuffleBtn');
        if (carouselState.shuffleMode) {
            MediaControls.disableShuffle();
            btn.classList.remove('active');
        } else {
            MediaControls.enableShuffle();
            btn.classList.add('active');
        }
    });
    
    // Voice control
    document.getElementById('voiceBtn')?.addEventListener('click', () => {
        const btn = document.getElementById('voiceBtn');
        if (VoiceControl.isListening) {
            VoiceControl.stopListening();
            btn.classList.remove('active');
        } else {
            VoiceControl.startListening();
            btn.classList.add('active');
        }
    });
    
    // Speed control
    document.getElementById('speedControl')?.addEventListener('input', (e) => {
        const speed = parseFloat(e.target.value);
        MediaControls.setPlaybackSpeed(speed);
        document.getElementById('speedValue').textContent = speed + 'x';
    });
    
    // Navigation buttons
    document.getElementById('firstSlideBtn')?.addEventListener('click', () => {
        goToSlideEnhanced(0, { trigger: 'control-panel' });
    });
    
    document.getElementById('randomSlideBtn')?.addEventListener('click', () => {
        randomSlide();
    });
    
    document.getElementById('lastSlideBtn')?.addEventListener('click', () => {
        goToSlideEnhanced(carouselState.totalSlides - 1, { trigger: 'control-panel' });
    });
    
    // Filter button
    document.getElementById('filterBtn')?.addEventListener('click', () => {
        showFilterModal();
    });
    
    // Fullscreen
    document.getElementById('fullscreenBtn')?.addEventListener('click', () => {
        toggleFullscreen();
    });
    
    // Favorite
    document.getElementById('favoriteBtn')?.addEventListener('click', () => {
        addToFavorites();
        updateFavoriteButton();
    });
    
    // Transition select
    document.getElementById('transitionSelect')?.addEventListener('change', (e) => {
        carouselState.transitionType = e.target.value;
    });
    
    // Update stats periodically
    setInterval(updateStatsDisplay, 1000);
}

// Update control panel states
function updatePlayPauseButton() {
    const btn = document.getElementById('playPauseBtn');
    const icon = btn?.querySelector('i');
    
    if (carouselState.isAutoPlaying) {
        icon?.classList.remove('fa-play');
        icon?.classList.add('fa-pause');
        btn?.classList.add('active');
    } else {
        icon?.classList.remove('fa-pause');
        icon?.classList.add('fa-play');
        btn?.classList.remove('active');
    }
}

function updateFavoriteButton() {
    const btn = document.getElementById('favoriteBtn');
    const icon = btn?.querySelector('i');
    
    if (carouselState.favorites.has(carouselState.currentSlide)) {
        icon?.classList.remove('far');
        icon?.classList.add('fas');
        btn?.classList.add('active');
    } else {
        icon?.classList.remove('fas');
        icon?.classList.add('far');
        btn?.classList.remove('active');
    }
}

function updateStatsDisplay() {
    const metrics = PerformanceMonitor.getMetrics();
    
    document.getElementById('fpsValue').textContent = Math.round(metrics.frameRate);
    document.getElementById('slidesViewedValue').textContent = carouselState.viewHistory.length;
    document.getElementById('favoritesCountValue').textContent = carouselState.favorites.size;
}

// Filter modal
function showFilterModal() {
    const modal = document.createElement('div');
    modal.className = 'filter-modal';
    modal.innerHTML = `
        <div class="filter-modal-content">
            <div class="filter-modal-header">
                <h3>Filtros de Imagem</h3>
                <button class="close-filter-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="filter-modal-body">
                <div class="filter-group">
                    <label>Brilho: <span id="brightnessValue">1</span></label>
                    <input type="range" id="brightnessControl" min="0.5" max="2" step="0.1" value="1">
                </div>
                <div class="filter-group">
                    <label>Contraste: <span id="contrastValue">1</span></label>
                    <input type="range" id="contrastControl" min="0.5" max="2" step="0.1" value="1">
                </div>
                <div class="filter-group">
                    <label>Saturação: <span id="saturationValue">1</span></label>
                    <input type="range" id="saturationControl" min="0" max="2" step="0.1" value="1">
                </div>
                <div class="filter-group">
                    <label>Desfoque: <span id="blurValue">0</span>px</label>
                    <input type="range" id="blurControl" min="0" max="10" step="1" value="0">
                </div>
                <div class="filter-presets">
                    <button class="preset-btn" data-filter="vintage">Vintage</button>
                    <button class="preset-btn" data-filter="cool">Frio</button>
                    <button class="preset-btn" data-filter="warm">Quente</button>
                    <button class="preset-btn" data-filter="grayscale">P&B</button>
                </div>
                <div class="filter-actions">
                    <button class="btn btn-secondary" id="resetFiltersBtn">Resetar</button>
                    <button class="btn btn-primary" id="applyFiltersBtn">Aplicar</button>
                </div>
            </div>
        </div>
    `;
    
    // Add filter modal styles
    const style = document.createElement('style');
    style.textContent = `
        .filter-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        }
        
        .filter-modal-content {
            background: white;
            border-radius: 12px;
            padding: 0;
            max-width: 400px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .filter-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .filter-modal-header h3 {
            margin: 0;
            color: var(--dark);
        }
        
        .close-filter-modal {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--gray);
        }
        
        .filter-modal-body {
            padding: 20px;
        }
        
        .filter-group {
            margin-bottom: 20px;
        }
        
        .filter-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--dark);
        }
        
        .filter-group input[type="range"] {
            width: 100%;
        }
        
        .filter-presets {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        
        .preset-btn {
            background: var(--gray-light);
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .preset-btn:hover {
            background: var(--primary);
            color: white;
        }
        
        .filter-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Setup filter modal events
    setupFilterModalEvents(modal);
}

function setupFilterModalEvents(modal) {
    // Close modal
    modal.querySelector('.close-filter-modal')?.addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Filter controls
    const controls = ['brightness', 'contrast', 'saturation', 'blur'];
    controls.forEach(filter => {
        const control = modal.querySelector(`#${filter}Control`);
        const valueSpan = modal.querySelector(`#${filter}Value`);
        
        control?.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            valueSpan.textContent = filter === 'blur' ? value + 'px' : value;
            
            const unit = filter === 'blur' ? 'px' : '';
            ImageEnhancement.applyFilter(filter, value + unit);
        });
    });
    
    // Preset buttons
    modal.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            ImageEnhancement.applyFilter(filter);
        });
    });
    
    // Reset and apply
    modal.querySelector('#resetFiltersBtn')?.addEventListener('click', () => {
        ImageEnhancement.resetFilters();
        // Reset all controls to default
        controls.forEach(filter => {
            const control = modal.querySelector(`#${filter}Control`);
            const valueSpan = modal.querySelector(`#${filter}Value`);
            const defaultValue = filter === 'blur' ? 0 : 1;
            
            control.value = defaultValue;
            valueSpan.textContent = filter === 'blur' ? defaultValue + 'px' : defaultValue;
        });
    });
    
    modal.querySelector('#applyFiltersBtn')?.addEventListener('click', () => {
        modal.remove();
    });
}

// =================
// FINAL CAROUSEL ENHANCEMENTS
// =================

// Context menu for right-click options
function createContextMenu() {
    const contextMenu = document.createElement('div');
    contextMenu.className = 'carousel-context-menu';
    contextMenu.innerHTML = `
        <div class="context-menu-item" data-action="copy-image">
            <i class="fas fa-copy"></i> Copiar Imagem
        </div>
        <div class="context-menu-item" data-action="save-image">
            <i class="fas fa-download"></i> Salvar Imagem
        </div>
        <div class="context-menu-item" data-action="share-image">
            <i class="fas fa-share"></i> Compartilhar
        </div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="set-wallpaper">
            <i class="fas fa-image"></i> Definir como Papel de Parede
        </div>
        <div class="context-menu-item" data-action="image-info">
            <i class="fas fa-info-circle"></i> Informações da Imagem
        </div>
    `;
    
    // Add context menu styles
    const style = document.createElement('style');
    style.textContent = `
        .carousel-context-menu {
            position: fixed;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 3000;
            min-width: 200px;
            opacity: 0;
            visibility: hidden;
            transform: scale(0.95);
            transition: all 0.2s ease;
        }
        
        .carousel-context-menu.visible {
            opacity: 1;
            visibility: visible;
            transform: scale(1);
        }
        
        .context-menu-item {
            padding: 12px 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: background 0.2s ease;
        }
        
        .context-menu-item:hover {
            background: #f5f5f5;
        }
        
        .context-menu-item i {
            width: 16px;
            color: var(--primary);
        }
        
        .context-menu-separator {
            height: 1px;
            background: #eee;
            margin: 4px 0;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(contextMenu);
    
    // Setup context menu events
    setupContextMenuEvents(contextMenu);
    
    return contextMenu;
}

function setupContextMenuEvents(contextMenu) {
    // Right-click on carousel images
    carouselTrack?.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        
        const rect = contextMenu.getBoundingClientRect();
        const x = Math.min(e.clientX, window.innerWidth - rect.width - 10);
        const y = Math.min(e.clientY, window.innerHeight - rect.height - 10);
        
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        contextMenu.classList.add('visible');
    });
    
    // Hide context menu on click outside
    document.addEventListener('click', () => {
        contextMenu.classList.remove('visible');
    });
    
    // Context menu actions
    contextMenu.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const action = e.target.closest('.context-menu-item').dataset.action;
            handleContextMenuAction(action);
            contextMenu.classList.remove('visible');
        });
    });
}

function handleContextMenuAction(action) {
    const currentImg = carouselTrack.querySelector('.carousel-slide.active img');
    if (!currentImg) return;
    
    switch (action) {
        case 'copy-image':
            copyImageToClipboard(currentImg);
            break;
        case 'save-image':
            downloadImage(currentImg);
            break;
        case 'share-image':
            shareImage(currentImg);
            break;
        case 'set-wallpaper':
            setAsWallpaper(currentImg);
            break;
        case 'image-info':
            showImageInfo(currentImg);
            break;
    }
}

async function copyImageToClipboard(img) {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(async (blob) => {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                showToast('Imagem copiada para a área de transferência', 'success');
            } catch (err) {
                showToast('Erro ao copiar imagem', 'error');
            }
        });
    } catch (err) {
        showToast('Erro ao copiar imagem', 'error');
    }
}

function downloadImage(img) {
    const link = document.createElement('a');
    link.download = `churrasquinho-galeria-${Date.now()}.jpg`;
    link.href = img.src;
    link.click();
    showToast('Download iniciado', 'success');
}

async function shareImage(img) {
    if (navigator.share) {
        try {
            const response = await fetch(img.src);
            const blob = await response.blob();
            const file = new File([blob], 'churrasquinho-galeria.jpg', { type: 'image/jpeg' });
            
            await navigator.share({
                title: 'Galeria do Churrasquinho da Hora',
                text: 'Veja esta deliciosa imagem da nossa galeria!',
                files: [file]
            });
        } catch (err) {
            fallbackShare(img);
        }
    } else {
        fallbackShare(img);
    }
}

function fallbackShare(img) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Veja esta deliciosa imagem da galeria do Churrasquinho da Hora!');
    
    const shareModal = document.createElement('div');
    shareModal.className = 'share-modal';
    shareModal.innerHTML = `
        <div class="share-modal-content">
            <h3>Compartilhar Imagem</h3>
            <div class="share-options">
                <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" class="share-btn facebook">
                    <i class="fab fa-facebook"></i> Facebook
                </a>
                <a href="https://twitter.com/intent/tweet?url=${url}&text=${text}" target="_blank" class="share-btn twitter">
                    <i class="fab fa-twitter"></i> Twitter
                </a>
                <a href="https://wa.me/?text=${text} ${url}" target="_blank" class="share-btn whatsapp">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </a>
            </div>
            <button class="close-share-modal">Fechar</button>
        </div>
    `;
    
    document.body.appendChild(shareModal);
    
    shareModal.querySelector('.close-share-modal').addEventListener('click', () => {
        shareModal.remove();
    });
    
    setTimeout(() => shareModal.remove(), 10000);
}

function setAsWallpaper(img) {
    if ('setDesktopWallpaper' in window) {
        window.setDesktopWallpaper(img.src);
        showToast('Papel de parede definido', 'success');
    } else {
        showToast('Funcionalidade não suportada neste navegador', 'warning');
    }
}

function showImageInfo(img) {
    const infoModal = document.createElement('div');
    infoModal.className = 'image-info-modal';
    
    // Get image metadata
    const info = {
        src: img.src,
        alt: img.alt,
        dimensions: `${img.naturalWidth} × ${img.naturalHeight}`,
        fileSize: 'Calculando...',
        slideNumber: carouselState.currentSlide + 1,
        totalSlides: carouselState.totalSlides
    };
    
    infoModal.innerHTML = `
        <div class="info-modal-content">
            <h3>Informações da Imagem</h3>
            <div class="info-grid">
                <div class="info-item">
                    <strong>Slide:</strong> ${info.slideNumber} de ${info.totalSlides}
                </div>
                <div class="info-item">
                    <strong>Dimensões:</strong> ${info.dimensions}
                </div>
                <div class="info-item">
                    <strong>Descrição:</strong> ${info.alt}
                </div>
                <div class="info-item">
                    <strong>Origem:</strong> ${info.src}
                </div>
            </div>
            <button class="close-info-modal">Fechar</button>
        </div>
    `;
    
    document.body.appendChild(infoModal);
    
    infoModal.querySelector('.close-info-modal').addEventListener('click', () => {
        infoModal.remove();
    });
}

// Picture-in-Picture support
function enablePictureInPicture() {
    if (!document.pictureInPictureEnabled) {
        return;
    }
    
    const pipButton = document.createElement('button');
    pipButton.className = 'pip-button';
    pipButton.innerHTML = '<i class="fas fa-external-link-alt"></i>';
    pipButton.title = 'Picture-in-Picture';
    
    pipButton.addEventListener('click', async () => {
        try {
            const currentImg = carouselTrack.querySelector('.carousel-slide.active img');
            if (!currentImg) return;
            
            // Create video element for PiP (workaround for images)
            const video = document.createElement('video');
            video.srcObject = await captureImageAsStream(currentImg);
            video.play();
            
            await video.requestPictureInPicture();
            showToast('Picture-in-Picture ativado', 'success');
        } catch (err) {
            showToast('Erro ao ativar Picture-in-Picture', 'error');
        }
    });
    
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer?.appendChild(pipButton);
}

async function captureImageAsStream(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    
    return canvas.captureStream(30); // 30 FPS
}

// Enhanced error handling and recovery
function setupErrorHandling() {
    // Image load error handling
    const images = carouselTrack.querySelectorAll('img');
    images.forEach((img, index) => {
        img.addEventListener('error', () => {
            console.warn(`Failed to load image at slide ${index}`);
            
            // Create placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.innerHTML = `
                <i class="fas fa-image"></i>
                <p>Imagem não disponível</p>
            `;
            
            img.parentNode.replaceChild(placeholder, img);
            
            // Try to reload after delay
            setTimeout(() => {
                const newImg = document.createElement('img');
                newImg.src = img.src;
                newImg.alt = img.alt;
                newImg.onload = () => {
                    placeholder.parentNode.replaceChild(newImg, placeholder);
                };
            }, 5000);
        });
    });
    
    // Auto-recovery from stuck states
    setInterval(() => {
        if (carouselState.isTransitioning) {
            const timeSinceTransition = Date.now() - carouselState.lastTransitionTime;
            if (timeSinceTransition > 10000) { // 10 seconds
                console.warn('Carousel stuck in transition, recovering...');
                carouselState.isTransitioning = false;
                updateEnhancedCarouselDisplay();
            }
        }
    }, 5000);
}

// Export advanced API
window.CarouselAdvancedAPI = {
    // Context menu
    showContextMenu: (x, y) => {
        const contextMenu = document.querySelector('.carousel-context-menu');
        if (contextMenu) {
            contextMenu.style.left = x + 'px';
            contextMenu.style.top = y + 'px';
            contextMenu.classList.add('visible');
        }
    },
    
    // Image operations
    copyCurrentImage: () => {
        const currentImg = carouselTrack.querySelector('.carousel-slide.active img');
        if (currentImg) copyImageToClipboard(currentImg);
    },
    
    downloadCurrentImage: () => {
        const currentImg = carouselTrack.querySelector('.carousel-slide.active img');
        if (currentImg) downloadImage(currentImg);
    },
    
    shareCurrentImage: () => {
        const currentImg = carouselTrack.querySelector('.carousel-slide.active img');
        if (currentImg) shareImage(currentImg);
    },
    
    // Advanced navigation
    goToSlideByPercentage: (percentage) => {
        const slideIndex = Math.floor((percentage / 100) * carouselState.totalSlides);
        goToSlideEnhanced(slideIndex);
    },
    
    // Playlist management
    createPlaylistFromFavorites: () => MediaControls.createPlaylist(),
    
    // State management
    exportState: () => ({
        currentSlide: carouselState.currentSlide,
        favorites: Array.from(carouselState.favorites),
        viewHistory: carouselState.viewHistory.slice(-50), // Last 50 entries
        settings: {
            autoPlay: carouselState.isAutoPlaying,
            speed: carouselState.playbackSpeed,
            shuffleMode: carouselState.shuffleMode
        }
    }),
    
    importState: (state) => {
        if (state.currentSlide !== undefined) {
            goToSlideEnhanced(state.currentSlide);
        }
        if (state.favorites) {
            carouselState.favorites = new Set(state.favorites);
            updateFavoritesDisplay();
        }
        if (state.settings) {
            carouselState.isAutoPlaying = state.settings.autoPlay;
            carouselState.playbackSpeed = state.settings.speed;
            carouselState.shuffleMode = state.settings.shuffleMode;
        }
    }
};

// Initialize final enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Create context menu
    createContextMenu();
    
    // Setup error handling
    setupErrorHandling();
    
    // Enable Picture-in-Picture if supported
    if (document.pictureInPictureEnabled) {
        enablePictureInPicture();
    }
    
    // Add final keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'c':
                    e.preventDefault();
                    CarouselAdvancedAPI.copyCurrentImage();
                    break;
                case 's':
                    e.preventDefault();
                    CarouselAdvancedAPI.downloadCurrentImage();
                    break;
                case 'r':
                    e.preventDefault();
                    // Reload current image
                    const currentImg = carouselTrack.querySelector('.carousel-slide.active img');
                    if (currentImg) {
                        const src = currentImg.src;
                        currentImg.src = '';
                        currentImg.src = src;
                    }
                    break;
            }
        }
    });
    
    // Save state to localStorage periodically
    setInterval(() => {
        const state = CarouselAdvancedAPI.exportState();
        localStorage.setItem('carouselState', JSON.stringify(state));
    }, 30000); // Every 30 seconds
    
    // Load state from localStorage on startup
    const savedState = localStorage.getItem('carouselState');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            CarouselAdvancedAPI.importState(state);
        } catch (err) {
            console.warn('Failed to load saved carousel state');
        }
    }
    
    console.log('🎉 Carousel enhancement complete! All features loaded.');
});
