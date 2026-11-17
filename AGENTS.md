<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Layout verification
- Keep marketing sections within one viewport and share outer-spacing tokens. Fill available space with the working content, rather than only increasing section height. Verify child bounds and expanded states at desktop and mobile sizes; long result lists and FAQ answers must remain reachable within their section.

- After shared typography or target-size changes, inspect computed styles at the smallest breakpoint: a more specific mobile selector can silently restore tiny labels or hit areas. Short viewports must keep all controls reachable inside their section.
