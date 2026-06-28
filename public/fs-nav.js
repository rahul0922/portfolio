document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Mobile Menu Overlay Toggle
    // ----------------------------------------------------
    const toggleBtn = document.querySelector('.fs-menu-toggle');
    const overlay = document.querySelector('.fs-nav-overlay');
    const mobileLinks = document.querySelectorAll('.fs-nav-overlay .fs-nav-item a');

    if (toggleBtn && overlay) {
        toggleBtn.addEventListener('click', () => {
            const isOpen = toggleBtn.classList.contains('is-open');
            if (isOpen) {
                toggleBtn.classList.remove('is-open');
                overlay.classList.remove('is-active');
            } else {
                toggleBtn.classList.add('is-open');
                overlay.classList.add('is-active');
            }
        });

        // Close mobile overlay on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleBtn.classList.remove('is-open');
                overlay.classList.remove('is-active');
            });
        });
    }

    // ----------------------------------------------------
    // 2. Desktop Sliding Pill Background Indicator
    // ----------------------------------------------------
    const linksContainer = document.querySelector('.fs-nav-links');
    const pill = document.querySelector('.fs-nav-pill');
    const items = document.querySelectorAll('.fs-nav-desktop .fs-nav-item');

    if (linksContainer && pill && items.length > 0) {
        let activeItem = linksContainer.querySelector('.is-active');

        // Function to reposition and resize the pill behind an item
        const positionPill = (item) => {
            if (!item) {
                pill.style.opacity = '0';
                return;
            }
            const rect = item.getBoundingClientRect();
            const containerRect = linksContainer.getBoundingClientRect();

            // Calculate position relative to container
            const left = rect.left - containerRect.left;
            const top = rect.top - containerRect.top;

            pill.style.transform = `translate3d(${left}px, ${top}px, 0)`;
            pill.style.width = `${rect.width}px`;
            pill.style.height = `${rect.height}px`;
            pill.style.opacity = '1';
        };

        // Initialize pill position
        const initPill = () => {
            activeItem = linksContainer.querySelector('.is-active') || linksContainer.querySelector('.fs-nav-item');
            if (activeItem) {
                positionPill(activeItem);
            }
        };

        // Run initialization (with slight delays to ensure layouts/fonts are loaded and layout is calculated)
        setTimeout(initPill, 100);
        setTimeout(initPill, 800); // Back-up for lazy-loaded layouts

        // Resize handler to recalculate coordinates when window layout changes
        window.addEventListener('resize', initPill);

        // Hover handlers
        items.forEach(item => {
            item.addEventListener('mouseenter', () => {
                positionPill(item);
            });
        });

        // Reset to active item when mouse leaves the navbar capsule
        linksContainer.addEventListener('mouseleave', () => {
            activeItem = linksContainer.querySelector('.is-active') || linksContainer.querySelector('.fs-nav-item');
            positionPill(activeItem);
        });

        // MutationObserver to automatically slide pill when ScrollTrigger changes .is-active class on scroll
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('is-active')) {
                        // Only auto-slide if user is not hovering the menu
                        const isHovered = linksContainer.matches(':hover');
                        if (!isHovered) {
                            positionPill(target);
                        }
                    }
                }
            });
        });

        // Observe class changes on all menu items
        items.forEach(item => {
            observer.observe(item, { attributes: true, attributeFilter: ['class'] });
        });
    }
});
