// Social Contact Section JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Animação de entrada para os cards
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

    // Observar cards da seção social
    const socialCards = document.querySelectorAll('.social-card');
    socialCards.forEach(card => {
        observer.observe(card);
    });

    // Animação de click nos botões de rede social
    const socialButtons = document.querySelectorAll('.btn-instagram, .btn-whatsapp');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Criar efeito de ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            // Remover o ripple após a animação
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });

    // Tracking de cliques para analytics (opcional)
    const instagramButton = document.querySelector('.btn-instagram');
    const whatsappButton = document.querySelector('.btn-whatsapp');
    
    if (instagramButton) {
        instagramButton.addEventListener('click', function() {
            // Aqui você pode adicionar tracking de analytics
            console.log('Clique no Instagram button');
            // gtag('event', 'click', { event_category: 'social', event_label: 'instagram' });
        });
    }
    
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function() {
            // Aqui você pode adicionar tracking de analytics
            console.log('Clique no WhatsApp button');
            // gtag('event', 'click', { event_category: 'social', event_label: 'whatsapp' });
        });
    }

    // Animação de contador para features (opcional)
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
});

// CSS para animações (será injetado dinamicamente)
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .social-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }
    
    .social-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .feature-item {
        opacity: 0;
        transform: translateX(-20px);
        animation: slideInLeft 0.5s ease-out forwards;
    }
    
    @keyframes slideInLeft {
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    /* Melhorias de acessibilidade */
    .btn-instagram:focus,
    .btn-whatsapp:focus {
        outline: 2px solid #fff;
        outline-offset: 2px;
    }
    
    @media (prefers-reduced-motion: reduce) {
        .social-card,
        .feature-item {
            animation: none !important;
            transition: none !important;
        }
    }
`;

document.head.appendChild(style);
