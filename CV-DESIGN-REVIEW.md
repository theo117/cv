# Downloadable CV redesign

## Sources and factual review

Reviewed both existing public CV PDFs, `cv-junior-developer.html`, `print-cv.html`,
`components/portfolio.tsx`, and the V2 palette/type rules in `app/globals.css`.
The existing active download was the Junior Developer PDF.

- Pinnacle ICT: Software Developer Intern, 2026–Present, unchanged.
- Teodor Dev Tech: Software Developer, 2022–2025. User explicitly selected the
  portfolio version over the CV's Junior Systems Developer, 2022–Present entry.
  Self-directed and small-client context retained.
- Adcock Ingram: IT Technician, 2018–2022; Netsurit: IT Technician, 2012–2015.
  Employer/date mapping matches V2 and the Systems Development CV.
- Removed the unsupported “10 years” support total; retained the experience itself.
- All three qualifications, providers and dates retained. “Systems” uses V2's
  spelling; the 2022–2024 study range comes from the CV (V2 shows completion in 2024).
  Microsoft credential title is also confirmed by text in the certificate PDF.
- ChurchFlow and Church Management System are shown together, matching the shared
  repository. TradeFlow receives the featured position established by V2.
- Clinical Reasoning Assistant description and stack come from V2; clinician review
  is retained. No new project outcomes or metrics added.
- Existing skill inventory retained; JWT and MSI are also supported by V2.
  Clinical project technologies are listed in their project context.
- Phone, email, location, GitHub, LinkedIn and portfolio address match the sources.
  Phone is formatted internationally, matching V2's telephone link.
- Responsibilities condensed without adding seniority or achievements. All four
  roles, three qualifications and original three projects remain; a fourth project
  is added from V2. No other CV facts intentionally removed except the disputed
  support total and the employment details replaced with the user's confirmation.

## Design and implementation

Two A4 pages: identity/profile/skills/experience, then projects/education.
10.5 pt body text, near-black ink, small lime marks, thin rules and monospace labels.
White paper keeps printing economical; decoration carries no essential information.
Single-column source and reading order, embedded fonts, real selectable text.
Standalone CSS avoids affecting the website or older CV variants.

Replaced the existing active PDF in place, preserving all Download CV URLs.
The “View my full CV” action now points to that PDF rather than the homepage.
No website design changes. The Systems Development PDF remains a separate legacy
variant; the main website uses the redesigned Junior Developer PDF.

## Validation

- Chrome export: two A4 pages, tagged PDF, approximately 85 KiB.
- Poppler `pdftotext -raw` and layout extraction: sensible section and entry order;
  name spacing adjusted after extraction revealed a merged word.
- Embedded fonts and Unicode mappings confirmed with `pdffonts`.
- Thirteen PDF link annotations verified: five contacts and eight project links.
- All ten non-LinkedIn HTTPS destinations returned HTTP 200. LinkedIn rejects
  automated requests (HEAD 405, GET 999); its URL matches both existing sources,
  but remote availability could not be verified automatically.
- Raster proofs reviewed for both pages; grayscale page-one proof reviewed.
  Text bounds checked inside printable margins, with clear footer separation.
  Print validation is via A4 PDF rendering, not a physical printer or proprietary ATS.
- Production build passed. Static export download links checked against the PDF.

Regenerate with `node scripts/generate-developer-cv.mjs`; then rebuild the site.

## Employer location correction

User confirmed Pinnacle ICT, Adcock Ingram and Netsurit are in Johannesburg;
Teodor Dev Tech is in Pretoria. Updated the active CV accordingly, retaining
Pretoria as the personal contact location. Regenerated the PDF and static export.

## Certificate download links

Added a Download certificate link beside each education provider, using absolute
HTTPS URLs for the three existing portfolio certificate PDFs so links work from
a downloaded CV. Regenerated the active PDF and static export; verified all three
PDF link annotations and retained two-page A4 layout and footer clearance.
