/**
 * GradualBlur Animation - Vanilla JS Implementation
 * Replica exata do componente React com backdropFilter e máscaras
 */
class GradualBlurAnimation {
  constructor(container, config = {}) {
    this.container = container;
    this.config = {
      position: 'bottom',
      strength: 3,
      height: '10rem',
      divCount: 8,
      exponential: false,
      zIndex: 100,
      animated: true,
      duration: '0.3s',
      easing: 'ease-out',
      opacity: 1,
      curve: 'ease-out',
      responsive: false,
      target: 'parent',
      className: '',
      style: {},
      ...config
    };

    this.isHovered = false;
    this.isVisible = true;
    this.blurContainer = null;

    this.init();
  }

  /**
   * Curvas de interpolação
   */
  CURVE_FUNCTIONS = {
    linear: (p) => p,
    bezier: (p) => p * p * (3 - 2 * p),
    'ease-in': (p) => p * p,
    'ease-out': (p) => 1 - Math.pow(1 - p, 2),
    'ease-in-out': (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
  };

  getCurveFunc(curveName) {
    return this.CURVE_FUNCTIONS[curveName] || this.CURVE_FUNCTIONS.linear;
  }

  getGradientDirection() {
    const directions = {
      top: 'to top',
      bottom: 'to bottom',
      left: 'to left',
      right: 'to right'
    };
    return directions[this.config.position] || 'to bottom';
  }

  /**
   * Cria os divs de blur com backdropFilter (React original)
   */
  createBlurElements() {
    const { divCount, strength, exponential, curve, opacity, animated, duration, easing } = this.config;
    const increment = 100 / divCount;
    const curveFunc = this.getCurveFunc(curve);
    const direction = this.getGradientDirection();
    const currentStrength = this.isHovered && this.config.hoverIntensity 
      ? strength * this.config.hoverIntensity 
      : strength;

    for (let i = 1; i <= divCount; i++) {
      let progress = i / divCount;
      progress = curveFunc(progress);

      // Cálculo melhorado para blur mais perceptível
      let blurValue;
      if (exponential) {
        blurValue = Math.pow(2, progress * 5) * 0.15 * currentStrength;
      } else {
        blurValue = 0.15 * (progress * divCount + 3) * currentStrength;
      }

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.inset = '0';
      
      // Gradiente visual suave da cor roxo para transparente - MAIS INTENSO
      const colorIntensity = 0.25 + i * 0.08;
      const colorStart = `rgba(123, 45, 142, ${Math.min(colorIntensity, 0.6)})`;
      const colorEnd = 'rgba(123, 45, 142, 0)';
      
      div.style.background = `linear-gradient(${direction}, ${colorStart}, ${colorEnd})`;
      
      // Aplicar blur visual com filter - MUITO MAIS FORTE
      div.style.filter = `blur(${blurValue.toFixed(2)}px) saturate(1.1)`;
      div.style.opacity = Math.min(opacity * (1 - progress * 0.3), 1);
      div.style.pointerEvents = 'none';
      div.style.backdropFilter = `blur(${blurValue.toFixed(2)}px)`;

      if (animated && animated !== 'scroll') {
        div.style.transition = `all ${duration} ${easing}`;
      }

      this.blurContainer.appendChild(div);
    }
  }

  /**
   * Configura o container de blur com posicionamento correto
   */
  setupBlurContainer() {
    const { position, height, width, opacity, animated, duration, easing, zIndex, target } = this.config;
    const isVertical = ['top', 'bottom'].includes(position);
    const isHorizontal = ['left', 'right'].includes(position);
    const isPageTarget = target === 'page';

    this.blurContainer.style.position = isPageTarget ? 'fixed' : 'absolute';
    this.blurContainer.style.pointerEvents = 'none';
    this.blurContainer.style.zIndex = zIndex;
    this.blurContainer.style.opacity = '1';
    this.blurContainer.style.backgroundColor = 'transparent';

    if (animated && animated !== true) {
      this.blurContainer.style.transition = `opacity ${duration} ${easing}`;
    }

    if (isVertical) {
      this.blurContainer.style.height = height;
      this.blurContainer.style.width = width || '100%';
      this.blurContainer.style[position] = '0';
      this.blurContainer.style.left = '0';
      this.blurContainer.style.right = '0';
    } else if (isHorizontal) {
      this.blurContainer.style.width = width || height;
      this.blurContainer.style.height = '100%';
      this.blurContainer.style[position] = '0';
      this.blurContainer.style.top = '0';
      this.blurContainer.style.bottom = '0';
    }

  }

  /**
   * Inicializa tudo
   */
  init() {
    this.blurContainer = document.createElement('div');
    this.blurContainer.className = `gradual-blur ${this.config.target === 'page' ? 'gradual-blur-page' : 'gradual-blur-parent'} ${this.config.className}`;

    // Garantir posição relativa
    const computedStyle = window.getComputedStyle(this.container);
    if (computedStyle.position === 'static') {
      this.container.style.position = 'relative';
    }
    if (computedStyle.overflow !== 'hidden') {
      this.container.style.overflow = 'hidden';
    }

    this.container.insertBefore(this.blurContainer, this.container.firstChild);

    this.setupBlurContainer();
    this.createBlurElements();

    // Se animated é 'scroll', usar IntersectionObserver
    // Se animated é true, manter sempre visível
    if (this.config.animated === 'scroll') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          this.isVisible = entry.isIntersecting;
          this.blurContainer.style.opacity = this.isVisible ? this.config.opacity : 0;
        },
        { threshold: 0.1 }
      );
      observer.observe(this.container);
    } else if (this.config.animated === true) {
      this.isVisible = true;
      this.blurContainer.style.opacity = this.config.opacity;
    }

    // Hover intensity
    if (this.config.hoverIntensity && this.config.hoverIntensity > 1) {
      this.container.addEventListener('mouseenter', () => {
        this.isHovered = true;
        this.updateBlur();
      });
      this.container.addEventListener('mouseleave', () => {
        this.isHovered = false;
        this.updateBlur();
      });
    }
  }

  /**
   * Atualiza blur no hover (recalcula todos os valores)
   */
  updateBlur() {
    const { divCount, strength, exponential, curve, opacity } = this.config;
    const increment = 100 / divCount;
    const curveFunc = this.getCurveFunc(curve);
    const direction = this.getGradientDirection();
    const currentStrength = this.isHovered && this.config.hoverIntensity 
      ? strength * this.config.hoverIntensity 
      : strength;

    const divs = this.blurContainer.querySelectorAll('div');

    divs.forEach((div, index) => {
      const i = index + 1;
      let progress = i / divCount;
      progress = curveFunc(progress);

      let blurValue;
      if (exponential) {
        blurValue = Math.pow(2, progress * 4) * 0.0625 * currentStrength;
      } else {
        blurValue = 0.0625 * (progress * divCount + 1) * currentStrength;
      }

      div.style.backdropFilter = `blur(${blurValue.toFixed(3)}rem)`;
      div.style.WebkitBackdropFilter = `blur(${blurValue.toFixed(3)}rem)`;
      div.style.opacity = opacity;
    });
  }

  destroy() {
    if (this.blurContainer && this.blurContainer.parentNode) {
      this.blurContainer.parentNode.removeChild(this.blurContainer);
    }
  }
}

export { GradualBlurAnimation };
