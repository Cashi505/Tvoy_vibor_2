/* ============================================
   SCROLL REVEAL — Intersection Observer
   ============================================ */
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll(
    '.reveal-up, .reveal-fade, .reveal-left, .reveal-right'
).forEach(el => revealObserver.observe(el));

/* ============================================
   HEADER — scroll state
   ============================================ */
const header = document.getElementById('header');

const headerObserver = new IntersectionObserver(
    ([entry]) => {
        header.classList.toggle('scrolled', !entry.isIntersecting);
    },
    { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
);
const heroSection = document.getElementById('hero');
if (heroSection) headerObserver.observe(heroSection);

/* ============================================
   MOBILE MENU
   ============================================ */
const burger   = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-label', 'Открыть меню');
        document.body.style.overflow = '';
    });
});

/* ============================================
   HERO VIDEO — autoplay fallback for reduced motion
   ============================================ */
const heroVideo = document.getElementById('heroVideo');
if (heroVideo && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroVideo.removeAttribute('autoplay');
    heroVideo.removeAttribute('loop');
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
const counterObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const duration = 1600;
            const startTime = performance.now();

            const tick = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(tick);
                else el.textContent = target;
            };

            requestAnimationFrame(tick);
            counterObserver.unobserve(el);
            setTimeout(() => el.classList.add('done'), 1700);
        });
    },
    { threshold: 0.5 }
);

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

/* ============================================
   CALORIE CALCULATOR
   ============================================ */
document.getElementById('calcBtn').addEventListener('click', () => {
    const gender   = document.querySelector('input[name="gender"]:checked').value;
    const age      = parseFloat(document.getElementById('age').value);
    const height   = parseFloat(document.getElementById('height').value);
    const weight   = parseFloat(document.getElementById('weight').value);
    const activity = parseFloat(document.getElementById('activity').value);
    const goalPct  = parseFloat(document.getElementById('goal').value);

    if (!age || !height || !weight) {
        shakeElement(document.getElementById('calcBtn'));
        return;
    }

    const bmr = gender === 'male'
        ? (10 * weight) + (6.25 * height) - (5 * age) + 5
        : (10 * weight) + (6.25 * height) - (5 * age) - 161;

    const kcal = Math.round(bmr * activity * (1 + goalPct / 100));

    const programs = [
        { max: 1050,     name: 'Похудение',       hint: '900 ккал/день' },
        { max: 1400,     name: 'Поддержание',      hint: '1200 ккал/день' },
        { max: 2100,     name: 'Сбалансированное', hint: '1800 ккал/день' },
        { max: 2750,     name: 'Набор массы',      hint: '2500 ккал/день' },
        { max: Infinity, name: 'Как дома',         hint: 'до 3000 ккал/день' },
    ];

    const match     = programs.find(p => kcal <= p.max);
    const resultEl  = document.getElementById('calcResult');
    const numEl     = document.getElementById('resultNum');
    const programEl = document.getElementById('resultProgram');
    const ctaEl     = document.getElementById('resultCta');

    resultEl.classList.add('visible');

    const end = kcal;
    const dur = 900;
    const t0  = performance.now();

    const animNum = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        numEl.textContent = Math.round(end * e).toLocaleString('ru-RU');
        if (p < 1) requestAnimationFrame(animNum);
    };
    requestAnimationFrame(animNum);

    programEl.textContent =
        `Рекомендуем программу "${match.name}" (${match.hint})`;
    ctaEl.style.display = 'inline-flex';

    // Автоматически выбираем программу в блоке меню
    const matchBtn = [...document.querySelectorAll('.sched-prog')]
        .find(b => b.querySelector('.sched-prog-name')?.textContent.trim() === match.name);
    if (matchBtn && !matchBtn.classList.contains('active')) {
        matchBtn.click();
    }

    setTimeout(() => {
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
});

function shakeElement(el) {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => { el.style.animation = ''; }, 400);
}

