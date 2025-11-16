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