const MENU_BREAKPOINT = 768;
const btn = document.getElementById('menu-toggle');
const nav = document.getElementById('primary-nav');

if (btn && nav) {
    // Toggle menu open/close
    btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isOpen));
        nav.classList.toggle('open', !isOpen);

        const icon = btn.querySelector('i');
        if (icon) {
            icon.classList.toggle('ri-menu-line', isOpen);
            icon.classList.toggle('ri-close-line', !isOpen);
        }
    });

    // Close menu on link click (mobile)
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= MENU_BREAKPOINT && nav.classList.contains('open')) {
                nav.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.classList.add('ri-menu-line');
                    icon.classList.remove('ri-close-line');
                }
            }
        });
    });

    // Ensure menu closes when viewport is resized above breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > MENU_BREAKPOINT && nav.classList.contains('open')) {
            nav.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.add('ri-menu-line');
                icon.classList.remove('ri-close-line');
            }
        }
    });
}

(() => {
    const BREAKPOINT = 768;
    const btn = document.getElementById('menu-toggle');
    const nav = document.getElementById('primary-nav');
    if (!btn || !nav) return;

    const icon = btn.querySelector('i');

    const openMenu = () => {
        nav.classList.add('nav-links-open');
        btn.setAttribute('aria-expanded', 'true');
        if (icon) {
            icon.classList.remove('ri-menu-line');
            icon.classList.add('ri-close-line');
        }
    };

    const closeMenu = () => {
        nav.classList.remove('nav-links-open');
        btn.setAttribute('aria-expanded', 'false');
        if (icon) {
            icon.classList.add('ri-menu-line');
            icon.classList.remove('ri-close-line');
        }
    };

    btn.addEventListener('click', () => {
        const isOpen = nav.classList.contains('nav-links-open');
        isOpen ? closeMenu() : openMenu();
    });

    // Close when a nav link is clicked on mobile
    nav.addEventListener('click', (e) => {
        if (e.target instanceof Element && e.target.closest('a') && window.innerWidth <= BREAKPOINT) {
            closeMenu();
        }
    });

    // Close if resizing above breakpoint
    const onResize = () => {
        if (window.innerWidth > BREAKPOINT) {
            closeMenu();
        }
    };
    window.addEventListener('resize', onResize);

    // Ensure correct initial state
    onResize();
})();

// Smooth scroll to updates section on progress link click
document.addEventListener('DOMContentLoaded', () => {
    const progressLink = document.querySelector('a.btn[href="#updates"]');
    if (!progressLink) return;

    progressLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById('updates');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Optional: ensure no hash remains if present
        if (location.hash) {
            history.replaceState(null, '', location.pathname + location.search);
        }
    });
});

// Reorder update cards so newest appear first (earliest at the back)
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.update-grid');
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.update-card'));
    if (cards.length <= 1) return;

    const parseTimestamp = (card) => {
        // 1) Prefer data-date attribute if present (ISO recommended: YYYY-MM-DD)
        const dataDate = card.getAttribute('data-date');
        if (dataDate) {
            const t = Date.parse(dataDate);
            if (!Number.isNaN(t)) return t;
        }
        // 2) Look for a <time datetime="..."> element
        const timeEl = card.querySelector('time[datetime]');
        if (timeEl && timeEl.getAttribute('datetime')) {
            const t = Date.parse(timeEl.getAttribute('datetime'));
            if (!Number.isNaN(t)) return t;
        }
        // 3) Fallback: parse visible text in .learning-date (e.g., "December 10, 2025")
        const dateEl = card.querySelector('.learning-date');
        if (dateEl && dateEl.textContent) {
            const t = Date.parse(dateEl.textContent.trim());
            if (!Number.isNaN(t)) return t;
        }
        return NaN;
    };

    const withMeta = cards.map((el, idx) => ({ el, idx, ts: parseTimestamp(el) }));
    // Sort by timestamp desc (newest first). Unknown dates (NaN) go last. Stable by original index.
    withMeta.sort((a, b) => {
        const aKnown = Number.isFinite(a.ts);
        const bKnown = Number.isFinite(b.ts);
        if (aKnown && bKnown) {
            if (b.ts !== a.ts) return b.ts - a.ts;
            return a.idx - b.idx;
        }
        if (aKnown && !bKnown) return -1;
        if (!aKnown && bKnown) return 1;
        return a.idx - b.idx;
    });

    // Re-append in sorted order
    withMeta.forEach(({ el }) => container.appendChild(el));
});