const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-5px); }
    80%      { transform: translateX(5px); }
}`;
document.head.appendChild(shakeStyle);

/* ============================================
   ORDER FORM
   ============================================ */
window.handleOrder = function(e) {
    e.preventDefault();
    const name  = document.getElementById('orderName').value.trim();
    const phone = document.getElementById('orderPhone').value.trim();
    if (!name || !phone) return false;

    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Отправлено! Мы свяжемся с вами';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    return false;
};

/* ============================================
   PHONE INPUT — auto-format
   ============================================ */
const phoneInput = document.getElementById('orderPhone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.startsWith('8')) v = '7' + v.slice(1);
        if (v.startsWith('7')) {
            const d = v.slice(1);
            let out = '+7';
            if (d.length > 0) out += ` (${d.slice(0, 3)}`;
            if (d.length > 3) out += `) ${d.slice(3, 6)}`;
            if (d.length > 6) out += `-${d.slice(6, 8)}`;
            if (d.length > 8) out += `-${d.slice(8, 10)}`;
            e.target.value = out;
        }
    });
}

/* ============================================
   FAQ ACCORDION
   Safari < 16 fallback: grid-template-rows 0fr→1fr
   doesn't animate, so we detect and use height instead.
   ============================================ */
const needsHeightFallback = (() => {
    const el = document.createElement('div');
    el.style.cssText = 'grid-template-rows:0fr;display:grid;';
    document.body.appendChild(el);
    const val = getComputedStyle(el).gridTemplateRows;
    document.body.removeChild(el);
    return val === '' || val === 'none';
})();

document.querySelectorAll('.faq-item').forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const inner  = item.querySelector('.faq-answer-inner');

    if (needsHeightFallback) {
        answer.style.overflow   = 'hidden';
        answer.style.transition = 'height 0.45s cubic-bezier(0.16,1,0.3,1)';
        answer.style.height     = '0px';
    }

    const closeItem = (el) => {
        el.classList.remove('open');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        if (needsHeightFallback) {
            const a = el.querySelector('.faq-answer');
            a.style.height = a.scrollHeight + 'px';
            requestAnimationFrame(() => { a.style.height = '0px'; });
        }
    };

    btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        document.querySelectorAll('.faq-item.open').forEach(closeItem);

        if (!isOpen) {
            item.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
            if (needsHeightFallback) {
                answer.style.height = inner.scrollHeight + 'px';
                answer.addEventListener('transitionend', () => {
                    if (item.classList.contains('open')) answer.style.height = 'auto';
                }, { once: true });
            }
        }
    });
});

/* ============================================
   MESSENGER ICONS — POP ANIMATION ON SCROLL
   ============================================ */
const messengerObserver = new IntersectionObserver(
    ([entry]) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.messenger-btn').forEach((btn, i) => {
            setTimeout(() => btn.classList.add('popped'), i * 130);
        });
        messengerObserver.unobserve(entry.target);
    },
    { threshold: 0.5 }
);
const messengerBtns = document.querySelector('.messenger-btns');
if (messengerBtns) messengerObserver.observe(messengerBtns);

/* ============================================
   WEEKLY SCHEDULE — Google Sheets
   ============================================ */
(function () {
    const SHEET_ID = '1Dm-yrY05e0xsUVC7V7GkkzGISfdthOfoOFtQJCWqr8o';
    const csvUrl = (sheet) =>
        `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}`;

    const grid    = document.getElementById('schedGrid');
    const summary = document.getElementById('schedSummary');
    if (!grid) return;

    let dishLib       = {};  // { "Название" → { img, w, p, f, c, e } }
    let weekRows      = [];  // строки текущей программы
    let weekDates     = [];  // уникальные даты из вкладки программы
    let referenceDates = []; // даты из последней успешной загрузки (для заглушки)
    let selDay      = 0;
    let loadedSheet = '';

    /* --- CSV-парсер (поддерживает кавычки) --- */
    function parseCSV(text) {
        const rows = [];
        const lines = text.trim().split('\n');
        for (let i = 1; i < lines.length; i++) {
            const cols = [];
            let cur = '', inQ = false;
            for (const ch of lines[i]) {
                if (ch === '"') { inQ = !inQ; }
                else if (ch === ',' && !inQ) { cols.push(cur.trim()); cur = ''; }
                else cur += ch;
            }
            cols.push(cur.trim());
            if (cols[0]) rows.push(cols);
        }
        return rows;
    }

    /* --- Дата "ДД.ММ.ГГГГ" → Date --- */
    function toDate(s) {
        const [d, m, y] = s.split('.').map(Number);
        return new Date(y, m - 1, d);
    }

    /* --- Ссылка Google Drive → прямой URL картинки --- */
    function photoUrl(val) {
        if (!val) return '';
        if (val.startsWith('http')) {
            const m = val.match(/\/file\/d\/([^/?]+)/);
            if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w800`;
            return val;
        }
        return 'images/menu/' + val;
    }

    /* --- Понедельник целевой недели ---
         Пн–Пт: текущая неделя. Сб–Вс: следующая.
         Если данных нет — берём ближайшую будущую неделю с данными. --- */
    function targetMonday(allDates) {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const d = today.getDay();
        const base = new Date(today);
        // Сб(6) или Вс(0) → смотрим следующую неделю
        base.setDate(today.getDate() + (d === 6 ? 2 : d === 0 ? 1 : 1 - d));

        // Собираем все понедельники из данных
        const monSet = new Set();
        allDates.forEach(s => {
            const dt = toDate(s); const wd = dt.getDay();
            const mon = new Date(dt);
            mon.setDate(dt.getDate() + (wd === 0 ? -6 : 1 - wd));
            mon.setHours(0, 0, 0, 0);
            monSet.add(mon.getTime());
        });
        const sorted = [...monSet].sort((a, b) => a - b);
        // Предпочитаем base-неделю, иначе — ближайшую будущую
        const found = sorted.find(t => t >= base.getTime());
        return found ? new Date(found) : (sorted.length ? new Date(sorted[sorted.length - 1]) : null);
    }

    function inWeek(s, mon) {
        if (!mon) return false;
        const dt = toDate(s);
        const sat = new Date(mon); sat.setDate(mon.getDate() + 5); sat.setHours(23, 59, 59, 999);
        return dt >= mon && dt <= sat;
    }

    /* --- Проверка формата ДД.ММ.ГГГГ --- */
    function isDate(s) {
        return /^\d{2}\.\d{2}\.\d{4}$/.test(s);
    }

    /* --- "Пн" + "22.06" как HTML (два ряда) --- */
    function dayLabel(s) {
        const [d, m] = s.split('.');
        const name = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][toDate(s).getDay()];
        return `<span class="day-name">${name}</span><span class="day-date">${d}.${m}</span>`;
    }

    /* --- Загрузка Справочника --- */
    async function loadDishes() {
        const res  = await fetch(csvUrl('Справочник'));
        const rows = parseCSV(await res.text());
        dishLib = {};
        // Колонки: Название | Фото | Вес | Белки | Жиры | Углеводы | Ккал
        rows.forEach(([name, photo, w, p, f, c, e]) => {
            if (name) dishLib[name] = { img: photoUrl(photo), w: +w, p: +p, f: +f, c: +c, e: +e };
        });
    }

    /* --- Загрузка вкладки программы --- */
    async function loadSheet(name) {
        if (name === loadedSheet) { render(); return; }
        const res  = await fetch(csvUrl(name));
        const rows = parseCSV(await res.text());
        // Колонки: Дата | Приём | Блюдо — фильтруем только строки с настоящими датами
        weekRows = rows.filter(r => r[0] && isDate(r[0]));
        const seen = new Set();
        weekDates = [];
        weekRows.forEach(r => { if (!seen.has(r[0])) { seen.add(r[0]); weekDates.push(r[0]); } });
        if (weekDates.length > 0) referenceDates = [...weekDates];
        loadedSheet = name;
        selDay = 0;
        rebuildDayTabs();
        render();
    }

    /* --- Перестраиваем вкладки дней --- */
    function rebuildDayTabs() {
        const wrap = document.querySelector('.sched-days');
        if (!wrap) return;
        // Нет данных — показываем вкладки из предыдущей удачной загрузки (в режиме "в разработке")
        const dates = weekDates.length ? weekDates : referenceDates;
        wrap.innerHTML = dates.length
            ? dates.map((d, i) =>
                `<button class="sched-day${i === 0 ? ' active' : ''}" data-day="${i}">${dayLabel(d)}</button>`
              ).join('')
            : '';
        wrap.querySelectorAll('.sched-day').forEach((btn, i) => {
            btn.addEventListener('click', () => {
                if (!weekDates.length) return; // заглушка — клики не переключают меню
                wrap.querySelectorAll('.sched-day').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selDay = i;
                render();
            });
        });
    }

    /* --- Рендер текущего дня --- */
    function render() {
        if (!weekDates.length) {
            summary.innerHTML = '';
            const prog = loadedSheet || 'этой программы';
            grid.innerHTML = `
                <div class="sched-wip">
                    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                        <line x1="8" y1="14" x2="8" y2="14" stroke-width="2"/><line x1="12" y1="14" x2="12" y2="14" stroke-width="2"/>
                        <line x1="8" y1="18" x2="8" y2="18" stroke-width="2"/><line x1="12" y1="18" x2="12" y2="18" stroke-width="2"/>
                    </svg>
                    <p class="sched-wip-title">Меню в разработке</p>
                    <p class="sched-wip-text">Нутрициолог составляет рацион для программы «${prog}».<br>Меню появится на следующей неделе. Пока выберите другую программу.</p>
                </div>`;
            syncCarousel();
            return;
        }
        const date  = weekDates[selDay];
        const meals = weekRows.filter(r => r[0] === date);
        const tot   = meals.reduce((t, r) => {
            const d = dishLib[r[2]];
            return d ? { p: t.p + d.p, f: t.f + d.f, c: t.c + d.c, e: t.e + d.e } : t;
        }, { p: 0, f: 0, c: 0, e: 0 });

        summary.innerHTML = `
            <div class="sched-sum-item sched-sum-kcal"><b>${tot.e}</b><span>ккал</span></div>
            <div class="sched-sum-item"><b>${tot.p}<small> г</small></b><span>Белки</span></div>
            <div class="sched-sum-item"><b>${tot.f}<small> г</small></b><span>Жиры</span></div>
            <div class="sched-sum-item"><b>${tot.c}<small> г</small></b><span>Углеводы</span></div>`;

        grid.innerHTML = meals.map(([, type, name]) => {
            const d = dishLib[name];
            if (!d) return `
                <div class="sched-card">
                    <div class="sched-card-body">
                        <h4 class="sched-card-name">${name}</h4>
                        <div class="sched-card-weight" style="color:var(--gold)">Добавьте блюдо в Справочник</div>
                    </div>
                </div>`;
            return `
                <div class="sched-card">
                    <div class="sched-card-type">${type}</div>
                    <div class="sched-card-img"><img src="${d.img}" alt="${name}" loading="lazy"></div>
                    <div class="sched-card-body">
                        <h4 class="sched-card-name">${name}</h4>
                        <div class="sched-card-weight">${d.w} г</div>
                        <div class="sched-macros">
                            <div class="sched-macro"><b>${d.p}</b><span>Белки</span></div>
                            <div class="sched-macro"><b>${d.f}</b><span>Жиры</span></div>
                            <div class="sched-macro"><b>${d.c}</b><span>Углев</span></div>
                            <div class="sched-macro sched-macro--kcal"><b>${d.e}</b><span>ккал</span></div>
                        </div>
                    </div>
                </div>`;
        }).join('');
        syncCarousel();
    }

    /* --- Состояние загрузки --- */
    function showLoading() {
        summary.innerHTML = '';
        grid.innerHTML = '<p class="sched-empty">Загрузка меню…</p>';
    }

    /* --- Карусель (мобильный): сброс позиции и счётчика после render() --- */
    function syncCarousel() {
        const nav     = document.getElementById('schedCarouselNav');
        const counter = document.getElementById('schedCounter');
        const prev    = document.getElementById('schedPrev');
        const next    = document.getElementById('schedNext');
        if (!nav || !counter || !prev || !next) return;

        const cards = grid.querySelectorAll('.sched-card');
        const total = cards.length;

        // instant scroll reset (no smooth here — content just changed)
        grid.scrollTo({ left: 0, behavior: 'instant' });
        nav.style.visibility = total ? '' : 'hidden';
        if (!total) return;

        const firstType = cards[0].querySelector('.sched-card-type')?.textContent?.trim() || '';
        counter.textContent = firstType ? `${firstType} · 1 / ${total}` : `1 / ${total}`;
        prev.disabled = true;
        next.disabled = total <= 1;
    }

    /* --- Карусель: стрелки и счётчик (инициализируется один раз) --- */
    (function initCarousel() {
        const prev    = document.getElementById('schedPrev');
        const next    = document.getElementById('schedNext');
        const counter = document.getElementById('schedCounter');
        if (!prev || !next) return;

        prev.addEventListener('click', () => {
            grid.scrollBy({ left: -grid.clientWidth, behavior: 'smooth' });
        });
        next.addEventListener('click', () => {
            grid.scrollBy({ left: grid.clientWidth, behavior: 'smooth' });
        });

        grid.addEventListener('scroll', () => {
            const cards = grid.querySelectorAll('.sched-card');
            if (!cards.length || !counter) return;
            const idx   = Math.round(grid.scrollLeft / grid.clientWidth);
            const type  = cards[idx]?.querySelector('.sched-card-type')?.textContent?.trim() || '';
            counter.textContent = type ? `${type} · ${idx + 1} / ${cards.length}` : `${idx + 1} / ${cards.length}`;
            prev.disabled = idx === 0;
            next.disabled = idx >= cards.length - 1;
        }, { passive: true });
    })();

    /* --- Кнопки программ --- */
    document.querySelectorAll('.sched-prog').forEach(btn => {
        btn.addEventListener('click', async () => {
            document.querySelectorAll('.sched-prog').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadedSheet = '';
            showLoading();
            try {
                await loadSheet(btn.querySelector('.sched-prog-name').textContent.trim());
            } catch {
                grid.innerHTML = '<p class="sched-empty">Не удалось загрузить меню</p>';
            }
        });
    });

    /* --- Инициализация --- */
    (async () => {
        showLoading();
        try {
            await loadDishes();
            const first = document.querySelector('.sched-prog.active .sched-prog-name');
            await loadSheet(first ? first.textContent.trim() : 'Похудение');
        } catch {
            grid.innerHTML = '<p class="sched-empty">Не удалось загрузить меню. Проверьте доступ к таблице.</p>';
        }
    })();
})();

