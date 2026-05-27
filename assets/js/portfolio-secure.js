(function () {
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.getElementById("site-nav");
  var themeToggle = document.getElementById("theme-toggle");
  var backToTopLink = document.getElementById("back-to-top-link");
  var launchScreen = document.getElementById("launch-screen");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a[href^='#']"));
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function finishLaunch(immediate) {
    if (!launchScreen) {
      return;
    }

    if (immediate) {
      launchScreen.classList.add("is-done");
      launchScreen.remove();
      return;
    }

    window.setTimeout(function () {
      launchScreen.classList.add("is-done");
      document.body.classList.add("launch-ready");

      window.setTimeout(function () {
        if (launchScreen && launchScreen.parentNode) {
          launchScreen.parentNode.removeChild(launchScreen);
        }
      }, 520);
    }, 1950);
  }

  function setTheme(mode) {
    var isDark = mode === "dark";
    document.body.classList.toggle("theme-dark", isDark);

    if (themeToggle) {
      themeToggle.textContent = isDark ? "Light theme" : "Dark theme";
      themeToggle.setAttribute("aria-pressed", String(isDark));
    }
  }

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + id;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function setNavOpen(isOpen) {
    if (!navToggle || !siteNav) {
      return;
    }

    siteNav.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
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

  if (launchScreen) {
    var hasSeenLaunch = false;

    try {
      hasSeenLaunch = window.sessionStorage.getItem("portfolio-launch-seen") === "true";
    } catch (_err) {
      hasSeenLaunch = false;
    }

    if (reduceMotion || hasSeenLaunch) {
      finishLaunch(true);
    } else {
      try {
        window.sessionStorage.setItem("portfolio-launch-seen", "true");
      } catch (_err) {
        hasSeenLaunch = false;
      }

      finishLaunch(false);
    }
  }

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
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      setNavOpen(false);
    });
  });

  if (themeToggle) {
    var savedTheme = "";

    try {
      savedTheme = window.localStorage.getItem("portfolio-theme") || "";
    } catch (_err) {
      savedTheme = "";
    }

    setTheme(savedTheme === "dark" ? "dark" : "light");

    if (savedTheme === "light") {
      try {
        window.localStorage.removeItem("portfolio-theme");
      } catch (_err) {
        savedTheme = "";
      }
    }

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
    if (navLinks.length > 0) {
      var sections = navLinks
        .map(function (link) {
          return document.querySelector(link.getAttribute("href"));
        })
        .filter(Boolean);

      var sectionObserver = new IntersectionObserver(function (entries) {
        var visible = entries
          .filter(function (entry) {
            return entry.isIntersecting;
          })
          .sort(function (a, b) {
            return b.intersectionRatio - a.intersectionRatio;
          });

        if (visible.length > 0) {
          setActiveLink(visible[0].target.id);
        }
      }, {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.2, 0.45, 0.7]
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

  if (window.location.hash) {
    setActiveLink(window.location.hash.slice(1));
  } else if (navLinks.length > 0) {
    setActiveLink("story");
  }

  window.addEventListener("hashchange", function () {
    if (window.location.hash) {
      setActiveLink(window.location.hash.slice(1));
    }
  });

  if (backToTopLink) {
    backToTopLink.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", "#top");
      } else {
        window.location.hash = "top";
      }
    });
  }
})();
