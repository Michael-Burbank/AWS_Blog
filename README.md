# AWS-S3-Blog-Bucket

┌─────────────────────────────────────────────────────────────┐
│ HEADER (Sticky) │
│ [Logo/Name] Home | About | Progress | Blog | Contact 🌙 │
└─────────────────────────────────────────────────────────────┘

## Color & Component Guidelines

### Palette Variables

Defined in `src/assets/css/style.css`:

```css
--blue: #0ea5e9;      /* Azure accent */
--green: #10b981;     /* Emerald accent */
--rose: #f43f5e;      /* Rose accent */
--slate: #374151;     /* Brand header */
--slate-dark: #1f2937;/* Surface for update cards */
--navy: #0f172a;      /* Base text / footer */
--white: #ffffff;     /* Inverse text */
--gray-50: #f8fafc;   /* Neutral backgrounds */
--gray-100: #f1f5f9;  /* Subtle surface */
--gray-300: #cbd5e1;  /* Borders */
--amber: #ffca28;     /* Accessible focus outline */
```

Light accent backgrounds (blue, green, rose) use dark text for WCAG contrast; darker surfaces (slate, slate-dark, navy) use white text. When adding new accent categories, prefer a light background + dark text or provide a darker variant if you need white text.

### Learning Update Cards (3 Topics)

In `index.html` each daily card uses the structure:

```html
<article class="update-card learning-card">
  <article-title class="learning-card-header">
    <h3>Day X</h3>
    <span class="learning-date">MMM DD, YYYY</span>
  </article-title>
  <div class="learning-topics">
    <div class="learning-topic topic-aws">
      <h4>AWS: Title</h4>
      <p>Description.</p>
    </div>
    <div class="learning-topic topic-fullstack">
      <h4>Full Stack: Title</h4>
      <p>Description.</p>
    </div>
    <div class="learning-topic topic-security">
      <h4>Security+: Title</h4>
      <p>Description.</p>
    </div>
  </div>
</article>
```

Add new days by copying an existing card; keep headings short (≤60 chars) and descriptions concise (≤140 chars) for layout stability.

### Accessibility Notes

- Skip link present at top of pages.
- Mobile nav toggle uses `aria-expanded` and is keyboard accessible.
- Focus outlines standardized via `--amber`.
- Contrast: Avoid white text on light accent colors unless you darken the background.

### Future Enhancements (Optional)

- Dark mode via `prefers-color-scheme` media query.
- Extract a JSON data file for learning updates and render cards dynamically with JS.

┌─────────────────────────────────────────────────────────────┐
│ HERO SECTION │
│ [H1] Leveling Up Every Day │
│ [Subtext] Learning AWS, Security+, & Full Stack Dev │
│ [Buttons: View My Progress] [About Me] │
│ [Illustration / Profile Image →] │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ DAILY PROGRESS SECTION │
│ [Title] My Daily Learning Log │
│ [Tabs] All | AWS | Security+ | Full Stack │
│ ┌────────────┬────────────┬────────────┐ │
│ │ Date + Tag │ Date + Tag │ Date + Tag │ ← Progress Cards│
│ │ Title │ Title │ Title │ │
│ │ Excerpt │ Excerpt │ Excerpt │ │
│ └────────────┴────────────┴────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FEATURED PROJECTS SECTION │
│ [Title] Featured Projects │
│ ┌────────────┬────────────┬────────────┐ │
│ │ Thumbnail │ Thumbnail │ Thumbnail │ │
│ │ Project │ Project │ Project │ │
│ │ Desc + CTA │ Desc + CTA │ Desc + CTA │ │
│ └────────────┴────────────┴────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ABOUT ME SECTION │
│ [Profile Image ←] Hi, I'm Michael Burbank! |
│ [Short bio paragraph about your journey] │
│ [Resume Button] [Social Links] │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ BLOG SECTION │
│ [Title] Articles & Insights │
│ [Blog Card] [Blog Card] [Blog Card] ... │
│ [Load More ↓] │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CONTACT SECTION │
│ [Title] Let’s Connect │
│ [Form: Name | Email | Message | Submit] │
│ [Social Icons Row] │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FOOTER │
│ [Site Name + Tagline] | [Links] | [Social Icons] │
│ © 2025 [Your Name]. All rights reserved. │
└─────────────────────────────────────────────────────────────┘
