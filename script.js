(() => {
  "use strict";

  const state = {
    lenis: null,
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    finePointer: window.matchMedia("(hover: hover) and (pointer: fine)").matches
  };

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  function initLenis() {
    if (state.reduced || !window.Lenis) return;

    state.lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9
    });

    state.lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      state.lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(1000, 16);
  }

  function initHeader() {
    const header = qs(".header");
    if (!header) return;

    ScrollTrigger.create({
      start: 70,
      end: "max",
      onEnter: () => header.classList.add("scrolled"),
      onLeaveBack: () => header.classList.remove("scrolled")
    });
  }

  function initMobileMenu() {
    const menu = qs(".mobile-menu");
    const button = qs(".menu-toggle");
    if (!menu || !button) return;

    const setOpen = (open) => {
      menu.classList.toggle("is-open", open);
      menu.setAttribute("aria-hidden", String(!open));
      button.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("modal-open", open);
    };

    button.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
    qsa(".mobile-menu a", menu).forEach((link) => link.addEventListener("click", () => setOpen(false)));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  function initBookingModal() {
    const modal = qs("#booking-modal");
    const form = qs("#booking-form");
    if (!modal || !form) return;

    const open = () => {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      const firstInput = qs("input", form);
      window.setTimeout(() => firstInput?.focus(), 100);
    };

    const close = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    };

    qsa("[data-booking]").forEach((button) => button.addEventListener("click", open));
    qsa("[data-close-modal]").forEach((button) => button.addEventListener("click", close));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = new FormData(form);
      const name = data.get("name") || "Belirtilmedi";
      const service = data.get("service") || "Belirtilmedi";
      const date = data.get("date") || "Belirtilmedi";
      const note = data.get("note") || "Yok";

      const message = [
        "Merhaba Feyza Durmazoğlu Bolu, randevu talebinde bulunmak istiyorum.",
        "",
        "Ad: " + name,
        "Hizmet: " + service,
        "Tercih edilen gün: " + date,
        "Not: " + note
      ].join("\n");

      window.open(
        "https://wa.me/905347099081?text=" + encodeURIComponent(message),
        "_blank",
        "noopener,noreferrer"
      );
    });
  }

  function initHero() {
    const hero = qs(".hero");
    const media = qs(".hero-media", hero);
    const image = qs("img", media);
    if (!hero || !media) return;

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro.from(".hero-content > *", {
      y: 34,
      autoAlpha: 0,
      duration: 1.05,
      stagger: 0.08,
      delay: 0.9
    });

    if (state.reduced) return;

    gsap.to(media, {
      yPercent: 18,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    if (state.finePointer && image) {
      initMouseParallax(image, 7, 0.14);
    }
  }

  function initPinnedReveal() {
    const section = qs(".editorial-image");
    const frame = qs(".editorial-frame", section);
    const image = qs("img", frame);
    if (!section || !frame || !image || state.reduced) return;

    const getScale = () => {
      const rect = frame.getBoundingClientRect();
      const targetWidth = window.innerWidth;
      const targetHeight = window.innerHeight;
      return Math.max(targetWidth / rect.width, targetHeight / rect.height) * 1.04;
    };

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => "+=" + Math.max(window.innerHeight * 1.35, 1050),
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });

    timeline
      .fromTo(
        frame,
        { scale: 1 },
        { scale: getScale, ease: "none" },
        0
      )
      .fromTo(
        image,
        { scale: 1.08 },
        { scale: 1.02, ease: "none" },
        0
      );

    if (state.finePointer) {
      initMouseParallax(image, 5, 0.12);
    }
  }

  function initFullscreen() {
    const panel = qs(".fullscreen-panel");
    const image = qs(".fullscreen-media img", panel);
    if (!panel || !image || state.reduced) return;

    gsap.fromTo(
      image,
      { scale: 1.1 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: panel,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );
  }

  function initHorizontalScroll() {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 901px)", () => {
      if (state.reduced) return;

      const section = qs(".horizontal-wrap");
      const track = qs(".horizontal-track", section);
      const progress = qs(".horizontal-progress span", section);
      if (!section || !track) return;

      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + getDistance(),
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progress) progress.style.transform = "scaleX(" + self.progress + ")";
          }
        }
      });

      if (state.finePointer) {
        qsa(".visual-card img", section).forEach((image) => {
          initMouseParallax(image, 4, 0.1);
        });
      }
    });

    mm.add("(max-width: 900px)", () => {
      if (state.reduced) return;

      const section = qs(".horizontal-wrap");
      const track = qs(".horizontal-track", section);
      const progress = qs(".horizontal-progress span", section);
      if (!section || !track) return;

      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + Math.max(getDistance() * 0.9, window.innerHeight * 1.6),
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progress) progress.style.transform = "scaleX(" + self.progress + ")";
          }
        }
      });
    });

    return () => mm.revert();
  }

  function initSectionReveals() {
    if (state.reduced) return;

    gsap.from(".statement-copy h2", {
      y: 60,
      autoAlpha: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".statement",
        start: "top 68%"
      }
    });

    gsap.from(".service-item", {
      y: 32,
      autoAlpha: 0,
      duration: 0.75,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".service-list",
        start: "top 78%"
      }
    });

    gsap.from(".story-image", {
      y: 55,
      autoAlpha: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".story",
        start: "top 72%"
      }
    });

    gsap.from(".review-grid blockquote", {
      y: 32,
      autoAlpha: 0,
      duration: 0.75,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".review-grid",
        start: "top 78%"
      }
    });
  }

  function initMouseParallax(element, strength = 6, duration = 0.15) {
    if (!state.finePointer || !element) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      gsap.set(element, {
        x: currentX,
        y: currentY,
        overwrite: false
      });

      raf = requestAnimationFrame(render);
    };

    const onMove = (event) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      targetX = x * strength * 2;
      targetY = y * strength * 2;
      if (!raf) raf = requestAnimationFrame(render);
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }

  function initHoverInteractions() {
    qsa(".visual-card").forEach((card) => {
      const image = qs("img", card);
      const arrow = qs(".service-arrow", card);

      card.addEventListener("mouseenter", () => {
        if (!state.finePointer) return;
        if (image) gsap.to(image, { scale: 1.035, duration: 0.8, ease: "power3.out", overwrite: true });
        if (arrow) gsap.to(arrow, { x: 4, y: -4, duration: 0.35, ease: "power3.out", overwrite: true });
      });

      card.addEventListener("mouseleave", () => {
        if (!state.finePointer) return;
        if (image) gsap.to(image, { scale: 1, duration: 0.9, ease: "power3.out", overwrite: true });
        if (arrow) gsap.to(arrow, { x: 0, y: 0, duration: 0.45, ease: "power3.out", overwrite: true });
      });
    });

    qsa(".light-button, .header-cta, .submit-button, .huge-cta, .outline-button").forEach((button) => {
      button.addEventListener("mouseenter", () => {
        if (!state.finePointer) return;
        gsap.to(button, { scale: 1.012, duration: 0.3, ease: "power3.out", overwrite: true });
      });
      button.addEventListener("mouseleave", () => {
        if (!state.finePointer) return;
        gsap.to(button, { scale: 1, duration: 0.4, ease: "power3.out", overwrite: true });
      });
    });

    qsa(".text-link, .line-button, .footer-links a").forEach((link) => {
      link.addEventListener("mouseenter", () => {
        if (!state.finePointer) return;
        gsap.to(link, { x: 3, duration: 0.3, ease: "power3.out", overwrite: true });
      });
      link.addEventListener("mouseleave", () => {
        if (!state.finePointer) return;
        gsap.to(link, { x: 0, duration: 0.35, ease: "power3.out", overwrite: true });
      });
    });
  }

  function initMagnetic() {
    if (!state.finePointer) return;

    qsa(".magnetic").forEach((element) => {
      let rect = null;
      let raf = 0;
      let tx = 0;
      let ty = 0;
      let x = 0;
      let y = 0;

      const render = () => {
        x += (tx - x) * 0.16;
        y += (ty - y) * 0.16;
        gsap.set(element, { x, y, overwrite: false });
        raf = requestAnimationFrame(render);
      };

      element.addEventListener("mouseenter", () => {
        rect = element.getBoundingClientRect();
        if (!raf) raf = requestAnimationFrame(render);
      });

      element.addEventListener("pointermove", (event) => {
        if (!rect) return;
        tx = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
        ty = ((event.clientY - rect.top) / rect.height - 0.5) * 5;
      });

      element.addEventListener("mouseleave", () => {
        rect = null;
        tx = 0;
        ty = 0;
      });
    });
  }

  function initReducedMotion() {
    if (!state.reduced) return;

    document.documentElement.classList.add("reduced-motion");

    qsa(".hero-content > *").forEach((element) => {
      gsap.set(element, { clearProps: "all" });
    });
  }

  function init() {
    gsap.registerPlugin(ScrollTrigger);

    initLenis();
    initHeader();
    initMobileMenu();
    initBookingModal();
    initHero();
    initPinnedReveal();
    initFullscreen();
    initHorizontalScroll();
    initSectionReveals();
    initHoverInteractions();
    initMagnetic();
    initReducedMotion();

    window.addEventListener("load", () => ScrollTrigger.refresh());
    window.addEventListener("resize", () => ScrollTrigger.refresh());

    const loader = qs(".site-loader");
    window.setTimeout(() => loader?.classList.add("is-hidden"), 1150);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();