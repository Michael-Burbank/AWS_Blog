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

// Reorder update cards and provide month archive filtering via ?month=YYYY-MM
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.update-grid');
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.update-card'));
    if (cards.length <= 1) return;

    const parseDateOnlyAsLocal = (value) => {
        if (!value) return NaN;
        const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!match) return NaN;

        const year = Number(match[1]);
        const monthIndex = Number(match[2]) - 1;
        const day = Number(match[3]);
        return new Date(year, monthIndex, day).getTime();
    };

    const parseTimestamp = (card) => {
        // 1) Prefer data-date attribute if present (ISO recommended: YYYY-MM-DD)
        const dataDate = card.getAttribute('data-date');
        if (dataDate) {
            const localDateOnlyTs = parseDateOnlyAsLocal(dataDate);
            if (!Number.isNaN(localDateOnlyTs)) return localDateOnlyTs;

            const t = Date.parse(dataDate);
            if (!Number.isNaN(t)) return t;
        }
        // 2) Look for a <time datetime="..."> element
        const timeEl = card.querySelector('time[datetime]');
        if (timeEl && timeEl.getAttribute('datetime')) {
            const datetimeValue = timeEl.getAttribute('datetime');
            const localDateOnlyTs = parseDateOnlyAsLocal(datetimeValue);
            if (!Number.isNaN(localDateOnlyTs)) return localDateOnlyTs;

            const t = Date.parse(datetimeValue);
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

    const validDates = withMeta
        .filter(({ ts }) => Number.isFinite(ts))
        .map(({ ts }) => new Date(ts));

    const months = Array.from(new Set(validDates.map((d) => {
        const month = String(d.getMonth() + 1).padStart(2, '0');
        return `${d.getFullYear()}-${month}`;
    }))).sort((a, b) => b.localeCompare(a));

    const params = new URLSearchParams(window.location.search);
    const requestedMonth = params.get('month');
    const selectedMonth = requestedMonth && months.includes(requestedMonth) ? requestedMonth : 'all';

    const updatesSection = document.getElementById('updates') || container.closest('.updates');
    if (!updatesSection) return;

    const archiveBar = document.createElement('nav');
    archiveBar.className = 'updates-archive';
    archiveBar.setAttribute('aria-label', 'Monthly update archive');

    const archiveLabel = document.createElement('span');
    archiveLabel.className = 'archive-label';
    archiveLabel.textContent = 'Archive:';
    archiveBar.appendChild(archiveLabel);

    const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

    const createArchiveLink = (key, label) => {
        const link = document.createElement('a');
        link.className = 'archive-link';
        link.href = key === 'all' ? `${window.location.pathname}#updates` : `${window.location.pathname}?month=${key}#updates`;
        link.dataset.month = key;
        link.textContent = label;
        return link;
    };

    archiveBar.appendChild(createArchiveLink('all', 'All'));

    months.forEach((monthKey) => {
        const [year, month] = monthKey.split('-').map(Number);
        const label = monthFormatter.format(new Date(year, month - 1, 1));
        archiveBar.appendChild(createArchiveLink(monthKey, label));
    });

    const status = document.createElement('p');
    status.className = 'archive-status';

    updatesSection.insertBefore(archiveBar, container);
    updatesSection.insertBefore(status, container);

    const setActiveArchiveLink = (monthKey) => {
        archiveBar.querySelectorAll('.archive-link').forEach((link) => {
            if (!(link instanceof HTMLAnchorElement)) return;
            if (link.dataset.month === monthKey) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    const applyMonthFilter = (monthKey) => {
        let visibleCount = 0;
        withMeta.forEach(({ el, ts }) => {
            if (monthKey === 'all') {
                el.hidden = false;
                visibleCount += 1;
                return;
            }

            if (!Number.isFinite(ts)) {
                el.hidden = true;
                return;
            }

            const dt = new Date(ts);
            const month = String(dt.getMonth() + 1).padStart(2, '0');
            const cardMonthKey = `${dt.getFullYear()}-${month}`;
            const isVisible = cardMonthKey === monthKey;
            el.hidden = !isVisible;
            if (isVisible) visibleCount += 1;
        });

        setActiveArchiveLink(monthKey);

        if (monthKey === 'all') {
            status.textContent = `Showing all updates (${visibleCount}).`;
        } else {
            const [year, month] = monthKey.split('-').map(Number);
            const label = monthFormatter.format(new Date(year, month - 1, 1));
            status.textContent = `Showing ${label} updates (${visibleCount}).`;
        }
    };

    const updateUrlMonth = (monthKey) => {
        const nextParams = new URLSearchParams(window.location.search);
        if (monthKey === 'all') {
            nextParams.delete('month');
        } else {
            nextParams.set('month', monthKey);
        }
        const query = nextParams.toString();
        const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}#updates`;
        window.history.pushState({ month: monthKey }, '', nextUrl);
    };

    archiveBar.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const link = target.closest('.archive-link');
        if (!(link instanceof HTMLAnchorElement)) return;

        event.preventDefault();
        const monthKey = link.dataset.month || 'all';
        applyMonthFilter(monthKey);
        updateUrlMonth(monthKey);
    });

    window.addEventListener('popstate', () => {
        const q = new URLSearchParams(window.location.search).get('month');
        const monthKey = q && months.includes(q) ? q : 'all';
        applyMonthFilter(monthKey);
    });

    applyMonthFilter(selectedMonth);
});