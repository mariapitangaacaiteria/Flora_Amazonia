/* =====================================================
   GALERIA - JAVASCRIPT
   ===================================================== */

function initGaleria() {
    const carousel = document.querySelector('.galeria__carousel');
    const track = document.querySelector('.galeria__track');
    const prevBtn = document.querySelector('.galeria__nav--prev');
    const nextBtn = document.querySelector('.galeria__nav--next');
    const cards = document.querySelectorAll('.galeria__card');
    
    if (!carousel || !track || cards.length === 0) return;

    let isPaused = false;
    let isDragging = false;
    let currentPosition = 0;
    let animationId = null;
    const speed = 0.5; // pixels por frame (velocidade suave)

    // Função para obter a largura total de uma volta completa (metade dos cards = originais)
    function getTotalWidth() {
        const card = cards[0];
        if (!card) return 0;
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap) || 32;
        const cardWidth = card.offsetWidth;
        const totalCards = Math.floor(cards.length / 2); // Metade são duplicados
        return totalCards * (cardWidth + gap);
    }

    // Aplica posição SEM transição (para reset invisível do loop)
    function applyPosition(useTransition = false) {
        track.style.transition = useTransition ? 'transform 0.5s ease' : 'none';
        track.style.transform = `translateX(${currentPosition}px)`;
    }

    // Função de animação contínua suave - loop infinito sem "pulo"
    function animate() {
        if (!isPaused) {
            currentPosition -= speed;
            const totalWidth = getTotalWidth();
            
            // Loop infinito: quando passar do fim da primeira cópia, volta invisivelmente
            if (totalWidth > 0 && currentPosition <= -totalWidth) {
                currentPosition += totalWidth; // Wrap suave - posição equivalente
                applyPosition(false); // Reset instantâneo (sem transição)
            } else {
                track.style.transition = 'none';
                track.style.transform = `translateX(${currentPosition}px)`;
            }
        }
        
        animationId = requestAnimationFrame(animate);
    }

    // Função para avançar manualmente
    function nextSlide() {
        const card = cards[0];
        if (!card) return;
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap) || 32;
        const cardWidth = card.offsetWidth + gap;
        const totalWidth = getTotalWidth();
        
        currentPosition -= cardWidth;
        
        // Se passou do fim, faz reset invisível (sem animação)
        if (totalWidth > 0 && currentPosition <= -totalWidth) {
            currentPosition += totalWidth;
            applyPosition(false);
            void track.offsetHeight; // Força reflow
        }
        
        applyPosition(true);
        setTimeout(() => {
            track.style.transition = 'none';
        }, 500);
    }

    // Função para voltar manualmente
    function prevSlide() {
        const card = cards[0];
        if (!card) return;
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap) || 32;
        const cardWidth = card.offsetWidth + gap;
        const totalWidth = getTotalWidth();
        
        currentPosition += cardWidth;
        
        // Se passou do início, pula para o fim (equivalente visual)
        if (currentPosition > 0) {
            currentPosition = -totalWidth + cardWidth;
            applyPosition(false);
            void track.offsetHeight;
        }
        
        applyPosition(true);
        setTimeout(() => {
            track.style.transition = 'none';
        }, 500);
    }

    // Event listeners dos botões (mobile)
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isPaused = true;
            prevSlide();
            setTimeout(() => { isPaused = false; }, 3000);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isPaused = true;
            nextSlide();
            setTimeout(() => { isPaused = false; }, 3000);
        });
    }

    // Desktop: arrastar com mouse (segurar e arrastar)
    let dragStartX = 0;
    let dragStartPosition = 0;

    carousel.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Apenas botão esquerdo
        isDragging = true;
        isPaused = true;
        dragStartX = e.clientX;
        dragStartPosition = currentPosition;
        carousel.classList.add('galeria__carousel--dragging');
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const delta = dragStartX - e.clientX; // Arrastar p/ direita = avançar
        currentPosition = dragStartPosition - delta;
        applyPosition(false);
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        carousel.classList.remove('galeria__carousel--dragging');
        const totalWidth = getTotalWidth();
        if (totalWidth > 0) {
            while (currentPosition > 0) currentPosition -= totalWidth;
            while (currentPosition <= -totalWidth) currentPosition += totalWidth;
        }
        applyPosition(false);
        setTimeout(() => { isPaused = false; }, 1500);
    });

    // Suporte a touch/swipe para mobile (arrastar)
    let touchStartX = 0;
    let touchStartPosition = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartPosition = currentPosition;
        isPaused = true;
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
        const delta = touchStartX - e.touches[0].clientX;
        currentPosition = touchStartPosition - delta;
        applyPosition(false);
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        const totalWidth = getTotalWidth();
        if (totalWidth > 0) {
            while (currentPosition > 0) currentPosition -= totalWidth;
            while (currentPosition <= -totalWidth) currentPosition += totalWidth;
        }
        applyPosition(false);
        setTimeout(() => { isPaused = false; }, 1500);
    }, { passive: true });

    // Inicia a animação
    animate();
}

// Exporta para uso modular
export { initGaleria };
