# Security Notes

This portfolio was rebuilt as a static site with security-first defaults and a deliberately reduced attack surface.

## Security goals

- minimize client-side attack surface
- avoid unnecessary collection of visitor data
- remove public secrets from frontend code
- reduce third-party dependency risk
- keep the site easy to audit

## Current protections

- Static-only architecture for the portfolio page.
- Restrictive Content Security Policy defined in `index.html`.
- No inline interactive scripts.
- No third-party form processor embedded in the page.
- No live chat or browser-loaded socket client.
- No remote JavaScript sources.
- No external font dependency.
- External links use `rel="noopener noreferrer"` where appropriate.
- Contact path is direct email and public profile links only.

## Removed during hardening

- Public Web3Forms access key in page markup.
- Live chat widget and related client logic.
- Chat server code and deployment configuration.
- Dynamic remote script injection for socket client loading.
- Extra browser connectivity that was not required for a CV portfolio.

## Remaining considerations

This is still a public website, so normal web hygiene still matters:

- Keep dependencies minimal.
- Review all future script additions carefully.
- Re-check CSP if new functionality requires network access.
- Validate any future backend endpoints server-side.
- Never expose private tokens, secrets, or admin keys in HTML, CSS, or JavaScript.
- Review downloadable assets before publishing them.

## Change review checklist

Before publishing future updates, check:

- Does the change add user input handling?
- Does the change add a new network dependency?
- Does the change introduce a third-party script, widget, or form service?
- Does the change require CSP changes?
- Does the change expose any secret, token, or internal URL?
- Does the change create a new phishing, spam, or abuse surface?
- Does the change still work with JavaScript disabled for core CV access?

## Recommended next hardening steps

- Serve the site only over HTTPS.
- Add security headers at the hosting layer as well, not only in HTML.
- Consider a stricter host-level CSP and `X-Content-Type-Options: nosniff`.
- Consider `Permissions-Policy` to disable browser features you do not use.
- Periodically review external outbound links and downloadable files.

## Reporting and maintenance

If this site later gains a backend, form processing, authentication, or admin features, perform a fresh security review before release.
