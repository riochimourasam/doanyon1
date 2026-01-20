// ========================================
// DOANYON AFRICA - Script Principal
// ========================================

'use strict';

// ========================================
// Configuration
// ========================================
const CONFIG = {
    preloaderDuration: 2000,
    scrollThreshold: 100,
    cursorSize: { small: 10, large: 40 },
    animationDelay: 100
};

// ========================================
// Éléments DOM
// ========================================
const DOM = {
    preloader: document.getElementById('preloader'),
    navbar: document.querySelector('.navbar'),
    menuBtn: document.getElementById('menuBtn'),
    mobileMenu: document.getElementById('mobileMenu'),
    mobileLinks: document.querySelectorAll('.mobile-link'),
    cursor: document.getElementById('cursor'),
    cursorFollower: document.getElementById('cursorFollower'),
    allLinks: document.querySelectorAll('a'),
    sections: document.querySelectorAll('section'),
    navLinks: document.querySelectorAll('.nav-links a, .mobile-link'),
    serviceCards: document.querySelectorAll('.service-card'),
    portfolioItems: document.querySelectorAll('.portfolio-item'),
    contactMethods: document.querySelectorAll('.contact-method')
};

// ========================================
// Utilitaires
// ========================================
const Utils = {
    // Debounce pour optimiser les performances
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle pour limiter les appels
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Vérifier si un élément est visible
    isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
            rect.bottom >= offset
        );
    },

    // Smooth scroll vers une section
    scrollToSection(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.offsetTop - DOM.navbar.offsetHeight;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
};

// ========================================
// Preloader
// ========================================
const Preloader = {
    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                DOM.preloader.classList.add('hidden');
                document.body.style.overflow = 'visible';
            }, CONFIG.preloaderDuration);
        });
    }
};

// ========================================
// Cursor Personnalisé
// ========================================
const CustomCursor = {
    init() {
        if (window.innerWidth <= 1024) return;

        this.setupCursor();
        this.setupHoverEffects();
    },

    setupCursor() {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        // Suivre la position de la souris
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Animation fluide du curseur
        const animateCursor = () => {
            // Curseur principal (rapide)
            const cursorSpeed = 0.2;
            cursorX += (mouseX - cursorX) * cursorSpeed;
            cursorY += (mouseY - cursorY) * cursorSpeed;

            DOM.cursor.style.left = cursorX + 'px';
            DOM.cursor.style.top = cursorY + 'px';

            // Curseur suiveur (lent)
            const followerSpeed = 0.1;
            followerX += (mouseX - followerX) * followerSpeed;
            followerY += (mouseY - followerY) * followerSpeed;

            DOM.cursorFollower.style.left = followerX + 'px';
            DOM.cursorFollower.style.top = followerY + 'px';

            requestAnimationFrame(animateCursor);
        };

        animateCursor();
    },

    setupHoverEffects() {
        // Agrandir le curseur sur les liens et boutons
        const interactiveElements = document.querySelectorAll('a, button, .service-card, .portfolio-item');

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                DOM.cursorFollower.style.width = '60px';
                DOM.cursorFollower.style.height = '60px';
            });

            element.addEventListener('mouseleave', () => {
                DOM.cursorFollower.style.width = '40px';
                DOM.cursorFollower.style.height = '40px';
            });
        });
    }
};

// ========================================
// Navigation
// ========================================
const Navigation = {
    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupActiveLink();
    },

    setupScrollEffect() {
        window.addEventListener('scroll', Utils.throttle(() => {
            if (window.scrollY > CONFIG.scrollThreshold) {
                DOM.navbar.classList.add('scrolled');
            } else {
                DOM.navbar.classList.remove('scrolled');
            }
        }, 100));
    },

    setupMobileMenu() {
        DOM.menuBtn.addEventListener('click', () => {
            DOM.menuBtn.classList.toggle('active');
            DOM.mobileMenu.classList.toggle('active');
            document.body.style.overflow = DOM.mobileMenu.classList.contains('active') ? 'hidden' : 'visible';
        });

        // Fermer le menu en cliquant sur un lien
        DOM.mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                DOM.menuBtn.classList.remove('active');
                DOM.mobileMenu.classList.remove('active');
                document.body.style.overflow = 'visible';
            });
        });

        // Fermer en cliquant en dehors
        DOM.mobileMenu.addEventListener('click', (e) => {
            if (e.target === DOM.mobileMenu) {
                DOM.menuBtn.classList.remove('active');
                DOM.mobileMenu.classList.remove('active');
                document.body.style.overflow = 'visible';
            }
        });
    },

    setupSmoothScroll() {
        DOM.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    Utils.scrollToSection(href);
                }
            });
        });
    },

    setupActiveLink() {
        window.addEventListener('scroll', Utils.debounce(() => {
            let current = '';
            
            DOM.sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            DOM.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 100));
    }
};

// ========================================
// Animations au Scroll
// ========================================
const ScrollAnimations = {
    init() {
        this.observeElements();
    },

    observeElements() {
        const options = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, options);

        // Observer les éléments
        const elementsToAnimate = [
            ...DOM.serviceCards,
            ...DOM.portfolioItems,
            ...document.querySelectorAll('.feature-item'),
            ...document.querySelectorAll('.contact-method')
        ];

        elementsToAnimate.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';
            element.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
            observer.observe(element);
        });
    }
};

