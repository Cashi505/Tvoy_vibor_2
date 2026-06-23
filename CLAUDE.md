# CLAUDE.md — Контекст проекта «Твой Выбор»

Этот файл даёт Claude Code полный контекст для продолжения работы над сайтом.

---

## Что это за проект

Лендинг **«Твой Выбор»** — доставка правильного питания в Сургуте и Нефтеюганске (vibiraiedu.ru).
Статический сайт: чистый HTML + CSS + JS, без фреймворков, без сборщиков, без npm.
Открывается двойным кликом на `index.html`.

---

## Стек и архитектура

- **HTML:** `index.html` — вся разметка, один файл
- **CSS:** `style.css` — дизайн-токены в `:root`, потом компонентные блоки, потом `@media`, потом `/* PREMIUM LAYER */` (фиксы светлой темы), потом блок новых компонентов
- **JS:** `script.js` — без библиотек. IntersectionObserver, FAQ-аккордеон, калькулятор КБЖУ, custom cursor, scroll progress bar, hero parallax, mobile sticky CTA
- **Шрифты:** Google Fonts CDN — Cormorant Garamond (заголовки) + Jost (текст)
- **Видео:** `video-hero.webm` (VP9) + `video-hero.mp4` (H.264). Постер: `video-hero-poster.jpg`.

---

## Дизайн-система (CSS custom properties) — Вариант 5 (светлый, ТЕКУЩИЙ)

```css
--bg-dark:       #FFFFFF    /* основной фон страницы */
--bg-section:    #BBE9CA    /* фон секций (насыщенный мятный) */
--bg-card:       #FFFFFF    /* фон карточек */
--bg-card-hover: #EEF9F3
--gold:          #2FC86E    /* акцент — используется как "gold" */
--gold-light:    #42D47E
--gold-dim:      rgba(47,200,110,0.16)
--green:         #24B462    /* основной зелёный — кнопки, иконки */
--green-light:   #2FC86E
--text-primary:  #0E1B12    /* основной текст (почти чёрный) */
--text-secondary:#1C3828    /* вторичный текст */
--text-muted:    #4D7A5F    /* приглушённый */
--border:        rgba(0,0,0,0.12)
--border-gold:   rgba(47,200,110,0.38)
--font-display:  'Cormorant Garamond', Georgia, serif
--font-body:     'Jost', system-ui, sans-serif
--size-hero:     clamp(3rem, 7vw, 6.5rem)
--size-h2:       clamp(2rem, 5vw, 3.8rem)
--radius:        12px
--radius-lg:     20px
--ease:          cubic-bezier(0.16, 1, 0.3, 1)
--transition:    0.5s var(--ease)
--container:     1200px
```

**PREMIUM LAYER** (строки ~2040–2090 в style.css) — фиксы для светлой темы:
- Все карточки (`program-card`, `step`, `calc-form`, `contact-item`) переведены на solid `#FFFFFF` без `backdrop-filter`
- Contact icons: `background: var(--green); color: #FFFFFF` (иначе invisible на mint)
- Inputs: `background: #FFFFFF` (иначе mint-on-mint)
- em-text на mint секциях: принудительный сброс `background: none; -webkit-text-fill-color: #0C5C32`

---

## Структура файлов

```
Еда 2/
├── index.html
├── style.css
├── script.js
├── CLAUDE.md                   ← этот файл
├── video-hero.webm             ← фоновое видео (VP9)
├── video-hero.mp4              ← фоновое видео (H.264, faststart)
├── video-hero-poster.jpg       ← постер кадр
├── Tuna_salad_ingredients_pack_cont…_202606191820.mp4  ← оригинал (резерв)
├── images/
│   ├── logo.png                ← логотип
│   └── menu/
│       ├── tuna-salad.jpeg     → программа «Похудение» (900 ккал)
│       ├── oatmeal-berries.jpeg→ программа «Поддержание» (1200 ккал)
│       ├── chicken-breast.jpeg → программа «Сбалансированное» (1800 ккал, featured)
│       ├── beef-steak.jpeg     → программа «Набор массы» (2500 ккал)
│       ├── chicken-soup.jpeg   → программа «Как дома» (3000 ккал)
│       └── protein-box.jpeg    → галерея меню
└── massagers/
    ├── max.png
    └── telegram.png
```

---

## Секции сайта (порядок в index.html)

