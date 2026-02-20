/**
 * True Focus Animation
 * Animação de foco blur nos textos "Açaí", "Gelato" e "Sorbet"
 */

class TrueFocusAnimation {
    constructor(selector = '[data-animation="products"]', options = {}) {
        this.container = document.querySelector(selector);
        if (!this.container) return;

        // Configurações
        this.animationDuration = options.animationDuration || 0.5; // segundos
        this.pauseBetweenAnimations = options.pauseBetweenAnimations || 1; // segundos
        this.blurAmount = options.blurAmount || 5; // px

        // Estado
        this.words = [];
        this.wordRefs = [];
        this.currentIndex = 0;
        this.animationInterval = null;

        this.init();
    }

    init() {
        // Extrair palavras
        this.words = Array.from(this.container.querySelectorAll('.focus-word')).map(el => el.textContent.trim());
        this.wordRefs = Array.from(this.container.querySelectorAll('.focus-word'));

        // Criar frame de animação
        this.createFocusFrame();

        // Iniciar animação
        this.startAnimation();
    }

    createFocusFrame() {
        const frame = document.createElement('div');
        frame.className = 'focus-frame';
        frame.style.opacity = '0';
        frame.innerHTML = `
            <span class="corner top-left"></span>
            <span class="corner top-right"></span>
            <span class="corner bottom-left"></span>
            <span class="corner bottom-right"></span>
        `;
        this.container.appendChild(frame);
        this.focusFrame = frame;
    }

    updateFocusFrame() {
        if (this.currentIndex < 0 || this.currentIndex >= this.wordRefs.length) {
            this.focusFrame.style.opacity = '0';
            return;
        }

        const wordEl = this.wordRefs[this.currentIndex];
        const containerRect = this.container.getBoundingClientRect();
        const wordRect = wordEl.getBoundingClientRect();

        // Calcular posição relativa ao container
        const x = wordRect.left - containerRect.left;
        const y = wordRect.top - containerRect.top;
        const width = wordRect.width;
        const height = wordRect.height;

        // Aplicar estilos com transição suave
        this.focusFrame.style.transition = `all ${this.animationDuration}s ease`;
        this.focusFrame.style.left = `${x}px`;
        this.focusFrame.style.top = `${y}px`;
        this.focusFrame.style.width = `${width}px`;
        this.focusFrame.style.height = `${height}px`;
        this.focusFrame.style.opacity = '1';

        // Remover classe blur de todos
        this.wordRefs.forEach((el, index) => {
            el.classList.remove('blur');
        });

        // Adicionar blur aos não-ativos
        this.wordRefs.forEach((el, index) => {
            if (index !== this.currentIndex) {
                el.classList.add('blur');
            }
        });
    }

    startAnimation() {
        // Actualizar frame inicial
        this.updateFocusFrame();

        // Iniciar loop
        this.animationInterval = setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.words.length;
            this.updateFocusFrame();
        }, (this.animationDuration + this.pauseBetweenAnimations) * 1000);
    }

    destroy() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
    }
}

// Exportado como módulo — inicialização feita em main.js
export default TrueFocusAnimation;
