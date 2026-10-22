    (() => {
      const menuButton = document.querySelector(".menu-toggle");
      const menu = document.querySelector("#menu-principal");

      function closeMenu() {
        menu.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menu");
        menuButton.querySelector("span").textContent = "☰";
      }

      menuButton.addEventListener("click", () => {
        const isOpen = menu.classList.toggle("is-open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
        menuButton.querySelector("span").textContent = isOpen ? "✕" : "☰";
      });

      menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
      });

      const revealElements = document.querySelectorAll(".reveal");
      const statValues = document.querySelectorAll(".stat-value[data-target]");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      function animateCounter(element) {
        if (element.dataset.animated === "true") return;
        element.dataset.animated = "true";

        const target = Number(element.dataset.target);
        const decimals = Number(element.dataset.decimals || 0);
        const suffix = element.dataset.suffix || "";
        const duration = 1200;

        if (reducedMotion) {
          element.textContent = target.toLocaleString("pt-BR", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
          }) + suffix;
          return;
        }

        const startTime = performance.now();
        function updateCounter(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = target * eased;
          element.textContent = value.toLocaleString("pt-BR", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
          }) + suffix;
          if (progress < 1) requestAnimationFrame(updateCounter);
        }
        requestAnimationFrame(updateCounter);
      }

      if ("IntersectionObserver" in window && !reducedMotion) {
        const observer = new IntersectionObserver((entries, currentObserver) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            if (entry.target.classList.contains("stat")) {
              entry.target.querySelectorAll(".stat-value[data-target]").forEach(animateCounter);
            }
            currentObserver.unobserve(entry.target);
          });
        }, { threshold: 0.16 });

        revealElements.forEach((element) => observer.observe(element));
      } else {
        revealElements.forEach((element) => element.classList.add("is-visible"));
        statValues.forEach(animateCounter);
      }
    })();
