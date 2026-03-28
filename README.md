# CV Portfolio

This portfolio is now a static site with a reduced attack surface.

## Current architecture

- `index.html` is the main page.
- `assets/css/portfolio-secure.css` contains the active visual design.
- `assets/js/portfolio-secure.js` contains the small amount of local interaction logic.
- PDFs, favicons, images, and SEO files are served as static assets.

## Security posture

This rebuild was intentionally aligned with OWASP-style secure defaults:

- No embedded contact form.
- No live chat server.
- No exposed public API keys in the HTML.
- No remote script loading.
- No external font dependencies.
- Restrictive Content Security Policy in `index.html`.
- Direct contact links only, which avoids processing visitor-submitted data in the browser.

## Important maintenance rules

If you extend this site later, keep these constraints unless you are deliberately redesigning the security model:

- Prefer static content over dynamic widgets.
- Do not add third-party form handlers directly into the page.
- Do not add inline scripts or inline event handlers.
- Do not add remote JavaScript sources unless there is a strong reason and the CSP is updated carefully.
- If a feature collects or processes visitor data, move that logic to a properly secured backend and review validation, authentication, rate limiting, logging, and secret handling.

## Local editing

You can open `index.html` directly for basic review, but some browser behavior is best checked through a local static server.

If you use a local server, point it at the `cv/` directory and verify:

- layout on desktop and mobile
- theme toggle behavior
- navigation section highlighting
- downloads and external links

## Deployment notes

This repository no longer depends on the old `chat-server` service or the previous Render service config.

Deployment should treat `cv/` as a static site root.
