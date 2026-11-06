# yOCA Engine

Visual render engine used by the yOCA+ skill (OPENIDEA.biz). Canvas 2D, brand-driven. Formats: carousel, post (4:5), post_square (1:1), story (9:16), flyer_a5, flyer_a4, brochure_a4 (PDF + PNG 300 dpi), video_story, video_post (MP4/WebM).

Usage: load `yoca-engine.min.js` and call `YOCA.render({ brand, slides, options: { format, lang, file } })`.
The brand tokens and slide schema are documented in the yOCA+ skill file `kb-d02-visual-engine.md`.

Each version is pinned to its commit and served by jsDelivr. v1.0:
`https://cdn.jsdelivr.net/gh/openideabiz/yoca-engine@3bb6ba110dbbd1d241a803e60b7ffad31f62e7da/yoca-engine.min.js`

Never point the skill at `@main`: a pinned commit cannot change under a live client.

## Changes

v2.3.0 (composition rules, backward compatible for carousels, posts and stories):
- `brand.type_ratio` (optional, 1.15 to 1.8): role sizes follow one modular scale from the body size. `type_scale` still wins per role. Default 0 keeps the fixed sizes.
- `page` layout: a `heading` section is bound to the section it introduces (Gestalt proximity), in every format.
- Print formats (flyer, brochure pages): one steady rhythm from the top; a closing button, logo or note is anchored at the end of the reading path. `cta` pages keep the even layout.
- New yellow QA lines: more than one isolated emphasis per view, more than one button, lists over 4 items (6 in print), flows over 4 steps, too many sections on one card or page.

© OPENIDEA.biz

## Brand assets

`assets/brands/<brand>/` holds public logo files that brand tokens load through jsDelivr (pinned commit), because the engine needs CORS-enabled image URLs. Only assets the brand owns and already publishes may go here (logos, own icons, own portraits). Never third-party licensed artwork such as stock illustration packs: those stay in the brand's private skill. Brand assets are not covered by the engine license; all rights stay with their owners.
