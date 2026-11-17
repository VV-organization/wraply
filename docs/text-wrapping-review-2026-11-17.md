# Text wrapping audit

Removed all three manual `br` elements from application components:
- Account profile: `Steam ID: Не подключён` flows in one line.
- Steam top-up explanation: natural wrapping, with the arbitrary 320 px text measure replaced by a readable 65ch maximum within its panel.
- Shared missing-image fallback: natural wrapping in catalog, detail, quick view and other image placements.

Also replaced the long-price currency's forced second line with a wrapping flex row. The amount and currency share a baseline when they fit. Widened the mobile cover CTA to at least 224 px so “Открыть каталог” stays on one line.

Retained meaningful hierarchy: weapon model versus finish in product titles, field labels above values, primary price versus its ruble conversion, and the established two-level cover heading. These are semantic or grid divisions, not arbitrary text breaks.

Browser checks: account status at desktop and 320 px (18 px line box, no overflow); Steam explanation desktop/mobile; long Rust price (5 658 367,63 Wraps) at desktop/mobile. Mobile cover label checked separately. No data, prices, or purchase conditions changed. Missing-image fallback checked in source; no network failure was induced.

The general rule was successfully written to project AGENTS.md and ~/.codex/AGENTS.md. Changes remain local.