/* ============================================
   PRIMARY BUTTONS — MAGNETIC HOVER
   ============================================ */
document.querySelectorAll('.btn-primary, .btn-nav').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width  / 2) * 0.25;
        const y = (e.clientY - rect.top  - rect.height / 2) * 0.25;
        btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

/* ============================================
   NAV ACTIVE STATE
   ============================================ */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(link => {
                    link.style.color =
                        link.getAttribute('href') === `#${entry.target.id}`
                            ? 'var(--gold)' : '';
                });
            }
        });
    },
    { threshold: 0.45 }
);

sections.forEach(s => navObserver.observe(s));

/* ============================================
   SCROLL PROGRESS BAR (E3)
   ============================================ */
const scrollProgress = document.getElementById('scrollProgress');
if (scrollProgress) {
    window.addEventListener('scroll', () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.width = (window.scrollY / max * 100) + '%';
    }, { passive: true });
}

/* ============================================
   HERO VIDEO PARALLAX (C2)
   ============================================ */
(function() {
    const vid = document.getElementById('heroVideo');
    if (!vid || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
            vid.style.transform = `translateY(${y * 0.28}px) scale(1.05)`;
        }
    }, { passive: true });
})();

/* ============================================
   MOBILE STICKY CTA (C3)
   ============================================ */
