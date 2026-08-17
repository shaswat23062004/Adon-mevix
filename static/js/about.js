/* ADON Mevix — about.js */
(function () {
  "use strict";

  function animateMissionStats() {
    const nums = document.querySelectorAll(".mstat-num[data-count]");
    if (!nums.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const t = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * ease);
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.3 });
    nums.forEach((el) => obs.observe(el));
  }

  document.addEventListener("DOMContentLoaded", animateMissionStats);
})();
