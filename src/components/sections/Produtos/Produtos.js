/* =====================================================
   PRODUTOS CAROUSEL - JAVASCRIPT
   Carrossel infinito com auto-scroll, drag e swipe
   ===================================================== */

function initProdutosCarousel() {
    const wrapper = document.querySelector('.produtos__carousel-wrapper');
    const carousel = document.getElementById('produtos-carousel');
    if (!wrapper || !carousel) return;

    const cards = carousel.querySelectorAll('.produtos__card');
    if (!cards.length) return;

    // --- Estado ---
    let isVertical = window.innerWidth >= 1024;
    let autoSpeed = isVertical ? 0.6 : 0.8; // px por frame
    let scrollPos = 0;
    let isDragging = false;
    let dragStart = 0;
    let dragScrollStart = 0;
    let animationId = null;
    let resumeTimeout = null;
    let isPaused = false;
    let totalOriginal = 0; // tamanho do bloco original (metade)
    let velocity = 0;
    let lastDragPos = 0;
    let lastDragTime = 0;

    // --- Calcular dimensões ---
    function measure() {
        isVertical = window.innerWidth >= 1024;
        autoSpeed = isVertical ? 0.6 : 0.8;

        if (isVertical) {
            const gap = parseFloat(getComputedStyle(carousel).gap) || 24;
            const cardCount = cards.length / 2; // metade são originais
            let sum = 0;
            for (let i = 0; i < cardCount; i++) {
                sum += cards[i].offsetHeight + gap;
            }
            totalOriginal = sum;
        } else {
            const gap = parseFloat(getComputedStyle(carousel).gap) || 16;
            const cardCount = cards.length / 2;
            let sum = 0;
            for (let i = 0; i < cardCount; i++) {
                sum += cards[i].offsetWidth + gap;
            }
            totalOriginal = sum;
        }
    }

    // --- Aplicar posição ---
    function applyPosition() {
        if (isVertical) {
            carousel.style.transform = `translateY(${-scrollPos}px)`;
        } else {
            carousel.style.transform = `translateX(${-scrollPos}px)`;
        }
    }

    // --- Loop infinito: resetar posição ---
    function wrapPosition() {
        if (totalOriginal <= 0) return;
        if (scrollPos >= totalOriginal) {
            scrollPos -= totalOriginal;
        } else if (scrollPos < 0) {
            scrollPos += totalOriginal;
        }
    }

    // --- Auto-scroll ---
    function tick() {
        if (!isDragging && !isPaused) {
            scrollPos += autoSpeed;
            wrapPosition();
            applyPosition();
        }
        animationId = requestAnimationFrame(tick);
    }

    // --- Pausar e retomar ---
    function pause() {
        isPaused = true;
        clearTimeout(resumeTimeout);
    }

    function scheduleResume(delay = 2000) {
        clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(() => {
            isPaused = false;
        }, delay);
    }

    // --- Coordenada do evento (mouse ou touch) ---
    function getEventPos(e) {
        if (e.touches && e.touches.length > 0) {
            return isVertical ? e.touches[0].clientY : e.touches[0].clientX;
        }
        return isVertical ? e.clientY : e.clientX;
    }

    // --- DRAG / SWIPE ---
    function onPointerDown(e) {
        // Ignorar cliques em links/botões
        if (e.target.closest('a, button')) return;

        isDragging = true;
        pause();
        velocity = 0;

        dragStart = getEventPos(e);
        dragScrollStart = scrollPos;
        lastDragPos = dragStart;
        lastDragTime = Date.now();

        carousel.style.transition = 'none';
        wrapper.style.cursor = 'grabbing';
        carousel.style.cursor = 'grabbing';

        // Prevenir seleção de texto no desktop
        if (e.type === 'mousedown') {
            e.preventDefault();
        }
    }

    function onPointerMove(e) {
        if (!isDragging) return;

        const pos = getEventPos(e);
        const delta = dragStart - pos;

        scrollPos = dragScrollStart + delta;
        wrapPosition();
        applyPosition();

        // Calcular velocidade para inércia
        const now = Date.now();
        const dt = now - lastDragTime;
        if (dt > 0) {
            velocity = (pos - lastDragPos) / dt; // px/ms
        }
        lastDragPos = pos;
        lastDragTime = now;
    }

    function onPointerUp() {
        if (!isDragging) return;
        isDragging = false;

        wrapper.style.cursor = '';
        carousel.style.cursor = '';

        // Inércia suave
        applyInertia();
    }

    function applyInertia() {
        const friction = 0.94;
        let vel = -velocity * 16; // converter px/ms para px/frame (~16ms)

        function inertiaStep() {
            if (Math.abs(vel) < 0.3) {
                scheduleResume(1500);
                return;
            }
            scrollPos += vel;
            vel *= friction;
            wrapPosition();
            applyPosition();
            requestAnimationFrame(inertiaStep);
        }

        if (Math.abs(vel) > 0.5) {
            requestAnimationFrame(inertiaStep);
        } else {
            scheduleResume(1500);
        }
    }

    // --- Event listeners ---
    // Mouse (desktop)
    wrapper.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // Touch (mobile)
    wrapper.addEventListener('touchstart', onPointerDown, { passive: true });
    wrapper.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        // Prevenir scroll da página ao arrastar o carrossel
        e.preventDefault();
        onPointerMove(e);
    }, { passive: false });
    wrapper.addEventListener('touchend', onPointerUp);
    wrapper.addEventListener('touchcancel', onPointerUp);

    // Resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            measure();
            wrapPosition();
            applyPosition();
        }, 200);
    });

    // --- Iniciar ---
    measure();
    applyPosition();
    animationId = requestAnimationFrame(tick);
}

export { initProdutosCarousel };
