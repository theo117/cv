(function () {
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.getElementById("site-nav");
  var themeToggle = document.getElementById("theme-toggle");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a[href^='#']"));

  function setTheme(mode) {
    var isLight = mode === "light";
    document.body.classList.toggle("theme-light", isLight);
    if (themeToggle) {
      themeToggle.textContent = isLight ? "Dark theme" : "Light theme";
      themeToggle.setAttribute("aria-pressed", String(isLight));
    }
  }

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + id);
    });
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  if (themeToggle) {
    var savedTheme = "";

    try {
      savedTheme = window.localStorage.getItem("portfolio-theme") || "";
    } catch (_err) {
      savedTheme = "";
    }

    if (savedTheme === "light") {
      setTheme("light");
    }

    themeToggle.addEventListener("click", function () {
      var nextTheme = document.body.classList.contains("theme-light") ? "dark" : "light";
      setTheme(nextTheme);
      try {
        window.localStorage.setItem("portfolio-theme", nextTheme);
      } catch (_err) {
        return;
      }
    });
  }

  if ("IntersectionObserver" in window && navLinks.length > 0) {
    var sections = navLinks
      .map(function (link) {
        return document.querySelector(link.getAttribute("href"));
      })
      .filter(Boolean);

    var observer = new IntersectionObserver(function (entries) {
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
      observer.observe(section);
    });
  }

  if (window.location.hash) {
    setActiveLink(window.location.hash.slice(1));
  } else if (navLinks.length > 0) {
    setActiveLink("about");
  }

  window.addEventListener("hashchange", function () {
    if (window.location.hash) {
      setActiveLink(window.location.hash.slice(1));
    }
  });
})();