// ========================================
// Animations des Cartes
// ========================================
const CardAnimations = {
    init() {
        this.setupServiceCards();
        this.setupPortfolioHover();
    },

    setupServiceCards() {
        DOM.serviceCards.forEach(card => {
            // Effet parallaxe sur l'image au survol
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const moveX = (x - centerX) / 20;
                const moveY = (y - centerY) / 20;

                const img = card.querySelector('img');
                if (img) {
                    img.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
                }
            });

            card.addEventListener('mouseleave', () => {
                const img = card.querySelector('img');
                if (img) {
                    img.style.transform = 'translate(0, 0) scale(1)';
                }
            });
        });
    },

    setupPortfolioHover() {
        DOM.portfolioItems.forEach(item => {
            // Effet de rotation subtile
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 30;
                const rotateY = (centerX - x) / 30;

                const img = item.querySelector('img');
                if (img) {
                    img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
                }
            });

            item.addEventListener('mouseleave', () => {
                const img = item.querySelector('img');
                if (img) {
                    img.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                }
            });
        });
    }
};

// ========================================
// Parallaxe Hero
// ========================================
const ParallaxHero = {
    init() {
        window.addEventListener('scroll', Utils.throttle(() => {
            const scrolled = window.scrollY;
            const heroImage = document.querySelector('.hero-image img');
            
            if (heroImage && scrolled < window.innerHeight) {
                heroImage.style.transform = `translateY(${scrolled * 0.5}px) scale(1.1)`;
            }
        }, 10));
    }
};

// ========================================
// Lazy Loading Images
// ========================================
const LazyLoad = {
    init() {
        const images = document.querySelectorAll('img');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
};

// ========================================
// Performance Monitor
// ========================================
const Performance = {
    init() {
        // Log des performances
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⚡ Page chargée en ${pageLoadTime}ms`);
        });
    }
};

// ========================================
// Tracking Simulé
// ========================================
const Analytics = {
    init() {
        this.trackPageView();
        this.trackClicks();
        this.trackScroll();
    },

    trackPageView() {
        console.log('📊 Page vue:', window.location.pathname);
    },

    trackClicks() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('a, button')) {
                const element = e.target;
                const text = element.textContent.trim();
                const href = element.getAttribute('href');
                console.log(`🖱️ Clic:`, { text, href });
            }
        });
    },

    trackScroll() {
        let maxScroll = 0;
        let milestones = [25, 50, 75, 100];

        window.addEventListener('scroll', Utils.debounce(() => {
            const scrollPercent = Math.round(
                (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100
            );

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                milestones = milestones.filter(milestone => {
                    if (scrollPercent >= milestone) {
                        console.log(`📜 Scroll: ${milestone}%`);
                        return false;
                    }
                    return true;
                });
            }
        }, 500));
    }
};

// ========================================
// Easter Eggs
// ========================================
const EasterEggs = {
    init() {
        this.konamiCode();
        this.logoClicks();
    },

    konamiCode() {
        const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let index = 0;

        document.addEventListener('keydown', (e) => {
            if (e.key === code[index]) {
                index++;
                if (index === code.length) {
                    this.activatePartyMode();
                    index = 0;
                }
            } else {
                index = 0;
            }
        });
    },

    activatePartyMode() {
        console.log('🎉 PARTY MODE ACTIVÉ!');
        
        // Ajouter une animation rainbow
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
            body { animation: rainbow 3s linear infinite !important; }
        `;
        document.head.appendChild(style);

        // Créer des confettis
        this.createConfetti();

        // Désactiver après 5 secondes
        setTimeout(() => {
            style.remove();
            console.log('🎉 Party mode désactivé');
        }, 5000);
    },

    createConfetti() {
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}%;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                z-index: 10000;
                animation: confettiFall ${2 + Math.random() * 3}s linear;
                transform: rotate(${Math.random() * 360}deg);
            `;
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 5000);
        }

        // Animation CSS pour les confettis
        if (!document.getElementById('confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes confettiFall {
                    to { 
                        top: 100vh; 
                        transform: translateX(${Math.random() * 200 - 100}px) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    },

    logoClicks() {
        const brand = document.querySelector('.brand');
        let clickCount = 0;
        let resetTimeout;

        brand.addEventListener('click', (e) => {
            e.preventDefault();
            clickCount++;

            clearTimeout(resetTimeout);
            resetTimeout = setTimeout(() => {
                clickCount = 0;
            }, 2000);

            if (clickCount === 5) {
                brand.style.animation = 'spin 1s ease';
                console.log('⚡ Logo spin activé!');
                
                setTimeout(() => {
                    brand.style.animation = '';
                    clickCount = 0;
                }, 1000);

                // Ajouter l'animation spin si elle n'existe pas
                if (!document.getElementById('spin-style')) {
                    const style = document.createElement('style');
                    style.id = 'spin-style';
                    style.textContent = `
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        });
    }
};

// ========================================
// Initialisation Principale
// ========================================
class App {
    constructor() {
        this.init();
    }

    init() {
        // Vérifier que le DOM est chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        console.log('⚡ DOANYON AFRICA - Site initialisé');
        console.log('💡 Version: 2.0');
        console.log('🎨 Design: Modern & Clean');

        // Initialiser tous les modules
        Preloader.init();
        CustomCursor.init();
        Navigation.init();
        ScrollAnimations.init();
        CardAnimations.init();
        ParallaxHero.init();
        LazyLoad.init();
        Performance.init();
        Analytics.init();
        EasterEggs.init();

        // Animation d'entrée
        this.playEntryAnimation();
    }

    playEntryAnimation() {
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.8s ease';
            document.body.style.opacity = '1';
        }, 100);
    }
}

// Lancer l'application
const app = new App();

// Exposer l'API pour le debugging
window.DoanyonApp = {
    version: '2.0',
    utils: Utils,
    navigation: Navigation,
    animations: ScrollAnimations,
    performance: Performance
};

console.log('🚀 DOANYON AFRICA ready!');
console.log('💬 Contactez-nous: +228 92 12 39 51');