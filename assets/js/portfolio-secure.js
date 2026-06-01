(function () {
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.getElementById("site-nav");
  var themeToggle = document.getElementById("theme-toggle");
  var backToTopLink = document.getElementById("back-to-top-link");
  var launchScreen = document.getElementById("launch-screen");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a[href^='#']"));
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-button"));
  var projectCards = Array.prototype.slice.call(document.querySelectorAll(".project-card[data-category]"));
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function finishLaunch() {
    if (!launchScreen) {
      return;
    }

    if (reduceMotion) {
      launchScreen.remove();
      document.body.classList.add("launch-ready");
      return;
    }

    window.setTimeout(function () {
      launchScreen.classList.add("is-done");
      document.body.classList.add("launch-ready");

      window.setTimeout(function () {
        if (launchScreen && launchScreen.parentNode) {
          launchScreen.parentNode.removeChild(launchScreen);
        }
      }, 420);
    }, 820);
  }

  function setTheme(mode) {
    var isDark = mode === "dark";
    var themeColor = document.querySelector("meta[name='theme-color']");

    document.body.classList.toggle("theme-dark", isDark);

    if (themeColor) {
      themeColor.setAttribute("content", isDark ? "#0e1624" : "#f7f9fb");
    }

    if (themeToggle) {
      themeToggle.textContent = isDark ? "Light theme" : "Dark theme";
      themeToggle.setAttribute("aria-pressed", String(isDark));
    }
  }

  function setNavOpen(isOpen) {
    if (!navToggle || !siteNav) {
      return;
    }

    siteNav.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.textContent = isOpen ? "Close" : "Menu";
  }

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + id;
      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function animateCounter(node) {
    if (node.dataset.animated === "true") {
      return;
    }

    var target = Number(node.getAttribute("data-count"));

    if (!target) {
      return;
    }

    node.dataset.animated = "true";

    var duration = 900;
    var startTime = 0;
    var suffix = "+";

    function step(timestamp) {
      if (!startTime) {
        startTime = timestamp;
      }

      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);

      node.textContent = value + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }

  function setProjectFilter(filter) {
    filterButtons.forEach(function (button) {
      var isActive = button.getAttribute("data-filter") === filter;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    projectCards.forEach(function (card) {
      var categories = (card.getAttribute("data-category") || "").split(" ");
      var shouldShow = filter === "all" || categories.indexOf(filter) !== -1;
      card.classList.toggle("is-filtered", !shouldShow);
    });
  }

  finishLaunch();

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      setNavOpen(!siteNav.classList.contains("open"));
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && siteNav.classList.contains("open")) {
        setNavOpen(false);
        navToggle.focus();
      }
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });
  }

  if (themeToggle) {
    var savedTheme = "";

    try {
      savedTheme = window.localStorage.getItem("portfolio-theme") || "";
    } catch (_err) {
      savedTheme = "";
    }

    setTheme(savedTheme === "dark" ? "dark" : "light");

    themeToggle.addEventListener("click", function () {
      var nextTheme = document.body.classList.contains("theme-dark") ? "light" : "dark";
      setTheme(nextTheme);

      try {
        if (nextTheme === "dark") {
          window.localStorage.setItem("portfolio-theme", nextTheme);
        } else {
          window.localStorage.removeItem("portfolio-theme");
        }
      } catch (_err) {
        return;
      }
    });
  }

  if ("IntersectionObserver" in window) {
    if (sections.length > 0) {
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      }, {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0.01
      });

      sections.forEach(function (section) {
        sectionObserver.observe(section);
      });
    }

    if (counters.length > 0) {
      var counterObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.5
      });

      counters.forEach(function (node) {
        counterObserver.observe(node);
      });
    }
  } else {
    counters.forEach(function (node) {
      animateCounter(node);
    });
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setProjectFilter(button.getAttribute("data-filter") || "all");
    });
  });

  if (backToTopLink) {
    backToTopLink.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });

      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", "#top");
      }
    });
  }
})();
