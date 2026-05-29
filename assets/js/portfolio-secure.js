(function () {
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.getElementById("site-nav");
  var themeToggle = document.getElementById("theme-toggle");
  var backToTopLink = document.getElementById("back-to-top-link");
  var launchScreen = document.getElementById("launch-screen");
  var homeLinks = Array.prototype.slice.call(document.querySelectorAll("a[href='#top']:not(#back-to-top-link)"));
  var hero = document.querySelector(".hero");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a[href^='#']"));
  var tabLinks = Array.prototype.slice.call(document.querySelectorAll("a[href^='#']"));
  var tabSections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var transitionTimer = 0;

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
    }, 2450);
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

  function createLaunchTransition() {
    var screen = document.createElement("div");
    var wrap = document.createElement("div");
    var mark = document.createElement("img");
    var ring = document.createElement("span");
    var sparkOne = document.createElement("span");
    var sparkTwo = document.createElement("span");
    var sparkThree = document.createElement("span");

    screen.className = "launch-screen tab-transition-screen";
    screen.setAttribute("aria-hidden", "true");

    wrap.className = "launch-mark-wrap";
    mark.className = "launch-mark";
    mark.src = "favicon-v2.svg";
    mark.alt = "";
    mark.width = 64;
    mark.height = 64;

    ring.className = "launch-ring";
    sparkOne.className = "launch-spark launch-spark-one";
    sparkTwo.className = "launch-spark launch-spark-two";
    sparkThree.className = "launch-spark launch-spark-three";

    wrap.appendChild(mark);
    wrap.appendChild(ring);
    wrap.appendChild(sparkOne);
    wrap.appendChild(sparkTwo);
    wrap.appendChild(sparkThree);
    screen.appendChild(wrap);

    return screen;
  }

  function playLaunchTransition(changeView) {
    if (reduceMotion) {
      changeView();
      return;
    }

    window.clearTimeout(transitionTimer);

    var existing = document.querySelector(".tab-transition-screen");

    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }

    var transitionScreen = createLaunchTransition();
    document.body.appendChild(transitionScreen);

    window.requestAnimationFrame(function () {
      transitionScreen.classList.add("is-running");
    });

    transitionTimer = window.setTimeout(function () {
      changeView();
      transitionScreen.classList.add("is-done");
    }, 1350);

    window.setTimeout(function () {
      if (transitionScreen.parentNode) {
        transitionScreen.parentNode.removeChild(transitionScreen);
      }
    }, 2050);
  }

  function showHeroView(updateHash) {
    if (hero) {
      hero.classList.remove("is-tab-hidden");
      hero.classList.add("is-tab-active");
      hero.removeAttribute("hidden");
      hero.removeAttribute("aria-hidden");
    }

    tabSections.forEach(function (section) {
      section.classList.remove("is-tab-active");
      section.classList.add("is-tab-hidden");
      section.setAttribute("hidden", "");
      section.setAttribute("aria-hidden", "true");
    });

    setActiveLink("");

    if (updateHash && window.history && window.history.pushState) {
      window.history.pushState(null, "", "#top");
    }
  }

  function isTabSection(id) {
    return tabSections.some(function (section) {
      return section.id === id;
    });
  }

  function setActiveSection(id, updateHash) {
    var target = document.getElementById(id);

    if (!target || !isTabSection(id)) {
      return;
    }

    tabSections.forEach(function (section) {
      var isActive = section === target;

      section.classList.toggle("is-tab-active", isActive);
      section.classList.toggle("is-tab-hidden", !isActive);
      section.toggleAttribute("hidden", !isActive);

      if (isActive) {
        section.removeAttribute("aria-hidden");
      } else {
        section.setAttribute("aria-hidden", "true");
      }
    });

    if (hero) {
      hero.classList.remove("is-tab-active");
      hero.classList.add("is-tab-hidden");
      hero.setAttribute("hidden", "");
      hero.setAttribute("aria-hidden", "true");
    }

    setActiveLink(id);

    if (updateHash && window.history && window.history.pushState) {
      window.history.pushState(null, "", "#" + id);
    }
  }

  function setActiveSectionFromHash() {
    if (window.location.hash && isTabSection(window.location.hash.slice(1))) {
      setActiveSection(window.location.hash.slice(1), false);
    } else {
      showHeroView(false);
    }
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

  if (tabSections.length > 0) {
    document.body.classList.add("tabs-ready");
  }

  tabLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href").slice(1);

      if (isTabSection(id)) {
        event.preventDefault();
        playLaunchTransition(function () {
          setActiveSection(id, true);
        });
      }

      if (navLinks.indexOf(link) !== -1) {
        setNavOpen(false);
      }
    });
  });

  homeLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      playLaunchTransition(function () {
        showHeroView(true);
      });
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

  setActiveSectionFromHash();

  window.addEventListener("hashchange", setActiveSectionFromHash);
  window.addEventListener("popstate", setActiveSectionFromHash);

  if (backToTopLink) {
    backToTopLink.addEventListener("click", function (event) {
      event.preventDefault();
      playLaunchTransition(function () {
        showHeroView(false);

        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, "", "#top");
        } else {
          window.location.hash = "top";
        }
      });
    });
  }
})();
