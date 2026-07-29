# Theodore Nelson — Developer Portfolio

A recruiter-first software developer portfolio designed as a premium product experience.

## Stack

- Next.js 16 with the App Router and static export
- TypeScript
- Tailwind CSS 4 and custom CSS
- GSAP with ScrollTrigger
- Framer Motion
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
