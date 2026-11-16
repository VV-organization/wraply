# Тёмная тема Wraply

| Назначение | Цвет |
| --- | --- |
| Фон, включая меню и подвал | #101010 |
| Карточки, формы и панели | #191919 |
| Приподнятые элементы | #242424 |
| Основной текст и названия | #F4F4F4 |
| Вспомогательный текст | #ABABAB |
| Основные кнопки и рисованный штрих | #0038FF |
| Текст активных элементов на тёмном фоне | #9AAEFF |
| Клавиатурный фокус | #A5B8FF |
| Розовый цвет подборки и разделителя сравнения | #FF77CD |
| Оранжевый цвет медной подборки | #FF722C |

Палитра использует тёмные фоны Featured и Footer на Extrafazant. Синий работает как заливка под белой подписью. Контраст этой пары с текстом #F4F4F4 составляет 6,98 к 1. На мелких надписях поверх графита используется светлый синий.

| Композиция в референсе | Применение в Wraply |
| --- | --- |
| Центрированный заголовок, плотные прописные буквы и антиква | Обложка с Inter. Контраст начертаний 600 и 400 |
| Медиа у курсора и повёрнутые фотокарточки intro | Четыре постера с настоящими скинами. На телефоне доступны касанием |
| Ссылка с рисованной линией и стрелкой в синем квадрате | Переход в каталог, штрихи навигации и ссылки категорий |
| Полоса логотипов | Три прямые ссылки в каталоги игр |
| Recent Werk и стопка цветных постеров | Переключение пар покрытий и замена предмета |
| Wat we Doen, строки с изображениями | Переходы в категории CS2, Rust и TF2 |
| Крупный набор в тёмном футере | Возврат в каталог и навигация по магазину |

Фильтры, карточки, корзина и расчёты используют структуру предыдущих магазинов. Анимации шрифта и постеров учитывают prefers-reduced-motion. Источник композиций и цветовых образцов — [Extrafazant](https://www.extrafazant.nl/).

Типографика использует локальный Inter Variable с кириллицей и знаком рубля. Основной текст — 400, названия и цены — 500–550, заголовки и кнопки — 600. Заголовки и кнопки сохраняют обычный регистр, трекинг заголовков −0,035em, числовые поля используют табличные цифры.

Витринные изображения подобраны отдельно для Wraply. 28 покрытий CS2 и 16 предметов Rust/TF2 используют локальные файлы в public/art-direction. Идентификаторы выбранных предметов, категории и пути изображений хранятся в src/data/showcase-art.json. Новые покрытия CS2 сохраняют цены и дату исходного снимка в src/data/showcase-products.json. Основная подборка открывается на розово-фиолетовом «Градиенте», начальные наборы обложки, категорий, сравнения и конструктора различаются.

### Comparison render sources (2026-11-16)
The default Black Lotus and Decimator artwork uses full-size CS.MONEY finish-reference renders (1646×456 and 1665×450), rather than enlarged 512×384 Steam inventory thumbnails. These are illustrative finish references, not images of a particular live inventory asset or a guarantee of its Float. Product prices/conditions remain sourced from the existing snapshot.

- https://wiki.cs.money/weapons/m4a1-s/black-lotus — https://s-wiki.cs.money/data/float-preview/m4a1-s-black-lotus/m4a1-s-black-lotus-large-ft-345230024efe.webp
- https://wiki.cs.money/weapons/m4a1-s/decimator — https://s-wiki.cs.money/data/float-preview/m4a1-s-decimator/m4a1-s-decimator-large-ft-c00329498061.webp

Original renders live in `public/comparison-sources`; `node scripts/prepare-comparison-assets.mjs` rebuilds the aligned, lossless WebP assets. AI regeneration was attempted but rejected by the image service; no AI-redrawn replacement is shipped.
