if (typeof lottie !== 'undefined') {
    lottie.loadAnimation({
        container: document.getElementById('loading-lottie'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '../animacion_loading.json'
    });
}

window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById('loading-overlay').classList.add('hidden');
        if (translations[currentLang]['page.title']) {
            document.title = translations[currentLang]['page.title'];
        }
        initScrollReveal();
        initCounters();
        initNavScroll();
        initCursorGlow();
        initScrollProgress();
        initBackToTop();
        initCardTilt();
        initRain();
        initSound();
        initLangToggle();
        initCountdown();
        initRaceModal();
        initTimelineScroll();
        initLightbox();
        initParallax();
        initTimelineParticles();
        initSectionTransitions();
        initRivalToggle();
        initAccordion();
        initTimelineAutoPlay();
        initRaceWeekendMode();
        initVideoModal();
        initWallpaperDownload();
        initVisitCounter();
    }, 1500);
});

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.metric-card, .trophy-card, .spec-item, .mf-item, .model-viewer-wrapper, .driver-card, .gallery-card, .compare-chart, .standings-table, .standings-chart, .accordion-item, .rival-data').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

function initCounters() {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                if (!target) return;
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.card-value[data-target]').forEach(el => {
        counterObserver.observe(el);
    });
}

function animateCounter(el, target) {
    let current = 0;
    const duration = 2000;
    const startTime = performance.now();
    function easeOutBounce(t) {
        const n1 = 7.5625, d1 = 2.75;
        if (t < 1/d1) return n1*t*t;
        else if (t < 2/d1) return n1*(t-=1.5/d1)*t+0.75;
        else if (t < 2.5/d1) return n1*(t-=2.25/d1)*t+0.9375;
        else return n1*(t-=2.625/d1)*t+0.984375;
    }
    function update() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        current = Math.round(easeOutBounce(progress) * target);
        el.textContent = current.toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString();
    }
    update();
}

function initNavScroll() {
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    let navTicking = false;
    window.addEventListener('scroll', () => {
        if (navTicking) return;
        navTicking = true;
        requestAnimationFrame(() => {
            let current = '';
            sections.forEach(section => {
                if (window.scrollY >= section.offsetTop - 200) current = section.getAttribute('id');
            });
            links.forEach(link => {
                const isActive = link.getAttribute('href') === '#' + current;
                link.classList.toggle('active', isActive);
                isActive ? link.setAttribute('aria-current', 'page') : link.removeAttribute('aria-current');
            });
            navTicking = false;
        });
    }, { passive: true });
}

function initCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    if (!glow) return;
    let mouseX = -200, mouseY = -200, currentX = -200, currentY = -200;
    let rafId = null, ticking = false;
    // Posición inicial fuera de pantalla
    glow.style.transform = `translate3d(-200px,-200px,0) translate(-50%,-50%)`;

    function animate() {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        glow.style.transform = `translate3d(${currentX}px,${currentY}px,0) translate(-50%,-50%)`;
        rafId = requestAnimationFrame(animate);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!rafId) rafId = requestAnimationFrame(animate);
        glow.style.opacity = '1';
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    }, { passive: true });
}

function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const progress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                bar.style.width = progress + '%';
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => { btn.classList.toggle('visible', window.scrollY > 400); }, { passive: true });
    btn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

