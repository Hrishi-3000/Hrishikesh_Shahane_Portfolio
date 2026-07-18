document.addEventListener('DOMContentLoaded', function () {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (window.emailjs) {
        emailjs.init('wbHUoeMg_HIiM4tLQ'); // EmailJS public key
    }

    /* ---------------------------------------------------------
       Theme toggle (day chart / night chart) — safe localStorage
       --------------------------------------------------------- */
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    function getStoredTheme() {
        try { return localStorage.getItem('theme'); } catch (e) { return null; }
    }
    function storeTheme(value) {
        try { localStorage.setItem('theme', value); } catch (e) { /* storage unavailable */ }
    }

    const savedTheme = getStoredTheme() ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    body.setAttribute('data-theme', savedTheme);

    themeToggle?.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        storeTheme(newTheme);

        if (window.gsap && !prefersReducedMotion) {
            gsap.fromTo(themeToggle, { rotation: 0 }, { rotation: 360, duration: 0.5 });
        }
    });

    /* ---------------------------------------------------------
       Mobile navigation toggle
       --------------------------------------------------------- */
    const navToggle = document.getElementById('nav-toggle');
    const siteNav = document.getElementById('site-nav');

    navToggle?.addEventListener('click', () => {
        const isOpen = siteNav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.innerHTML = isOpen
            ? '<i class="fas fa-times" aria-hidden="true"></i>'
            : '<i class="fas fa-bars" aria-hidden="true"></i>';
    });

    /* ---------------------------------------------------------
       Carousel section navigation
       --------------------------------------------------------- */
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.carousel-section');

    function goToSection(targetSection, direction) {
        const currentActive = document.querySelector('.carousel-section.active');
        if (!currentActive || currentActive === targetSection) return;

        const currentLink = document.querySelector('.nav-link.active');
        const targetLink = document.querySelector(`.nav-link[data-target="${targetSection.id}"]`);

        currentLink?.classList.remove('active');
        targetLink?.classList.add('active');

        if (window.gsap && !prefersReducedMotion) {
            gsap.to(currentActive, {
                x: direction === 'right' ? '-6%' : '6%',
                opacity: 0,
                duration: 0.45,
                ease: 'power2.inOut',
                onComplete: () => currentActive.classList.remove('active')
            });

            gsap.fromTo(targetSection,
                { x: direction === 'right' ? '6%' : '-6%', opacity: 0 },
                { x: '0%', opacity: 1, duration: 0.45, ease: 'power2.inOut' }
            );
        } else {
            currentActive.classList.remove('active');
        }

        targetSection.classList.add('active');
        targetSection.setAttribute('tabindex', '-1');
        targetSection.focus({ preventScroll: true });
        revealVisible();
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = document.getElementById(this.getAttribute('data-target'));
            const currentActive = document.querySelector('.carousel-section.active');
            const currentIndex = Array.from(sections).indexOf(currentActive);
            const targetIndex = Array.from(sections).indexOf(targetSection);
            goToSection(targetSection, targetIndex > currentIndex ? 'right' : 'left');

            if (siteNav?.classList.contains('open')) {
                siteNav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
            }
        });
    });

    // Keyboard: left / right arrow keys move between sections
    document.addEventListener('keydown', (e) => {
        if (e.target.matches('input, textarea')) return;
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;

        const currentActive = document.querySelector('.carousel-section.active');
        const currentIndex = Array.from(sections).indexOf(currentActive);
        let targetIndex = e.key === 'ArrowRight' ? currentIndex + 1 : currentIndex - 1;
        if (targetIndex < 0 || targetIndex >= sections.length) return;

        goToSection(sections[targetIndex], e.key === 'ArrowRight' ? 'right' : 'left');
    });

    /* ---------------------------------------------------------
       Scroll / entrance reveal via IntersectionObserver
       --------------------------------------------------------- */
    const revealTargets = document.querySelectorAll(
        '.timeline-item, .skill-category, .project-card, .achievement-card, .contact-item, .blog-card'
    );

    const revealObserver = 'IntersectionObserver' in window
        ? new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 })
        : null;

    function revealVisible() {
        if (revealObserver) {
            revealTargets.forEach(el => {
                if (!el.classList.contains('is-visible')) revealObserver.observe(el);
            });
        } else {
            // Fallback: reveal everything immediately
            revealTargets.forEach(el => el.classList.add('is-visible'));
        }
    }
    revealVisible();

    /* ---------------------------------------------------------
       Project filters
       --------------------------------------------------------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            projectCards.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('is-hidden', !match);
                if (match) card.classList.add('is-visible');
            });
        });
    });

    /* ---------------------------------------------------------
       Contact form (EmailJS)
       --------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');

    contactForm?.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!window.emailjs) {
            alert('Messaging service is unavailable right now. Please email me directly at Hrishishahane3000@gmail.com');
            return;
        }

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
        submitBtn.disabled = true;

        emailjs.sendForm('service_kjuru3p', 'template_3nzb54e', form)
            .then(function () {
                submitBtn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Sent!';
                submitBtn.style.backgroundColor = '#1F6F5C';
                form.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                }, 2200);
            }, function (error) {
                console.error('EmailJS Error:', error);
                submitBtn.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i> Error';
                submitBtn.style.backgroundColor = '#B0431F';
                alert('Failed to send message. Please try again later or email me directly at Hrishishahane3000@gmail.com');

                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                }, 2200);
            });
    });

    /* ---------------------------------------------------------
       Project card tilt (disabled under reduced motion / touch)
       --------------------------------------------------------- */
    if (!prefersReducedMotion && window.gsap && window.matchMedia('(hover: hover)').matches) {
        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const angleX = (y - rect.height / 2) / 24;
                const angleY = (rect.width / 2 - x) / 24;

                gsap.to(card, {
                    rotationX: angleX,
                    rotationY: angleY,
                    transformPerspective: 1000,
                    ease: 'power1.out',
                    duration: 0.5
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, { rotationX: 0, rotationY: 0, ease: 'power1.out', duration: 0.5 });
            });
        });
    }

    /* ---------------------------------------------------------
       Back to top
       --------------------------------------------------------- */
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    backToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
                    ticking = false;
                });
                ticking = true;
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }

    document.querySelector('.carousel-section')?.classList.add('active');
});
