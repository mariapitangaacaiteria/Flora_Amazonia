/**
 * TextType - Vanilla JavaScript Typing Animation
 * Adapts React TextType component for vanilla JS
 */

class TextType {
  constructor(element, options = {}) {
    this.element = element;
    this.originalText = element.textContent;
    
    // Usar options.text se foi passado, senão usar conteúdo do elemento
    const textSource = options.text || this.originalText;
    this.textArray = Array.isArray(textSource) ? textSource : [textSource];
    
    this.typingSpeed = options.typingSpeed || 50;
    this.initialDelay = options.initialDelay || 0;
    this.pauseDuration = options.pauseDuration || 2000;
    this.deletingSpeed = options.deletingSpeed || 30;
    this.loop = options.loop !== false;
    this.showCursor = options.showCursor !== false;
    this.cursorCharacter = options.cursorCharacter || '|';
    this.cursorClassName = options.cursorClassName || '';
    this.cursorBlinkDuration = options.cursorBlinkDuration || 0.5;
    this.variableSpeed = options.variableSpeed || null;
    this.onAnimationComplete = options.onAnimationComplete || null;
    this.startOnVisible = options.startOnVisible || false;

    this.displayedText = '';
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.currentTextIndex = 0;
    this.isVisible = !this.startOnVisible;
    this.isRunning = false;

    this.init();
  }

  init() {
    // Limpar o conteúdo do elemento
    this.element.textContent = '';
    
    this.createCursor();
    
    if (this.startOnVisible) {
      this.observeVisibility();
    } else {
      setTimeout(() => this.startAnimation(), 100);
    }
  }

  createCursor() {
    if (!this.showCursor) return;
    
    this.cursor = document.createElement('span');
    this.cursor.className = `text-type__cursor ${this.cursorClassName}`;
    this.cursor.textContent = this.cursorCharacter;
    this.cursor.style.display = 'inline-block';
    this.cursor.style.marginLeft = '2px';
    
    this.element.appendChild(this.cursor);

    // Blink animation with GSAP if available
    if (window.gsap) {
      gsap.to(this.cursor, {
        opacity: 0,
        duration: this.cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }
  }

  observeVisibility() {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.isRunning) {
            this.isVisible = true;
            this.startAnimation();
            observer.unobserve(this.element);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(this.element);
  }

  startAnimation() {
    this.isRunning = true;
    this.animate();
  }

  getRandomSpeed() {
    if (!this.variableSpeed) return this.typingSpeed;
    const { min, max } = this.variableSpeed;
    return Math.random() * (max - min) + min;
  }

  animate() {
    const currentText = this.textArray[this.currentTextIndex];

    if (this.isDeleting) {
      if (this.displayedText === '') {
        this.isDeleting = false;
        
        if (this.currentTextIndex === this.textArray.length - 1 && !this.loop) {
          this.onComplete();
          return;
        }

        this.currentTextIndex = (this.currentTextIndex + 1) % this.textArray.length;
        this.currentCharIndex = 0;
        setTimeout(() => this.animate(), this.pauseDuration);
      } else {
        this.displayedText = this.displayedText.slice(0, -1);
        this.updateDisplay();
        setTimeout(() => this.animate(), this.deletingSpeed);
      }
    } else {
      if (this.currentCharIndex < currentText.length) {
        this.displayedText += currentText[this.currentCharIndex];
        this.currentCharIndex++;
        this.updateDisplay();
        
        const speed = this.variableSpeed ? this.getRandomSpeed() : this.typingSpeed;
        setTimeout(() => this.animate(), speed);
      } else {
        // Animation complete for this text
        if (this.textArray.length === 1 && !this.loop) {
          this.onComplete();
        } else {
          setTimeout(() => {
            this.isDeleting = true;
            this.animate();
          }, this.pauseDuration);
        }
      }
    }
  }

  updateDisplay() {
    // Clear the element
    this.element.textContent = '';
    
    // Add the displayed text
    if (this.displayedText) {
      const textNode = document.createTextNode(this.displayedText);
      this.element.appendChild(textNode);
    }
    
    // Re-append cursor if it exists
    if (this.cursor && this.showCursor) {
      this.element.appendChild(this.cursor);
    }
  }

  onComplete() {
    if (this.onAnimationComplete) {
      this.onAnimationComplete();
    }
  }

  destroy() {
    this.isRunning = false;
  }
}

if (typeof window !== 'undefined') {
  window.TextType = TextType;
}
