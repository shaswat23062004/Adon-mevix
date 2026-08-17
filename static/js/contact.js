/* =============================================
   ADON Ventures — contact.js
   AJAX form, inline validation, success/error states
   ============================================= */

(function () {
  "use strict";

  function initContactForm() {
    const form      = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    const status    = document.getElementById("formStatus");
    if (!form) return;

    const fields = {
      name:    document.getElementById("name"),
      email:   document.getElementById("email"),
      message: document.getElementById("message"),
    };

    /* Live validation */
    Object.keys(fields).forEach((key) => {
      const el = fields[key];
      if (!el) return;
      el.addEventListener("blur", () => validateField(key, el));
      el.addEventListener("input", () => clearErr(key));
    });

    function validateField(key, el) {
      const v = el.value.trim();
      if (key === "name"    && !v)               return setErr(key, "Your name is required.");
      if (key === "email"   && (!v || !v.includes("@"))) return setErr(key, "Enter a valid email address.");
      if (key === "message" && !v)               return setErr(key, "Add a short message so we know how to help.");
      clearErr(key);
      return true;
    }

    function setErr(key, msg) {
      const el = document.getElementById("err-" + key);
      if (el) el.textContent = msg;
      const input = fields[key];
      if (input) input.style.borderColor = "rgba(255,90,90,0.6)";
    }

    function clearErr(key) {
      const el = document.getElementById("err-" + key);
      if (el) el.textContent = "";
      const input = fields[key];
      if (input) input.style.borderColor = "";
    }

    function validate() {
      let ok = true;
      Object.keys(fields).forEach((k) => {
        if (!validateField(k, fields[k])) ok = false;
      });
      // also check manually since validateField returns undefined on error
      const n = fields.name?.value.trim();
      const e = fields.email?.value.trim();
      const m = fields.message?.value.trim();
      if (!n || !e || !e.includes("@") || !m) ok = false;
      return ok;
    }

    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();

      if (!validate()) {
        Object.keys(fields).forEach((k) => validateField(k, fields[k]));
        return;
      }

      submitBtn.classList.add("loading");
      status.textContent = "";
      status.className   = "form-status";

      const payload = {
        name:    fields.name.value.trim(),
        email:   fields.email.value.trim(),
        phone:   document.getElementById("phone")?.value.trim() || "",
        plan:    document.getElementById("plan")?.value || "Not specified",
        message: fields.message.value.trim(),
      };

      try {
        const res  = await fetch("/api/contact", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
        });
        const data = await res.json();

        if (res.ok && data.ok) {
          status.textContent = data.message;
          status.className   = "form-status success";
          form.reset();
          // Confetti burst
          confettiBurst();
        } else {
          if (data.errors) {
            Object.keys(data.errors).forEach((k) => setErr(k, data.errors[k]));
          }
          status.textContent = data.message || "Something went wrong. Please try again.";
          status.className   = "form-status error";
        }
      } catch (_) {
        status.textContent = "Network error — please try again or call us directly.";
        status.className   = "form-status error";
      } finally {
        submitBtn.classList.remove("loading");
      }
    });
  }

  /* ── Mini confetti celebration ──────────────── */
  function confettiBurst() {
    const colors = ["#9B4DFF", "#F0B94D", "#C8A6FF", "#C9952C", "#ffffff"];
    const container = document.body;
    for (let i = 0; i < 50; i++) {
      const el = document.createElement("div");
      const size = Math.random() * 8 + 4;
      const color = colors[Math.floor(Math.random() * colors.length)];
      el.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
        left: ${30 + Math.random() * 40}%;
        top: 40%;
        pointer-events: none;
        z-index: 9999;
        opacity: 1;
        transform: rotate(${Math.random() * 360}deg);
      `;
      container.appendChild(el);

      const tx = (Math.random() - 0.5) * 300;
      const ty = -(Math.random() * 250 + 100);
      const dur = Math.random() * 600 + 700;

      el.animate(
        [
          { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
          { transform: `translate(${tx}px, ${ty}px) rotate(${Math.random() * 720}deg)`, opacity: 0 },
        ],
        { duration: dur, easing: "cubic-bezier(.2,1,.4,1)", fill: "forwards" }
      ).onfinish = () => el.remove();
    }
  }

  document.addEventListener("DOMContentLoaded", initContactForm);
})();
