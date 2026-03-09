/* =====================================================
   ANIMATIONS JS - FLORAMAZONIA
   Animacoes GSAP + ScrollTrigger
   ===================================================== */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initAnimations() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });

  const toArray = gsap.utils.toArray;

  /* ===== UTILITARIOS ===== */

  const reveal = (targets, trigger, options = {}) => {
    const normalizedTargets = Array.isArray(targets)
      ? targets.join(",")
      : targets;
    const items = toArray(normalizedTargets);
    if (!items.length) return;

    gsap.set(items, {
      autoAlpha: 0,
      y: options.y ?? 36,
      x: options.x ?? 0,
      scale: options.scale ?? 1,
      rotateZ: options.rotate ?? 0,
      force3D: true,
      willChange: "transform, opacity",
    });

    gsap.to(items, {
      autoAlpha: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotateZ: 0,
      duration: options.duration ?? 0.85,
      stagger: options.stagger ?? 0.1,
      ease: options.ease ?? "power2.out",
      clearProps: "will-change,transform,opacity,visibility",
      scrollTrigger: {
        trigger: trigger || items[0],
        start: options.start || "top 82%",
        once: true,
      },
    });
  };

  const revealWords = (selector, options = {}) => {
    toArray(selector).forEach((el) => {
      if (!el || el.dataset.gsapWords === "1") return;
      const text = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (!text) return;

      const words = text.split(" ");
      const fragment = document.createDocumentFragment();
      words.forEach((word, idx) => {
        const wrap = document.createElement("span");
        const inner = document.createElement("span");
        wrap.style.display = "inline-block";
        wrap.style.overflow = "hidden";
        wrap.style.verticalAlign = "bottom";
        inner.style.display = "inline-block";
        inner.className = "gsap-word-item";
        inner.textContent = word;
        wrap.appendChild(inner);
        fragment.appendChild(wrap);
        if (idx < words.length - 1)
          fragment.appendChild(document.createTextNode(" "));
      });

      el.textContent = "";
      el.appendChild(fragment);
      el.dataset.gsapWords = "1";

      const wordItems = el.querySelectorAll(".gsap-word-item");
      gsap.set(wordItems, {
        yPercent: 120,
        autoAlpha: 0,
        force3D: true,
        willChange: "transform, opacity",
      });

      gsap.to(wordItems, {
        yPercent: 0,
        autoAlpha: 1,
        duration: options.duration ?? 0.75,
        stagger: options.stagger ?? 0.045,
        ease: options.ease ?? "power3.out",
        clearProps: "will-change,transform,opacity,visibility",
        scrollTrigger: {
          trigger: options.trigger || el,
          start: options.start || "top 84%",
          once: true,
        },
      });
    });
  };

  const enableTilt = (selector, intensity = 10) => {
    const cleanups = [];
    toArray(selector).forEach((el) => {
      if (!el || el.dataset.gsapTilt === "1") return;
      el.dataset.gsapTilt = "1";
      let rect = el.getBoundingClientRect();
      const setRotateX = gsap.quickTo(el, "rotationX", {
        duration: 0.35,
        ease: "power3.out",
      });
      const setRotateY = gsap.quickTo(el, "rotationY", {
        duration: 0.35,
        ease: "power3.out",
      });
      const setY = gsap.quickTo(el, "y", {
        duration: 0.35,
        ease: "power3.out",
      });

      el.style.transformStyle = "preserve-3d";

      const onMove = (event) => {
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        setRotateY(px * intensity);
        setRotateX(py * -intensity);
        setY(-4);
      };

      const onEnter = () => {
        rect = el.getBoundingClientRect();
        el.style.willChange = "transform";
      };

      const onLeave = () => {
        setRotateX(0);
        setRotateY(0);
        setY(0);
        gsap.delayedCall(0.4, () => {
          if (!el.matches(":hover")) el.style.willChange = "";
        });
      };

      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);

      cleanups.push(() => {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        delete el.dataset.gsapTilt;
        gsap.set(el, { clearProps: "transform,will-change" });
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  };

  const enableMagnetic = (selector, distance = 8) => {
    const cleanups = [];
    toArray(selector).forEach((el) => {
      if (!el || el.dataset.gsapMagnetic === "1") return;
      el.dataset.gsapMagnetic = "1";
      let rect = el.getBoundingClientRect();
      const setX = gsap.quickTo(el, "x", { duration: 0.3, ease: "power2.out" });
      const setY = gsap.quickTo(el, "y", { duration: 0.3, ease: "power2.out" });

      const onMove = (event) => {
        const rx = (event.clientX - rect.left) / rect.width - 0.5;
        const ry = (event.clientY - rect.top) / rect.height - 0.5;
        setX(rx * distance);
        setY(ry * distance);
      };

      const onEnter = () => {
        rect = el.getBoundingClientRect();
        el.style.willChange = "transform";
      };

      const onLeave = () => {
        setX(0);
        setY(0);
        gsap.delayedCall(0.35, () => {
          if (!el.matches(":hover")) el.style.willChange = "";
        });
      };

      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);

      cleanups.push(() => {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        delete el.dataset.gsapMagnetic;
        gsap.set(el, { clearProps: "transform,will-change" });
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  };

  /* ===== HERO STATS COUNTER ===== */

  const animateHeroStats = () => {
    toArray(".hero__stat-number").forEach((el) => {
      const original = (el.textContent || "").trim();
      const hasPlus = original.startsWith("+");
      const hasPercent = original.includes("%");
      const hasGrouping = original.includes(".");
      const endValue = Number((original.match(/\d+/g) || []).join(""));
      if (!endValue) return;

      const counter = { value: 0 };
      gsap.to(counter, {
        value: endValue,
        duration: 1.25,
        ease: "power2.out",
        onUpdate: () => {
          const rounded = Math.round(counter.value);
          const formatted = hasGrouping
            ? rounded.toLocaleString("pt-BR")
            : String(rounded);
          el.textContent = `${hasPlus ? "+" : ""}${formatted}${hasPercent ? "%" : ""}`;
        },
      });
    });
  };

  /* ===== HERO TIMELINE ===== */

  const heroTl = gsap.timeline({ defaults: { ease: "power2.out" } });
  heroTl
    .from(
      ".hero__background-image",
      { scale: 1.08, duration: 1.35, transformOrigin: "50% 35%" },
      0,
    )
    .from(".hero__background-overlay", { autoAlpha: 0, duration: 0.9 }, 0)
    .from(".hero__badge", { y: 24, autoAlpha: 0, duration: 0.55 }, 0.15)
    .from(".hero__title", { y: 38, autoAlpha: 0, duration: 0.7 }, 0.24)
    .from(".hero__subtitle", { y: 24, autoAlpha: 0, duration: 0.58 }, 0.34)
    .fromTo(
      ".hero__actions .hero__btn",
      { y: 18, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        stagger: 0.08,
        duration: 0.5,
        immediateRender: false,
        clearProps: "opacity,visibility,transform",
      },
      0.45,
    )
    .from(
      ".hero__stats .hero__stat, .hero__stats .hero__stat-divider",
      { y: 14, autoAlpha: 0, stagger: 0.05, duration: 0.42 },
      0.55,
    )
    .from(".hero__image", { x: 34, autoAlpha: 0, duration: 0.82 }, 0.3)
    .from(
      ".hero__scroll-indicator",
      { y: 18, autoAlpha: 0, duration: 0.45 },
      0.9,
    );
  heroTl.add(() => animateHeroStats(), 0.56);

  // Garantia visual: evita estado travado em opacity 0 nos CTAs do hero
  gsap.set(".hero__actions .hero__btn", { autoAlpha: 1 });

  /* ===== LOOPING ANIMATIONS ===== */

  gsap.to(".hero__scroll-indicator", {
    y: -10,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
  gsap.to(".hero__scroll-wheel", {
    y: 6,
    autoAlpha: 0.35,
    duration: 1.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
  gsap.to(".sobre__badge", {
    y: -6,
    rotate: -1.4,
    duration: 2.6,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
  gsap.to(".sobre__splash-image", {
    y: -10,
    rotate: 2.2,
    duration: 3.4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
  gsap.to(".depoimentos__arara", {
    y: -12,
    duration: 3.0,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
  gsap.to(".whatsapp-float__button", {
    y: -6,
    duration: 1.9,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  /* ===== REVEAL WORDS - TITULOS ===== */

  revealWords(".sobre__title", {
    trigger: "#sobre",
    start: "top 84%",
    stagger: 0.05,
  });
  revealWords(".marcas__title", {
    trigger: "#marcas",
    start: "top 84%",
    stagger: 0.05,
  });
  revealWords(".beneficios__title", {
    trigger: "#beneficios",
    start: "top 84%",
    stagger: 0.05,
  });
  revealWords(".depoimentos__title", {
    trigger: "#depoimentos",
    start: "top 84%",
    stagger: 0.05,
  });
  revealWords(".faq__title", {
    trigger: "#faq",
    start: "top 84%",
    stagger: 0.05,
  });
  revealWords(".localizacao__title", {
    trigger: "#localizacao",
    start: "top 84%",
    stagger: 0.05,
  });

  /* ===== REVEAL - SOBRE ===== */

  reveal(".sobre__image-wrapper", "#sobre", {
    x: -30,
    y: 34,
    scale: 0.96,
    duration: 1.0,
  });
  reveal([".sobre__subtitle", ".sobre__text", ".sobre__btn"], "#sobre", {
    y: 28,
    stagger: 0.09,
  });
  reveal(".sobre__feature", "#sobre", {
    x: 20,
    y: 18,
    stagger: 0.07,
    start: "top 74%",
  });

  /* ===== REVEAL - PRODUTOS ===== */

  reveal(".produtos__content > *:not(.produtos__title)", "#produtos", {
    y: 30,
    stagger: 0.08,
  });
  reveal(".produtos__card", "#produtos", {
    y: 24,
    scale: 0.97,
    rotate: -1.1,
    stagger: 0.06,
    start: "top 76%",
  });

  /* ===== REVEAL - MARCAS ===== */

  reveal([".marcas__tag", ".marcas__subtitle"], "#marcas", {
    y: 24,
    stagger: 0.08,
  });
  reveal(".logoloop__item", "#marcas", {
    y: 18,
    scale: 0.96,
    stagger: 0.04,
    start: "top 80%",
  });

  /* ===== REVEAL - BENEFICIOS ===== */

  reveal([".beneficios__tag", ".beneficios__subtitle"], "#beneficios", {
    y: 26,
    stagger: 0.08,
  });
  reveal(".beneficios__card", "#beneficios", {
    y: 28,
    scale: 0.97,
    rotate: -0.8,
    stagger: 0.08,
    start: "top 78%",
  });

  /* ===== REVEAL - DEPOIMENTOS ===== */

  reveal([".depoimentos__tag", ".depoimentos__subtitle"], "#depoimentos", {
    y: 24,
    stagger: 0.08,
  });
  reveal(".depoimentos__grid", "#depoimentos", {
    y: 22,
    scale: 0.98,
    start: "top 74%",
  });
  reveal(".depoimentos__cta-wrapper", "#depoimentos", {
    y: 20,
    scale: 0.98,
    start: "top 72%",
  });

  const depoTrack = document.querySelector(".depoimentos__carousel-track");
  const depoViewport = document.querySelector(".depoimentos__grid");
  if (depoTrack && depoViewport) {
    gsap.set(depoTrack, {
      xPercent: 0,
      force3D: true,
      willChange: "transform",
    });

    const marqueeDuration = window.innerWidth < 768 ? 72 : 60;
    const marqueeTween = gsap.to(depoTrack, {
      xPercent: -50,
      ease: "none",
      duration: marqueeDuration,
      repeat: -1,
      paused: true,
    });

    ScrollTrigger.create({
      trigger: "#depoimentos",
      start: "top 88%",
      end: "bottom top",
      onEnter: () => marqueeTween.play(),
      onEnterBack: () => marqueeTween.play(),
      onLeave: () => marqueeTween.pause(),
      onLeaveBack: () => marqueeTween.pause(),
    });

    depoViewport.addEventListener("mouseenter", () => marqueeTween.pause());
    depoViewport.addEventListener("mouseleave", () => marqueeTween.play());
    depoViewport.addEventListener("touchstart", () => marqueeTween.pause(), {
      passive: true,
    });
    depoViewport.addEventListener("touchend", () => marqueeTween.play(), {
      passive: true,
    });
  }

  /* ===== REVEAL - FAQ ===== */

  reveal([".faq__tag", ".faq__subtitle"], "#faq", { y: 24, stagger: 0.08 });
  reveal(".faq__item", "#faq", {
    x: 20,
    y: 22,
    stagger: 0.08,
    start: "top 78%",
  });
  reveal(".faq__cta", "#faq", { y: 20, scale: 0.98, start: "top 74%" });

  /* ===== REVEAL - LOCALIZACAO ===== */

  reveal([".localizacao__tag", ".localizacao__text"], "#localizacao", {
    y: 24,
    stagger: 0.08,
  });
  reveal(".localizacao__item", "#localizacao", {
    x: 18,
    y: 20,
    stagger: 0.08,
    start: "top 78%",
  });
  reveal(".localizacao__map", "#localizacao", {
    y: 22,
    scale: 0.98,
    duration: 0.9,
    start: "top 78%",
  });

  /* ===== REVEAL - CTA FINAL ===== */

  reveal(
    [".cta-final__tag", ".cta-final__title", ".cta-final__text"],
    "#contato",
    { y: 28, stagger: 0.08 },
  );
  reveal(".cta-final__benefit", "#contato", {
    x: 16,
    y: 18,
    stagger: 0.07,
    start: "top 78%",
  });
  reveal(".cta-final__form-wrapper", "#contato", {
    y: 22,
    scale: 0.98,
    duration: 0.9,
    start: "top 78%",
  });

  /* ===== REVEAL - FOOTER ===== */

  reveal(
    ".footer__logo-wrapper, .footer__nav, .footer__hours-card, .footer__bottom",
    "#footer",
    { y: 24, stagger: 0.1, start: "top 86%" },
  );

  /* ===== DESKTOP INTERACOES ===== */

  const mm = gsap.matchMedia();
  mm.add("(min-width: 992px) and (pointer: fine)", () => {
    const cleanupTiltBenefits = enableTilt(".beneficios__card", 8);
    const cleanupTiltProducts = enableTilt(".produtos__card", 7);
    const cleanupTiltTestimonials = enableTilt(".depoimentos__card", 5);
    const cleanupMagnetic = enableMagnetic(
      ".hero__btn, .header__cta, .sobre__btn, .produtos__btn, .depoimentos__cta-btn, .faq__cta-btn, .cta-final__form-submit",
      7,
    );

    const heroSection = document.querySelector("#hero");
    const heroContent = document.querySelector(".hero__content");
    const heroVisual = document.querySelector(".hero__image-wrapper");
    if (!heroSection || !heroContent || !heroVisual) {
      return () => {
        cleanupTiltBenefits();
        cleanupTiltProducts();
        cleanupTiltTestimonials();
        cleanupMagnetic();
      };
    }

    const moveContentX = gsap.quickTo(heroContent, "x", {
      duration: 0.45,
      ease: "power3.out",
    });
    const moveContentY = gsap.quickTo(heroContent, "y", {
      duration: 0.45,
      ease: "power3.out",
    });
    const moveVisualX = gsap.quickTo(heroVisual, "x", {
      duration: 0.45,
      ease: "power3.out",
    });
    const moveVisualY = gsap.quickTo(heroVisual, "y", {
      duration: 0.45,
      ease: "power3.out",
    });

    const resetHeroPointer = () => {
      moveContentX(0);
      moveContentY(0);
      moveVisualX(0);
      moveVisualY(0);
    };

    const onPointerMove = (event) => {
      const rect = heroSection.getBoundingClientRect();
      if (event.clientY < rect.top || event.clientY > rect.bottom) {
        resetHeroPointer();
        return;
      }
      const px = event.clientX / window.innerWidth - 0.5;
      const py = event.clientY / window.innerHeight - 0.5;
      moveContentX(px * -10);
      moveContentY(py * -6);
      moveVisualX(px * 14);
      moveVisualY(py * 10);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", resetHeroPointer);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", resetHeroPointer);
      resetHeroPointer();
      cleanupTiltBenefits();
      cleanupTiltProducts();
      cleanupTiltTestimonials();
      cleanupMagnetic();
    };
  });

  /* ===== PARALLAX BACKGROUNDS ===== */

  toArray(
    ".hero__background-image, .produtos__background-image, .cta-final__bg-image, .footer__background-image",
  ).forEach((bg) => {
    const trigger = bg.closest("section, footer") || bg;
    gsap.fromTo(
      bg,
      { y: -16 },
      {
        y: 16,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.1,
        },
      },
    );
  });

  window.addEventListener("load", () => ScrollTrigger.refresh(), {
    once: true,
  });
}