(function() {
    const bar  = document.getElementById('mobileCta');
    const close = document.getElementById('mobileCtaClose');
    if (!bar) return;
    let dismissed = false;
    const hero = document.getElementById('hero');
    const cta  = document.getElementById('order');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (dismissed) return;
            if (!e.isIntersecting && e.target === hero) bar.classList.add('visible');
            if (e.isIntersecting && e.target === cta)  bar.classList.remove('visible');
        });
    }, { threshold: 0.1 });
    if (hero) obs.observe(hero);
    if (cta)  obs.observe(cta);
    if (close) close.addEventListener('click', () => {
        dismissed = true;
        bar.classList.remove('visible');
    });
})();

/* ============================================
   CUSTOM CURSOR (E1)
   ============================================ */
(function() {
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;
    let mx = -50, my = -50, rx = -50, ry = -50, started = false;
    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px'; dot.style.top = my + 'px';
        if (!started) {
            started = true;
            dot.style.opacity = '1';
            ring.style.opacity = '0.7';
        }
    }, { passive: true });
    (function animRing() {
        rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
        requestAnimationFrame(animRing);
    })();
    const hoverEls = 'a,button,[role="button"],.program-card,.faq-question,.result-card';
    document.querySelectorAll(hoverEls).forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });
})();

/* ============================================
   INTERACTIVE PROGRAMS + PRICING
   ============================================ */
