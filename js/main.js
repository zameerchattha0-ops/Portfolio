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

        // 1. Split Title for Stagger Animation + RGB Cycling
        var title = document.getElementById('loader-title');
        if (title) {
            title.innerHTML = title.textContent.split('').map(function (char, i) {
                return '<span style="--i:' + i + '">' + (char === ' ' ? '&nbsp;' : char) + '</span>';
            }).join('');

            // 15 flat solid colors — no gradients
            var rgbColors = [
                '#ff0000', '#ff6600', '#ffcc00', '#ccff00',
                '#33ff00', '#00ff66', '#00ffcc', '#00ccff',
                '#0066ff', '#0000ff', '#6600ff', '#cc00ff',
                '#ff00cc', '#ff0066', '#ff0033'
            ];
            var spans = title.querySelectorAll('span');
            var colorTick = 0;
            setInterval(function () {
                spans.forEach(function (span, idx) {
                    span.style.color = rgbColors[(colorTick + idx) % rgbColors.length];
                });
                colorTick++;
            }, 200);
        }

        // 2. Typewriter for Role Text
        var roleTarget = document.getElementById('loader-role-text');
        var roleString = 'Accounts Officer \u00B7 CA Aspirant \u00B7 AI-Driven Finance';
        if (roleTarget) {
            var charIdx = 0;
            setTimeout(function () {
                var typeInterval = setInterval(function () {
                    if (charIdx < roleString.length) {
                        roleTarget.textContent += roleString[charIdx];
                        charIdx++;
                    } else {
                        clearInterval(typeInterval);
                    }
                }, 40);
            }, 600); // Start after title reveals
        }

        // 3. Animated Progress Bar (eased — slow start, accelerating)
        var progressFill = document.getElementById('loader-progress-fill');
        var progressPct = document.getElementById('loader-progress-pct');
        if (progressFill && progressPct) {
            var progress = 0;
            var progressStart = Date.now();
            var totalDuration = 2500; // 2.5 seconds to fill

            function updateProgress() {
                var elapsed = Date.now() - progressStart;
                var t = Math.min(elapsed / totalDuration, 1);
                // Ease-in-out curve for organic feel
                progress = Math.round(t < 0.5 ? 4 * t * t * t * 100 : (1 - Math.pow(-2 * t + 2, 3) / 2) * 100);
                progressFill.style.width = progress + '%';
                progressPct.textContent = progress + '%';
                if (t < 1) {
                    requestAnimationFrame(updateProgress);
                }
            }
            setTimeout(function () {
                requestAnimationFrame(updateProgress);
            }, 800);
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

        // Choreography Timeline:
        // 0.0s  — Accent lines expand, monogram fades in
        // 0.6s  — Title letters reveal (staggered 50ms each)
        // 1.2s  — Typewriter starts typing role
        // 1.5s  — Progress bar begins filling (3.2s duration)
        // ~4.7s — Progress hits 100%
        // 5.0s  — Curtains split, hero entrance

        setTimeout(function () {
            // Split Curtains
            loader.classList.add('loader--open');

            // Stop particles to save resources
            setTimeout(function () {
                if (animationId) cancelAnimationFrame(animationId);
            }, 800);

            // Trigger Site Entrance
            setTimeout(function () {
                triggerHeroEntrance();
            }, 800);

        }, 3800);

        // Cleanup DOM
        setTimeout(function () {
            loader.style.display = 'none';
        }, 4800);
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
                var href = link.getAttribute('href');
                // Only intercept internal anchors
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    var target = document.querySelector(href);
                    if (target) {
                        window.scrollTo({ top: target.offsetTop - (nav ? nav.offsetHeight : 64), behavior: 'smooth' });
                    }
                    closeMenu();
                }
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
        // Throttled Scroll Listener (100ms is sufficient for nav updates)
        window.addEventListener('scroll', throttle(onScroll, 100), { passive: true });
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
        // Mobile Performance: Particles enabled on all devices as requested
        // if (window.innerWidth < 768) return;

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
    // ═══════════════════════════════════════════
    //  6. HERO ENTRANCE CASCADE -> MOVED TO BOOT
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
    //  UNIQUE: PROFILE CARD PARTICLES (Micro-Symbols)
    // ═══════════════════════════════════════════
    function initProfileParticles() {
        var canvas = document.getElementById('profile-particles');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var particles = [];

        var SYMBOLS = ['+', '×', '★', '⚡', '◆', '●'];
        var COLORS = ['#fbbf24', '#818cf8', '#f43f5e', '#2dd4bf'];

        function resize() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class SymbolParticle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height; // Start anywhere
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + 20;
                this.size = 8 + Math.random() * 12;
                this.symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
                this.speedY = 0.5 + Math.random() * 0.8;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.rotation = Math.random() * 360;
                this.rotSpeed = (Math.random() - 0.5) * 2;
                this.opacity = 0;
                this.fadeState = 'in'; // in, hold, out
            }
            update() {
                this.y -= this.speedY;
                this.x += this.speedX;
                this.rotation += this.rotSpeed;

                // Opacity Lifecycle
                if (this.fadeState === 'in') {
                    this.opacity += 0.02;
                    if (this.opacity >= 0.6) this.fadeState = 'hold';
                } else if (this.fadeState === 'hold') {
                    if (this.y < 100) this.fadeState = 'out';
                } else {
                    this.opacity -= 0.02;
                    if (this.opacity <= 0) this.reset();
                }
                // Edges
                if (this.y < -30 || this.x < -30 || this.x > canvas.width + 30) this.reset();
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation * Math.PI / 180);
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.font = 'bold ' + this.size + 'px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.symbol, 0, 0);
                ctx.restore();
            }
        }

        for (var i = 0; i < 25; i++) particles.push(new SymbolParticle());

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(function (p) {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
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
        var RGB_COLORS = [
            '#ff0000', '#ff6600', '#ffcc00', '#ccff00',
            '#33ff00', '#00ff66', '#00ffcc', '#00ccff',
            '#0066ff', '#0000ff', '#6600ff', '#cc00ff',
            '#ff00cc', '#ff0066', '#ff0033'
        ];

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

                        // Per-letter RGB cycling on hover
                        var colorInterval = null;
                        span.addEventListener('mouseenter', function () {
                            var letters = word.split('');
                            span.innerHTML = letters.map(function (ch, i) {
                                return '<span class="word-hover__letter" style="transition:color 0.3s ease">' + ch + '</span>';
                            }).join('');
                            var letterSpans = span.querySelectorAll('.word-hover__letter');
                            var tick = 0;
                            colorInterval = setInterval(function () {
                                letterSpans.forEach(function (ls, idx) {
                                    ls.style.color = RGB_COLORS[(tick + idx) % RGB_COLORS.length];
                                });
                                tick++;
                            }, 150);
                        });

                        span.addEventListener('mouseleave', function () {
                            if (colorInterval) {
                                clearInterval(colorInterval);
                                colorInterval = null;
                            }
                            span.textContent = word;
                            span.style.color = '';
                        });

                        fragment.appendChild(span);
                    }
                });
                node.parentNode.replaceChild(fragment, node);
            }
            // Skip element nodes (like <strong>, <a>, <span>) — don't recurse into them
        });
    }

    // ═══════════════════════════════════════════
    //  9. SKILLS RADAR CHART
    // ═══════════════════════════════════════════
    function initRadarChart() {
        var container = document.getElementById('radar-chart');
        if (!container) return;

        var skills = [
            { label: 'Accounting', value: 95 },
            { label: 'AI / Tech', value: 80 },
            { label: 'Excel', value: 90 },
            { label: 'Tax Law', value: 85 },
            { label: 'ERP Systems', value: 88 },
            { label: 'Communication', value: 78 }
        ];

        var cx = 160, cy = 160, maxR = 120;
        var n = skills.length;
        var angleStep = (2 * Math.PI) / n;

        // Build SVG
        var svg = '<svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">';

        // Grid Rings (3 levels)
        [0.33, 0.66, 1].forEach(function (scale) {
            var points = [];
            for (var i = 0; i < n; i++) {
                var angle = i * angleStep - Math.PI / 2;
                points.push((cx + maxR * scale * Math.cos(angle)).toFixed(1) + ',' + (cy + maxR * scale * Math.sin(angle)).toFixed(1));
            }
            svg += '<polygon class="radar-grid" points="' + points.join(' ') + '"/>';
        });

        // Axes + Labels
        for (var i = 0; i < n; i++) {
            var angle = i * angleStep - Math.PI / 2;
            var x2 = cx + maxR * Math.cos(angle);
            var y2 = cy + maxR * Math.sin(angle);
            svg += '<line class="radar-axis" x1="' + cx + '" y1="' + cy + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"/>';

            // Label (pushed a bit further out)
            var lx = cx + (maxR + 20) * Math.cos(angle);
            var ly = cy + (maxR + 20) * Math.sin(angle);
            svg += '<text class="radar-label" x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '">' + skills[i].label + '</text>';
        }

        // Data Polygon (starts at center, animates outward via JS)
        var zeroPoints = [];
        var targetPoints = [];
        for (var i = 0; i < n; i++) {
            var angle = i * angleStep - Math.PI / 2;
            zeroPoints.push(cx + ',' + cy);
            var r = maxR * (skills[i].value / 100);
            targetPoints.push((cx + r * Math.cos(angle)).toFixed(1) + ',' + (cy + r * Math.sin(angle)).toFixed(1));
        }

        svg += '<polygon class="radar-polygon" id="radar-polygon" points="' + zeroPoints.join(' ') + '"/>';

        // Dots
        for (var i = 0; i < n; i++) {
            svg += '<circle class="radar-dot" id="radar-dot-' + i + '" cx="' + cx + '" cy="' + cy + '" r="4"/>';
        }

        svg += '</svg>';
        container.innerHTML = svg;

        // Animate on Scroll
        var polygon = document.getElementById('radar-polygon');
        var radarObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    polygon.setAttribute('points', targetPoints.join(' '));
                    for (var j = 0; j < n; j++) {
                        var parts = targetPoints[j].split(',');
                        var dot = document.getElementById('radar-dot-' + j);
                        if (dot) {
                            dot.setAttribute('cx', parts[0]);
                            dot.setAttribute('cy', parts[1]);
                        }
                    }
                    radarObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.3 });
        radarObs.observe(container);
    }

    // ═══════════════════════════════════════════
    //  10. TESTIMONIALS CAROUSEL
    // ═══════════════════════════════════════════
    function initTestimonials() {
        var track = document.getElementById('testimonials-track');
        var dotsContainer = document.getElementById('testimonials-dots');
        if (!track || !dotsContainer) return;

        var cards = track.querySelectorAll('.testimonial-card');
        var dots = dotsContainer.querySelectorAll('.testimonials__dot');
        var current = 0;
        var interval;

        function goTo(index) {
            cards.forEach(function (c) { c.classList.remove('active'); });
            dots.forEach(function (d) { d.classList.remove('active'); });
            current = index;
            cards[current].classList.add('active');
            dots[current].classList.add('active');
        }

        function next() {
            goTo((current + 1) % cards.length);
        }

        function startAutoRotate() {
            interval = setInterval(next, 5000);
        }

        // Dot Clicks
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                clearInterval(interval);
                goTo(parseInt(dot.dataset.slide, 10));
                startAutoRotate();
            });
        });

        // Pause on hover
        track.addEventListener('mouseenter', function () { clearInterval(interval); });
        track.addEventListener('mouseleave', function () { startAutoRotate(); });

        startAutoRotate();
    }

    // ═══════════════════════════════════════════
    //  SHARED: Utilities
    // ═══════════════════════════════════════════
    function throttle(func, limit) {
        var inThrottle;
        return function () {
            var args = arguments;
            var context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function () { return inThrottle = false; }, limit);
            }
        }
    }

    // ═══════════════════════════════════════════
    //  11. SITEWIDE RGB COLOR CYCLE
    // ═══════════════════════════════════════════
    function initColorCycle() {
        var COLORS = [
            '#ff0000', '#ff6600', '#ffcc00', '#ccff00',
            '#33ff00', '#00ff66', '#00ffcc', '#00ccff',
            '#0066ff', '#0000ff', '#6600ff', '#cc00ff',
            '#ff00cc', '#ff0066', '#ff0033'
        ];

        // Global list of spans to cycle
        var cyclingSpans = [];

        // Correctly expose function to global scope
        window.enableRgbCycling = function (el) {
            var text = el.textContent;
            var words = text.split(' ');

            el.innerHTML = words.map(function (word) {
                if (!word) return ' ';
                var letters = word.split('').map(function (ch) {
                    return '<span class="rgb-letter" style="display:inline-block;transition:color 0.4s ease">' + ch + '</span>';
                }).join('');
                return '<span style="display:inline-block; white-space:nowrap">' + letters + '</span>';
            }).join(' ');

            var letters = el.querySelectorAll('.rgb-letter');
            letters.forEach(function (ls) { cyclingSpans.push(ls); });
        };

        // Static Text Targets (exclude stats, they are added dynamically after counting)
        var textTargets = document.querySelectorAll(
            '.gradient-text, .section__title, .nav__brand span'
        );
        textTargets.forEach(function (el) {
            window.enableRgbCycling(el);
        });

        // Background Elements
        var bgTargets = document.querySelectorAll('.footer__divider');

        // Animation Loop (Continuous)
        var tick = 0;
        setInterval(function () {
            // Cycle text spans
            if (cyclingSpans.length) {
                cyclingSpans.forEach(function (span, idx) {
                    span.style.color = COLORS[(tick + idx) % COLORS.length];
                });
            }
            // Cycle backgrounds
            bgTargets.forEach(function (el, idx) {
                el.style.background = COLORS[(tick + idx) % COLORS.length];
            });
            tick++;
        }, 200);
    }

    // ═══════════════════════════════════════════
    //  12. SCROLL-TRIGGERED COUNTER ANIMATIONS
    // ═══════════════════════════════════════════
    function initScrollCounters() {
        var counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                if (el.dataset.counted) return;
                el.dataset.counted = '1';

                var target = parseInt(el.dataset.count, 10);
                // Handle "+" suffix if present in data-count or text
                var suffix = el.textContent.replace(/[0-9]/g, '');

                var duration = 2000;
                var startTime = null;

                function step(ts) {
                    if (!startTime) startTime = ts;
                    var progress = Math.min((ts - startTime) / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3); // Ease-out cubic

                    var currentVal = Math.round(eased * target);
                    el.textContent = currentVal + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else if (window.enableRgbCycling) {
                        // Animation Complete: Enable RGB Cycle
                        window.enableRgbCycling(el);
                    }
                }
                requestAnimationFrame(step);
                observer.unobserve(el);
            });
        }, { threshold: 0.5 });

        counters.forEach(function (c) { observer.observe(c); });
    }

    // ═══════════════════════════════════════════
    //  13. READING PROGRESS BAR
    // ═══════════════════════════════════════════
    function initReadingProgress() {
        // Create progress bar element
        var bar = document.createElement('div');
        bar.id = 'reading-progress';
        bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;width:0%;z-index:10000;transition:width 0.1s linear,background 0.4s ease;pointer-events:none;box-shadow:0 0 8px rgba(79,70,229,0.4);';
        document.body.appendChild(bar);

        var COLORS = [
            '#ff0000', '#ff6600', '#ffcc00', '#ccff00',
            '#33ff00', '#00ff66', '#00ffcc', '#00ccff',
            '#0066ff', '#0000ff', '#6600ff', '#cc00ff',
            '#ff00cc', '#ff0066', '#ff0033'
        ];
        var colorIdx = 0;

        // Color cycle the bar
        setInterval(function () {
            bar.style.background = COLORS[colorIdx % COLORS.length];
            colorIdx++;
        }, 200);

        // Update width on scroll
        window.addEventListener('scroll', throttle(function () {
            var scrollTop = window.scrollY || document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            bar.style.width = pct + '%';
        }, 16), { passive: true }); // ~60fps cap
    }

    // ═══════════════════════════════════════════
    //  14. PAGE TRANSITION ANIMATIONS
    // ═══════════════════════════════════════════
    function initPageTransitions() {
        // Create overlay
        var overlay = document.createElement('div');
        overlay.id = 'page-transition';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#f8fafc;opacity:0;pointer-events:none;transition:opacity 0.35s ease;';
        document.body.appendChild(overlay);

        // Fade in on load
        overlay.style.opacity = '1';
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                overlay.style.opacity = '0';
            });
        });

        // Intercept internal navigation links
        document.addEventListener('click', function (e) {
            var link = e.target.closest('a[href]');
            if (!link) return;
            var href = link.getAttribute('href');
            // Skip anchors, external links, downloads, JS links
            if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
                href.startsWith('tel:') || href.startsWith('javascript:') ||
                link.hasAttribute('download') || link.target === '_blank' ||
                href.startsWith('http')) return;

            // Only handle .html navigation
            if (href.endsWith('.html') || href === './' || href === '../') {
                e.preventDefault();
                overlay.style.opacity = '1';
                overlay.style.pointerEvents = 'all';
                setTimeout(function () {
                    window.location.href = href;
                }, 350);
            }
        });
    }

    // ═══════════════════════════════════════════
    //  15. KONAMI CODE EASTER EGG
    // ═══════════════════════════════════════════
    function initKonamiEgg() {
        var sequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
        var pos = 0;

        document.addEventListener('keydown', function (e) {
            if (e.keyCode === sequence[pos]) {
                pos++;
                if (pos === sequence.length) {
                    pos = 0;
                    triggerConfetti();
                }
            } else {
                pos = 0;
            }
        });

        function triggerConfetti() {
            var COLORS = [
                '#ff0000', '#ff6600', '#ffcc00', '#ccff00',
                '#33ff00', '#00ff66', '#00ffcc', '#00ccff',
                '#0066ff', '#6600ff', '#cc00ff', '#ff00cc'
            ];
            var canvas = document.createElement('canvas');
            canvas.style.cssText = 'position:fixed;inset:0;z-index:100000;pointer-events:none;';
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            document.body.appendChild(canvas);
            var ctx = canvas.getContext('2d');

            // Show a fun message
            var msg = document.createElement('div');
            msg.textContent = '🎉 You found the secret! 🎉';
            msg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:100001;font-family:var(--font-display);font-size:2rem;font-weight:900;color:#fff;text-shadow:0 2px 20px rgba(0,0,0,0.5);pointer-events:none;opacity:0;transition:opacity 0.5s ease;';
            document.body.appendChild(msg);
            requestAnimationFrame(function () { msg.style.opacity = '1'; });

            var particles = [];
            for (var i = 0; i < 120; i++) {
                var angle = Math.random() * Math.PI * 2;
                var speed = 3 + Math.random() * 8;
                particles.push({
                    x: canvas.width / 2,
                    y: canvas.height / 2,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 3,
                    size: 4 + Math.random() * 6,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    life: 1,
                    decay: 0.008 + Math.random() * 0.012,
                    shape: Math.random() > 0.5 ? 'rect' : 'circle'
                });
            }

            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                var alive = false;
                particles.forEach(function (p) {
                    if (p.life <= 0) return;
                    alive = true;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.15; // gravity
                    p.life -= p.decay;
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;
                    if (p.shape === 'rect') {
                        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size * 0.6);
                    } else {
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
                if (alive) {
                    requestAnimationFrame(draw);
                } else {
                    canvas.remove();
                    msg.style.opacity = '0';
                    setTimeout(function () { msg.remove(); }, 500);
                }
            }
            requestAnimationFrame(draw);
        }
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
        initRadarChart();
        initTestimonials();
        initColorCycle();
        initScrollCounters();
        initReadingProgress();
        initPageTransitions();
        initKonamiEgg();
        initProfileParticles();
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
