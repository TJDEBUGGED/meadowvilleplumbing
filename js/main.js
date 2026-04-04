document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Preloader Removal
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 2500); // 2.5s for the drip animation to play out

    // 3. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // 4. Cursor Trail (Desktop only usually)
    const cursorTrail = document.getElementById('cursorTrail');
    const trailDrop = cursorTrail ? cursorTrail.querySelector('.trail-drop') : null;
    let isDesktop = window.innerWidth > 992;
    
    if (isDesktop && cursorTrail && trailDrop) {
        document.addEventListener('mousemove', (e) => {
            // Simple subtle trail
            trailDrop.style.opacity = '1';
            trailDrop.style.transform = `translate(${e.clientX - 5}px, ${e.clientY + 15}px) rotate(45deg)`;
            
            clearTimeout(window.trailTimeout);
            window.trailTimeout = setTimeout(() => {
                trailDrop.style.opacity = '0';
            }, 300);
        });
    }

    // 5. Scroll Progress Indicator
    const scrollProgressBar = document.querySelector('.scroll-progress-bar');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if(scrollProgressBar) scrollProgressBar.style.width = scrolled + '%';
    });

    // 6. GSAP Animations Registration
    gsap.registerPlugin(ScrollTrigger);

    // Hero Header Animations
    gsap.from('.hero-text-block h1', {
        duration: 1,
        y: 50,
        opacity: 0,
        delay: 2.6, // after loader
        ease: 'power3.out'
    });
    gsap.from('.hero-text-block h2', {
        duration: 1,
        y: 30,
        opacity: 0,
        delay: 2.9,
        ease: 'power3.out'
    });
    gsap.from('.hero-text-block .tagline, .hero-cta-group', {
        duration: 1,
        y: 20,
        opacity: 0,
        delay: 3.2,
        ease: 'power3.out',
        stagger: 0.2
    });

    // General scroll reveals
    gsap.utils.toArray('.scroll-reveal').forEach(elem => {
        gsap.to(elem, {
            scrollTrigger: {
                trigger: elem,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // Staggered lists (Qualifications, Cards, Why Us)
    const initStagger = (selector, triggerSelector = selector) => {
        const elements = document.querySelectorAll(selector);
        if(elements.length > 0) {
            gsap.to(elements, {
                scrollTrigger: {
                    trigger: triggerSelector === selector ? elements[0].parentNode : triggerSelector,
                    start: 'top 80%',
                },
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: 'back.out(1.7)'
            });
        }
    };

    initStagger('.qual-badge');
    initStagger('.reveal-card');
    initStagger('.stagger-why');

    // Experience Cards highlight effect map
    gsap.utils.toArray('.highlight-hover').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: '.experience-carousel',
                start: 'top 80%'
            },
            y: 50,
            opacity: 0,
            duration: 0.5,
            delay: i * 0.1
        });
    });

    // Service Area map pins animation
    gsap.utils.toArray('.city-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: '.map-grid',
                start: 'top 75%'
            },
            x: -30,
            opacity: 0,
            duration: 0.4,
            delay: i * 0.1
        });
    });

    // Work Van driving across section
    const van = document.getElementById('work-van');
    if(van) {
        gsap.to(van, {
            scrollTrigger: {
                trigger: '#service-area',
                start: 'top 60%',
                end: 'bottom center',
                scrub: 1
            },
            x: window.innerWidth + 200,
            ease: 'none'
        });
    }

    // 7. Plumber Character & Side Pipe (Desktop only)
    if(isDesktop && document.querySelector('.side-plumber-container')) {
        const traveler = document.getElementById('plumber-traveler');
        const plumber = document.getElementById('main-plumber');
        const pipeFill = document.querySelector('.vertical-pipe-fill');
        const wrench = document.getElementById('plumber-wrench');
        const clipboard = document.getElementById('plumber-clipboard');

        // Initial drop-in for hero
        gsap.from(plumber, {
            y: -350, // drop down from offscreen
            duration: 1.5,
            delay: 3,
            ease: 'bounce.out'
        });

        // Vertical pipe fill logic
        gsap.to(pipeFill, {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.5
            }
        });

        // Plumber follows scroll via scrubbing along the track
        gsap.to(traveler, {
            y: () => {
                const track = document.querySelector('.vertical-pipe-track');
                return track ? track.offsetHeight - traveler.offsetHeight : document.documentElement.scrollHeight - 1000;
            },
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1, // smooth scrubbing
                invalidateOnRefresh: true
            }
        });

        // Plumber state changes based on section
        
        // About Section: Pulls out clipboard
        ScrollTrigger.create({
            trigger: '#about',
            start: 'top center',
            onEnter: () => {
                if(wrench) wrench.classList.add('hidden');
                if(clipboard) clipboard.classList.remove('hidden');
                // Subtle flip/turn animation
                gsap.to(plumber, { scaleX: -1, duration: 0.3 }); 
            },
            onLeaveBack: () => {
                if(clipboard) clipboard.classList.add('hidden');
                if(wrench) wrench.classList.remove('hidden');
                gsap.to(plumber, { scaleX: 1, duration: 0.3 });
            }
        });

        // Services Section: Wrench tightens
        ScrollTrigger.create({
            trigger: '#services',
            start: 'top center',
            onEnter: () => {
                if(clipboard) clipboard.classList.add('hidden');
                if(wrench) wrench.classList.remove('hidden');
                gsap.to(plumber, { scaleX: 1, duration: 0.3 });
                // Twisting wrench animation
                if(wrench) gsap.to(wrench, { rotation: 45, yoyo: true, repeat: 5, duration: 0.2 });
            }
        });

        // Experience Section: Thumbs up / Wipe brow (simulated with bounce)
        ScrollTrigger.create({
            trigger: '#experience',
            start: 'top center',
            onEnter: () => {
                gsap.to(plumber, { y: "+=10", yoyo: true, repeat: 3, duration: 0.2 });
            }
        });

        // Contact Section: Wave goodbye
        ScrollTrigger.create({
            trigger: '#contact',
            start: 'top bottom-=200',
            onEnter: () => {
                gsap.to(plumber, { rotation: -10, yoyo: true, repeat: 3, duration: 0.3, transformOrigin: 'bottom center' });
            }
        });
    }

    // 8. Dynamic Connective Pipes in Services SVG
    const svgOverlay = document.querySelector('.services-connective-pipes');
    if (isDesktop && svgOverlay) {
        // Just for visual effect in desktop, we draw a few lines
        svgOverlay.innerHTML = `
            <path d="M 100 0 L 100 500" stroke="#00BFFF" stroke-width="4" fill="none" class="draw-pipe" opacity="0.3" />
            <path d="M 500 100 L 500 800" stroke="#00BFFF" stroke-width="4" fill="none" class="draw-pipe" opacity="0.3" />
            <path d="M 900 200 L 900 600" stroke="#00BFFF" stroke-width="4" fill="none" class="draw-pipe" opacity="0.3" />
        `;
        
        gsap.utils.toArray('.draw-pipe').forEach(pipe => {
            const length = pipe.getTotalLength();
            gsap.set(pipe, { strokeDasharray: length, strokeDashoffset: length });
            gsap.to(pipe, {
                strokeDashoffset: 0,
                opacity: 0.8,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#services',
                    start: 'top 60%',
                    end: 'bottom 40%',
                    scrub: true
                }
            });
        });
    }
});
