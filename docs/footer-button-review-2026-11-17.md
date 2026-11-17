# Footer catalog CTA

- Report: the published account page showed a collapsed catalog button with overflowing text.
- The exact collapse did not reproduce in the local version in Safari or Chromium. Replaced the fragile max-content grid / inline-size containment combination with an independent title measure and an explicitly filled button.
- Preserved the desktop hero-title width; added a 224 px minimum width on smaller screens so the label and arrow retain space. The button remains capped by its container.
- Checked shared footer bounds on home, account, cart, catalog, and discovery at 1440, 390, and 320 px. All labels fit, with no page horizontal overflow; button height is at least 56 px.
- Checked the account footer visually in Safari and mobile Chromium; keyboard activation opens the catalog.
- Changes are local, not published.
