/* =====================================================
   ESTATÍSTICAS - JAVASCRIPT
   ===================================================== */

function initEstatisticas() {
    const section = document.querySelector('.estatisticas');
    if (!section) return;

    const cards = section.querySelectorAll('.estatisticas__card');
    
    // Adiciona as estrelas dinamicamente
    addStarsToCards(cards);
    
    // Variáveis de controle
    let hasStartedCounting = false;

    // Função para animar a contagem
    function animateCount(card) {
        const numberElement = card.querySelector('.estatisticas__number');
        const target = parseInt(card.dataset.target);
        const duration = 2000; // 2 segundos
        const startTime = performance.now();
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing out cubic para desacelerar no final
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);
            
            // Formata números grandes
            if (target >= 1000) {
                numberElement.textContent = current.toLocaleString('pt-BR');
            } else {
                numberElement.textContent = current;
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                // Quando termina a contagem, adiciona a classe para mostrar as estrelas
                card.classList.add('counted');
            }
        }
        
        requestAnimationFrame(updateNumber);
    }

    // Função para iniciar a contagem quando a seção estiver visível
    function checkAndStartCounting() {
        if (hasStartedCounting) return;
        
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Inicia a contagem quando 50% da seção está visível
        if (rect.top < windowHeight * 0.5 && rect.bottom > 0) {
            hasStartedCounting = true;
            
            // Anima cada card com um pequeno delay
            cards.forEach((card, index) => {
                setTimeout(() => {
                    animateCount(card);
                }, index * 200);
            });
        }
    }

    // Função para resetar a contagem quando sair da seção
    function checkAndResetCounting() {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Se a seção saiu completamente da viewport
        if (rect.bottom < 0 || rect.top > windowHeight) {
            if (hasStartedCounting) {
                hasStartedCounting = false;
                
                // Reseta os cards
                cards.forEach(card => {
                    const numberElement = card.querySelector('.estatisticas__number');
                    numberElement.textContent = '0';
                    card.classList.remove('counted');
                });
            }
        }
    }

    // Listener de scroll otimizado
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                checkAndStartCounting();
                checkAndResetCounting();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Atualiza na carga inicial
    checkAndStartCounting();
}

// Função para adicionar as estrelas aos cards
function addStarsToCards(cards) {
    const starSVG = `<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    
    cards.forEach(card => {
        const starsLeft = card.querySelector('.estatisticas__stars--left');
        const starsRight = card.querySelector('.estatisticas__stars--right');
        
        // Adiciona 3 estrelas em cada lado
        for (let i = 0; i < 3; i++) {
            const starLeft = document.createElement('span');
            starLeft.className = 'estatisticas__star';
            starLeft.innerHTML = starSVG;
            starsLeft.appendChild(starLeft);
            
            const starRight = document.createElement('span');
            starRight.className = 'estatisticas__star';
            starRight.innerHTML = starSVG;
            starsRight.appendChild(starRight);
        }
    });
}

// Exporta para uso modular
export { initEstatisticas };
