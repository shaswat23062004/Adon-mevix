/* ADON Mevix — portfolio.js */
(function () {
  "use strict";

  function initFilter() {
    const btns  = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".port-card-full");
    if (!btns.length) return;

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.dataset.filter;

        cards.forEach((card) => {
          const tags = card.dataset.tags || "";
          const show = filter === "all" || tags.includes(filter);
          if (show) {
            card.style.display = "";
            requestAnimationFrame(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            });
          } else {
            card.style.opacity = "0";
            card.style.transform = "translateY(16px)";
            setTimeout(() => { if (!tags.includes(btn.dataset.filter) && btn.dataset.filter !== "all") card.style.display = "none"; }, 300);
          }
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initFilter);
})();
