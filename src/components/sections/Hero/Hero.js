/**
 * Hero Rotating Words — GSAP
 * Cicla os nomes dos produtos com animação de clip-path + glow
 */

import './Hero.css';

class TrueFocusAnimation {
    constructor(selector = '[data-animation="products"]') {
        this.container = document.querySelector(selector);
        if (!this.container) return;

        /* eslint-disable no-undef */
        if (typeof gsap === 'undefined') {
            console.warn('GSAP não encontrado — animação do hero desativada.');
            return;
        }

        this.words  = Array.from(this.container.querySelectorAll('.rotating-word'));
        if (this.words.length === 0) return;

        this.current  = 0;
        this.busy     = false;
        this.timer    = null;

        this._init();
    }

    /* ─── setup ─────────────────────────────────────────── */
    _init() {
        // Todas as palavras começam invisíveis / deslocadas para baixo
        gsap.set(this.words, {
            opacity: 0,
            y:       22,
            scale:   1.06,
        });

        // Primeira palavra entra com atraso suave
        gsap.to(this.words[0], {
            opacity:  1,
            y:        0,
            scale:    1,
            duration: 0.5,
            ease:     'power3.out',
            delay:    0.3,
            onComplete: () => this._schedule(),
        });
    }

    /* ─── ciclo ──────────────────────────────────────────── */
    _schedule() {
        this.timer = setTimeout(() => this._rotate(), 2000);
    }

    _rotate() {
        if (this.busy) return;
        this.busy = true;

        const outWord = this.words[this.current];
        this.current  = (this.current + 1) % this.words.length;
        const inWord  = this.words[this.current];

        // Saída: sobe e desaparece
        gsap.to(outWord, {
            opacity:  0,
            y:       -20,
            scale:    0.94,
            duration: 0.25,
            ease:    'power2.in',
        });

        // Entrada: vem de baixo
        gsap.fromTo(
            inWord,
            { opacity: 0, y: 20, scale: 1.06 },
            {
                opacity:  1,
                y:        0,
                scale:    1,
                duration: 0.4,
                ease:    'power3.out',
                delay:    0.18,
                onComplete: () => {
                    this.busy = false;
                    this._schedule();
                },
            }
        );
    }

    destroy() {
        if (this.timer) clearTimeout(this.timer);
    }
}

export default TrueFocusAnimation;
