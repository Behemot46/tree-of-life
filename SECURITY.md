# Security Policy

## Scope

Tree of Life is a static website. It has no backend, no database, no user
accounts and no server-side code. Everything runs in the visitor's browser,
and the only data it stores is a handful of preferences in `localStorage`
(chosen language, colour theme, which species have been viewed).

No personal data is collected or transmitted.

## Supported versions

There are no releases or version branches. The site is deployed continuously
from `main`, so the deployed site is the only supported version. Fixes land on
`main` and go live on the next deploy.

## Reporting a vulnerability

Please report privately rather than opening a public issue:

- Use [GitHub's private vulnerability reporting](https://github.com/Behemot46/tree-of-life/security/advisories/new), or
- email **gabi.weisskopf@gmail.com**

Please include what you found, how to reproduce it, and what an attacker could
do with it. A proof of concept helps.

This is a personal project maintained in spare time. Expect an acknowledgement
within about a week. Valid reports will be fixed on `main` and credited in the
advisory unless you would rather stay anonymous.

## What is in scope

- Cross-site scripting through anything the page renders — species data,
  translated strings, or URL parameters such as `?node=`
- Content injection via the service worker or its caches
- Weaknesses in the Content-Security-Policy or other response headers
  (`vercel.json`)
- Supply-chain concerns in the deployment configuration

## What is out of scope

- **Third-party content.** Species photos load from Wikimedia Commons and
  species facts link to external conservation and research sites. Report
  problems with that content to whoever hosts it.
- Missing headers that only matter with a backend the site does not have.
- Denial of service against a static host.
- Reports produced purely by automated scanners, with no demonstrated impact.

## Notes for reviewers

The Content-Security-Policy in `vercel.json` allows `'unsafe-inline'` for
scripts. This is not an oversight: `index.html` uses inline `onclick`
handlers throughout, so the policy restricts *which origins* can be reached
rather than preventing inline execution. Removing those handlers would let the
policy tighten meaningfully, and is a welcome contribution.

`serve.js` reads the same header block from `vercel.json`, so the development
server and the smoke tests enforce the deployed policy. `scripts/smoke.mjs`
fails if the page triggers any CSP violation.
