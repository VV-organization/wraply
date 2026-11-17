# Wraply: poster catalog, 17 November 2026

User direction: «Постеры в стиле Wraply». The approved home-page identity extends to catalog and product details. This is a scoped replacement of the generic shop grid, not a new site theme.

## Changes

- Colored artwork fields, cream mounting border and captions; large title and item image; explicit inspect and purchase actions.
- Stable finish-based color across list, quick preview and full detail. Color is decorative, not rarity data.
- Compact left-aligned catalog introduction and equal game controls with an unambiguous selected state.
- “Выбор Wraply” default: existing snapshot products curated separately for all three games. Explicit price/name sorting remains available; no products or price facts removed.
- Full detail: large mounted artwork beside specification/purchase, stacked on small screens. Native-dialog preview uses the same composition.
- Normalized Steam image variant in preview and inspection to match the larger catalog render.

## Observed verification

Browser via CUA, local development and static production preview:

- Desktop catalog and quick/full CS2 detail; 1100×800 two-column Rust grid with 5,658,367.63 Wraps price; no card overflow or overlapping action.
- 390×844 catalog and TF2 quick preview; 320×700 Rust catalog and direct add. Body widths equal scroll widths (375 and 305 respectively, after browser scrollbar).
- CS2 quick add → notice inside native dialog → notice cart link → one matching item after reload; primary action becomes a cart link.
- Rust direct card add → bottom notice → cart contains both distinct items. Test items removed afterward from the development origin. Pre-existing seven items on static-preview origin left intact.
- Product-title link opens the correct full reference page; keyboard zoom advances to 110%; Escape dismisses mobile quick view.
- Explicit descending price option reorders the entire Rust catalog and remains visibly selected.
- Source review checked shared related cards on native/reference details, fallback artwork, reduced motion, links, favorites and duplicate-prevention pipeline.

Technical: 50 tests passed, ESLint, TypeScript and GitHub Pages static build passed (104 pages). Impeccable detector returned no findings on changed UI targets. Browser review is agent-operated, not independent user research.

Limitations: full screen-reader use and every item/category combination were not tested. No money-moving providers were added. Changes are local, not pushed/published.

Impeccable context reports the pre-existing legacy PRODUCT.md schema. No migration was performed as part of this design task; `init` owns that optional update.

Independent finish reviewer: **ship** after inspecting the local production preview in Chrome at 1440×1000 and 390×844. Checked CS2, Rust, TF2 posters, desktop/mobile quick view, Escape/focus return and internal dialog scroll. No material clipping, overlap or horizontal overflow found within that scope. No cart/favorite mutations performed by reviewer.

Measured text contrasts: white on blue 7.84:1, plum 6.37:1, pink 5.71:1, teal 6.89:1; secondary ink on paper 6.19:1. These are token-pair measurements, not a whole-site accessibility certification.
