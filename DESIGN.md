# Portfolio design direction

Reference: https://www.igloo.inc/.
Audience: recruiters, engineering teams, and potential clients.
Direction: the reference's actual frozen landscape and refractive ice, presented
with Theodore Nelson's identity, CV facts, project evidence, and contact details.

## Scene source and architecture

The user supplied `igloo.inc-1792247687360.zip`. It contains the original page
shell, compiled bootstrap, and fonts, but omits the dynamically imported
`App3D-d68cb154.js` and its models, textures, and decoders. Those referenced public
runtime dependencies were recovered and mirrored under `public/igloo/assets/`.
Original dependency license/attribution headers are retained. See
`public/igloo/NOTICE.txt` and `scripts/prepare-igloo-runtime.py` for the adapter.

The previous procedural ray-marched approximation has been replaced by the
reference production renderer, original Draco geometry, compressed KTX2 textures,
environment lighting, postprocessing, camera choreography, and compositing.
A first-party adapter removes the original branded interface, project router,
audio, detail pages, and particle footer. The ice contains an original extruded
TN monogram instead of the reference's branded inner object.

The renderer runs in its own iframe to isolate its Svelte/Three.js runtime and
styles. React owns all visible text, links, navigation, videos, and CV content.
The small frame document is embedded with `srcDoc`, avoiding differences in
how development servers and static hosts route `.html` files. Its script and
asset URLs remain absolute local paths; the message bridge uses the inherited
`window.origin` because `location.origin` is null inside `about:srcdoc`.
The validated postMessage bridge accepts only the expected source window and
same origin. All scene assets load locally; there is no dependency on the live
reference website, analytics integration, or audio playback.

## Presentation

- Design variance 8/10, motion intensity 7/10 in the opening, 3/10 in content,
  visual density 3/10. Retain the existing Next.js application.
- The full-viewport scene uses the original silver-grey environment (#a0a5b1).
  Dark identity/navigation type leaves the architecture visible. Main CV content
  retains near-black #080c0f, white #edf2f3, and the ice-blue #b6dce5 accent.
- Self-hosted Geist and Geist Mono remain the HTML typography.
- Keep the actual project videos and screenshots in a staggered gallery,
  followed by experience, capabilities, education, and direct contact links.
- Preserve page routes, section IDs, navigation labels, metadata, credentials,
  CV downloads, all employment facts, and clinician-review boundaries.
- Do not invent achievements, metrics, or experience claims.

## Motion, rendering, and fallbacks

Native sticky positioning holds the opening for 260svh. Ordinary document scroll
controls the original igloo breakup, camera movement, frost/chromatic transition,
and ice-block scene. There are no wheel/touch interception or automatic-scroll
handlers. The work link bypasses the sequence.

The extra scroll distance is enabled only when the renderer is ready and the
user is still near the opening, so a slow load does not move already-visible CV
content. A rendered WebP poster is visible immediately and remains as the fallback
without WebGL2, during loading, or if the scene fails. No loading gate blocks the CV.

Render targets are capped at 900,000 pixels and a maximum DPR of 1; the renderer's
ticker is capped at 30 fps. Offscreen/hidden states stop drawing. Pause freezes
progress and rendering. Reduced motion removes the pinned interval and renders a
static opening landscape. Pointer movement is forwarded only while active and
unpaused. Preserve visible focus, skip navigation, mobile layouts, and readable text.

## Scope and maintenance

Changes remain local until publication is requested. PDF formatting is unchanged.
The vendor runtime is a compiled capture, not the original authoring project.
Keep first-party integration changes in the preparation script and scene bridge;
do not hand-edit the generated minified runtime without updating its preparation
patches. The preparation script checks exact patch locations and fails on an
unexpected upstream build.
