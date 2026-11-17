# Decorative link stroke

The category footer link was a full-width block with native underlining. Its shared rotated pseudo-element consequently stretched across the category list and crossed the text.

The category link now sizes to its content, centers in the list, and uses only the decorative stroke. The shared stroke is capped at 180 px so stretching a link for layout cannot produce a page-wide diagonal. Hover/focus expansion remains within this cap.

Checked category link visually at 1440 and 390 px, including keyboard navigation. Link width is 158 px, target height 44 px, and the stroke sits below its label. The same CategoryLinks component handles all three games. Shared text-link consumers reviewed in source: account, cart, quick view, and blind-choice controls.

Local change, not published. CSS diff whitespace validation passed.
