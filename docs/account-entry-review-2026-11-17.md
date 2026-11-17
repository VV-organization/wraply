# Account entry layout

The guest screen used disconnected grid cells: a Steam icon in the first row, a large two-line title, bottom-aligned copy in the other column, and a separate button row. The absolute W did not participate in that grid.

Replaced this with one 760 px reading column: title, description, primary action, local-storage note. Shared left edge; 24 px from heading to copy, 32 px to the action, 16 px to its note. Removed the decorative W and misleading Steam sign-in symbol. Preserved the existing local-profile flow and button motion.

Removed obsolete guest rules and breakpoint overrides instead of stacking additional overrides. The guest title has its own scale, separate from catalog display headings.

Verification:
- Chromium at 1440 px: title, description, button and note share x=333 px; button is 280 px wide.
- At 320 px: all share x=16 px; content/button width 273 px, button height 44 px, no horizontal overflow.
- At 390 px: checked authenticated overview, purchases empty state, balance tab; no horizontal overflow.
- Exercised open → local-profile confirmation → overview → purchases → balance → overview → logout confirmation → guest. No trade URL, cart, or payment data changed.
- Independent source/layout assessment agreed with the one-column direction. Impeccable layout detector returned no findings. This is not independent user usability testing.
- Local change; not committed or published.
