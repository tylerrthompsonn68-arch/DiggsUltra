# Design rationale (PROVISIONAL, needs owner sign-off before Phase 2)

1. **Palette:** bone parchment `#f1e8d6`, ink `#1c1712`, rust accent `#9e3b1b`, faded sage `#6f7d62`. Dark "night ops" mode swaps to charred leather `#15110d` with an ember rust `#d2683b`. Desert and leather tones, deliberately not Last Soul's scheme.
2. **Type:** Rye (wood-type, wanted-poster display) for the wordmark and headlines only. Inter for everything else. Both are SIL Open Font License (free for commercial use) and self-hosted via `next/font`.
3. **Texture:** one inline SVG paper-grain overlay at 6–8% opacity, plus a light letterpress shadow on headings. No image textures, so there's no performance cost.
4. **Motion:** minimal. Color transitions on hover only, and it respects `prefers-reduced-motion`. Countdowns will be the only "live" motion.
5. **Imagery:** real race photos from Diggs's coverage, high contrast and dusty, with night shots for night-ops moments. No stock photos.

**Still to do:** screenshot lastsoulultra.com and bareperformancenutrition.com in a real browser for reference (CLAUDE.md §4).
