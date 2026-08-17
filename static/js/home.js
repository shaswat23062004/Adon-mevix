/* =============================================
   ADON Ventures — home.js
   Animated counters + bar chart
   ============================================= */

(function () {
  "use strict";

  /* ── Animated counters ──────────────────────── */
  function animateCounters() {
    const nums = document.querySelectorAll(".stat-num[data-count]");
    if (!nums.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const isFloat = String(target).includes(".");
        const duration = 1400;
        const start = performance.now();

        function tick(now) {
          const t = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          const val = target * ease;
          el.textContent = isFloat
            ? val.toFixed(1) + suffix
            : Math.round(val).toLocaleString() + suffix;
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.3 });

    nums.forEach((el) => obs.observe(el));
  }

  /* ── Animated bar chart ─────────────────────── */
  function animateBarChart() {
    const svg = document.getElementById("barChart");
    if (!svg) return;

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"];
    const values = [12, 18, 14, 24, 20, 32, 28, 40];
    const maxVal = Math.max(...values);
    const W = 280, H = 80;
    const barW = 24, gap = (W - barW * months.length) / (months.length + 1);

    // Clear existing content except baseline
    while (svg.children.length > 1) svg.removeChild(svg.lastChild);

    months.forEach((m, i) => {
      const x = gap + i * (barW + gap);
      const barH = ((values[i] / maxVal) * (H - 24));
      const y = H - barH - 12;

      // Bar (start at 0 height, animate up)
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", x);
      rect.setAttribute("y", H - 12);
      rect.setAttribute("width", barW);
      rect.setAttribute("height", 0);
      rect.setAttribute("rx", "3");
      rect.setAttribute("fill", `url(#barGrad${i})`);

      const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
      grad.setAttribute("id", `barGrad${i}`);
      grad.setAttribute("x1", "0"); grad.setAttribute("y1", "0");
      grad.setAttribute("x2", "0"); grad.setAttribute("y2", "1");
      const s1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      s1.setAttribute("offset", "0%");
      s1.setAttribute("stop-color", i === values.indexOf(maxVal) ? "#F0B94D" : "#9B4DFF");
      const s2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      s2.setAttribute("offset", "100%");
      s2.setAttribute("stop-color", "rgba(123,47,247,0.2)");
      grad.appendChild(s1); grad.appendChild(s2);

      let defs = svg.querySelector("defs");
      if (!defs) { defs = document.createElementNS("http://www.w3.org/2000/svg", "defs"); svg.insertBefore(defs, svg.firstChild); }
      defs.appendChild(grad);

      svg.appendChild(rect);

      // Label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", x + barW / 2);
      text.setAttribute("y", H - 1);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("font-size", "7");
      text.setAttribute("fill", "rgba(168,156,196,0.7)");
      text.textContent = m;
      svg.appendChild(text);

      // Animate on scroll
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          obs.disconnect();
          const delay = i * 80;
          const duration = 700;
          const start = performance.now() + delay;

          function tick(now) {
            if (now < start) { requestAnimationFrame(tick); return; }
            const t = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            const h = barH * ease;
            rect.setAttribute("y", H - 12 - h);
            rect.setAttribute("height", h);
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      }, { threshold: 0.2 });
      obs.observe(svg);
    });
  }

  /* ── Reveal hero headline lines ─────────────── */
  function revealHeroLines() {
    const lines = document.querySelectorAll(".reveal-line");
    lines.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      el.style.transition = `opacity .6s ease ${i * 180}ms, transform .6s ease ${i * 180}ms`;
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "none";
      }, 100);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    revealHeroLines();
    animateCounters();
    animateBarChart();
  });
})();
