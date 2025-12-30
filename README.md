# AWS_Blog — Static Site

A simple, accessible static site that documents a daily learning journey across AWS, DevOps, and Full Stack topics. The site is built with vanilla HTML/CSS and designed to be hosted on Amazon S3 behind CloudFront.

Live canonical: <https://michael-burbank.com/>

## Overview

This project consists of `index.html`, `style.css`, and optional `script.js`. Content is organized into:

- Sticky header with site title
- Hero section with a CTA
- Topics grid (AWS, DevOps, Full Stack)
- Daily learning updates (multi-topic cards per day)
- Footer with contact links and AWS attribution

## Project Structure

- `index.html` — page markup (hero, topics, daily updates, footer)
- `style.css` — theme variables, grid/card styles, responsive rules
- `script.js` — optional enhancements (deferred, not required)
- `fullstack.html`, `templates.html` — additional content pages (optional)

## Getting Started

Local preview (no build step required):

```bash
# macOS: open directly
open index.html

# Or serve locally (Python)
python3 -m http.server 8080
# then visit http://localhost:8080/
```

## Editing Content

### Topics Grid

Each topic card is an `<article>` with a class like `aws-topic-card`, `dev_ops-topic_card`, or `fullstack-topic-card`. Edit headings and descriptions in `index.html`.

### Daily Learning Cards

Daily updates use a consistent structure and date metadata:

```html
<article class="update-card learning-card" data-date="YYYY-MM-DD">
  <article-title class="learning-card-header">
    <h3>Day X</h3>
    <span class="learning-date">MMM DD, YYYY</span>
  </article-title>
  <div class="learning-topics">
    <div class="learning-topic topic-aws">
      <h4>AWS: Title</h4>
      <p>One-paragraph summary.</p>
    </div>
    <div class="learning-topic topic-fullstack">
      <h4>Full Stack: Title</h4>
      <p>One-paragraph summary.</p>
    </div>
    <div class="learning-topic topic-devops">
      <h4>DevOps: Title</h4>
      <p>One-paragraph summary.</p>
    </div>
  </div>
</article>
```

Guidelines:

- Headings ≤ ~60 chars, descriptions ≤ ~140 chars for layout stability.
- Use `topic-aws`, `topic-devops`, `topic-fullstack`, or `topic-security` to apply colored borders.
- Rest days can use `class="update-card learning-card rest-day"` for alternate styling.

## Theming (CSS Variables)

Defined in `style.css` under `:root`:

```css
--white: #ffffff;
--navy: #0f172a;
--slate: #374151;
--slate-dark: #1f2937;
--body-bg: #d7d7d7;

--blue: #0ea5e9;   /* AWS */
--green: #10b981;  /* DevOps */
--amber: #ffca28;  /* Full Stack */
--rose: #f43f5e;   /* Security */

/* Muted blends for modern browsers */
--blue-muted: color-mix(in srgb, var(--blue) 55%, var(--navy) 45%);
--green-muted: color-mix(in srgb, var(--green) 55%, var(--navy) 45%);
--amber-muted: color-mix(in srgb, var(--amber) 55%, var(--navy) 45%);
--rose-muted: color-mix(in srgb, var(--rose) 55%, var(--navy) 45%);

/* Rest day background */
--rest-day-bg-solid: color-mix(in srgb, var(--navy) 85%, var(--slate) 15%);
--rest-day-bg: rgba(36, 9, 44, 0.776);
```

Notes:

- Fallback values for older browsers are provided via `@supports not (color: color-mix(...))`.
- Topic border accents: `topic-aws`, `topic-devops`, `topic-fullstack`, `topic-security`.
- Special styling exists for Christmas Eve/Day cards.

## Accessibility

- Semantic sections and prominent headings
- Keyboard-friendly buttons and links (focus outlines)
- High-contrast hero and card surfaces
- Responsive grids with readable text sizes

## Deployment (AWS S3 + CloudFront)

Static hosting workflow:

- Upload files in the project root to your S3 bucket (e.g., `index.html`, `style.css`, `script.js`, images).
- Configure CloudFront to use the S3 bucket origin (prefer Origin Access Control/OAI).
- Set default root object to `index.html`.
- Invalidate CloudFront after updates:

```bash
# Example: sync to S3 (replace BUCKET)
aws s3 sync . s3://YOUR_BUCKET_NAME --exclude ".git/*" --exclude "*.md"

# Example: CloudFront invalidation
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/index.html" "/style.css" "/script.js"
```

## Notes

- Push content changes to your Git remote as usual; if you mirror to GitHub, ensure your Deploy Key has write access and trigger the mirror when needed.
- No build step is required; keep assets small and cache-friendly.

## Author

Michael Burbank — (<https://michael-burbank.com/>)