(function() {
    // ━━━ ЦЕНЫ — обновите здесь ━━━━━━━━━━━━━━
    const PROG_DATA = [
        {
            name: 'Похудение', kcal: '900 ккал / день', tag: 'Для похудения',
            photo: 'images/menu/tuna-salad.jpeg',
            desc: 'Дефицит калорий, высокое содержание белка, минимум простых углеводов. Минус 2 кг в неделю.',
            perks: ['Расчёт по вашему КБЖУ', 'Контроль порций', 'Без чувства голода'],
            prices: [
                { label: 'Пробный',  days: '2 дня',   price: 1400,  perDay: 700  },
                { label: '1 неделя', days: '5 дней',  price: 3200,  perDay: 640, discount: 9  },
                { label: '2 недели', days: '10 дней', price: 5800,  perDay: 580, discount: 17, popular: true },
                { label: '1 месяц',  days: '22 дня',  price: 10900, perDay: 495, discount: 29 },
            ]
        },
        {
            name: 'Поддержание', kcal: '1 200 ккал / день', tag: 'Для поддержания',
            photo: 'images/menu/oatmeal-berries.jpeg',
            desc: 'Сбалансированный рацион для тех, кто уже достиг нужного веса и хочет его удержать.',
            perks: ['Полный набор нутриентов', '4 недели разных блюд', 'Лёгкость и энергия'],
            prices: [
                { label: 'Пробный',  days: '2 дня',   price: 1800,  perDay: 900  },
                { label: '1 неделя', days: '5 дней',  price: 4100,  perDay: 820, discount: 9  },
                { label: '2 недели', days: '10 дней', price: 7400,  perDay: 740, discount: 18, popular: true },
                { label: '1 месяц',  days: '22 дня',  price: 14200, perDay: 645, discount: 28 },
            ]
        },
        {
            name: 'Сбалансированное', kcal: '1 800 ккал / день', tag: 'Для всех',
            photo: 'images/menu/chicken-breast.jpeg',
            desc: 'Идеальный баланс для активного образа жизни. Вкусно, сытно и полезно каждый день.',
            perks: ['Подходит большинству', 'Разнообразное меню', 'Для спортивного режима'],
            prices: [
                { label: 'Пробный',  days: '2 дня',   price: 2400,  perDay: 1200  },
                { label: '1 неделя', days: '5 дней',  price: 5400,  perDay: 1080, discount: 10 },
                { label: '2 недели', days: '10 дней', price: 9800,  perDay: 980,  discount: 18, popular: true },
                { label: '1 месяц',  days: '22 дня',  price: 18700, perDay: 850,  discount: 29 },
            ]
        },
        {
            name: 'Набор массы', kcal: '2 500 ккал / день', tag: 'Для спортсменов',
            photo: 'images/menu/beef-steak.jpeg',
            desc: 'Профицит калорий с высоким содержанием белка для роста мышечной массы и силы.',
            perks: ['Для спортсменов', 'Высокий процент белка', 'Комплексные углеводы'],
            prices: [
                { label: 'Пробный',  days: '2 дня',   price: 3000,  perDay: 1500  },
                { label: '1 неделя', days: '5 дней',  price: 6700,  perDay: 1340, discount: 11 },
                { label: '2 недели', days: '10 дней', price: 12200, perDay: 1220, discount: 19, popular: true },
                { label: '1 месяц',  days: '22 дня',  price: 23300, perDay: 1060, discount: 29 },
            ]
        },
        {
            name: 'Как дома', kcal: '3 000 ккал / день', tag: 'Без ограничений',
            photo: 'images/menu/chicken-soup.jpeg',
            desc: 'Домашняя кухня в профессиональном исполнении. Привычные блюда из натуральных продуктов.',
            perks: ['Уютные блюда', 'Без строгих ограничений', 'Семейные рецепты'],
            prices: [
                { label: 'Пробный',  days: '2 дня',   price: 3500,  perDay: 1750  },
                { label: '1 неделя', days: '5 дней',  price: 7900,  perDay: 1580, discount: 10 },
                { label: '2 недели', days: '10 дней', price: 14300, perDay: 1430, discount: 18, popular: true },
                { label: '1 месяц',  days: '22 дня',  price: 27500, perDay: 1250, discount: 29 },
            ]
        },
    ];
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const goals  = document.querySelectorAll('.prog-goal');
    const panel  = document.querySelector('.prog-panel');
    const photo  = document.getElementById('progPhoto');
    const tag    = document.getElementById('progTag');
    const kcalEl = document.getElementById('progKcal');
    const descEl = document.getElementById('progDesc');
    const perksEl= document.getElementById('progPerks');
    const pricesEl= document.getElementById('progPrices');

    if (!goals.length || !panel) return;

    function fmt(n) {
        return n.toLocaleString('ru-RU') + ' ₽';
    }

    function renderProg(idx) {
        const p = PROG_DATA[idx];
        panel.classList.add('prog-panel--fading');

        setTimeout(() => {
            photo.src = p.photo;
            photo.alt = p.name;
            tag.textContent = p.tag;
            kcalEl.textContent = p.kcal;
            descEl.textContent = p.desc;
            perksEl.innerHTML = p.perks.map(t => `<li>${t}</li>`).join('');

            pricesEl.innerHTML = p.prices.map(pr => `
                <a href="#order" class="price-card${pr.popular ? ' price-card--popular' : ''}">
                    ${pr.popular ? '<span class="price-card-badge">Хит</span>' : ''}
                    <div class="price-card-label">${pr.label}</div>
                    <div class="price-card-days">${pr.days}</div>
                    <div class="price-card-price">${fmt(pr.price)}</div>
                    <div class="price-card-per">${fmt(pr.perDay)} / день</div>
                    ${pr.discount ? `<div class="price-card-discount">-${pr.discount}%</div>` : ''}
                </a>
            `).join('');

            panel.classList.remove('prog-panel--fading');
        }, 220);
    }

    goals.forEach(btn => {
        btn.addEventListener('click', () => {
            goals.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProg(+btn.dataset.prog);
        });
    });

    renderProg(0);
})();
