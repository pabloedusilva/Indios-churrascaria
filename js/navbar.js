// Navbar Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const header = document.querySelector('.navbar-header');
    const navbarToggler = document.getElementById('navbarToggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link');
    const heroSection = document.getElementById('home');
    
    // Function to check if user is in hero section
    function checkHeroSection() {
        const heroRect = heroSection.getBoundingClientRect();
        const headerHeight = header.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Check if the hero section is visible and covers a significant portion of the viewport
        const heroVisibleHeight = Math.min(heroRect.bottom, viewportHeight) - Math.max(heroRect.top, headerHeight);
        const isInHero = heroVisibleHeight > viewportHeight * 0.3 && heroRect.top < viewportHeight * 0.5;
        
        if (isInHero) {
            header.classList.add('hero-transparent');
            header.classList.remove('scrolled');
        } else {
            header.classList.remove('hero-transparent');
            // Apply scrolled class if we're not in hero and have scrolled
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }
    
    // Initial check
    checkHeroSection();
    
    // Scroll event with hero section check
    window.addEventListener('scroll', function() {
        checkHeroSection();
    });
    
    // Window resize event to recalculate hero section
    window.addEventListener('resize', function() {
        checkHeroSection();
    });
    
    // Toggle mobile menu
    navbarToggler.addEventListener('click', function() {
        navbarToggler.classList.toggle('active');
        navbarCollapse.classList.toggle('show');
        
        // Prevent body scroll when menu is open
        if (navbarCollapse.classList.contains('show')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navbarToggler.classList.remove('active');
            navbarCollapse.classList.remove('show');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navbarCollapse.classList.contains('show') && 
            !navbarCollapse.contains(e.target) && 
            !navbarToggler.contains(e.target)) {
            
            navbarToggler.classList.remove('active');
            navbarCollapse.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
    
    // Active link based on scroll position
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-link[href*=' + sectionId + ']').classList.add('active');
            } else {
                document.querySelector('.nav-link[href*=' + sectionId + ']').classList.remove('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNavLink);
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.nav-link, .cta-btn, .navbar-toggler');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.top = y + 'px';
            ripple.style.left = x + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Smooth scroll for navbar links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