1. `<div class="scroll-progress" id="scrollProgress">` — прогресс-бар прокрутки (фиксированный)
2. `<header id="header">` — логотип, навигация, кнопка «Заказать», бургер
3. `<section class="hero" id="hero">` — видео-фон, заголовок, 2 CTA
4. `<div class="ticker">` — бегущая строка
5. `<section class="stats" id="stats">` — 4 счётчика: 200+ блюд / 500+ клиентов / 2кг / 100%
6. `<section class="about" id="about">` — 2 колонки: текст + 4 фичи
7. `<div class="mono-strip">` — тёмная полоска с 4 монументальными числами (не section, нет id)
8. `<section class="how" id="how">` — вертикальный flow из 3 шагов (`.step-flow-item`)
9. `<section class="programs" id="programs">` — 5 карточек с фото (`.program-card-photo`)
10. `<section class="results" id="results">` — 3 карточки отзывов + trust-bar (добавлено)
11. `<section class="calculator" id="calculator">` — калькулятор КБЖУ
12. `<section class="sched-section" id="menu">` — галерея блюд + еженедельное расписание
13. `<section class="faq" id="faq">` — 6 вопросов с номерами (01–06), аккордеон
14. `<section class="contacts" id="contacts">` — адрес, телефон, почта, мессенджеры
15. `<section class="cta-section" id="order">` — форма заявки
16. `<footer class="footer">` — 4 колонки
17. `<div class="mobile-cta-bar" id="mobileCta">` — sticky мобильная кнопка
18. `<div class="cursor-dot" id="cursorDot">` + `<div class="cursor-ring" id="cursorRing">` — кастомный курсор

---

## Как работают ключевые механики

### Scroll progress bar
`#scrollProgress` — тонкая зелёная полоска сверху. JS обновляет `width` через `scroll` event.

### Custom cursor
Только на `(hover: hover) and (pointer: fine)` устройствах. Dot следует мгновенно, ring с инерцией 13% через `requestAnimationFrame`. Ring увеличивается на hover-элементах.

### Hero video parallax
`translateY(scrollY * 0.28) scale(1.05)` — применяется к `#heroVideo` через `scroll` listener.

### Reveal-анимации
Классы `.reveal-up`, `.reveal-fade`, `.reveal-left`, `.reveal-right` — IntersectionObserver добавляет `.visible` → CSS-переход.

### Programs — карточки с фото
Каждая карточка: `.program-card > .program-card-photo > img` + `.program-card-overlay` + `.program-card-body`. Фото 16:9, zoom при hover. Цветной border-left акцент (разные оттенки зелёного). Мобиль: горизонтальный scroll-snap карусель.

### FAQ аккордеон
CSS `grid-template-rows: 0fr → 1fr` (Safari 16+). JS fallback через `scrollHeight` для Safari < 16.
Вопросы имеют `.faq-q-num` (01–06) — зелёные номера слева.

### Mobile sticky CTA
`#mobileCta` появляется когда `#hero` уходит из viewport, исчезает у `#order`. IntersectionObserver + кнопка закрыть.

### Kalькулятор калорий
Формула Миффлина-Сан Жеора. Сравнивает с порогами 1050/1400/2100/2750 для подбора программы.

### Еженедельное расписание
JS-IIFE. Данные: `BASE[6][4]` × `PROGRAMS[5].scale`. Google Sheets CSV (не работает на file://).

---

## Известные placeholder-данные (заменить на реальные)

| Место | Текущее | Нужно |
|-------|---------|-------|
| Телефон | `+7 (900) 000-00-00` | Реальный |
| `tel:` href | `tel:+79000000000` | Реальный |
| Адрес Сургут | `Сургут, ул. Энергетиков, 28` | Реальный |
| Адрес Нефтеюганск | `Нефтеюганск, мкр. 16, 2` | Реальный |
| Ссылка Max | `href="#"` | Реальная |
| Telegram | `https://t.me/vibiraiedu` | Реальный username |
| Почта | `info@vibiraiedu.ru` | Реальная |

---

## Браузерная совместимость

Safari фиксы применены:
- `min-height: 100svh` + fallback `100vh`
- `top/right/bottom/left: 0` вместо `inset: 0`
- `-webkit-backdrop-filter` везде рядом с `backdrop-filter`
- FAQ JS-fallback для Safari < 16

---

## Правила стиля

- **Нет emoji** в UI — только SVG или PNG иконки
- **Нет scroll cues** (стрелок "прокрутите вниз")
- **`--text-muted`** (#4D7A5F) — только для декора, не для читаемого текста
- **Каждая секция** визуально отличается от соседних
- **Изображения** — только реальные фото из `images/menu/`

---

## Что можно улучшить / продолжить

- Подключить реальную отправку формы (сейчас меняет текст кнопки)
- Заменить placeholder-данные на реальные (телефон, адреса, мессенджеры)
- Добавить Яндекс.Карты iframe в блок контактов
- SEO: `<meta description>`, `og:image`, `og:title`
- Добавить страницу с полным меню и фильтрацией
