# yOCA Engine

Visual render engine used by the yOCA+ skill (OPENIDEA.biz). Canvas 2D, brand-driven. Formats: carousel, post (4:5), post_square (1:1), story (9:16), flyer_a5, flyer_a4, brochure_a4 (PDF + PNG 300 dpi), video_story, video_post (MP4/WebM).

Usage: load `yoca-engine.min.js` and call `YOCA.render({ brand, slides, options: { format, lang, file } })`.
The brand tokens and slide schema are documented in the yOCA+ skill file `kb-d02-visual-engine.md`.

Each version is pinned to its commit and served by jsDelivr. v1.0:
`https://cdn.jsdelivr.net/gh/openideabiz/yoca-engine@3bb6ba110dbbd1d241a803e60b7ffad31f62e7da/yoca-engine.min.js`

Never point the skill at `@main`: a pinned commit cannot change under a live client.

© OPENIDEA.biz
