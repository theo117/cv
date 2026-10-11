# Taste redesign and verification

Completed 11 October 2026. Local implementation only; nothing deployed or published.

## Required skill

Read `/home/theo/.codex/skills/taste-skill/SKILL.md`, installed from `Leonxlnx/taste-skill`. Its skill name is `design-taste-frontend`. It is the only file in the installed package; no additional local block/reference files exist. Applied the brief inference, overhaul protocol, typography, layout, theme, responsive, motion, accessibility, and pre-flight guidance. Also applied the verification and React best-practices skills to local checks and image loading.

Reading this as: a developer CV and portfolio for recruiters and engineering teams, with a precise contemporary visual language built in the existing Next.js framework.

## Existing-site audit

- Framework: Next.js App Router, React, TypeScript, Tailwind 4, native CSS, static export. Existing Lucide icons and click-to-play project videos.
- Tokens: pale green paper `#f7f8f5`, dark green ink `#151916`, lime `#c2f66d`, Arial/Courier, sharp corners.
- Composition: oversized full-width name, full-width project chapters, inverted project/contact sections, lime experience section. Estimated original variance/motion/density: 7/3/4.
- Information architecture: `/`, `/share-20260729`, Work, Experience, About, Contact. Download CV, certificate downloads, videos, live demos, GitHub, installer, email, telephone, LinkedIn, back-to-top.
- SEO baseline: existing titles, descriptions, canonical links, social images, icons, robots and sitemap retained. No route or anchor changes.
- Preservation wins: server-rendered copy, skip link, semantic headings/articles, keyboard focus, native mobile menu, native video controls, deferred video requests, responsive WebP posters.

## New visual system

Overhaul of visual presentation with content/IA preservation. Dials: `DESIGN_VARIANCE: 7`, `MOTION_INTENSITY: 4`, `VISUAL_DENSITY: 4`.

- Compact asymmetric introduction instead of a full-width typographic masthead.
- Staggered two-column project gallery, with real screenshots, full descriptions, grouped implementation facts, technology lists and all original actions.
- Experience reading rail and continuous chronology, capability matrix, credential shelf and integrated contact section.
- Slate neutrals and one teal accent, with system light/dark tokens for the whole page. Panels/media: 14px radius; controls: 8px.
- Self-hosted variable Geist and Geist Mono fonts with SIL OFL license. Primary font preload, high-priority featured poster and image sizing matched to the gallery.
- Motivated transform entry and action feedback, disabled under reduced motion. No scroll interception, autoplay or new animation dependencies.
- Explicit tablet adjustments and single-column mobile composition.

## Content-preservation precedence

`components/portfolio.tsx` is byte-for-byte unchanged. Rendered text and every link label, destination and download attribute matched the pre-redesign static export. All five public PDFs passed before/after SHA-256 comparison. The printable CV sources, content, qualifications, dates and contacts are untouched.

User instructions override Taste's requirements to trim copy, remove original punctuation/numbered labels, or generate new imagery. Original longer paragraphs, em dashes, labels, metadata and repeated CV/contact actions remain. Existing authentic product screenshots and videos are used rather than fabricated assets. Labels are styled as ordinary sentence-case text rather than uppercase tracking-heavy eyebrows.

## Verification

- `npm run build`: passed, including TypeScript and static export of both routes.
- `npm run lint`, `npx tsc --noEmit`, `git diff --check`: passed.
- Local Chrome/Playwright: 1440px desktop, 820px tablet, 390px mobile, 320px narrow mobile; desktop and mobile also tested in dark mode.
- Images loaded and decoded after scrolling; no horizontal overflow, browser exceptions, or axe WCAG 2/2.1 A/AA violations in the tested contexts.
- Hero actions visible in the first viewport; desktop header 76px, mobile header 68px.
- All five video instances played with native controls. Videos remain unloaded until requested.
- CV download returned the original filename. All CV/certificate responses returned valid PDF files. Every internal anchor resolved.
- Keyboard skip link, mobile navigation, back-to-top and reduced motion passed.
- Public GitHub, live-demo and Windows-installer links returned HTTP 200. Email/telephone actions retain their original `mailto:`/`tel:` destinations.
- Lighthouse on local production export: desktop performance 99; final mobile performance 95. Accessibility, best practices and SEO 100 in both. Final mobile LCP 2.7s, CLS 0, total blocking time 80ms. Image fetch priority/font preload/removal of an initial opacity fade improved mobile performance from 79 to 95.

## Limits

Browser checks used local Chrome, not Safari/Firefox or physical devices. Automated accessibility checks do not replace a full assistive-technology audit. LinkedIn returned HTTP 405 to the automated HEAD request, so its destination was not verified; the original URL is preserved. Email/telephone clients were not launched. Lighthouse measurements are lab estimates from a local static server without production compression/cache headers; mobile LCP remains slightly above Taste's 2.5s target. Real-user INP and production Core Web Vitals were not measured.

Temporary test tools, scripts, screenshots and Lighthouse reports are in `/tmp/cv-browser-check` and `/tmp/cv-*`, not project dependencies. The initial sandboxed build could not bind the local port required by Turbopack; the authorized build with local port access passed.
