const header = document.getElementById("site-header");
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];
const leadForm = document.getElementById("lead-form");
const feedback = document.getElementById("form-feedback");
const leadSubmit = document.getElementById("lead-submit");
const currentYear = document.getElementById("current-year");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

const setHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const closeMobileMenu = () => {
  if (!mobileMenu || !menuToggle) {
    return;
  }

  document.body.classList.remove("menu-open");
  mobileMenu.classList.remove("is-open");
  mobileMenu.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  menuToggle.innerHTML = '<i class="fa-solid fa-bars text-base"></i>';
};

const openMobileMenu = () => {
  if (!mobileMenu || !menuToggle) {
    return;
  }

  document.body.classList.add("menu-open");
  mobileMenu.classList.add("is-open");
  mobileMenu.setAttribute("aria-hidden", "false");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Fechar menu");
  menuToggle.innerHTML = '<i class="fa-solid fa-xmark text-base"></i>';
};

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";

    if (expanded) {
      closeMobileMenu();
      return;
    }

    openMobileMenu();
  });

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Node)) {
      return;
    }

    if (
      mobileMenu.classList.contains("is-open") &&
      !mobileMenu.contains(target) &&
      !menuToggle.contains(target)
    ) {
      closeMobileMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      closeMobileMenu();
    }
  });
}

if (leadForm && feedback) {
  const emailInput = leadForm.querySelector('input[type="email"]');
  const inputWrap = leadForm.querySelector(".lead-input-wrap");
  const submitText = leadSubmit ? leadSubmit.querySelector(".lead-submit-text") : null;
  const defaultSubmitText = submitText ? submitText.textContent : "";

  const setFeedbackState = (message, state) => {
    feedback.textContent = message;
    feedback.classList.remove("form-success", "form-error", "form-idle");
    feedback.classList.add(state);
  };

  const resetInputState = () => {
    if (inputWrap) {
      inputWrap.classList.remove("is-invalid");
    }
  };

  if (emailInput) {
    emailInput.addEventListener("input", () => {
      resetInputState();

      if (feedback.textContent) {
        setFeedbackState("", "form-idle");
      }
    });
  }

  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailValue = emailInput ? emailInput.value.trim() : "";

    if (!emailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      if (inputWrap) {
        inputWrap.classList.add("is-invalid");
      }

      setFeedbackState("Digite um e-mail válido para entrar na lista.", "form-error");
      return;
    }

    resetInputState();
    setFeedbackState("Analisando seu acesso antecipado...", "form-idle");

    if (leadSubmit) {
      leadSubmit.classList.add("is-loading");
      leadSubmit.disabled = true;
    }

    if (submitText) {
      submitText.textContent = "Confirmando";
    }

    window.setTimeout(() => {
      setFeedbackState("Acesso solicitado. Em breve você recebe as novidades do Melodia.", "form-success");
      leadForm.reset();

      if (leadSubmit) {
        leadSubmit.classList.remove("is-loading");
        leadSubmit.disabled = false;
      }

      if (submitText) {
        submitText.textContent = defaultSubmitText;
      }
    }, 700);
  });
}

if (!prefersReducedMotion && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.9 } });

  heroTimeline
    .from("#inicio .hero-intro", {
      y: 34,
      opacity: 0,
      stagger: 0.11
    })
    .from(
      "#inicio .hero-metric-card",
      {
        y: 28,
        opacity: 0,
        stagger: 0.1,
        duration: 0.75
      },
      "-=0.45"
    })
    .from(
      "#inicio .hero-visual-main",
      {
        scale: 0.9,
        y: 24,
        opacity: 0,
        duration: 1
      },
      "-=0.95"
    )
    .from(
      "#inicio .hero-float",
      {
        y: 18,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7
      },
      "-=0.55"
    );

  gsap.utils.toArray("section:not(#inicio) .reveal-up, section:not(#inicio) .reveal-scale").forEach((element) => {
    gsap.from(element, {
      y: 28,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 87%"
      }
    });
  });

  const benefitsGrid = document.querySelector("#beneficios .benefits-grid");

  if (benefitsGrid) {
    gsap.from("#beneficios .benefit-card", {
      y: 34,
      opacity: 0,
      stagger: 0.12,
      duration: 0.82,
      ease: "power3.out",
      scrollTrigger: {
        trigger: benefitsGrid,
        start: "top 80%"
      }
    });
  }

  const testimonialGrid = document.querySelector("#depoimentos .testimonial-grid");

  if (testimonialGrid) {
    gsap.from("#depoimentos .premium-testimonial-card", {
      y: 34,
      opacity: 0,
      stagger: 0.12,
      duration: 0.82,
      ease: "power3.out",
      scrollTrigger: {
        trigger: testimonialGrid,
        start: "top 80%"
      }
    });
  }

  gsap.utils.toArray(".product-card, .surface-panel, .showcase-panel, .cta-panel").forEach((card) => {
    gsap.from(card, {
      y: 40,
      opacity: 0,
      duration: 0.85,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 84%"
      }
    });
  });

  gsap.utils.toArray(".parallax-node").forEach((node) => {
    const speed = Number(node.dataset.speed || 0.1);

    gsap.to(node, {
      yPercent: speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });
  });

  const showcaseStage = document.querySelector("#showcase .showcase-stage");

  if (showcaseStage) {
    gsap.from("#showcase .showcase-main-card", {
      y: 36,
      opacity: 0,
      duration: 0.95,
      ease: "power3.out",
      scrollTrigger: {
        trigger: showcaseStage,
        start: "top 74%"
      }
    });

    gsap.from("#showcase .showcase-card-compact, #showcase .showcase-metric-card, #showcase .showcase-player-shell, #showcase .showcase-focus-card", {
      y: 28,
      opacity: 0,
      stagger: 0.1,
      duration: 0.78,
      ease: "power3.out",
      scrollTrigger: {
        trigger: showcaseStage,
        start: "top 72%"
      }
    });

    gsap.to("#showcase .showcase-disc", {
      rotation: 360,
      duration: 16,
      repeat: -1,
      ease: "none"
    });

    gsap.utils.toArray("#showcase .showcase-aura").forEach((node, index) => {
      gsap.to(node, {
        x: index === 0 ? 14 : -14,
        y: index === 0 ? -10 : 12,
        duration: 4.8 + index,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }

  gsap.to("#inicio .hero-phone", {
    y: -10,
    duration: 2.8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.utils.toArray("#inicio .hero-float").forEach((node, index) => {
    gsap.to(node, {
      y: index % 2 === 0 ? -10 : 10,
      x: index === 2 ? -4 : 4,
      duration: 3.4 + index * 0.45,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  });

  gsap.utils.toArray("#inicio .hero-ring, #inicio .hero-decor-line").forEach((node, index) => {
    gsap.to(node, {
      rotation: index % 2 === 0 ? 6 : -6,
      duration: 9 + index,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      transformOrigin: "50% 50%"
    });
  });
}
