/**
 * PORTFOLIO — Consolidated script (no ES6 modules)
 *
 * Contents:
 *   1. Loading Screen (with particles)
 *   2. Theme Manager
 *   3. Navigation
 *   4. Scroll Animations (reveal, counters, progress bars)
 *   5. Full-Page Particle System (section-aware, different shapes per zone)
 *   6. Hero Entrance Cascade
 *   7. Device Detection
 *   8. Init
 */
(function () {
    'use strict';

    // Color palette
    var COLORS = [
        '#4f46e5', '#7c3aed', '#ec4899', '#f43f5e', '#f97316',
        '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'
    ];

    // ═══════════════════════════════════════════
    //  1. CURTAIN REVEAL LOADER
    // ═══════════════════════════════════════════
    function initLoader() {
        var loader = document.getElementById('loader');
        if (!loader) {
            requestAnimationFrame(triggerHeroEntrance);
            return;
        }

        // 1. Split Text for Wave Animation
        const title = document.getElementById('loader-title');
        if (title) {
            title.innerHTML = title.textContent.split('').map((char, i) =>
                `<span style="--i:${i}">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('');
        }

        // 2. Diverse Particles (7 Shapes, Rainbow Colors)
        const canvas = document.getElementById('loader-canvas');
        let ctx, w, h, particles = [];
        let animationId;

        if (canvas) {
            ctx = canvas.getContext('2d');

            const resize = () => {
                w = canvas.width = window.innerWidth;
                h = canvas.height = window.innerHeight;
            };
            window.addEventListener('resize', resize);
            resize();

            const SHAPES = ['circle', 'square', 'triangle', 'star', 'diamond', 'hexagon', 'cross'];
            const COLORS = [
                '#4f46e5', '#7c3aed', '#ec4899', '#f43f5e', '#f97316',
                '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'
            ];

            class Particle {
                constructor() {
                    this.reset();
                    // Start with random progress to avoid synchronized spawning
                    this.life = Math.random() * 100;
                }

                reset() {
                    this.x = Math.random() * w;
                    this.y = Math.random() * h;
                    this.size = Math.random() * 10 + 4; // 4-14px
                    this.speedX = (Math.random() - 0.5) * 1.5;
                    this.speedY = (Math.random() - 0.5) * 1.5;
                    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
                    this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
                    this.rotation = Math.random() * 360;
                    this.spinSpeed = Math.random() * 4 - 2;
                    this.life = 0; // 0 to 100
                    this.maxLife = 100 + Math.random() * 50;
                    this.opacity = 0;
                }

                update() {
                    this.x += this.speedX;
                    this.y += this.speedY;
                    this.rotation += this.spinSpeed;
                    this.life++;

                    // Fade in/out lifecycle
                    if (this.life < 20) {
                        this.opacity = this.life / 20 * 0.4; // Max opacity 0.4
                    } else if (this.life > this.maxLife - 20) {
                        this.opacity = (this.maxLife - this.life) / 20 * 0.4;
                    }

                    if (this.life >= this.maxLife) {
                        this.reset();
                    }

                    // Wrap edges
                    if (this.x < -20) this.x = w + 20;
                    if (this.x > w + 20) this.x = -20;
                    if (this.y < -20) this.y = h + 20;
                    if (this.y > h + 20) this.y = -20;
                }

                draw() {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate((this.rotation * Math.PI) / 180);
                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = 1.5;
                    ctx.globalAlpha = this.opacity;

                    ctx.beginPath();
                    if (this.shape === 'circle') {
                        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    } else if (this.shape === 'square') {
                        ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
                    } else if (this.shape === 'triangle') {
                        ctx.moveTo(0, -this.size / 2);
                        ctx.lineTo(this.size / 2, this.size / 2);
                        ctx.lineTo(-this.size / 2, this.size / 2);
                        ctx.closePath();
                    } else if (this.shape === 'star') {
                        for (let i = 0; i < 5; i++) {
                            ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * this.size / 2,
                                -Math.sin((18 + i * 72) * Math.PI / 180) * this.size / 2);
                            ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * this.size / 4,
                                -Math.sin((54 + i * 72) * Math.PI / 180) * this.size / 4);
                        }
                        ctx.closePath();
                    } else if (this.shape === 'diamond') {
                        ctx.moveTo(0, -this.size / 2);
                        ctx.lineTo(this.size / 2, 0);
                        ctx.lineTo(0, this.size / 2);
                        ctx.lineTo(-this.size / 2, 0);
                        ctx.closePath();
                    } else if (this.shape === 'hexagon') {
                        for (let i = 0; i < 6; i++) {
                            ctx.lineTo(this.size / 2 * Math.cos(i * Math.PI / 3), this.size / 2 * Math.sin(i * Math.PI / 3));
                        }
                        ctx.closePath();
                    } else if (this.shape === 'cross') {
                        ctx.moveTo(-this.size / 2, 0); ctx.lineTo(this.size / 2, 0);
                        ctx.moveTo(0, -this.size / 2); ctx.lineTo(0, this.size / 2);
                    }
                    ctx.stroke();
                    ctx.restore();
                }
            }

            // Init 30 Particles (Diverse)
            for (let i = 0; i < 30; i++) particles.push(new Particle());

            function animate() {
                ctx.clearRect(0, 0, w, h);
                particles.forEach(p => {
                    p.update();
                    p.draw();
                });
                animationId = requestAnimationFrame(animate);
            }
            animate();
        }

        // 3. Progress Arc Animation (Removed - replaced with CSS Quantum Loader)
        // The Quantum Loader uses CSS keyframes (spin3D) so no JS is needed for the fill.

        // Sequence:
        // 0s: Start (Arc filling 3.5s)
        // 3.5s: Curtain Split (0.8s transition)
        // 4.3s: Hero Entrance

        setTimeout(function () {
            // Split Curtains
            loader.classList.add('loader--open');

            // Stop particles to save resources
            setTimeout(() => {
                if (animationId) cancelAnimationFrame(animationId);
            }, 800);

            // Trigger Site Entrance
            setTimeout(function () {
                triggerHeroEntrance();
            }, 800);

        }, 3500);

        // Cleanup DOM
        setTimeout(function () {
            loader.style.display = 'none';
        }, 4500);
    }

    // ═══════════════════════════════════════════
    //  2. THEME MANAGER
    // ═══════════════════════════════════════════
    function initTheme() {
        var html = document.documentElement;
        var toggleBtn = document.getElementById('theme-toggle');
        var icon = toggleBtn ? toggleBtn.querySelector('.theme-toggle__icon') : null;

        function getCurrentTheme() {
            return html.getAttribute('data-theme') || 'light';
        }

        function updateIcon() {
            if (!icon) return;
            icon.textContent = getCurrentTheme() === 'light' ? '\uD83C\uDF19' : '\u2600\uFE0F';
        }

        function setTheme(theme) {
            html.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            updateIcon();
            var meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.setAttribute('content', theme === 'dark' ? '#0c0e1a' : '#ffffff');
        }

        updateIcon();
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function () {
                setTheme(getCurrentTheme() === 'light' ? 'dark' : 'light');
            });
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            if (!localStorage.getItem('theme')) setTheme(e.matches ? 'dark' : 'light');
        });
    }

    // ═══════════════════════════════════════════
    //  3. NAVIGATION
    // ═══════════════════════════════════════════
    function initNavigation() {
        var nav = document.getElementById('nav');
        var toggle = document.getElementById('nav-toggle');
        var links = document.getElementById('nav-links');
        var navLinks = document.querySelectorAll('.nav__link');
        var sections = document.querySelectorAll('.section[id]');
        var isOpen = false;

        function closeMenu() {
            isOpen = false;
            if (toggle) { toggle.classList.remove('active'); toggle.setAttribute('aria-expanded', 'false'); }
            if (links) links.classList.remove('open');
            document.body.style.overflow = '';
        }

        if (toggle) toggle.addEventListener('click', function () {
            isOpen = !isOpen;
            toggle.classList.toggle('active', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
            if (links) links.classList.toggle('open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        navLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                var target = document.querySelector(e.currentTarget.getAttribute('href'));
                if (target) {
                    window.scrollTo({ top: target.offsetTop - (nav ? nav.offsetHeight : 64), behavior: 'smooth' });
                }
                closeMenu();
            });
        });

        document.addEventListener('click', function (e) { if (isOpen && nav && !nav.contains(e.target)) closeMenu(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) { closeMenu(); if (toggle) toggle.focus(); } });

        function onScroll() {
            var scrollY = window.scrollY;
            if (nav) { nav.classList.toggle('nav--scrolled', scrollY > 20); }
            var navH = nav ? nav.offsetHeight : 64;
            var cur = '';
            sections.forEach(function (s) {
                var top = s.offsetTop - navH - 100;
                if (scrollY >= top && scrollY < top + s.offsetHeight) cur = s.id;
            });
            navLinks.forEach(function (l) {
                l.classList.toggle('nav__link--active', (l.getAttribute('href') || '').substring(1) === cur);
            });
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ═══════════════════════════════════════════
    //  4. SCROLL ANIMATIONS
    // ═══════════════════════════════════════════
    function initScrollAnimations() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('revealed'); });
            return;
        }

        var revObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('revealed'); revObs.unobserve(e.target); } });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        document.querySelectorAll('.reveal').forEach(function (el) { revObs.observe(el); });

        var proObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    var w = e.target.dataset.width;
                    if (w) setTimeout(function () { e.target.style.width = w; }, 300);
                    proObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('.progress__fill').forEach(function (el) { proObs.observe(el); });

        var cntObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { if (e.isIntersecting) { animateCounter(e.target); cntObs.unobserve(e.target); } });
        }, { threshold: 0.5 });
        document.querySelectorAll('[data-count]').forEach(function (el) { cntObs.observe(el); });
    }

    function animateCounter(el) {
        var target = parseInt(el.dataset.count, 10);
        var dur = 1500, start = performance.now();
        function tick(now) {
            var p = Math.min((now - start) / dur, 1);
            el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
            if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
        }
        requestAnimationFrame(tick);
    }

    // ═══════════════════════════════════════════
    //  5. FULL-PAGE PARTICLE SYSTEM
    // ═══════════════════════════════════════════
    // Section zones with different particle configurations
    var SECTION_IDS = ['hero', 'about', 'experience', 'education', 'skills', 'certifications', 'contact'];
    var PARTICLE_CONFIGS = {
        hero: { count: 30, shape: 'circle', sizeMin: 2, sizeMax: 4, speed: 0.5, glow: true },
        about: { count: 18, shape: 'diamond', sizeMin: 2, sizeMax: 3.5, speed: 0.3, glow: false },
        experience: { count: 14, shape: 'line', sizeMin: 4, sizeMax: 8, speed: 0.2, glow: false },
        education: { count: 16, shape: 'square', sizeMin: 2, sizeMax: 3, speed: 0.25, glow: false },
        skills: { count: 20, shape: 'ring', sizeMin: 2, sizeMax: 4, speed: 0.35, glow: true },
        certifications: { count: 14, shape: 'star', sizeMin: 2, sizeMax: 3.5, speed: 0.2, glow: false },
        contact: { count: 12, shape: 'circle', sizeMin: 3, sizeMax: 5, speed: 0.15, glow: true }
    };

    var PHI = 1.618033988749895;
    var pageParticles = [];
    var pageCanvas, pageCtx;

    function initFullPageParticles() {
        // Mobile Performance: Disable particles on small screens to save battery
        if (window.innerWidth < 768) return;

        pageCanvas = document.getElementById('page-particles');
        if (!pageCanvas) return;
        pageCtx = pageCanvas.getContext('2d');

        function resize() {
            pageCanvas.width = window.innerWidth;
            pageCanvas.height = document.documentElement.scrollHeight;
        }
        resize();
        window.addEventListener('resize', function () { resize(); rebuildParticles(); });

        rebuildParticles();
        requestAnimationFrame(drawPage);

        // Rebuild when page height changes (after reveals)
        var prevH = 0;
        setInterval(function () {
            var h = document.documentElement.scrollHeight;
            if (h !== prevH) { prevH = h; resize(); rebuildParticles(); }
        }, 2000);
    }

    function rebuildParticles() {
        pageParticles = [];
        SECTION_IDS.forEach(function (id) {
            var el = document.getElementById(id);
            if (!el) return;
            var cfg = PARTICLE_CONFIGS[id];
            var top = el.offsetTop;
            var height = el.offsetHeight;

            for (var i = 0; i < cfg.count; i++) {
                var seed = (pageParticles.length + 1) * PHI;
                pageParticles.push({
                    x: Math.random() * pageCanvas.width,
                    y: top + Math.random() * height,
                    zoneTop: top,
                    zoneHeight: height,
                    size: cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin),
                    shape: cfg.shape,
                    glow: cfg.glow,
                    // Multi-frequency non-repeating movement
                    pxA: seed * 1.3,
                    pxB: seed * 0.7,
                    fxA: 0.0003 + (seed % 0.0004),
                    fxB: 0.00017 + (seed % 0.0003),
                    axA: 0.2 + Math.random() * cfg.speed,
                    axB: 0.1 + Math.random() * cfg.speed * 0.5,
                    pyA: seed * 0.9,
                    pyB: seed * 1.1,
                    fyA: 0.00023 + (seed % 0.00035),
                    fyB: 0.00011 + (seed % 0.0002),
                    ayA: 0.15 + Math.random() * cfg.speed * 0.8,
                    ayB: 0.08 + Math.random() * cfg.speed * 0.4,
                    // Color
                    colorIdx: Math.random() * COLORS.length,
                    colorSpeed: 0.012 + Math.random() * 0.015,
                    alpha: 0.2 + Math.random() * 0.35,
                    // For line rotation
                    angle: Math.random() * Math.PI * 2,
                    angleSpeed: (Math.random() - 0.5) * 0.002
                });
            }
        });
    }

    function drawPage(time) {
        pageCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);

        // Only draw particles near viewport for performance
        var scrollY = window.scrollY;
        var viewTop = scrollY - 200;
        var viewBot = scrollY + window.innerHeight + 200;

        pageParticles.forEach(function (p) {
            // Movement
            var dx = p.axA * Math.sin(time * p.fxA + p.pxA) + p.axB * Math.sin(time * p.fxB + p.pxB * 2.3);
            var dy = p.ayA * Math.sin(time * p.fyA + p.pyA) + p.ayB * Math.cos(time * p.fyB + p.pyB * 1.7);
            p.x += dx;
            p.y += dy;
            p.angle += p.angleSpeed;

            // Keep within zone horizontally
            if (p.x < -20) p.x = pageCanvas.width + 20;
            if (p.x > pageCanvas.width + 20) p.x = -20;
            // Keep within zone vertically
            if (p.y < p.zoneTop - 20) p.y = p.zoneTop + p.zoneHeight + 20;
            if (p.y > p.zoneTop + p.zoneHeight + 20) p.y = p.zoneTop - 20;

            // Skip if not visible
            if (p.y < viewTop || p.y > viewBot) return;

            // Color cycle
            p.colorIdx = (p.colorIdx + p.colorSpeed) % COLORS.length;
            var c = interpolateColor(p.colorIdx);
            var rgba = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',';

            // Draw glow
            if (p.glow) {
                pageCtx.beginPath();
                pageCtx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
                pageCtx.fillStyle = rgba + (p.alpha * 0.12) + ')';
                pageCtx.fill();
            }

            pageCtx.fillStyle = rgba + p.alpha + ')';
            pageCtx.strokeStyle = rgba + p.alpha + ')';
            pageCtx.lineWidth = 1.2;

            switch (p.shape) {
                case 'circle':
                    pageCtx.beginPath();
                    pageCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    pageCtx.fill();
                    break;

                case 'diamond':
                    pageCtx.save();
                    pageCtx.translate(p.x, p.y);
                    pageCtx.rotate(p.angle);
                    pageCtx.beginPath();
                    pageCtx.moveTo(0, -p.size);
                    pageCtx.lineTo(p.size * 0.7, 0);
                    pageCtx.lineTo(0, p.size);
                    pageCtx.lineTo(-p.size * 0.7, 0);
                    pageCtx.closePath();
                    pageCtx.fill();
                    pageCtx.restore();
                    break;

                case 'line':
                    pageCtx.save();
                    pageCtx.translate(p.x, p.y);
                    pageCtx.rotate(p.angle);
                    pageCtx.beginPath();
                    pageCtx.moveTo(-p.size, 0);
                    pageCtx.lineTo(p.size, 0);
                    pageCtx.stroke();
                    pageCtx.restore();
                    break;

                case 'square':
                    pageCtx.save();
                    pageCtx.translate(p.x, p.y);
                    pageCtx.rotate(p.angle);
                    var hs = p.size * 0.8;
                    pageCtx.fillRect(-hs, -hs, hs * 2, hs * 2);
                    pageCtx.restore();
                    break;

                case 'ring':
                    pageCtx.beginPath();
                    pageCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    pageCtx.stroke();
                    break;

                case 'star':
                    drawStar(pageCtx, p.x, p.y, 5, p.size, p.size * 0.5, p.angle);
                    pageCtx.fill();
                    break;
            }
        });

        requestAnimationFrame(drawPage);
    }

    function drawStar(ctx, x, y, points, outerR, innerR, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.beginPath();
        for (var i = 0; i < points * 2; i++) {
            var r = i % 2 === 0 ? outerR : innerR;
            var a = (i * Math.PI) / points - Math.PI / 2;
            if (i === 0) ctx.moveTo(r * Math.cos(a), r * Math.sin(a));
            else ctx.lineTo(r * Math.cos(a), r * Math.sin(a));
        }
        ctx.closePath();
        ctx.restore();
    }

    // ═══════════════════════════════════════════
    //  SHARED: Color interpolation
    // ═══════════════════════════════════════════
    function hexToRGB(hex) {
        return { r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) };
    }

    function interpolateColor(idx) {
        var i = Math.floor(idx) % COLORS.length;
        var j = (i + 1) % COLORS.length;
        var t = idx % 1;
        var a = hexToRGB(COLORS[i]), b = hexToRGB(COLORS[j]);
        return { r: Math.round(a.r + (b.r - a.r) * t), g: Math.round(a.g + (b.g - a.g) * t), b: Math.round(a.b + (b.b - a.b) * t) };
    }

    // ═══════════════════════════════════════════
    //  6. HERO ENTRANCE CASCADE
    // ═══════════════════════════════════════════
    function triggerHeroEntrance() {
        ['.hero__label', '.hero__title', '.hero__subtitle', '.hero__actions', '.hero__stats'].forEach(function (sel) {
            var el = document.querySelector(sel);
            if (el) el.classList.add('animate-in');
        });

        var card = document.querySelector('.hero__profile-card');
        if (card) {
            setTimeout(function () {
                card.classList.add('animate-in');
            }, 400);
        }
    }

    // ═══════════════════════════════════════════
    //  7. DEVICE DETECTION
    // ═══════════════════════════════════════════
    function detectCapabilities() {
        var h = document.documentElement;
        h.classList.add(('ontouchstart' in window || navigator.maxTouchPoints > 0) ? 'touch-device' : 'pointer-device');
        h.classList.add(window.matchMedia('(pointer: coarse)').matches ? 'coarse-pointer' : 'fine-pointer');
        if (window.devicePixelRatio > 1.5) h.classList.add('high-dpi');
    }

    // ═══════════════════════════════════════════
    //  8. WORD HOVER (wrap words in spans)
    // ═══════════════════════════════════════════
    function initWordHover() {
        // Selectors for content text elements
        var selectors = [
            '.about__text p',
            '.about__highlight-text',
            '.about__highlight-title',
            '.timeline__desc li',
            '.timeline__company',
            '.card__text',
            '.card__title',
            '.contact__cta-text',
            '.contact__item-value',
            '.hero__subtitle',
            '.section__subtitle',
            '.cert__issuer',
            '.skills__category-title',
            '.footer__text',
            '.about__para'
        ];

        document.querySelectorAll(selectors.join(',')).forEach(function (el) {
            wrapWords(el);
        });
    }

    function wrapWords(element) {
        var children = Array.prototype.slice.call(element.childNodes);
        children.forEach(function (node) {
            if (node.nodeType === 3) { // Text node
                var text = node.textContent;
                if (!text.trim()) return;
                var fragment = document.createDocumentFragment();
                var words = text.split(/(\s+)/);
                words.forEach(function (word) {
                    if (/^\s+$/.test(word)) {
                        fragment.appendChild(document.createTextNode(word));
                    } else if (word.length > 0) {
                        var span = document.createElement('span');
                        span.className = 'word-hover';
                        span.textContent = word;
                        fragment.appendChild(span);
                    }
                });
                node.parentNode.replaceChild(fragment, node);
            }
            // Skip element nodes (like <strong>, <a>, <span>) — don't recurse into them
        });
    }

    // ═══════════════════════════════════════════
    //  9. INIT
    // ═══════════════════════════════════════════
    function boot() {
        // Force scroll to top on load
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);

        initLoader();
        initTheme();
        initNavigation();
        initScrollAnimations();
        initWordHover();
        // Full-page particles initialize slightly delayed to allow DOM measurement
        setTimeout(initFullPageParticles, 100);
        detectCapabilities();
        console.log('%c★ Portfolio loaded', 'color: #4f46e5; font-weight: bold; font-size: 14px;');
    }

    // Ensure scroll reset on refresh
    window.addEventListener('beforeunload', function () {
        window.scrollTo(0, 0);
    });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();
