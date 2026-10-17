# Portfolio design direction

Reference: https://www.igloo.inc/ (inspiration, no copied assets or source).
Audience: recruiters, engineering teams, potential clients.
Direction: cinematic, icy, spatial, precise. A distinctive interactive opening
followed by useful, readable evidence of engineering work.

## Decisions

- Design variance 8/10, motion intensity 7/10 in the hero and 3/10 in content,
  visual density 3/10. Native CSS and a custom WebGL shader, no UI kit.
- One dark theme: near-black #080c0f, white #edf2f3, ice-blue #b6dce5.
- Self-hosted Geist for display/body and Geist Mono for technical captions.
- Oversized two-line identity; a rounded, fractured procedural ice sculpture.
- Slow rotation, damped pointer movement, and scroll-influenced orientation.
- Staggered project gallery with existing screenshots, playable demos, real links.
- Quiet experience timeline, capability groups, and direct contact information.
- Square media/control corners (2px); circles reserved for play/directional actions.

## Requirements for future changes

Keep all CV facts, project URLs, anchor IDs, credentials, downloads, metadata,
and clinician-review boundaries accurate. Do not invent achievements or metrics.
Preserve the current navigation labels and document routes.
Do not add gradients behind headings, skill percentage bars, generic stock imagery,
repeated glass cards, loading gates, scroll hijacking, or unnecessary sound.
Keep keyboard access, skip navigation, visible focus, readable contrast, and
single-column mobile layouts. Respect reduced motion. The WebGL renderer must
stop work offscreen/in hidden tabs, cap resolution/frame rate, release resources,
and retain a CSS fallback if unavailable. Never hide essential text behind WebGL.
Content is visible without JavaScript; only hydrated observers opt into reveals.

## Scope

Changes apply to the existing local Next.js site. Publishing is a separate task.
PDF CVs and factual source documents retain their existing formatting.
