document.addEventListener('DOMContentLoaded', () => {
    (function() {
        
        // ============ DOM ELEMENTS ============
        const announcementBar = document.getElementById('announcement-bar');
        const closeAnnouncementBtn = document.getElementById('close-announcement');
        const mainNavbar = document.getElementById('main-navbar');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenuPanel = document.getElementById('mobile-menu-panel');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        const mobileMenuClose = document.getElementById('mobile-menu-close');
        const menuIconOpen = document.getElementById('menu-icon-open');
        const menuIconClose = document.getElementById('menu-icon-close');
        const searchToggle = document.getElementById('search-toggle');
        const searchOverlay = document.getElementById('search-overlay');
        const searchPanel = document.getElementById('search-panel');
        const searchClose = document.getElementById('search-close');
        const searchInput = document.getElementById('search-input');
        const megaMenuContainer = document.getElementById('mega-menus-container');
        const megaMenuBridge = document.getElementById('mega-menu-bridge');

        // ============ STATE ============
        let mobileMenuOpen = false;
        let searchOpen = false;
        let activeMegaMenu = null;
        let megaMenuTimeout = null;
        let isHoveringMega = false;

        // ============ ANNOUNCEMENT BAR ============
        if (closeAnnouncementBtn && announcementBar) {
            closeAnnouncementBtn.addEventListener('click', () => {
                announcementBar.style.maxHeight = '0px';
                announcementBar.style.opacity = '0';
                announcementBar.style.pointerEvents = 'none';
                setTimeout(() => {
                    announcementBar.style.display = 'none';
                }, 400);
            });
        }

        // ============ STICKY NAVBAR ============
        let lastScrollY = 0;
        const handleScroll = () => {
            const scrollY = window.scrollY;
            if (scrollY > 80) {
                mainNavbar.classList.add('shadow-lg', 'border-border-soft');
                mainNavbar.classList.remove('shadow-sm', 'border-transparent');
            } else {
                mainNavbar.classList.add('shadow-sm', 'border-transparent');
                mainNavbar.classList.remove('shadow-lg', 'border-border-soft');
            }
            lastScrollY = scrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        // ============ MOBILE MENU ============
        const openMobileMenu = () => {
            mobileMenuOpen = true;
            mobileMenuPanel.classList.remove('translate-x-full');
            mobileMenuPanel.classList.add('translate-x-0');
            mobileMenuOverlay.classList.remove('invisible', 'opacity-0');
            mobileMenuOverlay.classList.add('opacity-100');
            document.body.classList.add('menu-open');
            menuIconOpen.classList.add('hidden');
            menuIconClose.classList.remove('hidden');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
            mobileMenuToggle.setAttribute('aria-label', 'Закрыть меню');
        };

        const closeMobileMenu = () => {
            mobileMenuOpen = false;
            mobileMenuPanel.classList.add('translate-x-full');
            mobileMenuPanel.classList.remove('translate-x-0');
            mobileMenuOverlay.classList.add('invisible', 'opacity-0');
            mobileMenuOverlay.classList.remove('opacity-100');
            document.body.classList.remove('menu-open');
            menuIconOpen.classList.remove('hidden');
            menuIconClose.classList.add('hidden');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.setAttribute('aria-label', 'Открыть меню');
        };

        mobileMenuToggle.addEventListener('click', () => {
            if (mobileMenuOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        mobileMenuClose.addEventListener('click', closeMobileMenu);
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);

        // Close mobile menu on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenuOpen) {
                closeMobileMenu();
                mobileMenuToggle.focus();
            }
        });

        // ============ MOBILE ACCORDION ============
        const accordionTriggers = document.querySelectorAll('.mobile-accordion-trigger');
        accordionTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const content = trigger.nextElementSibling;
                const chevron = trigger.querySelector('.accordion-chevron');
                const isOpen = !content.classList.contains('hidden');

                // Close all other accordions
                document.querySelectorAll('.mobile-accordion-content').forEach(c => c
                    .classList.add('hidden'));
                document.querySelectorAll('.accordion-chevron').forEach(ch => ch.style
                    .transform = 'rotate(0deg)');

                if (!isOpen) {
                    content.classList.remove('hidden');
                    if (chevron) chevron.style.transform = 'rotate(180deg)';
                }
            });
        });

        // ============ SEARCH OVERLAY ============
        const openSearch = () => {
            searchOpen = true;
            searchOverlay.classList.remove('invisible', 'opacity-0', 'pointer-events-none');
            searchOverlay.classList.add('opacity-100');
            searchPanel.classList.remove('scale-95');
            searchPanel.classList.add('scale-100');
            document.body.classList.add('menu-open');
            setTimeout(() => {
                searchInput.focus();
            }, 200);
        };

        const closeSearch = () => {
            searchOpen = false;
            searchOverlay.classList.add('invisible', 'opacity-0', 'pointer-events-none');
            searchOverlay.classList.remove('opacity-100');
            searchPanel.classList.add('scale-95');
            searchPanel.classList.remove('scale-100');
            document.body.classList.remove('menu-open');
            searchInput.value = '';
        };

        searchToggle.addEventListener('click', () => {
            if (searchOpen) {
                closeSearch();
            } else {
                openSearch();
            }
        });

        searchClose.addEventListener('click', closeSearch);
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                closeSearch();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOpen) {
                closeSearch();
                searchToggle.focus();
            }
            // Ctrl+K or / to open search
            if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !searchOpen && !mobileMenuOpen &&
                document.activeElement === document.body)) {
                e.preventDefault();
                openSearch();
            }
        });

        // ============ DESKTOP MEGA MENUS ============
        const megaParents = document.querySelectorAll('.mega-menu-parent');
        const allMegas = document.querySelectorAll(
            '#services-mega, #projects-mega, #catalog-mega, #about-dropdown');
        const navTriggers = document.querySelectorAll('.nav-trigger');

        const showMega = (menuId) => {
            if (activeMegaMenu === menuId) return;
            hideAllMegas(true);
            const menu = document.getElementById(menuId);
            if (menu) {
                menu.classList.remove('invisible', 'opacity-0', 'pointer-events-none', '-translate-y-2',
                    'scale-[0.98]');
                menu.classList.add('opacity-100', 'translate-y-0', 'scale-100');
                menu.style.pointerEvents = 'auto';
                if (megaMenuBridge) megaMenuBridge.classList.remove('hidden');
                activeMegaMenu = menuId;
                // Update aria-expanded on trigger
                const trigger = document.querySelector(`[data-mega="${menuId}"]`);
                if (trigger) trigger.setAttribute('aria-expanded', 'true');
            }
        };

        const hideAllMegas = (instant = false) => {
            allMegas.forEach(menu => {
                if (instant) {
                    menu.style.transition = 'none';
                }
                menu.classList.add('invisible', 'opacity-0', 'pointer-events-none', '-translate-y-2',
                    'scale-[0.98]');
                menu.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
                menu.style.pointerEvents = 'none';
                if (instant) {
                    // Force reflow
                    menu.offsetHeight;
                    menu.style.transition = '';
                }
            });
            if (megaMenuBridge) megaMenuBridge.classList.add('hidden');
            activeMegaMenu = null;
            navTriggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
        };

        // Hover handlers for mega menu parents
        megaParents.forEach(parent => {
            parent.addEventListener('mouseenter', () => {
                const trigger = parent.querySelector('.nav-trigger');
                if (trigger) {
                    const menuId = trigger.getAttribute('data-mega');
                    if (menuId) {
                        clearTimeout(megaMenuTimeout);
                        showMega(menuId);
                    }
                }
                isHoveringMega = true;
            });

            parent.addEventListener('mouseleave', () => {
                isHoveringMega = false;
                megaMenuTimeout = setTimeout(() => {
                    if (!isHoveringMega && activeMegaMenu) {
                        hideAllMegas();
                    }
                }, 180);
            });
        });

        // Bridge hover - keeps menu open
        if (megaMenuBridge) {
            megaMenuBridge.addEventListener('mouseenter', () => {
                isHoveringMega = true;
                clearTimeout(megaMenuTimeout);
            });
            megaMenuBridge.addEventListener('mouseleave', () => {
                isHoveringMega = false;
                megaMenuTimeout = setTimeout(() => {
                    if (!isHoveringMega && activeMegaMenu) {
                        hideAllMegas();
                    }
                }, 180);
            });
        }

        // Keep menus open when hovering over them
        allMegas.forEach(menu => {
            menu.addEventListener('mouseenter', () => {
                isHoveringMega = true;
                clearTimeout(megaMenuTimeout);
            });
            menu.addEventListener('mouseleave', () => {
                isHoveringMega = false;
                megaMenuTimeout = setTimeout(() => {
                    if (!isHoveringMega && activeMegaMenu) {
                        hideAllMegas();
                    }
                }, 180);
            });
        });

        // Keyboard: Escape closes mega menus
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && activeMegaMenu && !mobileMenuOpen && !searchOpen) {
                hideAllMegas(true);
            }
        });

        // ============ INITIALIZATION ============
        // Set initial nav state based on scroll position
        handleScroll();

        console.log('🌿 Sequoya header initialized successfully.');
        console.log('   Mobile menu: ready | Mega menus: ready | Search: ready (Ctrl+K)');

    })();

    // COMPARISON BEFORE AND AFTER SLIDER CODE
    (function() {
        const container = document.getElementById('comparison-container');
        const afterImage = document.getElementById('after-image');
        const dividerLine = document.getElementById('divider-line');
        const handle = document.getElementById('handle');
        const rangeSlider = document.getElementById('range-slider');

        if (!container || !afterImage || !dividerLine || !handle || !rangeSlider) return;

        let isDragging = false;

        function updatePosition(clientX) {
            const rect = container.getBoundingClientRect();
            let x = clientX - rect.left;
            // Clamp within container
            x = Math.max(0, Math.min(x, rect.width));
            const percent = (x / rect.width) * 100;
            
            // Update clip-path
            afterImage.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
            // Update divider and handle position
            dividerLine.style.left = percent + '%';
            handle.style.left = percent + '%';
            // Update range input
            rangeSlider.value = percent;
        }

        function onPointerDown(e) {
            e.preventDefault();
            isDragging = true;
            container.style.cursor = 'ew-resize';
        }

        function onPointerMove(e) {
            if (!isDragging) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updatePosition(clientX);
        }

        function onPointerUp() {
            isDragging = false;
            container.style.cursor = '';
        }

        // Mouse events
        handle.addEventListener('mousedown', onPointerDown);
        window.addEventListener('mousemove', onPointerMove);
        window.addEventListener('mouseup', onPointerUp);

        // Touch events
        handle.addEventListener('touchstart', onPointerDown, { passive: false });
        window.addEventListener('touchmove', onPointerMove, { passive: false });
        window.addEventListener('touchend', onPointerUp);

        // Range input change (for keyboard/accessibility)
        rangeSlider.addEventListener('input', (e) => {
            const percent = parseFloat(e.target.value);
            afterImage.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
            dividerLine.style.left = percent + '%';
            handle.style.left = percent + '%';
        });

        // Click on container to jump position (optional)
        container.addEventListener('click', (e) => {
            if (e.target === rangeSlider) return; // ignore range clicks
            updatePosition(e.clientX);
        });

        // Initialize at 50%
        updatePosition(container.getBoundingClientRect().left + container.getBoundingClientRect().width / 2);
    })();

    // END: COMPARISON BEFORE AND AFTER SLIDER CODE

    // PROJECTS SCROLL CODE

    (function() {
        const container = document.getElementById('projects-scroll-container');
        const leftBtn = document.getElementById('scroll-left');
        const rightBtn = document.getElementById('scroll-right');
        if (!container || !leftBtn || !rightBtn) return;

        function updateArrowButtons() {
            // Disable left button if at start, right button if at end
            const scrollLeft = container.scrollLeft;
            const maxScrollLeft = container.scrollWidth - container.clientWidth;
            leftBtn.disabled = scrollLeft <= 0;
            rightBtn.disabled = scrollLeft >= maxScrollLeft - 1;
        }

        function scrollBy(amount) {
            container.scrollBy({ left: amount, behavior: 'smooth' });
        }

        leftBtn.addEventListener('click', () => {
            scrollBy(-380); // approximate card width
        });
        rightBtn.addEventListener('click', () => {
            scrollBy(380);
        });

        container.addEventListener('scroll', updateArrowButtons);
        window.addEventListener('resize', updateArrowButtons);
        // Initialize
        updateArrowButtons();
    })();

    // END:PROJECTS SCROLL CODE

    // CATALOG SCROLL CODE

    (function() {
        const container = document.getElementById('catalog-scroll-container');
        const leftBtn = document.getElementById('catalog-scroll-left');
        const rightBtn = document.getElementById('catalog-scroll-right');
        if (!container || !leftBtn || !rightBtn) return;

        function updateButtons() {
            const scrollLeft = container.scrollLeft;
            const maxScroll = container.scrollWidth - container.clientWidth;
            leftBtn.disabled = scrollLeft <= 0;
            rightBtn.disabled = scrollLeft >= maxScroll - 1;
        }

        leftBtn.addEventListener('click', () => container.scrollBy({ left: -260, behavior: 'smooth' }));
        rightBtn.addEventListener('click', () => container.scrollBy({ left: 260, behavior: 'smooth' }));

        container.addEventListener('scroll', updateButtons);
        window.addEventListener('resize', updateButtons);
        updateButtons();
    })();

    // END: CATALOG SCROLL CODE

    // TESTIMONIAL GRID CODE

    (function() {
        const grid = document.getElementById('testimonial-grid');
        const loadingEl = document.getElementById('testimonial-loading');
        const errorEl = document.getElementById('testimonial-error');

        // Star SVG template
        const starSVG = `<svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>`;

        function renderStars(rating) {
            const fullStars = Math.floor(rating);
            const hasHalf = rating % 1 >= 0.5;
            let stars = '';
            for (let i = 0; i < fullStars; i++) {
                stars += starSVG;
            }
            // For simplicity we only use full stars here (all reviews are 5 stars anyway)
            // If you need half stars, add additional SVG with partial fill.
            return `<div class="ml-auto flex items-center gap-0.5 text-accent">${stars}</div>`;
        }

        function createCard(review) {
            const card = document.createElement('div');
            card.className = "bg-background rounded-2xl border border-border-soft p-6 md:p-8 flex flex-col h-full hover:shadow-xl hover:shadow-primary/5 transition-shadow duration-300";
            card.innerHTML = `
                <div class="text-accent text-4xl font-heading leading-none mb-4">“</div>
                <blockquote class="text-text/80 italic leading-relaxed mb-6 flex-grow text-base">
                    «${review.quote}»
                </blockquote>
                <div class="flex items-center gap-4 mt-auto pt-4 border-t border-border-soft">
                    <div class="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-lg font-bold text-secondary flex-shrink-0">
                        ${review.initials}
                    </div>
                    <div>
                        <p class="font-semibold text-primary text-sm">${review.name}</p>
                        <p class="text-xs text-muted">${review.location}</p>
                    </div>
                    ${renderStars(review.rating)}
                </div>
            `;
            return card;
        }

        async function loadReviews() {
            try {
                loadingEl.classList.remove('hidden');
                grid.innerHTML = ''; // clear any placeholders
                const response = await fetch('/data/reviews.json');
                if (!response.ok) throw new Error('Network response was not ok');
                const reviews = await response.json();
                if (!Array.isArray(reviews) || reviews.length === 0) {
                    throw new Error('Empty or invalid data');
                }
                // Take up to 6 reviews for the grid (or all if less)
                const displayReviews = reviews.slice(0, 6);
                displayReviews.forEach(review => {
                    grid.appendChild(createCard(review));
                });
                loadingEl.classList.add('hidden');
            } catch (error) {
                console.error('Failed to load reviews:', error);
                loadingEl.classList.add('hidden');
                errorEl.classList.remove('hidden');
            }
        }

        // Initialize
        if (grid) {
            loadReviews();
        }
    })();

    // END: TESTIMONIAL GRID CODE

    // NEWSLETTER SUBSCRIPTION CODE
    (function() {
        const form = document.getElementById('lead-form');
        const successMsg = document.getElementById('form-success');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simple validation
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const consent = document.getElementById('consent').checked;
            if (!name || !phone || !consent) {
                alert('Пожалуйста, заполните обязательные поля (Имя, Телефон) и дайте согласие на обработку данных.');
                return;
            }
            // Simulate submission
            form.reset();
            successMsg.classList.remove('hidden');
            form.querySelector('button[type="submit"]').disabled = true;
            setTimeout(() => {
                successMsg.classList.add('hidden');
                form.querySelector('button[type="submit"]').disabled = false;
            }, 5000);
        });
    })();  
    // END: NEWSLETTER SUBSCRIPTION CODE

});