function initCardTilt() {
    document.querySelectorAll('.metric-card, .trophy-card, .spec-item, .driver-card').forEach(card => {
        let rafTilt = null;
        card.addEventListener('mousemove', (e) => {
            if (rafTilt) return; // throttle
            rafTilt = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left, y = e.clientY - rect.top;
                const cx = rect.width / 2, cy = rect.height / 2;
                const tiltX = ((y - cy) / cy) * -5;
                const tiltY = ((x - cx) / cx) * 5;
                card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02,1.02,1.02)`;
                rafTilt = null;
            });
        }, { passive: true });
        card.addEventListener('mouseleave', () => {
            if (rafTilt) { cancelAnimationFrame(rafTilt); rafTilt = null; }
            card.style.transform = '';
        });
    });
}

function initRain() {
    const canvas = document.getElementById('rainCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    let animFrameId = null;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', () => {
        clearTimeout(window._rainResizeTimer);
        window._rainResizeTimer = setTimeout(resize, 150);
    }, { passive: true });

    const count = 60; // reducido de 80
    const drops = Array.from({ length: count }, () => ({
        x: Math.random() * (window.innerWidth || 1920),
        y: Math.random() * (window.innerHeight || 1080),
        len: 10 + Math.random() * 20,
        speed: 1.5 + Math.random() * 2.5,
        opacity: 0.08 + Math.random() * 0.15
    }));

    function draw() {
        ctx.clearRect(0, 0, W, H);
        ctx.lineWidth = 1;
        // Agrupar por opacidad para reducir cambios de estado
        drops.forEach(d => {
            ctx.globalAlpha = d.opacity;
            ctx.strokeStyle = 'rgba(255,255,255,0.18)';
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d.x - 1.5, d.y + d.len);
            ctx.stroke();
            d.y += d.speed;
            if (d.y > H) { d.y = -d.len; d.x = Math.random() * W; }
        });
        ctx.globalAlpha = 1;
        animFrameId = requestAnimationFrame(draw);
    }
    draw();
}

let engineAudio = null;

function initSound() {
    const btn = document.getElementById('soundToggle');
    if (!btn) return;
    engineAudio = new Audio('../audio/Bad Bunny - MONACO (Instrumental).mp3');
    engineAudio.loop = true;
    engineAudio.volume = 0;
    let playing = false;
    let retries = 0;

    function fadeIn() {
        let vol = 0;
        const interval = setInterval(() => {
            vol += 0.05;
            if (vol >= 0.25) {
                vol = 0.25;
                clearInterval(interval);
            }
            engineAudio.volume = vol;
        }, 100);
    }

    function startAudio() {
        if (playing) return;
        engineAudio.play().then(() => {
            playing = true;
            btn.classList.add('sound-active');
            fadeIn();
        }).catch(() => {
            if (retries < 10) {
                retries++;
                setTimeout(startAudio, 500);
            }
        });
    }

    startAudio();

    document.addEventListener('click', () => { if (!playing) startAudio(); }, { once: true });
    document.addEventListener('touchstart', () => { if (!playing) startAudio(); }, { once: true });

    btn.addEventListener('click', () => {
        if (playing) {
            engineAudio.pause();
            playing = false;
            btn.classList.remove('sound-active');
        } else {
            startAudio();
        }
    });

    engineAudio.addEventListener('pause', () => {
        if (playing) {
            engineAudio.play().catch(() => {});
        }
    });
}

const translations = {
    es: {
        'page.title': 'RB19 — Experiencia Cinematográfica',
        'nav.home': 'Inicio', 'nav.stats': 'Datos', 'nav.model': 'Modelo 3D',
        'nav.trophies': 'Trofeos', 'nav.drivers': 'Pilotos', 'nav.timeline': 'Temporada', 'nav.compare': 'Comparativa',
        'hero.subtitle': 'El monoplaza más dominante en la historia de la Fórmula 1',
        'hero.wins': 'Victorias', 'hero.points': 'Campeonato', 'hero.lap': 'Vuelta récord',
        'scroll': 'Desplázate',
        'stats.title': 'Métricas de', 'stats.titleaccent': 'Dominio',
        'stats.wins': 'Victorias', 'stats.winssub': 'de 22 Grandes Premios',
        'stats.points': 'Puntos', 'stats.pointssub': 'en la temporada 2023',
        'stats.poles': 'Poles', 'stats.polessub': 'Posiciones de privilegio',
        'stats.lap': 'Vuelta rápida', 'stats.lapsub': 'Circuito de Yas Marina',
        'model.desc': 'Explorá el monoplaza más dominante de la historia en 3D. Diseñado por Adrian Newey, el RB19 ganó 21 de 22 carreras en la temporada 2023.',
        'model.rotate': 'Arrastrá para rotar', 'model.zoom': 'Hacé scroll para zoom', 'model.move': 'Click derecho para mover',
        'trophies.title': 'Trofeos',
        'trophies.wins': 'Victorias', 'trophies.winssub': 'de 22 Grandes Premios',
        'trophies.driver': 'Campeonato de Pilotos', 'trophies.driversub': 'Max Verstappen — 575 pts',
        'trophies.constructor': 'Campeonato de Constructores', 'trophies.constructorsub': 'Red Bull Racing — 860 pts',
        'drivers.title': 'Nuestros', 'drivers.titleaccent': 'Pilotos',
        'drivers.wins': 'Victorias', 'drivers.pts': 'Puntos', 'drivers.poles': 'Poles',
        'timeline.title': 'Temporada', 'timeline.titleaccent': '2023',
        'timeline.hint': 'Hacé clic en cualquier GP',
        'gallery.title': 'Galería', 'gallery.titleaccent': 'RB19',
        'gallery.front': 'Vista frontal', 'gallery.side': 'Vista lateral', 'gallery.rear': 'Vista trasera', 'gallery.detail': 'Detalle',
        'compare.title': 'Comparativa', 'compare.titleaccent': 'Histórica',
        'compare.wins': 'Victorias', 'compare.pct': '% Éxito', 'compare.points': 'Puntos',
        'modal.ver': 'Verstappen', 'modal.per': 'Pérez', 'modal.fastest': 'Vuelta rápida', 'modal.type': 'Tipo', 'modal.quali': 'Clasificación',
        'specs.title': 'Especificaciones', 'specs.titleaccent': 'Técnicas',
        'specs.engine': 'Motor', 'specs.enginedesc': 'V6 Turbo híbrido',
        'specs.power': 'Potencia', 'specs.weight': 'Peso', 'specs.weightdesc': 'Incluyendo piloto',
        'specs.speed': 'Velocidad máxima', 'specs.speeddesc': 'Monoplaza 2023',
        'specs.aero': 'Aerodinámica', 'specs.aeroval': 'Efecto suelo', 'specs.aerodesc': 'Diseño Newey',
        'specs.tires': 'Neumáticos',
        'countdown': 'Próxima carrera',
        'countdown.running': '¡En curso!', 'countdown.d': 'd', 'countdown.h': 'h', 'countdown.m': 'm',
        'footer.contact': 'CONTACTO', 'footer.credit': 'RB19 — Diseñado por Mayobb. Impulsado por la excelencia.',
        'backtop': 'Volver arriba',
        'compare.rivals': 'Ver rivales directos',
        'compare.gap': 'Diferencia',
        'standings.title': 'Clasificación', 'standings.titleaccent': '2023',
        'standings.constructors': 'Constructores', 'standings.team': 'Equipo',
        'standings.pts': 'Pts', 'standings.wins': 'Vic', 'standings.pointsgraph': 'Puntos por equipo',
        'acc.title': 'Cómo', 'acc.titleaccent': 'Funciona',
        'acc.engine': 'Motor Honda RBPT', 'acc.enginebody': 'El V6 turbo híbrido produce más de 1,050 hp con una eficiencia térmica del 52%. Desarrollado por Honda en colaboración con Red Bull Powertrains, combina un MGU-K de 120 kW con un MGU-H que recupera energía del turbo.',
        'acc.aero': 'Aerodinámica de efecto suelo', 'acc.aerobody': 'El RB19 utiliza túneles de efecto suelo que generan carga aerodinámica sin necesidad de alerones complejos. Diseñado por Adrian Newey, el flujo de aire se acelera bajo el monoplaza creando un vacío que lo succiona al asfalto.',
        'acc.drs': 'Sistema DRS', 'acc.drsbody': 'El Drag Reduction System abre el alerón trasero en rectas para reducir la resistencia aerodinámica. El RB19 alcanzaba velocidades punta de 352 km/h con DRS activado, siendo el más rápido en 16 de 22 circuitos.',
        'acc.tires': 'Gestión de neumáticos', 'acc.tiresbody': 'El RB19 destacó por su excepcional gestión de neumáticos Pirelli de 18". La carga aerodinámica equilibrada permitía ventanas de parada más amplias y una degradación hasta 40% menor que la competencia.',
        'weekend': 'Modo fin de carrera',
        'timeline.autoplay': 'Reproducir',
        'footer.wallpaper': 'Descargar wallpaper',
        'visit.label': 'Visitas: ',
        'hero.video': 'Ver onboard',
        'weekend.title': 'Horario fin de carrera'
    },
    en: {
        'page.title': 'RB19 — Cinematic Experience',
        'nav.home': 'Home', 'nav.stats': 'Stats', 'nav.model': '3D Model',
        'nav.trophies': 'Trophies', 'nav.drivers': 'Drivers', 'nav.timeline': 'Season', 'nav.compare': 'Compare',
        'hero.subtitle': 'The most dominant car in Formula 1 history',
        'hero.wins': 'Wins', 'hero.points': 'Championship', 'hero.lap': 'Fastest lap',
        'scroll': 'Scroll',
        'stats.title': 'Metrics of', 'stats.titleaccent': 'Domination',
        'stats.wins': 'Wins', 'stats.winssub': 'of 22 Grands Prix',
        'stats.points': 'Points', 'stats.pointssub': 'in the 2023 season',
        'stats.poles': 'Poles', 'stats.polessub': 'Pole positions',
        'stats.lap': 'Fastest lap', 'stats.lapsub': 'Yas Marina Circuit',
        'model.desc': 'Explore the most dominant car in history in 3D. Designed by Adrian Newey, the RB19 won 21 of 22 races in the 2023 season.',
        'model.rotate': 'Drag to rotate', 'model.zoom': 'Scroll to zoom', 'model.move': 'Right click to pan',
        'trophies.title': 'Trophies',
        'trophies.wins': 'Wins', 'trophies.winssub': 'of 22 Grands Prix',
        'trophies.driver': "Drivers' Championship", 'trophies.driversub': 'Max Verstappen — 575 pts',
        'trophies.constructor': "Constructors' Championship", 'trophies.constructorsub': 'Red Bull Racing — 860 pts',
        'drivers.title': 'Our', 'drivers.titleaccent': 'Drivers',
        'drivers.wins': 'Wins', 'drivers.pts': 'Points', 'drivers.poles': 'Poles',
        'timeline.title': 'Season', 'timeline.titleaccent': '2023',
        'timeline.hint': 'Click any GP',
        'gallery.title': 'Gallery', 'gallery.titleaccent': 'RB19',
        'gallery.front': 'Front view', 'gallery.side': 'Side view', 'gallery.rear': 'Rear view', 'gallery.detail': 'Detail',
        'compare.title': 'Historic', 'compare.titleaccent': 'Comparison',
        'compare.wins': 'Wins', 'compare.pct': '% Rate', 'compare.points': 'Points',
        'modal.ver': 'Verstappen', 'modal.per': 'Perez', 'modal.fastest': 'Fastest lap', 'modal.type': 'Type', 'modal.quali': 'Qualifying',
        'specs.title': 'Technical', 'specs.titleaccent': 'Specs',
        'specs.engine': 'Engine', 'specs.enginedesc': 'V6 Turbo hybrid',
        'specs.power': 'Power', 'specs.weight': 'Weight', 'specs.weightdesc': 'Including driver',
        'specs.speed': 'Top speed', 'specs.speeddesc': '2023 car',
        'specs.aero': 'Aerodynamics', 'specs.aeroval': 'Ground effect', 'specs.aerodesc': 'Newey design',
        'specs.tires': 'Tires',
        'countdown': 'Next race',
        'countdown.running': 'Live!', 'countdown.d': 'd', 'countdown.h': 'h', 'countdown.m': 'm',
        'footer.contact': 'CONTACT', 'footer.credit': 'RB19 — Designed by Mayobb. Powered by excellence.',
        'backtop': 'Back to top',
        'compare.rivals': 'View direct rivals',
        'compare.gap': 'Gap',
        'standings.title': 'Standings', 'standings.titleaccent': '2023',
        'standings.constructors': 'Constructors', 'standings.team': 'Team',
        'standings.pts': 'Pts', 'standings.wins': 'W', 'standings.pointsgraph': 'Points per team',
        'acc.title': 'How It', 'acc.titleaccent': 'Works',
        'acc.engine': 'Honda RBPT Engine', 'acc.enginebody': 'The V6 turbo hybrid produces over 1,050 hp with 52% thermal efficiency. Developed by Honda in collaboration with Red Bull Powertrains, it combines a 120 kW MGU-K with an MGU-H that recovers energy from the turbo.',
        'acc.aero': 'Ground Effect Aerodynamics', 'acc.aerobody': 'The RB19 uses ground effect tunnels that generate downforce without complex wings. Designed by Adrian Newey, airflow accelerates under the car creating a vacuum that sucks it to the asphalt.',
        'acc.drs': 'DRS System', 'acc.drsbody': 'The Drag Reduction System opens the rear wing on straights to reduce drag. The RB19 reached top speeds of 352 km/h with DRS active, being the fastest on 16 of 22 circuits.',
        'acc.tires': 'Tire Management', 'acc.tiresbody': 'The RB19 stood out for its exceptional 18" Pirelli tire management. The balanced aerodynamic load allowed wider pit windows and up to 40% less degradation than competitors.',
        'weekend': 'Race weekend mode',
        'timeline.autoplay': 'Play',
        'footer.wallpaper': 'Download wallpaper',
        'visit.label': 'Visits: ',
        'hero.video': 'Watch onboard',
        'weekend.title': 'Race weekend schedule'
    }
};

let currentLang = 'es';

function initLangToggle() {
    const btn = document.getElementById('langToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        btn.textContent = currentLang === 'es' ? 'EN' : 'ES';
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = translations[currentLang][key];
            if (val) el.textContent = val;
        });
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            const val = translations[currentLang][key];
            if (val) el.setAttribute('aria-label', val);
        });
        if (translations[currentLang]['page.title']) {
            document.title = translations[currentLang]['page.title'];
        }
        document.querySelectorAll('.race-node').forEach(el => {
            const idx = parseInt(el.dataset.race);
            const r = raceData[idx];
            if (r) {
                const txt = r[currentLang] || r['es'];
                const nameEl = el.querySelector('.node-name');
                if (nameEl) nameEl.textContent = txt.gp.replace('Gran Premio de ','').replace(' GP','');
            }
        });
        const modal = document.getElementById('raceModal');
        if (modal && modal.classList.contains('open')) {
            const activeNode = document.querySelector('.race-node.active');
            if (activeNode) {
                const idx = parseInt(activeNode.dataset.race);
                if (!isNaN(idx)) {
                    const r = raceData[idx];
                    if (r) {
                        const body = document.getElementById('modalBody');
                        const lang = currentLang;
                        const txt = r[lang] || r['es'];
                        body.innerHTML = `
                            <div class="modal-header">
                                <div class="modal-gp">${txt.gp}</div>
                                <div class="modal-circuit">${txt.circuit}</div>
                                <div class="modal-date">${r.date} · <span class="modal-winner-tag">${r.winner}</span></div>
                            </div>
                            <div class="modal-stat-grid">
                                <div class="modal-stat-card"><span class="modal-stat-label">${t('modal.ver')}</span><span class="modal-stat-value">${r.verPos}</span><span class="modal-stat-sub">${t('modal.quali')}: ${r.verQuali}</span></div>
                                <div class="modal-stat-card"><span class="modal-stat-label">${t('modal.per')}</span><span class="modal-stat-value">${r.perPos}</span><span class="modal-stat-sub">${t('modal.quali')}: ${r.perQuali}</span></div>
                                <div class="modal-stat-card"><span class="modal-stat-label">${t('modal.fastest')}</span><span class="modal-stat-value">${r.fastestLap}</span></div>
                                <div class="modal-stat-card"><span class="modal-stat-label">${t('modal.type')}</span><span class="modal-stat-value">${txt.type}</span></div>
                            </div>
                            <div class="modal-description">${txt.gap}</div>
                        `;
                    }
                }
            }
        }
    });
}

function initCountdown() {
    const el = document.getElementById('countdownTimer');
    if (!el) return;
    const nextRace = new Date('2026-03-22T15:00:00');
    function update() {
        const now = new Date();
        const diff = nextRace - now;
        if (diff <= 0) { el.textContent = t('countdown.running'); return; }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        el.textContent = `${d}${t('countdown.d')} ${h}${t('countdown.h')} ${m}${t('countdown.m')}`;
    }
    update();
    setInterval(update, 60000);
}

const raceData = [
    { es:{gp:"Gran Premio de Bahrein",circuit:"Circuito Internacional de Bahrein",gap:"Lideró toda la carrera",type:"Victoria de apertura"}, en:{gp:"Bahrain GP",circuit:"Bahrain International Circuit",gap:"Led start to finish",type:"Opening win"}, date:"5 Mar 2023",winner:"Max Verstappen",verPos:"P1",perPos:"P2",verQuali:"P1",perQuali:"P2",fastestLap:"Zhou Guanyu"},
    { es:{gp:"Gran Premio de Arabia Saudita",circuit:"Circuito de la Corniche de Yeda",gap:"Remontó del P15",type:"Remontada épica"}, en:{gp:"Saudi Arabian GP",circuit:"Jeddah Corniche Circuit",gap:"Climbed from P15",type:"Epic comeback"}, date:"19 Mar 2023",winner:"Max Verstappen",verPos:"P1",perPos:"P2",verQuali:"P15",perQuali:"—",fastestLap:"Max Verstappen"},
    { es:{gp:"Gran Premio de Australia",circuit:"Circuito de Albert Park",gap:"Dominio total",type:"Victoria dominante"}, en:{gp:"Australian GP",circuit:"Albert Park Circuit",gap:"Total domination",type:"Dominant win"}, date:"2 Abr 2023",winner:"Max Verstappen",verPos:"P1",perPos:"P5",verQuali:"P1",perQuali:"P4",fastestLap:"Sergio Pérez"},
    { es:{gp:"Gran Premio de Azerbaiyán",circuit:"Circuito Callejero de Bakú",gap:"Sprint a favor de Pérez",type:"Doblete Red Bull"}, en:{gp:"Azerbaijan GP",circuit:"Baku City Circuit",gap:"Pérez took sprint win",type:"Red Bull 1-2"}, date:"30 Abr 2023",winner:"Sergio Pérez",verPos:"P2",perPos:"P1",verQuali:"P1",perQuali:"P3",fastestLap:"Sergio Pérez"},
    { es:{gp:"Gran Premio de Miami",circuit:"Autódromo Internacional de Miami",gap:"Remontó del P9 al P2",type:"Doblete Red Bull"}, en:{gp:"Miami GP",circuit:"Miami International Autodrome",gap:"Climbed from P9 to P2",type:"Red Bull 1-2"}, date:"7 May 2023",winner:"Sergio Pérez",verPos:"P2",perPos:"P1",verQuali:"P9",perQuali:"P1",fastestLap:"Max Verstappen"},
    { es:{gp:"Gran Premio de Mónaco",circuit:"Circuito de Mónaco",gap:"Aguantó la presión",type:"Victoria técnica"}, en:{gp:"Monaco GP",circuit:"Circuit de Monaco",gap:"Held off pressure",type:"Technical win"}, date:"28 May 2023",winner:"Max Verstappen",verPos:"P1",perPos:"P2",verQuali:"P1",perQuali:"P2",fastestLap:"Lewis Hamilton"},
    { es:{gp:"Gran Premio de España",circuit:"Circuito de Barcelona-Cataluña",gap:"Dominio absoluto",type:"Victoria aplastante"}, en:{gp:"Spanish GP",circuit:"Circuit de Barcelona-Catalunya",gap:"Absolute dominance",type:"Crushing win"}, date:"4 Jun 2023",winner:"Max Verstappen",verPos:"P1",perPos:"P4",verQuali:"P1",perQuali:"P2",fastestLap:"Max Verstappen"},
    { es:{gp:"Gran Premio de Canadá",circuit:"Circuito Gilles Villeneuve",gap:"Ganó con cómoda ventaja",type:"Victoria de control"}, en:{gp:"Canadian GP",circuit:"Circuit Gilles Villeneuve",gap:"Won with comfortable gap",type:"Controlled win"}, date:"18 Jun 2023",winner:"Max Verstappen",verPos:"P1",perPos:"P6",verQuali:"P1",perQuali:"P3",fastestLap:"Sergio Pérez"},
    { es:{gp:"Gran Premio de Austria",circuit:"Red Bull Ring",gap:"Carrera en casa",type:"Victoria local"}, en:{gp:"Austrian GP",circuit:"Red Bull Ring",gap:"Home race win",type:"Home victory"}, date:"2 Jul 2023",winner:"Max Verstappen",verPos:"P1",perPos:"P3",verQuali:"P1",perQuali:"P2",fastestLap:"Max Verstappen"},
    { es:{gp:"Gran Premio de Gran Bretaña",circuit:"Circuito de Silverstone",gap:"McLaren presionó",type:"Victoria resistida"}, en:{gp:"British GP",circuit:"Silverstone Circuit",gap:"McLaren pushed hard",type:"Hard-fought win"}, date:"9 Jul 2023",winner:"Max Verstappen",verPos:"P1",perPos:"P—",verQuali:"P1",perQuali:"P—",fastestLap:"Max Verstappen"},
    { es:{gp:"Gran Premio de Hungría",circuit:"Hungaroring",gap:"Racha de 7 victorias consecutivas",type:"Récord de racha"}, en:{gp:"Hungarian GP",circuit:"Hungaroring",gap:"7 consecutive wins streak",type:"Record streak"}, date:"23 Jul 2023",winner:"Max Verstappen",verPos:"P1",perPos:"P3",verQuali:"P1",perQuali:"P2",fastestLap:"Max Verstappen"},
    { es:{gp:"Gran Premio de Bélgica",circuit:"Circuito de Spa-Francorchamps",gap:"Dominó a pesar de lluvia",type:"Victoria bajo lluvia"}, en:{gp:"Belgian GP",circuit:"Spa-Francorchamps",gap:"Dominant despite rain",type:"Rain victory"}, date:"30 Jul 2023",winner:"Max Verstappen",verPos:"P1",perPos:"P2",verQuali:"P1",perQuali:"P2",fastestLap:"Lewis Hamilton"},
    { es:{gp:"Gran Premio de Países Bajos",circuit:"Circuito de Zandvoort",gap:"Carrera en casa, 9ª consecutiva",type:"Victoria local"}, en:{gp:"Dutch GP",circuit:"Zandvoort Circuit",gap:"Home race, 9th consecutive",type:"Home victory"}, date:"27 Ago 2023",winner:"Max Verstappen",verPos:"P1",perPos:"P4",verQuali:"P1",perQuali:"P2",fastestLap:"Fernando Alonso"},
    { es:{gp:"Gran Premio de Italia",circuit:"Autodromo Nazionale di Monza",gap:"10ª victoria consecutiva — récord absoluto",type:"Récord histórico"}, en:{gp:"Italian GP",circuit:"Autodromo Nazionale di Monza",gap:"10th consecutive win — all-time record",type:"Historic record"}, date:"3 Sep 2023",winner:"Max Verstappen",verPos:"P1",perPos:"P2",verQuali:"P1",perQuali:"P2",fastestLap:"Oscar Piastri"},
    { es:{gp:"Gran Premio de Singapur",circuit:"Circuito Callejero de Marina Bay",gap:"Peor fin de semana del RB19; Sainz ganó",type:"Única derrota"}, en:{gp:"Singapore GP",circuit:"Marina Bay Street Circuit",gap:"RB19's worst weekend; Sainz won",type:"Only loss"}, date:"17 Sep 2023",winner:"Carlos Sainz",verPos:"P5",perPos:"P8",verQuali:"P11",perQuali:"P13",fastestLap:"Lewis Hamilton"},
    { es:{gp:"Gran Premio de Japón",circuit:"Circuito de Suzuka",gap:"Red Bull se coronó campeón de constructores",type:"Título de constructores"}, en:{gp:"Japanese GP",circuit:"Suzuka Circuit",gap:"Red Bull clinched constructors' title",type:"Constructors' title"}, date:"24 Sep 2023",winner:"Max Verstappen",verPos:"P1",perPos:"P2",verQuali:"P1",perQuali:"P2",fastestLap:"Max Verstappen"},
    { es:{gp:"Gran Premio de Qatar",circuit:"Circuito Internacional de Lusail",gap:"Verstappen se coronó campeón de pilotos",type:"Título de pilotos"}, en:{gp:"Qatar GP",circuit:"Lusail International Circuit",gap:"Verstappen crowned drivers' champion",type:"Drivers' title"}, date:"8 Oct 2023",winner:"Max Verstappen",verPos:"P1",perPos:"P3",verQuali:"P1",perQuali:"P2",fastestLap:"Max Verstappen"},
    { es:{gp:"Gran Premio de Estados Unidos",circuit:"Circuito de las Américas",gap:"Sprint incluido",type:"Victoria en Austin"}, en:{gp:"United States GP",circuit:"Circuit of the Americas",gap:"Sprint included",type:"Austin win"}, date:"22 Oct 2023",winner:"Max Verstappen",verPos:"P1",perPos:"P5",verQuali:"P1",perQuali:"P2",fastestLap:"Max Verstappen"},
    { es:{gp:"Gran Premio de México",circuit:"Autódromo Hermanos Rodríguez",gap:"Día complicado para Pérez en casa",type:"Carrera de banderas"}, en:{gp:"Mexican GP",circuit:"Autódromo Hermanos Rodríguez",gap:"Tough home race for Pérez",type:"Flag-filled race"}, date:"29 Oct 2023",winner:"Max Verstappen",verPos:"P1",perPos:"P—",verQuali:"P1",perQuali:"P—",fastestLap:"Lewis Hamilton"},
    { es:{gp:"Gran Premio de Brasil",circuit:"Autódromo José Carlos Pace",gap:"Sprint incluido",type:"Victoria en Interlagos"}, en:{gp:"Brazilian GP",circuit:"Autódromo José Carlos Pace",gap:"Sprint included",type:"Interlagos win"}, date:"5 Nov 2023",winner:"Max Verstappen",verPos:"P1",perPos:"P4",verQuali:"P1",perQuali:"P2",fastestLap:"Max Verstappen"},
    { es:{gp:"Gran Premio de Las Vegas",circuit:"Circuito Callejero de Las Vegas",gap:"Espectáculo nocturno en la Strip",type:"Noche en Vegas"}, en:{gp:"Las Vegas GP",circuit:"Las Vegas Strip Circuit",gap:"Night spectacle on the Strip",type:"Vegas night"}, date:"18 Nov 2023",winner:"Max Verstappen",verPos:"P1",perPos:"P3",verQuali:"P2",perQuali:"P1",fastestLap:"Max Verstappen"},
    { es:{gp:"Gran Premio de Abu Dhabi",circuit:"Circuito de Yas Marina",gap:"Cierre perfecto de temporada",type:"Cierre perfecto"}, en:{gp:"Abu Dhabi GP",circuit:"Yas Marina Circuit",gap:"Perfect season finale",type:"Perfect close"}, date:"26 Nov 2023",winner:"Max Verstappen",verPos:"P1",perPos:"P2",verQuali:"P1",perQuali:"P2",fastestLap:"Max Verstappen"}
];

function t(key) { return translations[currentLang]?.[key] || translations['es']?.[key] || key; }

let lastFocus = null;

function initRaceModal() {
    const modal = document.getElementById('raceModal');
    const body = document.getElementById('modalBody');
    const close = document.getElementById('modalClose');
    if (!modal || !body || !close) return;

    function open(idx) {
        const r = raceData[idx];
        if (!r) return;
        lastFocus = document.activeElement;
        const lang = currentLang;
        const txt = r[lang] || r['es'];
        body.innerHTML = `
            <div class="modal-header">
                <div class="modal-gp" id="modalTitle">${txt.gp}</div>
                <div class="modal-circuit">${txt.circuit}</div>
                <div class="modal-date">${r.date} · <span class="modal-winner-tag">${r.winner}</span></div>
            </div>
            <div class="modal-stat-grid">
                <div class="modal-stat-card">
                    <span class="modal-stat-label">${t('modal.ver')}</span>
                    <span class="modal-stat-value">${r.verPos}</span>
                    <span class="modal-stat-sub">${t('modal.quali')}: ${r.verQuali}</span>
                </div>
                <div class="modal-stat-card">
                    <span class="modal-stat-label">${t('modal.per')}</span>
                    <span class="modal-stat-value">${r.perPos}</span>
                    <span class="modal-stat-sub">${t('modal.quali')}: ${r.perQuali}</span>
                </div>
                <div class="modal-stat-card">
                    <span class="modal-stat-label">${t('modal.fastest')}</span>
                    <span class="modal-stat-value">${r.fastestLap}</span>
                </div>
                <div class="modal-stat-card">
                    <span class="modal-stat-label">${t('modal.type')}</span>
                    <span class="modal-stat-value">${txt.type}</span>
                </div>
            </div>
            <div class="modal-description">${txt.gap}</div>
        `;
        modal.classList.add('open');
        close.focus();
    }

    function closeModal() {
        modal.classList.remove('open');
        if (lastFocus) lastFocus.focus();
    }

    close.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    document.querySelectorAll('.race-node').forEach(marker => {
        marker.addEventListener('click', () => {
            const idx = parseInt(marker.dataset.race);
            if (!isNaN(idx)) open(idx);
        });
        marker.style.cursor = 'pointer';
    });
}

function initTimelineScroll() {
    const nodes = document.querySelectorAll('.race-node');
    const timeline = document.getElementById('timeline');
    if (!nodes.length || !timeline) return;

    const infoEl = document.createElement('div');
    infoEl.className = 'race-scroll-info';
    infoEl.innerHTML = '<div class="rsi-inner"></div>';
    timeline.appendChild(infoEl);
    const rsiInner = infoEl.querySelector('.rsi-inner');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const idx = parseInt(entry.target.dataset.race);
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view', 'active');
            }
        });
    }, { rootMargin: '-40% 0px -40% 0px' });

    nodes.forEach(n => observer.observe(n));

    function updateActive() {
        const visible = document.querySelectorAll('.race-node.in-view');
        if (!visible.length) { infoEl.classList.remove('visible'); return; }

        let closest = null, minDist = Infinity;
        const cy = window.innerHeight / 2;
        visible.forEach(n => {
            const rect = n.getBoundingClientRect();
            const dist = Math.abs(rect.top + rect.height/2 - cy);
            if (dist < minDist) { minDist = dist; closest = n; }
        });

        nodes.forEach(n => n.classList.remove('active'));
        if (!closest) { infoEl.classList.remove('visible'); return; }

        closest.classList.add('active');
        const idx = parseInt(closest.dataset.race);
        const r = raceData[idx];
        if (!r) return;
        const lang = currentLang;
        const txt = r[lang] || r['es'];

        const dot = closest.querySelector('.node-dot');
        const dotRect = dot.getBoundingClientRect();
        const tRect = timeline.getBoundingClientRect();

        rsiInner.innerHTML = `
            <div class="rsi-gp">${txt.gp.replace('Gran Premio de ','').replace(' GP','')}</div>
            <div class="rsi-stat"><span class="rsi-label">${t('modal.ver')}</span><span>${r.verPos}</span></div>
            <div class="rsi-stat"><span class="rsi-label">${t('modal.per')}</span><span>${r.perPos}</span></div>
            <div class="rsi-stat"><span class="rsi-label">VR</span><span>${r.fastestLap}</span></div>
            <div class="rsi-desc">${txt.type}</div>
        `;

        const isLeft = closest.matches(':nth-child(odd)');
        const dotCenter = dotRect.left + dotRect.width/2 - tRect.left;
        const dotTop = dotRect.top + dotRect.height/2 - tRect.top;

        if (isLeft) {
            infoEl.style.left = (dotCenter + 24) + 'px';
            rsiInner.style.textAlign = 'left';
        } else {
            infoEl.style.left = 'auto';
            infoEl.style.right = (tRect.width - dotCenter + 24) + 'px';
            rsiInner.style.textAlign = 'right';
        }
        infoEl.style.top = (dotTop - 30) + 'px';
        infoEl.classList.add('visible');
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
}

function initLightbox() {
    const overlay = document.getElementById('galleryLightbox');
    const img = document.getElementById('lightboxImg');
    const close = document.getElementById('lightboxClose');
    const prev = document.getElementById('lightboxPrev');
    const next = document.getElementById('lightboxNext');
    const counter = document.getElementById('lightboxCounter');
    if (!overlay || !img) return;
    const cards = document.querySelectorAll('.gallery-card');
    const sources = [];
    cards.forEach(c => {
        const i = c.querySelector('.gallery-img');
        if (i) sources.push({ src: i.getAttribute('src'), alt: i.getAttribute('alt') || '' });
    });
    let current = -1;
    function open(idx) {
        if (idx < 0 || idx >= sources.length) return;
        current = idx;
        img.src = sources[idx].src;
        img.alt = sources[idx].alt;
        if (counter && sources.length) counter.textContent = `${idx+1} / ${sources.length}`;
        overlay.classList.add('open');
        overlay.focus();
    }
    function closeLb() { overlay.classList.remove('open'); current = -1; }
    function prevLb() { if (current > 0) open(current - 1); else open(sources.length - 1); }
    function nextLb() { if (current < sources.length - 1) open(current + 1); else open(0); }
    cards.forEach((c, i) => {
        c.addEventListener('click', () => open(i));
        c.style.cursor = 'pointer';
    });
    if (close) close.addEventListener('click', closeLb);
    if (prev) prev.addEventListener('click', prevLb);
    if (next) next.addEventListener('click', nextLb);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLb(); });
    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('open')) return;
        if (e.key === 'Escape') closeLb();
        if (e.key === 'ArrowLeft') prevLb();
        if (e.key === 'ArrowRight') nextLb();
    });
}

function initParallax() {
    const els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;
    let paraTicking = false;
    window.addEventListener('scroll', () => {
        if (paraTicking) return;
        paraTicking = true;
        requestAnimationFrame(() => {
            const sy = window.scrollY;
            els.forEach(el => {
                const rate = parseFloat(el.dataset.parallax) || 0.15;
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.style.transform = `translate3d(0,${sy * -rate}px,0)`;
                }
            });
            paraTicking = false;
        });
    }, { passive: true });
}

function initTimelineParticles() {
    const timeline = document.querySelector('.track-timeline');
    if (!timeline) return;
    const container = document.createElement('div');
    container.className = 'timeline-particles';
    container.setAttribute('aria-hidden', 'true');
    timeline.appendChild(container);
    const count = 30;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'tp-particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animation = `tpDrift ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 5}s infinite`;
        p.style.opacity = 0.1 + Math.random() * 0.3;
        container.appendChild(p);
    }
    const style = document.createElement('style');
    style.textContent = `
        @keyframes tpDrift {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.1; }
            50% { transform: translate(${Math.random() > 0.5 ? '' : '-'}10px, ${Math.random() > 0.5 ? '' : '-'}10px) scale(1.5); opacity: 0.5; }
        }
    `;
    document.head.appendChild(style);
}

function initSectionTransitions() {
    const sections = document.querySelectorAll('.section');
    if (!sections.length) return;
    sections[0].classList.add('visible-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible-section');
            }
        });
    }, { threshold: 0.1 });
    sections.forEach(s => observer.observe(s));
}

function initRivalToggle() {
    const btn = document.getElementById('rivalToggle');
    const data = document.getElementById('rivalData');
    if (!btn || !data) return;
    btn.addEventListener('click', () => {
        data.classList.toggle('open');
        btn.textContent = data.classList.contains('open')
            ? (currentLang === 'es' ? 'Ocultar rivales' : 'Hide rivals')
            : (currentLang === 'es' ? 'Ver rivales directos' : 'View direct rivals');
    });
}

function initAccordion() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.accordion-item');
            if (!item) return;
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.accordion-item.open').forEach(o => {
                if (o !== item) {
                    o.classList.remove('open');
                    o.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                }
            });
            if (isOpen) {
                item.classList.remove('open');
                header.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('open');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

function initTimelineAutoPlay() {
    const btn = document.getElementById('timelineAutoPlay');
    const nodes = document.querySelectorAll('.race-node');
    if (!btn || !nodes.length) return;
    let interval = null;
    let currentIdx = 0;
    btn.addEventListener('click', () => {
        if (interval) {
            clearInterval(interval); interval = null;
            btn.classList.remove('playing');
            btn.textContent = currentLang === 'es' ? 'Reproducir' : 'Play';
            return;
        }
        btn.classList.add('playing');
        btn.textContent = currentLang === 'es' ? 'Detener' : 'Stop';
        currentIdx = 0;
        nodes[currentIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
        nodes.forEach(n => n.classList.remove('active'));
        nodes[currentIdx].classList.add('active');
        interval = setInterval(() => {
            nodes.forEach(n => n.classList.remove('active'));
            currentIdx = (currentIdx + 1) % nodes.length;
            nodes[currentIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
            nodes[currentIdx].classList.add('active');
        }, 2000);
    });
}

function initRaceWeekendMode() {
    const btn = document.getElementById('raceWeekendToggle');
    if (!btn) return;
    const panel = document.createElement('div');
    panel.className = 'race-weekend-panel';
    panel.innerHTML = `
        <div class="rw-title" data-i18n="weekend.title">Horario fin de carrera</div>
        <div class="rw-session"><span class="rw-session-name">FP1</span><span class="rw-session-time">Viernes 10:30</span></div>
        <div class="rw-session"><span class="rw-session-name">FP2</span><span class="rw-session-time">Viernes 14:00</span></div>
        <div class="rw-session"><span class="rw-session-name">FP3</span><span class="rw-session-time">Sábado 10:30</span></div>
        <div class="rw-session"><span class="rw-session-name">Clasificación</span><span class="rw-session-time">Sábado 14:00</span></div>
        <div class="rw-session"><span class="rw-session-name">Carrera</span><span class="rw-session-time">Domingo 15:00</span></div>
    `;
    document.body.appendChild(panel);
    let open = false;
    btn.addEventListener('click', () => {
        open = !open;
        panel.classList.toggle('open', open);
        btn.classList.toggle('sound-active', open);
    });
    document.addEventListener('click', (e) => {
        if (open && !panel.contains(e.target) && e.target !== btn) {
            open = false;
            panel.classList.remove('open');
            btn.classList.remove('sound-active');
        }
    });
    const toggleLang = () => {
        const title = panel.querySelector('.rw-title');
        if (title) title.textContent = currentLang === 'es' ? 'Horario fin de carrera' : 'Race weekend schedule';
    };
    document.getElementById('langToggle')?.addEventListener('click', toggleLang);
}

function initVideoModal() {
    const modal = document.getElementById('videoModal');
    const close = document.getElementById('videoModalClose');
    const video = document.getElementById('onboardVideo');
    if (!modal || !close || !video) return;
    function closeVm() {
        modal.classList.remove('open');
        video.pause();
    }
    close.addEventListener('click', closeVm);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeVm(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeVm();
    });
    const heroVideoBtn = document.createElement('button');
    heroVideoBtn.className = 'hero-video-btn glass';
    heroVideoBtn.setAttribute('data-i18n', 'hero.video');
    heroVideoBtn.textContent = currentLang === 'es' ? 'Ver onboard' : 'Watch onboard';
    heroVideoBtn.setAttribute('aria-label', 'Onboard video');
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.appendChild(heroVideoBtn);
        heroVideoBtn.addEventListener('click', () => {
            modal.classList.add('open');
            video.currentTime = 0;
            video.play().catch(() => {});
        });
    }
}

function initWallpaperDownload() {
    const link = document.getElementById('wallpaperDownload');
    if (!link) return;
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const canvas = document.createElement('canvas');
        canvas.width = 1920;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(960, 540, 0, 960, 540, 960);
        gradient.addColorStop(0, '#1a1a1a');
        gradient.addColorStop(0.5, '#0a0a0a');
        gradient.addColorStop(1, '#000000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1920, 1080);
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.font = 'bold 80px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('RB19', 960, 400);
        ctx.font = '24px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillText('RED BULL RACING', 960, 520);
        ctx.fillStyle = 'rgba(255,255,255,0.02)';
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.arc(960, 540, 200 + i * 40, 0, Math.PI * 2);
            ctx.stroke();
        }
        link.download = 'rb19-wallpaper.png';
        link.href = canvas.toDataURL('image/png');
    });
}

function initVisitCounter() {
    const el = document.getElementById('visitCount');
    if (!el) return;
    let visits = parseInt(localStorage.getItem('rb19_visits') || '0');
    visits++;
    localStorage.setItem('rb19_visits', visits.toString());
    el.textContent = visits;
}


