/* =====================================================
   MAIN JS - FLORAMAZONIA
   Script principal de inicializacao
   ===================================================== */

/* ===== CSS IMPORTS ===== */
import "../styles/tailwind.css";
import "../styles/variables.css";
import "../styles/reset.css";
import "../styles/main.css";
import "../styles/animations.css";
import "../styles/textType.css";
import "../styles/responsive.css";
import "../components/common/Header/Header.css";
import "../components/common/WhatsAppButton/WhatsAppButton.css";
import "../components/sections/Beneficios/Beneficios.css";
import "../components/sections/CTA/CTA.css";
import "../components/sections/CTA/GradualBlur.css";
import "../components/sections/Estatisticas/Estatisticas.css";
import "../components/sections/FAQ/FAQ.css";
import "../components/sections/Footer/Footer.css";
import "../components/sections/Galeria/Galeria.css";
import "../components/sections/Localizacao/Localizacao.css";
import "../components/sections/Marcas/Marcas.css";
import "../components/sections/Produtos/Produtos.css";
import "../components/sections/Sobre/Sobre.css";
import "../components/sections/Depoimentos/Depoimentos.css";
/* Hero/Hero.css is imported inside Hero.js */

import { initFAQ } from "../components/sections/FAQ/FAQ.js";
import { initCTAForm } from "../components/sections/CTA/CTA.js";
import TrueFocusAnimation from "../components/sections/Hero/Hero.js";
import { initProdutosCarousel } from "../components/sections/Produtos/Produtos.js";
import { initAnimations } from "./animations.js";
import { WHATSAPP_NUMBER, CTA_DEFAULT_MESSAGE } from "../config/config.js";

// Inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initWhatsApp();
  initBlurText();
  new TrueFocusAnimation('[data-animation="products"]');
  initFAQ();
  initCTAForm();
  initProdutosCarousel();
  initAnimations();
});

/* ===== BLUR TEXT (FAQ) ===== */
function initBlurText() {
  const targets = document.querySelectorAll("[data-blur-text]");
  if (!targets.length) return;

  targets.forEach((target) => {
    const animateBy = target.dataset.animateBy || "words";
    const direction = target.dataset.direction || "top";
    const delay = Number(target.dataset.delay || 200);
    const stepDuration = Number(target.dataset.stepDuration || 0.35);
    const threshold = Number(target.dataset.threshold || 0.1);
    const rootMargin = target.dataset.rootMargin || "0px";

    const text = target.textContent.trim();
    if (!text) return;

    target.textContent = "";

    const segments = animateBy === "words" ? text.split(" ") : Array.from(text);

    segments.forEach((segment, index) => {
      const span = document.createElement("span");
      span.className = "blur-text__segment";
      span.textContent = segment === " " ? "\u00A0" : segment;

      if (animateBy === "words" && index < segments.length - 1) {
        span.textContent += "\u00A0";
      }

      target.appendChild(span);
    });

    const fromSnapshot =
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 };

    const toSnapshots = [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ];

    const steps = [fromSnapshot, ...toSnapshots].map((step) => ({
      filter: step.filter,
      opacity: step.opacity,
      transform: `translateY(${step.y}px)`,
    }));

    const stepCount = steps.length;
    const totalDuration = stepDuration * (stepCount - 1);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const items = Array.from(
          target.querySelectorAll(".blur-text__segment"),
        );
        items.forEach((item, index) => {
          item.animate(steps, {
            duration: totalDuration * 1000,
            delay: index * delay,
            easing: "ease",
            fill: "forwards",
          });
        });

        observer.unobserve(target);
      },
      { threshold, rootMargin },
    );

    observer.observe(target);
  });
}

/* ===== HEADER ===== */
function initHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // Adiciona classe quando scroll > 50px
    if (currentScrollY > 50) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // Verificar estado inicial
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
  const toggle = document.getElementById("mobile-toggle");
  const menu = document.getElementById("mobile-menu");
  const navLinks = document.querySelectorAll(".header__mobile-nav-link");

  if (!toggle || !menu) return;

  const openMenu = () => {
    toggle.classList.add("active");
    toggle.setAttribute("aria-expanded", "true");
    menu.classList.add("active");
    menu.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
  };

  const closeMenu = () => {
    toggle.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("active");
    menu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  };

  const toggleMenu = () => {
    if (menu.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  toggle.addEventListener("click", toggleMenu);

  // Fechar menu ao clicar em um link
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Fechar menu com tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("active")) {
      closeMenu();
    }
  });

  // Fechar menu ao redimensionar para desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024 && menu.classList.contains("active")) {
      closeMenu();
    }
  });
}

/* ===== SMOOTH SCROLL ===== */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.getElementById("header")?.offsetHeight || 0;
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      // Atualizar link ativo
      updateActiveLink(href);
    });
  });
}

/* ===== UPDATE ACTIVE LINK ===== */
function updateActiveLink(activeHref) {
  const navLinks = document.querySelectorAll(
    ".header__nav-link, .header__mobile-nav-link",
  );

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === activeHref) {
      link.classList.add("active");
    }
  });
}

/* ===== WHATSAPP ===== */
function initWhatsApp() {
  document.querySelectorAll("[data-whatsapp]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const message = encodeURIComponent(CTA_DEFAULT_MESSAGE);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    });
  });
}
