# Theodore Nelson — Developer Portfolio

A recruiter-first software developer portfolio with an editorial layout, real project screenshots, and direct CV and contact links.

## Stack

- Next.js 16 with the App Router and static export
- TypeScript
- Tailwind CSS 4 and custom CSS
- Server-rendered content and native HTML navigation
- Lucide icons

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production

```bash
npm run build
```

The static production site is exported to `out/`.

## Content

The primary page is in `components/portfolio.tsx`. Visual styling and responsive behavior are in `app/globals.css`. Recruiter downloads, project captures, and metadata assets live in `public/`.

The site intentionally has no form backend, analytics dependency, remote font request, or public API key. Contact actions use direct email, telephone, LinkedIn, and GitHub links.

## Project image performance

Project posters use pre-generated WebP sizes (480, 800, and up to 1440 pixels)
through a custom Next.js image loader, so responsive images work on static hosting.
After replacing a source screenshot, run `node scripts/generate-project-posters.mjs`
and commit the generated files in `public/images/posters/`. The script uses the
Sharp package included with Next.js. Videos are requested only after pressing play.

## Downloadable developer CV

The active download is `public/Theodore_Nelson_CV_Junior_Developer.pdf`.
Edit `cv-junior-developer.html` and `assets/css/cv-developer-v2.css`, then run:

```bash
node scripts/generate-developer-cv.mjs
```

Requires local Chrome/Chromium (or `CV_BROWSER` set to its executable). The script
uses a temporary browser profile and exports real, tagged text with clickable links.
Run `npm run build` after regeneration to include the PDF in the static export.
The older `print-cv.html`, shared legacy stylesheet and PowerShell script belong
to the separate Systems Development CV; they do not generate the active download.
See `CV-DESIGN-REVIEW.md` for sources, resolved discrepancies and validation.
