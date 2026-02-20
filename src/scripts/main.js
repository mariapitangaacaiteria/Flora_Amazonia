/* =====================================================
   MAIN JS - FLORAMAZONIA
   Script principal de inicializacao
   ===================================================== */

import { initFAQ } from '../components/sections/FAQ/FAQ.js';
import { initCTAForm } from '../components/sections/CTA/CTA.js';
import TrueFocusAnimation from '../components/sections/Hero/Hero.js';
import { initProdutosCarousel } from '../components/sections/Produtos/Produtos.js';
import { WHATSAPP_NUMBER, CTA_DEFAULT_MESSAGE } from '../config/config.js';

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initWhatsApp();
    initBlurText();
    initLogoLoop();
    new TrueFocusAnimation('[data-animation="products"]');
    initFAQ();
    initCTAForm();
    initProdutosCarousel();
});

/* ===== BLUR TEXT (FAQ) ===== */
function initBlurText() {
    const targets = document.querySelectorAll('[data-blur-text]');
    if (!targets.length) return;

    targets.forEach(target => {
        const animateBy = target.dataset.animateBy || 'words';
        const direction = target.dataset.direction || 'top';
        const delay = Number(target.dataset.delay || 200);
        const stepDuration = Number(target.dataset.stepDuration || 0.35);
        const threshold = Number(target.dataset.threshold || 0.1);
        const rootMargin = target.dataset.rootMargin || '0px';

        const text = target.textContent.trim();
        if (!text) return;

        target.textContent = '';

        const segments = animateBy === 'words' ? text.split(' ') : Array.from(text);

        segments.forEach((segment, index) => {
            const span = document.createElement('span');
            span.className = 'blur-text__segment';
            span.textContent = segment === ' ' ? '\u00A0' : segment;

            if (animateBy === 'words' && index < segments.length - 1) {
                span.textContent += '\u00A0';
            }

            target.appendChild(span);
        });

        const fromSnapshot = direction === 'top'
            ? { filter: 'blur(10px)', opacity: 0, y: -50 }
            : { filter: 'blur(10px)', opacity: 0, y: 50 };

        const toSnapshots = [
            {
                filter: 'blur(5px)',
                opacity: 0.5,
                y: direction === 'top' ? 5 : -5
            },
            { filter: 'blur(0px)', opacity: 1, y: 0 }
        ];

        const steps = [fromSnapshot, ...toSnapshots].map(step => ({
            filter: step.filter,
            opacity: step.opacity,
            transform: `translateY(${step.y}px)`
        }));

        const stepCount = steps.length;
        const totalDuration = stepDuration * (stepCount - 1);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;

                const items = Array.from(target.querySelectorAll('.blur-text__segment'));
                items.forEach((item, index) => {
                    item.animate(steps, {
                        duration: totalDuration * 1000,
                        delay: index * delay,
                        easing: 'ease',
                        fill: 'forwards'
                    });
                });

                observer.unobserve(target);
            },
            { threshold, rootMargin }
        );

        observer.observe(target);
    });
}

/* ===== LOGO LOOP (MARCAS) ===== */
function initLogoLoop() {
    const loops = document.querySelectorAll('.logoloop');
    if (!loops.length) return;

    loops.forEach(loop => {
        const track = loop.querySelector('.logoloop__track');
        const list = loop.querySelector('.logoloop__list');
        if (!track || !list) return;

        const speed = Number(loop.dataset.speed || 80);
        const direction = loop.dataset.direction || 'left';
        const pauseOnHover = loop.dataset.pauseOnHover !== 'false';

        let rafId = null;
        let lastTimestamp = null;
        let offset = 0;
        let listWidth = 0;
        let isPaused = false;

        const clearClones = () => {
            track.querySelectorAll('.logoloop__list[data-clone="true"]').forEach(node => node.remove());
        };

        const updateClones = () => {
            clearClones();
            listWidth = list.getBoundingClientRect().width;
            const containerWidth = loop.clientWidth;
            if (!listWidth || !containerWidth) return;

            const copiesNeeded = Math.ceil(containerWidth / listWidth) + 1;
            for (let i = 0; i < copiesNeeded; i += 1) {
                const clone = list.cloneNode(true);
                clone.setAttribute('data-clone', 'true');
                clone.setAttribute('aria-hidden', 'true');
                track.appendChild(clone);
            }

            if (!rafId) {
                startAnimation();
            }
        };

        const animate = timestamp => {
            if (lastTimestamp === null) lastTimestamp = timestamp;
            const delta = Math.max(0, timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;

            if (listWidth > 0) {
                const directionMultiplier = direction === 'right' ? -1 : 1;
                const currentSpeed = isPaused ? 0 : speed;
                offset += directionMultiplier * currentSpeed * delta;
                offset = ((offset % listWidth) + listWidth) % listWidth;
                track.style.transform = `translate3d(${-offset}px, 0, 0)`;
            }

            rafId = requestAnimationFrame(animate);
        };

        const startAnimation = () => {
            if (rafId) cancelAnimationFrame(rafId);
            lastTimestamp = null;
            rafId = requestAnimationFrame(animate);
        };

        if (pauseOnHover) {
            loop.addEventListener('mouseenter', () => {
                isPaused = true;
            });
            loop.addEventListener('mouseleave', () => {
                isPaused = false;
            });
        }

        if (window.ResizeObserver) {
            const observer = new ResizeObserver(updateClones);
            observer.observe(loop);
            observer.observe(list);
        } else {
            window.addEventListener('resize', updateClones, { passive: true });
        }

        const images = list.querySelectorAll('img');
        if (images.length === 0) {
            updateClones();
            return;
        }

        let remainingImages = images.length;
        const handleImageLoad = () => {
            remainingImages -= 1;
            if (remainingImages === 0) updateClones();
        };

        images.forEach(img => {
            if (img.complete) {
                handleImageLoad();
            } else {
                img.addEventListener('load', handleImageLoad, { once: true });
                img.addEventListener('error', handleImageLoad, { once: true });
            }
        });
    });
}

/* ===== HEADER ===== */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // Adiciona classe quando scroll > 50px
        if (currentScrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Verificar estado inicial
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.header__mobile-nav-link');

    if (!toggle || !menu) return;

    const openMenu = () => {
        toggle.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        menu.classList.add('active');
        menu.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-open');
    };

    const closeMenu = () => {
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('active');
        menu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
    };

    const toggleMenu = () => {
        if (menu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    toggle.addEventListener('click', toggleMenu);

    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Fechar menu com tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && menu.classList.contains('active')) {
            closeMenu();
        }
    });
}

/* ===== SMOOTH SCROLL ===== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerHeight = document.getElementById('header')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Atualizar link ativo
            updateActiveLink(href);
        });
    });
}

/* ===== UPDATE ACTIVE LINK ===== */
function updateActiveLink(activeHref) {
    const navLinks = document.querySelectorAll('.header__nav-link, .header__mobile-nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeHref) {
            link.classList.add('active');
        }
    });
}

/* ===== WHATSAPP ===== */
function initWhatsApp() {
    document.querySelectorAll('[data-whatsapp]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const message = encodeURIComponent(CTA_DEFAULT_MESSAGE);
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
        });
    });
}


