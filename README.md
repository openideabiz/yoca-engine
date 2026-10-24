# yOCA Engine

Carousel render engine used by the yOCA+ skill (OPENIDEA.biz). Canvas 2D, 1080×1350 PNG, brand-driven.

Usage: load `yoca-engine.min.js` and call `YOCA.render({ brand, slides, options })`.
The brand tokens and slide schema are documented in the yOCA+ skill file `kb-d02-carousel-engine.md`.

Each version is pinned to its commit and served by jsDelivr. v1.0:
`https://cdn.jsdelivr.net/gh/openideabiz/yoca-engine@3bb6ba110dbbd1d241a803e60b7ffad31f62e7da/yoca-engine.min.js`

Never point the skill at `@main`: a pinned commit cannot change under a live client.

© OPENIDEA.biz
