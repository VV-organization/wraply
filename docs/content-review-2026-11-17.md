# Storefront content review

Scope: shared cards, product pages, quick view, catalog filters/categories, account, cart, top-ups, FAQ, and inspection controls. Checked source text across src/components and src/app; official product names are preserved.

- Replaced implementation language with customer-facing copy: snapshot → dated price data, local profile → my profile, disconnected wallet → unavailable balance. Removed redundant WRAPLY / ВЫБОР and WRAPLY / ДЕТАЛИ labels.
- Centralized Russian category display labels, including every category in all three inventory snapshots. Applied to catalog selectors, category rows, product captions/details, inspection, cart and other weapon-label placements.
- Empty descriptions do not produce filler paragraphs. Quick views are keyed by product ID so a previous item's description cannot remain visible when switching products.
- Kept truthful availability, payment, Steam authorization, storage and dated-price notices. These are product limitations, not demonstration labels; no fictional live inventory, payment or delivery functionality was added.
- CS2 description audit: all nonempty source descriptions include Russian text. Rust and TF2 descriptions are localized separately while preserving the original mechanics and supplied facts.

Source check: https://steamcommunity.com/market/listings/252490/Rainbow%20Door confirms that Rainbow Door is a Sheet Metal Door skin, applied during crafting, and breaks down into one Wood. Its previous English text was source content, not an invented placeholder.

No prices, item IDs, or purchase terms were changed. Changes remain local, not committed or published.

Verification so far:
- Rust: 5,019 description records localized; automated scan finds no nonempty description without Cyrillic. Manually checked Rainbow Door on desktop/mobile and its quick view.
- CS2: 756 English wear suffixes are now parsed into Russian condition attributes rather than included in finish titles. Added regression coverage.
- 53 tests passed, including all-category localization coverage and wear parsing. Lint passed before the final data-only localization batch.
- TF2: all 198 unique nonempty descriptions translated across 276 items; 352 originally empty records remain empty rather than receiving invented filler. Proper collection, key and creator names remain recognizable.
- Final scan over CS2/Rust/TF2: no nonempty English-only descriptions. No lorem ipsum/demo-placeholder descriptions found.
- Final browser checks: Rainbow Door full page and quick view, mobile Rust detail, TF2 Skullcracker instructions/category. Automated coverage checks do not replace manual review of every catalog item.
- Final validation: 53 tests, lint, static Pages build, diff whitespace check.
