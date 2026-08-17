/* =============================================
   ADON Ventures — main.js
   Scroll rocket, starfield, nav, scroll-spy
   ============================================= */

(function () {
  "use strict";

  /* ── Starfield ──────────────────────────────── */
  function initStarfield() {
    const container = document.getElementById("starfield");
    if (!container) return;
    const count = 90;
    for (let i = 0; i < count; i++) {
      const s = document.createElement("div");
      s.className = "star";
      const size = Math.random() * 2.2 + 0.5;
      s.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        --dur:${(Math.random() * 4 + 2).toFixed(1)}s;
        --del:${(Math.random() * 6).toFixed(1)}s;
        opacity:${Math.random() * 0.5 + 0.1};
      `;
      container.appendChild(s);
    }
  }

  /* ── Header scroll class ───────────────────── */
  function initHeader() {
    const header = document.getElementById("siteHeader");
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 30);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile nav toggle ─────────────────────── */
  function initNavToggle() {
    const btn = document.getElementById("navToggle");
    const nav = document.getElementById("mainNav");
    if (!btn || !nav) return;
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
    // Close on link click
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        btn.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ── Scroll-spy (intersection) ─────────────── */
  function initScrollSpy() {
    const els = document.querySelectorAll(".animate-on-scroll");
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
  }

  /* ── Scroll-driven rocket trail ─────────────── */
  function initRocketTrail() {
    const svg = document.getElementById("trailSvg");
    const path = document.getElementById("trailPath");
    const marker = document.getElementById("rocketMarker");
    if (!svg || !path || !marker) return;

    // Inject gradient def into SVG
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
      <linearGradient id="trailGrad" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
        <stop offset="0%"  stop-color="#9B4DFF" stop-opacity="0.8"/>
        <stop offset="50%" stop-color="#C9952C" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#9B4DFF" stop-opacity="0"/>
      </linearGradient>
    `;
    svg.insertBefore(defs, svg.firstChild);

    const MARGIN = 80;          // px from left edge
    let pathData = "";
    let totalLength = 0;
    let ticking = false;

    function buildPath() {
      const W = window.innerWidth;
      const H = document.body.scrollHeight;
      const step = 320;   // vertical rhythm between curves
      let d = `M ${MARGIN} 0`;
      let y = 0;
      let goRight = true;
      while (y < H) {
        const nextY = y + step;
        const x1 = goRight ? W - MARGIN : MARGIN;
        const x2 = goRight ? W - MARGIN : MARGIN;
        const cx = W / 2;
        d += ` C ${cx} ${y + step * 0.3}, ${cx} ${y + step * 0.7}, ${x2} ${nextY}`;
        y = nextY;
        goRight = !goRight;
      }
      pathData = d;
      path.setAttribute("d", d);
      // Force recalc
      try { totalLength = path.getTotalLength(); } catch (_) { totalLength = 4000; }
      path.style.strokeDasharray  = totalLength;
      path.style.strokeDashoffset = totalLength;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    function update() {
      ticking = false;
      const scrolled = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(scrolled / maxScroll, 1) : 0;

      // Dash-offset: draw from top as we scroll
      const drawn = progress * totalLength;
      path.style.strokeDashoffset = totalLength - drawn;

      // Rocket position along the path
      if (totalLength > 0) {
        try {
          const pt = path.getPointAtLength(drawn);
          marker.style.left = pt.x + "px";
          marker.style.top  = pt.y + "px";

          // Rotation: tangent direction
          const eps = Math.min(8, drawn);
          if (drawn > eps) {
            const ptA = path.getPointAtLength(drawn - eps);
            const ptB = path.getPointAtLength(Math.min(drawn + eps, totalLength));
            const angle = Math.atan2(ptB.y - ptA.y, ptB.x - ptA.x) * (180 / Math.PI) - 90;
            marker.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
          }
        } catch (_) {}
      }

      // Show/hide
      marker.style.opacity = progress > 0.01 ? "1" : "0";
    }

    buildPath();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { buildPath(); update(); });
    update();
  }

  /* ── Plan query param preselect ─────────────── */
  function preselectPlan() {
    const sel = document.getElementById("plan");
    if (!sel) return;
    const p = new URLSearchParams(window.location.search).get("plan");
    if (p) {
      for (const opt of sel.options) {
        if (opt.value.toLowerCase().includes(p.toLowerCase())) {
          opt.selected = true;
          break;
        }
      }
    }
  }

  /* ── Add animate-on-scroll to sections ─────── */
  function tagScrollTargets() {
    const targets = document.querySelectorAll(
      ".why-card, .service-card, .plan-card, .wp-card, .service-pill, .contact-card"
    );
    targets.forEach((el) => el.classList.add("animate-on-scroll"));
  }

  /* ── Init ───────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    initStarfield();
    initHeader();
    initNavToggle();
    tagScrollTargets();
    initScrollSpy();
    initRocketTrail();
    preselectPlan();
  });
})();
