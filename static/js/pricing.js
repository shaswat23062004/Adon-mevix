/* =============================================
   ADON Ventures — pricing.js
   Interactive post-count estimator slider
   ============================================= */

(function () {
  "use strict";

  const PLANS = [
    { name: "Basic",    min: 0,  max: 16, price: "9,999",  url: "basic"    },
    { name: "Standard", min: 17, max: 25, price: "19,999", url: "standard" },
    { name: "Premium",  min: 26, max: 99, price: "34,999", url: "premium"  },
  ];

  function initSlider() {
    const slider     = document.getElementById("postSlider");
    const valEl      = document.getElementById("sliderValue");
    const planNameEl = document.getElementById("sliderPlanName");
    const ctaEl      = document.getElementById("sliderCta");
    if (!slider || !valEl || !planNameEl || !ctaEl) return;

    function update() {
      const v = parseInt(slider.value, 10);
      valEl.textContent = v;

      // update range fill %
      const min = parseInt(slider.min, 10);
      const max = parseInt(slider.max, 10);
      const pct = ((v - min) / (max - min)) * 100;
      slider.style.setProperty("--val", pct + "%");

      // Find matching plan
      const plan = PLANS.find((p) => v >= p.min && v <= p.max) || PLANS[PLANS.length - 1];
      planNameEl.textContent = `${plan.name} — ₹${plan.price}/month`;

      // Update CTA link
      const url = new URL(window.location.origin + "/contact");
      url.searchParams.set("plan", plan.url.charAt(0).toUpperCase() + plan.url.slice(1));
      ctaEl.href = url.toString();

      // Pulse effect
      planNameEl.style.transform = "scale(1.06)";
      planNameEl.style.transition = "transform .15s ease";
      setTimeout(() => { planNameEl.style.transform = "none"; }, 150);
    }

    slider.addEventListener("input", update);
    update();
  }

  /* ── Highlight chosen plan card ─────────────── */
  function initPlanHighlight() {
    const cards = document.querySelectorAll(".plan-card[data-plan]");
    const p = new URLSearchParams(window.location.search).get("plan");
    if (p) {
      cards.forEach((c) => {
        if (c.dataset.plan.toLowerCase() === p.toLowerCase()) {
          c.style.boxShadow = "0 0 0 2px #F0B94D, 0 8px 48px rgba(201,149,44,0.4)";
          setTimeout(() => c.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSlider();
    initPlanHighlight();
  });
})();
